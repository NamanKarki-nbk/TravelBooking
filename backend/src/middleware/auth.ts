import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// ✅ Middleware to authenticate users with JWT
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" }); // ✅ Do NOT return
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: string;
    };
    req.user = decoded; // ✅ Attach user object to request
    next(); // ✅ Pass control to next middleware
  } catch (error) {
    res.status(401).json({ message: "Invalid token" }); // ✅ Do NOT return
  }
};
