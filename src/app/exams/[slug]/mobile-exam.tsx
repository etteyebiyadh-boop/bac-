"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRightIcon, 
  ClockIcon, 
  TargetIcon, 
  FireIcon, 
  LessonsIcon, 
  BookIcon,
  WriteIcon 
} from "@/components/icons";
import { SiteLanguage, translations } from "@/lib/translations";
import { AIHighlightDiff, AIExplanationCard } from "@/components/ai-correction-view";
import { CorrectionFeedback } from "@/components/correction-feedback";
import { MAX_ESSAY_CHARS, MIN_ESSAY_CHARS } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";

type ExamOption = {
  id: string;
  year: number;
  title: string;
  prompt: string;
  methodology: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  estimatedMinutes: number;
  language: string;
  slug: string;
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
  submissionId: string;
};

interface MobileExamProps {
  exam: ExamOption;
  lang: SiteLanguage;
  bacSection: string | null;
  scanAvailable: boolean;
}

export function MobileExam({ exam, lang, bacSection, scanAvailable }: MobileExamProps) {
  const t = translations[lang];
  const [studentText, setStudentText] = useState("");
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CorrectionResult | null>(null);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  
  const [submissionMode, setSubmissionMode] = useState<"text" | "scan">("text");
  const [scanFile, setScanFile] = useState<File | null>(null);
  const [scanText, setScanText] = useState("");
  const [scanPreviewUrl, setScanPreviewUrl] = useState("");
  const [isExtractingScan, setIsExtractingScan] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const wordCount = submissionMode === "scan" 
    ? (scanText.trim().length === 0 ? 0 : scanText.trim().split(/\s+/).length)
    : (studentText.trim().length === 0 ? 0 : studentText.trim().split(/\s+/).length);
    
  const canSubmit = submissionMode === "scan" 
    ? scanText.trim().length >= MIN_ESSAY_CHARS 
    : studentText.trim().length >= MIN_ESSAY_CHARS;

  function startFocusMode() {
    setTimeLeft(exam.estimatedMinutes * 60);
    setStudentText("");
    setIsFocusMode(true);
  }

  async function extractScanText() {
    if (!scanFile) return;
    setIsExtractingScan(true);
    setError("");

    const formData = new FormData();
    formData.set("action", "extract_text");
    formData.set("language", exam.language);
    formData.set("workImage", scanFile);

    try {
      const response = await fetch("/api/correct", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setIsExtractingScan(false);
      if (!response.ok) {
        setError(data.error || "Scan failed.");
        return;
      }
      setScanText(data.extractedText || "");
      setIsFocusMode(true); // Jump into focus mode but with the extracted text
    } catch (e) {
      setIsExtractingScan(false);
      setError("Scan error. Try again.");
    }
  }

  async function submitEssay() {
    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/correct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: exam.id,
          promptText: exam.prompt,
          studentText: submissionMode === "scan" ? scanText : studentText,
          language: exam.language,
          bacSection: bacSection,
          sourceMode: submissionMode
        })
      });

      const data = await response.json();
      setIsLoading(false);

      if (!response.ok) {
        setError(data.error || "Submission failed. Please try again.");
        return;
      }

      setResult(data);
      setIsFocusMode(false);
    } catch (e) {
      setIsLoading(false);
      setError("An error occurred. Check your connection.");
    }
  }

  const appendConnector = (connector: string) => {
    const targetSet = submissionMode === "scan" ? setScanText : setStudentText;
    targetSet(prev => {
      const space = prev && !prev.endsWith(" ") ? " " : "";
      return prev + space + connector + " ";
    });
    setShowCheatSheet(false);
    textareaRef.current?.focus();
  };

  const connectorGroups = {
    ENGLISH: [
      { label: "Connect", words: ["Moreover,", "Furthermore,", "In addition,"] },
      { label: "Contrast", words: ["However,", "Nevertheless,", "On the other hand,"] },
      { label: "Result", words: ["Therefore,", "Consequently,", "As a result,"] },
    ],
    // Add more languages as needed
  };

  const currentConnectors = connectorGroups[exam.language as keyof typeof connectorGroups] || connectorGroups.ENGLISH;

  return (
    <div className="mobile-exam-container" style={{ minHeight: "100vh", position: "relative" }}>
      <AnimatePresence mode="wait">
        {!isFocusMode && !result && (
          <motion.div 
            key="hero"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="stack"
            style={{ padding: "80px 20px 40px" }}
          >
            <div className="card real-glass" style={{ padding: "32px", border: "1px solid var(--primary-glow)" }}>
              <div 
                style={{ 
                  position: "absolute", 
                  top: "-50%", right: "-30%", 
                  width: "300px", height: "300px", 
                  background: "radial-gradient(circle, var(--primary-glow) 0%, transparent 70%)", 
                  zIndex: 0 
                }} 
              />
              
              <div className="stack" style={{ position: "relative", zIndex: 1, gap: "12px" }}>
                <span className="pill" style={{ width: "fit-content" }}>{exam.year} - {exam.language}</span>
                <h1 className="section-title" style={{ fontSize: "2.2rem", color: "white" }}>{exam.title}</h1>
                <p className="muted" style={{ fontSize: "1rem", lineHeight: 1.5 }}>{exam.methodology}</p>
                
                <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                   <button 
                     onClick={() => setSubmissionMode("text")}
                     className={`pill micro-bounce ${submissionMode === "text" ? "active" : ""}`}
                     style={{ 
                        flex: 1, 
                        background: submissionMode === "text" ? "var(--primary)" : "rgba(255,255,255,0.05)",
                        color: "white",
                        border: "none"
                     }}
                   >
                     Type Text
                   </button>
                   <button 
                     onClick={() => setSubmissionMode("scan")}
                     disabled={!scanAvailable}
                     className={`pill micro-bounce ${submissionMode === "scan" ? "active" : ""}`}
                     style={{ 
                        flex: 1, 
                        background: submissionMode === "scan" ? "var(--accent)" : "rgba(255,255,255,0.05)",
                        color: "white",
                        border: "none",
                        opacity: scanAvailable ? 1 : 0.5
                     }}
                   >
                     Scan Work
                   </button>
                </div>

                {submissionMode === "text" ? (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={startFocusMode}
                    className="button-link hover-glow"
                    style={{ 
                      background: "var(--primary)", 
                      color: "white", 
                      width: "100%", 
                      justifyContent: "center",
                      marginTop: "20px",
                      padding: "20px",
                      fontSize: "1.1rem",
                      boxShadow: "0 10px 30px var(--primary-glow)"
                    }}
                  >
                    <ClockIcon /> Start Mock Exam
                  </motion.button>
                ) : (
                  <div className="stack" style={{ marginTop: "20px", gap: "16px" }}>
                    <div 
                      className="card-neon" 
                      style={{ 
                        padding: "24px", 
                        border: "1px dashed var(--accent)", 
                        background: "rgba(245, 158, 11, 0.05)",
                        textAlign: "center"
                      }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => setScanFile(e.target.files?.[0] || null)}
                        style={{ display: "none" }}
                        id="mobile-scan-input"
                      />
                      <label htmlFor="mobile-scan-input" style={{ cursor: "pointer" }}>
                        <div style={{ fontSize: "2rem", marginBottom: "10px" }}>📸</div>
                        <strong>Take Photo of Work</strong>
                        <p className="muted" style={{ fontSize: "11px", marginTop: "4px" }}>Close-up, flat page, good light</p>
                      </label>
                    </div>

                    {scanFile && (
                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                        <div style={{ position: "relative", width: "100%", height: "200px", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--glass-border)" }}>
                          <Image src={scanPreviewUrl} alt="Scan" fill style={{ objectFit: "cover" }} />
                        </div>
                        <button 
                          onClick={extractScanText}
                          disabled={isExtractingScan}
                          className="button-link" 
                          style={{ width: "100%", marginTop: "12px", background: "var(--accent)", color: "black", justifyContent: "center" }}
                        >
                          {isExtractingScan ? "AI Scanning..." : "Ready to Extract Text"}
                        </button>
                      </motion.div>
                    )}
                  </div>
                )}

                <p className="muted" style={{ textAlign: "center", fontSize: "12px" }}>
                  Focus mode disables copy-paste and tracks time.
                </p>
              </div>
            </div>

            <div className="card" style={{ padding: "24px" }}>
              <h3 className="section-title" style={{ fontSize: "1.2rem", marginBottom: "16px" }}>The Prompt</h3>
              <p style={{ opacity: 0.9, lineHeight: 1.6 }}>{exam.prompt}</p>
            </div>
            {error && <p className="error-text" style={{ textAlign: "center" }}>{error}</p>}
          </motion.div>
        )}

        {isFocusMode && (
          <motion.div 
            key="focus"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: "fixed", 
              inset: 0, 
              zIndex: 2000, 
              background: "#000", 
              padding: "env(safe-area-inset-top) 16px env(safe-area-inset-bottom)",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div className="row-between" style={{ padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
               <div className="stack" style={{ gap: "2px" }}>
                 <span className="eyebrow" style={{ color: "var(--accent)" }}>{submissionMode === "scan" ? "AI SCAN REVIEW" : "FOCUS MODE"}</span>
                 <span style={{ fontWeight: 700, fontSize: "14px" }}>{exam.title}</span>
               </div>
               <div style={{ fontFamily: "monospace", fontSize: "1.5rem", fontWeight: 900, color: timeLeft < 300 ? "var(--error)" : "var(--primary)" }}>
                 {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
               </div>
               <button 
                 onClick={() => setIsFocusMode(false)}
                 style={{ background: "transparent", border: "none", color: "var(--error)", fontSize: "12px", fontWeight: 700 }}
               >
                 ABORT
               </button>
            </div>

            <div style={{ 
              height: "4px", 
              width: "100%", 
              background: "rgba(255,255,255,0.05)", 
              borderRadius: "100px",
              marginTop: "8px",
              overflow: "hidden"
            }}>
              <motion.div 
                style={{ 
                  height: "100%", 
                  background: "var(--primary)", 
                  width: `${(timeLeft / (exam.estimatedMinutes * 60)) * 100}%` 
                }} 
              />
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px", marginTop: "20px" }}>
              <div 
                 className="card" 
                 style={{ 
                   padding: "16px", 
                   background: "rgba(255,255,255,0.03)", 
                   maxHeight: "120px", 
                   overflowY: "auto",
                   fontSize: "14px"
                 }}
              >
                <strong style={{ display: "block", marginBottom: "4px", color: "var(--primary)" }}>PROMPT</strong>
                {exam.prompt}
              </div>

              <textarea
                ref={textareaRef}
                autoFocus
                value={submissionMode === "scan" ? scanText : studentText}
                onChange={(e) => {
                  const val = e.target.value.slice(0, MAX_ESSAY_CHARS);
                  if (submissionMode === "scan") setScanText(val);
                  else setStudentText(val);
                }}
                placeholder={submissionMode === "scan" ? "Correct OCR mistakes here..." : "Type your essay here..."}
                style={{ 
                  flex: 1, 
                  background: "transparent", 
                  border: "none", 
                  color: "white", 
                  fontSize: "1.1rem", 
                  lineHeight: 1.6, 
                  resize: "none", 
                  outline: "none",
                  padding: "0 0 100px"
                }}
                onPaste={(e) => e.preventDefault()}
              />
            </div>

            {/* Bottom Floating Bar */}
            <div style={{ 
              position: "fixed", 
              bottom: 0, 
              left: 0, 
              right: 0, 
              padding: "20px", 
              background: "linear-gradient(transparent, #000 40%)",
              zIndex: 2001
            }}>
              <div className="row-between" style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button 
                    onClick={() => setShowCheatSheet(!showCheatSheet)}
                    className="pill micro-bounce" 
                    style={{ background: "var(--accent)", color: "black", border: "none" }}
                  >
                    💡 CONNECTORS
                  </button>
                  <span className="muted" style={{ fontSize: "12px", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "100px", padding: "6px 12px" }}>
                    {wordCount} words
                  </span>
                </div>
                
                <button
                  disabled={isLoading || !canSubmit}
                  onClick={submitEssay}
                  className="button-link hover-glow"
                  style={{ 
                    background: "var(--primary)", 
                    color: "white", 
                    padding: "12px 24px" 
                  }}
                >
                  {isLoading ? "Grading..." : "Submit"}
                </button>
              </div>
            </div>

            {/* Cheat Sheet Drawer */}
            <AnimatePresence>
              {showCheatSheet && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowCheatSheet(false)}
                    style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 2002 }}
                  />
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    style={{ 
                      position: "fixed", 
                      bottom: 0, 
                      left: 0, 
                      right: 0, 
                      background: "#0a0a0f", 
                      borderTop: "1px solid var(--glass-border)", 
                      borderTopLeftRadius: "24px", 
                      borderTopRightRadius: "24px", 
                      padding: "32px 20px 48px", 
                      zIndex: 2003,
                      boxShadow: "0 -20px 50px rgba(0,0,0,0.5)"
                    }}
                  >
                    <div style={{ width: "40px", height: "4px", background: "rgba(255,255,255,0.2)", borderRadius: "2px", margin: "0 auto 24px" }} />
                    <h3 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "20px" }}>Excellence Connectors</h3>
                    <div className="stack" style={{ gap: "24px" }}>
                      {currentConnectors.map(group => (
                        <div key={group.label}>
                          <div style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 800, marginBottom: "12px", textTransform: "uppercase" }}>{group.label}</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {group.words.map(word => (
                              <button
                                key={word}
                                onClick={() => appendConnector(word)}
                                style={{ 
                                  padding: "10px 18px", 
                                  background: "rgba(255,255,255,0.05)", 
                                  border: "1px solid rgba(255,255,255,0.1)", 
                                  color: "white", 
                                  borderRadius: "100px", 
                                  fontSize: "14px" 
                                }}
                              >
                                {word}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {result && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="stack"
            style={{ padding: "80px 20px 120px" }}
          >
            <div className="card real-glass" style={{ textAlign: "center", padding: "48px 32px", border: "1px solid var(--success-glow)" }}>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                style={{ 
                  width: "120px", 
                  height: "120px", 
                  borderRadius: "50%", 
                  background: "linear-gradient(135deg, var(--primary), #a855f7)", 
                  margin: "0 auto 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 40px var(--primary-glow)"
                }}
              >
                <div style={{ fontSize: "3rem", fontWeight: 900 }}>{result.overallScore.toFixed(1)}</div>
              </motion.div>
              
              <h2 className="section-title" style={{ fontSize: "2rem" }}>Official Score</h2>
              <p className="muted" style={{ marginTop: "12px" }}>{result.summary}</p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginTop: "32px" }}>
                <div className="stack" style={{ gap: "8px" }}>
                  <div style={{ fontWeight: 800, color: "var(--primary)" }}>{result.grammarScore}</div>
                  <div style={{ fontSize: "10px", color: "var(--ink-dim)" }}>GRAMMAR</div>
                </div>
                <div className="stack" style={{ gap: "8px" }}>
                  <div style={{ fontWeight: 800, color: "var(--accent)" }}>{result.vocabularyScore}</div>
                  <div style={{ fontSize: "10px", color: "var(--ink-dim)" }}>VOCAB</div>
                </div>
                <div className="stack" style={{ gap: "8px" }}>
                  <div style={{ fontWeight: 800, color: "var(--success)" }}>{result.structureScore}</div>
                  <div style={{ fontSize: "10px", color: "var(--ink-dim)" }}>STRUCTURE</div>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: "32px" }}>
              <h3 className="section-title" style={{ fontSize: "1.5rem", marginBottom: "20px" }}>Precision Grading</h3>
              <div style={{ background: "rgba(0,0,0,0.3)", padding: "20px", borderRadius: "16px", border: "1px solid var(--glass-border)", fontSize: "1.1rem", lineHeight: 1.6 }}>
                <AIHighlightDiff original={result.sourceText || (submissionMode === "scan" ? scanText : studentText)} corrected={result.correctedText} />
              </div>
              <AIExplanationCard explanations={result.explanations} />
            </div>

            <div className="grid grid-cols-1" style={{ gap: "16px" }}>
              <div className="card" style={{ border: "1px solid rgba(16, 185, 129, 0.2)", padding: "24px" }}>
                <h4 style={{ color: "var(--success)", fontWeight: 800, marginBottom: "12px" }}>✅ STRENGTHS</h4>
                <ul className="stack" style={{ gap: "8px", listStyle: "none" }}>
                  {result.strengths.map(s => <li key={s} style={{ fontSize: "14px", opacity: 0.9 }}>• {s}</li>)}
                </ul>
              </div>
              <div className="card" style={{ border: "1px solid rgba(239, 68, 68, 0.2)", padding: "24px" }}>
                <h4 style={{ color: "var(--error)", fontWeight: 800, marginBottom: "12px" }}>🚀 IMPROVEMENTS</h4>
                <ul className="stack" style={{ gap: "8px", listStyle: "none" }}>
                  {result.improvements.map(i => <li key={i} style={{ fontSize: "14px", opacity: 0.9 }}>• {i}</li>)}
                </ul>
              </div>
            </div>

            {result.recommendedLesson && (
              <div className="card real-glass" style={{ border: "1px solid var(--accent-glow)", padding: "32px" }}>
                <span className="eyebrow" style={{ color: "var(--accent)" }}>RECOMMENDED FOR YOU</span>
                <h3 className="section-title" style={{ fontSize: "1.8rem", margin: "8px 0" }}>{result.recommendedLesson.title}</h3>
                <p className="muted" style={{ marginBottom: "24px" }}>{result.recommendedLesson.summary}</p>
                <Link href={`/lessons/${result.recommendedLesson.slug}`} className="button-link" style={{ width: "100%", justifyContent: "center", background: "var(--accent)", color: "black" }}>
                  Start targeted lesson
                </Link>
              </div>
            )}

            <button 
              onClick={() => { 
                setResult(null); 
                setStudentText(""); 
                setScanText("");
                setScanFile(null);
                setSubmissionMode("text");
              }} 
              className="button-link button-secondary" 
              style={{ width: "100%", justifyContent: "center" }}
            >
              Try another exam
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
