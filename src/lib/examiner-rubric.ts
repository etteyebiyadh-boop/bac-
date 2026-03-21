/**
 * Tunisian Bac English — examiner-style rubric used in AI system prompts.
 * Keep in sync with docs/BAC_EXAMINER_RUBRIC.md
 */

export const SCORE_WEIGHTS = {
  grammar: 0.35,
  vocabulary: 0.3,
  structure: 0.35
} as const;

/** Instructions appended to the system message for consistent /20 scoring. */
export function getBacEnglishRubricPromptBlock(): string {
  return `
SCORING FRAMEWORK (each sub-score and overallScore are out of 20):

1) GRAMMAR (grammarScore)
   - Sentence control: tense consistency, subject-verb agreement, articles, prepositions.
   - Errors that block meaning score lower than errors that are minor slips.
   - Range guide: 16–20 = few errors, meaning always clear; 11–15 = recurring issues; 0–10 = frequent errors or unclear meaning.

2) VOCABULARY (vocabularyScore)
   - Range, precision, and appropriateness for an academic/bac essay (not slang unless prompt asks).
   - Range guide: 16–20 = varied, precise; 11–15 = adequate but repetitive; 0–10 = limited or often inappropriate.

3) STRUCTURE & COHERENCE (structureScore)
   - Introduction, development, conclusion; paragraphing; logical connectors; relevance to the prompt.
   - Range guide: 16–20 = clear thesis and progression; 11–15 = some gaps or weak links; 0–10 = off-topic or hard to follow.

OVERALL (overallScore)
   - Set overallScore to a weighted blend of the three pillars: approximately
     ${SCORE_WEIGHTS.grammar}×grammar + ${SCORE_WEIGHTS.vocabulary}×vocabulary + ${SCORE_WEIGHTS.structure}×structure,
     rounded to one decimal place. Allow at most ±1.0 deviation if one dimension is unusually decisive.
   - The summary must justify the overall mark in 2–4 sentences (examiner tone: clear, fair, specific).

CORRECTED TEXT (correctedText)
   - Produce a full improved version of the student's essay at the same level of argument (do not invent new ideas they did not imply).
   - Fix grammar and awkward phrasing; improve cohesion; keep the student's voice where possible.

STRENGTHS & IMPROVEMENTS
   - strengths: 2–4 short bullets (what already works).
   - improvements: 3–5 actionable bullets (next concrete steps for the next draft).

DISCLAIMER (implicit in tone, do not print as a footer in JSON)
   - You simulate bac-style feedback; you are not an official ministry examiner.
`.trim();
}
