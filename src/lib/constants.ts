const parsedFreeCorrectionLimit = Number(process.env.FREE_CORRECTIONS_PER_WEEK ?? 3);
const parsedCorrectionRateLimitPerMinute = Number(process.env.CORRECTION_RATE_LIMIT_PER_MINUTE ?? 6);

export const APP_NAME = "Bac Excellence";
export const MVP_LANGUAGE = "English";
export const TARGET_BAC_SCORE = 15;
export const FREE_CORRECTIONS_PER_WEEK = Number.isFinite(parsedFreeCorrectionLimit)
  ? parsedFreeCorrectionLimit
  : 3;
export const MIN_ESSAY_CHARS = 80;
export const MAX_ESSAY_CHARS = 5000;
export const CORRECTION_RATE_LIMIT_WINDOW_MS = 60 * 1000;
export const CORRECTION_RATE_LIMIT_PER_MINUTE = Number.isFinite(parsedCorrectionRateLimitPerMinute)
  ? parsedCorrectionRateLimitPerMinute
  : 6;
