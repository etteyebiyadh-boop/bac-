"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/**
 * BAC WEEK INTENSIVE MODE
 * 7-day intensive preparation program for Tunisian BAC students
 * Features: Daily 4-hour study blocks, timed practice exams, grammar drills,
 * vocabulary marathons, writing workshops, and progress tracking
 */

type DayPlan = {
  day: number;
  title: string;
  focus: string;
  duration: number; // minutes
  sessions: {
    time: string;
    activity: string;
    type: "reading" | "grammar" | "writing" | "mock" | "review" | "vocab";
    duration: number;
  }[];
};

const BAC_WEEK_PLAN: DayPlan[] = [
  {
    day: 1,
    title: "Jour 1: Fondamentaux & Diagnostic",
    focus: "Évaluer le niveau actuel et réviser les bases",
    duration: 240,
    sessions: [
      { time: "08:00", activity: "Diagnostic complet (Lecture + Langue)", type: "mock", duration: 90 },
      { time: "09:45", activity: "Pause & Analyse des résultats", type: "review", duration: 15 },
      { time: "10:00", activity: "Révision des règles grammaticales essentielles", type: "grammar", duration: 60 },
      { time: "11:15", activity: "Vocabulaire thématique - Module 1", type: "vocab", duration: 45 },
      { time: "14:00", activity: "Techniques de lecture rapide", type: "reading", duration: 45 },
      { time: "15:00", activity: "Exercices d'expression écrite guidée", type: "writing", duration: 60 },
    ]
  },
  {
    day: 2,
    title: "Jour 2: Reading Mastery",
    focus: "Maîtriser la compréhension et l'analyse de textes",
    duration: 240,
    sessions: [
      { time: "08:00", activity: "Lecture intensive - 3 textes variés", type: "reading", duration: 60 },
      { time: "09:15", activity: "Analyse structurée des textes", type: "reading", duration: 45 },
      { time: "10:15", activity: "Stratégies de questions de compréhension", type: "reading", duration: 45 },
      { time: "11:15", activity: "Examen blanc - Partie Lecture", type: "mock", duration: 60 },
      { time: "14:00", activity: "Correction et analyse des erreurs", type: "review", duration: 45 },
    ]
  },
  {
    day: 3,
    title: "Jour 3: Grammar Bootcamp",
    focus: "Consolider toutes les structures grammaticales clés",
    duration: 240,
    sessions: [
      { time: "08:00", activity: "Les temps du passé (Prétérit / Present Perfect)", type: "grammar", duration: 60 },
      { time: "09:15", activity: "Conditionnels et structures hypothétiques", type: "grammar", duration: 60 },
      { time: "10:30", activity: "Voix passive et discours rapporté", type: "grammar", duration: 45 },
      { time: "11:30", activity: "Connecteurs logiques et articulation", type: "grammar", duration: 45 },
      { time: "14:00", activity: "Examen blanc - Partie Langue", type: "mock", duration: 60 },
      { time: "15:15", activity: "Révision ciblée des points faibles", type: "review", duration: 30 },
    ]
  },
  {
    day: 4,
    title: "Jour 4: Writing Workshop",
    focus: "Perfectionner l'expression écrite",
    duration: 240,
    sessions: [
      { time: "08:00", activity: "Structure de la dissertation argumentée", type: "writing", duration: 45 },
      { time: "09:00", activity: "Rédaction - Introduction et conclusion", type: "writing", duration: 60 },
      { time: "10:15", activity: "Connecteurs et transitions", type: "writing", duration: 30 },
      { time: "10:50", activity: "Écriture guidée - Essai 1", type: "writing", duration: 60 },
      { time: "14:00", activity: "Feedback et amélioration", type: "review", duration: 45 },
      { time: "15:00", activity: "Écriture libre - Essai 2", type: "writing", duration: 60 },
    ]
  },
  {
    day: 5,
    title: "Jour 5: Vocabulary & Expression",
    focus: "Enrichir le lexique et la fluidité",
    duration: 240,
    sessions: [
      { time: "08:00", activity: "Vocabulaire académique avancé", type: "vocab", duration: 60 },
      { time: "09:15", activity: "Expressions idiomatiques et tournures", type: "vocab", duration: 45 },
      { time: "10:15", activity: "Thèmes de société contemporaine", type: "vocab", duration: 45 },
      { time: "11:15", activity: "Faux amis et traductions", type: "vocab", duration: 30 },
      { time: "14:00", activity: "Examen blanc - Expression écrite", type: "mock", duration: 90 },
      { time: "15:45", activity: "Auto-évaluation", type: "review", duration: 30 },
    ]
  },
  {
    day: 6,
    title: "Jour 6: Full Mock Simulation",
    focus: "Simulation complète en conditions réelles",
    duration: 240,
    sessions: [
      { time: "08:00", activity: "Examen blanc complet - 3 heures", type: "mock", duration: 180 },
      { time: "11:15", activity: "Pause déjeuner", type: "review", duration: 60 },
      { time: "14:00", activity: "Correction détaillée avec notes", type: "review", duration: 90 },
      { time: "15:45", activity: "Plan d'action pour le dernier jour", type: "review", duration: 30 },
    ]
  },
  {
    day: 7,
    title: "Jour 7: Final Sprint & Confiance",
    focus: "Révision ciblée et préparation mentale",
    duration: 180,
    sessions: [
      { time: "08:00", activity: "Révision express des points clés", type: "review", duration: 60 },
      { time: "09:15", activity: "Exercices rapides sur les faiblesses identifiées", type: "grammar", duration: 45 },
      { time: "10:15", activity: "Lecture d'un texte inspirant", type: "reading", duration: 30 },
      { time: "10:50", activity: "Méditation et visualisation positive", type: "review", duration: 15 },
      { time: "14:00", activity: "Révision finale des formules et stratégies", type: "review", duration: 45 },
      { time: "15:00", activity: "Message de motivation et check-list finale", type: "review", duration: 15 },
    ]
  }
];

