Agent Practice is now reaching LM Studio successfully with Qwen2.5 3B Instruct MLX 4-bit, and JSON parsing works. The current failure is validation quantity/quality, not timeout.

Observed result:
- LM Studio returned valid JSON.
- 3 of 6 questions passed validation.
- The valid questions were multiple_choice.
- The invalid question was fill_blank and had schema problems:
  - correctAnswer was an array instead of a string
  - it added naturalSentenceBlocks instead of naturalSentence
  - it used choices like "A. 日本語"
  - it introduced vocabulary outside the allowed starter content
  - it used inconsistent punctuation
- The model generated only 4 questions even though the app expected up to 8 candidates.

Please update Agent Practice v1 to be more reliable for local small models.

Goals:

1. Add a stable generation profile for MVP
   - Default Agent Practice v1 should use only `multiple_choice`.
   - Do not request `fill_blank` by default.
   - Do not request `sentence_reorder` by default unless the code already handles it very reliably.
   - Keep `sentence_reorder` and `fill_blank` types in the code for future use, but do not include them in the default generation prompt yet.

2. Change valid-question threshold behavior
   - Target valid questions: 6.
   - Minimum acceptable valid questions: 3.
   - If validation returns 6 or more valid questions, start a 6-question session.
   - If validation returns 3–5 valid questions, start a shorter session with those valid questions.
   - If fewer than 3 valid questions pass validation, show the friendly validation failure.
   - Update UI copy to make this clear:
     "Target 6 questions. Shorter sessions may start if fewer valid questions are generated."

3. Reduce candidate count slightly
   - Ask for up to 6 candidate questions in stable mode.
   - Select up to 6 valid questions.
   - Minimum acceptable is 3.

4. Strengthen the default prompt for multiple_choice only
   The prompt should say:
   - Return JSON only.
   - Output shape must be `{ "questions": [...] }`.
   - Generate up to 6 candidate questions.
   - Use only type `multiple_choice`.
   - Use only allowed vocabulary, allowed particles, allowed verbs, and safe templates.
   - Do not add vocabulary outside the allowed content.
   - `correctAnswer` must be a string.
   - `correctAnswer` must exactly match one item in `choices`.
   - `choices` must be an array of exactly 4 strings.
   - Do not prefix choices with "A.", "B.", "C.", or "D.".
   - Do not add fields that are not in the schema.
   - Use `naturalSentence`, not `naturalSentenceBlocks`.
   - Explanation must be one short English sentence.

5. Keep validation strict
   - Do not accept malformed fill_blank.
   - Do not accept partial JSON.
   - Do not weaken schema validation just to pass bad questions.
   - But allow the session to start with 3+ valid questions.

6. Improve validation logging
   - Log rejection reasons per question.
   - Include question index, type, prompt, and reason.
   - Example:
     `Rejected question 4: fill_blank correctAnswer must be string`
   - This will help tune the prompt.

7. Do not change Kana Practice
   - Kana Practice must remain separate and unchanged.

Expected result:
- With Qwen2.5 3B Instruct, Agent Practice should reliably produce at least 3 valid multiple-choice questions.
- The app should start a shorter session instead of failing when 3–5 valid questions pass.
- Later we can add sentence_reorder and fill_blank back after the base pipeline is stable.