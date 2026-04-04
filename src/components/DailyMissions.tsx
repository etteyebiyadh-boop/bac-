"use client";

import { Award, CheckCircle2, Circle, Flame, Target, Trophy, Zap } from "lucide-react";

interface DailyMissionsProps {
  level: number;
  xp: number;
  rank: string;
  missions: any[];
}

export function DailyMissions({ level, xp, rank, missions }: DailyMissionsProps) {
  const xpPercent = Math.min(100, Math.round((xp / 500) * 100));

  return (
    <div className="stack" style={{ gap: "32px", width: "100%" }}>
      {/* Student Rank & Level Card */}
      <div className="card-vibrant stack" style={{ 
        padding: "32px", 
        background: "rgba(99, 102, 241, 0.05)", 
        border: "1px solid rgba(99, 102, 241, 0.2)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: "-20px", right: "-20px", opacity: 0.1 }}>
           <Trophy size={100} color="var(--primary)" />
        </div>

        <div className="row-between" style={{ marginBottom: "20px" }}>
           <span className="eyebrow" style={{ color: "var(--primary)" }}>STUDENT RANK</span>
           <span className="pill" style={{ background: "var(--primary)", color: "white", border: "none" }}>LEVEL {level}</span>
        </div>
        
        <h2 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: "8px" }}>{rank}</h2>
        
        <div className="stack" style={{ gap: "8px" }}>
           <div className="row-between" style={{ fontSize: "12px", fontWeight: 700 }}>
              <span className="muted">XP PROGRESS ({xp}/500)</span>
              <span>{xpPercent}%</span>
           </div>
           <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "100px", overflow: "hidden" }}>
              <div style={{ width: `${xpPercent}%`, height: "100%", background: "var(--primary)", borderRadius: "100px" }} />
           </div>
        </div>
      </div>

      {/* Daily Challenges */}
      <div className="stack" style={{ gap: "20px" }}>
        <h3 className="row" style={{ gap: "10px", fontWeight: 800 }}>
          <Zap size={18} fill="currentColor" /> TODAY&apos;S MISSIONS
        </h3>

        <div className="stack" style={{ gap: "12px" }}>
           {missions.map((m, i) => (
             <div 
               key={i} 
               className="card row" 
               style={{ 
                 padding: "20px", 
                 gap: "16px", 
                 background: m.status === "COMPLETED" ? "rgba(16, 185, 129, 0.05)" : "rgba(255,255,255,0.02)",
                 border: `1px solid ${m.status === "COMPLETED" ? "rgba(16, 185, 129, 0.2)" : "var(--glass-border)"}`,
                 transition: "all 0.3s ease"
               }}
             >
                {m.status === "COMPLETED" ? (
                   <CheckCircle2 color="var(--accent-green)" size={24} />
                ) : (
                   <Circle color="var(--glass-border)" size={24} />
                )}
                <div className="stack" style={{ gap: "4px" }}>
                   <div style={{ fontWeight: 800, fontSize: "14px", color: m.status === "COMPLETED" ? "var(--accent-green)" : "white" }}>
                      {m.title}
                   </div>
                   <p className="muted" style={{ fontSize: "12px" }}>{m.description}</p>
                </div>
                <div style={{ marginLeft: "auto", fontSize: "11px", fontWeight: 900 }} className="muted">
                   +{m.xpReward} XP
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Mini Streak Widget */}
      <div className="card row" style={{ padding: "20px", gap: "16px", background: "linear-gradient(90deg, rgba(236, 72, 153, 0.1), transparent)" }}>
         <Flame size={24} fill="var(--accent)" color="var(--accent)" />
         <div className="stack" style={{ gap: "2px" }}>
            <span style={{ fontWeight: 900, fontSize: "14px" }}>7 DAY STREAK</span>
            <span className="muted" style={{ fontSize: "11px" }}>Complete tomorrow to reach Elite Scholar.</span>
         </div>
      </div>
    </div>
  );
}
