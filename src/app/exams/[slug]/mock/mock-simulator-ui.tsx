"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SiteLanguage, translations } from "@/lib/translations";
import { MAX_ESSAY_CHARS, MIN_ESSAY_CHARS } from "@/lib/constants";

type MockSimulatorUIProps = {
  exam: {
    id: string;
    slug: string;
    title: string;
    year: number;
    prompt: string;
    readingTitle?: string;
    readingContent?: string;
    readingQuestions?: any[];
    languageQuestions?: any[];
    estimatedMinutes: number;
    language: string;
  };
  lang: SiteLanguage;
};

export function MockSimulatorUI({ exam, lang }: MockSimulatorUIProps) {
  const router = useRouter();
  const t = translations[lang] || translations.en;
  
  const [activePart, setActivePart] = useState<"reading" | "language" | "writing">("reading");
  const [timeLeft, setTimeLeft] = useState(exam.estimatedMinutes * 60);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [essayText, setEssayText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [finalFeedback, setFinalFeedback] = useState<any>(null);

  const handleAnswerChange = (qId: string, val: string) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const submitExam = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/correct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: exam.id,
          studentText: essayText,
          language: exam.language,
          readingAnswers: exam.readingQuestions?.reduce((acc: Record<string, string>, q: any, i: number) => {
            const key = q?.id ?? String(i);
            acc[key] = answers[key] || "";
            return acc;
          }, {}) ?? {},
          languageAnswers: exam.languageQuestions?.reduce((acc: Record<string, string>, q: any, i: number) => {
            const key = q?.id ?? String(i);
            acc[key] = answers[key] || "";
            return acc;
          }, {}) ?? {},
          type: "FULL_MOCK"
        })
      });

      const result = await response.json();
      setFinalFeedback(result);
      setShowResult(true);
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, exam, essayText, answers]);

  // Strictly enforce the timer
  useEffect(() => {
    if (timeLeft <= 0) { 
        submitExam(); 
        return; 
    }
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft, submitExam]);

  const wordCount = essayText.trim().length === 0 ? 0 : essayText.trim().split(/\s+/).length;

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const secs = Math.floor(timeLeft % 60).toString().padStart(2, "0");

  if (showResult && finalFeedback) {
     return (
        <div className="page-stack" style={{ padding: "80px 20px" }}>
            <div className="card stack" style={{ padding: "60px", textAlign: "center", border: "1px solid var(--success-glow)" }}>
                <span className="eyebrow" style={{ color: "var(--success)" }}>Simulated Exam Complete</span>
                <h1 className="section-title">Final Bac Score: {finalFeedback.overallScore} / 20</h1>
                <p className="muted" style={{ maxWidth: "600px", margin: "20px auto" }}>
                    Your performance in the 3-hour mock exam has been evaluated across Reading, Language, and Writing components.
                </p>
                <div style={{ marginTop: "40px" }}>
                   <button className="button-link hover-glow" onClick={() => router.push("/exams")}>Back to Library</button>
                </div>
            </div>
        </div>
     );
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#05070a", color: "white", display: "flex", flexDirection: "column" }}>
      {/* HUD Header */}
      <div style={{ padding: "20px 40px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0b0e14" }}>
        <div className="stack" style={{ gap: "4px" }}>
          <span className="eyebrow" style={{ color: "var(--primary)" }}>BAC EXCELLENCE - ELITE SIMULATOR</span>
          <strong style={{ fontSize: "1.1rem" }}>{exam.year} {exam.title}</strong>
        </div>

        <div style={{ display: "flex", gap: "10px", background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
            {(["reading", "language", "writing"] as const).map(p => (
                <button 
                  key={p} 
                  onClick={() => setActivePart(p)}
                  style={{ 
                    padding: "10px 24px", 
                    borderRadius: "8px", 
                    border: "none", 
                    background: activePart === p ? "var(--primary)" : "transparent",
                    color: activePart === p ? "black" : "white",
                    fontWeight: 700,
                    cursor: "pointer",
                    textTransform: "capitalize"
                  }}
                >
                    {p}
                </button>
            ))}
        </div>

        <div style={{ fontSize: "2rem", fontWeight: 900, fontFamily: "monospace", color: timeLeft < 600 ? "var(--error)" : "var(--primary)" }}>
          {mins}:{secs}
        </div>
      </div>

      {/* Main Workspace */}
      <div style={{ flex: 1, padding: "60px", overflowY: "auto", display: "flex", justifyContent: "center" }}>
        <div style={{ maxWidth: "1000px", width: "100%" }}>
            
            {activePart === "reading" && (
                <div className="stack animate-slide-up" style={{ gap: "40px" }}>
                    <div className="card" style={{ padding: "40px", background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <h2 className="eyebrow">{exam.readingTitle || "Reading Comprehension"}</h2>
                        <div style={{ whiteSpace: "pre-wrap", fontSize: "1.2rem", lineHeight: 1.8, marginTop: "24px", opacity: 0.9 }}>
                            {exam.readingContent || "Reading content goes here..."}
                        </div>
                    </div>
                    
                    <div className="stack" style={{ gap: "24px" }}>
                        <h3 className="section-title" style={{ fontSize: "1.5rem" }}>Comprehension Questions (12 pts)</h3>
                        {exam.readingQuestions?.map((q: any, i: number) => (
                            <div key={q.id || i} className="card stack" style={{ padding: "32px", gap: "16px", background: "rgba(0,0,0,0.3)" }}>
                                <strong>Question {i+1}: {q.question}</strong>
                                {q.type === "mcq" ? (
                                    <div className="stack" style={{ gap: "10px" }}>
                                        {q.choices?.map((c: string) => (
                                            <label key={c} style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer", padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "8px" }}>
                                                <input type="radio" name={q.id} value={c} checked={answers[q.id] === c} onChange={(e) => handleAnswerChange(q.id, e.target.value)} />
                                                <span>{c}</span>
                                            </label>
                                        ))}
                                    </div>
                                ) : (
                                    <input 
                                       className="field" 
                                       type="text" 
                                       placeholder="Type your answer..." 
                                       value={answers[q.id] || ""} 
                                       onChange={(e) => handleAnswerChange(q.id, e.target.value)} 
                                       style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", padding: "16px", borderRadius: "8px", color: "white" }} 
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activePart === "language" && (
                <div className="stack animate-slide-up" style={{ gap: "40px" }}>
                    <div className="stack" style={{ gap: "24px" }}>
                        <h3 className="section-title" style={{ fontSize: "1.5rem" }}>Part II: Language & Vocabulary (8 pts)</h3>
                        {exam.languageQuestions?.map((q: any, i: number) => (
                            <div key={q.id || i} className="card stack" style={{ padding: "32px", gap: "16px", background: "rgba(0,0,0,0.3)" }}>
                                <strong>Challenge {i+1}</strong>
                                <p>{q.prompt}</p>
                                <input 
                                    className="field" 
                                    type="text" 
                                    autoFocus={i === 0} 
                                    placeholder="Complete..." 
                                    value={answers[q.id] || ""} 
                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)} 
                                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", padding: "16px", borderRadius: "8px", color: "white" }} 
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activePart === "writing" && (
                <div className="stack animate-slide-up" style={{ gap: "40px" }}>
                    <div className="card" style={{ padding: "40px", background: "rgba(255,255,255,0.01)", border: "1px solid rgba(99, 102, 241, 0.2)" }}>
                        <h2 className="eyebrow" style={{ color: "var(--primary)" }}>Final Stage: Written Expression (10 pts)</h2>
                        <div style={{ fontSize: "1.3rem", fontWeight: 700, margin: "24px 0" }}>{exam.prompt}</div>
                        <p className="muted" style={{ fontSize: "0.95rem" }}>Use academic connectors, precise vocabulary, and maintain a formal tone. Target length: 150-200 words.</p>
                    </div>

                    <div className="stack" style={{ gap: "10px" }}>
                        <div className="row-between">
                            <span className="eyebrow" style={{ color: wordCount < 100 ? "var(--warning)" : "var(--success)" }}>Progress: {wordCount} words</span>
                            {wordCount < 150 && <span className="muted" style={{ fontSize: "12px" }}>Minimum 150 words recommended.</span>}
                        </div>
                        <textarea 
                          value={essayText}
                          onChange={(e) => setEssayText(e.target.value)}
                          placeholder="Your official response..."
                          style={{ height: "400px", padding: "40px", fontSize: "1.2rem", lineHeight: 1.8, background: "rgba(0,0,0,0.8)", border: "1px solid var(--glass-border)", borderRadius: "16px", color: "white", resize: "none", outline: "none", boxShadow: "0 10px 40px rgba(0,0,0,0.5)" }}
                          onPaste={(e) => e.preventDefault()}
                        />
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
                        <button 
                            className="button-link hover-glow" 
                            disabled={isSubmitting || wordCount < 20}
                            style={{ background: "var(--primary)", color: "black", padding: "20px 60px", fontSize: "1.2rem", fontWeight: 900, cursor: "pointer" }}
                            onClick={submitExam}
                        >
                            {isSubmitting ? "Finalizing Grades..." : "SUBMIT FULL MOCK EXAM"}
                        </button>
                    </div>
                </div>
            )}

        </div>
      </div>

      {/* Footer Info */}
      <div style={{ padding: "16px 40px", borderTop: "1px solid rgba(255,255,255,0.05)", background: "#0b0e14", textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "12px" }}>
        EXAM PROTOCOL ACTIVE. All keystrokes recorded for analysis. Copy/Paste disabled.
      </div>
    </div>
  );
}
