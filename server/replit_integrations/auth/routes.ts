import type { Express } from "express";
import { authStorage } from "./storage";
import { isAuthenticated } from "./replitAuth";

export function registerAuthRoutes(app: Express): void {
  app.get("/api/auth/user", isAuthenticated, async (req: any, res, next) => {
    try {
      const user = await authStorage.getUser(req.user.claims.sub);
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      res.set("Cache-Control", "no-store").json(user);
    } catch (error) { next(error); }
  });
}
