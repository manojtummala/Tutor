# Gemini CLI Project Context

## Project Summary

This is a personal Japanese learning application focused first on Kana Foundations and then JLPT N5 content.

The app is local-first:

- Next.js App Router
- React 19 and TypeScript
- Tailwind CSS and shadcn/ui-style components
- SQLite through `better-sqlite3`
- Drizzle ORM schema definitions
- Local JSON files as the authored content source
- Gemini API only for background practice-question generation

Read `INSTRUCTIONS.md` before implementing a requested feature. It contains the current implementation direction. Use `PROJECT_CONTEXT.md` for broader product history, but prefer the current code and `INSTRUCTIONS.md` when they disagree.

## Essential Commands

Run commands from the repository root:

```bash
npm install
npm run dev
npm run lint
npm run build
npm run db:seed
npm run db:reset
npm run db:generate
npm run db:migrate
```

Development URL:

```text
http://localhost:3000
```

After code changes, always run:

```bash
npm run lint
npm run build
```

For route changes, also check the affected route with `curl` while the development server is running.

`better-sqlite3` is a native dependency. If Node versions change and SQLite routes fail with a `NODE_MODULE_VERSION` error, run:

```bash
npm rebuild better-sqlite3
```

## Important Security Rules

- Never commit, print, document, or repeat real API keys.
- Read `GEMINI_API_KEY` only from the environment.
- Keep examples as placeholders such as `GEMINI_API_KEY=your-gemini-api-key`.
- Do not put secrets in `GEMINI.md`, `README.md`, source code, logs, or generated artifacts.
- Do not add auth, cloud sync, chatbot, image generation, handwriting, or voice-tutor features unless explicitly requested.

## Product Architecture

### Learning

- `/learn` shows the learning roadmap.
- `/learn/kana` is the Kana Foundations learning module.
- Kana lessons use a spotlight flow for initial exposure.
- Completing a learning spotlight introduces the items and updates `user_item_progress`.
- Users can select lesson rows in `/learn/kana`; starting practice routes them to `/practice?lessonIds=...`.

### Unified Practice

`/practice` is the only user-facing practice experience.

Do not reintroduce a separate Agent Practice page or card.

Practice must:

1. Start immediately.
2. Load introduced/practicing items.
3. Use ready generated questions stored in SQLite when available.
4. Fall back to existing static kana questions.
5. Never wait for a Gemini request.

`/practice/kana` exists only as a compatibility redirect to `/practice`.

Current static kana modes:

- multiple choice
- typed romaji
- audio recognition
- matching

Do not add kana reorder questions; kana answers are generally single readings.

### Reviews

- `/review` is separate from scored Practice.
- Kana review uses flip cards without SRS rating buttons.
- SRS helpers remain available for later vocabulary and kanji work.

## Gemini Background Generation

Gemini is an internal background question-generation system, not a visible practice mode.

Environment variables:

```env
GEMINI_API_KEY=your-gemini-api-key
GEMINI_SIMPLE_MODEL=gemini-2.5-flash-lite
GEMINI_STRONG_MODEL=gemini-2.5-flash
```

Generation flow:

1. Completing a learning row introduces its items into the practice queue.
2. Completing a Kana Learn row submits that row's item IDs as one generation chunk.
3. Individual kana practice answers update progress but do not trigger generation calls.
4. `queueQuestionGenerationIfNeeded` checks stored coverage for the introduced row chunk.
5. If coverage is low and no duplicate/recent row job exists, create one generation job.
6. Flash-Lite generates first.
7. Flash is used when Flash-Lite validation coverage is too low.
8. Validate generated output strictly.
9. Store only valid questions.
10. Future practice sessions fetch stored questions.

Without `GEMINI_API_KEY`, static practice must continue working normally.

Key files:

- `lib/ai/gemini.ts`: Gemini REST request and structured response schema
- `lib/ai/gemini-prompts.ts`: short constrained generation prompt
- `lib/ai/question-schema.ts`: strict app-side validation
- `lib/server/question-generation.ts`: coverage checks, jobs, generation, and storage
- `lib/server/generated-question-store.ts`: stored question fetching and usage tracking
- `lib/practice/generated-practice-types.ts`: generated question types
- `components/practice/generated-practice-session.tsx`: generated question renderer

