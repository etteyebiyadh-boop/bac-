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

  const [grammarRules, vocabSets] = await Promise.all([
    db.grammarRule.findMany({
      where: { language: { in: activeLanguages } },
      orderBy: { createdAt: "desc" }
    }),
    db.vocabularySet.findMany({
      where: { language: { in: activeLanguages } },
      orderBy: { createdAt: "desc" }
    })
  ]);

  return (
    <div className="page-stack library-overhaul">
      <section className="card stack hero-panel" style={{ padding: "80px", border: "1px solid var(--primary)", background: "radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent)" }}>
        <div style={{ position: "absolute", right: "-10%", top: "-50%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div className="stack" style={{ zIndex: 1, position: "relative", gap: "24px" }}>
          <span className="eyebrow" style={{ color: "var(--primary)" }}>The Excellence Library</span>
          <h1 className="section-title" style={{ fontSize: "4rem", lineHeight: 1 }}>Deep Knowledge <br/>Curated For You.</h1>
          <p className="muted" style={{ fontSize: "1.2rem", maxWidth: "600px" }}>
            Below are your mandatory and optional tracks for **Section {getBacSectionLabel(profile.bacSection)}**. 
            Organized to take you from understanding to mastery.
          </p>
          <div className="row-between" style={{ justifyContent: "flex-start", gap: "10px" }}>
            {activeLanguages.map(l => (
              <span key={l} className="pill" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--card-border)", color: "var(--ink)" }}>{getLanguageLabel(l)}</span>
            ))}
          </div>
        </div>
      </section>

      {activeLanguages.map((lang) => {
        const langGrammar = grammarRules.filter((g) => g.language === lang);
        const langVocab = vocabSets.filter((v) => v.language === lang);

        return (
          <div key={lang} className="stack" style={{ gap: "48px", marginTop: "100px" }}>
            <div className="row-between" style={{ borderBottom: "1px solid var(--glass-border)", paddingBottom: "16px" }}>
              <h2 className="section-title" style={{ fontSize: "3rem", margin: 0 }}>
                {getLanguageLabel(lang)} <span style={{ opacity: 0.3 }}>Track</span>
              </h2>
              <div className="row-between" style={{ gap: "20px" }}>
                 <div className="stack" style={{ gap: "4px", textAlign: "right" }}>
                    <span className="eyebrow" style={{ fontSize: "10px" }}>COEF</span>
                    <strong style={{ fontSize: "1.2rem", color: "var(--accent)" }}>{lang === "ENGLISH" ? "2" : "2"}</strong>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-2" style={{ gap: "32px", alignItems: "start" }}>
               {/* Grammar Excellence Section */}
               <section className="stack" style={{ gap: "24px" }}>
                  <div className="row-between">
                    <span className="eyebrow" style={{ color: "var(--primary)" }}>Grammar & Verbs</span>
                    <span className="pill" style={{ fontSize: "10px" }}>{langGrammar.length} MODULES</span>
                  </div>
                  <div className="stack" style={{ gap: "16px" }}>
                    {langGrammar.map(rule => (
                      <article key={rule.id} className="card row-between" style={{ padding: "24px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)" }}>
                         <div className="stack" style={{ gap: "4px" }}>
                            <strong style={{ fontSize: "1.1rem" }}>{rule.title}</strong>
                            <span className="muted" style={{ fontSize: "12px" }}>{rule.category.replace(/_/g, " ")} · {rule.difficulty}</span>
                         </div>
                         <Link href={`/lessons/grammar/${rule.slug}`} className="button-link button-secondary" style={{ padding: "12px 24px", fontSize: "12px" }}>Study</Link>
                      </article>
                    ))}
                    {langGrammar.length === 0 && <p className="muted">Modules for this track are currently being optimized.</p>}
                  </div>
               </section>

               {/* Vocab & Theme Section */}
               <section className="stack" style={{ gap: "24px" }}>
                  <div className="row-between">
                    <span className="eyebrow" style={{ color: "var(--success)" }}>Thematic Lexicon</span>
                    <span className="pill" style={{ fontSize: "10px" }}>{langVocab.length} SETS</span>
                  </div>
                  <div className="stack" style={{ gap: "16px" }}>
                    {langVocab.map(set => (
                      <article key={set.id} className="card stack" style={{ padding: "32px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)" }}>
                         <h3 style={{ fontSize: "1.4rem", fontWeight: 800 }}>{set.title}</h3>
                         <p className="muted" style={{ fontSize: "14px", marginTop: "8px" }}>{set.description}</p>
                         <div className="row-between" style={{ marginTop: "24px" }}>
                            <span className="pill" style={{ fontSize: "10px", borderColor: "var(--success)", color: "var(--success)", opacity: 0.6 }}>{set.theme}</span>
                            <Link href={`/lessons/vocab/${set.slug}`} className="button-link" style={{ background: "var(--success)", color: "black", padding: "12px 24px", fontSize: "12px" }}>Open Vault</Link>
                         </div>
                      </article>
                    ))}
                    {langVocab.length === 0 && <p className="muted">Vocab modules for this track are coming in the next rollout.</p>}
                  </div>
               </section>
            </div>
          </div>
        );
      })}
    </div>
  );
}
