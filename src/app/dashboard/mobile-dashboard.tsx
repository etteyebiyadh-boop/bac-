"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { DashboardIcon, FireIcon, ChartIcon, BookIcon, ClockIcon, TrophyIcon, TargetIcon } from "@/components/icons";
import { SkeletonCard, SkeletonProgress, SkeletonGrid, SkeletonStats, SkeletonList } from "@/components/skeletons";

interface MobileDashboardProps {
  user: any;
  profile: any;
  translations: any;
  lang: string;
}

interface ProgressDetail {
  label: string;
  value: number;
  color: string;
}

export function MobileDashboard({ user, profile, translations: t, lang }: MobileDashboardProps) {
  const [greeting, setGreeting] = useState("");
  const [streak] = useState(7);
  const [progress] = useState(68);
  const [activeTab, setActiveTab] = useState("activity");
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Simulate loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Welcome toast
  useEffect(() => {
    if (!isLoading) {
      const hour = new Date().getHours();
      let message = "";
      if (hour < 12) message = lang === "fr" ? "Bonne étude !" : lang === "ar" ? "دراسة سعيدة!" : "Ready to study?";
      else if (hour < 18) message = lang === "fr" ? "Continue comme ça !" : lang === "ar" ? "واصل التقدم!" : "Keep the momentum!";
      else message = lang === "fr" ? "Bonne soirée d'étude" : lang === "ar" ? "مساء دراسي سعيد" : "Evening study session";
      
      setToastMessage(message);
      setShowToast(true);
      const hideTimer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(hideTimer);
    }
  }, [isLoading, lang]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(lang === "fr" ? "Bonjour" : lang === "ar" ? "صباح الخير" : "Good morning");
    else if (hour < 18) setGreeting(lang === "fr" ? "Bon après-midi" : lang === "ar" ? "مساء الخير" : "Good afternoon");
    else setGreeting(lang === "fr" ? "Bonsoir" : lang === "ar" ? "مساء النور" : "Good evening");
  }, [lang]);

  const quickActions = [
    { Icon: BookIcon, label: t.nav_writing || "Write", href: "/write", color: "#6366f1", desc: "Practice" },
    { Icon: DashboardIcon, label: t.nav_exams || "Exams", href: "/exams", color: "#10b981", desc: "Mock tests" },
    { Icon: TrophyIcon, label: t.nav_library || "Learn", href: "/lessons", color: "#f59e0b", desc: "Study" },
    { Icon: TargetIcon, label: "BAC Week", href: "/bac-week", color: "#ec4899", desc: "7-day prep" },
  ];

  const stats = [
    { label: "Essays", value: "12", Icon: BookIcon, color: "#6366f1" },
    { label: "Streak", value: `${streak}d`, Icon: FireIcon, color: "#f59e0b" },
    { label: "Score", value: "14.5", Icon: ChartIcon, color: "#10b981" },
  ];

  const recentActivity = [
    { title: "Technology Essay", score: 12, date: "2h ago", Icon: BookIcon, color: "#6366f1" },
    { title: "BAC 2024 Mock", score: 14, date: "1d ago", Icon: DashboardIcon, color: "#10b981" },
    { title: "Grammar Lesson", score: null, date: "2d ago", Icon: TrophyIcon, color: "#f59e0b" },
  ];

  const granularProgress: ProgressDetail[] = [
    { label: "Grammar", value: 75, color: "#6366f1" },
    { label: "Vocab", value: 62, color: "#10b981" },
    { label: "Writing", value: 58, color: "#f59e0b" },
    { label: "Reading", value: 82, color: "#ec4899" },
    { label: "Listening", value: 70, color: "#8b5cf6" },
  ];

  const upcoming = [
    { title: "Daily Essay", due: "Today", urgent: true, icon: "⏰", color: "#ef4444" },
    { title: "Vocab Quiz", due: "Tomorrow", urgent: false, icon: "📖", color: "#6366f1" },
  ];

  if (isLoading) {
    return (
      <div style={{ padding: "20px 20px 100px" }}>
        <SkeletonCard className="stagger-item" />
        <div className="stagger-item" style={{ marginTop: "20px" }}>
          <SkeletonProgress />
        </div>
        <div className="stagger-item" style={{ marginTop: "20px" }}>
          <SkeletonGrid count={4} />
        </div>
        <div className="stagger-item" style={{ marginTop: "20px" }}>
          <SkeletonStats />
        </div>
        <div className="stagger-item" style={{ marginTop: "20px" }}>
          <SkeletonList count={3} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 20px 100px" }}>
      {/* Toast Notification */}
      <div className={`toast success ${showToast ? 'show' : ''}`}>
        {toastMessage}
      </div>

      {/* Header */}
      <div className="stagger-item" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
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
      <div className="stagger-item" style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        <span className="pill pill-glow" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#f59e0b", display: "flex", alignItems: "center", gap: "4px" }}>
          <FireIcon className="w-4 h-4" /> {streak} Day Streak
        </span>
        <span className="pill" style={{ background: "rgba(99, 102, 241, 0.15)", color: "#6366f1" }}>
          {profile.bacSection}
        </span>
      </div>

      {/* Progress */}
      <div className="stagger-item card card-vibrant" style={{ padding: "20px", borderRadius: "20px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
          <span style={{ fontSize: "14px", color: "var(--ink-dim)" }}>BAC Ready</span>
          <span style={{ fontSize: "22px", fontWeight: 900, color: "var(--primary)" }}>{progress}%</span>
        </div>
        <div style={{ height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "100px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, var(--primary), #8b5cf6)", borderRadius: "100px", transition: "width 1s ease-out" }} />
        </div>
        
        {/* Granular Progress */}
        <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
          {granularProgress.map((item, idx) => (
            <div key={idx} style={{ textAlign: "center" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `conic-gradient(${item.color} ${item.value * 3.6}deg, rgba(255,255,255,0.1) 0deg)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 4px", fontSize: "10px", fontWeight: 700, color: "white", position: "relative" }}>
                <div style={{ position: "absolute", inset: "3px", background: "#000205", borderRadius: "50%" }} />
                <span style={{ position: "relative", zIndex: 1 }}>{item.value}</span>
              </div>
              <span style={{ fontSize: "10px", color: "var(--ink-dim)" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="stagger-item" style={{ fontSize: "18px", fontWeight: 800, marginBottom: "12px" }}>Quick Actions</h2>
      <div className="stagger-item" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginBottom: "20px" }}>
        {quickActions.map((action, idx) => {
          const IconComponent = action.Icon;
          return (
            <Link key={idx} href={action.href} className="card card-interactive micro-bounce hover-lift" style={{ padding: "16px", borderRadius: "16px", textDecoration: "none", borderLeft: `3px solid ${action.color}`, background: `linear-gradient(135deg, ${action.color}08, transparent)` }}>
              <IconComponent className="w-7 h-7" style={{ color: action.color, marginBottom: "8px" }} />
              <div style={{ fontSize: "15px", fontWeight: 700, color: "white" }}>{action.label}</div>
              <div style={{ fontSize: "12px", color: "var(--ink-dim)" }}>{action.desc}</div>
            </Link>
          );
        })}
      </div>

      {/* Stats */}
      <div className="stagger-item card" style={{ padding: "16px", borderRadius: "16px", display: "flex", justifyContent: "space-around", marginBottom: "20px" }}>
        {stats.map((stat, idx) => {
          const IconComponent = stat.Icon;
          return (
            <div key={idx} style={{ textAlign: "center" }}>
              <IconComponent className="w-6 h-6" style={{ color: stat.color, margin: "0 auto 4px" }} />
              <div style={{ fontSize: "18px", fontWeight: 800 }}>{stat.value}</div>
              <div style={{ fontSize: "11px", color: "var(--ink-dim)" }}>{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="stagger-item" style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {["activity", "upcoming"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="micro-bounce"
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
              transition: "all 0.2s ease",
            }}
          >
            {tab === "activity" ? "Recent" : "Upcoming"}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="stack stagger-item" style={{ gap: "10px" }}>
        {activeTab === "activity" ? (
          recentActivity.map((item, idx) => {
            const IconComponent = item.Icon;
            return (
              <div key={idx} className="card hover-lift" style={{ padding: "16px", borderRadius: "16px", display: "flex", alignItems: "center", gap: "12px", borderLeft: `3px solid ${item.color}`, animationDelay: `${idx * 0.05}s` }}>
                <div style={{ padding: "8px", borderRadius: "10px", background: `${item.color}20` }}>
                  <IconComponent className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "15px" }}>{item.title}</div>
                  <div style={{ fontSize: "12px", color: "var(--ink-dim)" }}>{item.date}</div>
                </div>
                {item.score && <div className="pill" style={{ background: "rgba(16, 185, 129, 0.2)", color: "#10b981" }}>{item.score}/20</div>}
              </div>
            );
          })
        ) : (
          upcoming.map((item, idx) => {
            const IconComponent = item.icon === "⏰" ? ClockIcon : BookIcon;
            return (
              <div key={idx} className="card hover-lift" style={{ padding: "16px", borderRadius: "16px", display: "flex", alignItems: "center", gap: "12px", border: item.urgent ? `1px solid ${item.color}60` : undefined, animationDelay: `${idx * 0.05}s` }}>
                <div style={{ padding: "8px", borderRadius: "10px", background: `${item.color}20` }}>
                  <IconComponent className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "15px" }}>{item.title}</div>
                  <div style={{ fontSize: "12px", color: item.urgent ? item.color : "var(--ink-dim)" }}>{item.due}</div>
                </div>
                <div className="pill" style={{ background: item.urgent ? `${item.color}30` : "rgba(255,255,255,0.1)", color: item.urgent ? item.color : "white" }}>
                  {item.urgent ? "Due" : "Upcoming"}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Study Tip */}
      <div className="stagger-item card card-glassmorphism" style={{ padding: "16px", borderRadius: "16px", marginTop: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "24px" }}>💡</span>
          <div>
            <div style={{ fontSize: "12px", color: "var(--primary)", fontWeight: 700, marginBottom: "2px" }}>TODAY'S TIP</div>
            <div style={{ fontSize: "13px", color: "var(--ink-dim)" }}>
              {lang === "fr" ? "Faites 20 min de lecture active pour améliorer votre compréhension." : 
               lang === "ar" ? "اقرأ لمدة 20 دقيقة بنشاط لتحسين فهمك." : 
               "Do 20 minutes of active reading to boost comprehension."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
