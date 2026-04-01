"use client";

import { useEffect, useState } from "react";
import { MobileExam } from "./mobile-exam";
import { WriteWorkspace } from "@/app/write/write-workspace";
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
  slug: string;
};

interface ResponsiveExamProps {
  exam: ExamOption;
  lang: SiteLanguage;
  scanAvailable: boolean;
  scanProviderLabel: string | null;
}

export function ResponsiveExam({
  exam,
  lang,
  scanAvailable,
  scanProviderLabel,
}: ResponsiveExamProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = translations[lang] || translations.en;

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!mounted) {
    return (
      <div className="page-stack" style={{ direction: lang === "ar" ? "rtl" : "ltr" }}>
        <section className="card stack hero-panel" style={{ padding: "48px 32px", border: "1px solid var(--primary)", background: "rgba(99, 102, 241, 0.03)" }}>
          <div className="stack" style={{ gap: "16px" }}>
            <span className="eyebrow" style={{ color: "var(--primary)" }}>{t.nav_exams} - {exam.year}</span>
            <h1 className="section-title" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1 }}>{exam.title}</h1>
            <p className="muted" style={{ maxWidth: "800px" }}>{exam.methodology}</p>
          </div>
        </section>
        <WriteWorkspace 
          lang={lang} 
          exams={[exam]} 
          selectedExam={exam} 
          scanAvailable={scanAvailable}
          scanProviderLabel={scanProviderLabel}
        />
      </div>
    );
  }

  if (isMobile) {
    return (
      <MobileExam
        exam={exam}
        lang={lang}
        scanAvailable={scanAvailable}
      />
    );
  }

  return (
    <div className="page-stack" style={{ direction: lang === "ar" ? "rtl" : "ltr" }}>
      <section className="card stack hero-panel" style={{ padding: "48px 32px", border: "1px solid var(--primary)", background: "rgba(99, 102, 241, 0.03)" }}>
        <div style={{ position: "absolute", right: "-10%", top: "-50%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div className="stack" style={{ zIndex: 1, position: "relative", gap: "16px" }}>
          <span className="eyebrow" style={{ color: "var(--primary)" }}>{t.nav_exams} - {exam.year}</span>
          <h1 className="section-title" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1 }}>{exam.title}</h1>
          <p className="muted" style={{ maxWidth: "800px" }}>{exam.methodology}</p>
          
          <div style={{ marginTop: "24px" }}>
             <button 
               className="button-link hover-glow" 
               style={{ background: "var(--primary)", color: "black", padding: "20px 48px", fontSize: "1.2rem", fontWeight: 900 }}
               onClick={() => {
                 // Trigger focus mode in WriteWorkspace if possible or just rely on the section below
                 const el = document.getElementById("write-workspace-anchor");
                 el?.scrollIntoView({ behavior: "smooth" });
               }}
             >
                {lang === "ar" ? "🎯 ابدا الـ MOCK EXAM توا (3 سوايع تركيز)" : "🎯 START FULL 3-HOUR MOCK EXAM"}
             </button>
             <p className="muted" style={{ marginTop: "16px", fontSize: "0.9rem" }}>
                {lang === "ar" 
                  ? "ما تنساش تبارتاجي السكور متاعك باش تشجع صحابك! 🔥" 
                  : "Don't forget to share your score to challenge your friends! 🔥"}
             </p>
          </div>
        </div>
      </section>

      <div id="write-workspace-anchor" />
      <WriteWorkspace 
        lang={lang} 
        exams={[exam]} 
        selectedExam={exam} 
        scanAvailable={scanAvailable}
        scanProviderLabel={scanProviderLabel}
      />
    </div>
  );
}
