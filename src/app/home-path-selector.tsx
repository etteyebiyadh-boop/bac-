"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteLanguage, translations } from "@/lib/translations";

interface HeroPathSelectorProps {
  lang: SiteLanguage;
}

const SECTIONS = [
  { id: "MATHEMATIQUES", label: "Mathematiques", icon: "Math" },
  { id: "SCIENCES_EXPERIMENTALES", label: "Sciences Exp", icon: "Bio" },
  { id: "LETTRES", label: "Lettres", icon: "Lit" },
  { id: "ECONOMIE_GESTION", label: "Economie", icon: "Eco" },
  { id: "SCIENCES_INFORMATIQUE", label: "Informatique", icon: "Info" },
  { id: "SCIENCES_TECHNIQUES", label: "Techniques", icon: "Tech" }
];

const LANGUAGES = [
  { id: "SPANISH", label: "Espanol", flag: "ES" },
  { id: "GERMAN", label: "Deutsch", flag: "DE" },
  { id: "ITALIAN", label: "Italiano", flag: "IT" }
];

export function HeroPathSelector({ lang }: HeroPathSelectorProps) {
  const t = translations[lang];
  const [step, setStep] = useState(1);
  const [section, setSection] = useState("");
  const [optionalLang, setOptionalLang] = useState("");

  const reset = () => {
    setStep(1);
    setSection("");
    setOptionalLang("");
  };

  return (
    <div className="stack" style={{ width: "100%", maxWidth: "900px", margin: "0 auto", direction: lang === "ar" ? "rtl" : "ltr" }}>
      {step === 1 ? (
        <div className="stack" style={{ gap: "32px", animation: "reveal-up 0.5s ease" }}>
          <h2 className="section-title" style={{ fontSize: "2.5rem" }}>{t.sel_step1}</h2>
          <div className="grid grid-cols-3" style={{ gap: "16px" }}>
            {SECTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSection(item.id);
                  setStep(2);
                }}
                className="card stack"
                style={{ padding: "24px", cursor: "pointer", background: "rgba(255,255,255,0.03)", border: "1px solid var(--glass-border)" }}
              >
                <span style={{ fontSize: "1rem", fontWeight: 800, color: "var(--accent)" }}>{item.icon}</span>
                <strong style={{ fontSize: "1rem" }}>{item.label}</strong>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="stack" style={{ gap: "32px", animation: "reveal-up 0.5s ease" }}>
          <div className="row-between" style={{ justifyContent: "flex-start", gap: "12px" }}>
            <button type="button" onClick={() => setStep(1)} className="pill" style={{ cursor: "pointer", background: "transparent" }}>
              {lang === "ar" ? "Back" : (lang === "fr" ? "Retour" : "Back")}
            </button>
            <span className="pill" style={{ background: "var(--primary)", color: "white" }}>{section.replaceAll("_", " ")}</span>
          </div>

          <h2 className="section-title" style={{ fontSize: "2.5rem" }}>{t.sel_step2}</h2>
          <div className="grid grid-cols-3" style={{ gap: "16px" }}>
            {LANGUAGES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setOptionalLang(item.id);
                  setStep(3);
                }}
                className="card stack"
                style={{ padding: "24px", cursor: "pointer", background: "rgba(255,255,255,0.03)", border: "1px solid var(--glass-border)" }}
              >
                <span style={{ fontSize: "1rem", fontWeight: 900, color: "var(--accent)" }}>{item.flag}</span>
                <strong style={{ fontSize: "1.2rem" }}>{item.label}</strong>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="stack" style={{ gap: "40px", animation: "reveal-up 0.5s ease" }}>
          <div className="row-between" style={{ justifyContent: "flex-start", gap: "12px", flexWrap: "wrap" }}>
            <button type="button" onClick={() => setStep(2)} className="pill" style={{ cursor: "pointer", background: "transparent" }}>
              {lang === "ar" ? "Back" : (lang === "fr" ? "Retour" : "Back")}
            </button>
            <span className="pill" style={{ background: "var(--primary)", color: "white" }}>{section.replaceAll("_", " ")}</span>
            <span className="pill" style={{ background: "var(--accent)", color: "black" }}>{optionalLang}</span>
          </div>

          <div className="card stack" style={{ padding: "60px", background: "radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent)", border: "1px solid var(--primary)" }}>
            <span className="eyebrow" style={{ color: "var(--primary)" }}>
              {lang === "ar" ? "Roadmap Engine" : (lang === "fr" ? "Moteur de Roadmap" : "Roadmap Engine")}
            </span>
            <h2 className="section-title">{t.sel_roadmap_ready}.</h2>
            <p className="muted" style={{ fontSize: "1.2rem", maxWidth: "640px" }}>
              {lang === "ar"
                ? "ابدأ بتشخيص سريع في الانجليزية والفرنسية ثم اللغة الاختيارية لتحصل على مستوى واضح وخطة دراسة حقيقية."
                : (lang === "fr"
                  ? "Commencez par un diagnostic rapide en anglais, en francais puis dans la langue optionnelle pour obtenir un niveau clair et une vraie roadmap."
                  : "Start with a quick English, French, and optional-language diagnostic to unlock a real level-based roadmap.")}
            </p>

            <div className="stack" style={{ marginTop: "40px", gap: "16px", textAlign: lang === "ar" ? "right" : "left" }}>
              <div className="row-between" style={{ padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid var(--glass-border)" }}>
                <div className="row-between" style={{ gap: "16px" }}>
                  <span className="pill" style={{ minWidth: "40px", textAlign: "center" }}>1</span>
                  <strong style={{ fontSize: "1rem" }}>
                    {lang === "ar" ? "English: diagnostic + writing + reading" : (lang === "fr" ? "Anglais : diagnostic + ecriture + lecture" : "English: diagnostic + writing + reading")}
                  </strong>
                </div>
                <span>5 min</span>
              </div>

              <div className="row-between" style={{ padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid var(--glass-border)" }}>
                <div className="row-between" style={{ gap: "16px" }}>
                  <span className="pill" style={{ minWidth: "40px", textAlign: "center" }}>2</span>
                  <strong style={{ fontSize: "1rem" }}>
                    {lang === "ar" ? "Francais: diagnostic + methodologie Bac" : (lang === "fr" ? "Francais : diagnostic + methodologie Bac" : "French: diagnostic + Bac methodology")}
                  </strong>
                </div>
                <span>5 min</span>
              </div>

              <div className="row-between" style={{ padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid var(--glass-border)" }}>
                <div className="row-between" style={{ gap: "16px" }}>
                  <span className="pill" style={{ minWidth: "40px", textAlign: "center" }}>3</span>
                  <strong style={{ fontSize: "1rem" }}>
                    {optionalLang}: {lang === "ar" ? "communication diagnostic + A1 to B1 roadmap" : (lang === "fr" ? "diagnostic communicatif + roadmap A1 vers B1" : "communication diagnostic + A1 to B1 roadmap")}
                  </strong>
                </div>
                <span>4 min</span>
              </div>
            </div>

            <div className="row-between" style={{ marginTop: "60px", gap: "24px", flexWrap: "wrap" }}>
              <Link className="button-link hover-glow" href={`/diagnostic?section=${section}&optionalLang=${optionalLang}`} style={{ flex: 1, justifyContent: "center", padding: "24px", minWidth: "240px" }}>
                {lang === "ar" ? "Start diagnostic now" : (lang === "fr" ? "Lancer le diagnostic" : "Start diagnostic now")}
              </Link>
              <Link className="button-link button-secondary" href={`/auth/signup?section=${section}&lang=${optionalLang}`} style={{ padding: "24px" }}>
                {t.sel_secure_path}
              </Link>
              <button type="button" onClick={reset} className="button-link button-secondary" style={{ padding: "24px" }}>
                {t.sel_start_over}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
