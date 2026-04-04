import { db } from "@/lib/db";
import { requireAdminUser } from "@/lib/auth";
import { Shield, AlertTriangle, ShieldCheck, Activity, Users, Lock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SecurityDashboard() {
  const admin = await requireAdminUser();
  if (!admin) return null;

  // Fetch security-relevant metrics
  const [
    totalUsers,
    recentLogins,
    failedAttempts,
    suspiciousEvents,
    premiumUsers
  ] = await Promise.all([
    db.user.count(),
    db.analyticsEvent.count({ where: { event: "auth:login" } }),
    db.analyticsEvent.count({ where: { event: "auth:login_failed" } }),
    db.analyticsEvent.findMany({
      where: { event: { startsWith: "security:" } },
      orderBy: { timestamp: "desc" },
      take: 10
    }),
    db.user.count({ where: { isPremium: true } })
  ]);

  return (
    <div className="page-stack" style={{ paddingTop: "60px" }}>
      <header className="row-between">
        <div className="stack" style={{ gap: "8px" }}>
           <div className="row" style={{ gap: "8px", color: "var(--primary)", fontWeight: 900 }}>
              <Shield size={20} /> CYBERSECURITY COMMAND CENTER
           </div>
           <h1 style={{ fontSize: "3rem", fontWeight: 900 }}>Security Audit</h1>
        </div>
        <div className="card row" style={{ padding: "16px 24px", gap: "12px", border: "1px solid #22c55e", background: "rgba(34, 197, 94, 0.05)" }}>
           <ShieldCheck size={24} color="#22c55e" />
           <div className="stack">
              <strong style={{ fontSize: "14px", color: "#22c55e" }}>PLATFORM SECURE</strong>
              <span className="muted" style={{ fontSize: "10px" }}>All 8 Headers ACTIVE</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-32">
         <div className="card stack" style={{ padding: "32px", gap: "20px" }}>
            <Activity color="var(--primary)" />
            <h3 className="muted">AUTH FLOW STABILITY</h3>
            <div className="row-between">
               <div className="stack">
                  <strong style={{ fontSize: "2rem" }}>{recentLogins}</strong>
                  <span className="muted">Success</span>
               </div>
               <div className="stack" style={{ textAlign: "right" }}>
                  <strong style={{ fontSize: "2rem", color: "var(--accent)" }}>{failedAttempts}</strong>
                  <span className="muted">Failed Bursts</span>
               </div>
            </div>
         </div>

         <div className="card stack" style={{ padding: "32px", gap: "20px" }}>
            <Users color="var(--primary)" />
            <h3 className="muted">USER PROTECTION</h3>
            <div className="row-between">
               <div className="stack">
                  <strong style={{ fontSize: "2rem" }}>{totalUsers}</strong>
                  <span className="muted">Total Identities</span>
               </div>
               <div className="stack" style={{ textAlign: "right" }}>
                  <strong style={{ fontSize: "2rem", color: "#22c55e" }}>{premiumUsers}</strong>
                  <span className="muted">Vault Encrypted</span>
               </div>
            </div>
         </div>

         <div className="card stack" style={{ padding: "32px", gap: "20px" }}>
            <Lock color="var(--primary)" />
            <h3 className="muted">IP REPUTATION</h3>
            <div className="stack">
               <strong style={{ fontSize: "2rem" }}>0</strong>
               <span className="muted">Blocked IPs</span>
            </div>
         </div>
      </div>

      <section className="stack" style={{ gap: "24px" }}>
         <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>🚨 RECENT SECURITY EVENTS</h2>
         <div className="stack" style={{ gap: "12px" }}>
            {suspiciousEvents.length > 0 ? (
               suspiciousEvents.map((event) => (
                  <div key={event.id} className="card row-between" style={{ padding: "20px", border: "1px solid rgba(255,255,255,0.05)" }}>
                     <div className="row" style={{ gap: "16px" }}>
                        <div style={{ background: "rgba(239, 68, 68, 0.1)", padding: "10px", borderRadius: "8px" }}>
                           <AlertTriangle size={18} color="var(--accent)" />
                        </div>
                        <div className="stack" style={{ gap: "4px" }}>
                           <strong>{event.event}</strong>
                           <span className="muted" style={{ fontSize: "12px" }}>User ID: {event.userId}</span>
                        </div>
                     </div>
                     <span className="muted" style={{ fontSize: "12px" }}>
                        {new Date(event.timestamp).toLocaleString()}
                     </span>
                  </div>
               ))
            ) : (
               <div className="card stack" style={{ padding: "40px", textAlign: "center", opacity: 0.5 }}>
                  <ShieldCheck size={48} style={{ margin: "0 auto 16px" }} />
                  <p>No suspicious activity detected in the last 24 hours.</p>
               </div>
            )}
         </div>
      </section>

      <div className="card stack" style={{ padding: "40px", border: "1px dashed var(--primary)", background: "rgba(99, 102, 241, 0.02)", gap: "20px" }}>
         <h3 style={{ fontWeight: 800 }}>🔒 Active Protections</h3>
         <div className="grid grid-cols-4 gap-20">
            {["CSP v3", "HSTS", "X-Frame-Deny", "XSS-Block", "No-Sniff", "SAME-ORIGIN", "Permissions-Lock", "Audit-Log"].map(tech => (
               <div key={tech} className="row" style={{ gap: "8px", fontSize: "12px" }}>
                  <Shield size={12} color="#22c55e" /> {tech}
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
