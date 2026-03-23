import { cookies } from "next/headers";
import { SiteLanguage, translations } from "@/lib/translations";
import { BacCalculator } from "./calculator-client";

export default async function CalculatorPage() {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("site-lang")?.value as SiteLanguage || "en";
  const t = translations[langCookie];

  return (
    <div className="page-stack">
       <div className="container" style={{ textAlign: "center", marginBottom: "80px" }}>
          <span className="eyebrow reveal">{t.calc_title}</span>
          <h2 className="section-title-large reveal delay-1">{t.calc_subtitle}</h2>
       </div>

       <div className="container reveal delay-2">
          <BacCalculator lang={langCookie} />
       </div>

       <div className="container section-padding" style={{ textAlign: "center" }}>
          <p className="muted" style={{ maxWidth: "600px", margin: "0 auto" }}>
             {langCookie === "ar" ? "تنبيه: هذا الحساب تقديري بناءً على معاملات الامتحانات الوطنية التونسية فقط. " : (langCookie === "fr" ? "Note : Ce calcul est une estimation basée sur les coefficients nationaux officiels." : "Note: This calculation is an estimate based on official national coefficients.")}
          </p>
       </div>
    </div>
  );
}
