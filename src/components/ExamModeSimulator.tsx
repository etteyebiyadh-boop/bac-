"use client";

import { useState, useEffect } from "react";
import { BookOpen, Languages, PenTool, Timer, CheckCircle2, AlertCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { WriteWorkspace } from "@/app/write/write-workspace";
import { SiteLanguage, translations } from "@/lib/translations";

interface Exam {
  id: string;
  year: number;
  title: string;
  prompt: string;
  methodology: string;
  estimatedMinutes: number;
  readingTitle?: string;
  readingContent?: string;
  readingQuestions?: any;
  languageQuestions?: any;
}

interface ExamModeSimulatorProps {
  exam: Exam;
  lang: SiteLanguage;
  bacSection: string | null;
  scanAvailable: boolean;
}

export function ExamModeSimulator({ exam, lang, bacSection, scanAvailable }: ExamModeSimulatorProps) {
  const [activePortal, setActivePortal] = useState<"reading" | "language" | "writing">("reading");
  const [timeLeft, setTimeLeft] = useState(exam.estimatedMinutes * 60);
  const [isFinished, setIsFinished] = useState(false);
  const t = translations[lang] || translations.en;

  // Timer Logic
  useEffect(() => {
    if (isFinished || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? `${h}h ` : ""}${m}m ${s}s`;
  };

  const ReadingSection = () => (
    <div className="grid grid-cols-2 gap-40" style={{ gridTemplateColumns: "1fr 1fr" }}>
      {/* Passage Panel */}
      <div className="stack" style={{ gap: "24px", position: "sticky", top: "120px", height: "fit-content" }}>
        <div className="row-between">
           <span className="pill" style={{ background: "rgba(99, 102, 241, 0.1)", color: "var(--primary)" }}>Official Text</span>
           <span className="muted">Est. 12 Points</span>
        </div>
        <h2 style={{ fontSize: "2rem", fontWeight: 900 }}>{exam.readingTitle || "Exam Reading Passage"}</h2>
        <div className="card" style={{ 
          padding: "40px", 
          lineHeight: "1.8", 
          fontSize: "1.1rem", 
          background: "rgba(255,255,255,0.02)", 
          border: "1px solid var(--glass-border)",
          maxHeight: "60vh",
          overflowY: "auto",
          whiteSpace: "pre-wrap"
        }}>
          {exam.readingContent || "The text for this exam will appear here. Students are expected to read carefully and analyze the themes and structure."}
        </div>
      </div>

      {/* Questions Panel */}
      <div className="stack" style={{ gap: "32px" }}>
        <div className="card stack" style={{ padding: "40px", borderLeft: "4px solid var(--primary)" }}>
          <h3 style={{ fontWeight: 800 }}>Comprehension Check</h3>
          <p className="muted">Answer all questions based on the text for full marks.</p>
        </div>

        {/* Mocking Reading Questions if none exist */}
        {(exam.readingQuestions as any[])?.length > 0 ? (
          (exam.readingQuestions as any[]).map((q, i) => (
            <div key={i} className="card stack" style={{ padding: "32px", gap: "20px" }}>
              <div className="row-between">
                <span className="eyebrow">QUESTION {i+1}</span>
                <span className="muted" style={{ fontSize: "12px" }}>{q.points || 2} pts</span>
              </div>
              <p style={{ fontWeight: 700, fontSize: "1.2rem" }}>{q.question}</p>
              <textarea 
                className="input-base" 
                placeholder="Type your justification/answer here..." 
                style={{ minHeight: "100px", padding: "16px" }}
              />
            </div>
          ))
        ) : (
          <div className="stack" style={{ gap: "20px", opacity: 0.6 }}>
             <p className="muted italic">Standard BAC Comprehension sequence: Multiple Choice, True/False justifications, Reference questions.</p>
          </div>
        )}
      </div>
    </div>
  );

  const LanguageSection = () => (
    <div className="stack" style={{ maxWidth: "800px", margin: "0 auto", gap: "40px" }}>
      <div className="stack" style={{ gap: "12px", textAlign: "center" }}>
        <h1 className="hero-title" style={{ fontSize: "3rem" }}>Section II: Language</h1>
        <p className="muted" style={{ fontSize: "1.2rem" }}>Fill in the blanks with the correct form/words. Est. 8 Points.</p>
      </div>

      <div className="card stack" style={{ padding: "48px", gap: "32px", border: "1px solid var(--glass-border)" }}>
         {/* Placeholder for standard BAC Language Drills */}
         <div className="stack" style={{ gap: "24px" }}>
            <div style={{ lineHeight: "2.5", fontSize: "1.2rem", fontWeight: 500 }}>
               Innovation is the key to a 1. <input className="pill" style={{ width: "120px", border: "1px solid var(--primary)" }} /> (sustain) future. 
               Scientists are 2. <input className="pill" style={{ width: "120px", border: "1px solid var(--primary)" }} /> (invent) new technologies 
               every day to solve global issues. They have 3. <input className="pill" style={{ width: "120px", border: "1px solid var(--primary)" }} /> (work) 
               relentlessly since the last decade.
            </div>
         </div>
      </div>
    </div>
  );

  return (
    <div className="stack" style={{ gap: "48px", direction: lang === "ar" ? "rtl" : "ltr" }}>
      {/* Simulation Header */}
      <nav className="card row-between" style={{ 
        position: "sticky", 
        top: "80px", 
        zIndex: 100, 
        padding: "20px 40px", 
        background: "rgba(10, 10, 20, 0.8)", 
        backdropFilter: "blur(20px)",
        border: "1px solid var(--glass-border)"
      }}>
        <div className="row" style={{ gap: "40px" }}>
          <button 
            onClick={() => setActivePortal("reading")}
            className={`row ${activePortal === "reading" ? "text-gradient" : "muted"}`} 
            style={{ gap: "10px", background: "none", border: "none", cursor: "pointer", fontWeight: 800 }}
          >
            <BookOpen size={18} /> I. READING
          </button>
          <button 
            onClick={() => setActivePortal("language")}
            className={`row ${activePortal === "language" ? "text-gradient" : "muted"}`} 
            style={{ gap: "10px", background: "none", border: "none", cursor: "pointer", fontWeight: 800 }}
          >
            <Languages size={18} /> II. LANGUAGE
          </button>
          <button 
            onClick={() => setActivePortal("writing")}
            className={`row ${activePortal === "writing" ? "text-gradient" : "muted"}`} 
            style={{ gap: "10px", background: "none", border: "none", cursor: "pointer", fontWeight: 800 }}
          >
            <PenTool size={18} /> III. WRITING
          </button>
        </div>

        <div className="row" style={{ gap: "24px" }}>
          <div className={`row ${timeLeft < 300 ? "error-pill" : "pill"}`} style={{ gap: "10px", padding: "10px 20px" }}>
            <Timer size={18} />
            <span style={{ fontWeight: 900, fontFamily: "monospace", fontSize: "1.1rem" }}>{formatTime(timeLeft)}</span>
          </div>
          <button className="button-link" style={{ background: "white", color: "black", padding: "10px 24px" }}>
            FINISH EXAM
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="reveal">
         {activePortal === "reading" && <ReadingSection />}
         {activePortal === "language" && <LanguageSection />}
         {activePortal === "writing" && (
           <div className="stack" style={{ gap: "32px" }}>
              <div className="stack" style={{ gap: "8px", textAlign: "center", marginBottom: "32px" }}>
                 <h1 className="hero-title" style={{ fontSize: "3rem" }}>Section III: Writing</h1>
                 <p className="muted">Write a coherent essay based on the instructions. Est. 10 Points.</p>
              </div>
              <WriteWorkspace 
                lang={lang} 
                bacSection={bacSection}
                exams={[exam as any]} 
                selectedExam={exam as any} 
                scanAvailable={scanAvailable}
                scanProviderLabel="Media Engine"
              />
           </div>
         )}
      </main>

      {/* Footer Nav */}
      <div className="row-between" style={{ marginTop: "80px", borderTop: "1px solid var(--glass-border)", paddingTop: "40px" }}>
         <button 
           disabled={activePortal === "reading"}
           onClick={() => setActivePortal(activePortal === "writing" ? "language" : "reading")}
           className="button-link button-secondary" 
           style={{ gap: "12px" }}
         >
           <ChevronLeft size={18} /> Previous Section
         </button>
         <button 
           disabled={activePortal === "writing"}
           onClick={() => setActivePortal(activePortal === "reading" ? "language" : "writing")}
           className="button-link" 
           style={{ gap: "12px" }}
         >
           Next Section <ChevronRight size={18} />
         </button>
      </div>
    </div>
  );
}
