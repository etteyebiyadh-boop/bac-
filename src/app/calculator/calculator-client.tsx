"use client";

import { useState, useMemo } from "react";
import { BAC_SECTIONS_CALC, BacSectionData } from "@/lib/bac-calculator-data";
import { SiteLanguage, translations } from "@/lib/translations";

interface Props {
  lang: SiteLanguage;
}

export function BacCalculator({ lang }: Props) {
  const t = translations[lang];
  const [selectedSectionId, setSelectedSectionId] = useState<string>(BAC_SECTIONS_CALC[0].id);
  const [grades, setGrades] = useState<Record<string, number>>({});

  const section = useMemo(() => 
    BAC_SECTIONS_CALC.find(s => s.id === selectedSectionId) || BAC_SECTIONS_CALC[0],
    [selectedSectionId]
  );

  const [targetAverage, setTargetAverage] = useState<number>(14);

  const calculateAverage = () => {
    let totalPoints = 0;
    let totalCoef = 0;

    section.subjects.forEach(sub => {
      const grade = grades[sub.id] || 0;
      totalPoints += grade * sub.coef;
      totalCoef += sub.coef;
    });

    return totalCoef > 0 ? (totalPoints / totalCoef).toFixed(2) : "0.00";
  };

  const average = calculateAverage();
  const avgNum = parseFloat(average);

  // Target Optimization Logic
  const getRequiredForTarget = () => {
    let currentPoints = 0;
    let totalCoef = 0;
    let unenteredCoef = 0;

    section.subjects.forEach(sub => {
      const grade = grades[sub.id];
      if (grade !== undefined && grade !== 0) {
        currentPoints += grade * sub.coef;
      } else {
        unenteredCoef += sub.coef;
      }
      totalCoef += sub.coef;
    });

    const targetPoints = targetAverage * totalCoef;
    const remainingPoints = targetPoints - currentPoints;

    if (unenteredCoef === 0) return null;
    return (remainingPoints / unenteredCoef).toFixed(2);
  };

  const requiredAvg = getRequiredForTarget();

  const getMention = (avg: number) => {
    if (lang === "ar") {
      if (avg >= 16) return "حسن جداً";
      if (avg >= 14) return "حسن";
      if (avg >= 12) return "قريب من الحسن";
      if (avg >= 10) return "مقبول";
      return "دون المتوسط";
    }
    if (lang === "fr") {
      if (avg >= 16) return "Très Bien";
      if (avg >= 14) return "Bien";
      if (avg >= 12) return "Assez Bien";
      if (avg >= 10) return "Passable";
      return "Ajourné";
    }
    if (avg >= 16) return "Very Good";
    if (avg >= 14) return "Good";
    if (avg >= 12) return "Fair";
    if (avg >= 10) return "Pass";
    return "Fail";
  };

  const handleGradeChange = (id: string, val: string) => {
    const num = Math.min(20, Math.max(0, parseFloat(val) || 0));
    setGrades(prev => ({ ...prev, [id]: num }));
  };

  return (
    <div className="stack" style={{ gap: "40px" }}>
      <div className="card" style={{ padding: "32px", background: "rgba(99, 102, 241, 0.05)" }}>
        <h3 style={{ marginBottom: "20px" }}>{t.calc_select_section}</h3>
        <div className="row-between" style={{ flexWrap: "wrap", gap: "10px" }}>
          {BAC_SECTIONS_CALC.map(s => (
            <button 
              key={s.id}
              onClick={() => { setSelectedSectionId(s.id); setGrades({}); }}
              className={`pill ${selectedSectionId === s.id ? 'active' : ''}`}
              style={{ 
                cursor: "pointer", 
                background: selectedSectionId === s.id ? "var(--primary)" : "transparent",
                color: selectedSectionId === s.id ? "white" : "var(--primary)",
                border: "1px solid var(--primary)"
              }}
            >
              {lang === "ar" ? s.nameAr : (lang === "fr" ? s.nameFr : s.nameEn)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "40px" }}>
        <div className="card stack" style={{ padding: "40px" }}>
          <div className="row-between" style={{ paddingBottom: "10px", borderBottom: "1px solid var(--glass-border)", opacity: 0.6, fontSize: "12px", fontWeight: 800 }}>
             <span style={{ flex: 2 }}>{t.calc_subject}</span>
             <span style={{ flex: 1, textAlign: "center" }}>{t.calc_coef}</span>
             <span style={{ flex: 1, textAlign: "right" }}>{t.calc_grade}</span>
          </div>

          <div className="stack" style={{ gap: "12px" }}>
            {section.subjects.map(sub => (
              <div key={sub.id} className="row-between" style={{ padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                <span style={{ flex: 2, fontWeight: 600 }}>{lang === "ar" ? sub.nameAr : (lang === "fr" ? sub.nameFr : sub.nameEn)}</span>
                <span style={{ flex: 1, textAlign: "center", opacity: 0.6 }}>x{sub.coef}</span>
                <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
                   <input 
                     type="number" 
                     placeholder="0.00"
                     min="0"
                     max="20"
                     step="0.25"
                     value={grades[sub.id] || ""}
                     onChange={(e) => handleGradeChange(sub.id, e.target.value)}
                     style={{ 
                       width: "80px", 
                       padding: "8px", 
                       fontSize: "16px", 
                       fontWeight: 800, 
                       textAlign: "center",
                       background: "rgba(255,255,255,0.05)",
                       border: "1px solid var(--glass-border)",
                       borderRadius: "8px",
                       color: "white"
                     }}
                   />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="stack" style={{ gap: "24px" }}>
          <div className="card stack" style={{ padding: "40px", textAlign: "center", border: "2px solid var(--primary-glow)", position: "sticky", top: "120px" }}>
            <span className="eyebrow">{t.calc_average}</span>
            <div style={{ fontSize: "5rem", fontWeight: 900, fontFamily: "var(--font-display)", color: "white", textShadow: "0 0 30px var(--primary-glow)" }}>
              {average}
            </div>
            <div className="pill" style={{ 
              alignSelf: "center", 
              background: avgNum >= 10 ? "var(--success)" : "var(--error)", 
              color: "white", 
              fontSize: "1.2rem", 
              padding: "8px 24px" 
            }}>
              {getMention(avgNum)}
            </div>
            
            <div style={{ marginTop: "32px", paddingTop: "32px", borderTop: "1px solid var(--glass-border)" }}>
               <div className="row-between" style={{ marginBottom: "12px" }}>
                 <span className="muted" style={{ fontSize: "12px" }}>{t.calc_target}</span>
                 <input 
                   type="range" min="10" max="20" step="0.5" 
                   value={targetAverage} 
                   onChange={(e) => setTargetAverage(parseFloat(e.target.value))}
                   style={{ flex: 1, margin: "0 12px" }} 
                 />
                 <strong style={{ fontSize: "1.2rem", color: "var(--accent)" }}>{targetAverage.toFixed(1)}</strong>
               </div>

               {requiredAvg ? (
                 <div className="card" style={{ padding: "16px", background: "rgba(99, 102, 241, 0.1)", border: "1px solid var(--primary-glow)" }}>
                   <span className="muted" style={{ fontSize: "11px", display: "block", marginBottom: "4px" }}>REQUIRED AVG. (REMAINING)</span>
                   <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--primary)" }}>{requiredAvg}</div>
                 </div>
               ) : (
                 <div className="card" style={{ padding: "16px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid var(--success)" }}>
                   <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--success)" }}>🎉 TARGET REACHED</span>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
