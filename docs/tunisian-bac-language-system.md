# Tunisian Bac Language System

## Goal

Build one scalable language pathway for Tunisian Baccalaureate students focused only on:

- English
- French
- Optional languages: Spanish, German, Italian

The system must solve six recurring problems:

- weak grammar control
- limited vocabulary
- poor writing structure
- slow reading comprehension
- fear of speaking
- inconsistent practice

## Structure

Each pathway follows the same tree:

`Language -> Level -> Skill -> Lesson -> Explanation -> Example -> Exercise -> Correction`

### Levels

- English: `A1 -> B2`
- French: `A1 -> B2`
- Optional languages: `A1 -> B1`

### Skill mapping in the product

- `grammar`: rules, tenses, forms, common errors
- `vocabulary`: high-frequency words, Bac themes, collocations
- `structure`: paragraph, essay, and argumentative writing
- `comprehension`: reading strategies and text analysis
- `communication`: speaking, roleplay, confidence, practical language
- `pronunciation`: sounds, stress, rhythm, clarity

## Core design choices

### 1. Micro-learning first

Every lesson is short enough to finish in `5 to 10 minutes`.

Each lesson includes:

- one clear explanation
- one model example
- one small exercise
- one direct correction
- one high-frequency mistake
- Arabic clarification when it helps

### 2. Bac-first progression

English and French focus on:

- grammar that appears often in Bac tasks
- vocabulary from education, environment, technology, society, and economy
- paragraph and essay structure
- reading strategies like skimming, scanning, and inference

### 3. Communication-first optional mode

Spanish, German, and Italian do not overload students with theory.

They prioritize:

- self-introduction
- school and travel dialogues
- present tense and near-future basics
- short opinions with one reason

## Writing correction logic

When correcting student writing, the system should check:

1. task response: did the student answer the exact prompt?
2. structure: is there a clear introduction, body, and conclusion when needed?
3. grammar: are tense choice, agreement, and sentence control correct?
4. vocabulary: are theme words precise and repeated intelligently?
5. coherence: do connectors and paragraph order make sense?

The correction output should always end with:

- one strength
- one priority mistake
- one next step

## Reading methodology

The reading track trains students to:

- skim for the global idea
- scan for names, dates, and details
- infer meaning from context
- answer without copying blindly from the text

## Weekly usage loop

Recommended weekly rhythm:

1. `2` grammar lessons
2. `2` vocabulary or reading lessons
3. `1` writing structure lesson
4. `2` speaking or roleplay drills
5. `1` timed Bac writing task

## Implementation in this repo

The repo now contains:

- `src/data/language-system.json`: the shared multilingual curriculum map
- `src/lib/language-system.ts`: typed helpers for the roadmap UI
- `prisma/seed-language-system.js`: seed that turns the roadmap into lessons and exercises

This keeps the system scalable: new lessons can be added to the JSON tree without changing the UI pattern.
