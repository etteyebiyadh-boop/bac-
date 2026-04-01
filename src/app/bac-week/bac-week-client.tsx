"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BacSection } from "@prisma/client";
import { getBacSectionLabel } from "@/lib/learning";

type SessionType = "reading" | "grammar" | "writing" | "mock" | "review" | "vocab";

type Session = {
  time: string;
  activity: string;
  type: SessionType;
  duration: number;
};

type DayPlan = {
  day: number;
  title: string;
  focus: string;
  duration: number;
  sessions: Session[];
};

interface BacWeekClientProps {
  bacSection: BacSection | null;
  targetScore: number;
  lang: string;
}

export function BacWeekClient({ bacSection, targetScore, lang }: BacWeekClientProps) {
  const [activeDay, setActiveDay] = useState(1);
  const [completedSessions, setCompletedSessions] = useState<Set<string>>(new Set());
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`bac_week_progress_${bacSection || 'general'}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.started) setIsStarted(true);
        if (parsed.activeDay) setActiveDay(parsed.activeDay);
        if (parsed.completed) {
          setCompletedSessions(new Set(parsed.completed));
        }
        if (parsed.totalTime) setTotalStudyTime(parsed.totalTime);
      } catch (e) {}
    }
  }, [bacSection]);

  const saveProgress = (started: boolean, day: number, completed: Set<string>, time: number) => {
    localStorage.setItem(`bac_week_progress_${bacSection || 'general'}`, JSON.stringify({
      started,
      activeDay: day,
      completed: Array.from(completed),
      totalTime: time
    }));
  };

  const handleStart = () => {
    setIsStarted(true);
    saveProgress(true, activeDay, completedSessions, totalStudyTime);
  };

  const isLettres = bacSection === "LETTRES";
  const sectionLabel = getBacSectionLabel(bacSection);
  
  const vocabTheme = isLettres ? "Art, Littérature, et Enjeux Mondiaux" : "Innovation, Technologie et Environnement";
  const writingTheme = isLettres ? "Dissertation Argumentée (12 pts)" : "Opinion Essay Structuré (10 pts)";

  const plan: DayPlan[] = [
    {
      day: 1,
      title: "Jour 1: Fondamentaux & Diagnostic",
      focus: `Évaluation initiale adaptée à la section ${sectionLabel}`,
      duration: 240,
      sessions: [
        { time: "08:00", activity: "Diagnostic complet: Épreuve Type Bac", type: "mock", duration: 90 },
        { time: "09:45", activity: "Analyse des résultats et identification des lacunes", type: "review", duration: 15 },
        { time: "10:00", activity: "Grammaire: Les Tenses (Prétérit vs Present Perfect)", type: "grammar", duration: 60 },
        { time: "11:15", activity: `Vocabulaire Section: ${vocabTheme}`, type: "vocab", duration: 45 },
        { time: "14:00", activity: "Reading: Techniques d'écrémage (Skimming & Scanning)", type: "reading", duration: 45 },
        { time: "15:00", activity: `Writing: Planification de ${writingTheme}`, type: "writing", duration: 60 }
      ]
    },
    {
      day: 2,
      title: "Jour 2: Reading Mastery (12 Pts)",
      focus: "Garantir le maximum de points sur la compréhension",
      duration: 240,
      sessions: [
        { time: "08:00", activity: "Lecture Intensive: 3 Textes Nationaux Récents", type: "reading", duration: 60 },
        { time: "09:15", activity: "Stratégies pour les questions (True/False & Justification)", type: "reading", duration: 45 },
        { time: "10:15", activity: "Vocabulaire Contextuel (Synonymes & Antonymes)", type: "vocab", duration: 45 },
        { time: "11:15", activity: "Examen Blanc: Reading Comprehension Seulement", type: "mock", duration: 60 },
        { time: "14:00", activity: "Correction et analyse ciblée", type: "review", duration: 45 }
      ]
    },
    {
      day: 3,
      title: "Jour 3: Grammar Bootcamp",
      focus: "Les structures indispensables pour la section " + sectionLabel,
      duration: 240,
      sessions: [
        { time: "08:00", activity: "Conditionnel (Types 1, 2, 3) et Inversion", type: "grammar", duration: 60 },
        { time: "09:15", activity: "Voix Passive et Discours Rapporté", type: "grammar", duration: 60 },
        { time: "10:30", activity: "Phrasal Verbs les plus fréquents au Bac", type: "vocab", duration: 45 },
        { time: "11:30", activity: "Les Connecteurs Logiques Essentiels", type: "grammar", duration: 45 },
        { time: "14:00", activity: "Drill Grammatical Intensif", type: "mock", duration: 60 },
        { time: "15:15", activity: "Correction: Pièges classiques corrigés", type: "review", duration: 30 }
      ]
    },
    {
      day: 4,
      title: "Jour 4: Writing Workshop",
      focus: "Maximiser le score de production écrite",
      duration: 240,
      sessions: [
        { time: "08:00", activity: `Méthodologie de ${writingTheme}`, type: "writing", duration: 45 },
        { time: "09:00", activity: "Atelier: Rédiger des introductions accrocheuses", type: "writing", duration: 60 },
        { time: "10:15", activity: "Atelier: Développer des paragraphes cohérents", type: "writing", duration: 30 },
        { time: "10:50", activity: "Pratique Guidée: Essai Complet 1", type: "writing", duration: 60 },
        { time: "14:00", activity: "Auto-correction avec l'IA du Writing Lab", type: "review", duration: 45 },
        { time: "15:00", activity: "Pratique Libre: Essai Complet 2", type: "writing", duration: 60 }
      ]
    },
    {
      day: 5,
      title: "Jour 5: Consolidation & Modules",
      focus: "Revue des modules officiels (Modules 3, 6, 8)",
      duration: 240,
      sessions: [
        { time: "08:00", activity: `Thématique phare: ${isLettres ? 'Littérature & Société' : 'Développement Durable'}`, type: "vocab", duration: 60 },
        { time: "09:15", activity: "Expressions Idiomatiques de haut niveau", type: "vocab", duration: 45 },
        { time: "10:15", activity: "Pratique Grammaire: Les erreurs à éviter absolument", type: "grammar", duration: 45 },
        { time: "11:15", activity: "Reading: Texte complexe de section " + sectionLabel, type: "reading", duration: 30 },
        { time: "14:00", activity: "Simulation: Expression Écrite (Condition Bac)", type: "mock", duration: 90 },
        { time: "15:45", activity: "Feedback et notation", type: "review", duration: 30 }
      ]
    },
    {
      day: 6,
      title: "Jour 6: Full Mock Simulation",
      focus: "Examen blanc complet en conditions réelles",
      duration: 240,
      sessions: [
        { time: "08:00", activity: `Épreuve Nationale ${sectionLabel} (3 Heures)`, type: "mock", duration: 180 },
        { time: "11:15", activity: "Pause & Décompression", type: "review", duration: 60 },
        { time: "14:00", activity: "Correction Détaillée avec Corrigé Officiel", type: "review", duration: 90 },
        { time: "15:45", activity: "Ciblage des ajustements de dernière minute", type: "review", duration: 30 }
      ]
    },
    {
      day: 7,
      title: "Jour 7: Final Sprint & Mindset",
      focus: "Affinage final et préparation mentale",
      duration: 180,
      sessions: [
        { time: "08:00", activity: "Review express: Top 50 mots de vocabulaire", type: "vocab", duration: 60 },
        { time: "09:15", activity: "Drill: Exercices rapides sur les ultimes faiblesses", type: "grammar", duration: 45 },
        { time: "10:15", activity: "Lecture inspirante et fluide", type: "reading", duration: 30 },
        { time: "10:50", activity: "Stratégies de gestion du stress et du brouillon", type: "review", duration: 15 },
        { time: "14:00", activity: "Review: Formules de conclusion pour le writing", type: "writing", duration: 45 },
        { time: "15:00", activity: "Mot de la fin: Vous êtes prêts pour le jour J", type: "review", duration: 15 }
      ]
    }
  ];

  const currentPlan = plan.find(d => d.day === activeDay) || plan[0];

  const markSessionComplete = (day: number, sessionIdx: number) => {
    const key = `${day}-${sessionIdx}`;
    const newCompleted = new Set(completedSessions);
    let newTotalTime = totalStudyTime;
    
    if (newCompleted.has(key)) {
      newCompleted.delete(key);
      newTotalTime -= currentPlan.sessions[sessionIdx].duration;
    } else {
      newCompleted.add(key);
      newTotalTime += currentPlan.sessions[sessionIdx].duration;
    }
    
    setCompletedSessions(newCompleted);
    setTotalStudyTime(newTotalTime);
    saveProgress(true, activeDay, newCompleted, newTotalTime);
  };

  const getProgress = () => {
    const totalSessions = plan.reduce((acc, d) => acc + d.sessions.length, 0);
    return Math.round((completedSessions.size / totalSessions) * 100);
  };

  const changeDay = (day: number) => {
    setActiveDay(day);
    saveProgress(true, day, completedSessions, totalStudyTime);
  };

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h${mins > 0 ? mins : ''}`;
  };

  if (!isStarted) {
    return (
      <div className="page-stack" style={{ padding: "60px 20px", maxWidth: "900px", margin: "0 auto" }}>
        <div className="card stack card-vibrant micro-bounce" style={{ padding: "60px", textAlign: "center", border: "2px solid var(--primary)", position: "relative", overflow: "hidden" }}>
          
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% -20%, var(--primary-glow), transparent 70%)", zIndex: 0 }} />
          
          <div style={{ position: "relative", zIndex: 1 }} className="stack">
            <span className="eyebrow" style={{ color: "var(--primary)", fontSize: "1rem", letterSpacing: "2px" }}>PROGRAMME INTENSIF PERSONNALISÉ</span>
            <h1 className="section-title text-gradient" style={{ fontSize: "3.5rem", marginTop: "10px", lineHeight: "1" }}>BAC WEEK</h1>
            
            <div className="pill" style={{ margin: "10px auto 0", background: "rgba(99, 102, 241, 0.2)", fontSize: "14px", padding: "8px 20px" }}>
              Spécialement adapté pour la section <strong>{sectionLabel}</strong>
            </div>

            <p className="muted" style={{ fontSize: "1.2rem", maxWidth: "600px", margin: "20px auto 30px" }}>
              7 jours d'entraînement hardcore. 4 heures par jour de pratique stratégique. 
              Générez votre roadmap ciblée pour garantir l'excellence le jour de l'épreuve nationale.
            </p>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginTop: "20px", textAlign: "center" }}>
              <div className="card real-glass" style={{ padding: "30px" }}>
                <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--primary)" }}>7</div>
                <div className="muted font-bold text-sm">Jours Intensifs</div>
              </div>
              <div className="card real-glass" style={{ padding: "30px" }}>
                <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--primary)" }}>28h</div>
                <div className="muted font-bold text-sm">Pratique Ciblée</div>
              </div>
              <div className="card real-glass" style={{ padding: "30px" }}>
                <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--success)" }}>+{targetScore}/20</div>
                <div className="muted font-bold text-sm">Score Objectif</div>
              </div>
            </div>

            <button 
              onClick={handleStart}
              className="button-link hover-glow"
              style={{ 
                background: "linear-gradient(90deg, var(--primary), #a855f7)", 
                color: "white", 
                padding: "20px 60px", 
                fontSize: "1.2rem",
                fontWeight: 900,
                marginTop: "40px",
                border: "none",
                display: "inline-flex",
                justifyContent: "center",
                alignSelf: "center",
                boxShadow: "0 10px 30px var(--primary-glow)"
              }}
            >
              GÉNÉRER MA ROADMAP BAC WEEK 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-stack fade-in" style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* Dynamic Header */}
      <div className="card real-glass mb-8" style={{ padding: "30px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px", borderTop: "4px solid var(--primary)" }}>
        <div>
          <span className="pill mb-2" style={{ background: "rgba(255,255,255,0.1)", color: "white", marginBottom: "8px", display: "inline-block" }}>
            Cible: {targetScore}/20 · Section {sectionLabel}
          </span>
          <h1 className="section-title text-gradient" style={{ fontSize: "2rem", margin: "8px 0" }}>BAC WEEK - Jour {activeDay}</h1>
          <p className="text-white opacity-80" style={{ margin: 0, fontSize: "1.2rem", fontWeight: 600 }}>{currentPlan.title}</p>
        </div>
        
        <div style={{ display: "flex", gap: "30px", alignItems: "center", background: "rgba(0,0,0,0.3)", padding: "20px 30px", borderRadius: "20px" }}>
          <div style={{ textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.1)", paddingRight: "30px" }}>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--primary)" }}>{getProgress()}%</div>
            <div className="muted" style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>Progression</div>
          </div>
          <div style={{ textAlign: "center", borderRight: "1px solid rgba(255,255,255,0.1)", paddingRight: "30px" }}>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--success)" }}>{formatTime(totalStudyTime)}</div>
            <div className="muted" style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>Heures Étudiées</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--accent)" }}>{completedSessions.size}</div>
            <div className="muted" style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>Sessions Fini</div>
          </div>
        </div>
      </div>

      {/* Day Selector Ribbon */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "30px", overflowX: "auto", paddingBottom: "10px", scrollbarWidth: "none" }}>
        {plan.map((day) => {
          const isPast = day.day < activeDay;
          const isActive = day.day === activeDay;
          return (
            <button
              key={day.day}
              onClick={() => changeDay(day.day)}
              className="hover-lift"
              style={{
                padding: "20px 30px",
                borderRadius: "16px",
                border: isActive ? "2px solid var(--primary)" : "1px solid rgba(255,255,255,0.1)",
                background: isActive ? "rgba(99, 102, 241, 0.1)" : "rgba(10,10,15,0.6)",
                color: "white",
                fontWeight: 800,
                cursor: "pointer",
                whiteSpace: "nowrap",
                opacity: isPast ? 0.7 : 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
                minWidth: "140px"
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>Jour {day.day}</span>
              {isActive && <div style={{ height: "4px", width: "20px", background: "var(--primary)", borderRadius: "4px" }} />}
            </button>
          )
        })}
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr 340px", gap: "30px", alignItems: "start" }}>
        {/* Day Content */}
        <div className="card" style={{ padding: "40px" }}>
          <div style={{ marginBottom: "40px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "30px" }}>
            <h2 className="section-title mb-2" style={{ fontSize: "2rem" }}>{currentPlan.title}</h2>
            <p className="muted" style={{ fontSize: "1.1rem" }}>{currentPlan.focus}</p>
            <div style={{ marginTop: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <span className="pill" style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white" }}>⏱️ {formatTime(currentPlan.duration)} Planifiés</span>
              <span className="pill" style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white" }}>🎯 {currentPlan.sessions.length} Missions</span>
            </div>
          </div>

          {/* Sessions List */}
          <div className="stack" style={{ gap: "20px" }}>
            {currentPlan.sessions.map((session, idx) => {
              const isCompleted = completedSessions.has(`${activeDay}-${idx}`);
              
              const typeColors = {
                reading: "#3b82f6",
                grammar: "#8b5cf6",
                writing: "#f59e0b",
                mock: "#ef4444",
                review: "#10b981",
                vocab: "#ec4899"
              };
              
              const typeIcons = {
                reading: "📖",
                grammar: "📐",
                writing: "✍️",
                mock: "🏆",
                review: "💡",
                vocab: "🗣"
              };

              const color = typeColors[session.type];
              const icon = typeIcons[session.type];

              return (
                <div
                  key={idx}
                  className="card hover-lift"
                  style={{
                    padding: "24px 30px",
                    display: "flex",
                    alignItems: "center",
                    gap: "24px",
                    background: isCompleted ? "rgba(16, 185, 129, 0.05)" : "rgba(255,255,255,0.02)",
                    border: isCompleted ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(255,255,255,0.05)",
                    transition: "all 0.3s ease",
                    borderLeft: !isCompleted ? `4px solid ${color}` : `4px solid var(--success)`
                  }}
                >
                  <div style={{ 
                    fontSize: "1.3rem", 
                    fontWeight: 900, 
                    color: isCompleted ? "var(--success)" : "white",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    {session.time}
                    <span style={{ fontSize: "0.8rem", color: color, background: `${color}20`, padding: "2px 8px", borderRadius: "10px", fontWeight: 700 }}>
                      {session.duration}m
                    </span>
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <span style={{ fontSize: "1.2rem" }}>{icon}</span>
                      <span style={{ fontSize: "0.85rem", color: color, fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px" }}>{session.type}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: "1.1rem", color: isCompleted ? "var(--ink-dim)" : "white", textDecoration: isCompleted ? "line-through" : "none" }}>
                      {session.activity}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => markSessionComplete(activeDay, idx)}
                    style={{
                      padding: "14px 24px",
                      borderRadius: "12px",
                      border: "none",
                      background: isCompleted ? "rgba(16, 185, 129, 0.2)" : "rgba(255,255,255,0.05)",
                      color: isCompleted ? "var(--success)" : "white",
                      cursor: "pointer",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                      if (!isCompleted) e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isCompleted) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    }}
                  >
                    {isCompleted ? (
                      <>
                        <span style={{ fontSize: "1.2rem" }}>✓</span> DONE
                      </>
                    ) : (
                      "Marquer Fait"
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="stack" style={{ gap: "20px" }}>
          <div className="card real-glass" style={{ padding: "30px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <h3 className="section-title mb-4" style={{ fontSize: "1.2rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "15px", marginBottom: "20px" }}>Quick Tools</h3>
            <div className="stack" style={{ gap: "12px" }}>
              <Link href="/write" style={{ textDecoration: "none" }}>
                <div className="card-interactive hover-lift" style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "1.5rem" }}>✍️</span>
                  <div>
                    <div style={{ fontWeight: 700, color: "white" }}>Writing Lab</div>
                    <div className="muted" style={{ fontSize: "0.85rem" }}>Pratique Guidée</div>
                  </div>
                </div>
              </Link>
              <Link href="/exams" style={{ textDecoration: "none" }}>
                <div className="card-interactive hover-lift" style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "1.5rem" }}>🏆</span>
                  <div>
                    <div style={{ fontWeight: 700, color: "white" }}>Exams Archive</div>
                    <div className="muted" style={{ fontSize: "0.85rem" }}>Sujets de Bac</div>
                  </div>
                </div>
              </Link>
              <Link href="/lessons" style={{ textDecoration: "none" }}>
                <div className="card-interactive hover-lift" style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "1.5rem" }}>📚</span>
                  <div>
                    <div style={{ fontWeight: 700, color: "white" }}>Library</div>
                    <div className="muted" style={{ fontSize: "0.85rem" }}>Vocab & Grammaire</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="card border-0" style={{ padding: "30px", background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))", borderRadius: "24px" }}>
             <h3 className="font-bold text-white mb-2 leading-tight" style={{ fontSize: "1.1rem" }}>"Le succès est la somme de petits efforts, répétés jour après jour."</h3>
             <p className="muted text-sm mt-4">— Bac Excellence AI System</p>
          </div>
        </div>
      </div>
    </div>
  );
}
