import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { LearningHub } from "@/components/LearningHub";
import { AchievementCard } from "@/components/AchievementCard";
import { getSmartRecommendations, getWeeklyStreak, analyzeStudentLevel } from "@/lib/personalization";
import { Language } from "@prisma/client";

export async function BacDashboard() {
  const user = await getCurrentUser();
  if (!user) return null;

  // 1. Get Section & Profile
  const profile = await db.studentProfile.findUnique({
    where: { userId: user.id }
  });

  const language = Language.ENGLISH; // Default focus for now

  // 2. Analyze Stats
  const streak = await getWeeklyStreak(user.id);
  const recommendations = await getSmartRecommendations(user.id, language);
  
  // 3. Fetch Recent Section-Specific Lessons
  const sectionSlugPart = profile?.bacSection?.toLowerCase() || "mathematiques";
  const recentLessons = await db.lesson.findMany({
    where: { 
      language,
      slug: { contains: sectionSlugPart }
    },
    take: 2,
    orderBy: { createdAt: "desc" }
  });

  // Calculate Progress
  const totalLessonsInTrack = 20; // Assume 20 for this section
  const completions = await db.lessonCompletion.count({
    where: { userId: user.id, lesson: { language } }
  });
  const progressPercent = Math.min(100, Math.round((completions / totalLessonsInTrack) * 100));

  return (
    <div className="container" style={{ paddingTop: "120px", paddingBottom: "120px" }}>
      <header className="stack" style={{ gap: "8px", marginBottom: "48px" }}>
        <h1 className="hero-title" style={{ fontSize: "3rem", textAlign: "left" }}>
          Welcome back, <span className="text-gradient">{(user.fullName || "Student").split(" ")[0]}</span>
        </h1>
        <p className="muted" style={{ fontSize: "1.1rem" }}>
          Continuing your Excellence path for <strong style={{ color: "white" }}>{profile?.bacSection || "your section"}</strong>.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-24 items-start" style={{ gridTemplateColumns: "1fr 400px" }}>
        <div className="stack" style={{ gap: "48px" }}>
           <LearningHub 
             currentStreak={streak}
             progressPercent={progressPercent || 10} // Start with a boost if 0
             recommendations={recommendations}
             recentLessons={recentLessons.map(l => ({
               ...l,
               estimatedMinutes: l.estimatedMinutes || 8
             }))}
             language={language}
           />
        </div>

        <aside style={{ position: "sticky", top: "120px" }}>
           <AchievementCard 
             studentName={user.fullName || "Bac Excellence Hero"}
             section={profile?.bacSection || "Technical Section"}
             streak={streak || 0}
             progress={progressPercent || 10}
             predictedScore="18.5/20"
           />
        </aside>
      </div>

    </div>
  );
}
