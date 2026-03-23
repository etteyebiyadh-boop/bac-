import { diagnosticQuestionBank, type DiagnosticQuestion } from "@/data/language-diagnostic";
import {
  CURRICULUM_LEVEL_ORDER,
  getCurriculumTrack,
  skillLabels,
  type CurriculumLanguageCode,
  type CurriculumLesson,
  type CurriculumLevel,
  type CurriculumSkillFocus
} from "@/lib/language-system";

export const DIAGNOSTIC_STORAGE_KEY = "baclang-language-diagnostic-v1";

export type DiagnosticLanguageResult = {
  language: CurriculumLanguageCode;
  score: number;
  total: number;
  percentage: number;
  level: CurriculumLevel;
  strongestSkill: CurriculumSkillFocus;
  weakestSkill: CurriculumSkillFocus;
  completedAt: string;
};

export type StoredDiagnosticSnapshot = {
  results: Partial<Record<CurriculumLanguageCode, DiagnosticLanguageResult>>;
};

export type RoadmapStep = {
  slug: string;
  title: string;
  summary: string;
  level: CurriculumLevel;
  skill: CurriculumSkillFocus;
  estimatedMinutes: number;
};

const defaultSkillOrder: CurriculumSkillFocus[] = [
  "grammar",
  "structure",
  "comprehension",
  "vocabulary",
  "communication",
  "pronunciation"
];

export const supportedDiagnosticLanguages = Object.keys(diagnosticQuestionBank) as CurriculumLanguageCode[];

export function getDiagnosticTrack(language: CurriculumLanguageCode) {
  return diagnosticQuestionBank[language];
}

export function scoreDiagnostic(
  language: CurriculumLanguageCode,
  answers: Record<string, string>
): DiagnosticLanguageResult {
  const track = getDiagnosticTrack(language);
  const skillScores = new Map<CurriculumSkillFocus, { correct: number; total: number }>();

  let score = 0;
  for (const question of track.questions) {
    const current = skillScores.get(question.skill) ?? { correct: 0, total: 0 };
    current.total += 1;

    if (answers[question.id] === question.correctChoiceId) {
      score += 1;
      current.correct += 1;
    }

    skillScores.set(question.skill, current);
  }

  const strongestSkill = resolveSkillEdge(skillScores, "strongest");
  const weakestSkill = resolveSkillEdge(skillScores, "weakest");
  const total = track.questions.length;
  const percentage = Math.round((score / total) * 100);

  return {
    language,
    score,
    total,
    percentage,
    level: getRecommendedLevel(language, score, total),
    strongestSkill,
    weakestSkill,
    completedAt: new Date().toISOString()
  };
}

function resolveSkillEdge(
  skillScores: Map<CurriculumSkillFocus, { correct: number; total: number }>,
  direction: "strongest" | "weakest"
) {
  const ranked = [...skillScores.entries()].map(([skill, score]) => ({
    skill,
    ratio: score.total === 0 ? 0 : score.correct / score.total,
    order: defaultSkillOrder.indexOf(skill)
  }));

  ranked.sort((left, right) => {
    if (direction === "strongest") {
      if (right.ratio !== left.ratio) return right.ratio - left.ratio;
    } else if (left.ratio !== right.ratio) {
      return left.ratio - right.ratio;
    }

    return left.order - right.order;
  });

  return ranked[0]?.skill ?? "grammar";
}

function getRecommendedLevel(
  language: CurriculumLanguageCode,
  score: number,
  total: number
): CurriculumLevel {
  const ratio = score / total;
  const isOptional = language === "SPANISH" || language === "GERMAN" || language === "ITALIAN";

  if (isOptional) {
    if (ratio >= 0.75) return "B1";
    if (ratio >= 0.4) return "A2";
    return "A1";
  }

  if (ratio >= 0.83) return "B2";
  if (ratio >= 0.55) return "B1";
  if (ratio >= 0.3) return "A2";
  return "A1";
}

