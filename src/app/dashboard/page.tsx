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
  return score === null ? "No score yet" : `${score.toFixed(1)} / 20`;
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
      <section className="card stack">
        <span className="eyebrow">Student dashboard</span>
        <div className="row-between">
          <div className="stack">
            <h1 className="section-title">Track your road to {TARGET_BAC_SCORE}+/20.</h1>
            <p className="muted">
              Logged in as {user.email}. Your next gains come from one focused mission, one smart
              lesson, and one new corrected draft at a time.
            </p>
          </div>
          <span className="pill">{user.isPremium ? "Premium plan" : "Free plan"}</span>
        </div>
      </section>

      {!user.isPremium && (
        <section className="card stack hero-panel" style={{ padding: '32px 24px', position: 'relative', overflow: 'hidden' }}>
          <div className="row-between" style={{ alignItems: 'center' }}>
            <div className="stack" style={{ maxWidth: '600px', zIndex: 1 }}>
              <span className="eyebrow" style={{ color: '#e7bf87' }}>Premium access</span>
              <h2 className="section-title" style={{color: 'white'}}>Keep the correction loop unlimited.</h2>
              <p className="muted" style={{ margin: 0, color: 'rgba(255,255,255,0.85)' }}>
                You are on a limited free plan with 5 corrections per week. Upgrade for unlimited
                practice and access to the expanding French and Arabic tracks as they mature.
              </p>
            </div>
            <Link className="button-link" style={{ background: 'white', color: 'var(--primary-strong)', zIndex: 1 }} href="/pricing">
              Upgrade to Premium
            </Link>
          </div>
          <div style={{ position: 'absolute', right: '-10%', top: '-50%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(231,191,135,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
        </section>
      )}

      <section className="stats-grid">
        <article className="card metric-card">
          <span className="metric-label">Primary track</span>
          <strong className="metric-value">{getLanguageLabel(profile.primaryLanguage)}</strong>
        </article>
        <article className="card metric-card">
          <span className="metric-label">Latest score</span>
          <strong className="metric-value">{formatScore(metrics.latestScore)}</strong>
        </article>
        <article className="card metric-card">
          <span className="metric-label">Best score</span>
          <strong className="metric-value">{formatScore(metrics.bestScore)}</strong>
        </article>
        <article className="card metric-card">
          <span className="metric-label">Current streak</span>
          <strong className="metric-value">{metrics.currentStreak} day(s)</strong>
        </article>
        <article className="card metric-card">
          <span className="metric-label">XP earned</span>
          <strong className="metric-value">{xpTotal}</strong>
        </article>
        <article className="card metric-card">
          <span className="metric-label">Usage this week</span>
          <strong className="metric-value">
            {user.isPremium
              ? `${metrics.correctionsThisWeek} corrections`
              : `${metrics.remainingFreeCorrections} free correction(s) left`}
          </strong>
        </article>
      </section>

      <ProfileSetupForm
        initialProfile={{
          sectionLabel: profile.bacSection,
          targetScore: profile.targetScore,
          examYear: profile.examYear,
          primaryLanguage: profile.primaryLanguage,
          secondaryLanguagesJson: profile.secondaryLanguagesJson
        }}
      />

      {profileIsIncomplete ? (
        <section className="card stack">
          <span className="eyebrow">Complete your setup</span>
          <h2 className="section-title">Finish your study profile to personalize the app.</h2>
          <p className="muted">
            Choose your official BAC section and exam year so daily missions and future language
            tracks match your path more accurately.
          </p>
        </section>
      ) : null}

      <section className="panel-grid">
        <article className="card stack">
          <div className="row-between">
            <h2 className="section-title">Skill averages</h2>
            <span className="pill">Recent attempts</span>
          </div>
          {metrics.averageBreakdown ? (
            <div className="score-grid">
              <div className="score-line">
                <div className="row-between">
                  <span>Grammar</span>
                  <strong>{metrics.averageBreakdown.grammar.toFixed(1)} / 20</strong>
                </div>
                <div className="score-bar">
                  <div
                    className="score-fill"
                    style={{ width: `${(metrics.averageBreakdown.grammar / 20) * 100}%` }}
                  />
                </div>
              </div>
              <div className="score-line">
                <div className="row-between">
                  <span>Vocabulary</span>
                  <strong>{metrics.averageBreakdown.vocabulary.toFixed(1)} / 20</strong>
                </div>
                <div className="score-bar">
                  <div
                    className="score-fill"
                    style={{ width: `${(metrics.averageBreakdown.vocabulary / 20) * 100}%` }}
                  />
                </div>
              </div>
              <div className="score-line">
                <div className="row-between">
                  <span>Structure</span>
                  <strong>{metrics.averageBreakdown.structure.toFixed(1)} / 20</strong>
                </div>
                <div className="score-bar">
                  <div
                    className="score-fill"
                    style={{ width: `${(metrics.averageBreakdown.structure / 20) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <p className="muted">Submit your first essay to unlock score analytics.</p>
          )}
          <p className="muted">
            {metrics.averageScore === null
              ? "No average yet."
              : `Average score across recent submissions: ${metrics.averageScore.toFixed(1)} / 20`}
          </p>
        </article>

        <article className="card stack">
          <span className="eyebrow">Daily mission</span>
          <h2 className="section-title">{mission.title}</h2>
          <p className="muted">{mission.description}</p>
          <p className="muted">
            Priority skill: {getSkillLabel(mission.skillFocus as "grammar" | "vocabulary" | "structure")}
          </p>
          <span className={`pill ${mission.status === "COMPLETED" ? "success-pill" : ""}`}>
            {mission.status === "COMPLETED" ? "Completed today" : `Ready for +${mission.xpReward} XP`}
          </span>
          <Link className="button-link full-width" href="/daily">
            Open daily mission
          </Link>
          <Link className="button-link button-secondary full-width" href="/lessons">
            Review smart lessons
          </Link>
        </article>
      </section>

      <section className="panel-grid">
        <article className="card stack">
          <h2 className="section-title">Next best actions</h2>
          <p className="muted">{buildRecommendedLessonMessage(weakestSkill)}</p>
          <Link className="button-link full-width" href="/write">
            Write a new essay
          </Link>
          <Link className="button-link button-secondary full-width" href="/exams">
            Practice a past exam
          </Link>
        </article>

        <article className="card stack">
          <h2 className="section-title">Recommended lesson</h2>
          {mission.lesson ? (
            <>
              <strong>{mission.lesson.title}</strong>
              <p className="muted">{mission.lesson.summary}</p>
              <Link className="button-link full-width" href="/lessons">
                Study this lesson
              </Link>
            </>
          ) : (
            <p className="muted">
              Lesson recommendations unlock here once content is seeded for your active track.
            </p>
          )}
        </article>
      </section>

      <section className="card stack">
        <div className="row-between">
          <h2 className="section-title">Recent submissions</h2>
          <span className="pill">{metrics.totalCorrections} total correction(s)</span>
        </div>
        {recentSubmissions.length === 0 ? (
          <p className="muted">No submissions yet. Start with one bac exam or a free writing task.</p>
        ) : (
          <div className="recent-list">
            {recentSubmissions.map((submission) => (
              <article className="recent-item" key={submission.id}>
                <div className="stack">
                  <strong>
                    {submission.exam
                      ? `${submission.exam.year} - ${submission.exam.title}`
                      : "Free writing practice"}
                  </strong>
                  <span className="muted">
                    <span className="pill" style={{marginRight: '8px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 600}}>
                      {submission.language?.charAt(0) + (submission.language?.slice(1).toLowerCase() ?? '')}
                    </span>
                    {new Date(submission.createdAt).toLocaleDateString("en-GB")} -{" "}
                    {submission.wordCount} words
                  </span>
                </div>
                <strong>{submission.overallScore.toFixed(1)} / 20</strong>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
