"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FREE_CORRECTIONS_PER_WEEK, MAX_ESSAY_CHARS, MIN_ESSAY_CHARS } from "@/lib/constants";
import { profileLanguageOptions } from "@/lib/learning";
import { SiteLanguage, translations } from "@/lib/translations";
import { AIHighlightDiff, AIExplanationCard } from "@/components/ai-correction-view";

type ExamOption = {
  id: string;
  year: number;
  title: string;
  prompt: string;
  methodology: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  estimatedMinutes: number;
  language: string;
};

type CorrectionResult = {
  overallScore: number;
  grammarScore: number;
  vocabularyScore: number;
  structureScore: number;
  summary: string;
  correctedText: string;
  explanations: { original: string; fixed: string; reason: string }[];
  strengths: string[];
  improvements: string[];
  recommendedLesson: {
    slug: string;
    title: string;
    summary: string;
    skillFocus: string;
  } | null;
  remainingFreeCorrections: number | null;
};

type WriteWorkspaceProps = {
  exams: ExamOption[];
  selectedExam: ExamOption | null;
  lang: SiteLanguage;
};

function difficultyLabel(value: ExamOption["difficulty"]) {
  return value.charAt(0) + value.slice(1).toLowerCase();
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="score-line">
      <div className="row-between">
        <span>{label}</span>
        <strong>{value.toFixed(1)} / 20</strong>
      </div>
      <div className="score-bar">
        <div className="score-fill" style={{ width: `${Math.min((value / 20) * 100, 100)}%` }} />
      </div>
    </div>
  );
}

