# Session Context — N5 Learning Flow

## State when session ends
- Dev server: `npm run dev` running on port 3000
- Build passes with 0 errors, 0 warnings
- N5 module now has 4 lessons (Self Introduction, Daily Life, Food & Drink, Basic Verbs)
- Each N5 lesson uses card-sequence intro (like kana spotlight but for vocab/kanji/grammar/sentences)
- `POST /api/items/progress` marks items introduced and triggers Gemini background generation
- Dashboard now shows real N5 progress

## Files created/modified
- `app/learn/n5/page.tsx` — rewritten with real DB progress + N5LearnClient
- `app/api/items/progress/route.ts` — new general item introduction API
- `components/learn/n5-learn-client.tsx` — new N5 lesson page client component
- `components/learn/n5-item-cards.tsx` — new card-sequence intro for N5 items
- `data/lessons.json` — added 3 new N5 lessons (daily-life, food-drink, basic-verbs)
- `data/jlpt/n5_vocab.json` — expanded to 29 entries across 4 lessons
- `data/jlpt/n5_kanji.json` — expanded to 19 entries across 4 lessons
- `data/jlpt/n5_grammar.json` — expanded to 12 entries across 4 lessons
- `data/jlpt/n5_sentences.json` — expanded to 15 entries across 4 lessons
- `lib/server/dashboard.ts` — computed real N5 progress instead of hardcoded 0
- `GEMINI.md` — doc updates for new route + API

## Remaining work (in order)
1. Question retirement: mark questions as `retired` when `times_shown >= 5 && accuracy >= 0.8` to auto-refresh pool
2. N5 lesson unlock progression: unlock next lesson when previous lesson items reach "learned" status
3. Review route: wire up existing review components instead of redirecting to dashboard
4. More N5 content: additional lessons as seed data grows

## Design direction
- Duolingo-inspired: gamified, soft colors, rounded cards, progress rings, streak display
- Font: Geist (already set up)
- Animations: framer-motion (already in deps)
- Color: green primary (#primary = oklch green), warm accents
