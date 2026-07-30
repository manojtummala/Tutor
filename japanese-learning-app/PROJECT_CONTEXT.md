# **Japanese Learning App — Project Context**

## **1\. Project Overview**

This project is a personal Japanese learning application inspired by apps like Duolingo, NihonDex, Migaku, and Anki.

The initial goal is **not** to build a public commercial product. The first version is for personal use, but it should still be built with good product-quality structure, clean UI, maintainable code, and room to expand later.

The app should help a beginner learn Japanese in a structured path starting from kana, then JLPT N5, then eventually N4–N1. The first build should focus on learning content, flashcards, practice tests, reviews, progress tracking, streaks, and a polished dashboard.

Handwriting/stroke matching and AI conversation tutor features are intentionally deferred until later.

---

## **2\. Current Scope**

### **Build now**

The first version should include:

* Pretty dashboard UI  
* Structured beginner roadmap  
* Kana module  
* JLPT N5 module shell  
* Flashcards  
* Duolingo-style practice questions  
* SRS-style reviews  
* Progress tracking  
* Streak tracking  
* Accuracy tracking  
* Daily goals  
* Learning library/materials  
* Local/free data setup  
* Clean project structure  
* Seedable JSON learning content

### **Defer until later**

Do not build these in the first version:

* Handwriting/stroke-matching  
* AI conversation tutor  
* Voice/audio speaking tutor  
* Browser extension  
* Full Migaku-style immersion mining  
* Full N4–N1 content  
* Public user accounts  
* Payments/subscriptions  
* Multi-user production deployment

The app should be architected in a way that these can be added later, but they should not block the MVP.

---

## **3\. Product Vision**

The app should eventually feel like:

NihonDex-style structured roadmap \+ Duolingo-style exercises \+ Anki-style spaced repetition \+ clean personal progress dashboard.

The core learning loop:

1. User opens dashboard.  
2. User sees daily goal, streak, due reviews, current module progress, and recommended next lesson.  
3. User continues a lesson from the kana roadmap or N5 module.  
4. User practices with flashcards and interactive tests.  
5. User reviews due items using SRS.  
6. Progress, XP, accuracy, and streak are updated.  
7. User can browse the learning library to review kana, vocabulary, kanji, grammar, and sentences.

---

## **4\. Confirmed Tech Stack**

Use a minimal, free, product-quality stack.

### **Frontend**

* Next.js  
* TypeScript  
* Tailwind CSS  
* shadcn/ui  
* Framer Motion for small animations  
* Lucide React icons

### **Backend**

* Next.js App Router  
* Server Actions or Route Handlers  
* No separate backend initially

### **Database**

* SQLite for local/personal use  
* Drizzle ORM  
* Drizzle migrations

### **Data**

* Local JSON files as source learning content  
* Seed script imports JSON into SQLite  
* Keep data version-controlled and editable

### **Deployment**

* Localhost first  
* Optional later: Vercel, Railway, Fly.io, or local Docker

### **AI**

No AI features in the first version.

Later, possible AI features can be added behind a `/lib/ai` abstraction using:

* Ollama for local models  
* OpenAI or other APIs if needed  
* AI writing correction  
* AI grammar explanation  
* AI-generated practice questions  
* AI conversation/audio tutor

But none of this is part of the current MVP.

---

## **5\. Design Direction**

The app should look clean, modern, friendly, and motivating.

Desired feel:

* Duolingo-like progress motivation  
* NihonDex-like structured learning path  
* Dashboard-first experience  
* Soft colors  
* Rounded cards  
* Progress bars/rings  
* Badges  
* Streak display  
* Lesson path nodes  
* Animated feedback for correct/wrong answers  
* Clean typography  
* Mobile-friendly layout

Use shadcn/ui components as the base.

Recommended UI components:

* Card  
* Button  
* Badge  
* Progress  
* Tabs  
* Dialog  
* Sheet  
* Tooltip  
* Dropdown Menu  
* Command  
* Toast/Sonner  
* Avatar if needed  
* Separator

Recommended icons:

* Flame for streak  
* BookOpen for learning  
* Brain or Sparkles for practice  
* Trophy for achievements  
* BarChart for progress  
* CheckCircle for completion  
* XCircle for incorrect answers  
* Clock for due reviews

---

## **6\. App Routes**

Recommended route structure:

/  
  Redirect to /dashboard

/dashboard  
  Main home dashboard

