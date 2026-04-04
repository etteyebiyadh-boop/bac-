import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { LearningHub } from "@/components/LearningHub";
import { AchievementCard } from "@/components/AchievementCard";
import { DailyMissions } from "@/components/DailyMissions";
import { getSmartRecommendations, getWeeklyStreak } from "@/lib/personalization";
import { getStudentStats, generateDailyMissions } from "@/lib/gamification";
import { Language } from "@prisma/client";

export async function BacDashboard() {
  const user = await getCurrentUser();
  if (!user) return null;

  // 1. Core Profile & Context
  const profile = await db.studentProfile.findUnique({
    where: { userId: user.id }
  });
  const language = Language.ENGLISH; 

  // 2. Personalization & Missions
  const streak = await getWeeklyStreak(user.id);
  const recommendations = await getSmartRecommendations(user.id, language);
  const stats = await getStudentStats(user.id);
  const dailyMissions = await generateDailyMissions(user.id);
  
  // 3. Section Data
  const sectionPart = profile?.bacSection?.toLowerCase() || "mathematiques";
  const recentLessons = await db.lesson.findMany({
    where: { language, slug: { contains: sectionPart } },
    take: 2,
    orderBy: { createdAt: "desc" }
  });

  const completions = await db.lessonCompletion.count({
    where: { userId: user.id, lesson: { language } }
  });
  const progressPercent = Math.min(100, Math.round((completions / 20) * 100));

  return (
    <div className="container" style={{ paddingTop: "120px", paddingBottom: "120px" }}>
      <header className="stack" style={{ gap: "8px", marginBottom: "64px" }}>
        <div className="row" style={{ gap: "10px", marginBottom: "8px" }}>
           <span className="pill" style={{ fontSize: "10px", background: "var(--primary)", color: "white", border: "none" }}>RANK: {stats.rank}</span>
           <span className="pill" style={{ fontSize: "10px" }}>STREAK: {streak} DAYS</span>
        </div>
        <h1 className="hero-title" style={{ fontSize: "clamp(3rem, 6vw, 4.5rem)", textAlign: "left", lineHeight: 0.9 }}>
          Welcome back, <span className="text-gradient">{(user.fullName || "Student").split(" ")[0]}</span>
        </h1>
        <p className="muted" style={{ fontSize: "1.2rem", maxWidth: "800px" }}>
          You&apos;re on the path to <strong style={{ color: "white" }}>{profile?.bacSection || "Excellence"}</strong>. 
          Master today&apos;s missions to secure your target score.
        </p>
      </header>

      <div className="grid grid-cols-3 gap-64" style={{ gridTemplateColumns: "1fr 380px" }}>
        {/* Main Learning Hub */}
        <div className="stack" style={{ gap: "60px" }}>
           <LearningHub 
             currentStreak={streak}
             progressPercent={progressPercent || 10}
             recommendations={recommendations}
             recentLessons={recentLessons.map(l => ({ ...l, estimatedMinutes: l.estimatedMinutes || 8 }))}
             language={language}
           />
           
           <AchievementCard 
             studentName={user.fullName || "Bac Excellence Hero"}
             section={profile?.bacSection || "Technical Section"}
             streak={streak || 0}
             progress={progressPercent || 10}
             predictedScore="18.5/20"
           />
        </div>

        {/* Side Progress Widget */}
        <aside style={{ position: "sticky", top: "120px" }}>
           <DailyMissions 
             level={stats.level} 
             xp={stats.xp} 
             rank={stats.rank} 
             missions={dailyMissions} 
           />
        </aside>
      </div>
    </div>
  );
}
