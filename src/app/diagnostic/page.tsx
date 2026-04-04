import { cookies } from "next/headers";
import { SiteLanguage, translations } from "@/lib/translations";
import { DiagnosticEngine } from "@/components/DiagnosticEngine";

export default async function DiagnosticPage() {
  const cookieStore = await cookies();
  const langCookie = (cookieStore.get("site-lang")?.value as SiteLanguage) || "en";
  const t = translations[langCookie] || translations.en;

  return (
    <div className="container" style={{ direction: langCookie === "ar" ? "rtl" : "ltr" }}>
      <DiagnosticEngine />
    </div>
  );
}
