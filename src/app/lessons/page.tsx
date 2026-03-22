import Link from "next/link";
import { requireCurrentUser } from "@/lib/auth";
import { ensureStudentProfile } from "@/lib/missions";
import { getLanguageLabel, getBacSectionLabel } from "@/lib/learning";
import { Language, BacSection } from "@prisma/client";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function LibraryHubPage() {
  const user = await requireCurrentUser();
  const profile = await ensureStudentProfile(user.id);
  
  let secondaryLanguages: Language[] = [];
  try {
    if (profile.secondaryLanguagesJson) {
      const parsed = typeof profile.secondaryLanguagesJson === "string" 
        ? JSON.parse(profile.secondaryLanguagesJson) 
        : profile.secondaryLanguagesJson;
      if (Array.isArray(parsed)) secondaryLanguages = parsed as Language[];
    }
  } catch(e) {}

  const activeLanguages = [profile.primaryLanguage, ...secondaryLanguages];

  const [lessons, grammarRules, vocabSets] = await Promise.all([
    db.lesson.findMany({
      where: { language: { in: activeLanguages } },
      orderBy: { createdAt: "desc" }
    }),
    db.grammarRule.findMany({
      where: { 
        language: { in: activeLanguages }
      },
      orderBy: { createdAt: "desc" }
    }),
    db.vocabularySet.findMany({
      where: { 
        language: { in: activeLanguages }
      },
      orderBy: { createdAt: "desc" }
    })
  ]);

  const filterBySection = <T extends { bacSections: string[] }>(items: T[]) => {
    if (!profile.bacSection) return items;
    return items.filter(item => 
      !item.bacSections || item.bacSections.length === 0 || item.bacSections.includes(profile.bacSection!)
    );
  };

  const filteredGrammar = filterBySection(grammarRules as any) as typeof grammarRules;
  const filteredVocab = filterBySection(vocabSets as any) as typeof vocabSets;

  return (
    <div className="page-stack">
      <section className="card stack hero-panel" style={{ padding: "80px", border: "1px solid var(--primary)", background: "radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent)" }}>
        <div style={{ position: "absolute", right: "-10%", top: "-50%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div className="stack" style={{ zIndex: 1, position: "relative", gap: "24px" }}>
          <span className="eyebrow" style={{ color: "var(--primary)" }}>The Study Hub</span>
          <h1 className="section-title" style={{ fontSize: "4rem", lineHeight: 1 }}>Your Elite <br/>Content Library.</h1>
          <p className="muted" style={{ fontSize: "1.2rem", maxWidth: "600px", color: "var(--ink-dim)" }}>
            Everything you need for your section (<strong>{getBacSectionLabel(profile.bacSection)}</strong>) is filtered and organized below across {activeLanguages.length} active tracks.
          </p>
          <div className="row-between" style={{ justifyContent: "flex-start", gap: "10px" }}>
            {activeLanguages.map(l => (
              <span key={l} className="pill" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--card-border)", color: "var(--ink)" }}>{getLanguageLabel(l)}</span>
            ))}
          </div>
        </div>
      </section>

      {activeLanguages.map((lang) => {
        const langLessons = lessons.filter((l) => l.language === lang);
        const langGrammar = filteredGrammar.filter((g) => g.language === lang);
        const langVocab = filteredVocab.filter((v) => v.language === lang);

        if (langLessons.length === 0 && langGrammar.filter(x => x).length === 0 && langVocab.length === 0) {
          return (
            <section key={lang} className="card stack" style={{ padding: "48px" }}>
               <div className="row-between">
                  <h2 className="section-title" style={{ fontSize: "2rem" }}>{getLanguageLabel(lang)} Track</h2>
                  <span className="pill">COMING SOON</span>
               </div>
               <p className="muted">Detailed rules and interactive modules for this language are currently in active rollout.</p>
            </section>
          );
        }

        return (
          <div key={lang} className="stack" style={{ gap: "48px" }}>
            <h2 className="section-title" style={{ fontSize: "2.5rem", borderBottom: "1px solid var(--card-border)", paddingBottom: "16px" }}>
              {getLanguageLabel(lang)} Mastery
            </h2>

            {/* Grammar Section with High-End Grid Cards */}
            {langGrammar.length > 0 && (
              <div className="stack" style={{ gap: "24px" }}>
                 <div className="row-between">
                    <span className="eyebrow" style={{ color: "var(--primary)" }}>The Grammar Rules</span>
                 </div>
                 <div className="grid grid-cols-3">
                   {langGrammar.map((rule) => (
                     <article key={rule.id} className="card stack" style={{ padding: "32px", background: "rgba(255,255,255,0.01)" }}>
                       <span className={`pill ${rule.difficulty === "HARD" ? "error-pill" : ""}`} style={{ fontSize: "10px", textTransform: "uppercase" }}>{rule.difficulty}</span>
                       <h3 style={{ fontSize: "1.4rem", fontWeight: "700", marginTop: "12px" }}>{rule.title}</h3>
                       <p className="muted" style={{ fontSize: "14px", flex: 1 }}>{rule.category.replace(/_/g, " ")} analysis & formula breakdown inside.</p>
                       <Link href={`/lessons/grammar/${rule.slug}`} className="button-link button-secondary" style={{ marginTop: "20px", justifyContent: "center", width: "100%" }}>Study Rule</Link>
                     </article>
                   ))}
                 </div>
              </div>
            )}

            {/* Vocabulary Section */}
            {langVocab.length > 0 && (
              <div className="stack" style={{ gap: "24px" }}>
                 <div className="row-between">
                    <span className="eyebrow" style={{ color: "var(--success)" }}>The Lexicon Hub</span>
                 </div>
                 <div className="grid grid-cols-3">
                   {langVocab.map((set) => (
                     <article key={set.id} className="card stack" style={{ padding: "32px", border: "1px solid rgba(16, 185, 129, 0.1)" }}>
                       <h3 style={{ fontSize: "1.4rem", fontWeight: "700" }}>{set.title}</h3>
                       <p className="muted" style={{ fontSize: "14px", flex: 1 }}>{set.description}</p>
                       <div className="row-between" style={{ marginTop: "20px", padding: "12px", background: "rgba(0,0,0,0.2)", borderRadius: "12px" }}>
                          <span style={{ fontSize: "11px", fontWeight: "700" }}>Theme: {set.theme.replace(/_/g, " ")}</span>
                          <span style={{ fontSize: "11px", color: "var(--success)" }}>BAC ALIGNED</span>
                       </div>
                       <Link href={`/lessons/vocab/${set.slug}`} className="button-link button-secondary" style={{ marginTop: "20px", justifyContent: "center" }}>Review Set</Link>
                     </article>
                   ))}
                 </div>
              </div>
            )}

            {/* Smart Lessons Section */}
            {langLessons.length > 0 && (
              <div className="stack" style={{ gap: "24px" }}>
                 <div className="row-between">
                    <span className="eyebrow" style={{ color: "var(--accent)" }}>Interactive Lessons</span>
                 </div>
                 <div className="grid grid-cols-2">
                   {langLessons.map((lesson) => (
                     <article key={lesson.id} className="card row-between" style={{ padding: "32px", border: "1px solid rgba(245, 158, 11, 0.1)" }}>
                        <div className="stack" style={{ maxWidth: "70%" }}>
                          <h3 style={{ fontSize: "1.4rem", fontWeight: "700" }}>{lesson.title}</h3>
                          <p className="muted" style={{ fontSize: "14px" }}>{lesson.summary}</p>
                          <span className="pill" style={{ opacity: 0.8, fontSize: "10px" }}>{lesson.estimatedMinutes} MIN READ</span>
                        </div>
                        <Link href={`/lessons/${lesson.slug}`} className="button-link" style={{ background: "var(--accent)", color: "#000" }}>Start</Link>
                     </article>
                   ))}
                 </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
