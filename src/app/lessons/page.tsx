import Link from "next/link";
import { cookies } from "next/headers";
import { requireCurrentUser } from "@/lib/auth";
import { ensureStudentProfile } from "@/lib/missions";
import { getLanguageLabel, getBacSectionLabel } from "@/lib/learning";
import { Language, BacSection, BacModule } from "@prisma/client";
import { db } from "@/lib/db";
import { SiteLanguage, translations } from "@/lib/translations";
import { getCurriculumSlugs, getCurriculumTrack, skillLabels } from "@/lib/language-system";

export const dynamic = "force-dynamic";

export default async function LibraryHubPage() {
  const user = await requireCurrentUser();
  const profile = await ensureStudentProfile(user.id);
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("site-lang")?.value as SiteLanguage || "en";
  const t = translations[langCookie];
  
  const MODULE_LABELS: Record<BacModule, string> = {
    MODULE_1_HOLIDAYING_ART_SHOWS: t.unit_1_title,
    MODULE_2_EDUCATION_MATTERS: t.unit_2_title,
    MODULE_3_CREATIVE_INVENTIVE_MINDS: t.unit_3_title,
    MODULE_4_YOUTH_ISSUES: t.unit_4_title,
    MODULE_5_WOMEN_POWER: t.unit_5_title,
    MODULE_6_SUSTAINABLE_DEVELOPMENT: t.unit_6_title,
    MODULE_7_WORK_COMMITMENT: t.unit_7_title,
    MODULE_8_LITERARY_TEXTS: t.unit_8_title,
  };

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
  const curriculumSlugs = [...new Set(activeLanguages.flatMap((language) => getCurriculumSlugs(language)))];

  const [grammarRules, vocabSets, readingPassages, curriculumLessons] = await Promise.all([
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
    }),
    curriculumSlugs.length > 0
      ? db.lesson.findMany({
          where: { slug: { in: curriculumSlugs } },
          select: { slug: true }
        })
      : Promise.resolve([])
  ]);

  const availableCurriculumSlugs = new Set(curriculumLessons.map((lesson) => lesson.slug));

  return (
    <div className="page-stack library-overhaul" style={{ gap: "clamp(40px, 8vw, 80px)", direction: langCookie === "ar" ? "rtl" : "ltr" }}>
      {/* Dynamic Cinematic Header */}
      <section className="card stack hero-panel" style={{ padding: "clamp(32px, 8vw, 80px)", overflow: "hidden", border: "1px solid var(--primary)", background: "radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent)" }}>
        <div style={{ position: "absolute", right: "-10%", top: "-50%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
        <div className="stack" style={{ zIndex: 1, position: "relative", gap: "24px" }}>
          <span className="eyebrow" style={{ color: "var(--primary)" }}>{t.lib_title}</span>
          <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 8vw, 4.5rem)", lineHeight: 1, letterSpacing: "-2px" }}>
             {langCookie === "ar" ? "الدراسة المعمقة.." : "Deep Study."}<br/>
             {langCookie === "ar" ? "مُصممة خصيصاً لشُعبة" : "Curated For "} <span className="text-gradient">Bac {getBacSectionLabel(profile.bacSection)}</span>.
          </h1>
          <p className="muted" style={{ fontSize: "1.2rem", maxWidth: "600px" }}>
            {t.lib_subtitle}
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
        const curriculumTrack = getCurriculumTrack(lang);
        const hasCurriculumRoadmap = curriculumTrack?.levels.some((level) =>
          level.skills.some((skill) => skill.lessons.some((lesson) => availableCurriculumSlugs.has(lesson.slug)))
        );

        const modules = Object.values(BacModule);

        // Dynamic Coef Logic for Tunisian Bac
        let coef = 2;
        if (profile.bacSection === "LETTRES") coef = 3;
        if (lang === "ARABIC") coef = profile.bacSection === "LETTRES" ? 4 : 2.5;

        // Language branding
        const langColors: Record<string, string> = {
          ENGLISH: "rgba(99, 102, 241, 0.05)",
          FRENCH: "rgba(236, 72, 153, 0.05)",
          ARABIC: "rgba(16, 185, 129, 0.05)",
          SPANISH: "rgba(245, 158, 11, 0.05)",
          GERMAN: "rgba(239, 68, 68, 0.05)",
          ITALIAN: "rgba(59, 130, 246, 0.05)",
        };

        return (
          <div key={lang} className="stack" style={{ 
            gap: "60px",
            background: langColors[lang] || "transparent",
            padding: "40px",
            borderRadius: "32px",
            border: "1px solid var(--glass-border)"
          }}>
            <div className="row-between" style={{ borderBottom: "1px solid var(--glass-border)", paddingBottom: "24px" }}>
              <h2 className="section-title" style={{ fontSize: "clamp(1.5rem, 8vw, 3.5rem)", margin: 0 }}>
                {getLanguageLabel(lang)} <span style={{ opacity: 0.3 }}>{t.lib_curriculum}</span>
              </h2>
              <div className="stack" style={{ gap: "4px", textAlign: langCookie === "ar" ? "left" : "right" }}>
                <span className="eyebrow" style={{ fontSize: "10px" }}>COEF</span>
                <strong style={{ fontSize: "1.5rem", color: coef >= 3 ? "var(--error)" : "var(--accent)" }}>
                  {coef}
                </strong>
              </div>
            </div>

            {curriculumTrack && hasCurriculumRoadmap ? (
              <section className="stack" style={{ gap: "28px" }}>
                <div className="row-between" style={{ background: "rgba(255,255,255,0.03)", padding: "24px 28px", borderRadius: "18px", border: "1px solid var(--glass-border)" }}>
                  <div className="stack" style={{ gap: "6px" }}>
                    <span className="eyebrow" style={{ color: "var(--success)" }}>
                      {curriculumTrack.mode === "communication-first" ? "Communication Track" : "Bac Path"}
                    </span>
                    <h3 style={{ fontSize: "clamp(1.2rem, 5vw, 1.8rem)", margin: 0 }}>
                      {t.lib_roadmap_title}
                    </h3>
                    <p className="muted" style={{ margin: 0, maxWidth: "720px", fontSize: "0.91rem" }}>
                      {t.lib_roadmap_desc}
                    </p>
                  </div>
                  <span className="pill" style={{ borderColor: "var(--success)", color: "var(--success)" }}>
                    {t.lib_roadmap_range}
                  </span>
                </div>

                <div className="grid grid-cols-2" style={{ gap: "24px", alignItems: "start" }}>
                  {curriculumTrack.levels.map((level) => {
                    const populatedSkills = level.skills
                      .map((skill) => ({
                        ...skill,
                        lessons: skill.lessons.filter((lesson) => availableCurriculumSlugs.has(lesson.slug))
                      }))
                      .filter((skill) => skill.lessons.length > 0);

                    if (populatedSkills.length === 0) return null;

                    return (
                      <article key={level.level} className="card stack" style={{ padding: "28px", gap: "20px", background: "rgba(0,0,0,0.22)", border: "1px solid var(--glass-border)" }}>
                        <div className="row-between" style={{ alignItems: "flex-start", gap: "12px" }}>
                          <div className="stack" style={{ gap: "8px" }}>
                            <span className="pill" style={{ width: "fit-content", borderColor: "var(--primary)", color: "var(--primary)" }}>
                              {level.level}
                            </span>
                            <strong style={{ fontSize: "1.05rem" }}>{level.summary}</strong>
                          </div>
                          <span className="muted" style={{ fontSize: "11px" }}>
                            {populatedSkills.reduce((count, skill) => count + skill.lessons.length, 0)} {t.lib_lessons_count}
                          </span>
                        </div>

                        <div className="stack" style={{ gap: "18px" }}>
                          {populatedSkills.map((skill) => (
                            <div key={`${level.level}-${skill.skill}`} className="stack" style={{ gap: "10px" }}>
                              <span className="eyebrow" style={{ color: "var(--accent)" }}>
                                {skillLabels[skill.skill] || skill.skill}
                              </span>
                              <div className="stack" style={{ gap: "10px" }}>
                                {skill.lessons.map((lesson) => (
                                  <article key={lesson.slug} className="card row-between" style={{ padding: "16px 18px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--glass-border)", transition: "all 0.2s ease" }}>
                                    <div className="stack" style={{ gap: "4px", maxWidth: "70%" }}>
                                      <strong>{lesson.title}</strong>
                                      <span className="muted" style={{ fontSize: "12px", opacity: 0.7 }}>{lesson.summary}</span>
                                    </div>
                                    <Link href={`/lessons/${lesson.slug}`} className="button-link button-secondary" style={{ padding: "8px 14px", fontSize: "11px" }}>
                                      {t.lib_open_btn}
                                    </Link>
                                  </article>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            ) : null}

            {/* Units/Modules Grid */}
            <div className="stack" style={{ gap: "80px" }}>
              {modules.map((mod) => {
                const modReading = langReading.filter(r => r.bacModule === mod);
                const modGrammar = langGrammar.filter(g => g.bacModule === mod);
                const modVocab = langVocab.filter(v => v.bacModule === mod);

                // Skip modules with zero content for this specific language
                if (modReading.length === 0 && modGrammar.length === 0 && modVocab.length === 0) return null;

                return (
                  <section key={mod} className="unit-container stack" style={{ gap: "40px" }}>
                    <div className="row-between" style={{ background: "rgba(255,255,255,0.02)", padding: "24px 32px", borderRadius: "16px", border: "1px solid var(--glass-border)" }}>
                      <div className="stack" style={{ gap: "4px" }}>
                        <span className="eyebrow" style={{ color: "var(--primary)" }}>{t.lib_unit_focus}</span>
                        <h3 style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>{MODULE_LABELS[mod]}</h3>
                      </div>
                      <div className="pill" style={{ borderColor: "var(--primary)", color: "var(--primary)" }}>{t.lib_official_unit}</div>
                    </div>

                    <div className="grid grid-cols-3" style={{ gap: "32px", alignItems: "start" }}>
                      {/* Reading Comprehension Column */}
                      <div className="stack" style={{ gap: "24px" }}>
                        <div className="row-between">
                          <span className="eyebrow" style={{ color: "var(--accent)" }}>{t.lib_reading_practice}</span>
                          <span className="pill" style={{ fontSize: "10px" }}>{modReading.length} {t.lib_texts}</span>
                        </div>
                        <div className="stack" style={{ gap: "16px" }}>
                          {modReading.map(reading => (
                             <article key={reading.id} className="card stack" style={{ padding: "24px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--accent-glow)", boxShadow: "0 0 20px rgba(245, 158, 11, 0.05)" }}>
                               <strong style={{ fontSize: "1.1rem" }}>{reading.title}</strong>
                               <p className="muted" style={{ fontSize: "12px", margin: "10px 0 20px" }}>{reading.wordCount} words · {reading.difficulty}</p>
                               <Link href={`/lessons/reading/${reading.slug}`} className="button-link" style={{ background: "var(--accent)", color: "black", width: "100%", justifyContent: "center" }}>
                                  {langCookie === "ar" ? "بدء نص القراءة" : (langCookie === "fr" ? "Commencer la Lecture" : "Start Reading")}
                               </Link>
                             </article>
                          ))}
                        </div>
                      </div>

                      {/* Grammar Column */}
                      <div className="stack" style={{ gap: "24px" }}>
                        <div className="row-between">
                          <span className="eyebrow" style={{ color: "var(--primary)" }}>{t.lib_grammar_verbs}</span>
                          <span className="pill" style={{ fontSize: "10px" }}>{modGrammar.length} {t.lib_modules}</span>
                        </div>
                        <div className="stack" style={{ gap: "16px" }}>
                          {modGrammar.map(rule => (
                             <article key={rule.id} className="card row-between" style={{ padding: "20px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)" }}>
                               <div className="stack" style={{ gap: "4px" }}>
                                  <strong style={{ fontSize: "1rem" }}>{rule.title}</strong>
                                  <span className="muted" style={{ fontSize: "10px" }}>{rule.difficulty}</span>
                               </div>
                               <Link href={`/lessons/grammar/${rule.slug}`} className="button-link button-secondary" style={{ padding: "8px 16px", fontSize: "11px" }}>
                                  {langCookie === "ar" ? "مراجعة" : (langCookie === "fr" ? "Réviser" : "Review")}
                               </Link>
                             </article>
                          ))}
                        </div>
                      </div>

                      {/* Vocab Column */}
                      <div className="stack" style={{ gap: "24px" }}>
                        <div className="row-between">
                          <span className="eyebrow" style={{ color: "var(--success)" }}>{t.lib_vocab_sets}</span>
                          <span className="pill" style={{ fontSize: "10px" }}>{modVocab.length} {t.lib_sets}</span>
                        </div>
                        <div className="stack" style={{ gap: "16px" }}>
                          {modVocab.map(voc => (
                             <article key={voc.id} className="card stack" style={{ padding: "24px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)" }}>
                               <strong style={{ fontSize: "1.1rem" }}>{voc.title}</strong>
                               <span className="pill" style={{ fontSize: "9px", width: "fit-content", marginTop: "8px", borderColor: "var(--success)", color: "var(--success)" }}>{voc.theme}</span>
                               <Link href={`/lessons/vocab/${voc.slug}`} className="button-link" style={{ marginTop: "20px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", width: "100%", justifyContent: "center" }}>Vault</Link>
                             </article>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                );
              })}

              {/* General/Common Section */}
              <section className="stack" style={{ gap: "40px", opacity: 0.8 }}>
                <div className="row-between" style={{ borderBottom: "1px solid var(--glass-border)", paddingBottom: "16px" }}>
                   <h3 style={{ fontSize: "1.5rem", fontWeight: 700 }}>{t.lib_essentials}</h3>
                   <span className="muted" style={{ fontSize: "12px" }}>{langCookie === "ar" ? "أدوات شاملة لأي وحدة" : (langCookie === "fr" ? "Outils universels pour n'importe quelle unité" : "Universal tools for any unit")}</span>
                </div>
                <div className="grid grid-cols-2" style={{ gap: "32px" }}>
                   <div className="card row-between" style={{ padding: "32px" }}>
                      <div className="stack" style={{ gap: "8px" }}>
                         <span className="eyebrow" style={{ color: "var(--accent)" }}>{t.lib_tips_title}</span>
                         <strong>{langCookie === "ar" ? "كيف تتعامل مع نص القراءة؟" : (langCookie === "fr" ? "Comment aborder la lecture ?" : "How to handle reading passages?")}</strong>
                         <p className="muted" style={{ fontSize: "12px" }}>{t.lib_tips_desc}</p>
                      </div>
                      <Link href="/strategy" className="button-link button-secondary">Read Tip</Link>
                   </div>
                   <div className="card row-between" style={{ padding: "32px" }}>
                      <div className="stack" style={{ gap: "8px" }}>
                         <span className="eyebrow" style={{ color: "var(--primary)" }}>{t.nav_writing}</span>
                         <strong>{langCookie === "ar" ? "أدوات ربط الجمل" : (langCookie === "fr" ? "Connecteurs Logiques" : "Common Linking Words")}</strong>
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
