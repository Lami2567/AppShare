# AppShare

A serverless mobile app distribution platform built with Next.js App Router, Vercel API routes, Neon PostgreSQL, Cloudflare R2, Tailwind CSS, and Lucide icons.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in Neon, R2, and auth values.

3. Run `database/schema.sql` in Neon.

4. Create an admin user:

```bash
npm run create-admin -- admin@example.com strong-password
```

5. Start locally:

```bash
npm run dev
```

## Deployment

Deploy directly to Vercel. Add the environment variables from `.env.example` to the Vercel project settings. API routes are serverless functions; no external backend server is required.
