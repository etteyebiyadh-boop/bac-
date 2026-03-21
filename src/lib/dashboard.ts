type SubmissionMetricRecord = {
  id: string;
  createdAt: Date;
  overallScore: number;
  grammarScore: number;
  vocabularyScore: number;
  structureScore: number;
  wordCount: number;
  exam: {
    year: number;
    title: string;
  } | null;
};

type DashboardMetricsInput = {
  recentSubmissions: SubmissionMetricRecord[];
  totalCorrections: number;
  correctionsThisWeek: number;
  isPremium: boolean;
  freeCorrectionLimit: number;
};

function roundToOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

function dayKey(date: Date) {
  return new Date(date).toISOString().slice(0, 10);
}

function shiftUtcDays(date: Date, days: number) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

export function calculateCurrentStreak(dates: Date[]) {
  const uniqueDays = [...new Set(dates.map(dayKey))].sort().reverse();
  if (uniqueDays.length === 0) return 0;

  const today = dayKey(new Date());
  const yesterday = dayKey(shiftUtcDays(new Date(), -1));
  const latestDay = uniqueDays[0];

  if (latestDay !== today && latestDay !== yesterday) {
    return 0;
  }

  const daySet = new Set(uniqueDays);
  let cursor = new Date(`${latestDay}T00:00:00.000Z`);
  let streak = 0;

  while (daySet.has(dayKey(cursor))) {
    streak += 1;
    cursor = shiftUtcDays(cursor, -1);
  }

  return streak;
}

export function buildDashboardMetrics({
  recentSubmissions,
  totalCorrections,
  correctionsThisWeek,
  isPremium,
  freeCorrectionLimit
}: DashboardMetricsInput) {
  const latestScore = recentSubmissions[0]?.overallScore ?? null;
  const scoreCount = recentSubmissions.length;

  const bestScore =
    scoreCount > 0
      ? Math.max(...recentSubmissions.map((submission) => submission.overallScore))
      : null;

  const averageScore =
    scoreCount > 0
      ? roundToOneDecimal(
          recentSubmissions.reduce((sum, submission) => sum + submission.overallScore, 0) /
            scoreCount
        )
      : null;

  const averageBreakdown =
    scoreCount > 0
      ? {
          grammar: roundToOneDecimal(
            recentSubmissions.reduce((sum, submission) => sum + submission.grammarScore, 0) /
              scoreCount
          ),
          vocabulary: roundToOneDecimal(
            recentSubmissions.reduce((sum, submission) => sum + submission.vocabularyScore, 0) /
              scoreCount
          ),
          structure: roundToOneDecimal(
            recentSubmissions.reduce((sum, submission) => sum + submission.structureScore, 0) /
              scoreCount
          )
        }
      : null;

  return {
    latestScore,
    bestScore,
    averageScore,
    averageBreakdown,
    totalCorrections,
    correctionsThisWeek,
    currentStreak: calculateCurrentStreak(
      recentSubmissions.map((submission) => submission.createdAt)
    ),
    remainingFreeCorrections: isPremium
      ? null
      : Math.max(0, freeCorrectionLimit - correctionsThisWeek)
  };
}
