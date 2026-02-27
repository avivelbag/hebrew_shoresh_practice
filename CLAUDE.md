# Hebrew Root of the Day

## Project Conventions

- **Never** use `dangerouslySetInnerHTML` for any content
- **Never** use `NEXT_PUBLIC_` prefix for secret environment variables
- **Always** validate Redis data with Zod schemas on read
- **Always** normalize Hebrew text to NFC before storage: `text.normalize('NFC')`
- All Hebrew text elements must have `dir="rtl" lang="he"` attributes
- Use `correctAnswer` (string) not `correctIndex` (number) for quiz answers
- Zod schemas in `lib/schemas.ts` are the source of truth — derive types with `z.infer<>`

## Tech Stack

- Next.js 16 (App Router) on Vercel
- TypeScript (strict)
- Tailwind CSS 4
- Upstash Redis (`@upstash/redis`)
- Anthropic SDK (`@anthropic-ai/sdk`) with structured outputs
- Zod for runtime validation
- Web Audio API for trope synthesis

## Commands

```bash
npm run dev    # Start development server
npm run build  # Production build
npm run lint   # Run ESLint
```

## Environment Variables

Required in `.env.local`:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `UPSTASH_REDIS_READ_TOKEN`
- `ANTHROPIC_API_KEY`
- `ADMIN_PASSWORD`
- `CLAUDE_MODEL` (default: claude-sonnet-4-5)

## Node.js

Requires Node 20+. Use `nvm use` to load the correct version from `.nvmrc`.
