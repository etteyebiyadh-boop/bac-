import Link from "next/link";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { SiteLanguage, translations } from "@/lib/translations";

export const dynamic = "force-dynamic";

export default async function ExamsPage() {
  const exams = await db.exam.findMany({ orderBy: { year: "desc" } });
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("site-lang")?.value as SiteLanguage || "en";
  const t = translations[langCookie];

  return (
    <div className="page-stack" style={{ direction: langCookie === "ar" ? "rtl" : "ltr" }}>
      <section className="card stack hero-panel" style={{ padding: "60px", border: "1px solid var(--primary)", background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05), transparent)" }}>
        <span className="eyebrow" style={{ color: "var(--primary)" }}>{t.ex_title}</span>
        <h1 className="section-title" style={{ fontSize: "3.5rem" }}>{t.ex_subtitle}</h1>
      </section>

      <section className="exam-grid grid grid-cols-2" style={{ gap: "32px" }}>
        {exams.map((exam) => (
          <article className="card stack" key={exam.id} style={{ padding: "32px", background: "rgba(255,255,255,0.01)", border: "1px solid var(--glass-border)" }}>
            <div className="row-between">
              <h3 className="section-title" style={{ fontSize: "1.5rem" }}>
                {exam.year} - {exam.title}
              </h3>
              <span className="pill" style={{ background: "rgba(99, 102, 241, 0.1)", borderColor: "var(--primary)", color: "var(--primary)" }}>
                {exam.difficulty}
              </span>
            </div>
            <p className="muted" style={{ fontSize: "1.1rem", margin: "20px 0" }}>{exam.prompt}</p>
            
            <div className="stack" style={{ gap: "8px", margin: "20px 0", padding: "16px", background: "rgba(0,0,0,0.2)", borderRadius: "12px" }}>
               <div className="row-between">
                  <span className="eyebrow" style={{ fontSize: "10px" }}>{t.ex_method}</span>
                  <span style={{ fontSize: "12px", fontWeight: 700 }}>{exam.methodology}</span>
               </div>
               <div className="row-between">
                  <span className="eyebrow" style={{ fontSize: "10px" }}>{t.ex_time}</span>
                  <span style={{ fontSize: "12px", fontWeight: 700 }}>{exam.estimatedMinutes} min</span>
               </div>
            </div>

            <details className="details-box" style={{ marginBottom: "24px" }}>
              <summary style={{ cursor: "pointer", fontWeight: 700, color: "var(--accent)" }}>{t.ex_model_answer}</summary>
              <div style={{ padding: "16px", marginTop: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", borderLeft: "4px solid var(--accent)", fontSize: "14px", fontStyle: "italic" }}>
                {exam.modelAnswer}
              </div>
            </details>
            
            <Link className="button-link hover-glow" style={{ justifyContent: "center", width: "100%" }} href={`/write?examId=${exam.id}`}>
              {t.ex_practice}
            </Link>
          </article>
        ))}
        {exams.length === 0 && (
           <div className="card stack" style={{ gridColumn: "span 2", padding: "100px", textAlign: "center", opacity: 0.5 }}>
              <p>No exams in the archive yet.</p>
           </div>
        )}
      </section>
    </div>
  );
}
