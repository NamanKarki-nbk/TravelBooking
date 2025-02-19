import express, { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authenticate, AuthRequest } from "../middleware/auth.js";

const router = Router();

// ✅ Register User (Default Role: "USER")
router.post("/register", async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password } = req.body;

    // ✅ Check if email is unique
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });
    await newUser.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// ✅ First Admin Registration (Allowed Without Token)
router.post(
  "/register-admin",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { name, email, password } = req.body;

      // ✅ Check if an admin already exists
      const existingAdmin = await User.findOne({ role: "admin" }).exec();

      // ✅ If an admin exists, forbid direct registration without authentication
      if (existingAdmin) {
        return res.status(403).json({
          message: "Forbidden: Only existing admins can create new admins",
        });
      }

      // ✅ Ensure email is unique
      const existingUser = await User.findOne({ email }).exec();
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // ✅ Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // ✅ Create new admin
      const newAdmin = new User({
        name,
        email,
        password: hashedPassword,
        role: "admin",
      });
      await newAdmin.save();

      return res
        .status(201)
        .json({ message: "First admin registered successfully" });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
);

// ✅ Register Additional Admins (Requires Admin Token)
router.post(
  "/register-secure-admin",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<any> => {
    try {
      const { name, email, password } = req.body;

      // ✅ Ensure only existing admins can create new admins
      if (!req.user || req.user.role !== "admin") {
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
      const hashedPassword = await bcrypt.hash(password, 10);

      // ✅ Create new admin
      const newAdmin = new User({
        name,
        email,
        password: hashedPassword,
        role: "admin",
      });
      await newAdmin.save();

      return res.status(201).json({ message: "Admin registered successfully" });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
);

// ✅ Login User (For Users & Admins)
router.post("/login", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    // ✅ Check if user exists
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return res.json({ token });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;
