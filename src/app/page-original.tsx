import { cookies } from "next/headers";
import { SiteLanguage, translations } from "@/lib/translations";
import { HomeClient } from "@/components/home-client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const cookieStore = await cookies();
  const langCookie = (cookieStore.get("site-lang")?.value as SiteLanguage) || "en";
  const t = translations[langCookie] || translations.en;
  const isRTL = langCookie === "ar";

  return (
    <HomeClient 
      lang={langCookie} 
      t={t} 
      isRTL={isRTL} 
    />
  );
}
