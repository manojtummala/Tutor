# change in direction
We are changing the Agent Practice architecture in my Japanese learning app.

Important: the previous local LM Studio route is no longer the direction. Remove or deprecate the LM Studio-based Agent Practice flow unless parts are still useful as generic validation/session code.

New direction:
- Use Google Gemini API instead of local LM Studio.
- Use `gemini-2.5-flash-lite` for cheaper/faster simple generation.
- Use `gemini-2.5-flash` for harder generation, retries, or when flash-lite fails validation.
- Use Gemini structured output / response schema when generating practice questions, not only prompt-based JSON.

The old user-facing split:

Practice
├── Kana Practice
└── Agent Practice

should be removed.

The new user-facing direction is:

Practice
└── Unified Practice Session

The Practice module should no longer show Agent Practice as a separate section. Rename/adjust the current Kana Practice section into a general Practice section that can include:
- existing static kana questions
- generated kana-related questions
- generated vocabulary questions
- generated fill-in-the-blank questions
- generated matching questions
- generated sentence reorder questions

The AI should become an internal/background question-generation system, not a separate visible practice mode.

---

## Core Architecture Change

Do not generate questions live when the user starts a practice session.

Instead:

1. User learns or introduces something new.
2. That item enters the practice queue.
3. App checks whether enough valid stored questions already exist for that item/chunk.
4. If coverage is low, enqueue/run a background generation task.
5. Gemini generates 5–6 questions involving that item or chunk.
6. Generated output is validated.
7. Valid questions are stored locally in the database.
8. Future practice sessions fetch ready questions from the database instantly.

Practice session start should be fast and database-driven.

If generated questions are not ready yet, the practice session should still start using existing static kana questions or whatever valid questions are already available.

Do not block practice session start on a Gemini request.

---

## Background Generation Trigger Logic

Do not call Gemini blindly every time something changes.

Add a coverage-based trigger.

When a practice-relevant item changes, first check:

- Is the item newly introduced/unlocked?
- Is it now in the practice queue?
- How many valid active questions already exist for this item?
- How many unused or low-used questions exist for this item?
- Is there already a pending/running generation job for this item or chunk?
- Was there a recent failed generation attempt for the same item/chunk?

Only generate when coverage is below the target.

Suggested MVP behavior:
- Target: around 5–6 valid questions per new item or small chunk.
- Minimum before generating: if fewer than 3 usable questions exist, generate more.
- If 5–6 already exist, do nothing.
- If a pending/running job already exists for the same item/chunk, do nothing.
- If many items were introduced together, batch them into one chunk instead of making one API call per item.

Example:
- User finishes learning Hiragana K-row: か, き, く, け, こ
- Do not call Gemini five separate times.
- Create one generation task for the K-row chunk.
- Generate questions involving those characters.

Another example:
- User unlocks a new vocabulary word.
- Check whether stored questions already cover that word.
- If not enough, generate a small set of questions using that word and already-known grammar/vocab.

The goal is to reduce API requests and make practice sessions instant.

---

## Gemini Integration

Add a Gemini provider for question generation.

Use environment variables such as:

GEMINI_API_KEY=your-gemini-api-key
GEMINI_SIMPLE_MODEL=gemini-2.5-flash-lite
GEMINI_STRONG_MODEL=gemini-2.5-flash

Use flash-lite by default for simple generation.

Use flash when:
- flash-lite returns too few valid questions
- validation fails badly
- question type is more complex, such as sentence reorder or mixed grammar questions
- a retry is needed

Do not add full chatbot/tutor behavior.
Do not add voice.
Do not add handwriting.
Do not add image features.

This is only for background practice-question generation.

---

## Structured Output Requirement

When calling Gemini, use the built-in structured output / response schema configuration.

Do not rely only on prompt text saying “return JSON”.

Use the Gemini API structured output feature with:
- response MIME type: application/json
- response schema describing the generated practice question response

The schema should represent a top-level object like:

{
  "questions": [...]
}

Each question should include only the fields needed by the app, for example:
- type
- level
- prompt
- choices, when needed
- blocks, when needed
- correctAnswer
- naturalSentence, when useful
- explanation
- sourceItemIds

Keep the schema close to the existing generated question type in the app.

Important:
- Keep app-side validation even though Gemini structured output is used.
- Structured output improves formatting, but validation is still required.
- Do not accept invalid or unsafe questions just because the API returned schema-shaped output.

---

## Prompting Direction

The prompt should be short and constrained.

Tell Gemini:
- Generate beginner Japanese practice questions.
- Use only the provided allowed content.
- Do not introduce unknown vocabulary or grammar.
- Generate questions involving the target item/chunk.
- Prefer natural N5-level Japanese.
- Avoid unnatural/self-referential sentences like 私は私です.
- Keep explanations short and in English.
- If there is not enough content, generate fewer valid questions rather than forcing bad questions.

The actual JSON shape should be enforced primarily through Gemini structured output, not only prompt instructions.

---

## Question Storage Direction

