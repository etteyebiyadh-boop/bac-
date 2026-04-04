import { db } from "@/lib/db";
import { requireAdminUser } from "@/lib/auth";
import { TabbedAdmin } from "./tabbed-admin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireAdminUser();

  const [recentUsers, recentLogins, failedAttempts, suspiciousEvents, premiumUsers] = await Promise.all([
    db.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        id: true,
        email: true,
        isPremium: true,
        createdAt: true
      }
    }),
    db.analyticsEvent.count({ where: { event: "auth:login" } }),
    db.analyticsEvent.count({ where: { event: "auth:login_failed" } }),
    db.analyticsEvent.findMany({
      where: { event: { startsWith: "security:" } },
      orderBy: { timestamp: "desc" },
      take: 10
    }),
    db.user.count({ where: { isPremium: true } })
  ]);

  const securityStats = {
    totalUsers: recentUsers.length,
    recentLogins,
    failedAttempts,
    suspiciousEvents,
    premiumUsers
  };


  return (
    <div className="page-stack">
      <section className="card stack hero-panel" style={{ 
        padding: "var(--mobile-padding, 40px) 20px", 
        border: "1px solid var(--primary)", 
        background: "radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent)",
        minHeight: "300px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center"
      }}>
        <div style={{ position: "absolute", right: "-10%", top: "-50%", width: "200px", height: "200px", background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div className="stack" style={{ zIndex: 1, position: "relative" }}>
          <span className="eyebrow" style={{ color: "var(--primary)" }}>Bac Excellence Control Room</span>
          <h1 className="section-title" style={{ fontSize: "clamp(2rem, 8vw, 4rem)", lineHeight: 1 }}>Manage The <br/>Future of BAC.</h1>
          <p className="muted" style={{ fontSize: "1rem", maxWidth: "600px", margin: "16px auto 0" }}>
            The centralized command tower for content publishing, user elitism, and viral social media amplification.
          </p>
        </div>
      </section>

      <TabbedAdmin 
        recentUsers={JSON.parse(JSON.stringify(recentUsers))} 
        securityStats={JSON.parse(JSON.stringify(securityStats))}
      />

    </div>
  );
}
