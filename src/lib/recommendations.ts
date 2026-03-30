import { SkillFocus } from "./learning";
import { db } from "./db";
import { Language, GrammarCategory, BacModule, BacSection } from "@prisma/client";

export interface NextAction {
  type: "lesson" | "exercise" | "exam" | "grammar_rule" | "vocab_set";
  id: string;
  slug: string;
  title: string;
  reason: string;
  skillFocus: SkillFocus;
  estimatedMinutes: number;
  xpReward: number;
  priority: number; // 1-100, higher = more urgent
}

export interface RecommendationContext {
  userId: string;
  primaryLanguage: Language;
  bacSection: BacSection | null;
  weakestSkill: SkillFocus;
  recentSubmissionScores: {
    grammar: number;
    vocabulary: number;
    structure: number;
  } | null;
  modules: BacModule[];
}

/**
 * Analyzes submission feedback JSON to extract specific weakness patterns
 * and map them to content IDs
 */
export function parseFeedbackPatterns(feedbackJson: any): {
  grammarPatterns: string[];
  vocabThemes: string[];
  structureIssues: string[];
} {
  const patterns = {
    grammarPatterns: [] as string[],
    vocabThemes: [] as string[],
    structureIssues: [] as string[]
  };

  if (!feedbackJson) return patterns;

  const feedback = typeof feedbackJson === "string" 
    ? JSON.parse(feedbackJson) 
    : feedbackJson;

  // Extract from improvements array
  if (feedback.improvements && Array.isArray(feedback.improvements)) {
    feedback.improvements.forEach((item: string) => {
      const lower = item.toLowerCase();
      
      // Grammar patterns
      if (lower.includes("tense") || lower.includes("verb") || lower.includes("agreement")) {
        patterns.grammarPatterns.push("tenses");
      }
      if (lower.includes("article") || lower.includes("the ") || lower.includes("a ")) {
        patterns.grammarPatterns.push("articles");
      }
      if (lower.includes("preposition")) {
        patterns.grammarPatterns.push("prepositions");
      }
      if (lower.includes("conditional") || lower.includes("if ")) {
        patterns.grammarPatterns.push("conditionals");
      }
      
      // Vocab themes
      if (lower.includes("word choice") || lower.includes("vocabulary") || lower.includes("expression")) {
        patterns.vocabThemes.push("precision");
      }
      
      // Structure issues
      if (lower.includes("paragraph") || lower.includes("transition") || lower.includes("flow")) {
        patterns.structureIssues.push("coherence");
      }
      if (lower.includes("introduction") || lower.includes("conclusion")) {
        patterns.structureIssues.push("organization");
      }
    });
  }

  return patterns;
}

/**
 * Gets the next best action based on student's current state
 */
export async function getNextBestAction(
  context: RecommendationContext
): Promise<NextAction | null> {
  const { weakestSkill, primaryLanguage, bacSection, modules, recentSubmissionScores } = context;

  // Priority 1: If any score is below 12/20, urgent skill fix needed
  if (recentSubmissionScores) {
    const minScore = Math.min(
      recentSubmissionScores.grammar,
      recentSubmissionScores.vocabulary,
      recentSubmissionScores.structure
    );

    if (minScore < 12) {
      // Find a foundational lesson for the weakest skill
      const lesson = await db.lesson.findFirst({
        where: {
          language: primaryLanguage,
          skillFocus: weakestSkill,
          difficulty: "EASY"
        },
        orderBy: { createdAt: "asc" }
      });

      if (lesson) {
        return {
          type: "lesson",
          id: lesson.id,
          slug: lesson.slug,
          title: lesson.title,
          reason: `Your ${weakestSkill} score (${minScore.toFixed(1)}/20) needs immediate attention. Start with the basics.`,
          skillFocus: weakestSkill,
          estimatedMinutes: lesson.estimatedMinutes,
          xpReward: 20,
          priority: 95
        };
      }
    }
  }

  // Priority 2: Grammar rule drill for specific weakness
  if (weakestSkill === "grammar") {
    const rule = await db.grammarRule.findFirst({
      where: {
        language: primaryLanguage,
        difficulty: "MEDIUM",
        OR: [
          { bacSections: { has: bacSection } },
          { bacSections: { isEmpty: true } },
          { bacSections: { equals: null } }
        ]
      },
      orderBy: { createdAt: "asc" }
    });

    if (rule) {
      return {
        type: "grammar_rule",
        id: rule.id,
        slug: rule.slug,
        title: rule.title,
        reason: "Master this rule to eliminate common errors in your writing.",
        skillFocus: "grammar",
        estimatedMinutes: 5,
        xpReward: 15,
        priority: 85
      };
    }
  }

  // Priority 3: Vocabulary set for vocab weakness
  if (weakestSkill === "vocabulary") {
    const vocabSet = await db.vocabularySet.findFirst({
      where: {
        language: primaryLanguage,
        OR: [
          { bacSections: { has: bacSection } },
          { bacSections: { isEmpty: true } },
          { bacSections: { equals: null } }
        ]
      },
      orderBy: { createdAt: "asc" }
    });

    if (vocabSet) {
      return {
        type: "vocab_set",
        id: vocabSet.id,
        slug: vocabSet.slug,
        title: vocabSet.title,
        reason: "Learn high-impact words that examiners reward. Each word appears in real BAC contexts.",
        skillFocus: "vocabulary",
        estimatedMinutes: 10,
        xpReward: 20,
        priority: 80
      };
    }
  }

  // Priority 4: Targeted exercise
  const exercise = await db.exercise.findFirst({
    where: {
      language: primaryLanguage,
      skillFocus: weakestSkill,
      difficulty: recentSubmissionScores && Math.min(
        recentSubmissionScores.grammar,
        recentSubmissionScores.vocabulary,
        recentSubmissionScores.structure
      ) < 14 ? "EASY" : "MEDIUM"
    },
    orderBy: { createdAt: "asc" }
  });

  if (exercise) {
    return {
      type: "exercise",
      id: exercise.id,
      slug: exercise.slug,
      title: exercise.prompt.slice(0, 50) + "...",
      reason: `Quick drill to strengthen your ${weakestSkill} before your next essay.`,
      skillFocus: weakestSkill,
      estimatedMinutes: 3,
      xpReward: exercise.xpReward,
      priority: 70
    };
  }

  // Priority 5: Practice exam
  const exam = await db.exam.findFirst({
    where: {
      language: primaryLanguage,
      difficulty: "MEDIUM"
    },
    orderBy: { year: "desc" }
  });

  if (exam) {
    return {
      type: "exam",
      id: exam.id,
      slug: exam.slug,
      title: exam.title,
      reason: "Apply what you've learned in a real BAC exam scenario.",
      skillFocus: "structure",
      estimatedMinutes: exam.estimatedMinutes,
      xpReward: 50,
      priority: 60
    };
  }

  return null;
}