/learn  
  Learning roadmap overview

/learn/kana  
  Kana module overview

/learn/kana/hiragana  
  Hiragana lessons

/learn/kana/katakana  
  Katakana lessons

/learn/kana/variations  
  Kana variations and combinations

/learn/n5  
  JLPT N5 module overview

/lesson/\[lessonId\]  
  Generic lesson page

/practice  
  Practice hub

/practice/\[mode\]  
  Practice mode page

/review  
  Due SRS reviews

/library  
  Browse learning materials

/library/kana  
  Browse kana

/library/vocabulary  
  Browse vocabulary

/library/kanji  
  Browse kanji

/library/grammar  
  Browse grammar

/progress  
  Progress analytics

/settings  
  App settings

---

## **7\. Initial Module Roadmap**

The app starts with a beginner-friendly **Kana Foundations** module.

### **Module 1: Kana Foundations**

The kana module should contain three major sections:

1. Hiragana  
2. Katakana  
3. Variations and combinations

This should be beginner-minded and structured carefully.

Kana Foundations  
├── Hiragana  
│   ├── Basic vowels: あ い う え お  
│   ├── K-row: か き く け こ  
│   ├── S-row: さ し す せ そ  
│   ├── T-row: た ち つ て と  
│   ├── N-row: な に ぬ ね の  
│   ├── H-row: は ひ ふ へ ほ  
│   ├── M-row: ま み む め も  
│   ├── Y-row: や ゆ よ  
│   ├── R-row: ら り る れ ろ  
│   ├── W-row: わ を  
│   └── ん  
│  
├── Katakana  
│   ├── Basic vowels: ア イ ウ エ オ  
│   ├── K-row: カ キ ク ケ コ  
│   ├── S-row: サ シ ス セ ソ  
│   ├── T-row: タ チ ツ テ ト  
│   ├── N-row: ナ ニ ヌ ネ ノ  
│   ├── H-row: ハ ヒ フ ヘ ホ  
│   ├── M-row: マ ミ ム メ モ  
│   ├── Y-row: ヤ ユ ヨ  
│   ├── R-row: ラ リ ル レ ロ  
│   ├── W-row: ワ ヲ  
│   └── ン  
│  
├── Variations and Combinations  
│   ├── Dakuten: が ぎ ぐ げ ご, ざ じ ず ぜ ぞ, だ ぢ づ で ど, ば び ぶ べ ぼ  
│   ├── Handakuten: ぱ ぴ ぷ ぺ ぽ  
│   ├── Katakana dakuten/handakuten equivalents  
│   ├── Yōon: きゃ きゅ きょ, しゃ しゅ しょ, etc.  
│   ├── Small っ / ッ  
│   ├── Long vowels  
│   ├── Similar-looking kana drills  
│   └── Kana mastery test

### **Module 2: JLPT N5**

The N5 module should be added after kana.

Initial N5 module structure:

JLPT N5  
├── Core Vocabulary  
├── Basic Kanji  
├── Grammar Patterns  
├── Particles  
├── Verb Forms  
├── Sentence Practice  
├── Reading Practice  
├── Listening Practice  
└── N5 Review Tests

For the first MVP, the N5 page can exist as a module shell with some seed content. It does not need to be complete on day one.

---

## **8\. Learning Content Types**

The app should support these item types:

type LearningItemType \=  
  | "kana"  
  | "vocab"  
  | "kanji"  
  | "grammar"  
  | "sentence";

### **Kana item example**

{  
  "id": "hiragana\_a",  
  "type": "kana",  
  "level": "kana",  
  "moduleId": "kana-foundations",  
  "lessonId": "hiragana-vowels",  
  "japanese": "あ",  
  "reading": "a",  
  "romaji": "a",  
  "meaning": "hiragana character for 'a'",  
  "metadata": {  
    "script": "hiragana",  
    "row": "vowel",  
    "variationType": "basic"  
  }  
}

### **Vocabulary item example**

{  
  "id": "n5\_vocab\_watashi",  
  "type": "vocab",  
  "level": "N5",  
  "moduleId": "jlpt-n5",  
  "lessonId": "n5-self-introduction",  
  "japanese": "私",  
  "reading": "わたし",  
  "romaji": "watashi",  
  "meaning": "I; me",  
  "metadata": {  
    "partOfSpeech": "pronoun"  
  }  
}

### **Kanji item example**