Store valid generated questions in the local database so practice sessions can fetch them later.

Do not over-engineer this, but make sure each stored generated question can track:
- its question type
- prompt/content
- choices or blocks when needed
- correct answer
- explanation
- source item IDs
- status such as active/rejected/archived
- usage metadata if already easy to add, such as times shown or times correct

Also keep enough metadata to avoid duplicate generation and repeated API calls.

Do not overload the implementation with a complex schema if the existing database structure can be extended cleanly.

---

## Practice Session Direction

Practice should become unified.

When the user starts Practice:
1. Load current practice queue.
2. Fetch valid ready questions from the database.
3. Include existing static kana questions as fallback/normal content.
4. Include generated questions when available.
5. Mix question types cleanly.
6. Start immediately.

The user should not see or wait for “Agent Practice generation.”

Generated questions should simply appear naturally inside normal practice sessions once available.

If there are not enough generated questions yet:
- Start with available static questions.
- Do not show a blocking error unless there are no practice questions at all.

---

## Validation Direction

Keep strict validation.

Generated questions should be rejected if:
- required fields are missing
- question type is unsupported
- correct answer is missing
- multiple-choice correct answer is not one of the choices
- sentence reorder answer cannot be built from blocks
- fill-in-the-blank answer does not match the expected schema
- source item IDs are missing or invalid when required
- the question uses vocabulary/grammar outside the allowed content
- prompt/content is empty
- duplicate or near-duplicate question already exists

Store only valid questions as active.

Rejected questions can be logged for debugging, but should not appear in practice.

---

## Background Job Behavior

This can be simple for now.

It does not need a full production queue system.

Implement it in whatever local-first way best fits the current app, such as:
- a server-side function called after learning/practice queue updates
- a lightweight generation job table
- a local task runner pattern
- a manual/dev trigger for testing

But the important behavior is:

- Practice queue changes should trigger a coverage check, as a bulk/chunk.
- Coverage check decides whether generation is needed.
- Generation should happen separately from practice session start.
- Practice session should read from stored questions.

Avoid calling Gemini directly from the practice start button.

---

## Migration From Old Agent Practice

Remove the separate Agent Practice card/route from the Practice module.

The previous Agent Practice code can be reused internally if useful:
- question types
- validator
- generic question renderer
- prompt builder ideas
only if useful

But user-facing Agent Practice should no longer exist as a separate flow.

Kana Practice should be renamed or evolved into general Practice.

Do not break existing kana practice behavior.

---
## Kanji / Script Scope Add-on

Add script-scope control to generated practice questions.

Important: Even if a question is N5-level, do not automatically include N5 kanji. Generated questions should only use kanji the user has already learned/allowed.

Default policy:
- Use `learned_kanji_only`.
- If the user has learned no kanji yet, treat this as `kana_only`.
- Do not show questions with unknown kanji.

When building the Gemini generation context, include:

```ts
scriptPolicy: "learned_kanji_only";
allowedKanji: string[];
```
Rules:
If allowedKanji is empty, Gemini must generate Japanese using kana only.
If allowedKanji has values, Gemini may only use those exact kanji.
All other Japanese should be written in hiragana/katakana.
Do not use kanji just because it is N5.

Update the Gemini prompt briefly with:
Use only allowed vocabulary/grammar.
Use only allowed kanji.
If no allowed kanji are provided, use kana only.
Do not introduce unknown kanji.
Also update structured output/storage if practical to include:
scriptMode: "kana_only" | "learned_kanji_only";
kanjiUsed: string[];

Validation must scan generated question text fields and reject questions containing kanji outside allowedKanji.

Check:
prompt
choices
blocks
correctAnswer
naturalSentence

Fetching practice questions should also respect this:
If user has no learned kanji, fetch only questions with no kanji.
If user has learned some kanji, fetch only questions where every kanjiUsed value is in the learned/allowed kanji set.

Examples:
No kanji learned → allow わたしはがくせいです。
No kanji learned → reject 私は学生です。
Learned only 私 → allow 私はがくせいです。
Learned only 私 → reject 私は学生です。

Goal:
Grammar/vocab can be N5-level, but script difficulty must follow the user’s actual learned kanji progress.
---

## Acceptance Criteria

This change is successful when:

1. The Practice page no longer presents Agent Practice as a separate section.
2. Practice is a unified session.
3. Existing kana practice still works.
4. The app has a Gemini question-generation provider.
5. Gemini calls use structured output / response schema.
6. Generated questions are validated before storage.
7. Valid generated questions are stored locally.
8. Practice sessions fetch generated questions from the database instead of calling Gemini live.
9. Background generation is triggered by learning/practice queue changes only when question coverage is low.
10. The app avoids duplicate/pending generation jobs for the same item/chunk.
11. If generated questions are not ready, Practice still starts with available static/ready questions.
12. No chatbot, voice, handwriting, image, auth, or cloud sync features are added.
13. All of the instructions are implemented and accounted for.

Implement this carefully without rewriting unrelated parts of the app.