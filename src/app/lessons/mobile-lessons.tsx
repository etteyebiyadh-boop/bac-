"use client";

import { useState } from "react";
import Link from "next/link";
import { LessonsIcon, BookIcon, TargetIcon, FireIcon } from "@/components/icons";
import { Language } from "@prisma/client";
import { getLanguageLabel } from "@/lib/learning";
import { translations } from "@/lib/translations";

interface MobileLessonsProps {
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
    <div className="card" style={{ borderRadius: "16px", overflow: "hidden" }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="micro-bounce"
        style={{
          width: "100%",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "transparent",
          border: "none",
          color: "white",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ padding: "8px", borderRadius: "10px", background: `${color}20` }}>
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontWeight: 700, fontSize: "15px" }}>{title}</div>
            {subtitle && <div style={{ fontSize: "12px", color: "var(--ink-dim)" }}>{subtitle}</div>}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="pill" style={{ fontSize: "11px" }}>{count} items</span>
          <span style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
            fontSize: "20px",
          }}>▼</span>
        </div>
      </button>

      {isOpen && (
        <div style={{ padding: "0 16px 16px" }} className="stagger-item">
          {children}
        </div>
      )}
    </div>
  );
}

// Helper to map lesson themes to BAC modules
function getModuleFromTheme(theme: string, currentModule: string): string | null {
  const themeLower = theme.toLowerCase();
  
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
  return currentModule;
}

