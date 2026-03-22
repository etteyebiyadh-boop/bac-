import Link from "next/link";

export default function HomePage() {
  return (
    <div className="page-stack home-page">
      <section className="hero">
        <div className="hero-badge" style={{ marginBottom: "32px" }}>
          <span className="pill" style={{ fontSize: "12px", letterSpacing: "2px", fontWeight: "900", background: "rgba(99, 102, 241, 0.15)", color: "var(--primary)", borderColor: "var(--primary)" }}>
            Tunisian BAC - High-Stakes Languages
          </span>
        </div>
        
        <h1 className="hero-title">
          Master the <br/>
          Language of
          <span className="text-gradient"> Excellence.</span>
        </h1>
        
        <p className="hero-text">
          Precision AI correction for Arabic, French, English, and all optional subjects. 
          Built exclusively for Tunisian BAC students aiming for 17/20+.
        </p>

        <div className="actions hero-actions" style={{ gap: "24px", justifyContent: "center" }}>
          <Link className="button-link" href="/auth/signup">
            <span>Start for free</span>
            <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Link>
          <Link className="button-link button-secondary" href="/exams">
            Browse Exams
          </Link>
        </div>

        <div className="stats-row" style={{ marginTop: "100px", display: "flex", gap: "60px", justifyContent: "center" }}>
          <div className="stat-item stack" style={{ alignItems: "center", gap: "4px" }}>
            <span style={{ fontSize: "3rem", fontWeight: "900", color: "var(--primary)", fontFamily: "var(--font-display)" }}>15+</span>
            <span className="muted" style={{ fontWeight: "800", fontSize: "12px" }}>TARGET SCORE</span>
          </div>
          <div className="stat-item stack" style={{ alignItems: "center", gap: "4px" }}>
            <span style={{ fontSize: "3rem", fontWeight: "900", color: "var(--accent)", fontFamily: "var(--font-display)" }}>EN+FR</span>
            <span className="muted" style={{ fontWeight: "800", fontSize: "12px" }}>LIVE TRACKS</span>
          </div>
          <div className="stat-item stack" style={{ alignItems: "center", gap: "4px" }}>
            <span style={{ fontSize: "3rem", fontWeight: "900", color: "#ec4899", fontFamily: "var(--font-display)" }}>OPT</span>
            <span className="muted" style={{ fontWeight: "800", fontSize: "12px" }}>SPANISH/GERMAN</span>
          </div>
        </div>
      </section>

      {/* Simplified Showcase */}
      <section className="grid grid-cols-3">
        <article className="card stack">
           <div style={{ fontSize: "48px" }}>⌨️</div>
           <h3 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Writing Lab</h3>
           <p className="muted">Write essays with actual past BAC prompts and get instant correction across grammar, vocab, and structure.</p>
        </article>
        <article className="card stack">
           <div style={{ fontSize: "48px" }}>🎓</div>
           <h3 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Smart Library</h3>
           <p className="muted">Personalized modules filtering only what you need for your BAC section and optional languages.</p>
        </article>
        <article className="card stack">
           <div style={{ fontSize: "48px" }}>⚡</div>
           <h3 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Daily Missions</h3>
           <p className="muted">Earn XP and keep your streak alive by completing targeted mini-missions generated specifically for your track.</p>
        </article>
      </section>

      <section className="card" style={{ padding: "80px", textAlign: "left", background: "radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent)", border: "1px solid var(--primary)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "48px", alignItems: "center" }}>
              <div className="stack" style={{ gap: "32px" }}>
                <span className="pill" style={{ color: "var(--primary)", borderColor: "var(--primary)" }}>AI FEEDBACK</span>
                <h2 style={{ fontSize: "4rem", fontFamily: "var(--font-display)", fontWeight: 800, lineHeight: 1 }}>Instant Criteria <br/>Precision Scoring.</h2>
                <p className="muted" style={{ fontSize: "1.2rem" }}>No more guessing. Get 16.5+ precision scoring across every Tunisian criteria instantly after submission.</p>
              </div>
              <div className="card" style={{ padding: "40px", transform: "rotate(3deg)", background: "rgba(0,0,0,0.5)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
                     <span style={{ fontSize: "14px", fontWeight: "700" }}>Overall Score</span>
                     <strong style={{ fontSize: "3rem", color: "var(--accent)" }}>16.5</strong>
                  </div>
                  <div className="stack" style={{ gap: "16px" }}>
                    <div style={{ padding: "0 0 12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "8px" }}>
                        <span>Grammar</span>
                        <strong>17/20</strong>
                      </div>
                      <div style={{ height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "100px" }}>
                        <div style={{ height: "100%", width: "85%", background: "var(--primary)", borderRadius: "inherit", boxShadow: "0 0 15px var(--primary)" }}></div>
                      </div>
                    </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Simple Pricing */}
      <section className="grid grid-cols-2" style={{ maxWidth: "1000px", margin: "60px auto 0" }}>
         <article className="card stack">
            <span className="eyebrow" style={{ color: "var(--ink-dim)" }}>Standard</span>
            <div style={{ fontSize: "3rem", fontWeight: "900" }}>0 <span style={{ fontSize: "14px", color: "var(--ink-dim)" }}>TND</span></div>
            <p className="muted">5 Free corrections weekly and access to all language tracks.</p>
            <Link className="button-link button-secondary" href="/auth/signup" style={{ marginTop: "24px" }}>Start Learning</Link>
         </article>
         <article className="card stack" style={{ border: "1px solid var(--primary)", background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1), transparent)" }}>
            <span className="eyebrow" style={{ color: "var(--primary)" }}>Elite Excellence</span>
            <div style={{ fontSize: "3rem", fontWeight: "900" }}>29.9<span style={{ fontSize: "1rem" }}>0</span> <span style={{ fontSize: "14px", color: "var(--ink-dim)" }}>TND</span></div>
            <p className="muted">Unlimited corrections, advanced analytics, and priority feature access.</p>
            <Link className="button-link" href="/auth/signup" style={{ marginTop: "24px", background: "var(--primary)", color: "white" }}>Upgrade Now</Link>
         </article>
      </section>
    </div>
  );
}
