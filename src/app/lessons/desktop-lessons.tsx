"use client";

import { useState } from "react";
import Link from "next/link";
import { LessonsIcon, BookIcon, TargetIcon, FireIcon } from "@/components/icons";
import { Language } from "@prisma/client";
import { getLanguageLabel } from "@/lib/learning";
import { translations } from "@/lib/translations";

interface DesktopLessonsProps {
  modules: any[];
  grammarRules: any[];
  vocabSets: any[];
  readingPassages: any[];
  curriculumTracks: Record<string, any>;
  availableSlugs: string[];
  activeLanguages: Language[];
  lang: string;
  t: any;
  moduleLabels: Record<string, string>;
  bacSection: string | null;
}

function CollapsibleSection({ title, subtitle, count, icon: Icon, children, color = "var(--primary)", defaultOpen = false }: {
  title: string;
  subtitle?: string;
  count: number;
  icon: any;
  children: React.ReactNode;
  color?: string;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="card" style={{ borderRadius: "20px", overflow: "hidden", border: "1px solid var(--glass-border)" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="micro-bounce hover-lift"
        style={{
          width: "100%",
          padding: "24px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "transparent",
          border: "none",
          color: "white",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ padding: "12px", borderRadius: "14px", background: `${color}20` }}>
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontWeight: 700, fontSize: "18px" }}>{title}</div>
            {subtitle && <div style={{ fontSize: "14px", color: "var(--ink-dim)", marginTop: "2px" }}>{subtitle}</div>}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span className="pill" style={{ fontSize: "12px" }}>{count} items</span>
          <span style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
            fontSize: "20px",
            color: "var(--ink-dim)"
          }}>▼</span>
        </div>
      </button>

      {isOpen && (
        <div style={{ padding: "0 28px 28px" }} className="stagger-item">
          {children}
        </div>
      )}
    </div>
  );
}

// Helper to map lesson themes to BAC modules
function getModuleFromTheme(theme: string, currentModule: string): string | null {
  const themeLower = theme.toLowerCase();
  
  // Map themes to modules based on keywords
  if (themeLower.includes('holiday') || themeLower.includes('art') || themeLower.includes('travel') || themeLower.includes('tourism')) {
    return 'MODULE_1_HOLIDAYING_ART_SHOWS';
  }
  if (themeLower.includes('education') || themeLower.includes('school') || themeLower.includes('learn') || themeLower.includes('student')) {
    return 'MODULE_2_EDUCATION_MATTERS';
  }
  if (themeLower.includes('creative') || themeLower.includes('inventive') || themeLower.includes('technology') || themeLower.includes('innovation') || themeLower.includes('digital')) {
    return 'MODULE_3_CREATIVE_INVENTIVE_MINDS';
  }
  if (themeLower.includes('youth') || themeLower.includes('teen') || themeLower.includes('young') || themeLower.includes('generation')) {
    return 'MODULE_4_YOUTH_ISSUES';
  }
  if (themeLower.includes('woman') || themeLower.includes('women') || themeLower.includes('power') || themeLower.includes('gender')) {
    return 'MODULE_5_WOMEN_POWER';
  }
  if (themeLower.includes('environment') || themeLower.includes('sustainable') || themeLower.includes('ecology') || themeLower.includes('green') || themeLower.includes('pollution')) {
    return 'MODULE_6_SUSTAINABLE_DEVELOPMENT';
  }
  if (themeLower.includes('work') || themeLower.includes('job') || themeLower.includes('career') || themeLower.includes('employment') || themeLower.includes('profession')) {
    return 'MODULE_7_WORK_COMMITMENT';
  }
  if (themeLower.includes('literature') || themeLower.includes('literary') || themeLower.includes('poetry') || themeLower.includes('novel') || themeLower.includes('author')) {
    return 'MODULE_8_LITERARY_TEXTS';
  }
  
  // If theme doesn't match any module, return current module (to include all lessons)
  return currentModule;
}

const langToSiteLang: Record<string, string> = {
  'ENGLISH': 'en',
  'FRENCH': 'fr',
  'ARABIC': 'ar',
  'SPANISH': 'es',
  'GERMAN': 'de',
  'ITALIAN': 'it'
};

