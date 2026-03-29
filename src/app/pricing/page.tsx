import Link from "next/link";
import { requireCurrentUser } from "@/lib/auth";

export default async function PricingPage() {
  const user = await requireCurrentUser().catch(() => null);

  return (
    <div className="page-stack container">
      <section className="card stack hero-panel" style={{ textAlign: "center", padding: "48px 24px" }}>
        <span className="eyebrow" style={{ color: "#e7bf87" }}>Bac Excellence Premium</span>
        <h1 className="section-title" style={{ maxWidth: "700px", margin: "0 auto", color: "white" }}>
          Choose your path to BAC success. Shareable content is free forever.
        </h1>
        <p className="muted" style={{ maxWidth: "500px", margin: "0 auto", color: "rgba(255,255,255,0.8)" }}>
          Shareable cards, certificates, and viral content are FREE. Only essay corrections are limited on free plans.
        </p>
      </section>

      <section className="pricing-strip grid grid-cols-3" style={{ gap: "20px", alignItems: "start", marginTop: "24px" }}>
        {/* FREE STARTER */}
        <div className="card stack" style={{ borderTop: "4px solid rgba(20, 36, 54, 0.1)" }}>
          <span className="eyebrow">Starter</span>
          <h2 className="section-title">Free</h2>
          <p className="muted">Test the platform before upgrading.</p>
          <div className="stack" style={{ margin: "16px 0" }}>
            <span style={{ fontSize: "2.5rem", fontWeight: 800 }}>0 TND</span>
            <span className="muted">/ forever</span>
          </div>
          <ul className="bullet-list" style={{ listStyle: "none", padding: 0 }}>
            <li className="admin-checkbox">5 AI corrections/week</li>
            <li className="admin-checkbox">Basic dashboard & streak</li>
            <li className="admin-checkbox" style={{ opacity: 0.4 }}>❌ No shareable content</li>
            <li className="admin-checkbox" style={{ opacity: 0.4 }}>❌ No certificates</li>
          </ul>
          {user ? (
            <button className="button-link button-secondary full-width" disabled>Current Plan</button>
          ) : (
            <Link className="button-link button-secondary full-width" href="/auth/signup">Sign Up</Link>
          )}
        </div>

        {/* FREE SENIOR - VIRAL TIER */}
        <div className="card stack" style={{ borderTop: "4px solid #fbbf24", position: "relative", transform: "scale(1.02)", boxShadow: "0 0 30px rgba(251,191,36,0.15)" }}>
          <span className="pill" style={{ position: "absolute", top: "-12px", right: "24px", margin: 0, background: "#fbbf24", color: "#000" }}>🔥 VIRAL</span>
          <span className="eyebrow" style={{ color: "#fbbf24" }}>Senior (Free)</span>
          <h2 className="section-title">Content Creator</h2>
          <p className="muted">Unlimited shareable content to grow your personal brand.</p>
          <div className="stack" style={{ margin: "16px 0" }}>
            <span style={{ fontSize: "2.5rem", fontWeight: 800 }}>0 TND</span>
            <span className="muted">/ forever</span>
          </div>
          <ul className="bullet-list" style={{ listStyle: "none", padding: 0 }}>
            <li className="admin-checkbox" style={{ color: "#fbbf24" }}>✨ Unlimited shareable cards</li>
            <li className="admin-checkbox" style={{ color: "#fbbf24" }}>🏆 Downloadable certificates</li>
            <li className="admin-checkbox" style={{ color: "#fbbf24" }}>📱 Viral content generator</li>
            <li className="admin-checkbox">5 AI corrections/week</li>
          </ul>
          <Link className="button-link full-width" href="/auth/signup?plan=senior" style={{ background: "#fbbf24", color: "#000" }}>
            Join as Content Creator →
          </Link>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "12px", textAlign: "center" }}>
            Perfect for students building their study community
          </p>
        </div>

        {/* PREMIUM */}
        <div className="card stack" style={{ borderTop: "4px solid var(--primary)", position: "relative" }}>
          <span className="pill success-pill" style={{ position: "absolute", top: "-12px", right: "24px", margin: 0 }}>Most Popular</span>
          <span className="eyebrow" style={{ color: "var(--primary)" }}>Premium</span>
          <h2 className="section-title">Student Pro</h2>
          <p className="muted">Unlimited corrections + all content features.</p>
          <div className="stack" style={{ margin: "16px 0" }}>
            <span style={{ fontSize: "2.5rem", fontWeight: 800 }}>29.90 TND</span>
            <span className="muted">/ one-time</span>
          </div>
          <ul className="bullet-list" style={{ listStyle: "none", padding: 0 }}>
            <li className="admin-checkbox" style={{ color: "var(--primary)" }}>✅ Everything in Senior</li>
            <li className="admin-checkbox" style={{ color: "var(--primary)" }}>♾️ Unlimited AI corrections</li>
            <li className="admin-checkbox">English/French/Arabic tracks</li>
            <li className="admin-checkbox">Priority support</li>
          </ul>
          {user?.isPremium ? (
            <button className="button-link full-width" disabled>You are Premium</button>
          ) : (
            <Link className="button-link full-width" href="/auth/login">Upgrade to Pro</Link>
          )}
        </div>
      </section>
          {/* Feature Comparison */}
      <section className="card" style={{ marginTop: "40px", padding: "32px" }}>
        <h3 className="section-title" style={{ marginBottom: "24px" }}>Why offer free shareable content?</h3>
        <div className="grid grid-cols-2" style={{ gap: "24px" }}>
          <div>
            <h4 style={{ color: "#fbbf24", marginBottom: "12px" }}>🚀 Viral Growth Strategy</h4>
            <p className="muted" style={{ fontSize: "14px", lineHeight: 1.6 }}>
              When students download and share your branded cards, they become your marketers. 
              Every certificate shared = free advertising. Every study tip posted = new user acquisition.
            </p>
          </div>
          <div>
            <h4 style={{ color: "var(--primary)", marginBottom: "12px" }}>💎 Freemium Conversion</h4>
            <p className="muted" style={{ fontSize: "14px", lineHeight: 1.6 }}>
              Students use free content → hit correction limit → upgrade to Premium. 
              The shareable content hooks them, the corrections monetize them.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
