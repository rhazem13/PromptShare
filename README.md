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

Use Node.js 24 or newer.

## Authentication and ownership

Write routes read a verified server-side session. Create derives ownership from the authenticated database user; update and delete check the stored creator before modifying anything. Missing authentication returns 401; an authenticated non-owner receives 403. Client-supplied ownership IDs are ignored.

## Verification and deployment

```sh
npm test
npm run build
npm start
```

[Route tests](tests/write-authorization.test.js) cover the authorization checks with stubbed framework/database boundaries. [Persistence tests](tests/persistence-authorization.test.js) use real MongoDB queries and the actual session callback's database identity lookup. Only the NextAuth framework session boundary is substituted; these tests do not validate Google OAuth itself.

Run the persistence suite against a dedicated disposable local container:

```sh
docker run -d --name promptshare-auth-test -p 127.0.0.1:57017:27017 mongo:8.0
RUN_MONGO_INTEGRATION=1 TEST_MONGODB_URI=mongodb://127.0.0.1:57017/share_prompt_auth_test npm test
```

On PowerShell, set `$env:RUN_MONGO_INTEGRATION='1'` and `$env:TEST_MONGODB_URI` before `npm test`. These tests reset the `share_prompt` database inside that container. They refuse remote hosts and ports other than 57017. Ordinary `npm test` skips the persistence suite unless explicitly enabled. [CI](.github/workflows/ci.yml) enables it with a MongoDB service, then builds the application.

Deploy through Vercel, configure the environment variables there, and set `NEXTAUTH_URL` to the production origin. Rotate credentials exposed in older repository history before restoring access.

## Dependency audit

On 2026-10-03, `npm audit` reports five high findings in the Tailwind 3 build chain (`braces`, `chokidar`, `fast-glob`, `micromatch`, and `tailwindcss`). These are related findings from one dependency chain, not five separately verified application vulnerabilities. Tailwind 3.4.19 is the latest compatible release; the registry's latest `braces` 3 release is 3.0.3 and has no patched compatible replacement for this advisory. npm proposes a breaking Tailwind 4 migration.

Tailwind, PostCSS, and Autoprefixer are development dependencies. They compile repository-controlled styles/content during builds; the application does not accept user-supplied glob patterns. These build findings remain accepted for this historical UI project and are not described as fixed. `npm audit --omit=dev` separately checks the runtime dependency set. Updating major CSS tooling would require a dedicated visual migration check.
