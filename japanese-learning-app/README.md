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

## Local Agent Practice

Agent Practice uses LM Studio through its local OpenAI-compatible API.

Create `.env.local` from `.env.example` and adjust the model if needed:

```env
AI_PROVIDER=lmstudio
LM_STUDIO_BASE_URL=http://127.0.0.1:1234
LM_STUDIO_MODEL=qwen2.5-7b-instruct-mlx
LM_STUDIO_API_KEY=lm-studio
AI_REQUEST_TIMEOUT_MS=120000
AI_MAX_OUTPUT_TOKENS=1400
```

Then open:

```text
http://localhost:3000/practice/agent
```

LM Studio must be running locally. Agent Practice v1 targets 6 final questions from up to 8 candidates while the local generation pipeline stabilizes. For UI development without LM Studio, set `AGENT_PRACTICE_MOCK=true`.

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
- `/learn/n5` - JLPT N5 starter shell
- `/lesson/hiragana-vowels` - sample lesson page
- `/practice` - practice hub shell
- `/practice/kana` - static/manual kana practice
- `/practice/agent` - LM Studio generated N5 practice
- `/review` - review/SRS shell
- `/library` - browse seeded learning items
- `/progress` - progress dashboard shell
- `/settings` - local app settings shell

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
- `/practice` and `/learn/kana` selected-row practice now use mixed scored sessions
- Mixed practice includes multiple choice, matching, typing, audio recognition, and reorder prompts
- Fill-blank sentence practice is deferred until sentence content is authored/generated properly
- Practice hub split into Kana Practice and Agent Practice
- Agent Practice setup added with LM Studio generation, validation, and friendly error handling
- Missed practice questions are reinserted once later in the same session
- Kana progress model added: `new`, `introduced`, `practicing`, `learned`
- Practice attempts now persist to `practice_attempts`
- Item status updates now persist to `user_item_progress`
- Practice, review, progress, and settings shells added
- SRS, XP, streak, progress, and practice helper files added

Verified:

- `npm run lint`
- `npm run build`
- `npm run db:seed`
- Route checks for `/dashboard`, `/learn/kana`, and `/lesson/hiragana-vowels`

Next likely work:

- Update daily stats and streaks after practice
- Add richer library filters and search
- Expand practice beyond kana into N5 vocabulary, kanji, grammar, and sentences
- Add richer learned-content selection for Agent Practice beyond the starter N5 pack

## Project Context

The detailed product and implementation context lives in:

```text
PROJECT_CONTEXT.md
```
