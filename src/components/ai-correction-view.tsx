"use client";

import React from "react";

export function AIHighlightDiff({ original, corrected }: { original: string; corrected: string }) {
  // Simple word-level diff for visual representation
  const oldWords = original.trim().split(/(\s+)/);
  const newWords = corrected.trim().split(/(\s+)/);
  
  // Create a set of significant words from the original to find what's truly 'new'
  const oldSet = new Set(oldWords.filter(w => w.trim().length > 1).map(w => w.toLowerCase()));
  
  return (
    <div style={{ lineHeight: 2, color: "var(--ink)", whiteSpace: "pre-wrap" }}>
      {newWords.map((word, i) => {
        const trimmed = word.trim().toLowerCase();
        // A word is considered new if it's significant and not in the original
        // This is a heuristic for 'beneficial' highlighting without a complex LCS library
        const isNew = trimmed.length > 0 && !oldSet.has(trimmed) && /[a-zA-Z]/.test(trimmed);
        
        return (
          <span 
            key={i} 
            className={isNew ? "diff-new" : ""}
            style={{ 
              background: isNew ? "rgba(16, 185, 129, 0.15)" : "transparent",
              color: isNew ? "var(--success)" : "inherit",
              padding: isNew ? "2px 0px" : "0",
              borderRadius: "2px",
              fontWeight: isNew ? 700 : 400,
              boxShadow: isNew ? "0 2px 0 var(--success-glow)" : "none",
              transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              display: "inline",
              cursor: isNew ? "help" : "default"
            }}
            title={isNew ? "AI Improvement" : ""}
          >
            {word}
          </span>
        );
      })}
      <style jsx>{`
        .diff-new {
          animation: highlight-pulse 2s infinite ease-in-out;
        }
        @keyframes highlight-pulse {
          0% { box-shadow: 0 1px 0 var(--success-glow); }
          50% { box-shadow: 0 3px 6px var(--success-glow); }
          100% { box-shadow: 0 1px 0 var(--success-glow); }
        }
      `}</style>
    </div>
  );
}

export function AIExplanationCard({ explanations }: { explanations: { original: string; fixed: string; reason: string }[] }) {
    if (!explanations || explanations.length === 0) return null;

    return (
        <div className="stack" style={{ gap: "16px", marginTop: "32px" }}>
            <div className="row-between">
                <h4 className="eyebrow" style={{ color: "var(--primary)" }}>Correction Logic (VS-Style)</h4>
                <span style={{ fontSize: "10px", opacity: 0.5 }}>Precision: High</span>
            </div>
            <div className="grid grid-cols-1" style={{ gap: "12px" }}>
                {explanations.map((exp, idx) => (
                    <div key={idx} style={{ padding: "20px", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid var(--glass-border)", transition: "transform 0.2s ease" }} className="hover-glow">
                        <div className="row-between" style={{ marginBottom: "12px", fontSize: "0.95rem", gap: "12px" }}>
                            <div style={{ flex: 1, padding: "8px", background: "rgba(239, 68, 68, 0.05)", borderRadius: "6px", color: "var(--error)", textDecoration: "line-through", fontSize: "0.85rem" }}>
                                {exp.original}
                            </div>
                            <div style={{ fontSize: "1.2rem", opacity: 0.5 }}>→</div>
                            <div style={{ flex: 1, padding: "8px", background: "rgba(16, 185, 129, 0.05)", borderRadius: "6px", color: "var(--success)", fontWeight: 700, fontSize: "0.95rem" }}>
                                {exp.fixed}
                            </div>
                        </div>
                        <p style={{ fontSize: "14px", lineHeight: "1.5", opacity: 0.8, borderLeft: "2px solid var(--primary)", paddingLeft: "12px" }}>
                            {exp.reason}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
