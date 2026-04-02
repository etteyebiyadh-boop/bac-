"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SkillHistory {
  date: string;
  grammar: number;
  vocabulary: number;
  structure: number;
}

interface SkillHeatmapProps {
  skillName: string;
  scores: number[];
  color: string;
}

function SkillBar({ score, maxScore = 20 }: { score: number; maxScore?: number }) {
  const percentage = (score / maxScore) * 100;
  let color = "#ef4444"; // red for low
  if (score >= 15) color = "#10b981"; // green for high
  else if (score >= 12) color = "#f59e0b"; // yellow for medium
  
  return (
    <div style={{ 
      width: "100%", 
      height: "8px", 
      background: "rgba(255,255,255,0.1)", 
      borderRadius: "4px",
      overflow: "hidden"
    }}>
      <div style={{
        width: `${percentage}%`,
        height: "100%",
        background: color,
        borderRadius: "4px",
        transition: "width 0.5s ease"
      }} />
    </div>
  );
}

function ScoreCell({ score }: { score: number }) {
  let bg = "rgba(239, 68, 68, 0.2)"; // red
  let border = "rgba(239, 68, 68, 0.5)";
  
  if (score >= 16) {
    bg = "rgba(16, 185, 129, 0.3)"; // green
    border = "rgba(16, 185, 129, 0.6)";
  } else if (score >= 13) {
    bg = "rgba(245, 158, 11, 0.25)"; // yellow
    border = "rgba(245, 158, 11, 0.5)";
  } else if (score >= 10) {
    bg = "rgba(245, 158, 11, 0.15)";
    border = "rgba(245, 158, 11, 0.3)";
  }

  return (
    <div style={{
      width: "32px",
      height: "32px",
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "11px",
      fontWeight: 700,
      color: score >= 13 ? "#fff" : "rgba(255,255,255,0.7)"
    }}>
      {score.toFixed(0)}
    </div>
  );
}

