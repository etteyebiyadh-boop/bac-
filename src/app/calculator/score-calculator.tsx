"use client";

import { useState, useMemo } from "react";
import { BacSection } from "@prisma/client";
import { translations, SiteLanguage } from "@/lib/translations";

type Subject = {
  name: string;
  nameAr: string;
  nameFr: string;
  coef: number;
};

const BAC_COEFFICIENTS: Record<BacSection, Subject[]> = {
  MATHEMATIQUES: [
    { name: "Mathematics", nameAr: "الرياضيات", nameFr: "Mathématiques", coef: 4 },
    { name: "Physical Sciences", nameAr: "العلوم الفيزيائية", nameFr: "Sciences Physiques", coef: 4 },
    { name: "Technical Sciences", nameAr: "العلوم التقنية", nameFr: "Sciences Techniques", coef: 1.5 },
    { name: "Life & Earth Sciences", nameAr: "علوم الحياة والأرض", nameFr: "SVT", coef: 1 },
    { name: "English", nameAr: "الإنقليزية", nameFr: "Anglais", coef: 2 },
    { name: "French", nameAr: "الفرنسية", nameFr: "Français", coef: 2 },
    { name: "Arabic", nameAr: "العربية", nameFr: "Arabe", coef: 2 },
    { name: "Philosophy", nameAr: "الفلسفة", nameFr: "Philosophie", coef: 1 },
    { name: "Informatics", nameAr: "الإعلامية", nameFr: "Informatique", coef: 1 },
    { name: "Sport", nameAr: "الرياضة", nameFr: "Sport", coef: 1 },
    { name: "Optional Language", nameAr: "لغة اختيارية", nameFr: "Option", coef: 1 }
  ],
  SCIENCES_EXPERIMENTALES: [
    { name: "Life & Earth Sciences", nameAr: "علوم الحياة والأرض", nameFr: "SVT", coef: 4 },
    { name: "Physical Sciences", nameAr: "العلوم الفيزيائية", nameFr: "Sciences Physiques", coef: 4 },
    { name: "Mathematics", nameAr: "الرياضيات", nameFr: "Mathématiques", coef: 3 },
    { name: "English", nameAr: "الإنقليزية", nameFr: "Anglais", coef: 2 },
    { name: "French", nameAr: "الفرنسية", nameFr: "Français", coef: 2 },
    { name: "Arabic", nameAr: "العربية", nameFr: "Arabe", coef: 2 },
    { name: "Philosophy", nameAr: "الفلسفة", nameFr: "Philosophie", coef: 1 },
    { name: "Informatics", nameAr: "الإعلامية", nameFr: "Informatique", coef: 1 },
    { name: "Sport", nameAr: "الرياضة", nameFr: "Sport", coef: 1 },
    { name: "Optional Language", nameAr: "لغة اختيارية", nameFr: "Option", coef: 1 }
  ],
  ECONOMIE_GESTION: [
    { name: "Economy", nameAr: "الاقتصاد", nameFr: "Économie", coef: 3 },
    { name: "Management", nameAr: "التصرف", nameFr: "Gestion", coef: 3 },
    { name: "Mathematics", nameAr: "الرياضيات", nameFr: "Mathématiques", coef: 2 },
    { name: "History & Geography", nameAr: "التاريخ والجغرافيا", nameFr: "Hist-Géo", coef: 2 },
    { name: "English", nameAr: "الإنقليزية", nameFr: "Anglais", coef: 2 },
    { name: "French", nameAr: "الفرنسية", nameFr: "Français", coef: 2 },
    { name: "Arabic", nameAr: "العربية", nameFr: "Arabe", coef: 1.5 },
    { name: "Philosophy", nameAr: "الفلسفة", nameFr: "Philosophie", coef: 1 },
    { name: "Informatics", nameAr: "الإعلامية", nameFr: "Informatique", coef: 1 },
    { name: "Sport", nameAr: "الرياضة", nameFr: "Sport", coef: 1 },
    { name: "Optional Language", nameAr: "لغة اختيارية", nameFr: "Option", coef: 1 }
  ],
  LETTRES: [
    { name: "Arabic", nameAr: "العربية", nameFr: "Arabe", coef: 4 },
    { name: "French", nameAr: "الفرنسية", nameFr: "Français", coef: 3 },
    { name: "English", nameAr: "الإنقليزية", nameFr: "Anglais", coef: 3 },
    { name: "Philosophy", nameAr: "الفلسفة", nameFr: "Philosophie", coef: 4 },
    { name: "History & Geography", nameAr: "التاريخ والجغرافيا", nameFr: "Hist-Géo", coef: 2 },
    { name: "Thinking Skills", nameAr: "تفكير إسلامي", nameFr: "Pensée Islamique", coef: 2 },
    { name: "Life Sciences", nameAr: "علوم الحياة", nameFr: "Sciences", coef: 1 },
    { name: "Informatics", nameAr: "الإعلامية", nameFr: "Informatique", coef: 1 },
    { name: "Sport", nameAr: "الرياضة", nameFr: "Sport", coef: 1 },
    { name: "Optional Language", nameAr: "لغة اختيارية", nameFr: "Option", coef: 1 }
  ],
  SCIENCES_TECHNIQUES: [
    { name: "Technical Sciences", nameAr: "العلوم التقنية", nameFr: "Technique", coef: 4 },
    { name: "Physical Sciences", nameAr: "العلوم الفيزيائية", nameFr: "Sciences Physiques", coef: 4 },
    { name: "Mathematics", nameAr: "الرياضيات", nameFr: "Mathématiques", coef: 3 },
    { name: "English", nameAr: "الإنقليزية", nameFr: "Anglais", coef: 2 },
    { name: "French", nameAr: "الفرنسية", nameFr: "Français", coef: 2 },
    { name: "Arabic", nameAr: "العربية", nameFr: "Arabe", coef: 1.5 },
    { name: "Philosophy", nameAr: "الفلسفة", nameFr: "Philosophie", coef: 1 },
    { name: "Informatics", nameAr: "الإعلامية", nameFr: "Informatique", coef: 1 },
    { name: "Sport", nameAr: "الرياضة", nameFr: "Sport", coef: 1 },
    { name: "Optional Language", nameAr: "لغة اختيارية", nameFr: "Option", coef: 1 }
  ],
  SCIENCES_INFORMATIQUE: [
    { name: "Algorithms & Programming", nameAr: "لوغاريتمات وبرمجة", nameFr: "Algorithmique", coef: 3 },
    { name: "Informatics", nameAr: "تكنولوجيا المعلومات", nameFr: "TIC", coef: 3 },
    { name: "Mathematics", nameAr: "الرياضيات", nameFr: "Mathématiques", coef: 3 },
    { name: "Physical Sciences", nameAr: "العلوم الفيزيائية", nameFr: "Physique", coef: 2 },
    { name: "English", nameAr: "الإنقليزية", nameFr: "Anglais", coef: 2 },
    { name: "French", nameAr: "الفرنسية", nameFr: "Français", coef: 2 },
    { name: "Arabic", nameAr: "العربية", nameFr: "Arabe", coef: 1.5 },
    { name: "Philosophy", nameAr: "الفلسفة", nameFr: "Philosophie", coef: 1 },
    { name: "Sport", nameAr: "الرياضة", nameFr: "Sport", coef: 1 },
    { name: "Optional Language", nameAr: "لغة اختيارية", nameFr: "Option", coef: 1 }
  ]
};

