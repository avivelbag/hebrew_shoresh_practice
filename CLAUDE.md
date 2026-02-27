# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev    # Start dev server (requires nvm use first)
npm run build  # Production build
npm run lint   # ESLint
```

Requires Node 20+. Run `nvm use` to load from `.nvmrc`.

## Architecture

Hebrew learning site with two features: daily shoresh (root) practice tied to the weekly Torah portion, and cantillation (trope) audio matching quizzes. No user accounts — everyone sees the same content.

### Content Pipeline

Sefaria API (Torah text) → Claude API (structured outputs via `zodOutputFormat`) → Upstash Redis (draft) → Admin review → Approve (triggers ISR revalidation) → Public site reads from Redis.

Content is keyed as `content:{slugified-parsha-name}:{YYYY-MM-DD weekOf Sunday}`. Draft keys are tracked in the `index:drafts` Redis Set. Generation uses a `generating:{slug}` lock key with 5-min TTL.

### Key Modules

- `lib/schemas.ts` — **Source of truth** for all types. Zod schemas define the shape; TypeScript types derived via `z.infer<>`. `WeeklyRootsSchema` is the Claude structured output schema. `WeeklyContentSchema` is what's stored in Redis.
- `lib/generate.ts` — Fetches parsha text from Sefaria, sends to Claude with `messages.parse()` + `zodOutputFormat(WeeklyRootsSchema)`, validates nikud presence post-generation.
- `lib/content-store.ts` — Redis CRUD. Two clients: `redisRead` (read-only token, public pages) and `redisAdmin` (read-write, admin routes). Approval calls `revalidatePath('/')`.
- `lib/audio/trope-player.ts` — Web Audio API synthesis. Singleton AudioContext, cleanup-before-play pattern, `ended` event cleanup.

### Server vs Client Components

Server Components: `page.tsx` files, `ShoreshCard`, `ShabbatReview`, `ParshaHeader` — handle data fetching and static display.
Client Components (`'use client'`): `PracticeQuiz`, `TropeQuiz`, `TropeReference`, `ReviewForm` — handle interactivity, audio, quiz state.

### Admin Auth

Bearer token auth via `lib/auth.ts` using `timingSafeEqual`. Admin routes are under `/api/admin/*`. The admin UI at `/admin` sends the password as a Bearer token with each request.

## Conventions

- **Never** use `dangerouslySetInnerHTML`
- **Never** use `NEXT_PUBLIC_` prefix for secrets — `next.config.ts` has a build-time guard
- All Hebrew text elements must have `dir="rtl" lang="he"` attributes
- Validate all Redis data with Zod schemas on read
- Normalize Hebrew text to NFC before storage
- Use `correctAnswer` (string match) not `correctIndex` for quiz answers
- Trope quiz randomization must be client-side (not server) to avoid ISR caching the same order
- Parsha names need slugification for Redis keys (`slugifyParsha` in `lib/hebrew-utils.ts`)

## Environment Variables

Required in `.env.local`:
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `UPSTASH_REDIS_READ_TOKEN`
- `ANTHROPIC_API_KEY`
- `ADMIN_PASSWORD`
- `CLAUDE_MODEL` (default: `claude-sonnet-4-5`)
