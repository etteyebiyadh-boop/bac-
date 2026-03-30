import { db } from "./db";

export type AnalyticsEvent = 
  | "user_signup"
  | "user_login"
  | "writing_submitted"
  | "correction_completed"
  | "lesson_started"
  | "lesson_completed"
  | "exercise_completed"
  | "daily_mission_completed"
  | "paywall_viewed"
  | "upgrade_clicked"
  | "paywall_dismissed"
  | "checkout_started"
  | "subscription_completed"
  | "referral_shared"
  | "challenge_accepted"
  | "challenge_completed";

interface EventProperties {
  [key: string]: string | number | boolean | null;
}

/**
 * Track an analytics event
 * Stores in database for now - can be extended to send to external tools (Mixpanel, Amplitude, etc.)
 */
export async function trackEvent(
  userId: string | null,
  event: AnalyticsEvent,
  properties?: EventProperties
) {
  try {
    // Store event in database
    await db.analyticsEvent.create({
      data: {
        userId: userId || "anonymous",
        event,
        properties: properties || {},
        timestamp: new Date()
      }
    });

    // Also log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log(`[ANALYTICS] ${event}`, { userId, ...properties });
    }
  } catch (error) {
    // Fail silently - analytics should never break the app
    console.error("[ANALYTICS] Failed to track event:", error);
  }
}

/**
 * Track user signup funnel
 */
export async function trackSignup(userId: string, email: string, source?: string) {
  await trackEvent(userId, "user_signup", {
    email_domain: email.split("@")[1],
    source: source || "organic"
  });
}

/**
 * Track correction completion with score breakdown
 */
export async function trackCorrectionCompleted(
  userId: string,
  submissionId: string,
  scores: {
    overall: number;
    grammar: number;
    vocabulary: number;
    structure: number;
  },
  isPremium: boolean
) {
  await trackEvent(userId, "correction_completed", {
    submission_id: submissionId,
    overall_score: scores.overall,
    grammar_score: scores.grammar,
    vocabulary_score: scores.vocabulary,
    structure_score: scores.structure,
    is_premium: isPremium,
    score_tier: scores.overall >= 16 ? "high" : scores.overall >= 12 ? "medium" : "low"
  });
}

/**
 * Track paywall interaction
 */
export async function trackPaywall(
  userId: string,
  action: "viewed" | "clicked" | "dismissed",
  context: string
) {
  await trackEvent(userId, action === "viewed" ? "paywall_viewed" : action === "clicked" ? "upgrade_clicked" : "paywall_dismissed", {
    context,
    user_plan: "free"
  });
}

/**
 * Track lesson completion
 */
export async function trackLessonCompleted(
  userId: string,
  lessonId: string,
  lessonType: string,
  skillFocus: string,
  timeSpentSeconds?: number
) {
  await trackEvent(userId, "lesson_completed", {
    lesson_id: lessonId,
    lesson_type: lessonType,
    skill_focus: skillFocus,
    time_spent_seconds: timeSpentSeconds || null
  });
}

/**
 * Get retention metrics for admin dashboard
 */
export async function getRetentionMetrics(days: number = 7) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [
    signups,
    activeUsers,
    corrections,
    completions
  ] = await Promise.all([
    db.analyticsEvent.count({
      where: {
        event: "user_signup",
        timestamp: { gte: since }
      }
    }),
    db.analyticsEvent.groupBy({
      by: ["userId"],
      where: {
        timestamp: { gte: since }
      },
      _count: { userId: true }
    }),
    db.analyticsEvent.count({
      where: {
        event: "correction_completed",
        timestamp: { gte: since }
      }
    }),
    db.analyticsEvent.count({
      where: {
        event: { in: ["lesson_completed", "exercise_completed", "daily_mission_completed"] },
        timestamp: { gte: since }
      }
    })
  ]);

  return {
    signups,
    activeUsers: activeUsers.length,
    corrections,
    completions,
    period: days
  };
}
