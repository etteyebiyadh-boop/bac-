# BacLang Product PRD

## 1. Product summary

### Vision
Build the default mobile-first study companion for Tunisian Baccalaureate language-section
students who want to reach `15+/20` through daily guided practice, fast feedback, and exam
familiarity.

### Product promise
Students do not need more passive content. They need a tighter learning loop:

1. practice on bac-style tasks
2. get specific correction immediately
3. study the smallest lesson that fixes the mistake
4. repeat daily until the score trend moves

### Wedge strategy
Start with `English writing correction`, because it is painful, repeated, and monetizable. Expand
from that wedge into multilingual language prep and eventually full exam readiness workflows.

## 2. Users and jobs to be done

### Primary user
- Tunisian Bac student in a language-heavy section
- studies on mobile more than desktop
- wants a concrete mark improvement, not generic learning
- struggles with consistency, writing quality, and exam time management

### Secondary users
- parents paying for premium access during exam season
- teachers or coaching centers who want bulk student access later

### Top jobs
- "Correct my essay like a bac examiner."
- "Give me the right past exam for my current level."
- "Show me exactly what to study next."
- "Keep me practicing every day without losing motivation."

## 3. Success metrics

### Business
- free to paid conversion: `5% to 10%` during exam season
- weekly active users / monthly active users: `> 45%`
- average premium retention: `> 2 months` in season

### Learning
- `30%+` of active users submit at least one essay per week
- `3+` study sessions per active learner per week
- average score improvement after 3 corrected essays: `+1.5 to +2.5 points`

### Product
- day-1 retention: `> 35%`
- day-7 retention: `> 25%`
- daily mission completion rate: `> 40%`

## 4. Core feature breakdown

### A. Onboarding and profile

#### Objective
Put each student into the correct learning path within the first 2 minutes.

#### Requirements
- signup with email and password
- capture `section`, `target score`, `preferred language`, `exam year`, and weak areas
- immediate routing to a recommended first task

#### v1 note
Current repo already supports basic auth. Add richer student profile fields in the next phase.

### B. AI essay correction

#### Objective
Make writing correction the flagship habit-forming feature.

#### Inputs
- typed essay
- selected language
- bac prompt or custom prompt
- optional handwritten upload in a later phase

#### Output contract
- overall mark `/20`
- rubric breakdown
- sentence-level corrections
- model rewrite or improved version
- strengths
- top 3 next actions
- confidence or review flag for low-quality AI outputs

#### Rubric by language
- English: grammar, vocabulary, structure, argument relevance
- French: syntax, expression, organization, task fit
- Arabic: grammar, style, clarity, structure
- optional languages: use language-specific rubric templates once content is ready

#### Guardrails
- minimum word count
- anti-copy detection heuristics
- moderation for harmful or irrelevant content
- teacher review samples to calibrate scoring

### C. Past bac exams library

#### Objective
Turn exam familiarity into a repeatable advantage.

#### Requirements
- filter by `subject`, `language`, `year`, `difficulty`, `section`, `session`
- each exam record stores prompt, solution, methodology, estimated time, and recurring themes
- timed simulation mode
- model answer plus "why this answer scores well"

#### v1 content target
- 10 to 15 high-quality exam entries per launch language

### D. Smart lessons

#### Objective
Give students only the lesson needed to fix the mistake they just made.

#### Lesson format
- concept summary in under 5 minutes
- 2 examples
- 1 bac-style mini exercise
- one-page recap

#### High-value lesson categories
- essay structure
- transitions and connectors
- common grammar errors
- theme-based vocabulary
- reading comprehension techniques

### E. Daily exercises

#### Objective
Make progress feel lightweight and daily, not heavy and occasional.

#### Exercise types
- grammar correction
- vocabulary choice
- sentence ordering
- short reading comprehension
- paragraph writing
- exam snippet drills

#### Product rules
- each daily pack takes 10 to 15 minutes
- difficulty adapts using recent results
- every completed pack updates streak, XP, and weakness map

### F. Dashboard and study planner

#### Objective
Reduce confusion about what to do next.

#### Requirements
- current streak
- score trend
- weak topics
- next best action
- correction usage status
- exam countdown

### G. Gamification layer

#### Objective
Create repetition without turning the app into a toy.

#### Mechanics
- XP for lessons, corrections, and daily packs
- streaks
- badges
- weekly challenges
- level labels tied to score readiness bands
- leaderboard by anonymous cohort, school, or city

### H. Admin and content operations

#### Objective
Ship content quickly without developer bottlenecks.

#### Requirements
- add/edit exam entries
- add lessons and exercise packs
- tag content by language, level, theme, and bac skill
- review AI corrections sampled for quality

## 5. MVP scope for a 7-day launch

### MVP goal
Launch something students can use immediately and pay for, even if it is narrow.

### Must be in scope
- mobile-first web app
- signup/login/logout
- English-first writing correction
- exam library for English bac prompts
- basic dashboard with score history and streak
- free plan usage limit
- premium placeholder or payment-ready pricing page

### Should be in scope if time allows
- language selector with French and Arabic marked as "coming soon"
- one daily mission widget on the dashboard
- one smart-lesson placeholder card driven by essay feedback

### Out of scope
- native mobile apps
- live tutoring
- social chat
- full OCR pipeline for handwriting
- advanced adaptive engine
- full subject coverage outside the initial language wedge

## 6. Key user flows

### Flow 1: first-time user
1. land on homepage
2. choose section and target score
3. sign up
4. complete first writing task
5. receive score and improvement plan
6. return to dashboard and daily mission

### Flow 2: returning free user
1. log in
2. see streak and remaining correction credits
3. complete one exam or daily pack
4. hit usage limit
5. see premium conversion trigger

### Flow 3: premium user
1. choose weak skill
2. practice exam mode
3. get corrected result
4. unlock recommended lesson and next exercise
5. continue until target band improves

## 7. Pricing model

### Free
- limited exam access
- one daily pack per day
- 3 essay corrections every 7 days for early trust building

### Premium
- high-volume or unlimited corrections
- full exam archive
- all smart lessons
- score analytics and weekly plan
- premium mock exams

### Packaging
- weekly pass for short-term demand
- monthly plan for regular students
- exam-season bundle for the final 2 to 3 months

## 8. Risks and mitigations

### Risk: AI scores feel unreliable
- mitigation: strict rubric templates, teacher-reviewed benchmark set, confidence flags

### Risk: too much content to launch
- mitigation: launch on one language wedge and one high-impact content type

### Risk: retention collapses after first correction
- mitigation: daily missions, streaks, next-best-action recommendations

### Risk: premium conversion is weak
- mitigation: place paywall after a clear value moment, not at signup

## 9. Product decisions that should remain fixed

- phase 1 stays English-first even if the brand is multilingual
- correction quality matters more than content volume
- daily habit design matters more than broad feature count
- web-first launch is the correct speed choice for a 7-day sprint