{  
  "id": "n5\_kanji\_person",  
  "type": "kanji",  
  "level": "N5",  
  "moduleId": "jlpt-n5",  
  "lessonId": "n5-basic-kanji-1",  
  "japanese": "人",  
  "reading": "ひと / ジン / ニン",  
  "romaji": "hito / jin / nin",  
  "meaning": "person",  
  "metadata": {  
    "onyomi": \["ジン", "ニン"\],  
    "kunyomi": \["ひと"\],  
    "strokeCount": 2  
  }  
}

### **Grammar item example**

{  
  "id": "n5\_grammar\_wa\_desu",  
  "type": "grammar",  
  "level": "N5",  
  "moduleId": "jlpt-n5",  
  "lessonId": "n5-self-introduction",  
  "japanese": "A は B です",  
  "reading": "A wa B desu",  
  "meaning": "A is B",  
  "explanation": "Used to state that A is B. は marks the topic.",  
  "metadata": {  
    "pattern": "A は B です",  
    "examples": \[  
      {  
        "ja": "私は学生です。",  
        "kana": "わたしはがくせいです。",  
        "en": "I am a student."  
      }  
    \]  
  }  
}

### **Sentence item example**

{  
  "id": "n5\_sentence\_001",  
  "type": "sentence",  
  "level": "N5",  
  "moduleId": "jlpt-n5",  
  "lessonId": "n5-self-introduction",  
  "japanese": "私は学生です。",  
  "reading": "わたしはがくせいです。",  
  "romaji": "watashi wa gakusei desu",  
  "meaning": "I am a student.",  
  "metadata": {  
    "grammarIds": \["n5\_grammar\_wa\_desu"\],  
    "vocabIds": \["n5\_vocab\_watashi", "n5\_vocab\_gakusei"\]  
  }  
}

---

## **9\. Practice Types**

The app should support Duolingo-style practice modes.

Initial MVP practice types:

type PracticeType \=  
  | "flashcard"  
  | "multiple\_choice"  
  | "match\_pairs"  
  | "type\_answer"  
  | "fill\_blank"  
  | "sentence\_reorder";

### **Practice type priorities**

Build in this order:

1. Flashcard reveal  
2. Multiple choice  
3. Match pairs  
4. Type answer  
5. Fill blank  
6. Sentence reorder

### **Flashcard**

Example:

Front: あ  
Back: a  
Rating: Again / Hard / Good / Easy

### **Multiple choice**

Example:

Prompt: What sound does あ represent?

Choices:  
\- a  
\- i  
\- u  
\- e

Correct: a

### **Match pairs**

Example:

Match:  
あ → a  
い → i  
う → u  
え → e  
お → o

### **Type answer**

Example:

Prompt: Type the romaji for あ.  
Correct answer: a

### **Fill blank**

Example:

Prompt: 私＿学生です。  
Choices: は, を, に, で  
Correct: は

### **Sentence reorder**

Example:

Prompt: Build “I am a student.”  
Blocks: 私 / は / 学生 / です  
Correct: 私 は 学生 です

---

## **10\. Review and SRS System**

The app should use a simple SRS system first.

Review ratings:

Again  
Hard  
Good  
Easy

Initial interval rules:

Again → 5 minutes  
Hard → 1 day  
Good → 3 days  
Easy → 7 days

Later, this can be replaced with a more advanced FSRS/Anki-like algorithm.

Each learning item should have progress state:

type ItemStatus \=  
  | "new"  
  | "learning"  
  | "reviewing"  
  | "mastered"  
  | "difficult";

Suggested rules:

* New item becomes `learning` after first practice.  
* After enough correct reviews, it becomes `reviewing`.  
* After repeated successful long-interval reviews, it becomes `mastered`.  
* Repeated wrong answers can mark it as `difficult`.

---

## **11\. Progress Tracking**

Track progress at multiple levels.

### **Daily progress**

* XP earned today  
* Reviews completed today  
* New items learned today  
* Accuracy today  
* Streak active or not  
* Daily goal completed or not

### **Module progress**

* Kana Foundations progress  
* Hiragana progress  
* Katakana progress  
* Variations progress  
* N5 progress

### **Item progress**

For each item:

* Status  
* Correct count  
* Wrong count  
* Last reviewed date  
* Next due date  
* Ease  
* Interval days

### **Practice history**

For each attempt:

