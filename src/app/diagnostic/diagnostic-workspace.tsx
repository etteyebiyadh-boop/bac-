"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteLanguage } from "@/lib/translations";
import {
  DIAGNOSTIC_STORAGE_KEY,
  buildDiagnosticReview,
  buildRoadmapSteps,
  createEmptySnapshot,
  getDiagnosticTrack,
  getLanguageFocusMessage,
  getLevelProgressValue,
  getRoadmapTone,
  getSectionRoadmapMessage,
  languageLabelMap,
  scoreDiagnostic,
  type DiagnosticLanguageResult,
  type StoredDiagnosticSnapshot
} from "@/lib/language-roadmap";
import { skillLabels, type CurriculumLanguageCode } from "@/lib/language-system";

type DiagnosticWorkspaceProps = {
  lang: SiteLanguage;
  initialLanguage: CurriculumLanguageCode;
  sectionLabel: string | null;
  recommendedLanguages: CurriculumLanguageCode[];
};

function labels(lang: SiteLanguage) {
  if (lang === "fr") {
    return {
      title: "Diagnostic des langues",
      subtitle: "Réponds à quelques questions rapides pour recevoir un niveau et une roadmap claire.",
      section: "Section",
      intro: "Choisis une langue, termine le mini-test, puis commence directement les bonnes leçons.",
      question: "Question",
      submit: "Calculer mon niveau",
      changeLanguage: "Changer de langue",
      result: "Résultat",
      strongest: "Point fort",
      weakest: "Point faible",
      roadmap: "Roadmap recommandée",
      review: "Corrigé rapide",
      dashboard: "Ouvrir le tableau de bord",
      retry: "Refaire le diagnostic",
      diagnosticMissing: "Aucun résultat enregistré pour cette langue.",
      startRoadmap: "Commencer cette roadmap",
      library: "Voir la bibliothèque",
      saveNote: "Le résultat est enregistré sur cet appareil pour alimenter ton dashboard."
    };
  }

  if (lang === "ar") {
    return {
      title: "تشخيص اللغات",
      subtitle: "أجب عن أسئلة سريعة لتحصل على مستوى وخارطة طريق واضحة.",
      section: "الشعبة",
      intro: "اختر لغة، أكمل الاختبار الصغير، ثم ابدأ الدروس المناسبة مباشرة.",
      question: "سؤال",
      submit: "احسب مستواي",
      changeLanguage: "غيّر اللغة",
      result: "النتيجة",
      strongest: "نقطة القوة",
      weakest: "نقطة الضعف",
      roadmap: "خارطة الطريق المقترحة",
      review: "تصحيح سريع",
      dashboard: "افتح لوحة التحكم",
      retry: "أعد التشخيص",
      diagnosticMissing: "لا توجد نتيجة محفوظة لهذه اللغة.",
      startRoadmap: "ابدأ هذه الخارطة",
      library: "افتح المكتبة",
      saveNote: "يتم حفظ النتيجة على هذا الجهاز لتظهر في لوحة التحكم."
    };
  }

  return {
    title: "Language Diagnostic",
    subtitle: "Answer a few quick questions to get a level and a clear roadmap.",
    section: "Section",
    intro: "Choose a language, finish the mini test, then jump straight into the right lessons.",
    question: "Question",
    submit: "Calculate my level",
    changeLanguage: "Change language",
    result: "Result",
    strongest: "Strongest skill",
    weakest: "Weakest skill",
    roadmap: "Recommended roadmap",
    review: "Quick review",
    dashboard: "Open dashboard",
    retry: "Retake diagnostic",
    diagnosticMissing: "No saved result for this language yet.",
    startRoadmap: "Start this roadmap",
    library: "Open library",
    saveNote: "The result is saved on this device and used in your dashboard roadmap."
  };
}

