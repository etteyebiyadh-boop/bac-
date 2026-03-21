# Bac English — Examiner Rubric (Product Spec)

This document defines how **BacLang** asks the model to score and correct **Tunisian Baccalaureate–style English writing**. It is the source of truth for prompt engineering; implementation lives in `src/lib/examiner-rubric.ts` and `src/lib/ai.ts`.

## Purpose

- Produce **consistent** scores out of **20** across sessions.
- Separate feedback into **grammar**, **vocabulary**, and **structure** so the product can show skill breakdowns and recommend lessons.
- Keep feedback **actionable** and **exam-appropriate** (not chatty).

## Score dimensions (each out of 20)

| Dimension | What we assess |
|-----------|------------------|
| **Grammar** | Control of syntax, tense, agreement, articles, prepositions; clarity of meaning. |
| **Vocabulary** | Range, precision, register (academic essay), fit to prompt. |
| **Structure** | Introduction–body–conclusion, paragraphing, coherence, relevance to prompt. |

### Band guidance (indicative)

- **16–20:** Strong; minor issues only; meaning always clear.
- **11–15:** Adequate; recurring weaknesses; meaning generally clear.
- **0–10:** Weak; frequent errors or unclear / off-track work.

## Overall score (out of 20)

- **overallScore** should follow a **weighted blend** of the three pillars:

  - Grammar **35%**
  - Vocabulary **30%**
  - Structure **35%**

- Round to **one decimal**.
- Allow **at most ±1.0** deviation from that blend when one dimension is unusually decisive (e.g. totally off-topic structure).

## Outputs (API contract)

- **summary:** Short examiner-style justification of the overall mark.
- **correctedText:** Full improved essay (same ideas; better language and structure).
- **strengths:** 2–4 bullets.
- **improvements:** 3–5 actionable bullets.

## Non-goals

- Official ministry grading (always advisory).
- Penalizing accent or dialect inappropriately; focus on **exam-style written English**.

## Review cadence

- Revisit this rubric after **50+ real student essays** or teacher review; adjust band text, not the JSON schema, when possible.
