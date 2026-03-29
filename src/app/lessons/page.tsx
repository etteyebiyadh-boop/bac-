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
    // 1. Auth & Profile (Already proven to work in Dashboard)
    const user = await requireCurrentUser();
    const profile = await ensureStudentProfile(user.id);

    // 2. Internationalization
    const cookieStore = await cookies();
    const langCookie = cookieStore.get("site-lang")?.value as SiteLanguage || "en";
    const t = translations[langCookie] || translations.en;

    const MODULE_LABELS: Record<string, string> = {
      MODULE_1_HOLIDAYING_ART_SHOWS: t.unit_1_title || "Holidaying & Art",
      MODULE_2_EDUCATION_MATTERS: t.unit_2_title || "Education Matters",
      MODULE_3_CREATIVE_INVENTIVE_MINDS: t.unit_3_title || "Creative Minds",
      MODULE_4_YOUTH_ISSUES: t.unit_4_title || "Youth Issues",
      MODULE_5_WOMEN_POWER: t.unit_5_title || "Women Power",
      MODULE_6_SUSTAINABLE_DEVELOPMENT: t.unit_6_title || "Sustainability",
      MODULE_7_WORK_COMMITMENT: t.unit_7_title || "Work Commitment",
      MODULE_8_LITERARY_TEXTS: t.unit_8_title || "Literary Texts",
    };

    // 3. Language Selection logic
    let secondaryLanguages: Language[] = [];
    if (profile.secondaryLanguagesJson) {
      try {
        const parsed = typeof profile.secondaryLanguagesJson === "string" 
          ? JSON.parse(profile.secondaryLanguagesJson) 
          : profile.secondaryLanguagesJson;
        if (Array.isArray(parsed)) secondaryLanguages = parsed as Language[];
      } catch (e) {
        console.error("[LIBRARY] Language parse error");
      }
    }

    const activeLanguages = [...new Set([profile.primaryLanguage, ...secondaryLanguages])].filter(Boolean) as Language[];
    const curriculumSlugs = [...new Set(activeLanguages.flatMap(lang => getCurriculumSlugs(lang)))];

    console.log(`[LIBRARY] Fetching data for ${activeLanguages.length} languages...`);

    // 4. Optimized Data Fetching (Sequential + Limits) to avoid Vercel timeouts
    const grammarRules = await db.grammarRule.findMany({
      where: { language: { in: activeLanguages } },
      take: 50,
      orderBy: { createdAt: "desc" }
    });

    const vocabSets = await db.vocabularySet.findMany({
      where: { language: { in: activeLanguages } },
      take: 50,
      orderBy: { createdAt: "desc" }
    });

    const readingPassages = await db.readingPassage.findMany({
      where: { language: { in: activeLanguages } },
      take: 50,
      orderBy: { createdAt: "desc" }
    });

    const curriculumLessons = curriculumSlugs.length > 0
      ? await db.lesson.findMany({
          where: { slug: { in: curriculumSlugs } },
          select: { slug: true }
        })
      : [];

    const availableCurriculumSlugs = curriculumLessons.map(l => l.slug);

    // 5. Modules logic
    const modules: BacModule[] = [
      BacModule.MODULE_1_HOLIDAYING_ART_SHOWS,
      BacModule.MODULE_2_EDUCATION_MATTERS,
      BacModule.MODULE_3_CREATIVE_INVENTIVE_MINDS,
      BacModule.MODULE_4_YOUTH_ISSUES,
    ];
    if (profile.bacSection === "LETTRES") {
      modules.push(BacModule.MODULE_5_WOMEN_POWER, BacModule.MODULE_6_SUSTAINABLE_DEVELOPMENT);
    }

    // 6. Tracks
    const curriculumTracks: Record<string, any> = {};
    activeLanguages.forEach(lang => {
      const track = getCurriculumTrack(lang);
      if (track) curriculumTracks[lang] = track;
    });

    // 7. Safe Serialization
    const props = JSON.parse(JSON.stringify({
      grammarRules,
      vocabSets,
      readingPassages,
      curriculumTracks,
      activeLanguages,
      availableSlugs: availableCurriculumSlugs,
      modules,
      bacSection: profile.bacSection,
      lang: langCookie,
      moduleLabels: MODULE_LABELS
    }));

    return (
      <ResponsiveLessons
        {...props}
        t={t}
        getLanguageLabel={getLanguageLabel}
      />
    );
  } catch (err: any) {
    console.error("[LIBRARY_FATAL]", err);
    return (
      <div style={{ padding: "100px 20px", textAlign: "center", background: "#000", color: "#fff", minHeight: "100vh" }}>
        <h1 style={{ color: "#6366f1" }}>Library Temporary Offline</h1>
        <p style={{ opacity: 0.6, marginTop: "16px" }}>Error Code: {err?.code || err?.name || "500"}</p>
        <div style={{ marginTop: "40px", fontSize: "14px", fontStyle: "italic", border: "1px solid #333", display: "inline-block", padding: "20px" }}>
          {err?.message || "Internal connection error"}
        </div>
      </div>
    );
  }
}
