import { Language } from "@prisma/client";

type ScoreBreakdown = {
  grammar: number;
  vocabulary: number;
  structure: number;
};

export type SkillFocus = "grammar" | "vocabulary" | "structure";

export const profileLanguageOptions = [
  {
    value: Language.ENGLISH,
    label: "English",
    status: "Live now"
  },
  {
    value: Language.FRENCH,
    label: "French",
    status: "Coming next"
  },
  {
    value: Language.ARABIC,
    label: "Arabic",
    status: "Coming next"
  }
] as const;

export function getSkillLabel(skill: SkillFocus) {
  if (skill === "grammar") return "Grammar accuracy";
  if (skill === "vocabulary") return "Vocabulary range";
  return "Structure and coherence";
}

export function getWeakestSkill(breakdown: ScoreBreakdown | null): SkillFocus {
  if (!breakdown) return "structure";

  const entries = Object.entries(breakdown) as Array<[SkillFocus, number]>;
  entries.sort((left, right) => left[1] - right[1]);
  return entries[0][0];
}

export function getLanguageLabel(language: Language) {
  const found = profileLanguageOptions.find((option) => option.value === language);
  return found?.label ?? language;
}

export function startOfUtcDay(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function parsePrimaryLanguage(input: string | null | undefined) {
  if (!input) return Language.ENGLISH;
  return Object.values(Language).includes(input as Language) ? (input as Language) : Language.ENGLISH;
}
