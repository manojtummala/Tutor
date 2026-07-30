# Japanese Learning App

Personal Japanese learning app focused first on Kana Foundations, then JLPT N5 basics.

Current stack:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- SQLite
- Drizzle ORM
- Local JSON seed data

## Run Locally

Install dependencies:

```bash
npm install
```

Seed the local SQLite database:

```bash
npm run db:seed
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The home page redirects to:

```text
http://localhost:3000/dashboard
```

## Background Question Generation

Practice starts immediately from static kana questions and valid generated questions already stored in SQLite. Gemini generation runs separately after practice-queue coverage becomes low.

Create `.env.local` from `.env.example`:

```env
GEMINI_API_KEY=your-gemini-api-key
GEMINI_SIMPLE_MODEL=gemini-2.5-flash-lite
GEMINI_STRONG_MODEL=gemini-2.5-flash
```

Gemini uses structured JSON output. Finishing a Kana Learn row checks/generates coverage once for that row chunk; individual kana practice answers do not call Gemini. Valid questions are stored in `generated_practice_questions`, and recent or in-progress row jobs are deduplicated in `question_generation_jobs`. Without a Gemini key, existing static practice still works.

## Check Progress So Far

Use these commands after making changes:

```bash
npm run lint
npm run build
```

Optional route checks while the dev server is running:

```bash
curl -I http://localhost:3000/dashboard
curl -I http://localhost:3000/learn/kana
curl -I http://localhost:3000/lesson/hiragana-vowels
```

Expected result: each route should return `HTTP/1.1 200 OK`.

## Useful App Pages

- `/dashboard` - main dashboard
- `/learn` - learning roadmap
- `/learn/kana` - Kana Foundations module
- `/learn/kana/hiragana` - hiragana browser
- `/learn/kana/katakana` - katakana browser
- `/learn/kana/variations` - kana variations browser
- `/learn/n5` - JLPT N5 module with lesson cards and card-sequence intro
- `/lesson/hiragana-vowels` - sample lesson page
- `/practice` - unified static and stored-generated practice session
- `/practice/kana` - redirects to unified practice for compatibility
- `/review` - redirects to dashboard (deferred)
- `/library` - browse seeded learning items with search and filters
- `/progress` - progress analytics with real DB stats
- `/settings` - daily goal, theme toggle, reset progress

## Database Commands

Seed or reseed current JSON data into `local.db`:

```bash
npm run db:seed
```

Reset the local database and seed again:

```bash
npm run db:reset
```

Generate Drizzle migrations:

```bash
npm run db:generate
```

Run Drizzle migrations:

```bash
npm run db:migrate
```

## Current Progress

Update this section as the app grows.

Done:

- Project scaffolded with Next.js, TypeScript, Tailwind, and shadcn/ui
- Local SQLite and Drizzle schema added
- Seed script added
- Seed JSON added for modules, lessons, kana, and starter N5 content
- Kana seed expanded to complete basic hiragana, complete basic katakana, dakuten, handakuten, yoon, and special drill entries
- `audioSrc` added to kana seed data and learning item schema
- Pronunciation speaker button added with browser TTS
- TTS debounced to prevent double playback and slowed for beginner pronunciation practice
- Dashboard route added
- Learn roadmap route added
- Kana learn page split into Hiragana and Katakana tabs with shared skills separated
- Kana Learn now uses a spotlight overlay for first-time exposure with auto pronunciation and no scoring
- Kana module route added
- Lesson detail route added
- Library separated into Hiragana, Katakana, Kana Variations, Kanji, and N5 Starter Materials
- `/library/kana` split into Hiragana and Katakana tabs with separate variation sections
- `/review` now uses non-rated flip cards for introduced/practicing kana
- `/learn/kana` selected-row practice routes into `/practice`
- Mixed kana practice includes multiple choice, matching, typing, and audio recognition prompts
- Fill-blank sentence practice is deferred until sentence content is authored/generated properly
- Unified Practice reads ready generated questions from SQLite and falls back to static kana questions
- Gemini structured-output generation runs in the background after coverage checks
- Missed practice questions are reinserted once later in the same session
- Kana progress model added: `new`, `introduced`, `practicing`, `learned`
- Practice attempts now persist to `practice_attempts`
- Item status updates now persist to `user_item_progress`
- Practice, review, progress, and settings shells added
- SRS, XP, streak, progress, and practice helper files added

Verified:

- `npm run lint` — clean
- `npm run build` — 27 routes, 0 errors

Next likely work:

- Udpate daily stats and streaks after practice
- Question retirement: mark overused questions as retired to auto-refresh the generation pool
- N5 lesson unlock progression by previous-lesson mastery
- Expand generated-question content packs beyond starter N5 scope
- Wire up review route

## Project Context

The detailed product and implementation context lives in:

```text
PROJECT_CONTEXT.md
```
