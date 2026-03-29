import Link from "next/link";
import { cookies } from "next/headers";
import { requireCurrentUser } from "@/lib/auth";
import { ensureStudentProfile } from "@/lib/missions";
import { getLanguageLabel, getBacSectionLabel } from "@/lib/learning";
import { Language, BacSection, BacModule } from "@prisma/client";
import { db } from "@/lib/db";
import { SiteLanguage, translations } from "@/lib/translations";
import { getCurriculumSlugs, getCurriculumTrack, skillLabels } from "@/lib/language-system";
import { ResponsiveLessons } from "./responsive-lessons";
import { MobileLessons } from "./mobile-lessons";
import { DesktopLessons } from "./desktop-lessons";

export const dynamic = "force-dynamic";

export default async function LibraryHubPage() {
  try {
    const user = await requireCurrentUser();
    const profile = await ensureStudentProfile(user.id);

    const cookieStore = await cookies();
    const langCookie = cookieStore.get("site-lang")?.value as SiteLanguage || "en";
    const t = translations[langCookie] || translations.en;

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
    } catch(e) {
      console.error("[LIBRARY] Secondary languages parse error:", e);
    }

    const rawLanguages = [profile.primaryLanguage, ...secondaryLanguages].filter(Boolean);
    const activeLanguages = [...new Set(rawLanguages)];
    const curriculumSlugs = [...new Set(activeLanguages.flatMap((language) => getCurriculumSlugs(language)))];

    console.log(`[LIBRARY] Loading for user ${user.id}, languages: ${activeLanguages}`);

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

    const availableCurriculumSlugs = curriculumLessons.map((lesson) => lesson.slug);

    // Prepare modules array
    let modules: BacModule[] = [
      BacModule.MODULE_1_HOLIDAYING_ART_SHOWS,
      BacModule.MODULE_2_EDUCATION_MATTERS,
      BacModule.MODULE_3_CREATIVE_INVENTIVE_MINDS,
      BacModule.MODULE_4_YOUTH_ISSUES,
    ];
    if (profile.bacSection === "LETTRES") {
      modules.push(BacModule.MODULE_5_WOMEN_POWER);
      modules.push(BacModule.MODULE_6_SUSTAINABLE_DEVELOPMENT);
    }

    // Build curriculum tracks for all languages
    const curriculumTracks: Record<string, any> = {};
    activeLanguages.forEach(lang => {
      try {
        curriculumTracks[lang] = getCurriculumTrack(lang);
      } catch (e) {
        console.error(`[LIBRARY] Curriculum track error for ${lang}:`, e);
      }
    });

    // Safety: Serialize all database results to avoid Date serialization issues in Server -> Client boundary
    const safeData = JSON.parse(JSON.stringify({
      grammarRules,
      vocabSets,
      readingPassages,
      curriculumTracks,
      activeLanguages,
    }));

    return (
      <ResponsiveLessons
        modules={modules}
        grammarRules={safeData.grammarRules}
        vocabSets={safeData.vocabSets}
        readingPassages={safeData.readingPassages}
        curriculumTracks={safeData.curriculumTracks}
        availableSlugs={availableCurriculumSlugs}
        activeLanguages={safeData.activeLanguages}
        lang={langCookie}
        t={t}
        getLanguageLabel={getLanguageLabel}
        moduleLabels={MODULE_LABELS}
        bacSection={profile.bacSection}
      />
    );
  } catch (error: any) {
    console.error("[LIBRARY_CRITICAL_ERROR]", error);
    
    // In production, showing the error name and message helps debug without Vercel log access
    return (
      <div style={{ padding: "40px", color: "white", textAlign: "center", background: "#050505", minHeight: "100vh" }}>
        <h1 style={{ color: "var(--primary)" }}>Library Connection Error</h1>
        <p style={{ opacity: 0.7, marginTop: "20px" }}>We couldn't load the library. This might be a database connection issue.</p>
        <div style={{ 
          marginTop: "40px", 
          padding: "20px", 
          background: "rgba(255,0,0,0.1)", 
          border: "1px solid rgba(255,0,0,0.2)",
          borderRadius: "12px",
          textAlign: "left",
          maxWidth: "600px",
          margin: "40px auto"
        }}>
          <p style={{ fontWeight: 700 }}>Diagnostics:</p>
          <pre style={{ fontSize: "12px", marginTop: "10px", whiteSpace: "pre-wrap", opacity: 0.8 }}>
            Error: {error?.message || "Unknown error"}
            {error?.code ? `\nCode: ${error.code}` : ""}
            {error?.name ? `\nName: ${error.name}` : ""}
          </pre>
        </div>
        <button 
          onClick={() => window.location.reload()}
          style={{ 
            marginTop: "20px", 
            padding: "12px 24px", 
            borderRadius: "8px", 
            background: "var(--primary)", 
            color: "white", 
            border: "none",
            cursor: "pointer"
          }}
        >
          Try Refreshing
        </button>
      </div>
    );
  }
}
