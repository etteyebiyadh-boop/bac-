"use client";

import { useState } from "react";

export function GrammarPractice({ title, description }: { title: string; description: string }) {
  const [sentence, setSentence] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ isCorrect: boolean; feedback: string } | null>(null);

  async function handleCheck() {
    if (!sentence.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/grammar/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sentence, ruleTitle: title, ruleDescription: description })
      });
      const data = await res.json();
      setResult(data);
    } catch(e) {}
    setLoading(false);
  }

  return (
    <div className="card stack" style={{ background: "rgba(99, 102, 241, 0.05)", border: "1px solid var(--primary-glow)", gridColumn: "span 2" }}>
      <h3 className="section-title" style={{ fontSize: "1.5rem" }}>🔥 Live Practice</h3>
      <p className="muted">Write a single sentence using the <strong>{title}</strong> rule to see if you have truly mastered it.</p>
      
      <div className="row-between" style={{ gap: "12px", flexWrap: "wrap" }}>
        <input 
          style={{ flex: "1 1 auto", padding: "16px", borderRadius: "12px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", color: "white", fontSize: "1.1rem" }}
          placeholder="E.g., By next year, I will have finished my Bac exams..."
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCheck()}
        />
        <button className="button-link hover-glow" style={{ background: "var(--primary)", color: "white", padding: "16px 32px", border: "none" }} onClick={handleCheck} disabled={loading || !sentence.trim()}>
          {loading ? "Checking..." : "Check"}
        </button>
      </div>

      {result && (
        <div style={{ padding: "16px", borderRadius: "12px", background: result.isCorrect ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", border: `1px solid ${result.isCorrect ? "var(--success)" : "var(--error)"}`, animation: "reveal-up 0.4s ease" }}>
           <strong style={{ color: result.isCorrect ? "var(--success)" : "var(--error)" }}>
              {result.isCorrect ? "✅ Excellent!" : "❌ Not quite right."}
           </strong>
           <p style={{ marginTop: "8px", color: "white" }}>{result.feedback}</p>
        </div>
      )}
    </div>
  )
}
