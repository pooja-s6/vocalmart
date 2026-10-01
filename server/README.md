# VocalMart Server (scaffold)

This folder contains a TypeScript + Express scaffold for the VocalMart backend using PostgreSQL + Prisma.

Quick start (local):

1. Copy `.env.example` to `.env` and edit `DATABASE_URL` & `JWT_SECRET`.
2. Install deps:

```bash
cd server
npm install
```

3. Initialize Prisma & migrate:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Run in dev mode:

```bash
npm run dev
```

Endpoints:
- `POST /api/auth/register` — register
- `POST /api/auth/login` — login
