/**
 * Auth controller for Online Reminder System
 * Handles signup and login logic.
 */
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.warn(`[Auth] Signup attempt with existing email: ${email}`);
      return res.status(400).json({ message: 'Email already registered.' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ email, passwordHash, name });
    await user.save();
    console.log(`[Auth] User registered: ${email}`);
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('[Auth] Signup failed:', error);
    res.status(500).json({ message: 'Signup failed.', error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      console.warn(`[Auth] Login failed for non-existent email: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      console.warn(`[Auth] Login failed for email: ${email} (wrong password)`);
      return res.status(400).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
    console.log(`[Auth] User logged in: ${email}`);
    res.json({ token, user: { email: user.email, name: user.name } });
  } catch (error) {
    console.error('[Auth] Login failed:', error);
    res.status(500).json({ message: 'Login failed.', error });
  }
};
