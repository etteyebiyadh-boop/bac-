import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { SiteLanguage, translations } from "@/lib/translations";
import { WriteWorkspace } from "@/app/write/write-workspace";
import { getVisionAvailability } from "@/lib/ai-provider";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function ExamPracticePage({ params }: { params: Promise<{ slug: string }> }) {
  await requireCurrentUser();
  const cookieStore = await cookies();
  const rawLang = cookieStore.get("site-lang")?.value;
  const langCookie = (rawLang === "fr" || rawLang === "ar" ? rawLang : "en") as SiteLanguage;
  const t = translations[langCookie] || translations.en;

  const { slug } = await params;
  const exam = await db.exam.findUnique({
    where: { slug }
  });

  if (!exam) notFound();
  const visionAvailability = getVisionAvailability();

  return (
    <div className="page-stack" style={{ direction: langCookie === "ar" ? "rtl" : "ltr" }}>
      <section className="card stack hero-panel" style={{ padding: "48px 32px", border: "1px solid var(--primary)", background: "rgba(99, 102, 241, 0.03)" }}>
        <div style={{ position: "absolute", right: "-10%", top: "-50%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div className="stack" style={{ zIndex: 1, position: "relative", gap: "16px" }}>
          <span className="eyebrow" style={{ color: "var(--primary)" }}>{t.nav_exams} - {exam.year}</span>
          <h1 className="section-title" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: 1 }}>{exam.title}</h1>
          <p className="muted" style={{ maxWidth: "800px" }}>{exam.methodology}</p>
          
          <div style={{ marginTop: "24px" }}>
             <Link 
               href={`/exams/${exam.slug}/mock`} 
               className="button-link hover-glow" 
               style={{ background: "var(--primary)", color: "black", padding: "20px 48px", fontSize: "1.2rem", fontWeight: 900, textDecoration: "none", display: "inline-block" }}
             >
                {langCookie === "ar" ? "🎯 ابدا الـ MOCK EXAM توا (3 سوايع تركيز)" : "🎯 START FULL 3-HOUR MOCK EXAM"}
             </Link>
             <p className="muted" style={{ marginTop: "16px", fontSize: "0.9rem" }}>
                {langCookie === "ar" 
                  ? "ما تنساش تبارتاجي السكور متاعك باش تشجع صحابك! 🔥" 
                  : "Don't forget to share your score to challenge your friends! 🔥"}
             </p>
          </div>
        </div>
      </section>

      <WriteWorkspace 
        lang={langCookie} 
        exams={[JSON.parse(JSON.stringify(exam))]} 
        selectedExam={JSON.parse(JSON.stringify(exam))} 
        scanAvailable={visionAvailability.available}
        scanProviderLabel={visionAvailability.providerLabel}
      />
    </div>
  );
}