export function ScoreCalculator({ lang, initialSection }: { lang: SiteLanguage; initialSection: BacSection }) {
  const t = translations[lang];
  const [section, setSection] = useState<BacSection>(initialSection);
  const subjects = BAC_COEFFICIENTS[section] || BAC_COEFFICIENTS.MATHEMATIQUES;
  const [grades, setGrades] = useState<Record<string, number>>(
    subjects.reduce((acc, s) => ({ ...acc, [s.name]: 15 }), {})
  );

  const average = useMemo(() => {
    const totalCoef = subjects.reduce((sum, s) => sum + s.coef, 0);
    const weightedSum = subjects.reduce((sum, s) => {
      const grade = grades[s.name] || 0;
      return sum + grade * s.coef;
    }, 0);
    return Number((weightedSum / totalCoef).toFixed(2));
  }, [subjects, grades]);

  const mention = useMemo(() => {
    if (average >= 16) return { label: lang === "ar" ? "حسن جداً" : "Très Bien", color: "var(--primary)" };
    if (average >= 14) return { label: lang === "ar" ? "حسن" : "Bien", color: "var(--accent)" };
    if (average >= 12) return { label: lang === "ar" ? "قريب من الحسن" : "Assez Bien", color: "var(--success)" };
    if (average >= 10) return { label: lang === "ar" ? "متوسط" : "Passable", color: "white" };
    return { label: lang === "ar" ? "مرفوض" : "Refusé", color: "var(--error)" };
  }, [average, lang]);

  return (
    <div className="grid" style={{ gridTemplateColumns: "1.2fr 0.8fr", gap: "32px", alignItems: "start" }}>
      <section className="card stack" style={{ padding: "32px", gap: "24px" }}>
        <div className="row-between" style={{ marginBottom: "16px" }}>
           <h2 className="section-title" style={{ margin: 0 }}>{t.calc_subject}</h2>
           <select 
             value={section} 
             onChange={(e) => setSection(e.target.value as BacSection)}
             style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", padding: "8px 16px", borderRadius: "100px", color: "white" }}
           >
              {Object.keys(BAC_COEFFICIENTS).map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
           </select>
        </div>

        <div className="stack" style={{ gap: "12px" }}>
          {subjects.map((s) => (
            <div key={s.name} className="row-between card" style={{ padding: "16px 24px", background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)" }}>
              <div className="stack" style={{ gap: "4px" }}>
                <strong style={{ fontSize: "1rem" }}>{lang === "ar" ? s.nameAr : (lang === "fr" ? s.nameFr : s.name)}</strong>
                <span className="muted" style={{ fontSize: "10px" }}>Coef: {s.coef}</span>
              </div>
              <div className="row-between" style={{ gap: "16px", alignItems: "center" }}>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.25"
                  value={grades[s.name] || ""}
                  onChange={(e) => setGrades({ ...grades, [s.name]: Number(e.target.value) })}
                  style={{ width: "80px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", padding: "10px", borderRadius: "10px", textAlign: "center", color: "white", fontSize: "1.1rem", fontWeight: 800 }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="stack" style={{ gap: "24px", position: "sticky", top: "24px" }}>
        <div className="card stack" style={{ padding: "40px", textAlign: "center", background: "var(--card-bg)", border: "2px solid var(--primary-glow)", boxShadow: "0 0 60px rgba(99, 102, 241, 0.15)" }}>
          <h3 className="eyebrow">{t.calc_average}</h3>
          <div style={{ fontSize: "5rem", fontWeight: 900, color: mention.color, fontFamily: "var(--font-display)", textShadow: `0 0 40px ${mention.color}22` }}>
            {average.toFixed(2)}
          </div>
          <div className="pill" style={{ fontSize: "1.2rem", padding: "10px 24px", alignSelf: "center", background: mention.color, color: mention.color === "white" ? "black" : "white", border: "none", marginTop: "16px" }}>
            {mention.label}
          </div>
        </div>

        <div className="card stack" style={{ padding: "32px", background: "rgba(255,255,255,0.02)", gap: "16px" }}>
           <h4 className="eyebrow" style={{ fontSize: "10px" }}>GRADE ANALYSIS</h4>
           <div className="stack" style={{ gap: "12px" }}>
              <div className="row-between" style={{ fontSize: "13px" }}>
                 <span className="muted">Languages Share</span>
                 <span>{((subjects.filter(s => ["English", "French", "Arabic", "Optional Language"].includes(s.name)).reduce((sum, s) => sum + s.coef, 0) / subjects.reduce((sum, s) => sum + s.coef, 0)) * 100).toFixed(0)}%</span>
              </div>
              <div className="progress-bar" style={{ height: "6px", background: "rgba(255,255,255,0.05)" }}>
                 <div style={{ height: "100%", width: `${((subjects.filter(s => ["English", "French", "Arabic", "Optional Language"].includes(s.name)).reduce((sum, s) => sum + s.coef, 0) / subjects.reduce((sum, s) => sum + s.coef, 0)) * 100)}%`, background: "var(--primary)" }} />
              </div>
              <p className="muted" style={{ fontSize: "11px", marginTop: "8px" }}>
                 For most sections, mastering your 3-4 languages accounts for almost <strong>half</strong> of your total average weight. Use the Library to secure those marks!
              </p>
           </div>
        </div>
      </aside>
    </div>
  );
}
