"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SiteLanguage, translations } from "@/lib/translations";
import type { NextAction } from "@/lib/recommendations";
import {
  DIAGNOSTIC_STORAGE_KEY,
  buildRoadmapSteps,
  createEmptySnapshot,
  getLanguageFocusMessage,
  getLevelProgressValue,
  getRoadmapTone,
  getSectionRoadmapMessage,
  languageLabelMap,
  supportedDiagnosticLanguages,
  type DiagnosticLanguageResult,
  type StoredDiagnosticSnapshot
} from "@/lib/language-roadmap";
import type { CurriculumLanguageCode } from "@/lib/language-system";

export function DailyStreakWidget() {
  const [streakDays, setStreakDays] = useState(0);

  useEffect(() => {
    // Simulated streak calculation
    setStreakDays(12);
  }, []);

  return (
    <div className="card row-between" style={{ padding: "24px", background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1), transparent)", border: "1px solid rgba(239, 68, 68, 0.3)", marginBottom: "32px", borderRadius: "16px", animation: "slideUp 0.5s ease" }}>
      <div className="stack" style={{ gap: "8px" }}>
        <h3 className="eyebrow" style={{ color: "#ef4444", fontSize: "14px", margin: 0 }}>🔥 DAILY STREAK</h3>
        <span style={{ fontSize: "13px", opacity: 0.8 }}>You are crushing it! Complete a lesson today to keep it going.</span>
      </div>
      <div style={{ fontSize: "3rem", fontWeight: 900, color: "#ef4444", textShadow: "0 0 20px rgba(239, 68, 68, 0.5)" }}>
        {streakDays} <span style={{ fontSize: "1rem", opacity: 0.7 }}>days</span>
      </div>
    </div>
  );
}

export function SmartStudyPlanner({ lang }: { lang: SiteLanguage }) {
  const t = translations[lang] || translations.en;

  return (
    <div className="card stack" style={{ padding: "32px", background: "linear-gradient(135deg, rgba(16, 185, 129, 0.05), transparent)", border: "1px solid var(--success-glow)", marginTop: "24px" }}>
      <div className="row-between" style={{ marginBottom: "16px" }}>
        <span className="eyebrow" style={{ color: "var(--success)" }}>🧠 SMART STUDY PLANNER</span>
      </div>
      <div className="stack" style={{ gap: "4px" }}>
        <h3 style={{ fontSize: "1.8rem", fontWeight: 900 }}>Review Inference Rules</h3>
        <p className="muted" style={{ fontSize: "12px", lineHeight: 1.5 }}>
          Based on your latest exam, you struggled with &quot;skimming and inference&quot;. We recommend a focused 15-minute review session.
        </p>
      </div>
      <Link href="/strategy" className="button-link" style={{ marginTop: "24px", justifyContent: "center", background: "rgba(16, 185, 129, 0.1)", border: "1px solid var(--success)", color: "white" }}>
        Start 15 Min Review
      </Link>
    </div>
  );
}

export function AdminAccessButton() {
  const router = useRouter();

  function handleClick() {
    const code = window.prompt("Enter Admin Verification Code:");
    if (code === "fubisra06") {
      document.cookie = "admin_pass=fubisra06; path=/; max-age=86400;";
      router.push("/admin");
    } else if (code !== null) {
      alert("Unauthorized Access.");
    }
  }

  return (
    <button onClick={handleClick} className="nav-link" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", borderRadius: "16px", opacity: 0.6, background: "transparent", border: "none", color: "white", cursor: "pointer", width: "100%", textAlign: "left", fontFamily: "inherit" }}>
      <span style={{ fontSize: "1.2rem" }}>⚙️</span>
      <span style={{ fontSize: "1rem", fontWeight: 600 }}>Social Studio</span>
    </button>
  );
}

