# NaijaPlate – Nigeria Vehicle & Road Safety Companion

Backend: Node.js + Express + PostgreSQL (TypeScript)
Mobile: React Native (Expo, TypeScript) with SQLite offline cache
Deployment: Docker (API + Postgres)

## Backend

- Auth: JWT signup/login
- Routes:
  - POST `/api/auth/signup`
  - POST `/api/auth/login`
  - GET `/api/profile` (Bearer JWT)
  - POST `/api/verify/plate` { plate_number }
  - POST `/api/b2b/verify/plate` (X-API-KEY)

### Local dev

1. Copy environment

```bash
cp backend/.env.example backend/.env
```

2. Start Postgres (if you have Docker):

```bash
# Requires local Docker, not available in this VM by default
docker compose up -d db
```

Or install Postgres locally and set `DATABASE_URL`.

3. Install and build API

```bash
cd backend
npm ci
npm run build
node dist/scripts/migrate.js
node dist/index.js
```

4. Seed an API key (optional, B2B)

```bash
npm run build
node dist/scripts/seedApiKey.js "Partner Key"
```

### Environment

- `PORT=4000`
- `JWT_SECRET=your-secret`
- `JWT_EXPIRES_IN=7d`
- `DATABASE_URL=postgres://postgres:postgres@localhost:5432/naijaplate`
- `B2B_DEFAULT_RATE_LIMIT_PER_MINUTE=60`

## Mobile (Expo)

1. Set API base URL for your emulator/device

```bash
cd mobile
export API_BASE_URL="http://YOUR_MACHINE_IP:4000"
```

2. Run

```bash
npm run android # or ios/web
```

### Screens

- Login, Sign Up
- Profile
- Verify Plate (uses `/api/verify/plate`, caches results in SQLite)

### Monetization

- AdMob banner component (test ad unit by default)
- Placeholder paywall component for future IAP

## B2B API

- Header: `X-API-KEY: <your key>`
- Endpoint: `POST /api/b2b/verify/plate` { plate_number }
- Rate limiting: per-key in-memory window (configurable)

## Notes

- This VM does not have Docker installed; use your local machine or cloud.
- For production: configure HTTPS, robust rate limiting, logging, and secrets management.
