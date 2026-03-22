import Link from "next/link";
import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import { buildDashboardMetrics } from "@/lib/dashboard";
import { FREE_CORRECTIONS_PER_WEEK, TARGET_BAC_SCORE } from "@/lib/constants";
import { getLanguageLabel, getSkillLabel, getWeakestSkill } from "@/lib/learning";
import {
  buildRecommendedLessonMessage,
  ensureDailyMission,
  ensureStudentProfile,
  getXpTotal
} from "@/lib/missions";
import { ProfileSetupForm } from "./profile-setup-form";

export const dynamic = "force-dynamic";

function formatScore(score: number | null) {
  return score === null ? "—" : `${score.toFixed(1)}`;
}

export default async function DashboardPage() {
  const user = await requireCurrentUser();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [profile, mission, xpTotal, totalCorrections, correctionsThisWeek, recentSubmissions] =
    await Promise.all([
      ensureStudentProfile(user.id),
      ensureDailyMission(user.id),
      getXpTotal(user.id),
      db.submission.count({
        where: { userId: user.id }
      }),
      db.submission.count({
        where: {
          userId: user.id,
          createdAt: {
            gte: sevenDaysAgo
          }
        }
      }),
      db.submission.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          createdAt: true,
          overallScore: true,
          grammarScore: true,
          vocabularyScore: true,
          structureScore: true,
          wordCount: true,
          exam: {
            select: {
              year: true,
              title: true
            }
          },
          language: true
        }
      })
    ]);

  const metrics = buildDashboardMetrics({
    recentSubmissions,
    totalCorrections,
    correctionsThisWeek,
    isPremium: user.isPremium,
    freeCorrectionLimit: FREE_CORRECTIONS_PER_WEEK
  });

  const weakestSkill = getWeakestSkill(metrics.averageBreakdown);
  const profileIsIncomplete = !profile.bacSection || !profile.examYear;

  return (
    <div className="page-stack">
      {/* Header Info Section */}
      <section className="card" style={{ border: "none", background: "none", padding: 0 }}>
        <div className="row-between">
           <div className="stack" style={{ gap: "8px" }}>
              <span className="eyebrow" style={{ color: "var(--primary)" }}>Student Portal</span>
              <h1 className="section-title" style={{ fontSize: "3rem" }}>Hi, ready for {TARGET_BAC_SCORE}/20?</h1>
              <p className="muted" style={{ fontSize: "1.1rem" }}>Track your daily streaks, explore lessons, and perfect your writing style.</p>
           </div>
           <div className="stack" style={{ alignItems: "flex-end" }}>
              <span className="pill" style={{ fontSize: "14px", padding: "8px 20px" }}>
                {user.isPremium ? "💎 EXCELLENCE PLAN" : "🛡️ STANDARD PLAN"}
              </span>
           </div>
        </div>
      </section>

      {/* Grid for Primary Stats */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px" }}>
        {[
          { label: "Latest Score", value: formatScore(metrics.latestScore), sub: "/ 20", color: "var(--primary)" },
          { label: "Best Score", value: formatScore(metrics.bestScore), sub: "/ 20", color: "var(--success)" },
          { label: "Current Streak", value: metrics.currentStreak, sub: "DAYS", color: "var(--accent)" },
          { label: "XP Earned", value: xpTotal, sub: "TOTAL", color: "#ec4899" }
        ].map((stat, i) => (
          <article key={i} className="card stack" style={{ padding: "32px", alignItems: "center", textAlign: "center" }}>
            <span className="eyebrow" style={{ fontSize: "10px" }}>{stat.label}</span>
            <div className="row-between" style={{ gap: "4px", justifyContent: "center" }}>
               <strong style={{ fontSize: "3rem", fontWeight: "900", color: stat.color, lineHeight: 1 }}>{stat.value}</strong>
               <span className="muted" style={{ fontSize: "12px", fontWeight: "800", marginTop: "12px" }}>{stat.sub}</span>
            </div>
          </article>
        ))}
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "32px" }}>
         {/* Main Column */}
         <div className="stack" style={{ gap: "32px" }}>
            <ProfileSetupForm
              initialProfile={{
                sectionLabel: profile.bacSection,
                targetScore: profile.targetScore,
                examYear: profile.examYear,
                primaryLanguage: profile.primaryLanguage,
                secondaryLanguagesJson: profile.secondaryLanguagesJson
              }}
            />

            <article className="card stack" style={{ padding: "48px" }}>
              <div className="row-between">
                <h2 className="section-title">Skill Averages</h2>
                <span className="pill">BASED ON RECENT ATTEMPTS</span>
              </div>
              
              {metrics.averageBreakdown ? (
                <div className="stack" style={{ gap: "32px", marginTop: "24px" }}>
                  {[
                    { label: "Grammar", value: metrics.averageBreakdown.grammar, color: "var(--primary)" },
                    { label: "Vocabulary", value: metrics.averageBreakdown.vocabulary, color: "var(--success)" },
                    { label: "Structure", value: metrics.averageBreakdown.structure, color: "var(--accent)" }
                  ].map((s, i) => (
                    <div key={i} className="stack" style={{ gap: "12px" }}>
                       <div className="row-between">
                          <span style={{ fontWeight: "700", opacity: 0.8 }}>{s.label}</span>
                          <strong style={{ color: s.color }}>{s.value.toFixed(1)} / 20</strong>
                       </div>
                       <div className="score-bar" style={{ height: "10px", background: "rgba(255,255,255,0.05)" }}>
                          <div className="score-fill" style={{ width: `${(s.value / 20) * 100}%`, background: s.color, borderRadius: "100px", boxShadow: `0 0 15px ${s.color}` }}></div>
                       </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="muted" style={{ padding: "40px 0", textAlign: "center" }}>Submit your first essay to unlock deep skill analytics.</p>
              )}
            </article>

            <section className="card stack" style={{ padding: "48px" }}>
              <div className="row-between">
                <h2 className="section-title">Recent Work</h2>
                <Link href="/write" className="nav-link" style={{ fontSize: "14px" }}>View All Activity →</Link>
              </div>
              {recentSubmissions.length === 0 ? (
                <p className="muted" style={{ padding: "40px 0", textAlign: "center" }}>No activity yet. Start with your first simulation.</p>
              ) : (
                <div className="stack" style={{ gap: "16px", marginTop: "24px" }}>
                  {recentSubmissions.map((submission) => (
                    <div key={submission.id} className="row-between" style={{ padding: "20px", background: "rgba(255,255,255,0.02)", borderRadius: "16px", border: "1px solid var(--card-border)" }}>
                      <div className="stack" style={{ gap: "4px" }}>
                        <strong style={{ fontSize: "1.1rem" }}>{submission.exam?.title || "Free Practice"}</strong>
                        <span className="muted" style={{ fontSize: "13px" }}>{new Date(submission.createdAt).toLocaleDateString()} • {submission.wordCount} words</span>
                      </div>
                      <div className="stack" style={{ alignItems: "flex-end" }}>
                        <strong style={{ fontSize: "1.5rem", color: "var(--primary)" }}>{submission.overallScore.toFixed(1)}</strong>
                        <span className="pill" style={{ fontSize: "10px", padding: "2px 8px" }}>{submission.language}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
         </div>

         {/* Sidebar */}
         <div className="stack" style={{ gap: "32px" }}>
            <article className="card pricing-card elite stack" style={{ padding: "40px", borderColor: "var(--accent)" }}>
               <span className="eyebrow" style={{ color: "var(--accent)" }}>Daily Mission</span>
               <h3 className="section-title" style={{ fontSize: "1.8rem", lineHeight: 1.2 }}>{mission.title}</h3>
               <p className="muted" style={{ fontSize: "14px" }}>{mission.description}</p>
               <div className="row-between" style={{ padding: "12px", background: "rgba(0,0,0,0.2)", borderRadius: "12px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "700" }}>Focus: {mission.skillFocus}</span>
                  <span style={{ color: "var(--accent)", fontWeight: "900" }}>+{mission.xpReward} XP</span>
               </div>
               <Link href="/daily" className="button-link" style={{ background: "var(--accent)", color: "#000", justifyContent: "center" }}>Complete Mission</Link>
            </article>

            <article className="card stack" style={{ padding: "40px" }}>
               <span className="eyebrow">Smart Recommendation</span>
               <p style={{ fontWeight: "600", fontSize: "1.1rem" }}>{buildRecommendedLessonMessage(weakestSkill)}</p>
               {mission.lesson ? (
                 <div className="stack" style={{ marginTop: "20px", padding: "20px", background: "rgba(255,255,255,0.02)", borderRadius: "16px" }}>
                    <strong>{mission.lesson.title}</strong>
                    <p className="muted" style={{ fontSize: "13px", marginTop: "8px" }}>{mission.lesson.summary}</p>
                    <Link href="/lessons" className="button-link button-secondary" style={{ marginTop: "16px", justifyContent: "center" }}>Study Now</Link>
                 </div>
               ) : (
                 <p className="muted" style={{ marginTop: "16px" }}>Complete the profile setup to unlock tailored lessons.</p>
               )}
            </article>

            {!user.isPremium && (
               <article className="card stack" style={{ padding: "40px", background: "linear-gradient(135deg, var(--primary), #ec4899)", border: "none" }}>
                  <h3 style={{ fontSize: "1.5rem", fontWeight: "800" }}>Unlock Excellence.</h3>
                  <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.8)" }}>Upgrade to unlimited corrections and full track access.</p>
                  <Link href="/pricing" className="button-link" style={{ background: "#fff", color: "#000", justifyContent: "center" }}>See Plans</Link>
               </article>
            )}
         </div>
      </div>
    </div>
  );
}
