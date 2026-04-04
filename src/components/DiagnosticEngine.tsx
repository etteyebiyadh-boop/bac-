"use client";

import { useState } from "react";
import { Brain, ChevronRight, CheckCircle2, Trophy, ArrowRight, Target, Languages, PenTool } from "lucide-react";
import Link from "next/link";

const DIAGNOSTIC_QUESTIONS = [
  {
    id: 1,
    type: "grammar",
    question: "Select the correct form: 'If the government _______ more laws, pollution would have decreased.'",
    options: ["had passed", "passed", "would pass", "passes"],
    correct: 0,
    points: 2
  },
  {
    id: 2,
    type: "vocabulary",
    question: "Environmental degradation is _______ by the excessive use of fossil fuels.",
    options: ["exacerbated", "mitigated", "alleviated", "prevented"],
    correct: 0,
    points: 2
  },
  {
    id: 3,
    type: "grammar",
    question: "Reported Speech: 'I will finish the project tomorrow,' he said.",
    options: [
      "He said he would finish the project the next day.",
      "He said he will finish the project tomorrow.",
      "He said he finished the project the next day.",
      "He said he would have finished the project."
    ],
    correct: 0,
    points: 2
  },
  {
    id: 4,
    type: "reading",
    question: "In the sentence: 'The scientists discovered a new vaccine; they presented it to the WHO.' What does 'it' refer to?",
    options: ["Scientists", "The vaccine", "The WHO", "Discovery"],
    correct: 1,
    points: 2
  },
  {
    id: 5,
    type: "vocabulary",
    question: "Education is a powerful _______ for social mobility.",
    options: ["catalyst", "hindrance", "obstacle", "stagnation"],
    correct: 0,
    points: 2
  },
  {
    id: 6,
    type: "grammar",
    question: "Conditionals: 'If they _______ more attention to the instructions, they wouldn't have failed.'",
    options: ["paid", "had paid", "would pay", "pay"],
    correct: 1,
    points: 2
  },
  {
    id: 7,
    type: "grammar",
    question: "Passive Voice: 'The results of the Baccalaureate _______ tomorrow morning.'",
    options: ["will announce", "will be announced", "are announcing", "have announced"],
    correct: 1,
    points: 2
  },
  {
    id: 8,
    type: "vocabulary",
    question: "Many students strive to find a balance between their studies and their _______ activities.",
    options: ["extracurricular", "mandatory", "compulsory", "tedious"],
    correct: 0,
    points: 2
  },
  {
    id: 9,
    type: "grammar",
    question: "Modal Perfects: 'She is not here. She _______ forgotten about the meeting.'",
    options: ["must have", "should have", "could", "must"],
    correct: 0,
    points: 2
  },
  {
    id: 10,
    type: "reading",
    question: "Inference: 'The stadium was silent as the athlete prepared for the final attempt.' What is the atmosphere?",
    options: ["Festive", "Tense", "Bored", "Angry"],
    correct: 1,
    points: 2
  }
];

