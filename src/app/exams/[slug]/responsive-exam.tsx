"use client";

import { useEffect, useState } from "react";
import { MobileExam } from "./mobile-exam";
import { SiteLanguage, translations } from "@/lib/translations";
import { ExamModeSimulator } from "@/components/ExamModeSimulator";

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
  readingTitle?: string;
  readingContent?: string;
  readingQuestions?: any;
  languageQuestions?: any;
};

interface ResponsiveExamProps {
  exam: ExamOption;
  lang: SiteLanguage;
  bacSection: string | null;
  scanAvailable: boolean;
  scanProviderLabel: string | null;
}

export function ResponsiveExam({
  exam,
  lang,
  bacSection,
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
      </div>
    );
  }

  if (isMobile) {
    return (
      <MobileExam
        exam={exam}
        lang={lang}
        bacSection={bacSection}
        scanAvailable={scanAvailable}
      />
    );
  }

  return (
    <div className="container" style={{ direction: lang === "ar" ? "rtl" : "ltr", paddingTop: "80px", paddingBottom: "120px" }}>
      <header className="stack" style={{ gap: "16px", marginBottom: "80px" }}>
        <div className="row-between" style={{ alignItems: "flex-end" }}>
           <div className="stack" style={{ gap: "16px" }}>
              <span className="eyebrow" style={{ color: "var(--primary)" }}>{t.nav_exams} - SESSION {exam.year}</span>
              <h1 className="hero-title" style={{ fontSize: "5rem", maxWidth: "1000px" }}>{exam.title}</h1>
           </div>
           <div className="card pill" style={{ border: "1px solid var(--glass-border)", padding: "12px 32px", height: "fit-content" }}>
              <span style={{ fontWeight: 900 }}>{exam.difficulty}</span>
           </div>
        </div>
        <p className="muted" style={{ fontSize: "1.2rem", maxWidth: "800px" }}>
          {exam.methodology}
        </p>
      </header>

      <ExamModeSimulator 
        exam={exam} 
        lang={lang} 
        bacSection={bacSection} 
        scanAvailable={scanAvailable} 
      />
    </div>
  );
}
