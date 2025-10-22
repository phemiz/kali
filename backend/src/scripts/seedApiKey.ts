import crypto from 'crypto';
import { runQuery } from '../utils/db';

async function main() {
  const name = process.argv[2] || 'Default Key';
  const apiKey = crypto.randomBytes(24).toString('hex');
  const rate = Number(process.env.B2B_DEFAULT_RATE_LIMIT_PER_MINUTE || 60);
  const rows = await runQuery<{ id: string; api_key: string }>(
    'INSERT INTO api_keys (name, api_key, rate_limit_per_minute) VALUES ($1,$2,$3) RETURNING id, api_key',
    [name, apiKey, rate]
  );
  console.log('Created API key:', rows[0].api_key);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