export function SkillProgressHeatmap({ initialHistory }: { initialHistory?: any[] }) {
  const [history, setHistory] = useState<SkillHistory[]>([]);
  const [loading, setLoading] = useState(!initialHistory);
  const [averages, setAverages] = useState({ grammar: 0, vocabulary: 0, structure: 0 });

  useEffect(() => {
    if (initialHistory) {
      const processed = initialHistory
        .slice(0, 10)
        .reverse()
        .map((sub: any) => ({
          date: new Date(sub.createdAt).toLocaleDateString("en-US", { 
            month: "short", 
            day: "numeric" 
          }),
          grammar: sub.grammarScore,
          vocabulary: sub.vocabularyScore,
          structure: sub.structureScore
        }));
      
      setHistory(processed);
      
      if (processed.length > 0) {
        setAverages({
          grammar: processed.reduce((s: number, h: SkillHistory) => s + h.grammar, 0) / processed.length,
          vocabulary: processed.reduce((s: number, h: SkillHistory) => s + h.vocabulary, 0) / processed.length,
          structure: processed.reduce((s: number, h: SkillHistory) => s + h.structure, 0) / processed.length
        });
      }
      return;
    }
    fetch("/api/dashboard")
      .then(res => res.json())
      .then(data => {
        if (data.recentSubmissions) {
          // Process last 10 submissions into chronological order
          const processed = data.recentSubmissions
            .slice(0, 10)
            .reverse()
            .map((sub: any) => ({
              date: new Date(sub.createdAt).toLocaleDateString("en-US", { 
                month: "short", 
                day: "numeric" 
              }),
              grammar: sub.grammarScore,
              vocabulary: sub.vocabularyScore,
              structure: sub.structureScore
            }));
          
          setHistory(processed);
          
          // Calculate averages
          if (processed.length > 0) {
            setAverages({
              grammar: processed.reduce((s: number, h: SkillHistory) => s + h.grammar, 0) / processed.length,
              vocabulary: processed.reduce((s: number, h: SkillHistory) => s + h.vocabulary, 0) / processed.length,
              structure: processed.reduce((s: number, h: SkillHistory) => s + h.structure, 0) / processed.length
            });
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="card stack" style={{ padding: "32px", background: "linear-gradient(135deg, rgba(139, 92, 246, 0.05), transparent)", border: "1px solid rgba(139, 92, 246, 0.2)" }}>
        <span className="eyebrow" style={{ color: "#8b5cf6" }}>📊 SKILL HEATMAP</span>
        <div style={{ opacity: 0.5 }}>Loading your progress data...</div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="card stack" style={{ padding: "32px", background: "linear-gradient(135deg, rgba(139, 92, 246, 0.05), transparent)", border: "1px solid rgba(139, 92, 246, 0.2)" }}>
        <span className="eyebrow" style={{ color: "#8b5cf6" }}>📊 SKILL HEATMAP</span>
        <p className="muted" style={{ marginBottom: "16px" }}>
          Complete writing submissions to see your skill progress visualized over time.
        </p>
        <Link href="/write" className="button-link" style={{ background: "#8b5cf6" }}>
          Start Writing →
        </Link>
      </div>
    );
  }

  const weakestSkill = Object.entries(averages)
    .sort((a, b) => a[1] - b[1])[0][0];

  const skillLabels: Record<string, string> = {
    grammar: "🔤 Grammar",
    vocabulary: "📖 Vocabulary", 
    structure: "📝 Structure"
  };

  return (
    <div className="card stack" style={{ padding: "32px", background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1), transparent)", border: "1px solid rgba(139, 92, 246, 0.3)" }}>
      <div className="row-between" style={{ marginBottom: "24px" }}>
        <div>
          <span className="eyebrow" style={{ color: "#8b5cf6" }}>📊 SKILL HEATMAP</span>
          <p style={{ fontSize: "13px", opacity: 0.8, marginTop: "4px" }}>
            Your last {history.length} submissions • Focus on {skillLabels[weakestSkill]}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "24px", fontWeight: 900, color: "#8b5cf6" }}>
            {(averages.grammar + averages.vocabulary + averages.structure / 3).toFixed(1)}
          </div>
          <div style={{ fontSize: "11px", opacity: 0.6 }}>Avg Score</div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Header row with dates */}
        <div style={{ display: "flex", gap: "8px", paddingLeft: "100px" }}>
          {history.map((h, i) => (
            <div key={i} style={{ 
              width: "32px", 
              textAlign: "center", 
              fontSize: "10px", 
              opacity: 0.6,
              transform: "rotate(-45deg)",
              transformOrigin: "center",
              marginTop: "8px"
            }}>
              {h.date}
            </div>
          ))}
        </div>

        {/* Grammar Row */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "88px", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
            🔤 Grammar
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {history.map((h, i) => <ScoreCell key={i} score={h.grammar} />)}
          </div>
          <div style={{ marginLeft: "auto", fontSize: "14px", fontWeight: 700, color: "#8b5cf6" }}>
            {averages.grammar.toFixed(1)}
          </div>
        </div>
        <SkillBar score={averages.grammar} />

        {/* Vocabulary Row */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
          <div style={{ width: "88px", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
            📖 Vocab
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {history.map((h, i) => <ScoreCell key={i} score={h.vocabulary} />)}
          </div>
          <div style={{ marginLeft: "auto", fontSize: "14px", fontWeight: 700, color: "#8b5cf6" }}>
            {averages.vocabulary.toFixed(1)}
          </div>
        </div>
        <SkillBar score={averages.vocabulary} />

        {/* Structure Row */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
          <div style={{ width: "88px", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
            📝 Structure
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            {history.map((h, i) => <ScoreCell key={i} score={h.structure} />)}
          </div>
          <div style={{ marginLeft: "auto", fontSize: "14px", fontWeight: 700, color: "#8b5cf6" }}>
            {averages.structure.toFixed(1)}
          </div>
        </div>
        <SkillBar score={averages.structure} />
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "16px", marginTop: "24px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
          <div style={{ width: "12px", height: "12px", background: "rgba(239, 68, 68, 0.3)", border: "1px solid rgba(239, 68, 68, 0.5)", borderRadius: "3px" }} />
          &lt;10
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
          <div style={{ width: "12px", height: "12px", background: "rgba(245, 158, 11, 0.25)", border: "1px solid rgba(245, 158, 11, 0.5)", borderRadius: "3px" }} />
          10-15
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
          <div style={{ width: "12px", height: "12px", background: "rgba(16, 185, 129, 0.3)", border: "1px solid rgba(16, 185, 129, 0.6)", borderRadius: "3px" }} />
          16+
        </div>
      </div>
    </div>
  );
}