* Item  
* Practice type  
* Prompt  
* Correct answer  
* User answer  
* Correct/incorrect  
* Time taken  
* Date

---

## **12\. Streak Logic**

A streak should count if the user completes the daily goal.

Initial daily goal:

Complete at least 10 practice/review actions in a day.

Alternative daily goal later:

Earn at least 50 XP in a day.

Streak fields:

* Current streak  
* Longest streak  
* Last active date  
* Daily goal status

For personal use, use local timezone behavior. The user is in America/Chicago.

---

## **13\. XP System**

Use a simple XP system.

Suggested XP values:

Correct flashcard review: \+5 XP  
Correct multiple choice: \+5 XP  
Correct type answer: \+8 XP  
Correct fill blank: \+8 XP  
Correct sentence reorder: \+10 XP  
Complete lesson: \+25 XP  
Complete daily goal: \+20 XP bonus

Wrong answers can still give small learning XP if desired, but initial MVP can award XP only for correct answers.

---

## **14\. Database Schema**

Use Drizzle \+ SQLite.

Recommended tables:

modules  
lessons  
learning\_items  
user\_item\_progress  
practice\_attempts  
daily\_stats  
streaks

### **modules**

Represents large sections like Kana Foundations or JLPT N5.

Fields:

id: string  
title: string  
description: string  
level: string  
orderIndex: number  
isUnlocked: boolean  
createdAt: Date  
updatedAt: Date

### **lessons**

Represents lessons inside modules.

Fields:

id: string  
moduleId: string  
title: string  
description: string  
orderIndex: number  
lessonType: string  
isUnlocked: boolean  
createdAt: Date  
updatedAt: Date

### **learning\_items**

Stores kana, vocab, kanji, grammar, and sentence items.

Fields:

id: string  
type: "kana" | "vocab" | "kanji" | "grammar" | "sentence"  
level: "kana" | "N5" | "N4" | "N3" | "N2" | "N1"  
moduleId: string  
lessonId: string  
japanese: string  
reading: string | null  
romaji: string | null  
meaning: string  
explanation: string | null  
metadataJson: string | null  
createdAt: Date  
updatedAt: Date

### **user\_item\_progress**

Tracks SRS and mastery for each learning item.

Fields:

id: string  
itemId: string  
status: "new" | "learning" | "reviewing" | "mastered" | "difficult"  
ease: number  
intervalDays: number  
dueAt: Date | null  
correctCount: number  
wrongCount: number  
lastReviewedAt: Date | null  
createdAt: Date  
updatedAt: Date

### **practice\_attempts**

Tracks all user practice answers.

Fields:

id: string  
itemId: string  
practiceType: "flashcard" | "multiple\_choice" | "match\_pairs" | "type\_answer" | "fill\_blank" | "sentence\_reorder"  
prompt: string  
correctAnswer: string  
userAnswer: string | null  
isCorrect: boolean  
timeTakenMs: number | null  
createdAt: Date

### **daily\_stats**

Tracks daily activity.

Fields:

date: string  
xp: number  
reviewsCompleted: number  
newItemsLearned: number  
practiceAttempts: number  
correctAttempts: number  
wrongAttempts: number  
dailyGoalCompleted: boolean  
createdAt: Date  
updatedAt: Date

### **streaks**

For single-user personal app, one row is enough.

Fields:

id: string  
currentStreak: number  
longestStreak: number  
lastActiveDate: string | null  
createdAt: Date  
updatedAt: Date

---

## **15\. Suggested Folder Structure**

