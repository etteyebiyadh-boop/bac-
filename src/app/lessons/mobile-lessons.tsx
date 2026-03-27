"use client";

import { useState } from "react";
import Link from "next/link";
import { LessonsIcon, BookIcon, TargetIcon, FireIcon } from "@/components/icons";
import { Language } from "@prisma/client";

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
  getLanguageLabel: (lang: Language) => string;
}

function CollapsibleSection({ title, count, icon: Icon, children, color = "var(--primary)", defaultOpen = false }: {
  title: string;
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
            <div style={{ fontSize: "12px", color: "var(--ink-dim)" }}>{count} items</div>
          </div>
        </div>
        <span style={{
          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.3s ease",
          fontSize: "20px",
        }}>▼</span>
      </button>

      {isOpen && (
        <div style={{ padding: "0 16px 16px" }} className="stagger-item">
          {children}
        </div>
      )}
    </div>
  );
}

export function MobileLessons({ modules, grammarRules, vocabSets, readingPassages, curriculumTracks, availableSlugs, activeLanguages, lang, t, getLanguageLabel }: MobileLessonsProps) {
  const [activeTab, setActiveTab] = useState("curriculum");
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(activeLanguages[0] || "ENGLISH");

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
              <div style={{ fontSize: "14px", color: "var(--ink-dim)", marginBottom: "4px" }}>{getLanguageLabel(selectedLanguage)} - Your Learning Path</div>
              <div style={{ fontSize: "20px", fontWeight: 800 }}>{currentTrack.mode === "communication-first" ? "Communication Track" : "BAC Path"}</div>
              <div style={{ marginTop: "12px", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "100px" }}>
                <div style={{ width: "35%", height: "100%", background: "var(--primary)", borderRadius: "100px" }} />
              </div>
              <div style={{ fontSize: "12px", color: "var(--ink-dim)", marginTop: "8px" }}>35% Complete</div>
            </div>

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
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {populatedSkills.map((skill: any) => (
                      <div key={skill.skill} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <div style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 700 }}>{skill.skill}</div>
                        {skill.lessons.map((lesson: any) => (
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
                            <span style={{ fontSize: "20px" }}>→</span>
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>
              );
            })}
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
                  title={mod.replace(/MODULE_\d+_/, "").replace(/_/g, " ")}
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
                  title={mod.replace(/MODULE_\d+_/, "").replace(/_/g, " ")}
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
                  title={mod.replace(/MODULE_\d+_/, "").replace(/_/g, " ")}
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
