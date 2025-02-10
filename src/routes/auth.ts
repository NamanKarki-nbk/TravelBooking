import express, { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // ✅ Removed .js

const router = Router();

// ✅ Register User with enforced input types
router.post("/register", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // ✅ TypeScript ensures the return type of hashing is a string
  const hashedPassword: string = await bcrypt.hash(password, 10);

  try {
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Login with TypeScript-enforced types

router.post("/login", async (req: Request, res: Response) => {
  //ya Promise<any> rakhyo vane return type can be used with res.status or res.json
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).exec(); // ✅ Ensures proper return type
    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    if (!user.password || typeof user.password !== "string") {
      res.status(500).json({ message: "Invalid user data" });
      return;
    }

    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token: string = jwt.sign(
      { id: user._id, role: user.role || "USER" },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
