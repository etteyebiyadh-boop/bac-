"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PlanToggleForm } from "./plan-toggle-form";
import { LessonForm } from "./lesson-form";
import { SocialGenerator } from "./social-generator";
import { BulkGenerator } from "./bulk-generator";
import { AnalyticsDashboard } from "./analytics-dashboard";

import { Shield, AlertTriangle, ShieldCheck, Activity, Users, Lock, ChevronRight } from "lucide-react";

type AdminTab = "USERS" | "CONTENT" | "SECURITY" | "MARKETING" | "BULK" | "ANALYTICS";

interface TabbedAdminProps {
  recentUsers: any[];
  securityStats: {
    totalUsers: number;
    recentLogins: number;
    failedAttempts: number;
    suspiciousEvents: any[];
    premiumUsers: number;
  };
}

export function TabbedAdmin({ recentUsers, securityStats }: TabbedAdminProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as AdminTab) || "USERS";
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);

  useEffect(() => {
    const tab = searchParams.get("tab") as AdminTab;
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [searchParams, activeTab]);

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    // Update URL without a full reload
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/admin?${params.toString()}`);
  };

  return (
    <div className="page-stack">
      {/* Tab Switcher */}
      <nav className="row-between" style={{ 
        justifyContent: "center", 
        gap: "8px", 
        background: "rgba(255,255,255,0.03)", 
        padding: "8px", 
        borderRadius: "100px", 
        border: "1px solid var(--glass-border)", 
        maxWidth: "650px", 
        margin: "0 auto",
        overflowX: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        whiteSpace: "nowrap"
      }}>
        {[
          { id: "USERS", label: "Students", icon: "💎" },
          { id: "CONTENT", label: "Curriculum", icon: "📚" },
          { id: "SECURITY", label: "Security", icon: "🛡️" },
          { id: "MARKETING", label: "Media Engine", icon: "🚀" },
          { id: "BULK", label: "Bulk Engine", icon: "💎" },
          { id: "ANALYTICS", label: "Analytics", icon: "📊" }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => handleTabChange(tab.id as AdminTab)}
            className="nav-link"
            style={{ 
              background: activeTab === tab.id ? "rgba(255,255,255,0.1)" : "transparent",
              color: activeTab === tab.id ? "white" : "var(--ink-dim)",
              border: "none",
              cursor: "pointer",
              padding: "10px 16px",
              minHeight: "auto",
              boxShadow: "none",
              borderRadius: "50px",
              fontSize: "13px"
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </nav>

      {activeTab === "USERS" && (
        <div className="page-stack fadeIn">
          <PlanToggleForm />
          
          <section className="card stack">
            <h2 className="section-title">Recent Student Acquisitions</h2>
            <div className="stack" style={{ gap: "12px", marginTop: "12px" }}>
              {recentUsers.map((user) => (
                <article key={user.id} className="row-between" style={{ padding: "20px", background: "rgba(255,255,255,0.02)", borderRadius: "16px", border: "1px solid var(--glass-border)" }}>
                  <div className="stack" style={{ gap: "4px" }}>
                    <strong style={{ fontSize: "1.1rem" }}>{user.email}</strong>
                    <span className="muted" style={{ fontSize: "13px" }}>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                  <span className={`pill ${user.isPremium ? "" : "button-secondary"}`} style={{ opacity: user.isPremium ? 1 : 0.5 }}>
                    {user.isPremium ? "ELITE / PREMIUM" : "STANDARD"}
                  </span>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}

      {activeTab === "CONTENT" && (
        <div className="page-stack fadeIn">
          <LessonForm />
          
          <section className="card stack" style={{ background: "rgba(99, 102, 241, 0.03)", border: "1px solid var(--primary)" }}>
             <span className="eyebrow" style={{ color: "var(--primary)" }}>Language Sections Hub</span>
             <h2 className="section-title">Organized Content Audit</h2>
             <p className="muted">Use the &quot;Library&quot; page to filter your tracks and visualize the exact content your students see.</p>
          </section>
        </div>
      )}

      {activeTab === "SECURITY" && (
        <div className="page-stack fadeIn">
           <header className="row-between">
              <div className="stack" style={{ gap: "8px" }}>
                 <div className="row" style={{ gap: "8px", color: "var(--primary)", fontWeight: 900 }}>
                    <Shield size={20} /> CYBERSECURITY COMMAND CENTER
                 </div>
              </div>
              <div className="card row" style={{ padding: "16px 24px", gap: "12px", border: "1px solid #22c55e", background: "rgba(34, 197, 94, 0.05)" }}>
                 <ShieldCheck size={24} color="#22c55e" />
                 <div className="stack">
                    <strong style={{ fontSize: "14px", color: "#22c55e" }}>PLATFORM SECURE</strong>
                    <span className="muted" style={{ fontSize: "10px" }}>Active Protections ACTIVE</span>
                 </div>
              </div>
           </header>

           <div className="grid grid-cols-3 gap-24">
              <div className="card stack" style={{ padding: "24px", gap: "16px" }}>
                 <Activity size={20} color="var(--primary)" />
                 <h3 className="muted" style={{ fontSize: "12px", letterSpacing: "1px" }}>AUTH STABILITY</h3>
                 <div className="row-between">
                    <strong>{securityStats.recentLogins} Success</strong>
                    <strong style={{ color: "var(--accent)" }}>{securityStats.failedAttempts} Failed</strong>
                 </div>
              </div>
              <div className="card stack" style={{ padding: "24px", gap: "16px" }}>
                 <Users size={20} color="var(--primary)" />
                 <h3 className="muted" style={{ fontSize: "12px", letterSpacing: "1px" }}>PROTECTION</h3>
                 <div className="row-between">
                    <strong>{securityStats.totalUsers} Total</strong>
                    <strong style={{ color: "#22c55e" }}>{securityStats.premiumUsers} Elite</strong>
                 </div>
              </div>
              <div className="card stack" style={{ padding: "24px", gap: "16px" }}>
                 <Lock size={20} color="var(--primary)" />
                 <h3 className="muted" style={{ fontSize: "12px", letterSpacing: "1px" }}>IP STATUS</h3>
                 <div className="row-between">
                    <strong>0 Blocked</strong>
                    <ShieldCheck size={16} color="#22c55e" />
                 </div>
              </div>
           </div>

           <section className="stack" style={{ gap: "24px" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>🚨 RECENT ALERTS</h2>
              <div className="stack" style={{ gap: "12px" }}>
                 {securityStats.suspiciousEvents.length > 0 ? (
                    securityStats.suspiciousEvents.map((event: any) => (
                       <div key={event.id} className="card row-between" style={{ padding: "16px" }}>
                          <div className="row" style={{ gap: "12px" }}>
                             <AlertTriangle size={18} color="var(--accent)" />
                             <div className="stack">
                                <strong>{event.event}</strong>
                                <span className="muted" style={{ fontSize: "11px" }}>{event.userId}</span>
                             </div>
                          </div>
                          <span className="muted" style={{ fontSize: "11px" }}>{new Date(event.timestamp).toLocaleTimeString()}</span>
                       </div>
                    ))
                 ) : (
                    <p className="muted" style={{ textAlign: "center", padding: "40px" }}>No threats detected.</p>
                 )}
              </div>
           </section>
        </div>
      )}

      {activeTab === "ANALYTICS" && (
        <div className="page-stack fadeIn">
          <AnalyticsDashboard />
        </div>
      )}

      {activeTab === "MARKETING" && (
        <div className="page-stack fadeIn">
          <SocialGenerator />
        </div>
      )}

      {activeTab === "BULK" && (
        <div className="page-stack fadeIn">
          <BulkGenerator />
        </div>
      )}


      <style jsx>{`
        .fadeIn {
          animation: reveal-up 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
      `}</style>
    </div>
  );
}
