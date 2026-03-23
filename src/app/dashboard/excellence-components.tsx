"use client";

import Link from "next/link";
import { SiteLanguage, translations } from "@/lib/translations";

export function OverallProgress() {
  return (
    <div className="real-glass stack" style={{ padding: "32px", height: "100%", background: "rgba(10,10,20,0.6)" }}>
      <div className="row-between" style={{ marginBottom: "16px" }}>
        <h3 className="eyebrow" style={{ margin: 0, fontSize: "12px" }}>OVERALL PROGRESS</h3>
        <span style={{ fontSize: "1rem", opacity: 0.3 }}>•••</span>
      </div>
      
      <div className="row-between" style={{ gap: "32px", marginBottom: "32px" }}>
         <div className="chart-ring" style={{ "--progress": 78 } as any}>
            <div className="chart-ring-text">78%</div>
         </div>
         <div className="stack" style={{ flex: 1, gap: "10px" }}>
            {['A', 'B', 'C', 'D'].map((label, i) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                 <span style={{ fontSize: "10px", width: "12px", opacity: 0.5, fontWeight: 700 }}>{label}</span>
                 <div style={{ height: "6px", flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: "10px" }}>
                    <div style={{ height: "100%", width: `${90 - i*15}%`, background: `linear-gradient(to right, var(--primary), var(--accent))`, borderRadius: "inherit" }} />
                 </div>
              </div>
            ))}
         </div>
      </div>

      <div className="stack" style={{ gap: "12px" }}>
         <div className="row-between">
            <span style={{ fontWeight: 800, fontSize: "12px", opacity: 0.7 }}>STUDY HOURS</span>
            <span style={{ fontSize: "10px", color: "var(--success)", fontWeight: 800 }}>↗ TREND</span>
         </div>
         <svg width="100%" height="50" viewBox="0 0 100 40" preserveAspectRatio="none">
            <path d="M0,35 Q10,15 20,30 T40,15 T60,35 T80,10 L100,5" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" />
            <path d="M0,35 Q10,15 20,30 T40,15 T60,35 T80,10 L100,5 L100,40 L0,40 Z" fill="rgba(99,102,241,0.05)" />
         </svg>
         <div className="row-between" style={{ fontSize: "10px", opacity: 0.2, fontWeight: 700 }}>
            <span>0</span><span>6</span><span>12</span><span>18</span><span>24</span>
         </div>
      </div>
    </div>
  );
}

export function GradePredictions() {
  return (
    <div className="real-glass stack" style={{ padding: "32px", height: "100%", background: "rgba(10,10,20,0.6)" }}>
      <div className="row-between" style={{ marginBottom: "16px" }}>
        <h3 className="eyebrow" style={{ margin: 0, fontSize: "12px" }}>GRADE PREDICTIONS</h3>
        <span style={{ fontSize: "1rem", opacity: 0.3 }}>•••</span>
      </div>

      <div style={{ padding: "24px", background: "rgba(245, 158, 11, 0.05)", borderRadius: "20px", border: "1px solid rgba(245, 158, 11, 0.2)", textAlign: "center", marginBottom: "32px", position: "relative", overflow: "hidden" }}>
         <div style={{ position: "absolute", top: 0, right: 0, padding: "8px 12px", background: "rgba(245,158,11,0.1)", fontSize: "10px", fontWeight: 800 }}>TARGET: 19.0</div>
         <div style={{ fontSize: "3.5rem", fontWeight: "900", fontFamily: "var(--font-display)", color: "var(--accent)", textShadow: "0 0 40px rgba(245, 158, 11, 0.3)" }}>
            17.5<span style={{ fontSize: "1.2rem", opacity: 0.5 }}>/20</span>
         </div>
      </div>

      <div className="grid grid-cols-3" style={{ gap: "10px" }}>
         {[
           { label: 'Mat', score: 18.1, color: "var(--primary)" },
           { label: 'His', score: 16.8, color: "var(--accent)" },
           { label: 'Sci', score: 17.0, color: "var(--success)" }
         ].map(s => (
           <div key={s.label} className="stack" style={{ alignItems: "center", gap: "8px" }}>
              <div style={{ width: "100%", height: "60px", background: "rgba(255,255,255,0.02)", borderRadius: "10px", position: "relative", display: "flex", alignItems: "flex-end", padding: "4px" }}>
                 <div style={{ width: "100%", height: `${(s.score/20)*100}%`, background: `linear-gradient(to top, ${s.color}, transparent)`, borderRadius: "6px" }} />
                 <div style={{ position: "absolute", top: "10px", left: 0, right: 0, textAlign: "center", fontWeight: 900, fontSize: "10px" }}>{s.score}</div>
              </div>
              <span className="muted" style={{ fontSize: "9px", fontWeight: 800 }}>{s.label.toUpperCase()}</span>
           </div>
         ))}
      </div>
    </div>
  );
}

