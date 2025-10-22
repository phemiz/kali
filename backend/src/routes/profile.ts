import { Router, Response } from 'express';
import { runQuery } from '../utils/db';
import { AuthenticatedRequest, requireAuth } from '../middleware/authMiddleware';

const router = Router();

router.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const rows = await runQuery<{ id: string; full_name: string; email: string; phone: string | null; created_at: string }>(
    'SELECT id, full_name, email, phone, created_at FROM users WHERE id=$1',
    [userId]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
  res.json(rows[0]);
});

export default router;