export function WriteWorkspace({ exams, selectedExam, lang }: WriteWorkspaceProps) {
  const router = useRouter();
  const t = translations[lang];
  const [selectedExamId, setSelectedExamId] = useState(selectedExam?.id ?? "");
  const [customPrompt, setCustomPrompt] = useState("");
  const [freeLanguage, setFreeLanguage] = useState("ENGLISH");
  const [studentText, setStudentText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CorrectionResult | null>(null);

  const [isFocusMode, setIsFocusMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!isFocusMode || timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [isFocusMode, timeLeft]);

  function startFocusMode() {
    if (!activeExam) return;
    setTimeLeft(activeExam.estimatedMinutes * 60);
    setStudentText("");
    setIsFocusMode(true);
  }

  const activeExam = exams.find((exam) => exam.id === selectedExamId) ?? null;

  const wordCount = studentText.trim().length === 0 ? 0 : studentText.trim().split(/\s+/).length;

  function handleExamChange(examId: string) {
    setSelectedExamId(examId);
    setResult(null);
    setError("");
    router.replace(examId ? `/write?examId=${examId}` : "/write");
  }

  async function submitEssay() {
    setIsLoading(true);
    setError("");
    setResult(null);

    const response = await fetch("/api/correct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        examId: activeExam?.id,
        promptText: activeExam ? activeExam.prompt : customPrompt,
        studentText,
        language: activeExam ? activeExam.language : freeLanguage
      })
    });

    const data = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      setError(data.error || "Correction failed. Try again.");
      return;
    }

    setResult(data);
  }

  if (isFocusMode && activeExam) {
    const mins = Math.floor(timeLeft / 60).toString().padStart(2, "0");
    const secs = Math.floor(timeLeft % 60).toString().padStart(2, "0");
    
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#000", color: "white", padding: "40px", display: "flex", flexDirection: "column" }}>
        <div className="row-between" style={{ paddingBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="stack" style={{ gap: "4px" }}>
            <span className="eyebrow" style={{ color: "var(--accent)" }}>BAC FOCUS MODE</span>
            <strong style={{ fontSize: "1.2rem" }}>{activeExam.year} - {activeExam.title}</strong>
          </div>
          
          <div style={{ fontSize: "2.5rem", fontWeight: 900, fontFamily: "monospace", color: timeLeft < 300 ? "var(--error)" : "var(--primary)" }}>
            {mins}:{secs}
          </div>
          
          <button className="pill hover-glow" onClick={() => setIsFocusMode(false)} style={{ background: "rgba(239,68,68,0.1)", color: "var(--error)", border: "1px solid var(--error)", cursor: "pointer" }}>
            Abort Exam
          </button>
        </div>
        
        <div className="grid grid-cols-2" style={{ gap: "40px", flex: 1, marginTop: "40px", overflow: "hidden" }}>
          <div className="stack card" style={{ padding: "40px", background: "rgba(255,255,255,0.02)", overflowY: "auto", border: "1px solid var(--glass-border)" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>Official Exam Prompt</h2>
            <p style={{ fontSize: "1.2rem", lineHeight: 1.8 }}>{activeExam.prompt}</p>
            <div style={{ marginTop: "40px", padding: "20px", background: "rgba(99, 102, 241, 0.05)", borderLeft: "4px solid var(--primary)" }}>
              <h3 style={{ fontSize: "1rem", color: "var(--primary)", marginBottom: "10px" }}>Methodology Target 🎯</h3>
              <p style={{ fontSize: "0.95rem", opacity: 0.8 }}>{activeExam.methodology}</p>
            </div>
          </div>
          
          <div className="stack" style={{ gap: "10px", flex: 1 }}>
            <div className="row-between">
              <span className="eyebrow">Your Response</span>
              <span className="muted">{wordCount} words</span>
            </div>
            <textarea 
              autoFocus
              value={studentText}
              onChange={(e) => setStudentText(e.target.value.slice(0, MAX_ESSAY_CHARS))}
              placeholder="Start writing under exam conditions... Make every word count."
              style={{ flex: 1, padding: "30px", fontSize: "1.2rem", lineHeight: 1.8, background: "rgba(0,0,0,0.5)", border: "1px solid var(--glass-border)", borderRadius: "12px", resize: "none", outline: "none", color: "white" }}
              onPaste={(e) => e.preventDefault()} // Block pasting in focus mode
            />
          </div>
        </div>
        
        <div className="row-between" style={{ marginTop: "24px" }}>
           <span className="muted" style={{ fontSize: "12px" }}>Stay focused. Copy-paste is disabled. Good luck.</span>
           <button 
             className="button-link hover-glow" 
             style={{ background: "var(--primary)", color: "black", padding: "16px 40px", fontSize: "1.2rem", fontWeight: 800, cursor: "pointer" }}
             disabled={isLoading || wordCount < 10}
             onClick={() => {
               setIsFocusMode(false);
               submitEssay();
             }}
           >
             {isLoading ? "Submitting..." : "Submit Exam for AI Grading"}
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-stack" style={{ direction: lang === "ar" ? "rtl" : "ltr" }}>
      <section className="card practice-layout" style={{ border: "1px solid var(--primary)", background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05), transparent)" }}>
        <div className="stack" style={{ gap: "16px" }}>
          <span className="eyebrow" style={{ color: "var(--primary)" }}>{t.wr_title}</span>
          <h1 className="section-title" style={{ fontSize: "3rem" }}>{t.wr_subtitle}</h1>
        </div>

        <div className="stack" style={{ marginTop: "32px", gap: "24px" }}>
          <div className="stack">
            <label className="field-label" htmlFor="exam-select">
              {t.wr_practice_mode}
            </label>
            <select
              id="exam-select"
              value={selectedExamId}
              onChange={(event) => handleExamChange(event.target.value)}
              style={{ padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)" }}
            >
              <option value="">{t.wr_free_mode}</option>
              {exams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.year} - {exam.title} ({exam.language})
                </option>
              ))}
            </select>
          </div>

          {activeExam ? (
            <div className="prompt-box stack" style={{ padding: "24px", background: "rgba(0,0,0,0.2)", borderRadius: "16px", border: "1px solid var(--primary-glow)" }}>
              <div className="row-between">
                <strong>
                  {activeExam.year} - {activeExam.title}
                </strong>
                <span className="pill">
                  {difficultyLabel(activeExam.difficulty)} - {activeExam.estimatedMinutes} min
                </span>
              </div>
              <p style={{ margin: "16px 0", fontSize: "1.1rem" }}>{activeExam.prompt}</p>
              <p className="muted" style={{ fontSize: "12px" }}>{t.ex_method}: {activeExam.methodology}</p>
            </div>
          ) : (
            <div className="stack" style={{ gap: "20px" }}>
              <div className="stack">
                <label className="field-label" htmlFor="free-language">
                  Language
                </label>
                <select
                  id="free-language"
                  value={freeLanguage}
                  onChange={(e) => setFreeLanguage(e.target.value)}
                  style={{ padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)" }}
                >
                  {profileLanguageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="stack">
                <label className="field-label" htmlFor="custom-prompt">
                  {t.wr_custom_prompt}
                </label>
                <input
                  id="custom-prompt"
                  placeholder={lang === "ar" ? "مثال: هل تعتقد أن وسائل التواصل الاجتماعي مفيدة للطلاب؟" : (lang === "fr" ? "Exemple : Les réseaux sociaux sont-ils utiles pour les étudiants ?" : "Example: Is social media more helpful than harmful for students?")}
                  value={customPrompt}
                  onChange={(event) => setCustomPrompt(event.target.value)}
                  style={{ padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)" }}
                />
              </div>
            </div>
          )}

          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
            <div className="stack" style={{ gap: "12px" }}>
              <div className="row-between">
                <label className="field-label" htmlFor="student-text">
                  {t.wr_essay}
                </label>
                <span className="muted">{wordCount} {lang === "ar" ? "كلمة" : "words"}</span>
              </div>
              <textarea
                id="student-text"
                rows={16}
                placeholder={lang === "ar" ? "اكتب مقالك هنا. ابدأ بتوطئة، ثم طور أفكارك، وانته بخاتمة موجزة." : (lang === "fr" ? "Écrivez votre texte ici. Prévoyez une introduction, un développement et une conclusion." : "Write your essay here. Aim for a clear introduction, developed ideas, and a short conclusion.")}
                value={studentText}
                onChange={(event) => setStudentText(event.target.value.slice(0, MAX_ESSAY_CHARS))}
                style={{ padding: "24px", borderRadius: "16px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", fontSize: "1.1rem", lineHeight: "1.6", resize: "vertical", textAlign: (activeExam?.language === "ARABIC" || freeLanguage === "ARABIC") ? "right" : "left" }}
              />
            </div>

            <div className="card stack" style={{ padding: "28px", background: "rgba(245, 158, 11, 0.05)", border: "1px solid var(--accent-glow)" }}>
               <h3 className="eyebrow" style={{ color: "var(--accent)" }}>💡 15/20 Cheat Sheet</h3>
               <p className="muted" style={{ fontSize: "13px", marginTop: "4px" }}>
                 {lang === "ar" ? "اضغط على أي رابط لإضافته فوراً إلى مسودتك." : (lang === "fr" ? "Appuyez sur n'importe quel connecteur pour l'insérer." : "Tap any connector to instantly inject it into your draft.")}
               </p>
               
               <div className="stack" style={{ gap: "20px", marginTop: "16px" }}>
                  {(() => {
                    const currentLang = activeExam?.language || freeLanguage;
                    const connectorGroups: Record<string, { label: string, labels: Record<string, string>, words: string[] }[]> = {
                      ENGLISH: [
                        { label: "Contrast", labels: { ar: "التناقض", fr: "Contraste", en: "Contrast" }, words: ["Nevertheless,", "On the other hand,", "Conversely,", "Despite this,"] },
                        { label: "Addition", labels: { ar: "الإضافة", fr: "Addition", en: "Addition" }, words: ["Furthermore,", "Moreover,", "In addition,", "Not only... but also"] },
                        { label: "Conclusion", labels: { ar: "الخاتمة", fr: "Conclusion", en: "Conclusion" }, words: ["To sum up,", "Ultimately,", "Taking everything into consideration,"] }
                      ],
                      FRENCH: [
                        { label: "Contraste", labels: { ar: "التناقض", fr: "Contraste", en: "Contrast" }, words: ["Néanmoins,", "Pourtant,", "En revanche,", "Cependant,"] },
                        { label: "Addition", labels: { ar: "الإضافة", fr: "Addition", en: "Addition" }, words: ["De plus,", "En outre,", "Par ailleurs,", "D'ailleurs,"] },
                        { label: "Conclusion", labels: { ar: "الخاتمة", fr: "Conclusion", en: "Conclusion" }, words: ["En conclusion,", "Finalement,", "Pour conclure,", "Somme toute,"] }
                      ],
                      ARABIC: [
                        { label: "التناقض", labels: { ar: "التناقض", fr: "Contraste", en: "Contrast" }, words: ["بالمقابل،", "وعلى الرغم من ذلك،", "بيد أن،", "من ناحية أخرى،"] },
                        { label: "الإضافة", labels: { ar: "الإضافة", fr: "Addition", en: "Addition" }, words: ["علاوة على ذلك،", "بالإضافة إلى ذلك،", "وفضلاً عن ذلك،", "كما أن،"] },
                        { label: "الخاتمة", labels: { ar: "الخاتمة", fr: "Conclusion", en: "Conclusion" }, words: ["ختاماً،", "وفي النهاية،", "ومما سبق نستنتج أن،", "وخلاصة القول،"] }
                      ],
                      SPANISH: [
                        { label: "Contraste", labels: { ar: "التناقض", fr: "Contraste", en: "Contrast" }, words: ["Sin embargo,", "No obstante,", "Por otro lado,", "En cambio,"] },
                        { label: "Adición", labels: { ar: "الإضافة", fr: "Addition", en: "Addition" }, words: ["Además,", "Asimismo,", "Incluso,", "Por otra parte,"] },
                        { label: "Conclusión", labels: { ar: "الخاتمة", fr: "Conclusion", en: "Conclusion" }, words: ["En conclusión,", "Para concluir,", "En resumen,", "Por último,"] }
                      ],
                      GERMAN: [
                        { label: "Gegensatz", labels: { ar: "التناقض", fr: "Contraste", en: "Contrast" }, words: ["Trotzdem,", "Dagegen,", "Andererseits,", "Dennoch,"] },
                        { label: "Ergänzung", labels: { ar: "الإضافة", fr: "Addition", en: "Addition" }, words: ["Außerdem,", "Zudem,", "Darüber hinaus,", "Ebenfalls,"] },
                        { label: "Schluss", labels: { ar: "الخاتمة", fr: "Conclusion", en: "Conclusion" }, words: ["Schließlich,", "Zum Schluss,", "Zusammenfassend,", "Zuletzt,"] }
                      ],
                      ITALIAN: [
                        { label: "Contrasto", labels: { ar: "التناقض", fr: "Contraste", en: "Contrast" }, words: ["Tuttavia,", "Eppure,", "D'altra parte,", "Ciononostante,"] },
                        { label: "Aggiunta", labels: { ar: "الإضافة", fr: "Addition", en: "Addition" }, words: ["Inoltre,", "In aggiunta,", "Oltre a ciò,", "Pure,"] },
                        { label: "Conclusione", labels: { ar: "الخاتمة", fr: "Conclusion", en: "Conclusion" }, words: ["In conclusione,", "Per concludere,", "In breve,", "Infine,"] }
                      ]
                    };

                    const groups = connectorGroups[currentLang as string] || connectorGroups.ENGLISH;

                    return groups.map(group => (
                      <div key={group.label}>
                        <strong style={{ fontSize: "0.95rem", color: "white" }}>{group.labels[lang] || group.label}</strong>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "10px", direction: currentLang === "ARABIC" ? "rtl" : "ltr" }}>
                           {group.words.map(w => (
                              <button 
                                key={w} 
                                type="button" 
                                className="pill hover-glow" 
                                style={{ fontSize: "12px", cursor: "pointer", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--ink)" }} 
                                onClick={(e) => { 
                                  e.preventDefault(); 
                                  setStudentText(prev => prev + (prev.endsWith(" ") || prev === "" ? "" : " ") + w + " "); 
                                }}
                              >
                                {w}
                              </button>
                           ))}
                        </div>
                      </div>
                    ));
                  })()}
               </div>
            </div>
          </div>

          <button
            className="full-width hover-glow"
            onClick={submitEssay}
            disabled={isLoading || studentText.trim().length < MIN_ESSAY_CHARS}
            style={{ padding: "20px", fontSize: "1.1rem", fontWeight: 800 }}
          >
            {isLoading ? t.wr_correcting : t.wr_submit}
          </button>

          {activeExam && !result ? (
            <button 
              type="button" 
              onClick={startFocusMode} 
              className="button-link hover-glow" 
              style={{ background: "rgba(239, 68, 68, 0.05)", border: "1px solid var(--error)", color: "var(--error)", padding: "20px", fontSize: "1.1rem", fontWeight: 800, justifyContent: "center", cursor: "pointer" }}
            >
               ⏱️ Start Timed Mock Exam (Focus Mode)
            </button>
          ) : null}

          <p className="muted" style={{ fontSize: "12px", textAlign: "center", marginTop: "10px" }}>
            {FREE_CORRECTIONS_PER_WEEK} AI corrections per week. Essay length: {MIN_ESSAY_CHARS} to {MAX_ESSAY_CHARS} characters.
          </p>

          {error ? <p className="error-text" style={{ textAlign: "center" }}>{error}</p> : null}
        </div>
      </section>

      {result ? (
        <section className="result-panel stack" style={{ gap: "32px", animation: "slideUp 0.6s ease-out" }}>
          <div className="card stack" style={{ padding: "40px", border: "1px solid var(--success-glow)" }}>
            <div className="row-between">
              <div>
                <span className="eyebrow" style={{ color: "var(--success)" }}>Bac Result</span>
                <h2 className="section-title" style={{ fontSize: "2.5rem" }}>{t.wr_score}: {result.overallScore.toFixed(1)} / 20</h2>
              </div>
              <span className={`pill ${result.overallScore >= 15 ? 'success-pill' : ''}`}>
                {result.overallScore >= 15 ? "15+ target reached" : "Keep pushing"}
              </span>
            </div>
            
            <div className="score-grid grid grid-cols-3" style={{ gap: "24px", margin: "40px 0" }}>
              <ScoreBar label={t.wr_grammar} value={result.grammarScore} />
              <ScoreBar label={t.wr_vocab} value={result.vocabularyScore} />
              <ScoreBar label={t.wr_structure} value={result.structureScore} />
            </div>

            <p style={{ fontSize: "1.2rem", fontStyle: "italic", borderLeft: "4px solid var(--primary)", paddingLeft: "24px" }}>{result.summary}</p>
          </div>

          <div className="grid grid-cols-2" style={{ gap: "32px" }}>
            <div className="card stack" style={{ padding: "32px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
              <h3 className="section-title" style={{ fontSize: "1.5rem" }}>{t.wr_strengths}</h3>
              <ul className="bullet-list stack" style={{ gap: "12px", marginTop: "20px" }}>
                {result.strengths.map((item) => (
                   <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="card stack" style={{ padding: "32px", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
              <h3 className="section-title" style={{ fontSize: "1.5rem" }}>{t.wr_improvements}</h3>
              <ul className="bullet-list stack" style={{ gap: "12px", marginTop: "20px" }}>
                {result.improvements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card stack" style={{ padding: "40px", border: "1px solid var(--primary-glow)" }}>
            <div className="row-between">
              <h3 className="section-title">{t.wr_corrected_version}</h3>
              <span className="eyebrow" style={{ color: "var(--success)" }}>✨ AI Precision Edit</span>
            </div>
            
            <div style={{ marginTop: "24px", padding: "30px", background: "rgba(0,0,0,0.4)", borderRadius: "16px", border: "1px solid var(--glass-border)", fontSize: "1.15rem" }}>
              <AIHighlightDiff original={studentText} corrected={result.correctedText} />
            </div>

            <AIExplanationCard explanations={result.explanations} />
          </div>

          {result.recommendedLesson ? (
            <div className="card row-between" style={{ padding: "40px", border: "1px solid var(--accent-glow)", background: "linear-gradient(135deg, rgba(245, 158, 11, 0.05), transparent)" }}>
              <div className="stack" style={{ gap: "12px" }}>
                <span className="eyebrow" style={{ color: "var(--accent)" }}>Recommended Focus</span>
                <h3 className="section-title" style={{ fontSize: "2rem" }}>{result.recommendedLesson.title}</h3>
                <p className="muted">{result.recommendedLesson.summary}</p>
              </div>
              <Link href={`/lessons/${result.recommendedLesson.slug}`} className="button-link hover-glow" style={{ background: "var(--accent)", color: "black", padding: "20px 40px" }}>
                Start Lesson
              </Link>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