japanese-learning-app/  
├── app/  
│   ├── page.tsx  
│   ├── layout.tsx  
│   ├── globals.css  
│   ├── dashboard/  
│   │   └── page.tsx  
│   ├── learn/  
│   │   ├── page.tsx  
│   │   ├── kana/  
│   │   │   ├── page.tsx  
│   │   │   ├── hiragana/  
│   │   │   │   └── page.tsx  
│   │   │   ├── katakana/  
│   │   │   │   └── page.tsx  
│   │   │   └── variations/  
│   │   │       └── page.tsx  
│   │   └── n5/  
│   │       └── page.tsx  
│   ├── lesson/  
│   │   └── \[lessonId\]/  
│   │       └── page.tsx  
│   ├── practice/  
│   │   ├── page.tsx  
│   │   └── \[mode\]/  
│   │       └── page.tsx  
│   ├── review/  
│   │   └── page.tsx  
│   ├── library/  
│   │   ├── page.tsx  
│   │   ├── kana/  
│   │   │   └── page.tsx  
│   │   ├── vocabulary/  
│   │   │   └── page.tsx  
│   │   ├── kanji/  
│   │   │   └── page.tsx  
│   │   └── grammar/  
│   │       └── page.tsx  
│   ├── progress/  
│   │   └── page.tsx  
│   └── settings/  
│       └── page.tsx  
│  
├── components/  
│   ├── ui/  
│   ├── layout/  
│   │   ├── app-sidebar.tsx  
│   │   ├── top-nav.tsx  
│   │   └── mobile-nav.tsx  
│   ├── dashboard/  
│   │   ├── daily-goal-card.tsx  
│   │   ├── streak-card.tsx  
│   │   ├── continue-learning-card.tsx  
│   │   ├── reviews-due-card.tsx  
│   │   └── progress-overview.tsx  
│   ├── lesson/  
│   │   ├── lesson-card.tsx  
│   │   ├── lesson-path.tsx  
│   │   ├── module-header.tsx  
│   │   └── item-preview-card.tsx  
│   ├── practice/  
│   │   ├── flashcard.tsx  
│   │   ├── multiple-choice-question.tsx  
│   │   ├── match-pairs-question.tsx  
│   │   ├── type-answer-question.tsx  
│   │   ├── fill-blank-question.tsx  
│   │   └── sentence-reorder-question.tsx  
│   ├── review/  
│   │   ├── review-card.tsx  
│   │   └── srs-rating-buttons.tsx  
│   ├── library/  
│   │   ├── item-table.tsx  
│   │   ├── item-card.tsx  
│   │   └── item-filters.tsx  
│   └── progress/  
│       ├── progress-chart.tsx  
│       ├── accuracy-card.tsx  
│       └── module-progress-list.tsx  
│  
├── data/  
│   ├── modules.json  
│   ├── lessons.json  
│   ├── kana/  
│   │   ├── hiragana.json  
│   │   ├── katakana.json  
│   │   └── variations.json  
│   └── jlpt/  
│       ├── n5\_vocab.json  
│       ├── n5\_kanji.json  
│       ├── n5\_grammar.json  
│       └── n5\_sentences.json  
│  
├── db/  
│   ├── index.ts  
│   ├── schema.ts  
│   ├── seed.ts  
│   └── migrations/  
│  
├── lib/  
│   ├── srs.ts  
│   ├── progress.ts  
│   ├── streak.ts  
│   ├── xp.ts  
│   ├── practice.ts  
│   ├── data.ts  
│   ├── utils.ts  
│   └── constants.ts  
│  
├── scripts/  
│   ├── seed.ts  
│   └── reset-db.ts  
│  
├── public/  
│   └── audio/  
│  
├── PROJECT\_CONTEXT.md  
├── README.md  
├── package.json  
├── drizzle.config.ts  
├── tailwind.config.ts  
└── tsconfig.json

---

## **16\. Seed Data Plan**

Start with local JSON seed files.

### **modules.json**

Should include:

\[  
  {  
    "id": "kana-foundations",  
    "title": "Kana Foundations",  
    "description": "Learn hiragana, katakana, and kana variations from zero.",  
    "level": "kana",  
    "orderIndex": 1,  
    "isUnlocked": true  
  },  
  {  
    "id": "jlpt-n5",  
    "title": "JLPT N5",  
    "description": "Beginner vocabulary, kanji, grammar, and sentence practice.",  
    "level": "N5",  
    "orderIndex": 2,  
    "isUnlocked": false  
  }  
\]

### **lessons.json**

Should include lesson groups like:

\[  
  {  
    "id": "hiragana-vowels",  
    "moduleId": "kana-foundations",  
    "title": "Hiragana Vowels",  
    "description": "Learn あ, い, う, え, お.",  
    "orderIndex": 1,  
    "lessonType": "kana",  
    "isUnlocked": true  
  },  
  {  
    "id": "hiragana-k-row",  
    "moduleId": "kana-foundations",  
    "title": "Hiragana K-row",  
    "description": "Learn か, き, く, け, こ.",  
    "orderIndex": 2,  
    "lessonType": "kana",  
    "isUnlocked": false  
  }  
\]

---

## **17\. Dashboard Requirements**

The dashboard should be the main entry point.

It should show:

