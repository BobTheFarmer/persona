import type { Express } from "express";
import { authStorage } from "./storage";
import { isAuthenticated } from "./replitAuth";

function demoAuthMiddleware(req: any, res: any, next: any) {
  if (process.env.DEMO_BYPASS_AUTH === "true") {
    if (!req.user) {
      req.user = { claims: { sub: "49486139" } };
    }
    return next();
  }
  return isAuthenticated(req, res, next);
}

export function registerAuthRoutes(app: Express): void {
  app.get("/api/auth/user", demoAuthMiddleware, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      let user = await authStorage.getUser(userId);
      if (!user && process.env.DEMO_BYPASS_AUTH === "true") {
        user = await authStorage.upsertUser({
          id: userId,
          email: "demo@tamu.edu",
          firstName: "Garv",
          lastName: "Shah",
          profileImageUrl: null,
        });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
}