export function DesktopLessons({ modules, grammarRules, vocabSets, readingPassages, curriculumTracks, availableSlugs, activeLanguages, lang, t, moduleLabels, bacSection }: DesktopLessonsProps) {
  const [activeTab, setActiveTab] = useState<"curriculum" | "reading" | "grammar" | "vocab">("curriculum");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(activeLanguages[0] || "ENGLISH");

  // Client-side translation lookup for module labels - use t prop directly
  const getModuleLabel = (mod: string): string => {
    const labelMap: Record<string, string> = {
      'MODULE_1_HOLIDAYING_ART_SHOWS': t.unit_1_title,
      'MODULE_2_EDUCATION_MATTERS': t.unit_2_title,
      'MODULE_3_CREATIVE_INVENTIVE_MINDS': t.unit_3_title,
      'MODULE_4_YOUTH_ISSUES': t.unit_4_title,
      'MODULE_5_WOMEN_POWER': t.unit_5_title,
      'MODULE_6_SUSTAINABLE_DEVELOPMENT': t.unit_6_title,
      'MODULE_7_WORK_COMMITMENT': t.unit_7_title,
      'MODULE_8_LITERARY_TEXTS': t.unit_8_title,
    };
    return labelMap[mod] || mod.replace(/MODULE_\d+_/, "").replace(/_/g, " ");
  };

  const handleLanguageChange = (l: Language) => {
    setSelectedLanguage(l);
    // Also update site-lang cookie to match content language for UI consistency
    const siteLang = langToSiteLang[l];
    if (siteLang) {
      document.cookie = `site-lang=${siteLang}; path=/; max-age=31536000`;
      // Reload to apply new UI language
      window.location.reload();
    }
  };

  const currentTrack = curriculumTracks[selectedLanguage];
  const langGrammar = grammarRules.filter((g: any) => g.language === selectedLanguage);
  const langVocab = vocabSets.filter((v: any) => v.language === selectedLanguage);
  const langReading = readingPassages.filter((r: any) => r.language === selectedLanguage);

  const tabs = [
    { id: "curriculum" as const, label: "Learning Path", icon: TargetIcon, color: "#6366f1" },
    { id: "reading" as const, label: "Reading Practice", icon: BookIcon, color: "#f59e0b" },
    { id: "grammar" as const, label: "Grammar & Verbs", icon: LessonsIcon, color: "#6366f1" },
    { id: "vocab" as const, label: "Vocabulary", icon: FireIcon, color: "#10b981" },
  ];

  return (
    <div className="page-stack" style={{ gap: "32px", direction: lang === "ar" ? "rtl" : "ltr" }}>
      {/* Header */}
      <section className="card" style={{ padding: "40px", borderRadius: "24px", background: "radial-gradient(circle at top right, rgba(99, 102, 241, 0.08), transparent)" }}>
        <span className="eyebrow" style={{ color: "var(--primary)" }}>{t.lib_title}</span>
        <h1 className="section-title" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", marginTop: "12px" }}>
          {lang === "ar" ? "الدراسة المعمقة" : "Deep Study"} <span className="text-gradient">Bac {bacSection}</span>
        </h1>

        {/* Language Selector */}
        <div style={{ display: "flex", gap: "12px", marginTop: "24px", flexWrap: "wrap" }}>
          {activeLanguages.map((l) => (
            <button
              key={l}
              onClick={() => handleLanguageChange(l)}
              className="micro-bounce"
              style={{
                padding: "10px 20px",
                borderRadius: "24px",
                border: "none",
                background: selectedLanguage === l ? "var(--primary)" : "rgba(255,255,255,0.05)",
                color: selectedLanguage === l ? "white" : "var(--ink-dim)",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {getLanguageLabel(l)}
            </button>
          ))}
        </div>
      </section>

      {/* Tab Navigation */}
      <div style={{ display: "flex", gap: "12px", borderBottom: "1px solid var(--glass-border)", paddingBottom: "16px" }}>
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="micro-bounce"
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "none",
                background: isActive ? `${tab.color}20` : "transparent",
                color: isActive ? tab.color : "var(--ink-dim)",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <IconComponent className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="stack stagger-item" style={{ gap: "20px" }}>
        {activeTab === "curriculum" && currentTrack && (
          <>
            <div className="card card-vibrant" style={{ padding: "28px", borderRadius: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                <div>
                  <div style={{ fontSize: "14px", color: "var(--ink-dim)" }}>{getLanguageLabel(selectedLanguage)} - BAC Programme</div>
                  <div style={{ fontSize: "24px", fontWeight: 800, marginTop: "4px" }}>
                    Programme Units
                  </div>
                </div>
                <span className="pill" style={{ borderColor: "var(--success)", color: "var(--success)" }}>
                  {t.lib_roadmap_range}
                </span>
              </div>
              <div style={{ marginTop: "20px", height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "100px" }}>
                <div style={{ width: "35%", height: "100%", background: "var(--primary)", borderRadius: "100px" }} />
              </div>
              <div style={{ fontSize: "14px", color: "var(--ink-dim)", marginTop: "12px" }}>35% Complete across all units</div>
            </div>

            {/* Programme Units First */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {modules.map((mod: any) => {
                // Get all lessons from curriculum that relate to this module
                const moduleLessons: any[] = [];
                currentTrack.levels.forEach((level: any) => {
                  level.skills.forEach((skill: any) => {
                    skill.lessons
                      .filter((lesson: any) => availableSlugs.includes(lesson.slug))
                      .forEach((lesson: any) => {
                        // Map lesson theme to module
                        const lessonModule = getModuleFromTheme(lesson.theme, mod);
                        if (lessonModule === mod || lessonModule === null) {
                          moduleLessons.push({ ...lesson, level: level.level, skill: skill.skill });
                        }
                      });
                  });
                });

                if (moduleLessons.length === 0) return null;

                // Group by skill
                const lessonsBySkill = moduleLessons.reduce((acc: any, lesson: any) => {
                  if (!acc[lesson.skill]) acc[lesson.skill] = [];
                  acc[lesson.skill].push(lesson);
                  return acc;
                }, {});

                return (
                  <CollapsibleSection
                    key={mod}
                    title={getModuleLabel(mod)}
                    subtitle={`${moduleLessons.length} lessons across all levels`}
                    count={moduleLessons.length}
                    icon={TargetIcon}
                    color="#6366f1"
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {Object.entries(lessonsBySkill).map(([skill, lessons]: [string, any]) => (
                        <div key={skill} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          <div style={{ fontSize: "13px", color: "var(--accent)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            {skill}
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {lessons.map((lesson: any) => (
                              <Link
                                key={lesson.slug}
                                href={`/lessons/${lesson.slug}`}
                                className="card hover-lift"
                                style={{
                                  padding: "16px 20px",
                                  borderRadius: "14px",
                                  textDecoration: "none",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  background: "rgba(255,255,255,0.03)",
                                }}
                              >
                                <div>
                                  <div style={{ fontWeight: 600, fontSize: "15px" }}>{lesson.title}</div>
                                  <div style={{ fontSize: "13px", color: "var(--ink-dim)", marginTop: "4px" }}>{lesson.summary}</div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                  <span className="pill" style={{ fontSize: "10px", padding: "4px 8px" }}>{lesson.level}</span>
                                  <span className="button-link button-secondary" style={{ padding: "8px 16px", fontSize: "12px" }}>
                                    {t.lib_open_btn}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>
                );
              })}
            </div>

            {/* Optional: View by Level (collapsed by default) */}
            <CollapsibleSection
              title="View by Language Level (A1-B2)"
              subtitle="Alternative view organized by CEFR levels"
              count={currentTrack.levels.reduce((acc: number, l: any) => acc + l.skills.reduce((sacc: number, s: any) => sacc + s.lessons.length, 0), 0)}
              icon={TargetIcon}
              color="#8b5cf6"
            >
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
                {currentTrack.levels.map((level: any) => {
                  const populatedSkills = level.skills
                    .map((skill: any) => ({
                      ...skill,
                      lessons: skill.lessons.filter((lesson: any) => availableSlugs.includes(lesson.slug))
                    }))
                    .filter((skill: any) => skill.lessons.length > 0);

                  if (populatedSkills.length === 0) return null;

                  return (
                    <div key={level.level} className="card" style={{ padding: "20px", borderRadius: "16px", background: "rgba(255,255,255,0.02)" }}>
                      <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "12px" }}>
                        {level.level}: {level.summary}
                      </div>
                      {populatedSkills.map((skill: any) => (
                        <div key={skill.skill} style={{ marginBottom: "12px" }}>
                          <div style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 600, marginBottom: "6px" }}>{skill.skill}</div>
                          <div style={{ fontSize: "13px", color: "var(--ink-dim)" }}>{skill.lessons.length} lessons</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </CollapsibleSection>
          </>
        )}

        {activeTab === "reading" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {modules.map((mod: any) => {
              const modReading = langReading.filter((r: any) => r.bacModule === mod);
              if (modReading.length === 0) return null;

              return (
                <CollapsibleSection
                  key={mod}
                  title={getModuleLabel(mod)}
                  subtitle={`${modReading.length} reading passages`}
                  count={modReading.length}
                  icon={BookIcon}
                  color="#f59e0b"
                >
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
                    {modReading.map((reading: any) => (
                      <Link
                        key={reading.id}
                        href={`/lessons/reading/${reading.slug}`}
                        className="card hover-lift"
                        style={{
                          padding: "20px",
                          borderRadius: "14px",
                          textDecoration: "none",
                          borderLeft: "4px solid var(--accent)",
                        }}
                      >
                        <div style={{ fontWeight: 600, fontSize: "16px" }}>{reading.title}</div>
                        <div style={{ fontSize: "13px", color: "var(--ink-dim)", marginTop: "8px" }}>
                          {reading.wordCount} words · {reading.difficulty}
                        </div>
                        <span className="button-link" style={{ marginTop: "16px", background: "var(--accent)", color: "black", width: "100%", justifyContent: "center" }}>
                          {lang === "ar" ? "بدء القراءة" : lang === "fr" ? "Commencer" : "Start Reading"}
                        </span>
                      </Link>
                    ))}
                  </div>
                </CollapsibleSection>
              );
            })}
          </div>
        )}

        {activeTab === "grammar" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {modules.map((mod: any) => {
              const modGrammar = langGrammar.filter((g: any) => g.bacModule === mod);
              if (modGrammar.length === 0) return null;

              return (
                <CollapsibleSection
                  key={mod}
                  title={getModuleLabel(mod)}
                  subtitle={`${modGrammar.length} grammar modules`}
                  count={modGrammar.length}
                  icon={LessonsIcon}
                  color="#6366f1"
                >
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                    {modGrammar.map((rule: any) => (
                      <Link
                        key={rule.id}
                        href={`/lessons/grammar/${rule.slug}`}
                        className="card hover-lift"
                        style={{
                          padding: "20px",
                          borderRadius: "14px",
                          textDecoration: "none",
                          borderLeft: "4px solid var(--primary)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "15px" }}>{rule.title}</div>
                          <div style={{ fontSize: "12px", color: "var(--ink-dim)", marginTop: "4px" }}>{rule.difficulty}</div>
                        </div>
                        <span className="button-link button-secondary" style={{ padding: "8px 14px", fontSize: "12px" }}>
                          {lang === "ar" ? "مراجعة" : lang === "fr" ? "Réviser" : "Review"}
                        </span>
                      </Link>
                    ))}
                  </div>
                </CollapsibleSection>
              );
            })}
          </div>
        )}

        {activeTab === "vocab" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {modules.map((mod: any) => {
              const modVocab = langVocab.filter((v: any) => v.bacModule === mod);
              if (modVocab.length === 0) return null;

              return (
                <CollapsibleSection
                  key={mod}
                  title={getModuleLabel(mod)}
                  subtitle={`${modVocab.length} vocabulary sets`}
                  count={modVocab.length}
                  icon={FireIcon}
                  color="#10b981"
                >
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                    {modVocab.map((voc: any) => (
                      <Link
                        key={voc.id}
                        href={`/lessons/vocab/${voc.slug}`}
                        className="card hover-lift"
                        style={{
                          padding: "20px",
                          borderRadius: "14px",
                          textDecoration: "none",
                          borderLeft: "4px solid var(--success)",
                        }}
                      >
                        <div style={{ fontWeight: 600, fontSize: "16px" }}>{voc.title}</div>
                        <span className="pill" style={{ fontSize: "11px", marginTop: "10px", display: "inline-block" }}>{voc.theme}</span>
                      </Link>
                    ))}
                  </div>
                </CollapsibleSection>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
