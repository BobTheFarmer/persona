import session from "express-session";
import connectPg from "connect-pg-simple";
import type { Express, RequestHandler } from "express";
import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, pool } from "../../db";
import { users, authCredentials } from "@shared/models/auth";
import { hashPassword, verifyPassword } from "./password";

declare global {
  namespace Express {
    interface User { claims: { sub: string }; }
    interface Request { user?: User; }
  }
}

declare module "express-session" {
  interface SessionData { userId?: string; }
}

export function getSession() {
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32) {
    throw new Error("SESSION_SECRET must contain at least 32 random characters");
  }
  const PgStore = connectPg(session);
  return session({
    name: "persona.sid",
    secret: process.env.SESSION_SECRET,
    store: new PgStore({ pool, createTableIfMissing: true, ttl: 7 * 24 * 60 * 60, tableName: "sessions" }),
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 7 * 24 * 60 * 60 * 1000 },
  });
}

const attempts = new Map<string, { count: number; until: number }>();
const limitAuth: RequestHandler = (req, res, next) => {
  const now = Date.now();
  attempts.forEach((entry, key) => { if (entry.until <= now) attempts.delete(key); });
  const key = req.ip ?? "unknown";
  const entry = attempts.get(key) ?? { count: 0, until: now + 15 * 60 * 1000 };
  if (entry.count >= 15 || (!attempts.has(key) && attempts.size >= 10000)) {
    res.setHeader("Retry-After", "900");
    return res.status(429).send("Too many attempts. Please try again in 15 minutes.");
  }
  entry.count++;
  attempts.set(key, entry);
  next();
};

const credentials = z.object({
  email: z.string().trim().email().max(254).transform(value => value.toLowerCase()),
  password: z.string().min(12).max(128),
  firstName: z.string().trim().max(60).optional(),
});

function loginPage(error = "") {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Sign in · Persona</title><style>body{background:#111111;color:#f8fafc;font:16px system-ui;margin:0;display:grid;min-height:100vh;place-items:center}main{width:min(360px,85vw);padding:32px;background:#181818;border-radius:8px}h1{margin-top:0}label{display:block;margin:16px 0 6px}input,button{box-sizing:border-box;width:100%;padding:12px;border-radius:8px;border:1px solid #64748b;font:inherit}button{margin-top:16px;cursor:pointer;background:#22c55e;color:#111827;font-weight:600}a{color:#22c55e}small{display:block;margin-top:14px;color:#cbd5e1}.error{color:#fda4af}</style></head><body><main><a href="/">← Persona</a><h1>Sign in to Persona</h1>${error ? `<p class="error" role="alert">${error}</p>` : ""}<form method="post" action="/api/auth/login"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" required maxlength="254"><label for="password">Password</label><input id="password" name="password" type="password" autocomplete="current-password" minlength="12" maxlength="128" required><label for="firstName">First name (new accounts only)</label><input id="firstName" name="firstName" autocomplete="given-name" maxlength="60"><button type="submit">Sign in</button><button type="submit" formaction="/api/auth/register">Create account</button><small>Use at least 12 characters.</small></form></main></body></html>`;
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  // Reject cross-origin writes, including login CSRF. Non-browser clients may omit Origin.
  app.use((req, res, next) => {
    if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
      const origin = req.headers.origin;
      if ((origin && origin !== `${req.protocol}://${req.get("host")}`) || req.headers["sec-fetch-site"] === "cross-site") {
        return res.status(403).json({ message: "Cross-origin requests are not allowed" });
      }
    }
    next();
  });
  app.get("/api/login", (_req, res) => res.set("Cache-Control", "no-store").type("html").send(loginPage()));
  for (const mode of ["login", "register"] as const) {
    app.post(`/api/auth/${mode}`, limitAuth, async (req, res, next) => {
      try {
        const parsed = credentials.safeParse(req.body);
        if (!parsed.success) return res.status(400).type("html").send(loginPage("Enter a valid email and a password of 12–128 characters."));
        const { email, password, firstName } = parsed.data;
        let userId: string;
        if (mode === "register") {
          userId = randomUUID();
          const passwordHash = await hashPassword(password);
          try {
            await db.transaction(async tx => {
              await tx.insert(users).values({ id: userId, email, firstName: firstName || "Student" });
              await tx.insert(authCredentials).values({ userId, passwordHash });
            });
          } catch (error: any) {
            if (error.code === "23505" || error.cause?.code === "23505") return res.status(400).type("html").send(loginPage("Unable to create that account. Try signing in or use another email."));
            throw error;
          }
        } else {
          const [account] = await db.select({ id: users.id, hash: authCredentials.passwordHash }).from(users).innerJoin(authCredentials, eq(users.id, authCredentials.userId)).where(eq(users.email, email)).limit(1);
          // Always perform a password derivation, even when the account is absent.
          const dummy = `scrypt:${"0".repeat(32)}:${"0".repeat(128)}`;
          const valid = await verifyPassword(password, account?.hash ?? dummy);
          if (!account || !valid) return res.status(401).type("html").send(loginPage("Email or password is incorrect."));
          userId = account.id;
        }
        req.session.regenerate(error => {
          if (error) return next(error);
          req.session.userId = userId;
          req.session.save(error => error ? next(error) : res.redirect(303, "/"));
        });
      } catch (error) { next(error); }
    });
  }
  app.get("/api/logout", (req, res, next) => {
    req.session.destroy(error => {
      if (error) return next(error);
      res.clearCookie("persona.sid");
      res.redirect("/");
    });
  });
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.session?.userId) return res.status(401).json({ message: "Unauthorized" });
  req.user = { claims: { sub: req.session.userId } } as Express.User;
  next();
};
