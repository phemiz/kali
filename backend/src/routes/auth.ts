import { Router, Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { runQuery } from '../utils/db';

const router = Router();

const signupSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7).max(20).optional().or(z.literal('')),
  password: z.string().min(6)
});

router.post('/signup', async (req: Request, res: Response) => {
  const parse = signupSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { full_name, email, phone, password } = parse.data;
  const existing = await runQuery<{ id: string }>('SELECT id FROM users WHERE email=$1', [email]);
  if (existing.length > 0) return res.status(409).json({ error: 'Email already registered' });
  const hash = await bcrypt.hash(password, 10);
  const inserted = await runQuery<{ id: string; email: string; full_name: string }>(
    'INSERT INTO users (full_name, email, phone, password_hash) VALUES ($1,$2,$3,$4) RETURNING id, email, full_name',
    [full_name, email, phone || null, hash]
  );
  const user = inserted[0];
  const token = signJwt(user.id, user.email, user.full_name);
  res.status(201).json({ token, user });
});

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

router.post('/login', async (req: Request, res: Response) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const { email, password } = parse.data;
  const rows = await runQuery<{ id: string; email: string; full_name: string; password_hash: string }>(
    'SELECT id, email, full_name, password_hash FROM users WHERE email=$1',
    [email]
  );
  if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
  const user = rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signJwt(user.id, user.email, user.full_name);
  res.json({ token, user: { id: user.id, email: user.email, full_name: user.full_name } });
});

function signJwt(userId: string, email: string, fullName: string) {
  const envSecret = process.env.JWT_SECRET;
  if (!envSecret) throw new Error('JWT_SECRET not set');
  const secret: jwt.Secret = envSecret;
  const expiresInEnv = process.env.JWT_EXPIRES_IN || '7d';
  const options: jwt.SignOptions = { expiresIn: expiresInEnv as unknown as any };
  return jwt.sign({ sub: userId, email, full_name: fullName }, secret, options);
}

export default router;
