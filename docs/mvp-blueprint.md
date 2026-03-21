# BacLang English MVP Blueprint

This file describes the current implemented wedge. For the broader multilingual product direction,
see `docs/product-prd.md`, `docs/engagement-and-monetization.md`,
`docs/development-roadmap.md`, and `docs/technical-blueprint.md`.

## 1. Product architecture

### Positioning
- Target user: Tunisian Baccalaureate students in language sections who need higher English writing scores.
- Core promise: move students toward `15+/20` with fast feedback loops, not long passive courses.
- MVP scope: English only, AI essay correction, 5 bac exams, signup/login, progress dashboard.

### Product modules
- Acquisition layer: landing page, signup, login, freemium CTA.
- Practice layer: write page with free writing mode and exam-linked writing mode.
- Feedback layer: AI correction with bac-style score, corrected version, strengths, and improvements.
- Content layer: curated exam bank with year, difficulty, model answer, and correction methodology.
- Retention layer: dashboard with latest score, best score, streak, and weekly usage.
- Monetization layer: free weekly correction cap with `isPremium` expansion path.

### North-star learning loop
1. Student chooses a bac prompt or custom prompt.
2. Student writes an essay in one screen.
3. AI scores grammar, vocabulary, and structure out of 20.
4. Submission is stored and shown in the dashboard.
5. Student repeats with the next weakest skill.

## 2. Database schema

### `User`
- `id`
- `email`
- `passwordHash`
- `fullName`
- `isPremium`
- `createdAt`

### `Exam`
- `id`
- `slug`
- `language`
- `year`
- `title`
- `prompt`
- `modelAnswer`
- `methodology`
- `difficulty`
- `estimatedMinutes`

### `Submission`
- `id`
- `userId`
- `examId`
- `language`
- `submissionType`
- `promptText`
- `originalText`
- `correctedText`
- `overallScore`
- `grammarScore`
- `vocabularyScore`
- `structureScore`
- `feedbackJson`
- `wordCount`
- `createdAt`

### Why this schema works for the MVP
- Keeps scoring queryable without over-modeling every feedback bullet.
- Preserves future expansion to French/Arabic/Spanish/German/Italian through `language`.
- Supports monetization, analytics, and progress tracking with minimal tables.

## 3. API endpoints

### Auth
- `POST /api/auth/signup`
  - Creates account, hashes password, sets session cookie.
- `POST /api/auth/login`
  - Verifies credentials, sets session cookie.
- `POST /api/auth/logout`
  - Clears session cookie.

### Core learning
- `POST /api/correct`
  - Input: `promptText?`, `studentText`, `examId?`
  - Output: `overallScore`, `grammarScore`, `vocabularyScore`, `structureScore`, `summary`, `correctedText`, `strengths`, `improvements`, `remainingFreeCorrections`
  - Rules: requires auth, enforces free weekly correction limit, persists submission.

### Content
- `GET /api/exams`
  - Returns the exam list for the English MVP.
- `GET /api/exams?examId=...`
  - Returns one exam detail record.

### Progress
- `GET /api/dashboard`
  - Returns plan type, usage stats, streak, averages, and recent submissions.

## 4. Frontend pages structure

### `/`
- Hero proposition for bac-English students
- Feature blocks for correction, exam practice, and dashboard
- Freemium plan explanation

### `/auth/signup`
- Free account creation
- Fast entry into the learning loop

### `/auth/login`
- Returning learner access

### `/dashboard`
- Latest score
- Best score
- Current streak
- Weekly correction usage
- Skill averages
- Recent submissions

### `/exams`
- 5 bac exam cards
- Prompt, difficulty, methodology, model answer
- CTA to practice each prompt

### `/write`
- Exam selector
- Prompt context
- Essay editor
- Result view with score breakdown and corrected version

## 5. Step-by-step development plan

1. Lock the MVP to English and define the 5 strongest bac prompts.
2. Finalize the scoring rubric for grammar, vocabulary, and structure.
3. Stabilize auth and session handling.
4. Persist submissions and user-scoped analytics.
5. Tune the AI prompt until scores feel bac-realistic.
6. Add the freemium guardrail: limited free corrections, premium placeholder.
7. Polish the mobile UX and reduce friction on the write flow.
8. Seed real exam content and validate content quality with a teacher.
9. Add admin tooling or CSV import for more exams after MVP validation.
10. Expand into daily practice, smart lessons, and speaking only after writing retention is strong.

## 6. Sample UI descriptions

### Landing
- Warm cream background with deep teal CTAs and strong serif headlines.
- Immediate value proposition: `15+/20 in Bac English`.
- Shows the product as focused, premium, and mobile-first.

### Write screen
- Single-column mobile editor with exam selector on top.
- Prompt context appears above the essay field.
- Result card appears below with a score, three skill bars, strengths, improvements, and corrected text.

### Dashboard
- Four stat cards at the top.
- Skill averages in the middle.
- Recent attempts list at the bottom.
- One-tap CTA back into writing or exam practice.
