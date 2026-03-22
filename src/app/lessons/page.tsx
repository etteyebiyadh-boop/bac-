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

  // For Prisma:
  // If bacSections is a scalar array in PostgreSQL, we query using "has" or "hasSome".
  // However, prisma might fetch everything if we are not strict. 
  // Let's fetch all relevant content for the languages and filter optionally to include general ones
  // that have bacSections = null or include the user's section.
  
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

  // Client-side like filtering for sections if they exist:
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
      <section className="card stack hero-panel" style={{ padding: "40px 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: "-10%", top: "-50%", width: "300px", height: "300px", background: "radial-gradient(circle, rgba(231,191,135,0.15) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div className="stack" style={{ zIndex: 1, position: "relative" }}>
          <span className="eyebrow" style={{ color: "var(--accent-strong, #e7bf87)" }}>
            Study Hub
          </span>
          <h1 className="section-title" style={{ fontSize: "2.2rem", color: "white", marginBottom: "0.5rem" }}>
            Your Personalized Content Library
          </h1>
          <p className="muted" style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.85)", maxWidth: "600px" }}>
            This library instantly adapts to your section (<strong>{getBacSectionLabel(profile.bacSection)}</strong>) and chosen languages (<strong>{activeLanguages.map(getLanguageLabel).join(", ")}</strong>). 
            Find curated grammar, vocabulary, and smart lessons to level up your BAC score.
          </p>
        </div>
      </section>

      {activeLanguages.map((lang) => {
        const langLessons = lessons.filter((l) => l.language === lang);
        const langGrammar = filteredGrammar.filter((g) => g.language === lang);
        const langVocab = filteredVocab.filter((v) => v.language === lang);

        if (langLessons.length === 0 && langGrammar.length === 0 && langVocab.length === 0) {
          return (
            <section key={lang} className="card stack" style={{ marginTop: "1rem" }}>
              <div className="row-between">
                <h2 className="section-title">{getLanguageLabel(lang)} Track</h2>
                <span className="pill">Coming Soon</span>
              </div>
              <p className="muted">No content found yet for this language and your section combination. We are actively rolling out more modules!</p>
            </section>
          );
        }

        return (
          <div key={lang} className="stack" style={{ gap: "1.5rem", marginTop: "2rem" }}>
            <h2 className="section-title" style={{ borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem", fontSize: "1.5rem" }}>
              {getLanguageLabel(lang)} Materials
            </h2>

            {/* Grammar */}
            {langGrammar.length > 0 && (
              <section className="stack">
                <h3 style={{ fontSize: "1.15rem", margin: 0, color: "var(--text)" }}>Grammar Rules</h3>
                <div className="grid grid-cols-3" style={{ gap: "1rem" }}>
                  {langGrammar.map((rule) => (
                    <article key={rule.id} className="card stack" style={{ padding: "1.25rem" }}>
                      <strong style={{ fontSize: "1.05rem" }}>{rule.title}</strong>
                      <p className="muted" style={{ fontSize: "0.85rem", margin: "0.5rem 0" }}>
                        Category: {rule.category.replace(/_/g, " ")} <br/>
                        Difficulty: {rule.difficulty}
                      </p>
                      <Link href={`/lessons/grammar/${rule.slug}`} className="button-link button-secondary" style={{ marginTop: "auto", width: "100%", textAlign: "center", display: "inline-block" }}>
                        Review Rule
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* Vocabulary */}
            {langVocab.length > 0 && (
              <section className="stack" style={{ marginTop: "1rem" }}>
                <h3 style={{ fontSize: "1.15rem", margin: 0, color: "var(--text)" }}>Vocabulary Sets</h3>
                <div className="grid grid-cols-3" style={{ gap: "1rem" }}>
                  {langVocab.map((set) => (
                    <article key={set.id} className="card stack" style={{ padding: "1.25rem" }}>
                      <strong style={{ fontSize: "1.05rem" }}>{set.title}</strong>
                      <p className="muted" style={{ fontSize: "0.85rem", margin: "0.5rem 0" }}>
                        Theme: {set.theme.replace(/_/g, " ")} <br/>
                        Context: {set.bacContext}
                      </p>
                      <Link href={`/lessons/vocab/${set.slug}`} className="button-link button-secondary" style={{ marginTop: "auto", width: "100%", textAlign: "center", display: "inline-block" }}>
                        Study Set
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* General Lessons */}
            {langLessons.length > 0 && (
              <section className="stack" style={{ marginTop: "1rem" }}>
                <h3 style={{ fontSize: "1.15rem", margin: 0, color: "var(--text)" }}>Smart Lessons</h3>
                <div className="grid grid-cols-3" style={{ gap: "1rem" }}>
                  {langLessons.map((lesson) => (
                    <article key={lesson.id} className="card stack" style={{ padding: "1.25rem" }}>
                      <strong style={{ fontSize: "1.05rem" }}>{lesson.title}</strong>
                      <p className="muted" style={{ fontSize: "0.85rem", margin: "0.5rem 0", flex: 1 }}>
                        {lesson.summary}
                      </p>
                      <Link href={`/lessons/${lesson.slug}`} className="button-link button-secondary" style={{ marginTop: "auto", width: "100%", textAlign: "center", display: "inline-block" }}>
                        Start Lesson
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        );
      })}
    </div>
  );
}
