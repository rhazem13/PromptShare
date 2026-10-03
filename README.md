# PromptShare

A Next.js application for publishing, finding, and managing text prompts. Public pages show shared prompts; Google sign-in lets users create and manage their own entries.

## Stack

Next.js App Router, React, NextAuth.js, MongoDB/Mongoose, and Tailwind CSS.

## Local development

```sh
npm ci
# Copy .env.example to .env.local and configure your own services.
npm run dev
```

Configuration names: `GOOGLE_ID`, `GOOGLE_CLIENT_SECRET`, `MONGODB_URI`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL`. Use a fresh random session secret. Never commit credentials. Configure Google OAuth's redirect URL as `<site origin>/api/auth/callback/google`.

## Authentication and ownership

Write routes read a verified server-side session. Create derives ownership from the authenticated database user; update and delete check the stored creator before modifying anything. Missing authentication returns 401; an authenticated non-owner receives 403. Client-supplied ownership IDs are ignored.

## Verification and deployment

```sh
npm test
npm run build
npm start
```

The tests exercise write-route authorization with real Mongoose documents and stubbed authentication/database boundaries, without contacting the live application. Deploy through Vercel, configure the environment variables there, and set `NEXTAUTH_URL` to the production origin. Rotate credentials exposed in older repository history before restoring access.
