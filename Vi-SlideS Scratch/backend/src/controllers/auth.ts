import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";

const ROLES = ["teacher", "student"] as const;

// REGISTER
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (!email || !String(email).trim()) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!password || String(password).length < 6) {
      return res.status(400).json({
        message: "Password is required (min 6 characters)",
      });
    }
    if (!role || !ROLES.includes(role)) {
      return res.status(400).json({ message: "Valid role is required (teacher or student)" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      password: hashed,
      role,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!);

    return res.status(201).json({ user, token });
  } catch (error: unknown) {
    const code = (error as { code?: number })?.code;
    if (code === 11000) {
      return res.status(400).json({ message: "Email already registered" });
    }
    return res.status(500).json({ message: "Registration failed" });
  }
};

// LOGIN
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !String(email).trim()) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }
    if (!role || !ROLES.includes(role)) {
      return res.status(400).json({ message: "Role is required (teacher or student)" });
    }

    const user = await User.findOne({ email: String(email).trim().toLowerCase() });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.password) {
      return res.status(400).json({ message: "Password not set" });
    }

    if (user.role !== role) {
      return res.status(400).json({
        message: "Selected role does not match this account. Use the correct role or register a new account.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!);

    return res.json({ user, token });
  } catch (_error) {
    return res.status(500).json({ message: "Sign in failed" });
  }
};
