"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FREE_CORRECTIONS_PER_WEEK, MAX_ESSAY_CHARS, MIN_ESSAY_CHARS } from "@/lib/constants";
import { profileLanguageOptions } from "@/lib/learning";
import { SiteLanguage, translations } from "@/lib/translations";

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

          <div className="stack" style={{ gap: "12px" }}>
            <div className="row-between">
              <label className="field-label" htmlFor="student-text">
                {t.wr_essay}
              </label>
              <span className="muted">{wordCount} words</span>
            </div>
            <textarea
              id="student-text"
              rows={14}
              placeholder={lang === "ar" ? "اكتب مقالك هنا. ابدأ بتوطئة، ثم طور أفكارك، وانته بخاتمة موجزة." : (lang === "fr" ? "Écrivez votre texte ici. Prévoyez une introduction, un développement et une conclusion." : "Write your essay here. Aim for a clear introduction, developed ideas, and a short conclusion.")}
              value={studentText}
              onChange={(event) => setStudentText(event.target.value.slice(0, MAX_ESSAY_CHARS))}
              style={{ padding: "24px", borderRadius: "16px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", fontSize: "1.1rem", lineHeight: "1.6" }}
            />
          </div>

          <button
            className="full-width hover-glow"
            onClick={submitEssay}
            disabled={isLoading || studentText.trim().length < MIN_ESSAY_CHARS}
            style={{ padding: "20px", fontSize: "1.1rem", fontWeight: 800 }}
          >
            {isLoading ? t.wr_correcting : t.wr_submit}
          </button>

          <p className="muted" style={{ fontSize: "12px", textAlign: "center" }}>
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

          <div className="card stack" style={{ padding: "40px" }}>
            <h3 className="section-title">{t.wr_corrected_version}</h3>
            <div style={{ padding: "24px", background: "rgba(255,255,255,0.02)", borderRadius: "12px", fontSize: "1.1rem", lineHeight: "1.8", whiteSpace: "pre-wrap" }}>
              {result.correctedText}
            </div>
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
