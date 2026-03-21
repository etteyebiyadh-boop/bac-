import Link from "next/link";

export default function HomePage() {
  return (
    <div className="page-stack">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">English-first launch for Tunisian Bac students</span>
          <h1>Reach 15+/20 with AI correction and bac-style practice.</h1>
          <p className="hero-text">
            BacLang starts with the highest-value wedge, English writing improvement, then expands
            into French, Arabic, optional languages, daily exercises, and smart lessons.
          </p>
          <div className="actions">
            <Link className="button-link" href="/auth/signup">
              Start free
            </Link>
            <Link className="button-link button-secondary" href="/exams">
              Explore the English exam pack
            </Link>
          </div>
          <div className="mini-stats">
            <div className="mini-stat">
              <strong>English MVP</strong>
              <span>Writing correction and exam practice live now</span>
            </div>
            <div className="mini-stat">
              <strong>15+/20 focus</strong>
              <span>Built around measurable mark improvement</span>
            </div>
            <div className="mini-stat">
              <strong>Multilingual path</strong>
              <span>French and Arabic expansion planned next</span>
            </div>
          </div>
        </div>

        <div className="card hero-panel stack">
          <span className="eyebrow">Core loop</span>
          <h2 className="section-title">Write. Correct. Improve. Repeat.</h2>
          <div className="score-grid">
            <div className="metric-card">
              <span className="metric-label">Target score</span>
              <strong className="metric-value">15+/20</strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">Live in MVP</span>
              <strong className="metric-value">5 English bac prompts</strong>
            </div>
          </div>
          <p className="muted">
            Phase 1 stays deliberately narrow so the team can validate correction quality, habit
            formation, and freemium conversion before expanding the product surface.
          </p>
        </div>
      </section>

      <section className="feature-grid">
        <article className="card stack">
          <span className="eyebrow">01</span>
          <h3 className="section-title">AI bac correction</h3>
          <p>
            Students submit an essay and instantly receive a score out of 20, a corrected version,
            and specific next-step feedback.
          </p>
        </article>

        <article className="card stack">
          <span className="eyebrow">02</span>
          <h3 className="section-title">Curated exam practice</h3>
          <p>
            The launch pack ships with five bac-style English prompts, each with difficulty labels,
            model answers, and writing methodology.
          </p>
        </article>

        <article className="card stack">
          <span className="eyebrow">03</span>
          <h3 className="section-title">Progress dashboard</h3>
          <p>
            Learners can track recent scores, streaks, score breakdowns, and free-plan usage in one
            mobile-friendly screen.
          </p>
        </article>
      </section>

      <section className="card pricing-strip">
        <div className="stack">
          <span className="eyebrow">Launch model</span>
          <h2 className="section-title">
            Freemium from day one, with premium expansion after clear value is proven.
          </h2>
        </div>
        <div className="panel-grid">
          <div className="card inset-card stack">
            <strong>Free</strong>
            <p className="muted">
              3 corrections every 7 days, access to the core exam set, and progress tracking.
            </p>
          </div>
          <div className="card inset-card stack">
            <strong>Premium</strong>
            <p className="muted">
              More corrections, larger exam archive, advanced feedback layers, and the future smart
              lesson and daily mission system.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