Gemini calls must use structured output:

- response MIME type `application/json`
- response JSON schema
- app-side validation after parsing

Never rely only on prompt text saying to return JSON.

## Generated Question Validation

Keep validation strict. Do not loosen it to accept malformed model output.

Supported generated question types:

- `multiple_choice`
- `fill_blank`
- `sentence_reorder`
- `match_pairs`

Reject questions with:

- missing required fields
- unsupported types
- malformed answers, choices, blocks, or pairs
- invalid source item IDs
- duplicate or near-duplicate prompts
- Japanese content outside the allowed scope
- unknown kanji
- mismatched `kanjiUsed`
- unnatural known-bad starter sentences

Generated questions include:

- `scriptMode`: `kana_only` or `learned_kanji_only`
- `kanjiUsed`: exact kanji present in question text

Default script behavior:

- No learned kanji means kana-only generated questions.
- If kanji are learned, generated questions may use only those exact kanji.
- Stored-question fetching must filter out questions containing unavailable kanji.

## Database

Primary database:

```text
local.db
```

Schema:

```text
db/schema.ts
```

Seed implementation:

```text
db/seed.ts
```

Important tables:

- `learning_items`
- `user_item_progress`
- `practice_attempts`
- `generated_practice_questions`
- `question_generation_jobs`
- `daily_stats`
- `streaks`

Generated question tables are also created lazily through `ensureGeneratedQuestionTables`, allowing an existing local database to continue working without a destructive reset.

Do not reset or reseed `local.db` unless the user explicitly requests it or the task requires it. Resetting deletes local progress.

## Content Sources

Authored content lives under `data/`:

- `data/modules.json`
- `data/lessons.json`
- `data/kana/hiragana.json`
- `data/kana/katakana.json`
- `data/kana/variations.json`
- `data/jlpt/n5_vocab.json`
- `data/jlpt/n5_kanji.json`
- `data/jlpt/n5_grammar.json`
- `data/jlpt/n5_sentences.json`

Use structured JSON parsing and existing content helpers in `lib/content/data.ts`. Avoid duplicating content lookup logic unnecessarily.

## Main Routes

- `/dashboard`: dashboard
- `/learn`: learning roadmap
- `/learn/kana`: Kana Foundations (spotlight intro + row-based lesson cards)
- `/learn/n5`: N5 module (card-sequence intro for vocab/kanji/grammar/sentences; marks items introduced + triggers generation)
- `/practice`: unified practice
- `/practice/kana`: compatibility redirect
- `/review`: review flow
- `/library`: content library
- `/progress`: progress view
- `/settings`: local settings

Important APIs:

- `POST /api/kana/progress`: introduce/practice kana; row introduction triggers one chunk coverage check
- `POST /api/items/progress`: introduce any learning items (used by N5 lessons); marks items introduced + triggers question generation
- `GET /api/review`: retrieve current queue and ready stored generated questions
- `POST /api/practice/generate`: manual/development coverage trigger
- `POST /api/practice/generated-attempt`: update generated-question usage metadata

## UI Conventions

- Preserve the existing restrained, work-focused visual style.
- Reuse existing components under `components/ui`.
- Use Lucide icons where appropriate.
- Keep cards at the existing small radius.
- Do not create marketing landing pages.
- Do not put cards inside cards.
- Keep mobile and desktop layouts usable.
- Do not disturb Kana Learn, Review, or Practice behavior when changing generated-question infrastructure.

## Engineering Rules

- Read nearby code before editing.
- Follow existing patterns and keep changes scoped.
- Do not revert unrelated uncommitted user changes.
- Prefer strict types and structured parsers.
- Keep server-only SQLite/Gemini logic out of client components.
- Never call Gemini directly from a practice-start action.
- Never block practice startup on generation.
- Avoid destructive git or database commands.
- Update `README.md` and `PROJECT_CONTEXT.md` when architecture or workflows materially change.

## Definition Of Done

Before finishing a task:

1. Confirm the requested behavior is implemented end to end.
2. Run `npm run lint`.
3. Run `npm run build`.
4. Check affected routes/APIs when practical.
5. Confirm no secrets were added.
6. Summarize changed behavior and any verification limitations.
