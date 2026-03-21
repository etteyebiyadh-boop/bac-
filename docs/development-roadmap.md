# Development Roadmap

## 1. Current baseline in this repo

The existing codebase is a working `phase-1 English MVP` with:

- Next.js App Router frontend
- Prisma schema for users, submissions, and exams
- OpenAI-backed essay correction
- auth flow
- basic dashboard
- exam library

This is enough to launch a narrow wedge. It is not yet the full multilingual bac prep product.

## 2. 7-day sprint plan

### Day 1: lock scope and content
- freeze phase-1 scope to English writing correction
- finalize 10 to 15 English exam prompts
- create scoring rubric benchmark samples
- write landing copy that clearly states English-first MVP

### Day 2: correction quality and trust
- calibrate the AI prompt against benchmark essays
- add confidence review workflow in admin notes
- refine result view copy to feel examiner-like, not generic

### Day 3: dashboard and daily loop
- add "next best action" logic
- add a simple daily mission card
- surface weak-skill recommendations after each submission

### Day 4: monetization surfaces
- add pricing page or modal
- improve free limit messaging
- place paywall after a clear value moment

### Day 5: content ops
- define lesson and exercise content schema
- create the first 20 smart lessons
- create 100 to 150 micro exercise items

### Day 6: analytics and QA
- instrument activation, retention, and paywall events
- test mobile responsiveness and load times
- validate seeded content quality

### Day 7: launch
- publish landing page
- enable production env vars and database
- run soft launch with a small student cohort
- collect first teacher and student feedback

## 3. Data model expansion for phase 2

### New user profile fields
- `section`
- `targetScore`
- `primaryLanguage`
- `schoolName`
- `examYear`

### New core entities
- `Lesson`
- `Exercise`
- `ExerciseAttempt`
- `DailyMission`
- `RewardEvent`
- `Achievement`
- `LanguageTrack`
- `TopicTag`

### Why these matter
- lessons and exercises unlock daily repetition
- reward events make gamification queryable
- profile fields improve personalization and segmentation

## 4. API roadmap

### Keep
- `POST /api/correct`
- `GET /api/exams`
- `GET /api/dashboard`

### Add next
- `GET /api/lessons`
- `GET /api/exercises/daily`
- `POST /api/exercises/attempt`
- `GET /api/missions/today`
- `POST /api/missions/complete`
- `GET /api/pricing`

## 5. 30 / 60 / 90 day roadmap

### First 30 days
- launch English MVP publicly
- add recommendation logic from correction output to lesson IDs
- add daily exercises and one mission per day
- publish pricing and upgrade flow

### First 60 days
- expand to French and Arabic correction rubrics
- add multilingual exam library filters
- launch teacher-reviewed calibration workflow
- add score trend charts and weak-topic heatmap

### First 90 days
- add optional languages where content quality is ready
- add OCR-assisted handwritten draft upload
- launch school and coaching-center partnerships
- add referral system

## 6. Team plan

### Solo founder minimum
- product/PM: scope, pricing, launch priorities
- engineer: app, backend, analytics
- content lead: exam curation, lessons, exercises
- teacher reviewer: rubric calibration and QA

### If hiring one extra role first
Hire a content and pedagogy lead before hiring another engineer. Content quality is the moat.

## 7. Launch checklist

- env vars configured
- database migrated and seeded
- first premium offer configured
- analytics events verified
- mobile QA complete
- correction output reviewed by at least one teacher
- support contact and privacy copy added
