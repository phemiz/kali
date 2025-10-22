import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { simulatePlateLookup } from '../utils/verify';

const router = Router();

const verifySchema = z.object({ plate_number: z.string().min(5) });

router.post('/plate', (req: Request, res: Response) => {
  const parsed = verifySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { plate_number } = parsed.data;
  const result = simulatePlateLookup(plate_number);
  res.json(result);
});

export default router;