* Greeting  
* Current streak  
* Daily goal progress  
* XP today  
* Reviews due  
* Continue learning card  
* Kana progress  
* N5 progress  
* Weak/difficult items  
* Quick action buttons

Quick actions:

Continue Learning  
Review Due Cards  
Practice Kana  
Open Library  
View Progress

Example dashboard copy:

Welcome back.  
Keep your Japanese streak alive today.

Today's Goal: 0 / 10 actions  
Reviews Due: 12  
Current Streak: 3 days  
Kana Progress: 42%  
Next Lesson: Hiragana K-row

---

## **18\. Lesson Page Requirements**

A lesson page should:

* Show lesson title and description  
* Show learning items in the lesson  
* Allow user to start practice  
* Show progress within the lesson  
* Show completed/new status  
* Lock future lessons until enough progress is made

For kana lessons:

* Show character  
* Show romaji  
* Show pronunciation hint  
* Show examples if available  
* Practice using flashcards, multiple choice, match pairs, and typing

---

## **19\. Review Page Requirements**

The review page should:

* Fetch items that are due  
* Show one item at a time  
* Let user answer or reveal  
* Let user rate Again/Hard/Good/Easy  
* Update SRS progress  
* Update XP  
* Update daily stats  
* Update streak if daily goal is completed

Review flow:

Load due items  
Show review card  
User answers/reveals  
User chooses rating  
Update due date  
Move to next card  
Show session summary

Session summary should show:

* Reviews completed  
* Correct count  
* Wrong count  
* XP earned  
* Items mastered  
* Accuracy

---

## **20\. Practice Hub Requirements**

The practice hub should let the user choose:

Kana Practice  
Vocabulary Practice  
Grammar Practice  
Mixed Practice  
Weak Items  
Random Review

Each mode can use available item types and practice types.

Initial practice should be simple and local.

---

## **21\. Library Requirements**

The library should be a browseable reference area.

Sections:

Kana  
Vocabulary  
Kanji  
Grammar  
Sentences

Features:

* Search  
* Filter by module  
* Filter by lesson  
* Filter by level  
* Filter by status  
* Show item details  
* Show progress state

The library should feel like study materials, not just raw database rows.

---

## **22\. Progress Page Requirements**

The progress page should show:

* Overall progress  
* Kana progress  
* Hiragana progress  
* Katakana progress  
* Variations progress  
* N5 progress  
* Current streak  
* Longest streak  
* Accuracy  
* Total XP  
* Total practice attempts  
* Total reviews completed  
* Difficult items

Initial charts can be simple cards and progress bars.

Avoid complex charts unless needed.

---

## **23\. Settings Page Requirements**

For personal use, settings can be minimal.

Initial settings:

* Daily goal target  
* Theme mode  
* Reset progress  
* Reset database/dev only  
* Data import/export later

---

## **24\. Future Features**

Do not build these yet, but keep architecture open.

### **Writing/handwriting practice**

Later feature:

* Canvas input  
* Stroke capture as vector paths  
* Reference stroke data  
* Stroke count/order/direction matching  
* Kana first  
* N5 kanji later

### **AI writing correction**

Later feature:

* User writes Japanese sentence  
* AI corrects grammar  
* AI explains in English  
* AI tags mistakes by grammar point

### **AI conversation tutor**

Later feature:

* Speech-to-text  
* LLM response  
* Text-to-speech  
* Beginner/N5 roleplay  
* Mistake tracking

### **Migaku-style immersion**

Later feature:

* Paste Japanese text  
* Parse words  
* Dictionary popup  
* Save unknown words  
* Create sentence cards  
* Reading difficulty estimate

---

## **25\. Development Priorities**

Build in this order.

### **Phase 1: Project foundation**

* Initialize Next.js with TypeScript  
* Add Tailwind  
* Add shadcn/ui  
* Add Drizzle \+ SQLite  
* Create schema  
* Create seed script  
* Add basic layout/nav  
* Add sample data

### **Phase 2: Dashboard and roadmap**

* Dashboard page  
* Learn page  
* Kana module page  
* Lesson cards  
* Progress cards  
* Basic locked/unlocked lesson logic

### **Phase 3: Flashcards and reviews**

* Flashcard component  
* Review page  
* SRS rating buttons  
* SRS update logic  
* Due review query  
* Practice attempts tracking

### **Phase 4: Practice tests**

