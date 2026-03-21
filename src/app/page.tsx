import Link from "next/link";

export default function HomePage() {
  return (
    <div className="page-stack home-page">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Tunisian Bac · Language sections</span>
          <h1>Train like the exam. Get feedback in /20—not vague stars.</h1>
          <p className="hero-text">
            BacLang is built for students who want a real mark: grammar, vocabulary, and structure
            scored separately, then blended into one overall score—like an examiner would think. Write
            a draft, see a corrected version, and know exactly what to fix next.
          </p>

          <div className="actions">
            <Link className="button-link" href="/auth/signup">
              Start free
            </Link>
            <Link className="button-link button-secondary" href="/exams">
              Browse exam prompts
            </Link>
          </div>

          <p className="muted home-disclaimer">
            AI feedback simulates bac-style marking; it is not an official ministry grade.
          </p>

          <div className="mini-stats">
            <div className="mini-stat">
              <strong>15+/20 focus</strong>
              <span>Every screen pushes toward a clear score target, not endless drills.</span>
            </div>
            <div className="mini-stat">
              <strong>One core loop</strong>
              <span>Write → instant correction → lesson match → come back tomorrow.</span>
            </div>
            <div className="mini-stat">
              <strong>Built for phones</strong>
              <span>Study between classes; the UI stays fast and calm.</span>
            </div>
          </div>
        </div>

        <div className="card hero-panel stack">
          <div className="row-between">
            <div className="stack">
              <span className="eyebrow">The desk metaphor</span>
              <h2 className="section-title">Exam paper on the left. Examiner notes on the right.</h2>
            </div>
            <span className="pill">Live product</span>
          </div>

          <div className="score-grid">
            <div className="metric-card">
              <span className="metric-label">What you get</span>
              <strong className="metric-value">/20 + breakdown</strong>
            </div>
            <div className="metric-card">
              <span className="metric-label">Practice bank</span>
              <strong className="metric-value">Curated prompts</strong>
            </div>
          </div>

          <div className="hero-signals">
            <div className="signal-row">
              <span className="signal-label">Correction</span>
              <strong className="signal-value">Overall score, three skill scores, rewritten essay</strong>
            </div>
            <div className="signal-row">
              <span className="signal-label">Follow-through</span>
              <strong className="signal-value">Lesson suggestion based on your weakest skill</strong>
            </div>
            <div className="signal-row">
              <span className="signal-label">Habit</span>
              <strong className="signal-value">Dashboard, daily mission, streaks</strong>
            </div>
          </div>

          <p className="muted">
            Start in English; the architecture is ready to grow with more languages and archives as
            you validate quality with real students.
          </p>
        </div>
      </section>

      <section className="card trust-strip">
        <article className="trust-item">
          <span className="eyebrow">Rubric, not vibes</span>
          <strong>Scores map to grammar, vocabulary, and structure.</strong>
          <p className="muted">
            You see where you lose marks—then you practice that skill deliberately.
          </p>
        </article>

        <article className="trust-item">
          <span className="eyebrow">Exam-shaped prompts</span>
          <strong>Realistic topics, timing hints, model answers.</strong>
          <p className="muted">
            Practice reads like the bac, not like a random internet exercise.
          </p>
        </article>

        <article className="trust-item">
          <span className="eyebrow">Freemium that teaches</span>
          <strong>Free tier builds the habit; premium removes friction.</strong>
          <p className="muted">
            Weekly correction limits keep costs predictable while you prove value.
          </p>
        </article>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <span className="eyebrow">How it works</span>
          <h2 className="section-title">Three steps. No noise.</h2>
          <p className="muted">
            The product is intentionally narrow: writing performance is the wedge; everything else
            supports repetition and clarity.
          </p>
        </div>

        <div className="feature-grid home-steps">
          <article className="card feature-card stack">
            <span className="eyebrow">01</span>
            <h3 className="section-title">Pick a prompt</h3>
            <p>
              Choose a curated bac-style exam question or write to your own prompt. Know how long
              it should take.
            </p>
          </article>

          <article className="card feature-card stack">
            <span className="eyebrow">02</span>
            <h3 className="section-title">Submit your draft</h3>
            <p>
              Get an overall mark out of 20, sub-scores, a short examiner summary, and a fully
              corrected version you can compare line by line.
            </p>
          </article>

          <article className="card feature-card stack">
            <span className="eyebrow">03</span>
            <h3 className="section-title">Fix the weakest skill</h3>
            <p>
              We point you toward the lesson area that matches your lowest pillar—then you come back
              tomorrow for a daily mission and another draft.
            </p>
          </article>
        </div>
      </section>

      <section className="panel-grid">
        <article className="card pricing-strip stack">
          <span className="eyebrow">Pricing logic</span>
          <h2 className="section-title">Free proves the magic. Premium removes limits.</h2>
          <div className="panel-grid">
            <div className="inset-card stack">
              <strong>Free</strong>
              <p className="muted">
                A weekly allowance of AI corrections (enough to feel the product), English-first on
                the free track, plus exams and dashboard.
              </p>
            </div>
            <div className="inset-card stack">
              <strong>Premium</strong>
              <p className="muted">
                Unlimited corrections, full language access where enabled, and room for deeper
                archives as you ship them.
              </p>
            </div>
          </div>
          <Link className="button-link button-secondary full-width" href="/pricing">
            See pricing
          </Link>
        </article>

        <article className="card stack">
          <span className="eyebrow">Roadmap discipline</span>
          <h2 className="section-title">English first. Scale after trust.</h2>
          <div className="hero-signals">
            <div className="signal-row">
              <span className="signal-label">Now</span>
              <strong className="signal-value">Writing correction + exams + habit loop</strong>
            </div>
            <div className="signal-row">
              <span className="signal-label">Next</span>
              <strong className="signal-value">Payments, more languages, richer content</strong>
            </div>
            <div className="signal-row">
              <span className="signal-label">Later</span>
              <strong className="signal-value">Schools, cohort programs, optional speaking</strong>
            </div>
          </div>
          <p className="muted">
            Founder-friendly sequencing: nail one exam-shaped experience before expanding surface
            area.
          </p>
        </article>
      </section>
    </div>
  );
}