export function UpcomingAssignments() {
  const items = [
    { title: "Key Trim Assignment", date: "March 22, 2026", done: true },
    { title: "Plan to Complete", date: "March 28, 2026", done: true },
    { title: "Dashboard Realization", date: "March 29, 2026", done: false },
    { title: "Easy Solution AI", date: "Aug 11, 2026", done: false }
  ];

  return (
    <div className="real-glass stack" style={{ padding: "32px", height: "100%", background: "rgba(10,10,20,0.6)" }}>
      <div className="row-between" style={{ marginBottom: "16px" }}>
        <h3 className="eyebrow" style={{ margin: 0, fontSize: "12px" }}>UPCOMING ASSIGNMENTS</h3>
        <span style={{ fontSize: "1rem", opacity: 0.3 }}>•••</span>
      </div>

      <div className="stack" style={{ gap: "8px" }}>
         {items.map((item, i) => (
           <div key={i} className="row-between" style={{ padding: "14px", background: "rgba(255,255,255,0.02)", borderRadius: "16px", border: "1px solid var(--glass-border)" }}>
              <div className="stack" style={{ gap: "2px" }}>
                 <strong style={{ fontSize: "13px", fontWeight: 700 }}>{item.title}</strong>
                 <span className="muted" style={{ fontSize: "10px" }}>{item.date}</span>
              </div>
              {item.done ? (
                <span style={{ color: "var(--success)", fontSize: "14px" }}>✅</span>
              ) : (
                <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.2)" }} />
              )}
           </div>
         ))}
      </div>
      
      <button className="nav-link" style={{ marginTop: "16px", width: "100%", justifyContent: "center", opacity: 0.4, fontSize: "12px" }}>More ⌄</button>
    </div>
  );
}

