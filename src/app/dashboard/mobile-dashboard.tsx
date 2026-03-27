"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface MobileDashboardProps {
  user: any;
  profile: any;
  translations: any;
  lang: string;
}

export function MobileDashboard({ user, profile, translations: t, lang }: MobileDashboardProps) {
  const [greeting, setGreeting] = useState("");
  const [streak] = useState(7);
  const [progress] = useState(68);
  const [activeTab, setActiveTab] = useState("activity");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(lang === "fr" ? "Bonjour" : lang === "ar" ? "صباح الخير" : "Good morning");
    else if (hour < 18) setGreeting(lang === "fr" ? "Bon après-midi" : lang === "ar" ? "مساء الخير" : "Good afternoon");
    else setGreeting(lang === "fr" ? "Bonsoir" : lang === "ar" ? "مساء النور" : "Good evening");
  }, [lang]);

  const quickActions = [
    { icon: "✍️", label: t.nav_writing || "Write", href: "/write", color: "#6366f1", desc: "Practice" },
    { icon: "📝", label: t.nav_exams || "Exams", href: "/exams", color: "#10b981", desc: "Mock tests" },
    { icon: "📚", label: t.nav_library || "Learn", href: "/lessons", color: "#f59e0b", desc: "Study" },
    { icon: "🎯", label: "BAC Week", href: "/bac-week", color: "#ec4899", desc: "7-day prep" },
  ];

  const stats = [
    { label: "Essays", value: "12", icon: "📄" },
    { label: "Streak", value: `${streak}d`, icon: "🔥" },
    { label: "Score", value: "14.5", icon: "📊" },
  ];

  const recentActivity = [
    { title: "Technology Essay", score: 12, date: "2h ago", icon: "✍️", color: "#6366f1" },
    { title: "BAC 2024 Mock", score: 14, date: "1d ago", icon: "📝", color: "#10b981" },
    { title: "Grammar Lesson", score: null, date: "2d ago", icon: "📚", color: "#f59e0b" },
  ];

  const upcoming = [
    { title: "Daily Essay", due: "Today", urgent: true, icon: "⏰" },
    { title: "Vocab Quiz", due: "Tomorrow", urgent: false, icon: "📖" },
  ];

  return (
    <div style={{ padding: "20px 20px 100px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <p style={{ color: "var(--ink-dim)", fontSize: "14px", margin: 0 }}>{greeting}</p>
          <h1 style={{ fontSize: "26px", fontWeight: 900, margin: "4px 0 0" }}>{user.fullName?.split(" ")[0] || "Student"}</h1>
        </div>
        <div style={{ position: "relative" }}>
          <img src={`https://ui-avatars.com/api/?name=${user.fullName}&background=6366f1&color=fff`} alt="" width="48" height="48" style={{ borderRadius: "50%", border: "2px solid var(--primary)" }} />
          <div style={{ position: "absolute", bottom: 0, right: 0, width: "12px", height: "12px", background: "#10b981", borderRadius: "50%", border: "2px solid #000" }} />
        </div>
      </div>

      {/* Badges */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <span className="pill" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", display: "flex", alignItems: "center", gap: "4px" }}>
          🔥 {streak} Day Streak
        </span>
        <span className="pill" style={{ background: "rgba(99, 102, 241, 0.15)", color: "#6366f1" }}>
          {profile.bacSection}
        </span>
      </div>

      {/* Progress */}
      <div className="card card-vibrant" style={{ padding: "20px", borderRadius: "20px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
          <span style={{ fontSize: "14px", color: "var(--ink-dim)" }}>BAC Ready</span>
          <span style={{ fontSize: "22px", fontWeight: 900, color: "var(--primary)" }}>{progress}%</span>
        </div>
        <div style={{ height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "100px" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, var(--primary), #8b5cf6)", borderRadius: "100px" }} />
        </div>
      </div>

      {/* Quick Actions */}
      <h2 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "12px" }}>Quick Actions</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "20px" }}>
        {quickActions.map((action, idx) => (
          <Link key={idx} href={action.href} className="card card-interactive" style={{ padding: "16px", borderRadius: "16px", textDecoration: "none", borderLeft: `3px solid ${action.color}` }}>
            <span style={{ fontSize: "28px", marginBottom: "8px", display: "block" }}>{action.icon}</span>
            <div style={{ fontSize: "15px", fontWeight: 700 }}>{action.label}</div>
            <div style={{ fontSize: "12px", color: "var(--ink-dim)" }}>{action.desc}</div>
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="card" style={{ padding: "16px", borderRadius: "16px", display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
        {stats.map((stat, idx) => (
          <div key={idx} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "20px" }}>{stat.icon}</div>
            <div style={{ fontSize: "18px", fontWeight: 800 }}>{stat.value}</div>
            <div style={{ fontSize: "11px", color: "var(--ink-dim)" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {["activity", "upcoming"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "12px",
              border: "none",
              background: activeTab === tab ? "var(--primary)" : "rgba(255,255,255,0.05)",
              color: activeTab === tab ? "white" : "var(--ink-dim)",
              fontWeight: 700,
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            {tab === "activity" ? "📋 Recent" : "📅 Upcoming"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="stack" style={{ gap: "10px" }}>
        {activeTab === "activity" ? (
          recentActivity.map((item, idx) => (
            <div key={idx} className="card" style={{ padding: "16px", borderRadius: "16px", display: "flex", alignItems: "center", gap: "12px", borderLeft: `3px solid ${item.color}` }}>
              <span style={{ fontSize: "24px" }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "15px" }}>{item.title}</div>
                <div style={{ fontSize: "12px", color: "var(--ink-dim)" }}>{item.date}</div>
              </div>
              {item.score && <div className="pill" style={{ background: "rgba(16, 185, 129, 0.2)", color: "#10b981" }}>{item.score}/20</div>}
            </div>
          ))
        ) : (
          upcoming.map((item, idx) => (
            <div key={idx} className="card" style={{ padding: "16px", borderRadius: "16px", display: "flex", alignItems: "center", gap: "12px", border: item.urgent ? "1px solid rgba(239, 68, 68, 0.3)" : undefined }}>
              <span style={{ fontSize: "24px" }}>{item.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: "15px" }}>{item.title}</div>
                <div style={{ fontSize: "12px", color: item.urgent ? "#ef4444" : "var(--ink-dim)" }}>{item.due}</div>
              </div>
              <div className="pill" style={{ background: item.urgent ? "rgba(239, 68, 68, 0.2)" : "rgba(255,255,255,0.1)", color: item.urgent ? "#ef4444" : "white" }}>
                {item.urgent ? "⚡ Due" : "Upcoming"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
