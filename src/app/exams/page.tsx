import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { requireCurrentUser } from "@/lib/auth";
import { SiteLanguage, translations } from "@/lib/translations";
import Link from "next/link";

export default async function ExamsArchivePage() {
  await requireCurrentUser();
  const cookieStore = await cookies();
  const langCookie = (cookieStore.get("site-lang")?.value as SiteLanguage) || "en";
  const t = translations[langCookie];

  const exams = await db.exam.findMany({
    orderBy: { year: "desc" },
  });

  return (
    <div className="page-stack" style={{ direction: langCookie === "ar" ? "rtl" : "ltr" }}>
      <section className="card stack hero-panel" style={{ padding: "80px", border: "1px solid var(--primary)", background: "radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent)" }}>
        <div style={{ position: "absolute", right: "-10%", top: "-50%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div className="stack" style={{ zIndex: 1, position: "relative", gap: "24px" }}>
          <span className="eyebrow" style={{ color: "var(--primary)" }}>{t.nav_exams}</span>
          <h1 className="section-title" style={{ fontSize: "4rem", lineHeight: 1 }}>{t.ex_title}</h1>
          <p className="muted" style={{ fontSize: "1.2rem", maxWidth: "600px" }}>
            {t.ex_subtitle}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-2" style={{ gap: "32px", alignItems: "start" }}>
        {exams.length > 0 ? (
          exams.map((exam) => (
            <article key={exam.id} className="card stack" style={{ padding: "40px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", transition: "all 0.3s ease", cursor: "pointer" }}>
               <div className="row-between" style={{ alignItems: "center" }}>
                  <span className="pill" style={{ color: "var(--primary)", borderColor: "var(--primary)" }}>{exam.year} Session</span>
                  <span className={`pill ${exam.difficulty === "HARD" ? "error-pill" : "success-pill"}`}>{exam.difficulty}</span>
               </div>
               <h2 className="section-title" style={{ fontSize: "1.8rem", margin: "20px 0" }}>{exam.title}</h2>
               <div className="row-between" style={{ gap: "10px" }}>
                  <div className="stack" style={{ gap: "4px" }}>
                     <span className="eyebrow" style={{ fontSize: "10px" }}>EST. TIME</span>
                     <strong>{exam.estimatedMinutes} mins</strong>
                  </div>
                  <Link href={`/exams/${exam.slug}`} className="button-link hover-glow" style={{ padding: "16px 32px", background: "var(--primary)", color: "white" }}>
                     {t.ex_practice}
                  </Link>
               </div>
            </article>
          ))
        ) : (
          <div className="card stack" style={{ gridColumn: "span 2", padding: "80px", textAlign: "center", background: "rgba(255,255,255,0.02)" }}>
             <span style={{ fontSize: "4rem" }}>📚</span>
             <h2 className="section-title">Archive is Expanding</h2>
             <p className="muted">The National Exam Archive is currently being populated with the latest years of Tunisian Baccalaureate sessions. Check back in a few hours!</p>
          </div>
        )}
      </div>

      <section className="card stack" style={{ background: "rgba(99, 102, 241, 0.03)", border: "1px solid var(--primary)", padding: "40px", gap: "12px" }}>
         <h3 className="section-title" style={{ fontSize: "1.5rem" }}>Master The National Format</h3>
         <p className="muted">Tunisian BAC English exams always follow a specific structure: Reading Comprehension (12 pts), Language (8 pts), and Writing (10 pts). Our archive helps you simulate exactly how to allocate your 3 hours.</p>
      </section>
    </div>
  );
}
