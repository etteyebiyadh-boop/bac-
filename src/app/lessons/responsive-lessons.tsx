"use client";

import { useEffect, useState } from "react";
import { MobileLessons } from "./mobile-lessons";
import { DesktopLessons } from "./desktop-lessons";

interface ResponsiveLessonsProps {
  modules: any[];
  grammarRules: any[];
  vocabSets: any[];
  readingPassages: any[];
  curriculumTracks: Record<string, any>;
  availableSlugs: string[];
  activeLanguages: any[];
  lang: string;
  t: any;
  moduleLabels: Record<string, string>;
  bacSection: string | null;
}

export function ResponsiveLessons({
  modules,
  grammarRules,
  vocabSets,
  readingPassages,
  curriculumTracks,
  availableSlugs,
  activeLanguages,
  lang,
  t,
  moduleLabels,
  bacSection,
}: ResponsiveLessonsProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!mounted) {
    return (
      <DesktopLessons
        modules={modules}
        grammarRules={grammarRules}
        vocabSets={vocabSets}
        readingPassages={readingPassages}
        curriculumTracks={curriculumTracks}
        availableSlugs={availableSlugs}
        activeLanguages={activeLanguages}
        lang={lang}
        t={t}
        moduleLabels={moduleLabels}
        bacSection={bacSection}
      />
    );
  }

  if (isMobile) {
    return (
      <MobileLessons
        modules={modules}
        grammarRules={grammarRules}
        vocabSets={vocabSets}
        readingPassages={readingPassages}
        curriculumTracks={curriculumTracks}
        availableSlugs={availableSlugs}
        activeLanguages={activeLanguages}
        lang={lang}
        t={t}
        moduleLabels={moduleLabels}
      />
    );
  }

  return (
    <DesktopLessons
      modules={modules}
      grammarRules={grammarRules}
      vocabSets={vocabSets}
      readingPassages={readingPassages}
      curriculumTracks={curriculumTracks}
      availableSlugs={availableSlugs}
      activeLanguages={activeLanguages}
      lang={lang}
      t={t}
      moduleLabels={moduleLabels}
      bacSection={bacSection}
    />
  );
}
