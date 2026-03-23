"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteLanguage, translations } from "@/lib/translations";

interface HeroPathSelectorProps {
  lang: SiteLanguage;
}

const SECTIONS = [
  { id: "MATHEMATIQUES", label: "Mathématiques", icon: "📐" },
  { id: "SCIENCES_EXPERIMENTALES", label: "Sciences Exp", icon: "🧪" },
  { id: "LETTRES", label: "Lettres", icon: "✍️" },
  { id: "ECONOMIE_GESTION", label: "Économie", icon: "📈" },
  { id: "SCIENCES_INFORMATIQUE", label: "Informatique", icon: "💻" },
  { id: "SCIENCES_TECHNIQUES", label: "Techniques", icon: "⚙️" }
];

const LANGUAGES = [
  { id: "SPANISH", label: "Español", flag: "🇪🇸" },
  { id: "GERMAN", label: "Deutsch", flag: "🇩🇪" },
  { id: "ITALIAN", label: "Italiano", flag: "🇮🇹" }
];

export function HeroPathSelector({ lang }: HeroPathSelectorProps) {
  const t = translations[lang];
  const [step, setStep] = useState(1);
  const [section, setSection] = useState("");
  const [optionalLang, setOptionalLang] = useState("");

  const reset = () => { setStep(1); setSection(""); setOptionalLang(""); };

  return (
    <div className="stack" style={{ width: "100%", maxWidth: "900px", margin: "0 auto", direction: lang === "ar" ? "rtl" : "ltr" }}>
      {step === 1 && (
        <div className="stack" style={{ gap: "32px", animation: "reveal-up 0.5s ease" }}>
          <h2 className="section-title" style={{ fontSize: "2.5rem" }}>{t.sel_step1}</h2>
          <div className="grid grid-cols-3" style={{ gap: "16px" }}>
            {SECTIONS.map((s) => (
              <button 
                key={s.id} 
                onClick={() => { setSection(s.id); setStep(2); }}
                className="card stack"
                style={{ padding: "24px", cursor: "pointer", background: "rgba(255,255,255,0.03)", border: "1px solid var(--glass-border)", transition: "0.3s" }}
              >
                <span style={{ fontSize: "2rem" }}>{s.icon}</span>
                <strong style={{ fontSize: "1rem" }}>{s.label}</strong>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="stack" style={{ gap: "32px", animation: "reveal-up 0.5s ease" }}>
          <div className="row-between" style={{ justifyContent: "flex-start", gap: "12px" }}>
            <button onClick={() => setStep(1)} className="pill" style={{ cursor: "pointer", background: "transparent" }}>
               {lang === "ar" ? "← رجوع" : (lang === "fr" ? "← Retour" : "← Back")}
            </button>
            <span className="pill" style={{ background: "var(--primary)", color: "white" }}>{section.replace("_", " ")}</span>
          </div>
          <h2 className="section-title" style={{ fontSize: "2.5rem" }}>{t.sel_step2}</h2>
          <div className="grid grid-cols-3" style={{ gap: "16px" }}>
            {LANGUAGES.map((l) => (
              <button 
                key={l.id} 
                onClick={() => { setOptionalLang(l.id); setStep(3); }}
                className="card stack"
                style={{ padding: "24px", cursor: "pointer", background: "rgba(255,255,255,0.03)", border: "1px solid var(--glass-border)", transition: "0.3s" }}
              >
                <span style={{ fontSize: "2.5rem" }}>{l.flag}</span>
                <strong style={{ fontSize: "1.2rem" }}>{l.label}</strong>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="stack" style={{ gap: "40px", animation: "reveal-up 0.5s ease" }}>
          <div className="row-between" style={{ justifyContent: "flex-start", gap: "12px" }}>
             <button onClick={() => setStep(2)} className="pill" style={{ cursor: "pointer", background: "transparent" }}>
                {lang === "ar" ? "← رجوع" : (lang === "fr" ? "← Retour" : "← Back")}
             </button>
             <span className="pill" style={{ background: "var(--primary)", color: "white" }}>{section.replace("_", " ")}</span>
             <span className="pill" style={{ background: "var(--accent)", color: "black" }}>{optionalLang}</span>
          </div>
          
          <div className="card stack" style={{ padding: "60px", background: "radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent)", border: "1px solid var(--primary)" }}>
             <span className="eyebrow" style={{ color: "var(--primary)" }}>{lang === "ar" ? "مسار التميّز" : (lang === "fr" ? "Le Parcours d'Excellence" : "The Excellence Path")}</span>
             <h2 className="section-title">{t.sel_roadmap_ready}.</h2>
             <p className="muted" style={{ fontSize: "1.2rem", maxWidth: "600px" }}>
               {t.sel_roadmap_desc}
             </p>

             <div className="stack" style={{ marginTop: "40px", gap: "16px", textAlign: lang === "ar" ? "right" : "left" }}>
                <div className="row-between" style={{ padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid var(--glass-border)" }}>
                   <div className="row-between" style={{ gap: "16px" }}>
                      <span className="pill" style={{ minWidth: "40px", textAlign: "center" }}>1</span>
                      <strong style={{ fontSize: "1rem" }}>{lang === "ar" ? "العربية: تحليل المصطلحات النقدية الأدبية (ضارب 2)" : (lang === "fr" ? "Arabe : Analyse des termes critiques littéraires (Coef 2)" : "Arabic: Analysis of Literary Critical Terms (Coef 2)")}</strong>
                   </div>
                   <span>⏳ 15 min</span>
                </div>
                <div className="row-between" style={{ padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid var(--glass-border)" }}>
                   <div className="row-between" style={{ gap: "16px" }}>
                      <span className="pill" style={{ minWidth: "40px", textAlign: "center" }}>2</span>
                      <strong style={{ fontSize: "1rem" }}>{lang === "ar" ? "الفرنسية: إتقان توافق الأفعال (ضارب 2)" : (lang === "fr" ? "Français : Maîtrise de la concordance des temps (Coef 2)" : "French: Mastering the Concordance of Tenses (Coef 2)")}</strong>
                   </div>
                   <span>⏳ 20 min</span>
                </div>
                <div className="row-between" style={{ padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "12px", border: "1px solid var(--glass-border)" }}>
                   <div className="row-between" style={{ gap: "16px" }}>
                      <span className="pill" style={{ minWidth: "40px", textAlign: "center" }}>3</span>
                      <strong style={{ fontSize: "1rem" }}>{optionalLang}: {lang === "ar" ? "الانغماس اللغوي التفاعلي" : (lang === "fr" ? "Immersion linguistique interactive" : "Interactive Language Immersion")}</strong>
                   </div>
                   <span>⏳ 25 min</span>
                </div>
             </div>

             <div className="row-between" style={{ marginTop: "60px", gap: "24px" }}>
                <Link className="button-link hover-glow" href={`/auth/signup?section=${section}&lang=${optionalLang}`} style={{ flex: 1, justifyContent: "center", padding: "24px" }}>
                   {t.sel_secure_path}
                </Link>
                <button onClick={reset} className="button-link button-secondary" style={{ padding: "24px" }}>{t.sel_start_over}</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