export function OverallProgress() {
  return (
    <div className="real-glass stack" style={{ padding: "32px", height: "100%", background: "rgba(10,10,20,0.6)" }}>
      <div className="row-between" style={{ marginBottom: "16px" }}>
        <h3 className="eyebrow" style={{ margin: 0, fontSize: "12px" }}>OVERALL PROGRESS</h3>
        <span style={{ fontSize: "1rem", opacity: 0.3 }}>...</span>
      </div>

      <div className="row-between" style={{ gap: "32px", marginBottom: "32px" }}>
        <div className="chart-ring" style={{ "--progress": 78 } as CSSProperties}>
          <div className="chart-ring-text">78%</div>
        </div>
        <div className="stack" style={{ flex: 1, gap: "10px" }}>
          {["A", "B", "C", "D"].map((label, index) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "10px", width: "12px", opacity: 0.5, fontWeight: 700 }}>{label}</span>
              <div style={{ height: "6px", flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: "10px" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${90 - index * 15}%`,
                    background: "linear-gradient(to right, var(--primary), var(--accent))",
                    borderRadius: "inherit"
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="stack" style={{ gap: "12px" }}>
        <div className="row-between">
          <span style={{ fontWeight: 800, fontSize: "12px", opacity: 0.7 }}>STUDY HOURS</span>
          <span style={{ fontSize: "10px", color: "var(--success)", fontWeight: 800 }}>TREND</span>
        </div>
        <svg width="100%" height="50" viewBox="0 0 100 40" preserveAspectRatio="none">
          <path d="M0,35 Q10,15 20,30 T40,15 T60,35 T80,10 L100,5" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
          <path d="M0,35 Q10,15 20,30 T40,15 T60,35 T80,10 L100,5 L100,40 L0,40 Z" fill="rgba(99,102,241,0.05)" />
        </svg>
        <div className="row-between" style={{ fontSize: "10px", opacity: 0.2, fontWeight: 700 }}>
          <span>0</span><span>6</span><span>12</span><span>18</span><span>24</span>
        </div>
      </div>
    </div>
  );
}

export function GradePredictions() {
  return (
    <div className="real-glass stack" style={{ padding: "32px", height: "100%", background: "rgba(10,10,20,0.6)" }}>
      <div className="row-between" style={{ marginBottom: "16px" }}>
        <h3 className="eyebrow" style={{ margin: 0, fontSize: "12px" }}>GRADE PREDICTIONS</h3>
        <span style={{ fontSize: "1rem", opacity: 0.3 }}>...</span>
      </div>

      <div style={{ padding: "24px", background: "rgba(245, 158, 11, 0.05)", borderRadius: "20px", border: "1px solid rgba(245, 158, 11, 0.2)", textAlign: "center", marginBottom: "32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: 0, padding: "8px 12px", background: "rgba(245,158,11,0.1)", fontSize: "10px", fontWeight: 800 }}>TARGET: 19.0</div>
        <div style={{ fontSize: "3.5rem", fontWeight: 900, fontFamily: "var(--font-display)", color: "var(--accent)", textShadow: "0 0 40px rgba(245, 158, 11, 0.3)" }}>
          17.5<span style={{ fontSize: "1.2rem", opacity: 0.5 }}>/20</span>
        </div>
      </div>

      <div className="grid grid-cols-3" style={{ gap: "10px" }}>
        {[
          { label: "Mat", score: 18.1, color: "var(--primary)" },
          { label: "His", score: 16.8, color: "var(--accent)" },
          { label: "Sci", score: 17.0, color: "var(--success)" }
        ].map((subject) => (
          <div key={subject.label} className="stack" style={{ alignItems: "center", gap: "8px" }}>
            <div style={{ width: "100%", height: "60px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", position: "relative", display: "flex", alignItems: "flex-end", padding: "4px" }}>
              <div style={{ width: "100%", height: `${(subject.score / 20) * 100}%`, background: `linear-gradient(to top, ${subject.color}, transparent)`, borderRadius: "6px" }} />
              <div style={{ position: "absolute", top: "10px", left: 0, right: 0, textAlign: "center", fontWeight: 900, fontSize: "10px" }}>{subject.score}</div>
            </div>
            <span className="muted" style={{ fontSize: "9px", fontWeight: 800 }}>{subject.label.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

type LanguageModulesProps = {
  activeLanguages: string[];
  sectionLabel: string | null;
  targetScore: number;
};

const moduleColors: Record<CurriculumLanguageCode, [string, string]> = {
  ENGLISH: ["#3b82f6", "#10b981"],
  FRENCH: ["#f59e0b", "#ef4444"],
  ARABIC: ["#059669", "#10b981"],
  SPANISH: ["#ef4444", "#f59e0b"],
  GERMAN: ["#111827", "#dc2626"],
  ITALIAN: ["#22c55e", "#ef4444"]
};

export function LanguageModules({ activeLanguages, sectionLabel, targetScore }: LanguageModulesProps) {
  const [snapshot, setSnapshot] = useState<StoredDiagnosticSnapshot>(createEmptySnapshot());

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DIAGNOSTIC_STORAGE_KEY);
      if (!raw) return;
      setSnapshot(JSON.parse(raw) as StoredDiagnosticSnapshot);
    } catch {
      setSnapshot(createEmptySnapshot());
    }
  }, []);

  const filteredLanguages = activeLanguages.filter((language): language is CurriculumLanguageCode =>
    supportedDiagnosticLanguages.includes(language as CurriculumLanguageCode)
  );

  return (
    <div className="stack" style={{ gap: "18px", marginTop: "24px" }}>
      <p className="muted" style={{ margin: 0, maxWidth: "760px" }}>
        {getSectionRoadmapMessage(sectionLabel)} {getRoadmapTone(targetScore)}
      </p>

      <div className="grid grid-cols-3" style={{ gap: "24px" }}>
        {filteredLanguages.map((language) => {
          const result = snapshot.results[language] as DiagnosticLanguageResult | undefined;
          const nextStep = result ? buildRoadmapSteps(language, result, 1)[0] : null;
          const colors = moduleColors[language];

          return (
            <div key={language} className="lang-card" style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}>
              <div className="lang-card-bg" style={{ background: "rgba(0,0,0,0.4)" }} />
              <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
                <div className="row-between" style={{ marginBottom: "8px" }}>
                  <strong style={{ fontSize: "1.4rem", letterSpacing: "1.5px", fontWeight: 900 }}>{language}</strong>
                  <span style={{ fontSize: "10px", fontWeight: 900, background: "rgba(0,0,0,0.3)", padding: "4px 8px", borderRadius: "100px" }}>
                    {result?.level ?? "Take diagnostic"}
                  </span>
                </div>

                <h4 style={{ fontSize: "1rem", fontWeight: 400, opacity: 0.9, marginBottom: "16px", fontStyle: "italic" }}>
                  {languageLabelMap[language]}
                </h4>

                <div className="stack" style={{ gap: "6px" }}>
                  <div className="row-between" style={{ fontSize: "11px", fontWeight: 800, opacity: 0.9 }}>
                    <span>{result ? "Level progress" : "Roadmap status"}</span>
                    <span>{result ? `${getLevelProgressValue(result.level)}%` : "Start"}</span>
                  </div>
                  <div style={{ height: "4px", background: "rgba(0,0,0,0.2)", borderRadius: "10px" }}>
                    <div style={{ height: "100%", width: `${result ? getLevelProgressValue(result.level) : 12}%`, background: "white", borderRadius: "inherit", boxShadow: "0 0 10px white" }} />
                  </div>
                </div>

                <p style={{ marginTop: "16px", minHeight: "44px", fontSize: "12px", opacity: 0.92 }}>
                  {result ? getLanguageFocusMessage(language, result) : "No diagnostic yet. Start here to get the right level and first lesson."}
                </p>

                <div className="stack" style={{ gap: "10px", marginTop: "10px" }}>
                  {nextStep ? (
                    <div style={{ fontSize: "12px", opacity: 0.9 }}>
                      <strong>Next:</strong> {nextStep.title}
                    </div>
                  ) : null}
                  <Link
                    href={`/diagnostic?language=${language}`}
                    className="button-link"
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      background: "rgba(255,255,255,0.16)",
                      border: "1px solid rgba(255,255,255,0.2)"
                    }}
                  >
                    {result ? "Refresh roadmap" : "Take diagnostic"}
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function HighYieldTopics({ lang }: { lang: SiteLanguage }) {
  const t = translations[lang] || translations.en;
  const topics = [
    { title: lang === "ar" ? "الابداع والابتكار" : (lang === "fr" ? "Creativite et innovation" : "Creativity and Innovation"), coef: "Core", skill: "English" },
    { title: lang === "ar" ? "Connecteurs logiques" : (lang === "fr" ? "Connecteurs logiques" : "Connectors"), coef: "Essay", skill: "Writing" },
    { title: lang === "ar" ? "Lecture rapide et inference" : (lang === "fr" ? "Lecture rapide et inference" : "Skimming and inference"), coef: "Exam", skill: "Reading" }
  ];

  return (
    <div className="real-glass stack" style={{ padding: "32px", height: "100%", background: "rgba(10,10,20,0.6)" }}>
      <div className="row-between" style={{ marginBottom: "16px" }}>
        <h3 className="eyebrow" style={{ margin: 0, fontSize: "12px" }}>HIGH-YIELD TOPICS</h3>
      </div>

      <div className="stack" style={{ gap: "12px" }}>
        {topics.map((item) => (
          <div key={item.title} className="row-between" style={{ padding: "16px", background: "rgba(99,102,241,0.05)", borderRadius: "16px", border: "1px solid var(--primary-glow)" }}>
            <div className="stack" style={{ gap: "4px" }}>
              <span style={{ fontSize: "10px", fontWeight: 900, color: "var(--primary)" }}>{item.skill.toUpperCase()}</span>
              <strong style={{ fontSize: "14px" }}>{item.title}</strong>
            </div>
            <div className="pill" style={{ fontSize: "10px", background: "rgba(255,255,255,0.05)", color: "white" }}>
              {item.coef}
            </div>
          </div>
        ))}
      </div>

      <Link href="/diagnostic" className="button-link button-secondary" style={{ marginTop: "16px", width: "100%", justifyContent: "center", fontSize: "12px" }}>
        {lang === "ar" ? "ابدأ التشخيص" : (lang === "fr" ? "Lancer le diagnostic" : "Start diagnostic")}
      </Link>
    </div>
  );
}

export function WordOfTheDay({ lang }: { lang: SiteLanguage }) {
  const dictionary = {
    en: { word: "Paradigm", meaning: "A typical example or pattern of something.", example: "The shift to AI is a new paradigm in Bac preparation." },
    fr: { word: "Ephemere", meaning: "Qui ne dure que peu de temps.", example: "La gloire est souvent ephemere." },
    ar: { word: "جوهري", meaning: "اساسي او حقيقي.", example: "التعليم عنصر جوهري في بناء المستقبل." }
  };

  const data = dictionary[lang];

  return (
    <div className="card stack" style={{ padding: "32px", background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1), transparent)", border: "1px solid var(--accent-glow)", marginTop: "24px" }}>
      <span className="eyebrow" style={{ color: "var(--accent)" }}>WORD OF THE DAY</span>
      <div className="stack" style={{ gap: "4px" }}>
        <h3 style={{ fontSize: "2rem", fontWeight: 900 }}>{data.word}</h3>
        <p className="muted" style={{ fontSize: "12px" }}>{data.meaning}</p>
      </div>
      <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "12px", fontStyle: "italic", fontSize: "14px", borderLeft: "4px solid var(--accent)" }}>
        &quot;{data.example}&quot;
      </div>
    </div>
  );
}

export function NextBestActionCard() {
  const [action, setAction] = useState<NextAction | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/recommendations")
      .then(res => res.json())
      .then(data => {
        setAction(data.action);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="card stack" style={{ padding: "32px", background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1), transparent)", border: "1px solid var(--primary-glow)", marginBottom: "24px" }}>
        <span className="eyebrow" style={{ color: "var(--primary)" }}>🎯 NEXT BEST ACTION</span>
        <div style={{ opacity: 0.5 }}>Loading your personalized path...</div>
      </div>
    );
  }

  if (!action) {
    return (
      <div className="card stack" style={{ padding: "32px", background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1), transparent)", border: "1px solid var(--primary-glow)", marginBottom: "24px" }}>
        <span className="eyebrow" style={{ color: "var(--primary)" }}>🎯 NEXT BEST ACTION</span>
        <p className="muted">Complete a writing submission to get AI-powered recommendations tailored to your weaknesses.</p>
        <Link href="/write" className="button-link" style={{ marginTop: "16px" }}>
          Start Writing →
        </Link>
      </div>
    );
  }

  const typeLabels: Record<string, string> = {
    lesson: "📚 Lesson",
    exercise: "✏️ Exercise",
    exam: "📝 Practice Exam",
    grammar_rule: "🔤 Grammar Rule",
    vocab_set: "📖 Vocabulary Set"
  };

  const href = action.type === "lesson" ? `/lessons/${action.slug}` :
               action.type === "grammar_rule" ? `/lessons/grammar/${action.slug}` :
               action.type === "vocab_set" ? `/lessons/vocab/${action.slug}` :
               action.type === "exam" ? `/exams/${action.slug}/mock` :
               `/daily`;

  return (
    <div className="card stack" style={{ padding: "32px", background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15), transparent)", border: "2px solid var(--primary-glow)", marginBottom: "24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: "100px", height: "100px", background: "radial-gradient(circle, rgba(99,102,241,0.3), transparent)", borderRadius: "50%", transform: "translate(30%, -30%)" }} />
      
      <div className="row-between" style={{ marginBottom: "16px", position: "relative", zIndex: 1 }}>
        <span className="eyebrow" style={{ color: "var(--primary)" }}>🎯 NEXT BEST ACTION</span>
        <span className="pill" style={{ background: action.priority > 80 ? "#ef4444" : "var(--primary)", color: "white", fontSize: "11px" }}>
          Priority {action.priority}
        </span>
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <span style={{ fontSize: "12px", opacity: 0.7, textTransform: "uppercase", letterSpacing: "1px" }}>
          {typeLabels[action.type]} • {action.estimatedMinutes} min • +{action.xpReward} XP
        </span>
        
        <h3 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "12px 0" }}>{action.title}</h3>
        
        <p style={{ fontSize: "14px", opacity: 0.9, lineHeight: 1.6, marginBottom: "20px" }}>
          {action.reason}
        </p>

        <div className="row-between" style={{ gap: "12px" }}>
          <Link 
            href={href} 
            className="button-link"
            style={{ flex: 1, textAlign: "center", background: "var(--primary)", fontWeight: 700 }}
          >
            Start Now →
          </Link>
          <Link 
            href="/lessons" 
            className="button-link"
            style={{ background: "transparent", border: "1px solid var(--glass-border)" }}
          >
            Browse All
          </Link>
        </div>
      </div>
    </div>
  );
}
