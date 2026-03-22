import { requireCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ensureDailyMission, ensureStudentProfile } from "@/lib/missions";
import { Language, GrammarCategory, VocabTheme } from "@prisma/client";
import { LanguageSelector } from "./LanguageSelector";

export const dynamic = "force-dynamic";

export default async function LessonsPage({
  searchParams
}: {
  searchParams?: Promise<{ lang?: string; tab?: string }>;
}) {
  const user = await requireCurrentUser();
  const profile = await ensureStudentProfile(user.id);
  
  const rawParams = await searchParams;
  const currentLang = (rawParams?.lang as Language) || profile.primaryLanguage || Language.ENGLISH;
  const activeTab = rawParams?.tab || "grammar";

  // Fetch comprehensive content
  const [mission, lessons, grammarRules, verbs, vocabSets] = await Promise.all([
    ensureDailyMission(user.id),
    db.lesson.findMany({
      where: { language: currentLang },
      orderBy: [{ difficulty: "asc" }, { estimatedMinutes: "asc" }, { title: "asc" }]
    }),
    db.grammarRule.findMany({
      where: { language: currentLang },
      orderBy: [{ isEssential: "desc" }, { category: "asc" }]
    }),
    db.verbConjugation.findMany({
      where: { language: currentLang },
      orderBy: [{ isIrregular: "desc" }, { baseForm: "asc" }],
      take: 50
    }),
    db.vocabularySet.findMany({
      where: { language: currentLang },
      include: { items: true },
      orderBy: [{ theme: "asc" }]
    })
  ]);

  const grammarLessons = lessons.filter(l => l.skillFocus === "grammar");
  const vocabLessons = lessons.filter(l => l.skillFocus === "vocabulary");
  const structureLessons = lessons.filter(l => l.skillFocus === "structure");

  // Group grammar rules by category
  const grammarByCategory = grammarRules.reduce((acc, rule) => {
    const cat = rule.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(rule);
    return acc;
  }, {} as Record<string, typeof grammarRules>);

  // Group vocabulary by theme
  const vocabByTheme = vocabSets.reduce((acc, set) => {
    const theme = set.theme;
    if (!acc[theme]) acc[theme] = [];
    acc[theme].push(set);
    return acc;
  }, {} as Record<string, typeof vocabSets>);

  // Separate irregular verbs and phrasal verbs
  const irregularVerbs = verbs.filter(v => v.isIrregular && !v.isPhrasal);
  const phrasalVerbs = verbs.filter(v => v.isPhrasal);
  const regularVerbs = verbs.filter(v => v.isRegular && !v.isPhrasal);

  return (
    <div className="page-stack">
      {/* Hero Section */}
      <section className="card stack hero-panel" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="row-between">
          <div className="stack" style={{ zIndex: 1 }}>
            <span className="eyebrow" style={{ color: '#e7bf87' }}>Complete BAC Prep</span>
            <h1 className="section-title" style={{ color: 'white' }}>Everything for your BAC English exam.</h1>
          </div>
          
          <div style={{ zIndex: 2, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>Library:</span>
            <LanguageSelector currentLang={currentLang} activeTab={activeTab} />
          </div>
        </div>
        <p className="muted" style={{ color: 'rgba(255,255,255,0.85)', zIndex: 1, maxWidth: '700px' }}>
          Grammar rules, verb conjugations, thematic vocabulary, and essay structures. 
          All organized for BAC exam success. <strong>{grammarRules.length}</strong> rules, 
          <strong> {verbs.length}</strong> verbs, <strong>{vocabSets.length}</strong> vocabulary sets.
        </p>
        <div style={{ position: 'absolute', right: '-10%', top: '-20%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 60%)', borderRadius: '50%' }} />
      </section>

      {/* Tab Navigation */}
      <div className="card" style={{ padding: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <TabLink tab="grammar" label="📘 Grammar Rules" active={activeTab} count={grammarRules.length} />
        <TabLink tab="verbs" label="� Verbs" active={activeTab} count={verbs.length} />
        <TabLink tab="vocabulary" label="📚 Vocabulary" active={activeTab} count={vocabSets.reduce((acc, s) => acc + s.items.length, 0)} />
        <TabLink tab="lessons" label="📖 Lessons" active={activeTab} count={lessons.length} />
      </div>

      {/* Content based on active tab */}
      {activeTab === "grammar" && (
        <GrammarSection 
          grammarByCategory={grammarByCategory} 
          isRecommended={mission?.skillFocus === "grammar"} 
        />
      )}

      {activeTab === "verbs" && (
        <VerbsSection 
          irregularVerbs={irregularVerbs}
          phrasalVerbs={phrasalVerbs}
          regularVerbs={regularVerbs}
          isRecommended={mission?.skillFocus === "vocabulary"}
        />
      )}

      {activeTab === "vocabulary" && (
        <VocabularySection 
          vocabByTheme={vocabByTheme}
          isRecommended={mission?.skillFocus === "vocabulary"}
        />
      )}

      {activeTab === "lessons" && (
        <LessonsSection 
          grammarLessons={grammarLessons}
          vocabLessons={vocabLessons}
          structureLessons={structureLessons}
          missionSkillFocus={mission?.skillFocus}
        />
      )}
    </div>
  );
}

function TabLink({ tab, label, active, count }: { tab: string; label: string; active: string; count: number }) {
  const isActive = active === tab;
  return (
    <a 
      href={`?tab=${tab}`}
      className={`pill ${isActive ? 'primary-pill' : ''}`}
      style={{ 
        textDecoration: 'none',
        fontWeight: isActive ? 700 : 500,
        opacity: isActive ? 1 : 0.8
      }}
    >
      {label} <span style={{ fontSize: '0.8em', opacity: 0.7 }}>({count})</span>
    </a>
  );
}

function GrammarSection({ grammarByCategory, isRecommended }: { grammarByCategory: Record<string, any[]>, isRecommended: boolean }) {
  const categories = Object.keys(grammarByCategory);
  
  if (categories.length === 0) {
    return (
      <section className="card stack" style={{ textAlign: "center", padding: "48px 20px" }}>
        <h2 className="section-title">Grammar rules coming soon</h2>
        <p className="muted">The content team is preparing comprehensive grammar coverage.</p>
      </section>
    );
  }

  const categoryLabels: Record<string, string> = {
    TENSES: "⏱️ Verb Tenses",
    CONDITIONALS: "❓ Conditionals",
    MODALS: "💪 Modal Verbs",
    PASSIVE_VOICE: "🔇 Passive Voice",
    REPORTED_SPEECH: "💬 Reported Speech",
    ARTICLES: "📰 Articles",
    PREPOSITIONS: "📍 Prepositions",
    CONNECTORS: "🔗 Connectors",
    RELATIVE_CLAUSES: "📎 Relative Clauses",
    COMPARATIVES: "⚖️ Comparatives"
  };

  return (
    <div className="page-stack">
      {categories.map(category => (
        <section key={category} className="stack">
          <h2 className="section-title" style={{ fontSize: "1.4rem", display: "flex", gap: "10px", alignItems: "center" }}>
            {categoryLabels[category] || category}
            {isRecommended && <span className="pill success-pill">⭐ Recommended</span>}
          </h2>
          <div className="feature-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))" }}>
            {grammarByCategory[category].map(rule => (
              <GrammarRuleCard key={rule.id} rule={rule} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function GrammarRuleCard({ rule }: { rule: any }) {
  const examples = Array.isArray(rule.examples) ? rule.examples : [];
  const exceptions = Array.isArray(rule.exceptions) ? rule.exceptions : [];
  const commonErrors = Array.isArray(rule.commonErrors) ? rule.commonErrors : [];
  
  return (
    <article className="card stack" style={{ height: "100%" }}>
      <div className="row-between">
        <span className="eyebrow" style={{ color: "var(--primary)" }}>{rule.category}</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {rule.isEssential && <span className="pill success-pill">Essential</span>}
          <span className="pill">{rule.difficulty}</span>
        </div>
      </div>
      <h3 className="section-title" style={{ fontSize: "1.2rem", marginTop: "4px" }}>{rule.title}</h3>
      <p style={{ fontWeight: 500, fontSize: "0.95rem" }}>{rule.rule}</p>
      
      {rule.formula && (
        <div style={{ background: 'var(--bg-2)', padding: '8px 12px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
          {rule.formula}
        </div>
      )}
      
      {examples.length > 0 && (
        <div style={{ marginTop: "8px" }}>
          <strong style={{ fontSize: "0.85rem" }}>Examples:</strong>
          <ul style={{ margin: '4px 0 0 16px', padding: 0, fontSize: '0.85rem' }}>
            {examples.slice(0, 2).map((ex: any, i: number) => (
              <li key={i} style={{ marginBottom: '4px' }}>
                {typeof ex === 'string' ? ex : (ex.positive || ex.example || JSON.stringify(ex))}
              </li>
            ))}
          </ul>
        </div>
      )}

      {rule.usageNotes && (
        <p className="muted" style={{ fontSize: "0.85rem", fontStyle: "italic" }}>
          💡 {rule.usageNotes}
        </p>
      )}
      
      {exceptions.length > 0 && (
        <div style={{ marginTop: "auto", paddingTop: "12px" }}>
          <strong style={{ fontSize: "0.8rem", color: "var(--danger)" }}>⚠️ Exceptions:</strong>
          <ul style={{ margin: '4px 0 0 16px', padding: 0, fontSize: '0.8rem' }}>
            {exceptions.slice(0, 2).map((ex: string, i: number) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
        </div>
      )}

      {commonErrors.length > 0 && (
        <div style={{ marginTop: "8px" }}>
          <strong style={{ fontSize: "0.8rem", color: "var(--warning)" }}>❌ Common Errors:</strong>
          <ul style={{ margin: '4px 0 0 16px', padding: 0, fontSize: '0.8rem' }}>
            {commonErrors.slice(0, 2).map((err: string, i: number) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

function VerbsSection({ irregularVerbs, phrasalVerbs, regularVerbs, isRecommended }: { 
  irregularVerbs: any[], 
  phrasalVerbs: any[], 
  regularVerbs: any[],
  isRecommended: boolean 
}) {
  return (
    <div className="page-stack">
      {irregularVerbs.length > 0 && (
        <section className="stack">
          <h2 className="section-title" style={{ fontSize: "1.4rem", display: "flex", gap: "10px", alignItems: "center" }}>
            🔥 Essential Irregular Verbs
            {isRecommended && <span className="pill success-pill">⭐ Recommended</span>}
          </h2>
          <div className="feature-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {irregularVerbs.slice(0, 24).map(verb => (
              <VerbCard key={verb.id} verb={verb} />
            ))}
          </div>
        </section>
      )}

      {phrasalVerbs.length > 0 && (
        <section className="stack" style={{ marginTop: "24px" }}>
          <h2 className="section-title" style={{ fontSize: "1.4rem" }}>
            🎯 Phrasal Verbs
          </h2>
          <div className="feature-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {phrasalVerbs.map(verb => (
              <VerbCard key={verb.id} verb={verb} />
            ))}
          </div>
        </section>
      )}

      {regularVerbs.length > 0 && (
        <section className="stack" style={{ marginTop: "24px" }}>
          <h2 className="section-title" style={{ fontSize: "1.4rem" }}>
            ✅ Common Regular Verbs
          </h2>
          <div className="feature-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
            {regularVerbs.slice(0, 12).map(verb => (
              <SimpleVerbCard key={verb.id} verb={verb} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function VerbCard({ verb }: { verb: any }) {
  const commonUses = Array.isArray(verb.commonUses) ? verb.commonUses : [];
  const exampleSentences = Array.isArray(verb.exampleSentences) ? verb.exampleSentences : [];
  const collocations = Array.isArray(verb.collocations) ? verb.collocations : [];
  
  return (
    <article className="card stack" style={{ height: "100%" }}>
      <div className="row-between">
        <h3 className="section-title" style={{ fontSize: "1.3rem", margin: 0 }}>{verb.baseForm}</h3>
        <div style={{ display: 'flex', gap: '4px' }}>
          {verb.isIrregular && <span className="pill" style={{ background: 'var(--warning)' }}>Irregular</span>}
          {verb.isPhrasal && <span className="pill success-pill">Phrasal</span>}
          {verb.isModal && <span className="pill" style={{ background: 'var(--info)' }}>Modal</span>}
        </div>
      </div>
      
      <div style={{ background: 'var(--bg-2)', padding: '12px', borderRadius: '8px', fontSize: '0.9rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 12px' }}>
          <span style={{ color: 'var(--muted)' }}>Past:</span>
          <span style={{ fontWeight: 600 }}>{verb.pastSimple}</span>
          <span style={{ color: 'var(--muted)' }}>Participle:</span>
          <span style={{ fontWeight: 600 }}>{verb.pastParticiple}</span>
          {verb.presentParticiple && (
            <>
              <span style={{ color: 'var(--muted)' }}>-ing:</span>
              <span>{verb.presentParticiple}</span>
            </>
          )}
          {verb.thirdPersonSingular && (
            <>
              <span style={{ color: 'var(--muted)' }}>3rd person:</span>
              <span>{verb.thirdPersonSingular}</span>
            </>
          )}
        </div>
      </div>

      {commonUses.length > 0 && (
        <div>
          <strong style={{ fontSize: "0.85rem" }}>Uses:</strong>
          <ul style={{ margin: '4px 0 0 16px', padding: 0, fontSize: '0.85rem' }}>
            {commonUses.slice(0, 3).map((use: string, i: number) => (
              <li key={i}>{use}</li>
            ))}
          </ul>
        </div>
      )}

      {exampleSentences.length > 0 && (
        <div style={{ marginTop: "8px" }}>
          <strong style={{ fontSize: "0.85rem" }}>Examples:</strong>
          {exampleSentences.slice(0, 2).map((ex: string, i: number) => (
            <p key={i} className="muted" style={{ fontSize: "0.8rem", margin: '4px 0', fontStyle: 'italic' }}>
              "{ex}"
            </p>
          ))}
        </div>
      )}

      {collocations.length > 0 && (
        <div style={{ marginTop: "auto", paddingTop: "12px" }}>
          <strong style={{ fontSize: "0.8rem" }}>Collocations:</strong>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
            {collocations.slice(0, 4).map((col: string, i: number) => (
              <span key={i} className="pill" style={{ fontSize: '0.75rem' }}>{col}</span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

function SimpleVerbCard({ verb }: { verb: any }) {
  return (
    <article className="card" style={{ padding: '16px' }}>
      <h4 style={{ margin: '0 0 8px 0' }}>{verb.baseForm}</h4>
      <div style={{ fontSize: '0.85rem', color: 'var(--muted)' }}>
        <div>past: <strong>{verb.pastSimple}</strong></div>
        <div>participle: <strong>{verb.pastParticiple}</strong></div>
      </div>
    </article>
  );
}

function VocabularySection({ vocabByTheme, isRecommended }: { vocabByTheme: Record<string, any[]>, isRecommended: boolean }) {
  const themes = Object.keys(vocabByTheme);
  
  if (themes.length === 0) {
    return (
      <section className="card stack" style={{ textAlign: "center", padding: "48px 20px" }}>
        <h2 className="section-title">Vocabulary sets coming soon</h2>
        <p className="muted">The content team is preparing thematic vocabulary lists.</p>
      </section>
    );
  }

  const themeLabels: Record<string, string> = {
    ENVIRONMENT: "🌍 Environment",
    TECHNOLOGY: "💻 Technology",
    EDUCATION: "📚 Education",
    HEALTH: "🏥 Health",
    SOCIETY: "👥 Society",
    POLITICS: "🏛️ Politics",
    ECONOMY: "💰 Economy",
    CULTURE: "🎭 Culture",
    SPORTS: "⚽ Sports",
    TRAVEL: "✈️ Travel",
    WORK: "💼 Work",
    FAMILY: "👨‍👩‍👧‍👦 Family",
    MEDIA: "📺 Media",
    SCIENCE: "🔬 Science",
    GLOBAL_ISSUES: "🌐 Global Issues"
  };

  return (
    <div className="page-stack">
      {themes.map(theme => (
        <section key={theme} className="stack">
          <h2 className="section-title" style={{ fontSize: "1.4rem", display: "flex", gap: "10px", alignItems: "center" }}>
            {themeLabels[theme] || theme}
            {isRecommended && <span className="pill success-pill">⭐ Recommended</span>}
          </h2>
          {vocabByTheme[theme].map(set => (
            <div key={set.id} className="card stack" style={{ marginBottom: '16px' }}>
              <div className="row-between">
                <h3 style={{ margin: 0 }}>{set.title}</h3>
                <span className="pill">{set.items.length} words</span>
              </div>
              <p className="muted">{set.description}</p>
              <p style={{ fontSize: '0.85rem', fontStyle: 'italic' }}>💡 BAC Context: {set.bacContext}</p>
              
              <div className="feature-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", marginTop: '12px' }}>
                {set.items.slice(0, 8).map((item: any) => (
                  <VocabItemCard key={item.id} item={item} />
                ))}
              </div>
              
              {set.items.length > 8 && (
                <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.85rem' }}>
                  +{set.items.length - 8} more words in this set
                </p>
              )}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

function VocabItemCard({ item }: { item: any }) {
  const collocations = Array.isArray(item.collocations) ? item.collocations : [];
  
  return (
    <div style={{ background: 'var(--bg-2)', padding: '12px', borderRadius: '8px' }}>
      <div className="row-between" style={{ marginBottom: '4px' }}>
        <strong style={{ fontSize: '1.1rem' }}>{item.word}</strong>
        <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{item.partOfSpeech}</span>
      </div>
      <p style={{ fontSize: '0.85rem', margin: '4px 0' }}>{item.definition}</p>
      <p className="muted" style={{ fontSize: '0.75rem', fontStyle: 'italic', margin: '4px 0' }}>
        "{item.bacExample}"
      </p>
      {collocations.length > 0 && (
        <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {collocations.slice(0, 2).map((col: string, i: number) => (
            <span key={i} className="pill" style={{ fontSize: '0.7rem' }}>{col}</span>
          ))}
        </div>
      )}
    </div>
  );
}

function LessonsSection({ 
  grammarLessons, 
  vocabLessons, 
  structureLessons,
  missionSkillFocus 
}: { 
  grammarLessons: any[], 
  vocabLessons: any[], 
  structureLessons: any[],
  missionSkillFocus?: string 
}) {
  return (
    <div className="page-stack">
      {grammarLessons.length > 0 && (
        <section className="stack">
          <h2 className="section-title" style={{ fontSize: "1.4rem" }}>
            📘 Grammar Lessons
          </h2>
          <div className="feature-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
            {grammarLessons.map(lesson => (
              <LessonCard key={lesson.id} lesson={lesson} isRecommended={missionSkillFocus === "grammar"} />
            ))}
          </div>
        </section>
      )}

      {vocabLessons.length > 0 && (
        <section className="stack" style={{ marginTop: "24px" }}>
          <h2 className="section-title" style={{ fontSize: "1.4rem" }}>
            📚 Vocabulary Lessons
          </h2>
          <div className="feature-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
            {vocabLessons.map(lesson => (
              <LessonCard key={lesson.id} lesson={lesson} isRecommended={missionSkillFocus === "vocabulary"} />
            ))}
          </div>
        </section>
      )}

      {structureLessons.length > 0 && (
        <section className="stack" style={{ marginTop: "24px" }}>
          <h2 className="section-title" style={{ fontSize: "1.4rem" }}>
            🏗️ Structure Lessons
          </h2>
          <div className="feature-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
            {structureLessons.map(lesson => (
              <LessonCard key={lesson.id} lesson={lesson} isRecommended={missionSkillFocus === "structure"} />
            ))}
          </div>
        </section>
      )}

      {grammarLessons.length === 0 && vocabLessons.length === 0 && structureLessons.length === 0 && (
        <section className="card stack" style={{ textAlign: "center", padding: "48px 20px" }}>
          <h2 className="section-title">Lessons coming soon</h2>
          <p className="muted">The content team is preparing guided lessons.</p>
        </section>
      )}
    </div>
  );
}

function LessonCard({ lesson, isRecommended }: { lesson: any; isRecommended: boolean }) {
  const takeaways = Array.isArray(lesson.takeawayJson) ? lesson.takeawayJson : [];
  
  return (
    <article className="card stack" style={{ height: "100%" }}>
      <div className="row-between">
        <span className="eyebrow" style={{ color: "var(--primary)" }}>{lesson.theme}</span>
        <span className={`pill ${isRecommended ? "success-pill" : ""}`}>
          {isRecommended ? "⭐ Top Priority" : `${lesson.estimatedMinutes} min`}
        </span>
      </div>
      <h3 className="section-title" style={{ fontSize: "1.25rem", marginTop: "4px" }}>{lesson.title}</h3>
      <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>{lesson.summary}</p>
      
      {takeaways.length > 0 && (
        <div style={{ marginTop: "16px" }}>
          <ul className="bullet-list" style={{ margin: 0 }}>
            <li style={{ fontSize: "0.85rem", color: "var(--ink)" }}>{String(takeaways[0])}</li>
            {takeaways.length > 1 && <li style={{ fontSize: "0.85rem", color: "var(--ink)", opacity: 0.6 }}>+ {takeaways.length - 1} more</li>}
          </ul>
        </div>
      )}
      
      <div style={{ marginTop: "auto", paddingTop: "24px" }}>
        <a className="button-link button-secondary full-width" href={`/lessons/${lesson.slug}`} style={{ textAlign: "center" }}>
          Read Full Resource →
        </a>
      </div>
    </article>
  );
}
