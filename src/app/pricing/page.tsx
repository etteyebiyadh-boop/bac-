import Link from "next/link";
import { requireCurrentUser } from "@/lib/auth";

export default async function PricingPage() {
  const user = await requireCurrentUser().catch(() => null);

  return (
    <div className="page-stack container">
      <section className="card stack hero-panel" style={{ textAlign: "center", padding: "48px 24px" }}>
        <span className="eyebrow" style={{ color: "#e7bf87" }}>Bac Excellence Premium</span>
        <h1 className="section-title" style={{ maxWidth: "600px", margin: "0 auto", color: "white" }}>
          Unlock unlimited corrections for the BAC language loop.
        </h1>
        <p className="muted" style={{ maxWidth: "500px", margin: "0 auto", color: "rgba(255,255,255,0.8)" }}>
          English correction is live now. Premium removes the usage cap and gives you access as the
          French and Arabic tracks expand inside the same workflow.
        </p>
      </section>

      <section className="pricing-strip grid grid-cols-2" style={{ gap: "24px", alignItems: "start", marginTop: "24px" }}>
        <div className="card stack" style={{ borderTop: "4px solid rgba(20, 36, 54, 0.1)" }}>
          <span className="eyebrow">Starter Plan</span>
          <h2 className="section-title">Free Forever</h2>
          <p className="muted">A focused way to test the BAC correction workflow before upgrading.</p>
          <div className="stack" style={{ margin: "16px 0" }}>
            <span style={{ fontSize: "2.5rem", fontWeight: 800 }}>0 TND</span>
            <span className="muted">/ week</span>
          </div>
          <ul className="bullet-list" style={{ listStyle: "none", padding: 0 }}>
            <li className="admin-checkbox">5 free AI corrections per week</li>
            <li className="admin-checkbox">English writing and exam practice</li>
            <li className="admin-checkbox">Dashboard, streak, and daily mission</li>
            <li className="admin-checkbox" style={{ opacity: 0.5 }}>No unlimited correction access</li>
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
          <p className="muted">For students who want unlimited repetition and the full learning loop.</p>
          <div className="stack" style={{ margin: "16px 0" }}>
            <span style={{ fontSize: "2.5rem", fontWeight: 800 }}>29.90 TND</span>
            <span className="muted">/ one-time till bac exams</span>
          </div>
          <ul className="bullet-list" style={{ listStyle: "none", padding: 0 }}>
            <li className="admin-checkbox">Unlimited AI essay corrections</li>
            <li className="admin-checkbox">English lesson and exam library</li>
            <li className="admin-checkbox">Access as French and Arabic tracks expand</li>
            <li className="admin-checkbox">Detailed progress and mastery tracking</li>
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
