import Link from "next/link";

export default function HomePage() {
  return (
    <div className="page-stack home-page">
      <section className="hero">
        <div className="hero-badge" style={{ marginBottom: "32px", animation: "reveal-up 1s ease" }}>
          <span className="pill" style={{ textTransform: "uppercase", letterSpacing: "2px", fontWeight: "900", background: "rgba(99, 102, 241, 0.15)", color: "var(--primary)", borderColor: "var(--primary)" }}>
            Tunisian BAC - High-Stakes Language Track
          </span>
        </div>
        
        <h1 className="hero-title">
          Turn Language <br/>
          Skills Into
          <span className="text-gradient"> Excellence</span>
        </h1>
        
        <p className="hero-text">
          Master Arabic, French, English, and all optional subjects with AI-powered corrections, 
          structured BAC-style libraries, and daily missions built specifically for Tunisian students.
        </p>

        <div className="actions hero-actions" style={{ gap: "24px", justifyContent: "center" }}>
          <Link className="button-link" href="/auth/signup" style={{ padding: "20px 48px", fontSize: "18px" }}>
            <span>Start Learning for Free</span>
            <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Link>
          <Link className="button-link button-secondary" href="/exams" style={{ padding: "20px 48px", fontSize: "18px" }}>
            Browse Exams
          </Link>
        </div>

        <div className="stats-row row-between" style={{ marginTop: "100px", maxWidth: "900px", margin: "100px auto 0", padding: "0 20px" }}>
          <div className="stat-item stack" style={{ alignItems: "center" }}>
            <span className="stat-number" style={{ fontSize: "3rem", fontWeight: "800", color: "var(--primary)" }}>15+</span>
            <span className="stat-label muted">Target Score</span>
          </div>
          <div className="stat-item stack" style={{ alignItems: "center" }}>
            <span className="stat-number" style={{ fontSize: "3rem", fontWeight: "800", color: "var(--accent)" }}>LIVE</span>
            <span className="stat-label muted">Arabic / French / English</span>
          </div>
          <div className="stat-item stack" style={{ alignItems: "center" }}>
            <span className="stat-number" style={{ fontSize: "3rem", fontWeight: "800", color: "#ec4899" }}>OPT</span>
            <span className="stat-label muted">Spanish / German / Italian</span>
          </div>
        </div>
      </section>

      {/* Feature Section with Glassmorphism */}
      <section className="stack">
        <div className="section-header" style={{ textAlign: "center", marginBottom: "40px" }}>
          <span className="eyebrow" style={{ color: "var(--primary)" }}>The Loop</span>
          <h2 className="section-title" style={{ fontSize: "3.5rem", marginBottom: "16px" }}>Complete the Cycle of Mastery.</h2>
        </div>

        <div className="grid grid-cols-3">
          <article className="card stack">
            <div style={{ fontSize: "40px", marginBottom: "20px" }}>✍️</div>
            <h3 className="section-title" style={{ fontSize: "1.5rem" }}>Writing Simulator</h3>
            <p className="muted">Write essays using actual past BAC prompts and receive instant criteria-based marking across Grammar, Vocabulary, and Structure.</p>
          </article>
          <article className="card stack">
            <div style={{ fontSize: "40px", marginBottom: "20px" }}>📚</div>
            <h3 className="section-title" style={{ fontSize: "1.5rem" }}>Personalized Library</h3>
            <p className="muted">An ultra-clean hub showing only the language rules and vocabulary sets needed for your specific BAC section and chosen languages.</p>
          </article>
          <article className="card stack">
            <div style={{ fontSize: "40px", marginBottom: "20px" }}>⚡</div>
            <h3 className="section-title" style={{ fontSize: "1.5rem" }}>Daily Missions</h3>
            <p className="muted">Earn XP and keep your streak alive by completing targeted mini-missions generated every single day to patch your skill gaps.</p>
          </article>
        </div>
      </section>

      <section className="stack" style={{ marginTop: "60px" }}>
        <div className="card hero-panel" style={{ padding: "80px", textAlign: "left", background: "radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent)", border: "1px solid var(--primary)" }}>
           <div className="row-between">
              <div className="stack" style={{ maxWidth: "60%", gap: "24px" }}>
                <span className="eyebrow">Real Feedback</span>
                <h2 className="section-title" style={{ fontSize: "3.5rem" }}>See Your Essay Score Instantly.</h2>
                <p className="muted" style={{ fontSize: "1.2rem" }}>No more waiting days for corrections. Our smart logic breaks down your mistakes with 16.5+ precision scoring across every Tunisian criteria.</p>
                <Link className="button-link" href="/write" style={{ alignSelf: "flex-start" }}>Try the Correction Engine</Link>
              </div>
              <div className="stack" style={{ width: "300px" }}>
                <div className="card" style={{ padding: "32px", transform: "rotate(2deg)" }}>
                  <div className="row-between">
                    <span>Overall</span>
                    <strong style={{ fontSize: "2rem", color: "var(--accent)" }}>16.5</strong>
                  </div>
                  <div className="stack" style={{ marginTop: "20px", gap: "12px" }}>
                    <div className="stack" style={{ gap: "4px" }}>
                      <span className="muted" style={{ fontSize: "11px" }}>Grammar</span>
                      <div className="score-bar" style={{ height: "6px" }}><div className="score-fill" style={{ width: "85%", borderRadius: "100px" }}></div></div>
                    </div>
                    <div className="stack" style={{ gap: "4px" }}>
                      <span className="muted" style={{ fontSize: "11px" }}>Vocabulary</span>
                      <div className="score-bar" style={{ height: "6px" }}><div className="score-fill" style={{ width: "70%", borderRadius: "100px" }}></div></div>
                    </div>
                  </div>
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* Pricing Section with Enhanced Elite Card */}
      <section className="pricing-grid">
         <article className="card pricing-card stack">
            <span className="eyebrow">The Standard</span>
            <div className="row-between">
               <span style={{ fontSize: "3rem", fontWeight: "900" }}>0</span>
               <span className="muted">TND / Forever</span>
            </div>
            <ul className="stack" style={{ listStyle: "none", padding: 0 }}>
               <li className="row-between" style={{ justifyContent: "flex-start", gap: "10px" }}><span>✅</span> 5 Free corrections / Week</li>
               <li className="row-between" style={{ justifyContent: "flex-start", gap: "10px" }}><span>✅</span> English / French / Arabic Tracks</li>
               <li className="row-between" style={{ justifyContent: "flex-start", gap: "10px" }}><span>✅</span> All Daily Missions</li>
            </ul>
            <Link className="button-link button-secondary" href="/auth/signup" style={{ marginTop: "20px" }}>Get Started Free</Link>
         </article>

         <article className="card pricing-card elite stack" style={{ position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "16px", right: "16px" }}><span className="pill" style={{ color: "var(--primary)", borderColor: "var(--primary)" }}>MOST POPULAR</span></div>
            <span className="eyebrow" style={{ color: "var(--primary)" }}>The Excellence</span>
            <div className="row-between">
               <span style={{ fontSize: "3rem", fontWeight: "900" }}>29.9<span style={{ fontSize: "1rem" }}>0</span></span>
               <span className="muted">TND / Season</span>
            </div>
            <ul className="stack" style={{ listStyle: "none", padding: 0 }}>
               <li className="row-between" style={{ justifyContent: "flex-start", gap: "10px" }}><span>🚀</span> Unlimited Corrections</li>
               <li className="row-between" style={{ justifyContent: "flex-start", gap: "10px" }}><span>🎨</span> All Optional Language Access</li>
               <li className="row-between" style={{ justifyContent: "flex-start", gap: "10px" }}><span>🛠️</span> Advanced Skill Analytics</li>
            </ul>
            <Link className="button-link" href="/auth/signup" style={{ marginTop: "20px" }}>Upgrade to Elite Now</Link>
         </article>
      </section>
    </div>
  );
}
