right now everythign is just stall incomplete data. 

also for library, can we have a sections of hiragana, katakana and kanji so there is clear seperation rather than just dumping all of the seed data in the library combined. so that then above the charatcer, we wont need kana everytime and below it the text can be just romaji or word than "hiragana for ..."

Populate the Kana Foundations module properly and add a speaker icon for pronunciation on learning/practice/review/library screens and other wherever character will be used.

Important:
- Kana is standard. Do not scrape copyrighted lesson text.
- Use standard kana chart references only to verify mappings.
- If web search is available, check standard references such as Wikibooks Japanese/Kana chart for kana/romaji mappings and yōon combinations.
- Do not block implementation on downloading audio files.
- Implement local audio support with browser TTS fallback.

Tasks:

1. Update schema
- Add `audioSrc` to `learning_items`.
- Make sure seed/import logic reads `audioSrc` from JSON.

2. Create complete kana seed data
Create or update:
- `data/kana/hiragana.json`
- `data/kana/katakana.json`
- `data/kana/variations.json`

The kana data should include:
- 46 basic hiragana
- 46 basic katakana
- dakuten kana
- handakuten kana
- yōon/compound kana such as kya, kyu, kyo, sha, shu, sho, cha, chu, cho, etc.
- lesson-style entries or metadata for small っ/ッ, long vowels, and similar-looking kana drills if the current schema supports it.

Each kana item should include:
- id
- type: "kana"
- level: "kana"
- moduleId: "kana-foundations"
- lessonId
- japanese
- reading
- romaji
- meaning
- audioSrc
- metadata

Use this audio path convention:
`/audio/kana/{romaji}.mp3`

Examples:
- あ and ア should both use `/audio/kana/a.mp3`
- し and シ should both use `/audio/kana/shi.mp3`
- きゃ and キャ should both use `/audio/kana/kya.mp3`

3. Add audio playback
Create:
- `hooks/use-audio-player.ts`
- `components/audio/speaker-button.tsx`

Speaker button behavior:
- If `audioSrc` exists and the file can play, play it.
- If no audio file exists or playback fails, fallback to browser `speechSynthesis`.
- Use `SpeechSynthesisUtterance`.
- Set `utterance.lang = "ja-JP"`.
- Use a slightly slower rate, around `0.85`.

update PROJECT_CONTEXT with the simple necessary information for the updates made.

inclusing this, implement the next steps planned.