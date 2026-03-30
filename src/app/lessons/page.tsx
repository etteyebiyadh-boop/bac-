import { cookies } from "next/headers";
import { requireCurrentUser } from "@/lib/auth";
import { ensureStudentProfile } from "@/lib/missions";
import { getLanguageLabel } from "@/lib/learning";
import { Language, BacModule } from "@prisma/client";
import { SiteLanguage, translations } from "@/lib/translations";
import { db } from "@/lib/db";
import { getCurriculumSlugs, getCurriculumTrack } from "@/lib/language-system";
import { ResponsiveLessons } from "./responsive-lessons";

export const dynamic = "force-dynamic";

export default async function LibraryHubPage() {
  try {
    const user = await requireCurrentUser();
    const profile = await ensureStudentProfile(user.id);

    const cookieStore = await cookies();
    const langCookie = (cookieStore.get("site-lang")?.value as SiteLanguage) || "en";
    const t = translations[langCookie] || translations.en;

    const MODULE_LABELS: Record<string, string> = {
      MODULE_1_HOLIDAYING_ART_SHOWS: t.unit_1_title || "Unit 1: Holidaying & Art Shows",
      MODULE_2_EDUCATION_MATTERS: t.unit_2_title || "Unit 2: Education Matters",
      MODULE_3_CREATIVE_INVENTIVE_MINDS: t.unit_3_title || "Unit 3: Creative Minds",
      MODULE_4_YOUTH_ISSUES: t.unit_4_title || "Unit 4: Youth Issues",
      MODULE_5_WOMEN_POWER: t.unit_5_title || "Unit 5: Women & Power",
      MODULE_6_SUSTAINABLE_DEVELOPMENT: t.unit_6_title || "Unit 6: Environment",
      MODULE_7_WORK_COMMITMENT: t.unit_7_title || "Unit 7: Work Commitment",
      MODULE_8_LITERARY_TEXTS: t.unit_8_title || "Unit 8: Literary Texts",
    };

    let secondaryLanguages: Language[] = [];
    if (profile.secondaryLanguagesJson) {
      try {
        const parsed = typeof profile.secondaryLanguagesJson === "string" 
          ? JSON.parse(profile.secondaryLanguagesJson) 
          : profile.secondaryLanguagesJson;
        if (Array.isArray(parsed)) secondaryLanguages = parsed as Language[];
      } catch (e) {}
    }

    const activeLanguages = [...new Set([profile.primaryLanguage, ...secondaryLanguages])].filter(Boolean) as Language[];
    
    // Modules logic
    const modules: BacModule[] = [
      BacModule.MODULE_1_HOLIDAYING_ART_SHOWS,
      BacModule.MODULE_2_EDUCATION_MATTERS,
      BacModule.MODULE_3_CREATIVE_INVENTIVE_MINDS,
      BacModule.MODULE_4_YOUTH_ISSUES,
    ];
    if (profile.bacSection === "LETTRES") {
      modules.push(BacModule.MODULE_5_WOMEN_POWER, BacModule.MODULE_6_SUSTAINABLE_DEVELOPMENT);
    }

    // Parallel fetch for speed - filter by Bac section
    const [grammarRules, vocabSets, readingPassages] = await Promise.all([
      db.grammarRule.findMany({
        where: { 
          language: { in: activeLanguages },
          OR: [
            { bacSections: { has: profile.bacSection } },
            { bacSections: { isEmpty: true } },
            { bacSections: { equals: null } }
          ]
        },
        orderBy: { title: "asc" }
      }),
      db.vocabularySet.findMany({
        where: { 
          language: { in: activeLanguages },
          OR: [
            { bacSections: { has: profile.bacSection } },
            { bacSections: { isEmpty: true } },
            { bacSections: { equals: null } }
          ]
        },
        orderBy: { title: "asc" }
      }),
      db.readingPassage.findMany({
        where: { 
          language: { in: activeLanguages },
          OR: [
            { bacModule: { in: modules } },
            { bacModule: { equals: null } }
          ]
        },
        orderBy: { title: "asc" }
      })
    ]);

    // Build curriculum tracks
    const curriculumTracks: Record<string, any> = {};
    const availableSlugs: string[] = [];

    activeLanguages.forEach(lang => {
      const track = getCurriculumTrack(lang);
      if (track) {
        curriculumTracks[lang] = track;
        availableSlugs.push(...getCurriculumSlugs(lang));
      }
    });

    return (
      <ResponsiveLessons
        modules={modules}
        grammarRules={JSON.parse(JSON.stringify(grammarRules))}
        vocabSets={JSON.parse(JSON.stringify(vocabSets))}
        readingPassages={JSON.parse(JSON.stringify(readingPassages))}
        curriculumTracks={curriculumTracks}
        availableSlugs={availableSlugs}
        activeLanguages={activeLanguages}
        lang={langCookie}
        t={t}
        moduleLabels={MODULE_LABELS}
        bacSection={profile.bacSection}
      />
    );
  } catch (err: any) {
    console.error("Library page error:", err);
    return (
      <div style={{ padding: "100px", color: "white", textAlign: "center", background: "#000", minHeight: "100vh" }}>
        <h1 style={{ color: "#6366f1" }}>Library Error</h1>
        <p>{err?.message || "Internal error"}</p>
        <div style={{ marginTop: "40px" }}>
           <a href="/dashboard" style={{ color: "#6366f1" }}>Return Home</a>
        </div>
      </div>
    );
  }
}
