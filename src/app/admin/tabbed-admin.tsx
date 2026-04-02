"use client";

import { useState } from "react";
import { PlanToggleForm } from "./plan-toggle-form";
import { LessonForm } from "./lesson-form";
import { SocialGenerator } from "./social-generator";
import { AnalyticsDashboard } from "./analytics-dashboard";

type AdminTab = "USERS" | "CONTENT" | "MARKETING" | "ANALYTICS";

export function TabbedAdmin({ recentUsers }: { recentUsers: any[] }) {
  const [activeTab, setActiveTab] = useState<AdminTab>("USERS");

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
        maxWidth: "500px", 
        margin: "0 auto",
        overflowX: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        whiteSpace: "nowrap",
        flexWrap: "nowrap"
      }}>
        {[
          { id: "USERS", label: "Students", icon: "💎" },
          { id: "CONTENT", label: "Curriculum", icon: "📚" },
          { id: "ANALYTICS", label: "Analytics", icon: "📊" },
          { id: "MARKETING", label: "Media Engine", icon: "🚀" }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as AdminTab)}
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
              fontSize: "13px",
              flexShrink: 0
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
             <p className="muted">Use the &quot;Library&quot; page to filter your tracks and visualize the exact content your students see. Ensure each track (Arabic, French, English, and Optionals) has at least 3 high-quality starting modules.</p>
             <div className="grid grid-cols-2">
                <div className="card" style={{ padding: "24px" }}>
                   <strong>Mandatory Tracks</strong>
                   <ul className="stack" style={{ marginTop: "12px", listStyle: "none", padding: 0 }}>
                      <li>📖 ARABIC (Official BAC)</li>
                      <li>📖 FRENCH (Official BAC)</li>
                      <li>📖 ENGLISH (Official BAC)</li>
                   </ul>
                </div>
                <div className="card" style={{ padding: "24px" }}>
                   <strong>Optional Exclusives</strong>
                   <ul className="stack" style={{ marginTop: "12px", listStyle: "none", padding: 0 }}>
                      <li>🇪🇸 SPANISH (Optional)</li>
                      <li>🇩🇪 GERMAN (Optional)</li>
                      <li>🇮🇹 ITALIAN (Optional)</li>
                   </ul>
                </div>
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

      <style jsx>{`
        .fadeIn {
          animation: reveal-up 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }
      `}</style>
    </div>
  );
}
