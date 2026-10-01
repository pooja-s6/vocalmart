import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { users } from '../data/store';

const JWT_SECRET = process.env.JWT_SECRET || 'replace_with_secret';

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const existing = users.find((u) => u.email === email);
    if (existing) return res.status(400).json({ success: false, message: 'Email in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = { id: jwt.sign({ email }, JWT_SECRET).slice(0, 36), name, email, password: hashed, role: 'user' };
    users.push(user);
    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ success: true, message: 'Registered', data: { token } });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = users.find((u) => u.email === email);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ success: true, message: 'Logged in', data: { token } });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
