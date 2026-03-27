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
    curriculumTracks[lang] = getCurriculumTrack(lang);
  });

  return (
    <ResponsiveLessons
      mobileComponent={
        <MobileLessons
          modules={modules}
          grammarRules={grammarRules}
          vocabSets={vocabSets}
          readingPassages={readingPassages}
          curriculumTracks={curriculumTracks}
          availableSlugs={availableCurriculumSlugs}
          activeLanguages={activeLanguages}
          lang={langCookie}
          t={t}
          getLanguageLabel={getLanguageLabel}
        />
      }
    >
      <DesktopLessons
        modules={modules}
        grammarRules={grammarRules}
        vocabSets={vocabSets}
        readingPassages={readingPassages}
        curriculumTracks={curriculumTracks}
        availableSlugs={availableCurriculumSlugs}
        activeLanguages={activeLanguages}
        lang={langCookie}
        t={t}
        getLanguageLabel={getLanguageLabel}
        moduleLabels={MODULE_LABELS}
        bacSection={profile.bacSection}
      />
    </ResponsiveLessons>
  );
}
