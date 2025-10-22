import { Request, Response, NextFunction } from 'express';
import { runQuery } from '../utils/db';

const inMemoryCounters = new Map<string, { windowStartMs: number; count: number; limit: number }>();

export async function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = (req.headers['x-api-key'] || req.query.api_key) as string | undefined;
  if (!apiKey) return res.status(401).json({ error: 'Missing API key' });

  const keys = await runQuery<{
    id: string;
    api_key: string;
    rate_limit_per_minute: number;
    revoked: boolean;
  }>('SELECT id, api_key, rate_limit_per_minute, revoked FROM api_keys WHERE api_key=$1', [apiKey]);

  if (keys.length === 0 || keys[0].revoked) return res.status(401).json({ error: 'Invalid API key' });
  const limit = keys[0].rate_limit_per_minute || Number(process.env.B2B_DEFAULT_RATE_LIMIT_PER_MINUTE || 60);

  const now = Date.now();
  const windowMs = 60_000;
  const existing = inMemoryCounters.get(apiKey);
  if (!existing || now - existing.windowStartMs >= windowMs) {
    inMemoryCounters.set(apiKey, { windowStartMs: now, count: 1, limit });
    return next();
  }
  if (existing.count >= existing.limit) {
    const retry = Math.ceil((existing.windowStartMs + windowMs - now) / 1000);
    res.setHeader('Retry-After', String(retry));
    return res.status(429).json({ error: 'Rate limit exceeded. Try later.' });
  }
  existing.count += 1;
  return next();
}
