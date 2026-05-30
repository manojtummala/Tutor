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
- Dashboard route added
- Learn roadmap route added
- Kana module route added
- Lesson detail route added
- Practice, review, library, progress, and settings shells added
- SRS, XP, streak, progress, and practice helper files added

Verified:

- `npm run lint`
- `npm run build`
- `npm run db:seed`
- Route checks for `/dashboard`, `/learn/kana`, and `/lesson/hiragana-vowels`

Next likely work:

- Make flashcards interactive
- Persist practice attempts
- Wire review ratings to SRS updates
- Update daily stats and streaks after practice
- Expand kana seed data to full hiragana, katakana, and variations
- Add richer library filters and search

## Project Context

The detailed product and implementation context lives in:

```text
PROJECT_CONTEXT.md
```
