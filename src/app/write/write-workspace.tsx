"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FREE_CORRECTIONS_PER_WEEK, MAX_ESSAY_CHARS, MIN_ESSAY_CHARS } from "@/lib/constants";
import { profileLanguageOptions } from "@/lib/learning";
import { SiteLanguage, translations } from "@/lib/translations";
import { AIHighlightDiff, AIExplanationCard } from "@/components/ai-correction-view";
import { CorrectionFeedback } from "@/components/correction-feedback";
import { NextAction } from "@/lib/recommendations";

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
  sourceText?: string;
  sourceMode?: "text" | "scan";
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
  submissionId: string;
};

type WriteWorkspaceProps = {
  exams: ExamOption[];
  selectedExam: ExamOption | null;
  lang: SiteLanguage;
  bacSection: string | null;
  scanAvailable: boolean;
  scanProviderLabel: string | null;
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

export function WriteWorkspace({ exams, selectedExam, lang, bacSection, scanAvailable, scanProviderLabel }: WriteWorkspaceProps) {
  const router = useRouter();
  const t = translations[lang];
  const [selectedExamId, setSelectedExamId] = useState(selectedExam?.id ?? "");
  const [customPrompt, setCustomPrompt] = useState("");
  const [freeLanguage, setFreeLanguage] = useState("ENGLISH");
  const [studentText, setStudentText] = useState("");
  const [submissionMode, setSubmissionMode] = useState<"text" | "scan">("text");
  const [scanFile, setScanFile] = useState<File | null>(null);
  const [scanText, setScanText] = useState("");
  const [scanPreviewUrl, setScanPreviewUrl] = useState("");
  const [isExtractingScan, setIsExtractingScan] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CorrectionResult | null>(null);

  const [nextAction, setNextAction] = useState<NextAction | null>(null);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!isFocusMode || timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [isFocusMode, timeLeft]);

  useEffect(() => {
    if (!scanFile) {
      setScanPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(scanFile);
    setScanPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [scanFile]);

  function startFocusMode() {
    if (!activeExam) return;
    setTimeLeft(activeExam.estimatedMinutes * 60);
    setStudentText("");
    setIsFocusMode(true);
  }

  const activeExam = exams.find((exam) => exam.id === selectedExamId) ?? null;

  const wordCount = studentText.trim().length === 0 ? 0 : studentText.trim().split(/\s+/).length;
  const scanWordCount = scanText.trim().length === 0 ? 0 : scanText.trim().split(/\s+/).length;
  const sourceTextForResult = result?.sourceText ?? (result?.sourceMode === "scan" ? scanText : studentText);
  const isScanMode = submissionMode === "scan";
  const currentPromptText = activeExam ? activeExam.prompt : customPrompt;
  const currentLanguage = activeExam ? activeExam.language : freeLanguage;
  const canSubmit = isScanMode ? scanText.trim().length >= MIN_ESSAY_CHARS : studentText.trim().length >= MIN_ESSAY_CHARS;

  function clearScanDraft() {
    setScanFile(null);
    setScanText("");
    setError("");
    setResult(null);
  }

  function appendConnector(value: string) {
    if (isScanMode) {
      setScanText((prev) => prev + (prev.endsWith(" ") || prev === "" ? "" : " ") + value + " ");
      return;
    }

    setStudentText((prev) => prev + (prev.endsWith(" ") || prev === "" ? "" : " ") + value + " ");
  }

  function handleExamChange(examId: string) {
    setSelectedExamId(examId);
    setResult(null);
    setError("");
    router.replace(examId ? `/write?examId=${examId}` : "/write");
  }

  async function extractScanText() {
    if (!scanAvailable) {
      setError(
        lang === "fr"
          ? "Le scan photo n'est pas disponible sur cette configuration."
          : (lang === "ar" ? "مسح الصور غير متاح في هذا الإعداد." : "Photo scanning is not available in this setup.")
      );
      return;
    }

    if (!scanFile) {
      setError(
        lang === "fr"
          ? "Ajoutez une photo avant de lancer la lecture IA."
          : (lang === "ar" ? "أضف صورة قبل قراءة النص بالذكاء الاصطناعي." : "Add a photo before asking the AI to read it.")
      );
      return;
    }

    setIsExtractingScan(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.set("action", "extract_text");
    formData.set("language", currentLanguage);
    formData.set("workImage", scanFile);

    const response = await fetch("/api/correct", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    setIsExtractingScan(false);

    if (!response.ok) {
      setError(data.error || "Photo scan failed. Try again.");
      return;
    }

    setScanText(String(data.extractedText || ""));
  }

  async function submitEssay() {
    if (isScanMode && !scanFile) {
      setError(
        lang === "fr"
          ? "Ajoutez une photo avant de lancer la correction."
          : (lang === "ar" ? "أضف صورة قبل تشغيل التصحيح." : "Add a photo before starting the correction.")
      );
      return;
    }

    if (isScanMode && scanText.trim().length < MIN_ESSAY_CHARS) {
      setError(
        lang === "fr"
          ? "Lisez d'abord la photo puis corrigez le texte extrait si besoin."
          : (lang === "ar" ? "اقرأ الصورة أولاً ثم راجع النص المستخرج إذا لزم الأمر." : "Read the photo first, then review the extracted text if needed.")
      );
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    const response = await fetch("/api/correct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        examId: activeExam?.id,
        promptText: currentPromptText,
        studentText: isScanMode ? scanText : studentText,
        language: currentLanguage,
        bacSection: bacSection,
        sourceMode: isScanMode ? "scan" : "text"
      })
    });

    const data = await response.json();
    setIsLoading(false);

    if (!response.ok) {
      setError(data.error || "Correction failed. Try again.");
      return;
    }

    setResult(data);
    
    // Fetch next best action after correction
    fetch("/api/recommendations")
      .then(res => res.json())
      .then(recData => {
        if (recData.action) {
          setNextAction(recData.action);
        }
      })
      .catch(() => {});
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

          <div className="stack" style={{ gap: "12px" }}>
            <span className="field-label">
              {lang === "fr" ? "Mode d'envoi" : (lang === "ar" ? "طريقة الإرسال" : "Submission mode")}
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              <button
                type="button"
                className="pill hover-glow"
                onClick={() => {
                  setSubmissionMode("text");
                  setError("");
                  setResult(null);
                }}
                style={{
                  cursor: "pointer",
                  padding: "14px 18px",
                  border: submissionMode === "text" ? "1px solid var(--primary)" : "1px solid var(--glass-border)",
                  background: submissionMode === "text" ? "rgba(99, 102, 241, 0.14)" : "rgba(255,255,255,0.03)",
                  color: "var(--ink)"
                }}
              >
                {lang === "fr" ? "Ecrire la reponse" : (lang === "ar" ? "كتابة الإجابة" : "Write the answer")}
              </button>
              <button
                type="button"
                className="pill hover-glow"
                disabled={!scanAvailable}
                onClick={() => {
                  if (!scanAvailable) return;
                  setSubmissionMode("scan");
                  setError("");
                  setResult(null);
                }}
                style={{
                  cursor: scanAvailable ? "pointer" : "not-allowed",
                  padding: "14px 18px",
                  border: submissionMode === "scan" ? "1px solid var(--accent)" : "1px solid var(--glass-border)",
                  background: submissionMode === "scan" ? "rgba(245, 158, 11, 0.14)" : "rgba(255,255,255,0.03)",
                  color: "var(--ink)",
                  opacity: scanAvailable ? 1 : 0.45
                }}
              >
                {lang === "fr" ? "Scanner une photo" : (lang === "ar" ? "مسح صورة" : "Scan a photo")}
              </button>
            </div>
            <p className="muted" style={{ fontSize: "13px" }}>
              {isScanMode
                ? (lang === "fr"
                    ? "Prenez une photo claire de votre copie et l'IA lira le texte avant de le corriger."
                    : (lang === "ar"
                        ? "التقط صورة واضحة لورقتك وسيقرأ الذكاء الاصطناعي النص قبل تصحيحه."
                        : "Take a clear photo of the work and the AI will read it before grading it."))
                : (lang === "fr"
                    ? "Le mode classique reste disponible si l'etudiant prefere ecrire directement."
                    : (lang === "ar"
                        ? "يبقى الوضع العادي متاحا إذا أراد الطالب الكتابة مباشرة."
                        : "The classic writing flow stays available for students who want to type directly."))}
            </p>
            {!scanAvailable ? (
              <p className="muted" style={{ fontSize: "12px", color: "var(--accent)" }}>
                {lang === "fr"
                  ? `Le scan photo est desactive tant qu'un provider vision n'est pas configure${scanProviderLabel ? ` (${scanProviderLabel})` : ""}.`
                  : (lang === "ar"
                      ? "تم تعطيل مسح الصور حتى يتم إعداد مزود يدعم الرؤية."
                      : "Photo scan stays disabled until a vision-capable provider is configured.")}
              </p>
            ) : null}
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

          <div className="grid grid-cols-1 lg:grid-cols-[1.6fr,1fr] gap-10" style={{ alignItems: "start", marginTop: "32px" }}>
            <div className="stack" style={{ gap: "32px" }}>
              <div className="stack" style={{ gap: "16px" }}>
                <div className="row-between">
                  <label className="field-label" htmlFor={isScanMode ? "work-image" : "student-text"} style={{ fontSize: "1.1rem", fontWeight: 800 }}>
                    {isScanMode
                      ? (lang === "fr" ? "Photo du devoir" : (lang === "ar" ? "صورة العمل" : "Work photo"))
                      : t.wr_essay}
                  </label>
                  {!isScanMode ? (
                    <div className="row-between" style={{ gap: "12px" }}>
                       <span className="pill" style={{ background: "rgba(255,255,255,0.05)", fontSize: "12px" }}>{wordCount} {lang === "ar" ? "كلمة" : "words"}</span>
                    </div>
                  ) : null}
                </div>

                {!isScanMode ? (
                  <div style={{ position: "relative" }}>
                    <textarea
                      id="student-text"
                      rows={20}
                      placeholder={lang === "ar" ? "اكتب مقالك هنا..." : (lang === "fr" ? "Écrivez votre texte ici..." : "Write your essay here...")}
                      value={studentText}
                      onChange={(event) => setStudentText(event.target.value.slice(0, MAX_ESSAY_CHARS))}
                      style={{ 
                        padding: "32px", 
                        borderRadius: "24px", 
                        background: "rgba(10,10,20,0.4)", 
                        border: "1px solid var(--glass-border)", 
                        fontSize: "1.15rem", 
                        lineHeight: "1.8", 
                        resize: "none", 
                        textAlign: (activeExam?.language === "ARABIC" || freeLanguage === "ARABIC") ? "right" : "left", 
                        minHeight: "500px",
                        width: "100%",
                        outline: "none",
                        transition: "all 0.3s ease",
                        boxShadow: "inset 0 2px 20px rgba(0,0,0,0.5)"
                      }}
                      onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                      onBlur={(e) => e.target.style.borderColor = "var(--glass-border)"}
                    />
                  </div>
                ) : (
                  <div className="stack" style={{ gap: "24px" }}>
                    <div style={{ padding: "40px", borderRadius: "24px", border: "2px dashed var(--accent-glow)", background: "rgba(245, 158, 11, 0.03)", textAlign: "center" }}>
                      <div className="stack" style={{ gap: "16px", alignItems: "center" }}>
                        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(245, 158, 11, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                           <span style={{ fontSize: "2rem" }}>📸</span>
                        </div>
                        <div className="stack" style={{ gap: "8px" }}>
                          <strong style={{ fontSize: "1.2rem" }}>{lang === "fr" ? "Importer une photo" : (lang === "ar" ? "ارفع صورة" : "Upload a photo")}</strong>
                          <p className="muted" style={{ maxWidth: "340px", fontSize: "14px", margin: "0 auto" }}>
                            {lang === "fr" ? "IA scanne & corrige votre copie papier." : "AI scans and corrects your paper work."}
                          </p>
                        </div>
                        <input
                          id="work-image"
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={(event) => {
                            const nextFile = event.target.files?.[0] ?? null;
                            setScanFile(nextFile);
                            setScanText("");
                            setError("");
                            setResult(null);
                          }}
                          style={{ marginTop: "16px" }}
                        />
                      </div>
                    </div>

                    {scanFile ? (
                      <div className="card stack stagger-item" style={{ padding: "24px", gap: "20px", background: "rgba(255,255,255,0.02)", borderRadius: "24px" }}>
                        <div className="row-between">
                          <div className="stack" style={{ gap: "4px" }}>
                            <strong style={{ fontSize: "1rem" }}>{scanFile.name}</strong>
                          </div>
                          <button onClick={clearScanDraft} className="pill" style={{ background: "rgba(239,68,68,0.1)", color: "var(--error)", border: "1px solid rgba(239,68,68,0.2)" }}>Remove</button>
                        </div>

                        {scanPreviewUrl && (
                          <div style={{ position: "relative", width: "100%", height: "400px", borderRadius: "16px", overflow: "hidden", border: "1px solid var(--glass-border)" }}>
                            <Image src={scanPreviewUrl} alt="Preview" fill style={{ objectFit: "contain" }} unoptimized />
                          </div>
                        )}

                        <button
                          type="button"
                          className="button-link hover-glow"
                          onClick={extractScanText}
                          disabled={isExtractingScan || !scanAvailable}
                          style={{ background: "var(--accent)", color: "black", fontWeight: 800, padding: "16px" }}
                        >
                          {isExtractingScan ? "Reading..." : "Start AI Vision Extraction 👁️"}
                        </button>
                      </div>
                    ) : null}

                    {scanText ? (
                      <div className="stack stagger-item" style={{ gap: "12px" }}>
                        <label className="field-label" htmlFor="scan-text-review" style={{ color: "var(--accent)" }}>AI Extracted Text (Review & Edit)</label>
                        <textarea
                          id="scan-text-review"
                          rows={12}
                          value={scanText}
                          onChange={(e) => setScanText(e.target.value)}
                          style={{ padding: "24px", borderRadius: "20px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--accent-glow)", fontSize: "1.1rem", lineHeight: "1.7" }}
                        />
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              <div className="row-between" style={{ gap: "16px" }}>
                <button
                  className="hover-glow primary-action"
                  onClick={submitEssay}
                  disabled={isLoading || !canSubmit}
                  style={{ flex: 1, padding: "24px", fontSize: "1.25rem", fontWeight: 900, borderRadius: "20px" }}
                >
                  {isLoading ? t.wr_correcting : t.wr_submit}
                </button>
                
                {activeExam && !result && !isScanMode && (
                  <button onClick={startFocusMode} className="button-link" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid var(--error)", color: "var(--error)", padding: "24px", borderRadius: "20px" }}>
                    ⏱️ MOCK EXAM
                  </button>
                )}
              </div>
            </div>

            <aside className="stack" style={{ gap: "32px", position: "sticky", top: "120px" }}>
              <div className="card stack" style={{ 
                padding: "32px", 
                background: "rgba(245, 158, 11, 0.04)", 
                border: "1px solid var(--accent-glow)", 
                borderRadius: "28px",
                backdropFilter: "blur(10px)"
              }}>
                <div className="row-between" style={{ marginBottom: "20px" }}>
                  <h3 className="eyebrow" style={{ color: "var(--accent)", margin: 0 }}>💡 Connectors Cheat Sheet</h3>
                </div>
                
                <div className="stack" style={{ gap: "24px" }}>
                    {(() => {
                      const currentLang = activeExam?.language || freeLanguage;
                      const connectorGroups: Record<string, any[]> = {
                        ENGLISH: [
                          { label: "Contrast", words: ["Nevertheless,", "Conversely,", "Despite this,"] },
                          { label: "Addition", words: ["Furthermore,", "In addition,", "Moreover,"] },
                          { label: "Conclusion", words: ["Ultimately,", "To sum up,", "In conclusion,"] }
                        ],
                        FRENCH: [
                          { label: "Contraste", words: ["Néanmoins,", "Pourtant,", "En revanche,"] },
                          { label: "Addition", words: ["De plus,", "En outre,", "Par ailleurs,"] },
                          { label: "Conclusion", words: ["Finalement,", "Pour conclure,"] }
                        ],
                        ARABIC: [
                          { label: "التناقض", words: ["بالمقابل،", "بيد أن،", "من ناحية أخرى،"] },
                          { label: "الإضافة", words: ["علاوة على ذلك،", "كما أن،"] },
                          { label: "الخاتمة", words: ["ختاماً،", "خلاصة القول،"] }
                        ]
                      };
                      const groups = connectorGroups[currentLang as string] || connectorGroups.ENGLISH;

                      return groups.map(group => (
                        <div key={group.label} className="stack" style={{ gap: "10px" }}>
                          <span style={{ fontSize: "11px", fontWeight: 800, opacity: 0.6, textTransform: "uppercase", letterSpacing: "1px" }}>{group.label}</span>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {group.words.map((w: string) => (
                              <button 
                                key={w} 
                                onClick={() => appendConnector(w)} 
                                className="pill micro-bounce" 
                                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", fontSize: "13px" }}
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
            </aside>
          </div>
        </div>
      </section>

      {result ? (
        <section className="result-panel stack" style={{ gap: "32px", animation: "slideUp 0.6s ease-out", marginTop: "40px" }}>
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
            </div>
            
            <div style={{ marginTop: "24px", padding: "30px", background: "rgba(0,0,0,0.4)", borderRadius: "16px", border: "1px solid var(--glass-border)", fontSize: "1.15rem" }}>
              <AIHighlightDiff original={sourceTextForResult} corrected={result.correctedText} />
            </div>

            <AIExplanationCard explanations={result.explanations} />

            <CorrectionFeedback submissionId={result.submissionId} />
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

          {nextAction ? (
            <div className="card stack" style={{ padding: "40px", border: "2px solid var(--primary-glow)", background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15), transparent)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, right: 0, width: "150px", height: "150px", background: "radial-gradient(circle, rgba(99,102,241,0.2), transparent)", borderRadius: "50%", transform: "translate(40%, -40%)" }} />
              
              <div className="row-between" style={{ marginBottom: "20px", position: "relative", zIndex: 1 }}>
                <span className="eyebrow" style={{ color: "var(--primary)" }}>🎯 Your Next Best Action</span>
              </div>

              <div style={{ position: "relative", zIndex: 1 }}>
                <h3 className="section-title" style={{ fontSize: "1.8rem", marginBottom: "12px" }}>{nextAction.title}</h3>
                
                <p style={{ fontSize: "15px", opacity: 0.9, lineHeight: 1.6, marginBottom: "24px" }}>
                  {nextAction.reason}
                </p>

                <div className="row-between" style={{ gap: "12px" }}>
                  <Link 
                    href={nextAction.type === "lesson" ? `/lessons/${nextAction.slug}` :
                          nextAction.type === "grammar_rule" ? `/lessons/grammar/${nextAction.slug}` :
                          nextAction.type === "vocab_set" ? `/lessons/vocab/${nextAction.slug}` :
                          nextAction.type === "exam" ? `/exams/${nextAction.slug}/mock` :
                          `/daily`}
                    className="button-link"
                    style={{ flex: 1, textAlign: "center", background: "var(--primary)", fontWeight: 700 }}
                  >
                    Start Now →
                  </Link>
                  <Link 
                    href="/dashboard" 
                    className="button-link"
                    style={{ background: "transparent", border: "1px solid var(--glass-border)" }}
                  >
                    Go to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
