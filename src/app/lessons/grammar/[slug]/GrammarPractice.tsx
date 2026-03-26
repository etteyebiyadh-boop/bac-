"use client";

import { useState } from "react";
import { AIHighlightDiff } from "@/components/ai-correction-view";

export function GrammarPractice({ title, description }: { title: string; description: string }) {
  const [sentence, setSentence] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ 
    isCorrect: boolean; 
    feedback: string; 
    explanation?: string; 
    correctedSentence?: string; 
  } | null>(null);

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
        <div className="stack" style={{ padding: "24px", borderRadius: "16px", background: result.isCorrect ? "rgba(16, 185, 129, 0.05)" : "rgba(239, 68, 68, 0.05)", border: `1px solid ${result.isCorrect ? "var(--success-glow)" : "var(--error-glow)"}`, animation: "reveal-up 0.4s ease", gap: "16px" }}>
           <div className="row-between">
              <strong style={{ color: result.isCorrect ? "var(--success)" : "var(--error)", fontSize: "1.2rem" }}>
                 {result.isCorrect ? "✅ Perfect Application!" : "❌ Error Detected"}
              </strong>
              <span className="eyebrow" style={{ opacity: 0.5 }}>{result.isCorrect ? "Mastered" : "Learning Point"}</span>
           </div>
           
           <p style={{ color: "white", fontSize: "1.1rem" }}>{result.feedback}</p>
           
           {result.explanation && (
             <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", borderLeft: "4px solid var(--primary)", fontSize: "0.95rem", opacity: 0.9 }}>
               {result.explanation}
             </div>
           )}

           {!result.isCorrect && result.correctedSentence && (
             <div className="stack" style={{ gap: "8px", marginTop: "8px" }}>
               <span className="eyebrow" style={{ color: "var(--success)" }}>Smarter Alternative:</span>
               <div style={{ padding: "16px", background: "rgba(0,0,0,0.3)", borderRadius: "12px", border: "1px dashed var(--success-glow)" }}>
                 <AIHighlightDiff original={sentence} corrected={result.correctedSentence} />
               </div>
             </div>
           )}
        </div>
      )}
    </div>
  )
}
