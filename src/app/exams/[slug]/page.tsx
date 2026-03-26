import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { SiteLanguage, translations } from "@/lib/translations";
import { WriteWorkspace } from "@/app/write/write-workspace";
import Link from "next/link";

export default async function ExamPracticePage({ params }: { params: Promise<{ slug: string }> }) {
  await requireCurrentUser();
  const cookieStore = await cookies();
  const langCookie = (cookieStore.get("site-lang")?.value as SiteLanguage) || "en";
  const t = translations[langCookie];

  const { slug } = await params;
  const exam = await db.exam.findUnique({
    where: { slug }
  });

  if (!exam) notFound();

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
      />
    </div>
  );
}