export function LanguageModules() {
  const langs = [
    { name: "ARABIC", label: "العربيّة", level: "B2", progress: 65, colors: ["#3b82f6", "#06b6d4"] },
    { name: "FRENCH", label: "Français", level: "A1", progress: 40, colors: ["#f59e0b", "#ef4444"] },
    { name: "ENGLISH", label: "English", level: "C1", progress: 92, colors: ["#10b981", "#3b82f6"] }
  ];

  return (
    <div className="grid grid-cols-3" style={{ gap: "24px", marginTop: "40px" }}>
       {langs.map(l => (
         <div key={l.name} className="lang-card" style={{ background: `linear-gradient(135deg, ${l.colors[0]}, ${l.colors[1]})` }}>
           <div className="lang-card-bg" style={{ background: "rgba(0,0,0,0.4)" }} />
           <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
              <div className="row-between" style={{ marginBottom: "8px" }}>
                 <strong style={{ fontSize: "1.4rem", letterSpacing: "1.5px", fontWeight: 900 }}>{l.name}</strong>
                 <span style={{ fontSize: "10px", fontWeight: 900, background: "rgba(0,0,0,0.3)", padding: "4px 8px", borderRadius: "100px" }}>{l.level}</span>
              </div>
              <h4 style={{ fontSize: "1rem", fontWeight: 400, opacity: 0.9, marginBottom: "32px", fontStyle: "italic" }}>{l.label}</h4>
              
              <div className="stack" style={{ gap: "6px" }}>
                 <div className="row-between" style={{ fontSize: "11px", fontWeight: 800, opacity: 0.9 }}>
                    <span>Progress</span>
                    <span>{l.progress}%</span>
                 </div>
                 <div style={{ height: "4px", background: "rgba(0,0,0,0.2)", borderRadius: "10px" }}>
                    <div style={{ height: "100%", width: `${l.progress}%`, background: "white", borderRadius: "inherit", boxShadow: "0 0 10px white" }} />
                 </div>
              </div>
            </div>
          </div>
       ))}
    </div>
  );
}
export function HighYieldTopics({ lang }: { lang: SiteLanguage }) {
  const t = translations[lang];
  
  const topics = [
    { title: lang === "ar" ? "الأعداد المركبة" : (lang === "fr" ? "Nombres Complexes" : "Complex Numbers"), coef: "High", skill: "Math" },
    { title: lang === "ar" ? "الإبداع والابتكار" : (lang === "fr" ? "Creativity & Innovation" : "Creativity & Innovation"), coef: "Core", skill: "English" },
    { title: lang === "ar" ? "قواعد المتصل" : (lang === "fr" ? "Connecteurs Logiques" : "Connectors"), coef: "Essay", skill: "Grammar" }
  ];

  return (
    <div className="real-glass stack" style={{ padding: "32px", height: "100%", background: "rgba(10,10,20,0.6)" }}>
      <div className="row-between" style={{ marginBottom: "16px" }}>
        <h3 className="eyebrow" style={{ margin: 0, fontSize: "12px" }}>HIGH-YIELD TOPICS</h3>
      </div>

      <div className="stack" style={{ gap: "12px" }}>
        {topics.map((item, i) => (
          <div key={i} className="row-between" style={{ padding: "16px", background: "rgba(99,102,241,0.05)", borderRadius: "16px", border: "1px solid var(--primary-glow)" }}>
            <div className="stack" style={{ gap: "4px" }}>
              <span style={{ fontSize: "10px", fontWeight: 900, color: "var(--primary)" }}>{item.skill.toUpperCase()}</span>
              <strong style={{ fontSize: "14px" }}>{item.title}</strong>
            </div>
            <div className="pill" style={{ fontSize: "10px", background: "rgba(255,255,255,0.05)", color: "white" }}>
              {item.coef}
            </div>
          </div>
        ))}
      </div>
      
      <Link href="/lessons" className="button-link button-secondary" style={{ marginTop: "16px", width: "100%", justifyContent: "center", fontSize: "12px" }}>
         {lang === "ar" ? "عرض خارطة الطريق" : (lang === "fr" ? "Voir la Roadmap" : "View Roadmap")}
      </Link>
    </div>
  );
}

export function WordOfTheDay({ lang }: { lang: SiteLanguage }) {
  const dictionary = {
    en: { word: "Paradigm", meaning: "A typical example or pattern of something.", example: "The shift to AI is a new paradigm in Bac preparation." },
    fr: { word: "Éphémère", meaning: "Qui ne dure que peu de temps.", example: "La gloire est souvent éphémère." },
    ar: { word: "جوهري", meaning: "أساسي أو حقيقي.", example: "التعليم هو عنصر جوهري في بناء المستقبل." }
  };

  const data = dictionary[lang];

  return (
    <div className="card stack" style={{ padding: "32px", background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1), transparent)", border: "1px solid var(--accent-glow)", marginTop: "24px" }}>
      <span className="eyebrow" style={{ color: "var(--accent)" }}>WORD OF THE DAY</span>
      <div className="stack" style={{ gap: "4px" }}>
        <h3 style={{ fontSize: "2rem", fontWeight: 900 }}>{data.word}</h3>
        <p className="muted" style={{ fontSize: "12px" }}>{data.meaning}</p>
      </div>
      <div style={{ padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "12px", fontStyle: "italic", fontSize: "14px", borderLeft: "4px solid var(--accent)" }}>
        "{data.example}"
      </div>
    </div>
  );
}