* Multiple choice  
* Match pairs  
* Type answer  
* Fill blank  
* Sentence reorder  
* Practice session summary

### **Phase 5: Progress and polish**

* Progress page  
* Library page  
* Streak logic  
* XP logic  
* Animations  
* Empty states  
* Mobile polish

### **Phase 6: N5 starter content**

* N5 vocabulary seed  
* N5 kanji seed  
* N5 grammar starter lessons  
* Basic sentence practice

---

## **26\. Coding Principles**

Use these principles while building:

* Keep it simple.  
* Prefer clean, typed functions.  
* Avoid overengineering.  
* Store content in JSON first.  
* Seed database from JSON.  
* Keep UI reusable.  
* Keep SRS logic isolated in `lib/srs.ts`.  
* Keep progress logic isolated in `lib/progress.ts`.  
* Keep streak logic isolated in `lib/streak.ts`.  
* Keep XP logic isolated in `lib/xp.ts`.  
* Avoid AI code in MVP.  
* Avoid handwriting code in MVP.  
* Make the app feel polished even if the content is small.

---

## **27\. Important Constraints**

* This is currently a personal app for one user.  
* Keep it free.  
* Avoid paid APIs.  
* Avoid complicated backend services.  
* Avoid authentication initially.  
* Use SQLite locally.  
* Make it easy to migrate later if needed.  
* Make it visually appealing.  
* First useful learning goal: kana mastery.  
* Second useful learning goal: JLPT N5 foundations.

---

## **28\. Definition of Done for MVP**

The MVP is done when:

* The app has a polished dashboard.  
* Kana Foundations module exists.  
* Hiragana, katakana, and variations are represented.  
* User can start lessons.  
* User can practice kana with flashcards and tests.  
* User can review due items.  
* SRS due dates update.  
* Daily stats update.  
* Streak updates.  
* Progress page shows meaningful progress.  
* Library page allows browsing materials.  
* N5 module exists with starter vocabulary, kanji, grammar, and sentences.  
* The app is usable daily for personal Japanese study.

---

## **29\. Recommended First Task for Codex**

Start by scaffolding the project with:

npx create-next-app@latest japanese-learning-app \--typescript \--tailwind \--eslint \--app

Then add:

npm install drizzle-orm better-sqlite3  
npm install \-D drizzle-kit @types/better-sqlite3  
npx shadcn@latest init

Then create:

PROJECT\_CONTEXT.md  
db/schema.ts  
db/index.ts  
db/seed.ts  
data/modules.json  
data/lessons.json  
data/kana/hiragana.json  
data/kana/katakana.json  
data/kana/variations.json  
lib/srs.ts  
lib/xp.ts  
lib/streak.ts  
lib/progress.ts

First implementation goal:

Build the data model, seed kana data, create the dashboard, and show the Kana Foundations roadmap.

---

## **30\. Current Project Decision Summary**

Final confirmed decisions:

Project type:  
Personal Japanese learning app

Primary inspiration:  
Duolingo \+ NihonDex \+ Anki

Initial focus:  
Kana \+ N5 foundations

First features:  
Dashboard, roadmap, flashcards, practice tests, reviews, progress, streaks

Deferred:  
Writing/stroke matching, AI tutor, voice conversation, immersion mining

Tech stack:  
Next.js \+ TypeScript \+ Tailwind \+ shadcn/ui \+ SQLite \+ Drizzle

Database:  
Local SQLite

Content:  
Local JSON seed data

UI:  
Pretty, modern, gamified, beginner-friendly

Goal:  
Make a useful daily Japanese learning app that can later grow into a larger product.

---

## **31\. Implementation Update: Complete Kana and Audio**

The Kana Foundations seed data has been expanded beyond placeholder rows.

Current kana JSON includes:

* 46 basic hiragana
* 46 basic katakana
* dakuten kana
* handakuten kana
* yoon/compound kana
* small っ / ッ entries
* katakana long-vowel mark
* similar-looking kana drill entries

Each kana seed item now includes:

* `audioSrc`
* standard romaji mapping
* script metadata
* row metadata
* variation type metadata

Audio path convention:

`/audio/kana/{romaji}.mp3`

The app does not require downloaded audio files for the MVP. Pronunciation buttons first try `audioSrc`; if playback fails or the file is missing, they fall back to browser speech synthesis with `ja-JP` and a slower rate.