export function buildRoadmapSteps(
  language: CurriculumLanguageCode,
  result: DiagnosticLanguageResult,
  limit = 3
): RoadmapStep[] {
  const track = getCurriculumTrack(language);
  if (!track) return [];

  const startIndex = Math.max(
    0,
    track.levels.findIndex((level) => level.level === result.level)
  );

  const skillPriority = [result.weakestSkill, ...defaultSkillOrder.filter((skill) => skill !== result.weakestSkill)];
  const steps: RoadmapStep[] = [];

  for (let levelIndex = startIndex; levelIndex < track.levels.length && steps.length < limit; levelIndex += 1) {
    const level = track.levels[levelIndex];
    for (const skill of skillPriority) {
      const lesson = level.skills.find((item) => item.skill === skill)?.lessons[0];
      if (!lesson) continue;

      steps.push({
        slug: lesson.slug,
        title: lesson.title,
        summary: lesson.summary,
        level: level.level,
        skill,
        estimatedMinutes: lesson.estimatedMinutes
      });

      if (steps.length >= limit) break;
    }
  }

  return dedupeSteps(steps).slice(0, limit);
}

function dedupeSteps(steps: RoadmapStep[]) {
  const seen = new Set<string>();
  return steps.filter((step) => {
    if (seen.has(step.slug)) return false;
    seen.add(step.slug);
    return true;
  });
}

export function getRoadmapTone(targetScore: number) {
  if (targetScore >= 18) return "Distinction pace";
  if (targetScore >= 16) return "15+/20 pace";
  return "Recovery pace";
}

export function getSectionRoadmapMessage(section: string | null | undefined) {
  if (section === "LETTRES") {
    return "Language-heavy path: writing and reading should stay your top weekly priorities.";
  }

  if (section === "ECONOMIE_GESTION") {
    return "Balanced path: build vocabulary precision, then protect your writing structure.";
  }

  if (section) {
    return "Score-efficient path: fix grammar and paragraph control first, then deepen reading speed.";
  }

  return "Set your Bac section to get a tighter roadmap for your weekly work.";
}

export function getLanguageFocusMessage(
  language: CurriculumLanguageCode,
  result: DiagnosticLanguageResult
) {
  return `${skillLabels[result.weakestSkill]} is your fastest gain in ${languageLabelMap[language]}.`;
}

export function buildDiagnosticReview(question: DiagnosticQuestion, selectedChoiceId: string | undefined) {
  const selected = question.choices.find((choice) => choice.id === selectedChoiceId);
  const correct = question.choices.find((choice) => choice.id === question.correctChoiceId);

  return {
    question,
    selectedText: selected?.text ?? "No answer",
    correctText: correct?.text ?? "",
    isCorrect: selectedChoiceId === question.correctChoiceId
  };
}

export function createEmptySnapshot(): StoredDiagnosticSnapshot {
  return { results: {} };
}

export function isSupportedDiagnosticLanguage(value: string | null | undefined): value is CurriculumLanguageCode {
  return supportedDiagnosticLanguages.includes(value as CurriculumLanguageCode);
}

export const languageLabelMap: Record<CurriculumLanguageCode, string> = {
  ENGLISH: "English",
  FRENCH: "French",
  SPANISH: "Spanish",
  GERMAN: "German",
  ITALIAN: "Italian"
};

export function getRecommendedLanguageSequence(optionalLanguage?: string | null) {
  const base: CurriculumLanguageCode[] = ["ENGLISH", "FRENCH"];
  if (isSupportedDiagnosticLanguage(optionalLanguage) && !base.includes(optionalLanguage)) {
    base.push(optionalLanguage);
  }

  return base;
}

export function getLevelProgressValue(level: CurriculumLevel) {
  return (CURRICULUM_LEVEL_ORDER.indexOf(level) + 1) * 25;
}
