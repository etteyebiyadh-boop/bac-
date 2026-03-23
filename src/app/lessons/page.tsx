import Link from "next/link";
import { requireCurrentUser } from "@/lib/auth";
import { ensureStudentProfile } from "@/lib/missions";
import { getLanguageLabel, getBacSectionLabel } from "@/lib/learning";
import { Language, BacSection, BacModule } from "@prisma/client";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const MODULE_LABELS: Record<BacModule, string> = {
  MODULE_1_HOLIDAYING_ART_SHOWS: "Unit 1: Holidaying & Art Shows",
  MODULE_2_EDUCATION_MATTERS: "Unit 2: Education Matters",
  MODULE_3_CREATIVE_INVENTIVE_MINDS: "Unit 3: Creative & Inventive Minds",
};

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

  const [grammarRules, vocabSets, readingPassages] = await Promise.all([
    db.grammarRule.findMany({
      where: { language: { in: activeLanguages } },
      orderBy: { createdAt: "desc" }
    }),
    db.vocabularySet.findMany({
      where: { language: { in: activeLanguages } },
      orderBy: { createdAt: "desc" }
    }),
    db.readingPassage.findMany({
      where: { language: { in: activeLanguages } },
      orderBy: { createdAt: "desc" }
    })
  ]);

  return (
    <div className="page-stack library-overhaul" style={{ gap: "80px" }}>
      {/* Dynamic Cinematic Header */}
      <section className="card stack hero-panel" style={{ padding: "80px", border: "1px solid var(--primary)", background: "radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent)" }}>
        <div style={{ position: "absolute", right: "-10%", top: "-50%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div className="stack" style={{ zIndex: 1, position: "relative", gap: "24px" }}>
          <span className="eyebrow" style={{ color: "var(--primary)" }}>The Excellence Library</span>
          <h1 className="section-title" style={{ fontSize: "4.5rem", lineHeight: 0.9, letterSpacing: "-2px" }}>Deep Study.<br/>Curated For <span className="text-gradient">Bac {getBacSectionLabel(profile.bacSection)}</span>.</h1>
          <p className="muted" style={{ fontSize: "1.2rem", maxWidth: "600px" }}>
            The official national curriculum broken down into logical units. Master the reading 
            passages, verify your grammar, and expand your lexicon.
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
        const langReading = readingPassages.filter((r) => r.language === lang);

        const modules = Object.values(BacModule);

        return (
          <div key={lang} className="stack" style={{ gap: "60px" }}>
            <div className="row-between" style={{ borderBottom: "1px solid var(--glass-border)", paddingBottom: "24px" }}>
              <h2 className="section-title" style={{ fontSize: "3.5rem", margin: 0 }}>
                {getLanguageLabel(lang)} <span style={{ opacity: 0.3 }}>Curriculum</span>
              </h2>
              <div className="stack" style={{ gap: "4px", textAlign: "right" }}>
                <span className="eyebrow" style={{ fontSize: "10px" }}>COEF</span>
                <strong style={{ fontSize: "1.5rem", color: profile.bacSection === "LETTRES" ? "var(--error)" : "var(--accent)" }}>
                  {lang === "ENGLISH" && profile.bacSection === "LETTRES" ? "3" : "2"}
                </strong>
              </div>
            </div>

            {/* Units/Modules Grid */}
            <div className="stack" style={{ gap: "100px" }}>
              {modules.map((mod) => {
                const modReading = langReading.filter(r => r.bacModule === mod);
                const modGrammar = langGrammar.filter(g => g.bacModule === mod);
                const modVocab = langVocab.filter(v => v.bacModule === mod);

                // Skip modules with zero content for this specific language (but keep units visible if possible)
                if (modReading.length === 0 && modGrammar.length === 0 && modVocab.length === 0) return null;

                return (
                  <section key={mod} className="unit-container stack" style={{ gap: "40px" }}>
                    <div className="row-between" style={{ background: "rgba(255,255,255,0.02)", padding: "24px 32px", borderRadius: "16px", border: "1px solid var(--glass-border)" }}>
                      <div className="stack" style={{ gap: "4px" }}>
                        <span className="eyebrow" style={{ color: "var(--primary)" }}>Module Focus</span>
                        <h3 style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>{MODULE_LABELS[mod]}</h3>
                      </div>
                      <div className="pill" style={{ borderColor: "var(--primary)", color: "var(--primary)" }}>Official Unit</div>
                    </div>

                    <div className="grid grid-cols-3" style={{ gap: "32px", alignItems: "start" }}>
                      {/* Reading Comprehension Column */}
                      <div className="stack" style={{ gap: "24px" }}>
                        <div className="row-between">
                          <span className="eyebrow" style={{ color: "var(--accent)" }}>Reading Practice</span>
                          <span className="pill" style={{ fontSize: "10px" }}>{modReading.length} TEXTS</span>
                        </div>
                        <div className="stack" style={{ gap: "16px" }}>
                          {modReading.map(reading => (
                             <article key={reading.id} className="card stack" style={{ padding: "24px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--accent-glow)", boxShadow: "0 0 20px rgba(245, 158, 11, 0.05)" }}>
                               <strong style={{ fontSize: "1.1rem" }}>{reading.title}</strong>
                               <p className="muted" style={{ fontSize: "12px", margin: "10px 0 20px" }}>{reading.wordCount} words · {reading.difficulty} level</p>
                               <Link href={`/lessons/reading/${reading.slug}`} className="button-link" style={{ background: "var(--accent)", color: "black", width: "100%", justifyContent: "center" }}>Start Comprehension</Link>
                             </article>
                          ))}
                          {modReading.length === 0 && <p className="muted" style={{ fontSize: "12px" }}>No reading sets for this unit yet.</p>}
                        </div>
                      </div>

                      {/* Grammar Column */}
                      <div className="stack" style={{ gap: "24px" }}>
                        <div className="row-between">
                          <span className="eyebrow" style={{ color: "var(--primary)" }}>Grammar & Verbs</span>
                          <span className="pill" style={{ fontSize: "10px" }}>{modGrammar.length} MODULES</span>
                        </div>
                        <div className="stack" style={{ gap: "16px" }}>
                          {modGrammar.map(rule => (
                             <article key={rule.id} className="card row-between" style={{ padding: "20px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)" }}>
                               <div className="stack" style={{ gap: "4px" }}>
                                  <strong style={{ fontSize: "1rem" }}>{rule.title}</strong>
                                  <span className="muted" style={{ fontSize: "10px" }}>{rule.difficulty}</span>
                               </div>
                               <Link href={`/lessons/grammar/${rule.slug}`} className="button-link button-secondary" style={{ padding: "8px 16px", fontSize: "11px" }}>Review</Link>
                             </article>
                          ))}
                          {modGrammar.length === 0 && <p className="muted" style={{ fontSize: "12px" }}>Grammar modules coming soon.</p>}
                        </div>
                      </div>

                      {/* Vocab Column */}
                      <div className="stack" style={{ gap: "24px" }}>
                        <div className="row-between">
                          <span className="eyebrow" style={{ color: "var(--success)" }}>Vocabulary Sets</span>
                          <span className="pill" style={{ fontSize: "10px" }}>{modVocab.length} SETS</span>
                        </div>
                        <div className="stack" style={{ gap: "16px" }}>
                          {modVocab.map(voc => (
                             <article key={voc.id} className="card stack" style={{ padding: "24px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)" }}>
                               <strong style={{ fontSize: "1.1rem" }}>{voc.title}</strong>
                               <span className="pill" style={{ fontSize: "9px", width: "fit-content", marginTop: "8px", borderColor: "var(--success)", color: "var(--success)" }}>{voc.theme}</span>
                               <Link href={`/lessons/vocab/${voc.slug}`} className="button-link" style={{ marginTop: "20px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", width: "100%", justifyContent: "center" }}>Vault</Link>
                             </article>
                          ))}
                          {modVocab.length === 0 && <p className="muted" style={{ fontSize: "12px" }}>Lexicon updates in progress.</p>}
                        </div>
                      </div>
                    </div>
                  </section>
                );
              })}

              {/* General/Common Section */}
              <section className="stack" style={{ gap: "40px", opacity: 0.8 }}>
                <div className="row-between" style={{ borderBottom: "1px solid var(--glass-border)", paddingBottom: "16px" }}>
                   <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>General Essentials</h3>
                   <span className="muted" style={{ fontSize: "12px" }}>Universal tools for any unit</span>
                </div>
                <div className="grid grid-cols-2" style={{ gap: "32px" }}>
                   <div className="card row-between" style={{ padding: "32px" }}>
                      <div className="stack" style={{ gap: "8px" }}>
                         <span className="eyebrow" style={{ color: "var(--accent)" }}>BAC Methodology</span>
                         <strong>How to identify text evidence?</strong>
                         <p className="muted" style={{ fontSize: "12px" }}>Don't just copy the whole paragraph. Use "..." for ellipses.</p>
                      </div>
                      <Link href="/strategy" className="button-link button-secondary">Read Tip</Link>
                   </div>
                   <div className="card row-between" style={{ padding: "32px" }}>
                      <div className="stack" style={{ gap: "8px" }}>
                         <span className="eyebrow" style={{ color: "var(--primary)" }}>Writing Lab</span>
                         <strong>Common Linking Words</strong>
                         <p className="muted" style={{ fontSize: "12px" }}>Master "Furthermore", "In contrast", and "To conclude".</p>
                      </div>
                      <Link href="/write" className="button-link button-secondary">Practice</Link>
                   </div>
                </div>
              </section>
            </div>
          </div>
        );
      })}
    </div>
  );
}
