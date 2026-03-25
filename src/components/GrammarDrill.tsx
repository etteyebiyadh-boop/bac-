"use client";

import { useState } from "react";

type Question = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

type GrammarDrillProps = {
  ruleId: string;
  ruleName: string;
  lang: string;
};

export function GrammarDrill({ ruleId, ruleName, lang }: GrammarDrillProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  async function startDrill() {
    setIsLoading(true);
    setError("");
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);

    try {
      const response = await fetch("/api/grammar/drill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruleId })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to start drill");

      setQuestions(data.questions);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleOptionClick(idx: number) {
    if (isRevealed) return;
    setSelectedIdx(idx);
    setIsRevealed(true);
    if (idx === questions[currentIndex].correctIndex) {
      setScore(s => s + 1);
    }
  }

  function nextQuestion() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedIdx(null);
      setIsRevealed(false);
    } else {
      setIsFinished(true);
    }
  }

  const currentQ = questions[currentIndex];
  const isRtl = lang === "ar";

  if (!questions.length && !isLoading && !isFinished) {
    return (
      <div className="card stack" style={{ padding: "40px", textAlign: "center", border: "1px dashed var(--primary-glow)" }}>
        <h3 className="section-title">{lang === "ar" ? "اختبر نفسك" : "Master this rule"}</h3>
        <p className="muted">{lang === "ar" ? "ابدأ تمريناً تفاعلياً مولداً بالذكاء الاصطناعي لهذه القاعدة." : "Generate a 3-question interactive drill for this specific rule."}</p>
        <button onClick={startDrill} className="button-link hover-glow" style={{ alignSelf: "center", marginTop: "16px" }}>
          {lang === "ar" ? "ابدأ التمرين الآن" : "Start Practice Drill"}
        </button>
        {error && <p className="error-text" style={{ marginTop: "16px" }}>{error}</p>}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="card stack" style={{ padding: "60px", textAlign: "center" }}>
          <div className="spinner" style={{ margin: "0 auto 20px" }}></div>
          <p className="muted">{lang === "ar" ? "جاري توليد الأسئلة..." : "Generating unique questions..."}</p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="card stack" style={{ padding: "40px", textAlign: "center", animation: "slideUp 0.6s ease" }}>
         <h3 className="section-title" style={{ fontSize: "2rem" }}>
           {lang === "ar" ? "اكتمل التمرين!" : "Drill Complete!"}
         </h3>
         <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--success)", margin: "16px 0" }}>
            {score} / {questions.length}
         </p>
         <button onClick={startDrill} className="button-link button-secondary" style={{ alignSelf: "center" }}>
           {lang === "ar" ? "حاول مرة أخرى" : "Try Again"}
         </button>
      </div>
    );
  }

  return (
    <div className="card stack" style={{ padding: "40px", direction: isRtl ? "rtl" : "ltr" }}>
       <div className="row-between">
          <span className="eyebrow" style={{ color: "var(--primary)" }}>Question {currentIndex + 1} of {questions.length}</span>
          <span className="pill">{score} correct</span>
       </div>
       
       <h3 className="section-title" style={{ marginTop: "20px", fontSize: "1.25rem", lineHeight: "1.6" }}>{currentQ.question}</h3>
       
       <div className="stack" style={{ gap: "12px", marginTop: "24px" }}>
          {currentQ.options.map((opt, i) => {
            let style: any = { 
              padding: "16px 20px", 
              borderRadius: "12px", 
              border: "1px solid var(--glass-border)", 
              background: "rgba(255,255,255,0.03)", 
              textAlign: isRtl ? "right" : "left",
              cursor: isRevealed ? "default" : "pointer",
              transition: "all 0.2s ease"
            };

            if (isRevealed) {
              if (i === currentQ.correctIndex) {
                 style.background = "rgba(16, 185, 129, 0.2)";
                 style.border = "1px solid var(--success)";
                 style.color = "var(--success)";
              } else if (i === selectedIdx) {
                 style.background = "rgba(239, 68, 68, 0.2)";
                 style.border = "1px solid var(--error)";
                 style.color = "var(--error)";
              }
            } else {
              style.hover = { background: "rgba(255,255,255,0.08)" };
            }

            return (
              <button 
                key={i} 
                className="hover-glow"
                disabled={isRevealed}
                style={style} 
                onClick={() => handleOptionClick(i)}
              >
                {opt}
              </button>
            );
          })}
       </div>

       {isRevealed && (
         <div className="stack" style={{ marginTop: "24px", animation: "slideUp 0.4s ease" }}>
            <div className="card" style={{ background: "rgba(255,255,255,0.02)", padding: "20px", fontSize: "0.95rem" }}>
               <strong>{lang === "ar" ? "التوضيح:" : "Explanation:"}</strong> {currentQ.explanation}
            </div>
            <button className="button-link" style={{ marginTop: "20px", alignSelf: isRtl ? "flex-start" : "flex-end" }} onClick={nextQuestion}>
               {currentIndex === questions.length - 1 ? (lang === "ar" ? "إظهار النتيجة" : "Finish Drill") : (lang === "ar" ? "السؤال التالي" : "Next Question")}
            </button>
         </div>
       )}
    </div>
  );
}
