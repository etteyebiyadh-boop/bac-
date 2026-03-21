# BacLang Technical Blueprint

## Purpose

This file translates the product strategy into an implementation plan for the current Next.js and
Prisma codebase. It treats the repo as a working `English-first wedge`, then shows how to expand
it into the broader multilingual bac prep product without rewriting the foundation.

## 1. Current baseline

The repository already supports the core phase-1 loop:

- account creation and login
- English bac exam browsing
- AI essay correction
- submission persistence
- dashboard score tracking
- free-plan correction limits

This is enough to validate the wedge. It is not yet enough to support smart lessons, daily
missions, or multilingual expansion cleanly.

## 2. Architecture decisions

### Keep

- `Next.js App Router` for the student experience
- `Prisma + PostgreSQL` for product data and analytics-friendly records
- `OpenAI Responses API` with strict JSON outputs for correction flows

### Add next

- content ingestion workflow for lessons and exercises
- language-aware correction prompts
- gamification event tables
- recommendation layer between corrections and lessons
- analytics instrumentation for activation, retention, and monetization

## 3. Recommended domain model

### Existing models that still work

- `User`
- `Exam`
- `Submission`

### Models to add in phase 2

| Model | Why it exists | Key fields |
| --- | --- | --- |
| `StudentProfile` | Personalization and segmentation | `userId`, `sectionLabel`, `targetScore`, `examYear`, `primaryLanguage`, `secondaryLanguagesJson` |
| `Lesson` | Smart lesson library | `language`, `slug`, `title`, `theme`, `difficulty`, `body`, `takeawaysJson`, `estimatedMinutes` |
| `Exercise` | Daily drills and remediation | `language`, `type`, `prompt`, `choicesJson`, `answerJson`, `explanation`, `difficulty`, `theme` |
| `ExerciseAttempt` | Exercise scoring and progress | `userId`, `exerciseId`, `isCorrect`, `xpEarned`, `createdAt` |
| `DailyMission` | One clear recommended daily action | `userId`, `missionDate`, `language`, `payloadJson`, `status`, `xpReward` |
| `RewardEvent` | XP and streak bookkeeping | `userId`, `eventType`, `value`, `metadataJson`, `createdAt` |
| `Achievement` | Badge unlocks | `userId`, `achievementKey`, `awardedAt` |

### Enum expansion path

```prisma
enum Language {
  ENGLISH
  FRENCH
  ARABIC
  SPANISH
  GERMAN
  ITALIAN
}

enum ExerciseType {
  GRAMMAR
  VOCABULARY
  COMPREHENSION
  PARAGRAPH_ORDER
  MICRO_WRITING
}
```

### Modeling notes

- Keep `sectionLabel` flexible as a string first instead of over-modeling Tunisian school tracks.
- Continue storing rich AI feedback in JSON until patterns are stable enough to normalize.
- Track `language` on every content and progress object so the same system can scale cleanly.

## 4. AI correction system

### Stable response contract

Every language-specific correction should return the same product shape:

```json
{
  "overallScore": 14.5,
  "grammarScore": 13,
  "vocabularyScore": 15,
  "structureScore": 16,
  "summary": "Clear argument but grammar errors reduce accuracy.",
  "correctedText": "....",
  "strengths": ["...."],
  "improvements": ["...."],
  "recommendedLessonSlug": "essay-openings",
  "recommendedExerciseIds": ["ex_101", "ex_205"]
}
```

### Correction pipeline

1. Validate auth, quota, language, and minimum word count.
2. Fetch prompt context from the selected exam if present.
3. Select a language-specific rubric and system prompt.
4. Call the model with strict schema output.
5. Validate and coerce the response with `zod`.
6. Persist submission plus prompt and model metadata.
7. Return remaining quota and the next recommended action.

### Quality controls

- store prompt version and model version with each submission
- benchmark each language with teacher-reviewed essays
- reject essays that are too short for reliable scoring
- add low-confidence review flags before public multilingual rollout

## 5. API roadmap

### Already implemented

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/correct`
- `GET /api/dashboard`
- `GET /api/exams`

### Add next

- `GET /api/lessons`
- `GET /api/exercises/daily`
- `POST /api/exercises/attempt`
- `GET /api/missions/today`
- `POST /api/missions/complete`
- `GET /api/pricing`

## 6. Content operations

### Recommended first content format

Use structured JSON or import scripts with:

- `language`
- `contentType`
- `title`
- `theme`
- `difficulty`
- `prompt`
- `modelAnswer`
- `methodology`
- `estimatedMinutes`

### Content QA flow

1. content draft is written by the pedagogy lead
2. teacher review checks bac fit and mark expectations
3. PM checks metadata completeness and recommendation tags
4. content is seeded into staging
5. final QA verifies rendering and answer keys

## 7. Analytics events to instrument

- `signup_completed`
- `first_exam_opened`
- `essay_submitted`
- `essay_corrected`
- `daily_mission_viewed`
- `daily_mission_completed`
- `paywall_viewed`
- `premium_started`
- `lesson_completed`

## 8. Recommended implementation order

### Immediate

1. Keep the app positioned as `BacLang`, with English as the current live module.
2. Add the strategic docs and keep them consistent with the implemented limits and features.
3. Instrument the current activation and correction funnel.

### Next build cycle

1. add `StudentProfile`
2. add `Lesson` and `Exercise`
3. create one daily mission card on the dashboard
4. attach lesson recommendations to correction output
5. add payment-ready premium surfaces

### After the English wedge proves retention

1. expand correction prompts to French
2. seed the French exam and lesson archive
3. repeat the same pipeline for Arabic
4. launch optional languages only when content QA is strong
