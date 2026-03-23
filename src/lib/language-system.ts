import curriculumData from "@/data/language-system.json";

export type CurriculumLanguageCode = "ENGLISH" | "FRENCH" | "SPANISH" | "GERMAN" | "ITALIAN";
export type CurriculumLevel = "A1" | "A2" | "B1" | "B2";
export type CurriculumSkillFocus =
  | "grammar"
  | "vocabulary"
  | "structure"
  | "comprehension"
  | "communication"
  | "pronunciation";

export type CurriculumLesson = {
  slug: string;
  title: string;
  summary: string;
  theme: string;
  estimatedMinutes: number;
  explanation: string;
  example: string;
  exercise: string;
  answer: string;
  correction: string;
  arabicHint?: string;
  mistake?: string;
};

export type CurriculumSkill = {
  skill: CurriculumSkillFocus;
  lessons: CurriculumLesson[];
};

export type CurriculumLevelNode = {
  level: CurriculumLevel;
  summary: string;
  skills: CurriculumSkill[];
};

export type CurriculumTrack = {
  language: CurriculumLanguageCode;
  label: string;
  mode: "bac-core" | "communication-first";
  levels: CurriculumLevelNode[];
};

type CurriculumDataset = {
  languages: CurriculumTrack[];
};

export type StructuredLessonMeta = {
  pathway: "bac-language-system";
  language: CurriculumLanguageCode;
  level: CurriculumLevel;
  skill: CurriculumSkillFocus;
  explanation: string;
  example: string;
  exercise: string;
  answer: string;
  correction: string;
  arabicHint?: string;
  mistake?: string;
};

const dataset = curriculumData as CurriculumDataset;

export const CURRICULUM_LEVEL_ORDER: CurriculumLevel[] = ["A1", "A2", "B1", "B2"];

export const skillLabels: Record<CurriculumSkillFocus, string> = {
  grammar: "Grammar",
  vocabulary: "Vocabulary",
  structure: "Writing",
  comprehension: "Reading",
  communication: "Speaking",
  pronunciation: "Pronunciation"
};

export function getLanguageSystem() {
  return dataset.languages;
}

export function getCurriculumTrack(language: string) {
  return dataset.languages.find((track) => track.language === language) ?? null;
}

export function getCurriculumSlugs(language: string) {
  const track = getCurriculumTrack(language);
  if (!track) return [];

  return track.levels.flatMap((level) =>
    level.skills.flatMap((skill) => skill.lessons.map((lesson) => lesson.slug))
  );
}

export function isStructuredLessonMeta(value: unknown): value is StructuredLessonMeta {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Record<string, unknown>;
  return (
    candidate.pathway === "bac-language-system" &&
    typeof candidate.level === "string" &&
    typeof candidate.skill === "string" &&
    typeof candidate.explanation === "string" &&
    typeof candidate.exercise === "string" &&
    typeof candidate.answer === "string" &&
    typeof candidate.correction === "string"
  );
}