Library organization has been updated so kana and kanji are separated instead of all seed items being dumped into one grid:

* Hiragana
* Katakana
* Kana Variations
* Kanji
* N5 Starter Materials

---

## **32\. Implementation Update: Review MVP**

The MVP now separates kana Learn, Review, and Practice.

Current behavior:

* `/learn/kana` uses Hiragana and Katakana tabs.
* Shared kana skills such as dakuten, handakuten, yoon, small tsu, long vowels, and similar-looking drills are shown separately.
* `/library/kana` uses Hiragana and Katakana tabs.
* Hiragana basics and hiragana variations are separated.
* Katakana basics and katakana variations are separated.
* Speaker buttons use browser TTS only for now.
* TTS is debounced to avoid double playback on one click.
* TTS uses `ja-JP` and a slower beginner-friendly rate.
* Learn uses a spotlight overlay for first-time exposure: one character at a time, auto-play pronunciation, speaker replay, previous/next, and Done.
* Closing/completing a Learn row marks its kana as introduced.
* Review uses a smooth flip card for introduced/practicing kana.
* Review does not use Again / Hard / Good / Easy for kana.
* Practice is scored and requires typed romaji input.
* Practice attempts are persisted to `practice_attempts`.
* Kana progress is updated in `user_item_progress`.

Kana now uses a target-count progress model instead of SRS ratings:

* `new`
* `introduced`
* `practicing`
* `learned`

Tracked kana progress fields:

* `introducedAt`
* `correctAttemptCount`
* `practiceAttemptCount`
* `targetCorrectAttempts`
* `learnedAt`
* `status`

SRS code remains available for later vocabulary/kanji work, but kana currently uses this simpler target-count model.

---

## **33\. Implementation Update: Mixed Practice Sessions**

Kana practice now uses a capped mixed-session model instead of a single typing card.

Current mixed practice behavior:

* Practice sessions include up to 12 questions.
* Question types are varied randomly across the selected content.
* Supported kana practice types:
  * multiple choice
  * match pairs
  * type answer
  * audio recognition
* Kana practice avoids romaji-to-kana typed answers because there is no Japanese keyboard or writing input yet.
* Fill-blank grammar/sentence practice is deferred until sentence content can be generated or authored correctly.
* Multiple choice gives immediate feedback after selecting one answer.
* Type answer can resolve as soon as the normalized answer matches, or when Enter / Check is used.
* Audio recognition auto-plays once when shown, asks for romaji after listening, and keeps a large replay button.
* Match pairs uses two separated columns for Japanese and romaji; each selected pair is judged immediately.
* Wrong match pairs are highlighted and explained, but the learner continues matching the rest of the pairs before moving on.
* Wrong non-matching answers show the correct answer and wait for the learner to press Next.
* Wrong answers are shown again once later in the same session.
* `/practice` without manual selection uses introduced/practicing kana only.
* Manually selected practice from `/learn/kana` routes to `/practice` and uses exactly the selected lesson rows, even if some kana are already learned.
* If no introduced/practicing kana remain in `/practice`, the app shows that everything learned so far has been mastered.

---

## **34\. Implementation Update: Unified Background-Generated Practice**

Practice is one unified user-facing session at `/practice`.

It starts immediately using introduced/practicing kana and any valid generated questions already stored locally. It never waits for a Gemini request.

Gemini background generation uses:

```env
GEMINI_API_KEY=your-gemini-api-key
GEMINI_SIMPLE_MODEL=gemini-2.5-flash-lite
GEMINI_STRONG_MODEL=gemini-2.5-flash
```

Current architecture:

* completing a Kana Learn row runs one coverage check for the full introduced row chunk
* individual kana practice answers do not trigger Gemini generation
* recently completed row jobs have a cooldown to prevent repeated low-coverage calls
* fewer than 3 usable stored questions can enqueue a deduplicated local generation job
* Gemini Flash-Lite is used first and Gemini Flash is the validation/retry fallback
* Gemini uses structured output with a response JSON schema
* app-side validation remains strict before storage
* active generated questions and usage metadata are stored in `generated_practice_questions`
* pending/running/completed/failed work is tracked in `question_generation_jobs`
* generated questions respect learned-kanji scope; no learned kanji means kana-only output
* existing static kana practice remains the fallback when generated questions are unavailable

This is intentionally not a chatbot, voice tutor, handwriting feature, image feature, auth system, or cloud sync integration.