export function DiagnosticWorkspace({
  lang,
  initialLanguage,
  sectionLabel,
  recommendedLanguages
}: DiagnosticWorkspaceProps) {
  const copy = labels(lang) || labels("en");
  const [selectedLanguage, setSelectedLanguage] = useState<CurriculumLanguageCode>(initialLanguage);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<DiagnosticLanguageResult | null>(null);
  const [snapshot, setSnapshot] = useState<StoredDiagnosticSnapshot>(createEmptySnapshot());

  const track = getDiagnosticTrack(selectedLanguage);
  const answeredCount = track.questions.filter((question) => answers[question.id]).length;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DIAGNOSTIC_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredDiagnosticSnapshot;
      setSnapshot(parsed);
      if (parsed.results[selectedLanguage]) {
        setResult(parsed.results[selectedLanguage] ?? null);
      }
    } catch {
      setSnapshot(createEmptySnapshot());
    }
  }, [selectedLanguage]);

  function handleChoice(questionId: string, choiceId: string) {
    setAnswers((current) => ({
      ...current,
      [questionId]: choiceId
    }));
  }

  function resetForLanguage(language: CurriculumLanguageCode) {
    setSelectedLanguage(language);
    setAnswers({});
    setResult(snapshot.results[language] ?? null);
  }

  function handleSubmit() {
    const nextResult = scoreDiagnostic(selectedLanguage, answers);
    const nextSnapshot: StoredDiagnosticSnapshot = {
      results: {
        ...snapshot.results,
        [selectedLanguage]: nextResult
      }
    };

    setResult(nextResult);
    setSnapshot(nextSnapshot);

    try {
      window.localStorage.setItem(DIAGNOSTIC_STORAGE_KEY, JSON.stringify(nextSnapshot));
    } catch {}
  }

  const roadmapSteps = result ? buildRoadmapSteps(selectedLanguage, result, 3) : [];
  const savedResult = snapshot.results[selectedLanguage] ?? null;

  return (
    <div className="page-stack" style={{ gap: "32px", direction: lang === "ar" ? "rtl" : "ltr" }}>
      <section className="card stack hero-panel" style={{ padding: "56px", gap: "18px" }}>
        <span className="eyebrow" style={{ color: "var(--primary)" }}>{copy.title}</span>
        <h1 className="section-title" style={{ fontSize: "3rem", lineHeight: 1.05 }}>{copy.title}</h1>
        <p className="muted" style={{ maxWidth: "820px", fontSize: "1.1rem" }}>{copy.subtitle}</p>
        <div className="row-between" style={{ justifyContent: "flex-start", gap: "10px", flexWrap: "wrap" }}>
          {sectionLabel ? <span className="pill">{copy.section}: {sectionLabel.replace(/_/g, " ")}</span> : null}
          <span className="pill" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>{copy.saveNote}</span>
        </div>
      </section>

      <section className="card stack" style={{ gap: "18px" }}>
        <div className="stack" style={{ gap: "8px" }}>
          <strong style={{ fontSize: "1.2rem" }}>{copy.intro}</strong>
          <p className="muted" style={{ margin: 0 }}>{track.intro}</p>
        </div>
        <div className="row-between" style={{ justifyContent: "flex-start", gap: "12px", flexWrap: "wrap" }}>
          {recommendedLanguages.map((language) => (
            <button
              key={language}
              type="button"
              onClick={() => resetForLanguage(language)}
              className="pill"
              style={{
                cursor: "pointer",
                background: selectedLanguage === language ? "var(--primary)" : "rgba(255,255,255,0.04)",
                color: selectedLanguage === language ? "white" : "var(--ink)",
                borderColor: selectedLanguage === language ? "transparent" : "var(--glass-border)"
              }}
            >
              {languageLabelMap[language]}
            </button>
          ))}
        </div>
      </section>

      <div className="grid" style={{ gridTemplateColumns: "1.15fr 0.85fr", gap: "24px", alignItems: "start" }}>
        <section className="stack" style={{ gap: "16px" }}>
          {track.questions.map((question, index) => (
            <article key={question.id} className="card stack" style={{ gap: "16px", padding: "28px" }}>
              <div className="row-between" style={{ alignItems: "center" }}>
                <span className="eyebrow">{copy.question} {index + 1}</span>
                <div className="row-between" style={{ gap: "8px" }}>
                  <span className="pill">{question.targetLevel}</span>
                  <span className="pill" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>
                    {skillLabels[question.skill]}
                  </span>
                </div>
              </div>
              <strong style={{ fontSize: "1.15rem" }}>{question.prompt}</strong>
              <div className="stack" style={{ gap: "10px" }}>
                {question.choices.map((choice) => {
                  const isSelected = answers[question.id] === choice.id;
                  return (
                    <button
                      key={choice.id}
                      type="button"
                      onClick={() => handleChoice(question.id, choice.id)}
                      className="card"
                      style={{
                        cursor: "pointer",
                        padding: "16px 18px",
                        textAlign: "left",
                        background: isSelected ? "rgba(99, 102, 241, 0.12)" : "rgba(255,255,255,0.03)",
                        borderColor: isSelected ? "var(--primary)" : "var(--glass-border)"
                      }}
                    >
                      {choice.text}
                    </button>
                  );
                })}
              </div>
            </article>
          ))}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={answeredCount !== track.questions.length}
            className="button-link"
            style={{
              justifyContent: "center",
              padding: "18px 28px",
              opacity: answeredCount !== track.questions.length ? 0.5 : 1,
              pointerEvents: answeredCount !== track.questions.length ? "none" : "auto"
            }}
          >
            {copy.submit}
          </button>
        </section>

        <aside className="stack" style={{ gap: "18px", position: "sticky", top: "24px" }}>
          <article className="card stack" style={{ gap: "12px" }}>
            <span className="eyebrow">{copy.result}</span>
            <strong style={{ fontSize: "1.2rem" }}>{languageLabelMap[selectedLanguage]}</strong>
            {result ? (
              <>
                <div className="row-between" style={{ alignItems: "baseline" }}>
                  <div style={{ fontSize: "3rem", fontWeight: 900, lineHeight: 1 }}>{result.level}</div>
                  <span className="pill">{result.score}/{result.total}</span>
                </div>
                <div style={{ height: "8px", background: "rgba(255,255,255,0.06)", borderRadius: "999px" }}>
                  <div style={{ height: "100%", width: `${getLevelProgressValue(result.level)}%`, background: "linear-gradient(90deg, var(--primary), var(--accent))", borderRadius: "inherit" }} />
                </div>
                <p className="muted" style={{ margin: 0 }}>
                  {getRoadmapTone(result.level === "B2" ? 18 : result.level === "B1" ? 16 : 14)}
                </p>
                <p style={{ margin: 0 }}><strong>{copy.strongest}:</strong> {skillLabels[result.strongestSkill]}</p>
                <p style={{ margin: 0 }}><strong>{copy.weakest}:</strong> {skillLabels[result.weakestSkill]}</p>
                <p className="muted" style={{ margin: 0 }}>{getLanguageFocusMessage(selectedLanguage, result)}</p>
                <p className="muted" style={{ margin: 0 }}>{getSectionRoadmapMessage(sectionLabel)}</p>
              </>
            ) : savedResult ? (
              <>
                <div style={{ fontSize: "3rem", fontWeight: 900, lineHeight: 1 }}>{savedResult.level}</div>
                <p className="muted" style={{ margin: 0 }}>{savedResult.score}/{savedResult.total} correct</p>
              </>
            ) : (
              <p className="muted" style={{ margin: 0 }}>{copy.diagnosticMissing}</p>
            )}
          </article>

          <article className="card stack" style={{ gap: "14px" }}>
            <span className="eyebrow">{copy.roadmap}</span>
            {roadmapSteps.length > 0 ? (
              roadmapSteps.map((step, index) => (
                <div key={step.slug} className="card row-between" style={{ padding: "16px 18px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--glass-border)" }}>
                  <div className="stack" style={{ gap: "4px", maxWidth: "74%" }}>
                    <span className="eyebrow" style={{ color: "var(--accent)" }}>{index + 1}. {step.level} {skillLabels[step.skill]}</span>
                    <strong>{step.title}</strong>
                    <span className="muted" style={{ fontSize: "12px" }}>{step.summary}</span>
                  </div>
                  <span className="pill">{step.estimatedMinutes} min</span>
                </div>
              ))
            ) : (
              <p className="muted" style={{ margin: 0 }}>Finish the diagnostic to unlock your roadmap.</p>
            )}
            <div className="row-between" style={{ justifyContent: "flex-start", gap: "12px", flexWrap: "wrap" }}>
              <Link className="button-link" href="/dashboard">{copy.dashboard}</Link>
              <Link className="button-link button-secondary" href="/lessons">{copy.library}</Link>
            </div>
          </article>

          {result ? (
            <article className="card stack" style={{ gap: "14px" }}>
              <span className="eyebrow">{copy.review}</span>
              {track.questions.map((question) => {
                const review = buildDiagnosticReview(question, answers[question.id]);
                return (
                  <div key={question.id} style={{ padding: "14px 0", borderBottom: "1px solid var(--glass-border)" }}>
                    <strong style={{ display: "block", marginBottom: "6px" }}>{question.prompt}</strong>
                    <p style={{ margin: 0, color: review.isCorrect ? "var(--success)" : "var(--error)" }}>
                      Your answer: {review.selectedText}
                    </p>
                    {!review.isCorrect ? (
                      <p className="muted" style={{ margin: "4px 0 0" }}>
                        Correct: {review.correctText}. {question.explanation}
                      </p>
                    ) : (
                      <p className="muted" style={{ margin: "4px 0 0" }}>{question.explanation}</p>
                    )}
                  </div>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  setAnswers({});
                  setResult(null);
                }}
                className="button-link button-secondary"
                style={{ justifyContent: "center" }}
              >
                {copy.retry}
              </button>
            </article>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