/**
 * Generates a personalized study path based on recent submissions
 */
export async function generateStudyPath(
  userId: string,
  limit: number = 5
): Promise<NextAction[]> {
  const profile = await db.studentProfile.findUnique({
    where: { userId },
    include: { user: { select: { id: true } } }
  });

  if (!profile) return [];

  // Get recent submissions to analyze trends
  const submissions = await db.submission.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: {
      grammarScore: true,
      vocabularyScore: true,
      structureScore: true,
      feedbackJson: true,
      language: true
    }
  });

  // Calculate average scores
  const avgScores = submissions.length > 0
    ? {
        grammar: submissions.reduce((s, sub) => s + sub.grammarScore, 0) / submissions.length,
        vocabulary: submissions.reduce((s, sub) => s + sub.vocabularyScore, 0) / submissions.length,
        structure: submissions.reduce((s, sub) => s + sub.structureScore, 0) / submissions.length
      }
    : { grammar: 10, vocabulary: 10, structure: 10 };

  // Determine weakest skill
  const skillEntries: [SkillFocus, number][] = [
    ["grammar", avgScores.grammar],
    ["vocabulary", avgScores.vocabulary],
    ["structure", avgScores.structure]
  ];
  skillEntries.sort((a, b) => a[1] - b[1]);
  const weakestSkill = skillEntries[0][0];

  // Parse feedback patterns from most recent submission
  const patterns = submissions.length > 0 
    ? parseFeedbackPatterns(submissions[0].feedbackJson)
    : { grammarPatterns: [], vocabThemes: [], structureIssues: [] };

  // Build modules list (similar to lessons page)
  const modules: BacModule[] = [
    BacModule.MODULE_1_HOLIDAYING_ART_SHOWS,
    BacModule.MODULE_2_EDUCATION_MATTERS,
    BacModule.MODULE_3_CREATIVE_INVENTIVE_MINDS,
    BacModule.MODULE_4_YOUTH_ISSUES,
  ];
  if (profile.bacSection === "LETTRES") {
    modules.push(BacModule.MODULE_5_WOMEN_POWER, BacModule.MODULE_6_SUSTAINABLE_DEVELOPMENT);
  }

  const context: RecommendationContext = {
    userId,
    primaryLanguage: profile.primaryLanguage,
    bacSection: profile.bacSection as BacSection | null,
    weakestSkill,
    recentSubmissionScores: avgScores,
    modules
  };

  // Generate multiple recommendations
  const recommendations: NextAction[] = [];

  // First: Immediate next action
  const nextAction = await getNextBestAction(context);
  if (nextAction) {
    recommendations.push(nextAction);
  }

  // Second: Complementary skill (if strong in one, work on another)
  const complementarySkill = skillEntries[1][0]; // Second weakest
  const complementaryContext = { ...context, weakestSkill: complementarySkill };
  const complementaryAction = await getNextBestAction(complementaryContext);
  if (complementaryAction && complementaryAction.id !== nextAction?.id) {
    recommendations.push({
      ...complementaryAction,
      priority: complementaryAction.priority - 10,
      reason: `While improving ${weakestSkill}, also maintain your ${complementarySkill} skills.`
    });
  }

  return recommendations.slice(0, limit);
}

/**
 * Quick API-friendly function to get single next action for dashboard
 */
export async function getDashboardNextAction(userId: string): Promise<NextAction | null> {
  const path = await generateStudyPath(userId, 1);
  return path[0] || null;
}
