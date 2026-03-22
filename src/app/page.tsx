import Link from "next/link";

export default function HomePage() {
  return (
    <div className="page-stack home-page">
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-badge">
            <span className="badge badge-accent">Tunisian BAC - English live now</span>
          </div>
          <h1 className="hero-title">
            Turn Writing Practice Into
            <span className="text-gradient"> Real BAC Progress</span>
          </h1>
          <p className="hero-text">
            Start with BAC-style English correction, then keep improving through smart lessons,
            daily missions, and exam practice built for Tunisian students.
          </p>

          <div className="actions hero-actions">
            <Link className="button-link btn-lg" href="/auth/signup">
              <span>Start Free</span>
              <svg className="btn-icon" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </Link>
            <Link className="button-link button-secondary btn-lg" href="/exams">
              Browse Exams
            </Link>
          </div>

          <p className="muted hero-disclaimer">
            English correction is live now. French, Arabic, and Optional Languages (Spanish, German, Italian) are rolling out next.
          </p>

          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">/20 Target Score</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">EN</span>
              <span className="stat-label">Live Now</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">FR+AR+Opt</span>
              <span className="stat-label">Next Tracks</span>
            </div>
          </div>
        </div>

        <div className="card hero-panel">
          <div className="panel-header">
            <div className="panel-title-group">
              <span className="eyebrow">Live Correction</span>
              <h2 className="panel-title">See Your Essay Score Instantly</h2>
            </div>
            <span className="pill pulse">Active</span>
          </div>

          <div className="score-preview">
            <div className="score-main">
              <span className="score-value">16.5</span>
              <span className="score-total">/20</span>
            </div>
            <div className="score-breakdown">
              <div className="score-item">
                <span className="score-label">Grammar</span>
                <div className="score-bar-mini">
                  <div className="score-fill-mini" style={{ width: "85%" }} />
                </div>
                <span className="score-mini">17/20</span>
              </div>
              <div className="score-item">
                <span className="score-label">Vocabulary</span>
                <div className="score-bar-mini">
                  <div className="score-fill-mini" style={{ width: "78%" }} />
                </div>
                <span className="score-mini">15.5/20</span>
              </div>
              <div className="score-item">
                <span className="score-label">Structure</span>
                <div className="score-bar-mini">
                  <div className="score-fill-mini" style={{ width: "82%" }} />
                </div>
                <span className="score-mini">16.5/20</span>
              </div>
            </div>
          </div>

          <div className="hero-signals">
            <div className="signal-row">
              <span className="signal-label">Instant Feedback</span>
              <strong className="signal-value">Overall score + 3 skill breakdowns</strong>
            </div>
            <div className="signal-row">
              <span className="signal-label">Smart Suggestions</span>
              <strong className="signal-value">Lessons matched to your weakest skill</strong>
            </div>
            <div className="signal-row">
              <span className="signal-label">Daily Progress</span>
              <strong className="signal-value">Track streaks and mission completion</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="section-header">
          <span className="section-overline">Official BAC Sections</span>
          <h2 className="section-title">Built around the real Tunisian section map</h2>
          <p className="section-subtitle">
            We use the official BAC sections to personalize the roadmap now and keep future French,
            Arabic, and Optional Language tracks aligned with the right students.
          </p>
        </div>

        <div className="grid grid-cols-3 section-cards">
          <div className="card section-card">
            <div className="section-icon">M</div>
            <h3 className="section-card-title">Mathematiques</h3>
            <p className="section-card-subjects">Arabic, French, English</p>
            <span className="section-coef">Coef 2 each</span>
          </div>
          <div className="card section-card">
            <div className="section-icon">S</div>
            <h3 className="section-card-title">Sciences Exp</h3>
            <p className="section-card-subjects">Arabic, French, English</p>
            <span className="section-coef">Coef 2 each</span>
          </div>
          <div className="card section-card">
            <div className="section-icon">I</div>
            <h3 className="section-card-title">Sciences Info</h3>
            <p className="section-card-subjects">Arabic, French, English</p>
            <span className="section-coef">Coef 2 each</span>
          </div>
          <div className="card section-card">
            <div className="section-icon">T</div>
            <h3 className="section-card-title">Sciences Tech</h3>
            <p className="section-card-subjects">Arabic, French, English</p>
            <span className="section-coef">Coef 2 each</span>
          </div>
          <div className="card section-card section-card-featured">
            <div className="section-icon">L</div>
            <h3 className="section-card-title">Lettres</h3>
            <p className="section-card-subjects">+ Arabic Lit, French Lit, English Lit, Optional Langs</p>
            <span className="section-coef">Coef 3 / 1.5</span>
          </div>
          <div className="card section-card">
            <div className="section-icon">E</div>
            <h3 className="section-card-title">Economie</h3>
            <p className="section-card-subjects">Arabic, French, English</p>
            <span className="section-coef">Coef 2 each</span>
          </div>
        </div>
      </section>

      <section className="card trust-strip">
        <article className="trust-item">
          <div className="trust-icon trust-icon-primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="eyebrow">Rubric Scoring</span>
          <strong>Real BAC-style marking criteria</strong>
          <p className="muted">
            Scores map to BAC-style rubrics with grammar, vocabulary, and structure scored
            separately.
          </p>
        </article>

        <article className="trust-item">
          <div className="trust-icon trust-icon-accent">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="eyebrow">BAC-Aligned Content</span>
          <strong>Live English modules, expansion-ready structure</strong>
          <p className="muted">
            The live exam bank follows official BAC English modules while the wider product stays
            ready for French and Arabic expansion.
          </p>
        </article>

        <article className="trust-item">
          <div className="trust-icon trust-icon-success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="eyebrow">Progress Tracking</span>
          <strong>Daily missions and streaks</strong>
          <p className="muted">
            Build consistent study habits with daily missions, streak tracking, and skill
            progression.
          </p>
        </article>
      </section>

      <section className="page-section">
        <div className="section-header">
          <span className="section-overline">How It Works</span>
          <h2 className="section-title">Three Simple Steps to Better Scores</h2>
          <p className="section-subtitle">
            A focused loop designed for maximum improvement in minimum time.
          </p>
        </div>

        <div className="feature-grid home-steps">
          <article className="card feature-card">
            <div className="feature-number">01</div>
            <h3 className="feature-title">Pick a Prompt</h3>
            <p className="feature-desc">
              Choose from curated BAC-style exam questions organized by module. Each prompt
              includes timing hints and context.
            </p>
          </article>

          <article className="card feature-card">
            <div className="feature-number">02</div>
            <h3 className="feature-title">Write and Submit</h3>
            <p className="feature-desc">
              Write your essay in the exam simulator. Get instant scoring with a clear breakdown of
              strengths and weak points.
            </p>
          </article>

          <article className="card feature-card">
            <div className="feature-number">03</div>
            <h3 className="feature-title">Learn and Improve</h3>
            <p className="feature-desc">
              Review the corrected version, open the recommended lesson, and keep tracking your
              progress over time.
            </p>
          </article>
        </div>
      </section>

      <section className="panel-grid pricing-section">
        <article className="card pricing-card">
          <div className="pricing-header">
            <span className="eyebrow">Free Plan</span>
            <div className="pricing-price">
              <span className="price">0</span>
              <span className="currency">TND</span>
            </div>
          </div>
          <ul className="pricing-features">
            <li><svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>5 corrections/week</li>
            <li><svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>English correction track</li>
            <li><svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Daily missions</li>
            <li><svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Progress dashboard</li>
          </ul>
          <Link className="button-link button-secondary full-width" href="/auth/signup">
            Get Started Free
          </Link>
        </article>

        <article className="card pricing-card pricing-premium">
          <div className="pricing-badge">Best Value</div>
          <div className="pricing-header">
            <span className="eyebrow">Premium</span>
            <div className="pricing-price">
              <span className="price">29.90</span>
              <span className="currency">TND</span>
              <span className="period">/season</span>
            </div>
          </div>
          <ul className="pricing-features">
            <li><svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Unlimited corrections</li>
            <li><svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>French, Arabic & Optional tracks access</li>
            <li><svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Grammar and vocabulary lessons</li>
            <li><svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Advanced analytics</li>
            <li><svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>Priority new features</li>
          </ul>
          <Link className="button-link button-accent full-width" href="/auth/signup">
            Upgrade to Premium
          </Link>
        </article>
      </section>
    </div>
  );
}