export default function BacWeekIntensive() {
  const router = useRouter();
  const [activeDay, setActiveDay] = useState(1);
  const [completedSessions, setCompletedSessions] = useState<Set<string>>(new Set());
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const currentPlan = BAC_WEEK_PLAN.find(d => d.day === activeDay) || BAC_WEEK_PLAN[0];

  const markSessionComplete = (day: number, sessionIdx: number) => {
    const key = `${day}-${sessionIdx}`;
    const newCompleted = new Set(completedSessions);
    if (newCompleted.has(key)) {
      newCompleted.delete(key);
      setTotalStudyTime(prev => prev - currentPlan.sessions[sessionIdx].duration);
    } else {
      newCompleted.add(key);
      setTotalStudyTime(prev => prev + currentPlan.sessions[sessionIdx].duration);
    }
    setCompletedSessions(newCompleted);
  };

  const getProgress = () => {
    const totalSessions = BAC_WEEK_PLAN.reduce((acc, day) => acc + day.sessions.length, 0);
    return Math.round((completedSessions.size / totalSessions) * 100);
  };

  const formatTime = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h${mins > 0 ? mins : ''}`;
  };

  if (!isStarted) {
    return (
      <div className="page-stack" style={{ padding: "60px 20px", maxWidth: "900px", margin: "0 auto" }}>
        <div className="card stack" style={{ padding: "60px", textAlign: "center", border: "2px solid var(--primary)" }}>
          <span className="eyebrow" style={{ color: "var(--primary)", fontSize: "1rem" }}>PROGRAMME INTENSIF</span>
          <h1 className="section-title" style={{ fontSize: "2.5rem", marginTop: "20px" }}>BAC WEEK</h1>
          <p className="muted" style={{ fontSize: "1.2rem", marginTop: "20px", maxWidth: "600px", margin: "20px auto" }}>
            7 jours d'entraînement intensif pour maximiser vos chances au BAC. 
            4 heures par jour de pratique ciblée avec examens blancs, 
            révisions grammaticales et ateliers d'écriture.
          </p>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginTop: "40px", textAlign: "center" }}>
            <div className="card" style={{ padding: "30px" }}>
              <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--primary)" }}>7</div>
              <div className="muted">Jours Intensifs</div>
            </div>
            <div className="card" style={{ padding: "30px" }}>
              <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--primary)" }}>28h</div>
              <div className="muted">De Pratique Totale</div>
            </div>
            <div className="card" style={{ padding: "30px" }}>
              <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--primary)" }}>3</div>
              <div className="muted">Examens Blancs</div>
            </div>
          </div>

          <button 
            onClick={() => setIsStarted(true)}
            className="button-link hover-glow"
            style={{ 
              background: "var(--primary)", 
              color: "black", 
              padding: "20px 60px", 
              fontSize: "1.2rem",
              fontWeight: 900,
              marginTop: "40px"
            }}
          >
            COMMENCER MA BAC WEEK
          </button>
          
          <p className="muted" style={{ fontSize: "0.9rem", marginTop: "30px" }}>
            Recommandé 2-3 semaines avant l'examen officiel du BAC
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-stack" style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header Stats */}
      <div className="card" style={{ padding: "30px", marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", margin: 0 }}>BAC WEEK - Jour {activeDay}/7</h1>
          <p className="muted" style={{ margin: "8px 0 0 0" }}>{currentPlan.title}</p>
        </div>
        <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--primary)" }}>{getProgress()}%</div>
            <div className="muted" style={{ fontSize: "0.85rem" }}>Progression</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--success)" }}>{formatTime(totalStudyTime)}</div>
            <div className="muted" style={{ fontSize: "0.85rem" }}>Étudié</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--warning)" }}>{completedSessions.size}</div>
            <div className="muted" style={{ fontSize: "0.85rem" }}>Sessions</div>
          </div>
        </div>
      </div>

      {/* Day Selector */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "30px", overflowX: "auto", paddingBottom: "10px" }}>
        {BAC_WEEK_PLAN.map((day) => (
          <button
            key={day.day}
            onClick={() => setActiveDay(day.day)}
            style={{
              padding: "15px 25px",
              borderRadius: "12px",
              border: "none",
              background: activeDay === day.day ? "var(--primary)" : "rgba(255,255,255,0.05)",
              color: activeDay === day.day ? "black" : "white",
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
              opacity: day.day < activeDay ? 0.6 : 1
            }}
          >
            Jour {day.day}
          </button>
        ))}
      </div>

      {/* Day Content */}
      <div className="card" style={{ padding: "40px" }}>
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "8px" }}>{currentPlan.title}</h2>
          <p className="muted">{currentPlan.focus}</p>
          <div style={{ marginTop: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <span className="pill">{formatTime(currentPlan.duration)} de pratique</span>
            <span className="pill">{currentPlan.sessions.length} sessions</span>
          </div>
        </div>

        {/* Sessions List */}
        <div className="stack" style={{ gap: "15px" }}>
          {currentPlan.sessions.map((session, idx) => {
            const isCompleted = completedSessions.has(`${activeDay}-${idx}`);
            return (
              <div
                key={idx}
                className="card"
                style={{
                  padding: "20px 25px",
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  background: isCompleted ? "rgba(74, 222, 128, 0.1)" : "rgba(255,255,255,0.02)",
                  border: isCompleted ? "1px solid var(--success)" : "1px solid rgba(255,255,255,0.05)"
                }}
              >
                <div style={{ minWidth: "60px", fontWeight: 700, color: "var(--primary)" }}>
                  {session.time}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{session.activity}</div>
                  <div className="muted" style={{ fontSize: "0.85rem", marginTop: "4px" }}>
                    {session.duration} min · {session.type.toUpperCase()}
                  </div>
                </div>
                <button
                  onClick={() => markSessionComplete(activeDay, idx)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "none",
                    background: isCompleted ? "var(--success)" : "rgba(255,255,255,0.1)",
                    color: isCompleted ? "black" : "white",
                    cursor: "pointer",
                    fontWeight: 600
                  }}
                >
                  {isCompleted ? "✓ Fait" : "Marquer fait"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div style={{ marginTop: "40px", paddingTop: "30px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <Link href="/exams">
            <button className="button-link" style={{ background: "rgba(255,255,255,0.1)", padding: "15px 30px" }}>
              📝 Examens Blancs
            </button>
          </Link>
          <Link href="/lessons">
            <button className="button-link" style={{ background: "rgba(255,255,255,0.1)", padding: "15px 30px" }}>
              📚 Leçons
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="button-link" style={{ background: "rgba(255,255,255,0.1)", padding: "15px 30px" }}>
              📊 Dashboard
            </button>
          </Link>
        </div>
      </div>

      {/* Motivation Footer */}
      <div style={{ marginTop: "30px", textAlign: "center", padding: "30px" }}>
        <p className="muted" style={{ fontSize: "1.1rem", fontStyle: "italic" }}>
          "Le succès n'est pas final, l'échec n'est pas fatal: c'est le courage de continuer qui compte."
        </p>
        <p className="muted" style={{ fontSize: "0.9rem", marginTop: "10px" }}>
          — Winston Churchill
        </p>
      </div>
    </div>
  );
}
