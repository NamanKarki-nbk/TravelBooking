import express, { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = Router();

// ✅ Register User with Role-Based Handling (Default: "USER")
router.post("/register", async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password, role } = req.body;

    // ✅ Ensure unique email
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Hash the password before saving
    const hashedPassword: string = await bcrypt.hash(password, 10);

    // ✅ Default all new users to "USER", unless an admin is creating an "ADMIN" account
    let userRole = "USER";
    if (role === "ADMIN") {
      return res.status(403).json({
        message: "Forbidden: Only admins can create admin accounts",
      });
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ✅ Admin Creating Another Admin (Protected Route)
router.post(
  "/register-admin",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { name, email, password, role } = req.body;

      // ✅ Ensure only existing admins can create new admins
      if (!req.user || req.user.role !== "ADMIN") {
        return res.status(403).json({
          message: "Forbidden: Only admins can create admin accounts",
        });
      }

      // ✅ Ensure email is unique
      const existingUser = await User.findOne({ email }).exec();
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // ✅ Hash password
      const hashedPassword: string = await bcrypt.hash(password, 10);

      const newAdmin = new User({
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
      });
      await newAdmin.save();

      return res.status(201).json({ message: "Admin registered successfully" });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
);

// ✅ Login User
router.post("/login", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    // ✅ Check if user exists
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // ✅ Ensure password exists & is valid
    if (!user.password || typeof user.password !== "string") {
      return res.status(500).json({ message: "Invalid user data" });
    }

    // ✅ Compare password
    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Generate JWT Token
    const token: string = jwt.sign(
      { id: user._id, role: user.role || "USER" },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return res.json({ token });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
