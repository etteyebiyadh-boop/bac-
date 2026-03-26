"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SiteLanguage, translations } from "@/lib/translations";
import { AIHighlightDiff, AIExplanationCard } from "@/components/ai-correction-view";

type MockSimulatorClientProps = {
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

export function MockSimulatorClient({ exam, lang }: MockSimulatorClientProps) {
  const router = useRouter();
  const t = translations[lang] || translations.en;
  
  const [activePart, setActivePart] = useState<"reading" | "language" | "writing">("reading");
  const [timeLeft, setTimeLeft] = useState(exam.estimatedMinutes * 60);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [essayText, setEssayText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [finalFeedback, setFinalFeedback] = useState<any>(null);

  useEffect(() => {
    if (timeLeft <= 0) { submitExam(); return; }
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const wordCount = essayText.trim().length === 0 ? 0 : essayText.trim().split(/\s+/).length;

  const handleAnswerChange = (qId: string, val: string) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  async function submitExam() {
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
          readingAnswers: answers,
          type: "FULL_MOCK"
        })
      });
      const result = await response.json();
      setFinalFeedback(result);
      setShowResult(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const secs = Math.floor(timeLeft % 60).toString().padStart(2, "0");

  if (showResult && finalFeedback) {
     return (
        <div style={{ position: "fixed", inset: 0, zIndex: 10000, background: "#05070a", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px", overflowY: "auto" }}>
            <div className="card stack" style={{ maxWidth: "1000px", width: "100%", padding: "60px", textAlign: "left", border: "1px solid var(--success-glow)", background: "rgba(10,10,20,0.95)", margin: "auto" }}>
                <div style={{ textAlign: "center", marginBottom: "40px" }}>
                  <span className="eyebrow" style={{ color: "var(--success)" }}>Exam Outcome Simulated</span>
                  <h1 className="section-title" style={{ fontSize: "4.5rem", marginBottom: "10px" }}>{finalFeedback.overallScore} / 20</h1>
                  <p style={{ fontStyle: "italic", opacity: 0.8, fontSize: "1.2rem" }}>{finalFeedback.summary}</p>
                </div>
                
                <div className="grid grid-cols-3" style={{ margin: "40px 0", gap: "20px" }}>
                   <div style={{ padding: "20px", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <span className="muted" style={{ fontSize: "10px" }}>READING</span>
                      <div style={{ fontWeight: 900, fontSize: "1.5rem" }}>{finalFeedback.readingScore} / 12</div>
                   </div>
                   <div style={{ padding: "20px", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <span className="muted" style={{ fontSize: "10px" }}>LANGUAGE</span>
                      <div style={{ fontWeight: 900, fontSize: "1.5rem" }}>{finalFeedback.languageScore} / 8</div>
                   </div>
                   <div style={{ padding: "20px", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <span className="muted" style={{ fontSize: "10px" }}>WRITING</span>
                      <div style={{ fontWeight: 900, fontSize: "1.5rem" }}>{finalFeedback.writingScore} / 10</div>
                   </div>
                </div>

                <div className="grid grid-cols-2" style={{ gap: "32px", marginBottom: "40px" }}>
                  <div className="stack" style={{ gap: "12px" }}>
                    <h3 className="eyebrow" style={{ color: "var(--success)" }}>Strengths ✅</h3>
                    <ul className="bullet-list stack" style={{ gap: "8px" }}>
                      {finalFeedback.strengths?.map((s: string) => <li key={s} style={{ fontSize: "0.95rem" }}>{s}</li>)}
                    </ul>
                  </div>
                  <div className="stack" style={{ gap: "12px" }}>
                    <h3 className="eyebrow" style={{ color: "var(--error)" }}>Areas for Improvement 🚀</h3>
                    <ul className="bullet-list stack" style={{ gap: "8px" }}>
                      {finalFeedback.improvements?.map((i: string) => <li key={i} style={{ fontSize: "0.95rem" }}>{i}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="stack card" style={{ padding: "40px", background: "rgba(0,0,0,0.5)", border: "1px solid var(--primary-glow)" }}>
                  <h3 className="section-title" style={{ fontSize: "1.8rem" }}>Essay: AI Revision</h3>
                  <div style={{ marginTop: "24px", fontSize: "1.1rem" }}>
                    <AIHighlightDiff original={essayText} corrected={finalFeedback.correctedText} />
                  </div>
                  <AIExplanationCard explanations={finalFeedback.explanations} />
                </div>

                <div style={{ textAlign: "center", marginTop: "60px" }}>
                  <button className="button-link hover-glow" style={{ background: "white", color: "black", padding: "16px 40px", fontSize: "1.1rem", fontWeight: 800 }} onClick={() => router.push("/exams")}>Exit Simulator & Save Progress</button>
                </div>
            </div>
        </div>
     );
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#05070a", color: "white", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 40px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0b0e14" }}>
        <div className="stack" style={{ gap: "4px" }}>
          <span className="eyebrow" style={{ color: "var(--primary)" }}>BAC EXCELLENCE - ELITE SIMULATOR</span>
          <strong style={{ fontSize: "1.1rem" }}>{exam.year} {exam.title}</strong>
        </div>
        <div style={{ display: "flex", gap: "10px", background: "rgba(255,255,255,0.02)", padding: "10px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
            {(["reading", "language", "writing"] as const).map(p => (
                <button key={p} onClick={() => setActivePart(p)} style={{ padding: "10px 24px", borderRadius: "8px", border: "none", background: activePart === p ? "var(--primary)" : "transparent", color: activePart === p ? "black" : "white", fontWeight: 700, cursor: "pointer", textTransform: "capitalize" }}>{p}</button>
            ))}
        </div>
        <div style={{ fontSize: "2rem", fontWeight: 900, fontFamily: "monospace", color: timeLeft < 600 ? "var(--error)" : "var(--primary)" }}>{mins}:{secs}</div>
      </div>
      <div style={{ flex: 1, padding: "60px", overflowY: "auto", display: "flex", justifyContent: "center" }}>
        <div style={{ maxWidth: "1000px", width: "100%" }}>
            {activePart === "reading" && (
                <div className="stack" style={{ gap: "40px", animation: "slideUp 0.5s ease" }}>
                    <div className="card" style={{ padding: "40px", background: "rgba(255,255,255,0.01)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <h2 className="eyebrow">{exam.readingTitle || "Reading Comprehension"}</h2>
                        <div style={{ whiteSpace: "pre-wrap", fontSize: "1.2rem", lineHeight: 1.8, marginTop: "24px", opacity: 0.9 }}>{exam.readingContent}</div>
                    </div>
                    <div className="stack" style={{ gap: "24px" }}>
                        <h3 className="section-title" style={{ fontSize: "1.5rem" }}>Part I: Comprehension (12 pts)</h3>
                        {exam.readingQuestions?.map((q: any, i: number) => (
                            <div key={q.id || i} className="card stack" style={{ padding: "32px", gap: "16px", background: "rgba(0,0,0,0.3)" }}>
                                <strong>Q{i+1}: {q.question}</strong>
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
                                    <input className="field" type="text" placeholder="Your answer..." value={answers[q.id] || ""} onChange={(e) => handleAnswerChange(q.id, e.target.value)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", padding: "16px", borderRadius: "8px", color: "white" }} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {activePart === "language" && (
                <div className="stack" style={{ gap: "40px", animation: "slideUp 0.5s ease" }}>
                    <h3 className="section-title" style={{ fontSize: "1.5rem" }}>Part II: Language Use (8 pts)</h3>
                    {exam.languageQuestions?.map((q: any, i: number) => (
                        <div key={q.id || i} className="card stack" style={{ padding: "32px", gap: "16px", background: "rgba(0,0,0,0.3)" }}>
                            <p>{q.prompt}</p>
                            <input className="field" type="text" placeholder="Answer..." value={answers[q.id] || ""} onChange={(e) => handleAnswerChange(q.id, e.target.value)} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", padding: "16px", borderRadius: "8px", color: "white" }} />
                        </div>
                    ))}
                </div>
            )}
            {activePart === "writing" && (
                <div className="stack" style={{ gap: "40px", animation: "slideUp 0.5s ease" }}>
                    <div className="card" style={{ padding: "40px", background: "rgba(255,255,255,0.01)", border: "1px solid rgba(99, 102, 241, 0.2)" }}>
                        <h2 className="eyebrow" style={{ color: "var(--primary)" }}>Part III: Written Expression (10 pts)</h2>
                        <div style={{ fontSize: "1.3rem", fontWeight: 700, margin: "24px 0" }}>{exam.prompt}</div>
                    </div>
                    <textarea value={essayText} onChange={(e) => setEssayText(e.target.value)} placeholder="Official essay draft..." style={{ height: "400px", padding: "40px", fontSize: "1.2rem", lineHeight: 1.8, background: "rgba(0,0,0,0.8)", border: "1px solid var(--glass-border)", borderRadius: "16px", color: "white", resize: "none", outline: "none" }} />
                    <div style={{ display: "flex", justifyContent: "flex-end" }}><button className="button-link hover-glow" disabled={isSubmitting || wordCount < 20} style={{ background: "var(--primary)", color: "black", padding: "20px 60px", fontSize: "1.2rem", fontWeight: 900 }} onClick={submitExam}>{isSubmitting ? "Grading..." : "SUBMIT MOCK"}</button></div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