export function MobileLessons({ modules, grammarRules, vocabSets, readingPassages, curriculumTracks, availableSlugs, activeLanguages, lang, t, moduleLabels }: MobileLessonsProps) {
  const [activeTab, setActiveTab] = useState("curriculum");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(activeLanguages[0] || "ENGLISH");

  // Client-side translation lookup for module labels
  const getModuleLabel = (mod: string): string => {
    const currentTranslations = translations[lang as keyof typeof translations] || translations.en;
    const labelMap: Record<string, string> = {
      'MODULE_1_HOLIDAYING_ART_SHOWS': currentTranslations.unit_1_title,
      'MODULE_2_EDUCATION_MATTERS': currentTranslations.unit_2_title,
      'MODULE_3_CREATIVE_INVENTIVE_MINDS': currentTranslations.unit_3_title,
      'MODULE_4_YOUTH_ISSUES': currentTranslations.unit_4_title,
      'MODULE_5_WOMEN_POWER': currentTranslations.unit_5_title,
      'MODULE_6_SUSTAINABLE_DEVELOPMENT': currentTranslations.unit_6_title,
      'MODULE_7_WORK_COMMITMENT': currentTranslations.unit_7_title,
      'MODULE_8_LITERARY_TEXTS': currentTranslations.unit_8_title,
    };
    return labelMap[mod] || mod.replace(/MODULE_\d+_/, "").replace(/_/g, " ");
  };

  const currentTrack = curriculumTracks[selectedLanguage];
  const langGrammar = grammarRules.filter((g: any) => g.language === selectedLanguage);
  const langVocab = vocabSets.filter((v: any) => v.language === selectedLanguage);
  const langReading = readingPassages.filter((r: any) => r.language === selectedLanguage);

  const tabs = [
    { id: "curriculum", label: "Path", icon: TargetIcon },
    { id: "reading", label: "Read", icon: BookIcon },
    { id: "grammar", label: "Grammar", icon: LessonsIcon },
    { id: "vocab", label: "Vocab", icon: FireIcon },
  ];

  return (
    <div style={{ padding: "20px", paddingBottom: "100px" }}>
      {/* Language Selector */}
      {activeLanguages.length > 1 && (
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
          {activeLanguages.map((l) => (
            <button
              key={l}
              onClick={() => setSelectedLanguage(l)}
              className="micro-bounce"
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: "none",
                background: selectedLanguage === l ? "var(--primary)" : "rgba(255,255,255,0.05)",
                color: selectedLanguage === l ? "white" : "var(--ink-dim)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {getLanguageLabel(l)}
            </button>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", position: "sticky", top: "80px", zIndex: 10, background: "rgba(0,2,5,0.9)", padding: "8px 0", backdropFilter: "blur(10px)" }}>
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="micro-bounce"
              style={{
                flex: 1,
                padding: "10px 8px",
                borderRadius: "12px",
                border: "none",
                background: isActive ? "var(--primary)" : "rgba(255,255,255,0.05)",
                color: isActive ? "white" : "var(--ink-dim)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                fontSize: "11px",
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
      <div className="stack stagger-item" style={{ gap: "12px" }}>
        {activeTab === "curriculum" && currentTrack && (
          <>
            <div className="card card-vibrant" style={{ padding: "20px", borderRadius: "16px", marginBottom: "16px" }}>
              <div style={{ fontSize: "14px", color: "var(--ink-dim)", marginBottom: "4px" }}>{getLanguageLabel(selectedLanguage)} - BAC Programme</div>
              <div style={{ fontSize: "20px", fontWeight: 800 }}>Programme Units</div>
              <div style={{ marginTop: "12px", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "100px" }}>
                <div style={{ width: "35%", height: "100%", background: "var(--primary)", borderRadius: "100px" }} />
              </div>
              <div style={{ fontSize: "12px", color: "var(--ink-dim)", marginTop: "8px" }}>35% Complete across all units</div>
            </div>

            {/* Programme Units First */}
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
                  subtitle={`${moduleLessons.length} lessons`}
                  count={moduleLessons.length}
                  icon={TargetIcon}
                  color="#6366f1"
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {Object.entries(lessonsBySkill).map(([skill, lessons]: [string, any]) => (
                      <div key={skill} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 700 }}>{skill}</div>
                        {lessons.map((lesson: any) => (
                          <Link
                            key={lesson.slug}
                            href={`/lessons/${lesson.slug}`}
                            className="card hover-lift"
                            style={{
                              padding: "12px 16px",
                              borderRadius: "12px",
                              textDecoration: "none",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 600, fontSize: "14px" }}>{lesson.title}</div>
                              <div style={{ fontSize: "11px", color: "var(--ink-dim)" }}>{lesson.summary}</div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span className="pill" style={{ fontSize: "10px", padding: "2px 6px" }}>{lesson.level}</span>
                              <span style={{ fontSize: "20px" }}>→</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>
              );
            })}

            {/* View by Level (collapsed) */}
            <CollapsibleSection
              title="View by Level (A1-B2)"
              subtitle="Alternative view by language level"
              count={currentTrack.levels.reduce((acc: number, l: any) => acc + l.skills.reduce((sacc: number, s: any) => sacc + s.lessons.length, 0), 0)}
              icon={TargetIcon}
              color="#8b5cf6"
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {currentTrack.levels.map((level: any) => {
                  const populatedSkills = level.skills
                    .map((skill: any) => ({
                      ...skill,
                      lessons: skill.lessons.filter((lesson: any) => availableSlugs.includes(lesson.slug))
                    }))
                    .filter((skill: any) => skill.lessons.length > 0);

                  if (populatedSkills.length === 0) return null;

                  return (
                    <div key={level.level} className="card" style={{ padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.02)" }}>
                      <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "8px" }}>
                        {level.level}: {level.summary}
                      </div>
                      {populatedSkills.map((skill: any) => (
                        <div key={skill.skill} style={{ fontSize: "12px", color: "var(--ink-dim)" }}>
                          {skill.skill}: {skill.lessons.length} lessons
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
          <>
            {modules.map((mod: any) => {
              const modReading = readingPassages.filter((r: any) => r.bacModule === mod);
              if (modReading.length === 0) return null;

              return (
                <CollapsibleSection
                  key={mod}
                  title={getModuleLabel(mod)}
                  count={modReading.length}
                  icon={BookIcon}
                  color="#f59e0b"
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {modReading.map((reading: any) => (
                      <Link
                        key={reading.id}
                        href={`/lessons/reading/${reading.slug}`}
                        className="card hover-lift"
                        style={{
                          padding: "14px",
                          borderRadius: "12px",
                          textDecoration: "none",
                          borderLeft: "3px solid var(--accent)",
                        }}
                      >
                        <div style={{ fontWeight: 600, fontSize: "14px" }}>{reading.title}</div>
                        <div style={{ fontSize: "11px", color: "var(--ink-dim)", marginTop: "4px" }}>
                          {reading.wordCount} words · {reading.difficulty}
                        </div>
                      </Link>
                    ))}
                  </div>
                </CollapsibleSection>
              );
            })}
          </>
        )}

        {activeTab === "grammar" && (
          <>
            {modules.map((mod: any) => {
              const modGrammar = grammarRules.filter((g: any) => g.bacModule === mod);
              if (modGrammar.length === 0) return null;

              return (
                <CollapsibleSection
                  key={mod}
                  title={getModuleLabel(mod)}
                  count={modGrammar.length}
                  icon={LessonsIcon}
                  color="#6366f1"
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {modGrammar.map((rule: any) => (
                      <Link
                        key={rule.id}
                        href={`/lessons/grammar/${rule.slug}`}
                        className="card hover-lift"
                        style={{
                          padding: "14px",
                          borderRadius: "12px",
                          textDecoration: "none",
                          borderLeft: "3px solid var(--primary)",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "14px" }}>{rule.title}</div>
                          <div style={{ fontSize: "11px", color: "var(--ink-dim)" }}>{rule.difficulty}</div>
                        </div>
                        <span style={{ fontSize: "18px" }}>→</span>
                      </Link>
                    ))}
                  </div>
                </CollapsibleSection>
              );
            })}
          </>
        )}

        {activeTab === "vocab" && (
          <>
            {modules.map((mod: any) => {
              const modVocab = vocabSets.filter((v: any) => v.bacModule === mod);
              if (modVocab.length === 0) return null;

              return (
                <CollapsibleSection
                  key={mod}
                  title={getModuleLabel(mod)}
                  count={modVocab.length}
                  icon={FireIcon}
                  color="#10b981"
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {modVocab.map((voc: any) => (
                      <Link
                        key={voc.id}
                        href={`/lessons/vocab/${voc.slug}`}
                        className="card hover-lift"
                        style={{
                          padding: "14px",
                          borderRadius: "12px",
                          textDecoration: "none",
                          borderLeft: "3px solid var(--success)",
                        }}
                      >
                        <div style={{ fontWeight: 600, fontSize: "14px" }}>{voc.title}</div>
                        <span className="pill" style={{ fontSize: "9px", marginTop: "6px", display: "inline-block" }}>{voc.theme}</span>
                      </Link>
                    ))}
                  </div>
                </CollapsibleSection>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
