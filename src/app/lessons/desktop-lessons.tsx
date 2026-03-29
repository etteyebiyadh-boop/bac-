"use client";

import { useState } from "react";
import Link from "next/link";
import { LessonsIcon, BookIcon, TargetIcon, FireIcon } from "@/components/icons";
import { Language } from "@prisma/client";
import { getLanguageLabel } from "@/lib/learning";

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

export function DesktopLessons({ modules, grammarRules, vocabSets, readingPassages, curriculumTracks, availableSlugs, activeLanguages, lang, t, moduleLabels, bacSection }: DesktopLessonsProps) {
  const [activeTab, setActiveTab] = useState<"curriculum" | "reading" | "grammar" | "vocab">("curriculum");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(activeLanguages[0] || "ENGLISH");

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
              onClick={() => setSelectedLanguage(l)}
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
                  <div style={{ fontSize: "14px", color: "var(--ink-dim)" }}>{getLanguageLabel(selectedLanguage)} - Learning Path</div>
                  <div style={{ fontSize: "24px", fontWeight: 800, marginTop: "4px" }}>
                    {currentTrack.mode === "communication-first" ? "Communication Track" : "BAC Path"}
                  </div>
                </div>
                <span className="pill" style={{ borderColor: "var(--success)", color: "var(--success)" }}>
                  {t.lib_roadmap_range}
                </span>
              </div>
              <div style={{ marginTop: "20px", height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "100px" }}>
                <div style={{ width: "35%", height: "100%", background: "var(--primary)", borderRadius: "100px" }} />
              </div>
              <div style={{ fontSize: "14px", color: "var(--ink-dim)", marginTop: "12px" }}>35% Complete</div>
            </div>

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
                  <CollapsibleSection
                    key={level.level}
                    title={`${level.level}: ${level.summary}`}
                    count={populatedSkills.reduce((count: number, skill: any) => count + skill.lessons.length, 0)}
                    icon={TargetIcon}
                    color="#6366f1"
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {populatedSkills.map((skill: any) => (
                        <div key={skill.skill} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          <div style={{ fontSize: "13px", color: "var(--accent)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            {skill.skill}
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {skill.lessons.map((lesson: any) => (
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
                                <span className="button-link button-secondary" style={{ padding: "8px 16px", fontSize: "12px" }}>
                                  {t.lib_open_btn}
                                </span>
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
                  title={moduleLabels[mod] || mod.replace(/MODULE_\d+_/, "").replace(/_/g, " ")}
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
                  title={moduleLabels[mod] || mod.replace(/MODULE_\d+_/, "").replace(/_/g, " ")}
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
                  title={moduleLabels[mod] || mod.replace(/MODULE_\d+_/, "").replace(/_/g, " ")}
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
