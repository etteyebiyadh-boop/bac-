import { cookies } from "next/headers";
import { SiteLanguage } from "@/lib/translations";
import { DiagnosticWorkspace } from "./diagnostic-workspace";
import { getRecommendedLanguageSequence, isSupportedDiagnosticLanguage, supportedDiagnosticLanguages } from "@/lib/language-roadmap";

type DiagnosticPageProps = {
  searchParams: Promise<{
    language?: string;
    section?: string;
    optionalLang?: string;
  }>;
};

export default async function DiagnosticPage({ searchParams }: DiagnosticPageProps) {
  const resolvedSearchParams = await searchParams;
  const cookieStore = await cookies();
  const langCookie = (cookieStore.get("site-lang")?.value as SiteLanguage) || "en";

  const initialLanguage = isSupportedDiagnosticLanguage(resolvedSearchParams.language)
    ? resolvedSearchParams.language
    : "ENGLISH";

  const recommendedLanguages = [
    ...getRecommendedLanguageSequence(resolvedSearchParams.optionalLang),
    ...supportedDiagnosticLanguages.filter((language) => !getRecommendedLanguageSequence(resolvedSearchParams.optionalLang).includes(language))
  ];

  return (
    <DiagnosticWorkspace
      lang={langCookie}
      initialLanguage={initialLanguage}
      sectionLabel={resolvedSearchParams.section ?? null}
      recommendedLanguages={recommendedLanguages}
    />
  );
}
