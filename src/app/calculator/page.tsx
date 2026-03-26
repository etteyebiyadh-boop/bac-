import { cookies } from "next/headers";
import { SiteLanguage, translations } from "@/lib/translations";
import { requireCurrentUser } from "@/lib/auth";
import { ensureStudentProfile } from "@/lib/missions";
import { ScoreCalculator } from "./score-calculator";
import Link from "next/link";

export default async function CalculatorPage() {
  const user = await requireCurrentUser();
  const profile = await ensureStudentProfile(user.id);
  const cookieStore = await cookies();
  const langCookie = (cookieStore.get("site-lang")?.value as SiteLanguage) || "en";
  const t = translations[langCookie];

  return (
    <div className="page-stack" style={{ direction: langCookie === "ar" ? "rtl" : "ltr" }}>
      <section className="card stack hero-panel" style={{ padding: "56px", border: "1px solid var(--primary)", background: "radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent)" }}>
        <div style={{ position: "absolute", right: "-10%", top: "-50%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div className="stack" style={{ zIndex: 1, position: "relative", gap: "24px" }}>
          <span className="eyebrow" style={{ color: "var(--primary)" }}>{t.nav_calc}</span>
          <h1 className="section-title" style={{ fontSize: "clamp(2.5rem, 8vw, 4.5rem)", lineHeight: 1 }}>{t.calc_title}</h1>
          <p className="muted" style={{ fontSize: "1.2rem", maxWidth: "600px" }}>
            {t.calc_subtitle}
          </p>
        </div>
      </section>

      <ScoreCalculator lang={langCookie} initialSection={profile.bacSection || "MATHEMATIQUES"} />
      
      <section className="card stack" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--glass-border)", padding: "40px", textAlign: "center", gap: "20px" }}>
         <h2 className="section-title" style={{ fontSize: "1.8rem" }}>{langCookie === "ar" ? "خطط لمستقبلك بثقة" : "Plan Your Future with Confidence"}</h2>
         <p className="muted" style={{ maxWidth: "700px", margin: "0 auto" }}>
            {langCookie === "ar" ? "تم ضبط هذه الحاسبة وفقاً للضوارب الرسمية لوزارة التربية التونسية." : "This calculator is tuned to the official coefficients from the Tunisian Ministry of Education."}
         </p>
         <div className="row-between" style={{ justifyContent: "center", gap: "16px" }}>
            <Link href="/dashboard" className="button-link button-secondary">{t.nav_dashboard}</Link>
            <Link href="/lessons" className="button-link">{t.nav_library}</Link>
         </div>
      </section>
    </div>
  );
}
