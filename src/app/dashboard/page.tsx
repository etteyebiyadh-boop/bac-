import Link from "next/link";
import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import { buildDashboardMetrics } from "@/lib/dashboard";
import { FREE_CORRECTIONS_PER_WEEK, TARGET_BAC_SCORE } from "@/lib/constants";

export const dynamic = "force-dynamic";

function formatScore(score: number | null) {
  return score === null ? "No score yet" : `${score.toFixed(1)} / 20`;
}

export default async function DashboardPage() {
  const user = await requireCurrentUser();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const [totalCorrections, correctionsThisWeek, recentSubmissions] = await Promise.all([
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
        }
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

  return (
    <div className="page-stack">
      <section className="card stack">
        <span className="eyebrow">Student dashboard</span>
        <div className="row-between">
          <div className="stack">
            <h1 className="section-title">Track your road to {TARGET_BAC_SCORE}+/20.</h1>
            <p className="muted">
              Logged in as {user.email}. Focus on frequent practice and lift the weakest skill first.
            </p>
          </div>
          <span className="pill">{user.isPremium ? "Premium plan" : "Free plan"}</span>
        </div>
      </section>

      <section className="stats-grid">
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
          <span className="metric-label">Usage this week</span>
          <strong className="metric-value">
            {user.isPremium
              ? `${metrics.correctionsThisWeek} corrections`
              : `${metrics.remainingFreeCorrections} free correction(s) left`}
          </strong>
        </article>
      </section>

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
          <h2 className="section-title">Next best actions</h2>
          <p className="muted">
            Keep your habit simple: one exam prompt, one corrected draft, one improvement goal.
          </p>
          <Link className="button-link full-width" href="/write">
            Write a new essay
          </Link>
          <Link className="button-link button-secondary full-width" href="/exams">
            Practice a past exam
          </Link>
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