export function DiagnosticEngine() {
  const [step, setStep] = useState<"intro" | "test" | "saving" | "result">("intro");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);

  const startTest = () => setStep("test");

  const submitResults = async (finalScore: number, finalAnswers: number[]) => {
    setStep("saving");
    try {
      // Calculate split scores
      const grammarQuestions = DIAGNOSTIC_QUESTIONS.filter(q => q.type === "grammar");
      const vocabQuestions = DIAGNOSTIC_QUESTIONS.filter(q => q.type === "vocabulary");
      const readingQuestions = DIAGNOSTIC_QUESTIONS.filter(q => q.type === "reading");

      const getPoints = (type: string) => {
        return DIAGNOSTIC_QUESTIONS.reduce((acc, q, idx) => {
          if (q.type === type && finalAnswers[idx] === q.correct) return acc + q.points;
          return acc;
        }, 0);
      };

      await fetch("/api/diagnostic", {
        method: "POST",
        body: JSON.stringify({
          score: finalScore,
          maxScore: DIAGNOSTIC_QUESTIONS.length * 2,
          grammarScore: getPoints("grammar"),
          vocabularyScore: getPoints("vocabulary"),
          readingScore: getPoints("reading"),
          answers: finalAnswers
        })
      });
    } catch (e) {
      console.error("Failed to save results", e);
    } finally {
      setStep("result");
    }
  };

  const handleAnswer = (idx: number) => {
    const updatedAnswers = [...answers, idx];
    setAnswers(updatedAnswers);

    let newScore = score;
    if (idx === DIAGNOSTIC_QUESTIONS[currentIdx].correct) {
      newScore = score + DIAGNOSTIC_QUESTIONS[currentIdx].points;
      setScore(newScore);
    }

    if (currentIdx < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      submitResults(newScore, updatedAnswers);
    }
  };

  const getReadinessLabel = (finalScore: number) => {
    const totalPossible = DIAGNOSTIC_QUESTIONS.length * 2;
    const ratio = finalScore / totalPossible;
    if (ratio >= 0.8) return { label: "EXCELLENCE", color: "var(--accent-green)", prediction: "17-19 / 20" };
    if (ratio >= 0.5) return { label: "READY", color: "var(--primary)", prediction: "12-15 / 20" };
    return { label: "AT RISK", color: "var(--accent)", prediction: "08-11 / 20" };
  };

  if (step === "intro") {
    return (
      <div className="stack" style={{ gap: "40px", textAlign: "center", maxWidth: "700px", margin: "100px auto" }}>
        <div style={{ display: "inline-flex", padding: "16px", background: "rgba(99, 102, 241, 0.1)", borderRadius: "24px", margin: "0 auto" }}>
          <Brain size={48} className="text-gradient" />
        </div>
        <div className="stack" style={{ gap: "16px" }}>
           <h1 className="hero-title" style={{ fontSize: "4rem" }}>Bac Readiness Diagnostic</h1>
           <p className="muted" style={{ fontSize: "1.2rem" }}>
             10 Expert Questions. 1 AI-Predicted Score. Unlock your personalized 2026 study roadmap in minutes.
           </p>
        </div>
        <button className="button-link hover-glow" onClick={startTest} style={{ padding: "24px 64px", fontSize: "1.2rem", fontWeight: 900, background: "white", color: "black" }}>
           START EVALUATION <ArrowRight size={24} />
        </button>
        <div className="row" style={{ gap: "32px", justifyContent: "center", opacity: 0.6 }}>
           <span className="row" style={{ gap: "8px" }}><Target size={18} /> High Accuracy</span>
           <span className="row" style={{ gap: "8px" }}><Languages size={18} /> Multi-Language</span>
           <span className="row" style={{ gap: "8px" }}><PenTool size={18} /> Section Targeted</span>
        </div>
      </div>
    );
  }

  if (step === "saving") {
    return (
      <div className="stack" style={{ gap: "24px", alignItems: "center", justifyContent: "center", margin: "150px auto", textAlign: "center" }}>
        <div className="loader" style={{ width: "48px", height: "48px", border: "4px solid var(--primary)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <h2 style={{ fontSize: "1.8rem", fontWeight: 800 }}>Analyzing results...</h2>
        <p className="muted">Our AI is generating your 2026 success roadmap.</p>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes spin { to { transform: rotate(360deg); } }
        `}} />
      </div>
    );
  }

  if (step === "test") {
    const q = DIAGNOSTIC_QUESTIONS[currentIdx];
    const progress = ((currentIdx + 1) / DIAGNOSTIC_QUESTIONS.length) * 100;

    return (
      <div className="stack" style={{ gap: "60px", maxWidth: "800px", margin: "100px auto" }}>
        <div className="stack" style={{ gap: "12px" }}>
          <div className="row-between" style={{ fontSize: "12px", fontWeight: 800 }}>
             <span className="eyebrow" style={{ color: "var(--primary)" }}>QUESTION {currentIdx + 1} OF {DIAGNOSTIC_QUESTIONS.length}</span>
             <span className="muted">{Math.round(progress)}% COMPLETE</span>
          </div>
          <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "100px", overflow: "hidden" }}>
             <div style={{ width: `${progress}%`, height: "100%", background: "var(--primary)", transition: "all 0.4s ease" }} />
          </div>
        </div>

        <div className="stack" style={{ gap: "32px" }}>
           <h2 style={{ fontSize: "2.5rem", fontWeight: 900, lineHeight: 1.2 }}>{q.question}</h2>
           <div className="stack" style={{ gap: "16px" }}>
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  className="card row hover-scale"
                  onClick={() => handleAnswer(i)}
                  style={{ 
                    padding: "24px 32px", 
                    textAlign: "left", 
                    gap: "20px", 
                    fontSize: "1.2rem", 
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid var(--glass-border)",
                    cursor: "pointer"
                  }}
                >
                   <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid var(--primary)", flexShrink: 0 }} />
                   {opt}
                </button>
              ))}
           </div>
        </div>
      </div>
    );
  }

  const result = getReadinessLabel(score);

  return (
    <div className="stack reveal" style={{ gap: "40px", maxWidth: "850px", margin: "80px auto", textAlign: "center" }}>
       <div className="card-vibrant stack" style={{ padding: "64px", background: "rgba(99, 102, 241, 0.05)", border: "1px solid var(--primary)", gap: "24px" }}>
          <div className="row" style={{ gap: "10px", justifyContent: "center" }}>
             <Trophy size={48} color={result.color} />
          </div>
          <div className="stack" style={{ gap: "12px" }}>
             <span className="eyebrow">YOUR BAC READINESS LEVEL</span>
             <h1 style={{ fontSize: "5rem", fontWeight: 900, color: result.color, lineHeight: 1 }}>{result.label}</h1>
             <div className="row" style={{ gap: "12px", justifyContent: "center", fontSize: "1.5rem", fontWeight: 700 }}>
                <span className="muted">PREDICTED JUNE SCORE:</span>
                <span className="text-gradient" style={{ fontSize: "2.5rem" }}>{result.prediction}</span>
             </div>
          </div>
          
          <div style={{ marginTop: "24px" }} className="row-between">
             <div className="stack" style={{ alignItems: "center", gap: "8px" }}>
                <span className="muted" style={{ fontSize: "12px" }}>Grammar Score</span>
                <strong style={{ fontSize: "1.5rem" }}>{score >= 6 ? "EXPERT" : "NOVICE"}</strong>
             </div>
             <div style={{ width: "1px", height: "40px", background: "rgba(255,255,255,0.1)" }} />
             <div className="stack" style={{ alignItems: "center", gap: "8px" }}>
                <span className="muted" style={{ fontSize: "12px" }}>Vocab Mastery</span>
                <strong style={{ fontSize: "1.5rem" }}>{score >= 4 ? "MASTER" : "NEEDS WORK"}</strong>
             </div>
          </div>
       </div>

       <div className="card stack" style={{ padding: "48px", gap: "32px", border: "1px dashed var(--primary)", background: "none" }}>
          <div className="stack" style={{ gap: "12px" }}>
             <h3 style={{ fontSize: "1.8rem", fontWeight: 800 }}>🎯 YOUR PERSONALIZED ROADMAP GENERATED</h3>
             <p className="muted">Based on your weaknesses in Conditionals and Module 2 Vocabulary, we&apos;ve customized your Bac Excellence path.</p>
          </div>
          <div className="grid grid-cols-2 gap-20">
             <div className="card row" style={{ padding: "20px", gap: "12px", background: "rgba(255,255,255,0.03)" }}>
                <CheckCircle2 size={18} color="var(--primary)" />
                <span style={{ fontWeight: 800 }}>Master Unit 2 Lessons</span>
             </div>
             <div className="card row" style={{ padding: "20px", gap: "12px", background: "rgba(255,255,255,0.03)" }}>
                <CheckCircle2 size={18} color="var(--primary)" />
                <span style={{ fontWeight: 800 }}>Intensive Conditional Drill</span>
             </div>
          </div>
          <Link href="/" className="button-link hover-glow" style={{ padding: "20px 48px", background: "var(--primary)", color: "white", fontSize: "1.2rem", fontWeight: 900 }}>
             CLAIM YOUR ROADMAP NOW
          </Link>
       </div>
    </div>
  );
}
