import Link from "next/link";
import { requireCurrentUser } from "@/lib/auth";

export default async function PricingPage() {
  const user = await requireCurrentUser().catch(() => null);

  return (
    <div className="page-stack container">
      <section className="card stack hero-panel" style={{ textAlign: "center", padding: "48px 24px" }}>
        <span className="eyebrow" style={{ color: "#e7bf87" }}>BacLang Premium</span>
        <h1 className="section-title" style={{ maxWidth: "600px", margin: "0 auto", color: "white" }}>
          Unlock unlimited corrections and master all your languages.
        </h1>
        <p className="muted" style={{ maxWidth: "500px", margin: "0 auto", color: "rgba(255,255,255,0.8)" }}>
          Hit your 16+/20 target score with unlimited, instant bac-style feedback across English, French, Arabic, and all optional languages.
        </p>
      </section>

      <section className="pricing-strip" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", alignItems: "start", marginTop: "24px" }}>
        <div className="card stack" style={{ borderTop: "4px solid rgba(20, 36, 54, 0.1)" }}>
          <span className="eyebrow">Starter Plan</span>
          <h2 className="section-title">Free Forever</h2>
          <p className="muted">Essential practice to get a feel for the grading system.</p>
          <div className="stack" style={{ margin: "16px 0" }}>
            <span style={{ fontSize: "2.5rem", fontWeight: 800 }}>0 TND</span>
            <span className="muted">/ week</span>
          </div>
          <ul className="bullet-list" style={{ listStyle: "none", padding: 0 }}>
            <li className="admin-checkbox">✓ 5 free AI corrections per week</li>
            <li className="admin-checkbox">✓ English pilot access</li>
            <li className="admin-checkbox" style={{ opacity: 0.5 }}>✕ Multi-language analytics</li>
            <li className="admin-checkbox" style={{ opacity: 0.5 }}>✕ Targeted exam blueprints</li>
          </ul>
          {user ? (
            <button className="button-link button-secondary full-width" disabled>Current Plan</button>
          ) : (
            <Link className="button-link button-secondary full-width" href="/auth/signup">Sign Up Free</Link>
          )}
        </div>

        <div className="card stack" style={{ borderTop: "4px solid var(--primary)", position: "relative", transform: "scale(1.02)", boxShadow: "var(--shadow-lg)" }}>
          <span className="pill success-pill" style={{ position: "absolute", top: "-12px", right: "24px", margin: 0 }}>Most Popular</span>
          <span className="eyebrow" style={{ color: "var(--primary)" }}>Premium Student</span>
          <h2 className="section-title">29.90 TND</h2>
          <p className="muted">Full, unrestricted access to guarantee your bac success.</p>
          <div className="stack" style={{ margin: "16px 0" }}>
            <span style={{ fontSize: "2.5rem", fontWeight: 800 }}>29.90 TND</span>
            <span className="muted">/ one-time till bac exams</span>
          </div>
          <ul className="bullet-list" style={{ listStyle: "none", padding: 0 }}>
            <li className="admin-checkbox">✓ Unlimited AI essay corrections</li>
            <li className="admin-checkbox">✓ French, Arabic, Spanish, German, Italian unlocked</li>
            <li className="admin-checkbox">✓ Priority daily missions</li>
            <li className="admin-checkbox">✓ Detailed skill mastery tracking</li>
          </ul>
          {user?.isPremium ? (
            <button className="button-link full-width" disabled>You are Premium</button>
          ) : (
            <Link className="button-link full-width" href="/auth/login">Upgrade Now (Contact Admin)</Link>
          )}
        </div>
      </section>
    </div>
  );
}
