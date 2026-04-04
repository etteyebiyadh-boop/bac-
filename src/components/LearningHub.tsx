"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, ClipboardCheck, GraduationCap, ChevronRight, Activity, Zap, Target } from "lucide-react";

type Mode = "LEARN" | "PRACTICE" | "EXAM";

interface Lesson {
  id: string;
  slug: string;
  title: string;
  summary: string;
  skillFocus: string;
  estimatedMinutes: number;
}

interface LearningHubProps {
  currentStreak: number;
  progressPercent: number;
  recommendations: { lessonId: string; reason: string; priority: number; }[];
  recentLessons: Lesson[];
  language: string;
}

export function LearningHub({ 
  currentStreak, 
  progressPercent, 
  recommendations, 
  recentLessons,
  language 
}: LearningHubProps) {
  const [activeMode, setActiveMode] = useState<Mode>("LEARN");

  const modeDescriptions = {
    LEARN: "Concept-first lessons building your foundation. Best for new topics.",
    PRACTICE: "Topic-specific drills to build muscle memory. Best for mastery.",
    EXAM: "Timed BAC simulations with official materials. Final preparation."
  };

  return (
    <div className="learning-hub stack">
      {/* 📊 PROGRESS & STATS BANNER */}
      <div className="grid grid-cols-3 gap-16" style={{ marginBottom: "32px" }}>
        <div className="card stack" style={{ padding: "24px", alignItems: "center", justifyContent: "center" }}>
          <div className="row-between" style={{ width: "100%", opacity: 0.7 }}>
            <span style={{ fontSize: "12px", fontWeight: 700 }}>STREAK</span>
            <Zap size={16} color="var(--accent)" />
          </div>
          <div style={{ fontSize: "2.5rem", fontWeight: 900, fontFamily: "var(--font-display)" }} className="glow-text">
            {currentStreak}
          </div>
          <span className="muted" style={{ fontSize: "12px" }}>Days in a row! 🔥</span>
        </div>

        <div className="card stack" style={{ padding: "24px", alignItems: "center", justifyContent: "center" }}>
          <div className="row-between" style={{ width: "100%", opacity: 0.7 }}>
            <span style={{ fontSize: "12px", fontWeight: 700 }}>COURSE PROGRESS</span>
            <Activity size={16} color="var(--primary)" />
          </div>
          <div className="chart-ring" style={{ "--progress": progressPercent } as any}>
            <span className="chart-ring-text">{progressPercent}%</span>
          </div>
          <span className="muted" style={{ fontSize: "12px" }}>Target score: 18/20 🎯</span>
        </div>

        <div className="card stack" style={{ padding: "24px", alignItems: "center", justifyContent: "center" }}>
          <div className="row-between" style={{ width: "100%", opacity: 0.7 }}>
            <span style={{ fontSize: "12px", fontWeight: 700 }}>STUDY LEVEL</span>
            <Target size={16} color="var(--success)" />
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 900, fontFamily: "var(--font-display)" }}>
            B1+ <span style={{ fontSize: "14px", fontWeight: 400, color: "var(--ink-dim)" }}>/ B2</span>
          </div>
          <span className="pill success-pill">Improving Fast</span>
        </div>
      </div>

      {/* 🎮 MODE SELECTION */}
      <section className="card stack" style={{ padding: "32px", border: "1px solid rgba(255,255,255,0.05)" }}>
         <div className="row-between">
            <h2 className="section-title text-gradient" style={{ fontSize: "1.8rem" }}>Excellence Hub: {language}</h2>
            <div className="row-between" style={{ gap: "8px", background: "rgba(0,0,0,0.2)", borderRadius: "100px", padding: "4px" }}>
              {(["LEARN", "PRACTICE", "EXAM"] as Mode[]).map(mode => (
                <button 
                  key={mode} 
                  onClick={() => setActiveMode(mode)}
                  style={{
                    padding: "8px 20px", 
                    fontSize: "13px", 
                    background: activeMode === mode ? "var(--primary)" : "transparent",
                    color: activeMode === mode ? "white" : "var(--ink-dim)",
                    borderRadius: "100px",
                    boxShadow: activeMode === mode ? "0 4px 15px var(--primary-glow)" : "none",
                    transform: "none"
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>
         </div>
         
         <p className="muted" style={{ maxWidth: "600px" }}>{modeDescriptions[activeMode]}</p>

         <div className="grid grid-cols-2 gap-24" style={{ marginTop: "16px" }}>
            {recentLessons.map((lesson) => (
               <Link key={lesson.id} href={`/lessons/${lesson.slug}`} style={{ display: "block" }}>
                  <div className="card-interactive stack" style={{ 
                    padding: "24px", 
                    background: "rgba(255,255,255,0.03)", 
                    borderRadius: "20px",
                    border: "1px solid rgba(255,255,255,0.05)",
                    transition: "all 0.3s var(--ease)",
                    position: "relative"
                  }}>
                    <div className="row-between" style={{ marginBottom: "8px" }}>
                       <span className="pill" style={{ opacity: 0.8 }}>{lesson.skillFocus}</span>
                       <span style={{ fontSize: "12px", opacity: 0.6 }}>{lesson.estimatedMinutes}m read</span>
                    </div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>{lesson.title}</h3>
                    <p className="muted" style={{ fontSize: "0.9rem", lineClamp: 2, overflow: "hidden" }}>{lesson.summary}</p>
                    <div className="row-between" style={{ marginTop: "16px", color: "var(--primary)" }}>
                       {activeMode === "LEARN" ? (
                         <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}>
                           <Play size={16} /> <span>Start Learning</span>
                         </div>
                       ) : activeMode === "PRACTICE" ? (
                         <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}>
                           <ClipboardCheck size={16} /> <span>Practice Now</span>
                         </div>
                       ) : (
                         <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, color: "var(--accent)" }}>
                           <GraduationCap size={16} /> <span>Simulate BAC</span>
                         </div>
                       )}
                       <ChevronRight size={20} />
                    </div>
                  </div>
               </Link>
            ))}
         </div>
      </section>

      {/* 🤖 AI RECOMMENDATIONS */}
      <section className="card stack" style={{ background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(168, 85, 247, 0.08))", border: "1px solid rgba(99, 102, 241, 0.2)" }}>
         <div className="row-between">
            <h3 style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: 800 }}>
               ✨ SMART RECOMMENDATIONS
            </h3>
            <span className="pill" style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "white" }}>POWERED BY AI</span>
         </div>
         
         <div className="stack" style={{ gap: "12px" }}>
            {recommendations.length > 0 ? recommendations.map((rec, i) => (
              <div key={i} className="row-between" style={{ background: "rgba(255,255,255,0.03)", padding: "16px 20px", borderRadius: "16px" }}>
                 <div className="stack" style={{ gap: "4px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600 }}>{rec.reason}</span>
                    <span className="muted" style={{ fontSize: "12px" }}>Priority: High 🔥</span>
                 </div>
                 <Link className="button-link button-secondary" href={`/lessons/${rec.lessonId}`} style={{ padding: "8px 16px", fontSize: "13px" }}>
                    Action
                 </Link>
              </div>
            )) : (
              <div className="muted" style={{ textAlign: "center", padding: "20px" }}>You are doing great! No immediate weak points detected.</div>
            )}
         </div>
      </section>
    </div>
  );
}
