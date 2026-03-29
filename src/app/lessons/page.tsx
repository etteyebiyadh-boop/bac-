import { cookies } from "next/headers";
import { requireCurrentUser } from "@/lib/auth";
import { ensureStudentProfile } from "@/lib/missions";
import { getLanguageLabel } from "@/lib/learning";
import { Language, BacModule } from "@prisma/client";
import { SiteLanguage, translations } from "@/lib/translations";
import { getCurriculumSlugs, getCurriculumTrack } from "@/lib/language-system";
import { ResponsiveLessons } from "./responsive-lessons";

export const dynamic = "force-dynamic";

export default async function LibraryHubPage() {
  try {
    const user = await requireCurrentUser();
    const profile = await ensureStudentProfile(user.id);

    const cookieStore = await cookies();
    const langCookie = cookieStore.get("site-lang")?.value as SiteLanguage || "en";
    const t = translations[langCookie] || translations.en;

    const MODULE_LABELS: Record<string, string> = {
      MODULE_1_HOLIDAYING_ART_SHOWS: t.unit_1_title || "Unit 1",
      MODULE_2_EDUCATION_MATTERS: t.unit_2_title || "Unit 2",
      MODULE_3_CREATIVE_INVENTIVE_MINDS: t.unit_3_title || "Unit 3",
      MODULE_4_YOUTH_ISSUES: t.unit_4_title || "Unit 4",
      MODULE_5_WOMEN_POWER: t.unit_5_title || "Unit 5",
      MODULE_6_SUSTAINABLE_DEVELOPMENT: t.unit_6_title || "Unit 6",
      MODULE_7_WORK_COMMITMENT: t.unit_7_title || "Unit 7",
      MODULE_8_LITERARY_TEXTS: t.unit_8_title || "Unit 8",
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

    // Build curriculum tracks
    const curriculumTracks: Record<string, any> = {};
    activeLanguages.forEach(lang => {
      curriculumTracks[lang] = getCurriculumTrack(lang);
    });

    const safeProps = JSON.parse(JSON.stringify({
      modules,
      grammarRules: [],
      vocabSets: [],
      readingPassages: [],
      curriculumTracks,
      availableSlugs: [], // Temporarily empty
      activeLanguages,
      lang: langCookie,
      moduleLabels: MODULE_LABELS,
      bacSection: profile.bacSection,
    }));

    return (
      <ResponsiveLessons
        {...safeProps}
        t={t}
        getLanguageLabel={getLanguageLabel}
      />
    );
  } catch (err: any) {
    return (
      <div style={{ padding: "100px", color: "white", textAlign: "center", background: "#000", minHeight: "100vh" }}>
        <h1 style={{ color: "#6366f1" }}>Library Reconstruction Error (JSON Part)</h1>
        <pre>{err?.message || "Internal error"}</pre>
        <p>Code: {err?.code}</p>
      </div>
    );
  }
}
