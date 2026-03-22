import Link from "next/link";
import { requireCurrentUser } from "@/lib/auth";
import { ensureStudentProfile, getDashboardMissions } from "@/lib/missions";
import { getBacSectionLabel } from "@/lib/learning";
import { FocusWidget, ExcellenceStats } from "./excellence-components";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireCurrentUser();
  const profile = await ensureStudentProfile(user.id);
  const missions = await getDashboardMissions(user.id);

  return (
    <div className="page-stack dashboard-container" style={{ paddingBottom: "100px" }}>
      {/* Cinematic Header with Glass Floating Profile */}
      <header className="row-between" style={{ alignItems: "flex-end", padding: "60px 0 40px" }}>
        <div className="stack" style={{ gap: "12px" }}>
          <span className="pill" style={{ color: "var(--primary)", borderColor: "var(--primary)" }}>Section {getBacSectionLabel(profile.bacSection)}</span>
          <h1 className="section-title" style={{ fontSize: "5rem", letterSpacing: "-4px", lineHeight: 0.9 }}>
             Welcome, <br/>
             <span className="text-gradient">{(user.fullName || "Student").split(' ')[0]}.</span>
          </h1>
        </div>
        <div className="stack" style={{ alignItems: "flex-end", gap: "12px" }}>
           <span className="eyebrow" style={{ fontSize: "12px" }}>BAC Countdown</span>
           <div className="card" style={{ padding: "12px 24px", borderRadius: "100px", border: "1px solid var(--accent-glow)", background: "rgba(245, 158, 11, 0.05)" }}>
              <span style={{ fontSize: "1.2rem", fontWeight: "900", color: "var(--accent)" }}>74 DAYS LEFT</span>
           </div>
        </div>
      </header>

      <div className="grid" style={{ gridTemplateColumns: "1.8fr 1fr", gap: "32px", alignItems: "start" }}>
        {/* Main Progression Area */}
        <div className="stack" style={{ gap: "40px" }}>
          {/* Excellence Roadmap View */}
          <section className="card stack" style={{ padding: "48px", border: "1px solid var(--glass-border)", background: "radial-gradient(circle at top right, rgba(99, 102, 241, 0.05), transparent)" }}>
             <div className="row-between">
                <h2 style={{ fontSize: "2rem", fontFamily: "var(--font-display)", fontWeight: 800 }}>Your Excellence Path.</h2>
                <span className="pill">Current Mission</span>
             </div>
             <p className="muted" style={{ fontSize: "1rem" }}>Follow this path to reach your target score of 17.5/20.</p>
             
             <div className="roadmap-path stack" style={{ marginTop: "32px", gap: "16px" }}>
                <div className="card row-between" style={{ padding: "20px", background: "white", color: "black", boxShadow: "0 0 30px var(--primary-glow)", transform: "translateX(20px)" }}>
                   <div className="stack" style={{ gap: "4px" }}>
                      <span className="eyebrow" style={{ color: "var(--primary)", fontSize: "10px" }}>NEXT STEP</span>
                      <strong style={{ fontSize: "1.2rem" }}>Conjunction of Tenses (FR) Mastery</strong>
                      <p className="muted" style={{ fontSize: "12px", color: "rgba(0,0,0,0.5)" }}>Estimated: 15 min · Coef 2</p>
                   </div>
                   <Link href="/lessons" className="button-link" style={{ background: "black", color: "white", padding: "12px 24px" }}>Start</Link>
                </div>
                <div className="card row-between" style={{ padding: "20px", opacity: 0.5, borderStyle: "dashed" }}>
                   <div className="stack" style={{ gap: "4px" }}>
                      <span className="eyebrow" style={{ fontSize: "10px" }}>LOCKED</span>
                      <strong style={{ fontSize: "1.2rem" }}>Arabic Literary Devices (AR)</strong>
                      <p className="muted" style={{ fontSize: "12px" }}>Level up to unlock this step.</p>
                   </div>
                </div>
             </div>
          </section>

          {/* Quick Skill Grid - Reorganized */}
          <div className="grid grid-cols-2" style={{ gap: "24px" }}>
             <article className="card stack" style={{ padding: "32px", border: "1px solid rgba(255,255,255,0.03)" }}>
                <span className="eyebrow" style={{ color: "var(--primary)" }}>Writing Practice</span>
                <p className="muted" style={{ margin: "12px 0 24px" }}>Simulate real BAC essay questions with instant AI feedback.</p>
                <Link href="/write" className="button-link button-secondary" style={{ width: "100%", justifyContent: "center" }}>Enter Writing Lab</Link>
             </article>
             <article className="card stack" style={{ padding: "32px", border: "1px solid rgba(255,255,255,0.03)" }}>
                <span className="eyebrow" style={{ color: "var(--success)" }}>Exam Archive</span>
                <p className="muted" style={{ margin: "12px 0 24px" }}>Browse the largest collection of past national exams.</p>
                <Link href="/exams" className="button-link button-secondary" style={{ width: "100%", justifyContent: "center" }}>View Exams</Link>
             </article>
          </div>
        </div>

        {/* Sidebar Intelligence Panel */}
        <div className="stack" style={{ gap: "32px" }}>
          <ExcellenceStats />
          <FocusWidget />
          
          <div className="card stack" style={{ padding: "32px", background: "rgba(255,255,255,0.02)" }}>
             <span className="eyebrow" style={{ color: "var(--accent)" }}>Pro Tip of the Day</span>
             <p style={{ marginTop: "16px", color: "var(--ink)", fontStyle: "italic", fontSize: "0.95rem" }}>
                "In English summaries, never reuse the same verb more than twice. AI graders look for 'Lexical Variation' to score the 17+ range."
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
