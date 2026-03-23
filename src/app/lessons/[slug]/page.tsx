import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getLanguageLabel } from "@/lib/learning";
import { isStructuredLessonMeta, skillLabels } from "@/lib/language-system";

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireCurrentUser();

  const resolvedParams = await params;
  const lesson = await db.lesson.findUnique({
    where: { slug: resolvedParams.slug }
  });

  if (!lesson) {
    notFound();
  }

  const structuredMeta = isStructuredLessonMeta(lesson.takeawayJson) ? lesson.takeawayJson : null;
  const takeaways = Array.isArray(lesson.takeawayJson) ? lesson.takeawayJson : [];
  const skillLabel = structuredMeta
    ? skillLabels[structuredMeta.skill]
    : lesson.skillFocus.charAt(0).toUpperCase() + lesson.skillFocus.slice(1);

  return (
    <div className="page-stack">
      <div className="row-between" style={{ alignItems: "center" }}>
        <Link className="button-link button-secondary" href="/lessons" style={{ textDecoration: "none" }}>
          Back to library
        </Link>
        <div className="row-between" style={{ gap: "8px" }}>
          <span className="pill">{getLanguageLabel(lesson.language)}</span>
          {structuredMeta ? <span className="pill">{structuredMeta.level}</span> : null}
          <span className="pill success-pill">{lesson.estimatedMinutes} min read</span>
        </div>
      </div>

      <section className="card stack hero-panel" style={{ padding: "48px 32px", position: "relative", overflow: "hidden" }}>
        <span className="eyebrow" style={{ color: "#e7bf87" }}>
          {lesson.theme} | {skillLabel}
        </span>
        <h1 className="section-title" style={{ fontSize: "2.5rem", color: "white", zIndex: 1 }}>{lesson.title}</h1>
        <p className="muted" style={{ fontSize: "1.2rem", maxWidth: "800px", color: "rgba(255,255,255,0.85)", zIndex: 1, marginTop: "8px" }}>
          {lesson.summary}
        </p>
        <div style={{ position: "absolute", right: "-10%", top: "-30%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(231,191,135,0.1) 0%, transparent 70%)", borderRadius: "50%" }} />
      </section>

      <div className="feature-grid" style={{ gridTemplateColumns: "1fr", gap: "24px" }}>
        <article className="card stack" style={{ padding: "40px", fontSize: "1.1rem", lineHeight: "1.8", color: "var(--ink)" }}>
          {lesson.body.split("\n").map((paragraph, index) => (
            <p key={index} style={{ marginBottom: "16px" }}>{paragraph}</p>
          ))}
        </article>

        {structuredMeta ? (
          <>
            {structuredMeta.arabicHint ? (
              <article className="card stack" style={{ background: "rgba(99, 102, 241, 0.06)", border: "1px solid rgba(99, 102, 241, 0.2)" }}>
                <h2 className="section-title" style={{ marginBottom: "8px" }}>Arabic hint</h2>
                <p style={{ margin: 0, fontSize: "1.05rem" }}>{structuredMeta.arabicHint}</p>
              </article>
            ) : null}

            <article className="card stack">
              <h2 className="section-title">Example</h2>
              <p style={{ margin: 0, fontSize: "1.05rem" }}>{structuredMeta.example}</p>
            </article>

            <article className="card stack" style={{ background: "rgba(10, 107, 73, 0.05)", border: "1px solid rgba(10, 107, 73, 0.15)" }}>
              <h2 className="section-title" style={{ color: "var(--success-strong)" }}>Try it</h2>
              <p style={{ margin: 0, fontSize: "1.05rem" }}>{structuredMeta.exercise}</p>
              <details style={{ marginTop: "8px" }}>
                <summary style={{ cursor: "pointer", fontWeight: 700 }}>Show answer and correction</summary>
                <div className="stack" style={{ gap: "10px", marginTop: "12px" }}>
                  <p style={{ margin: 0 }}><strong>Answer:</strong> {structuredMeta.answer}</p>
                  <p style={{ margin: 0 }}><strong>Correction:</strong> {structuredMeta.correction}</p>
                </div>
              </details>
            </article>

            {structuredMeta.mistake ? (
              <article className="card stack" style={{ background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.15)" }}>
                <h2 className="section-title" style={{ color: "#dc2626" }}>Common mistake</h2>
                <p style={{ margin: 0, fontSize: "1.05rem" }}>{structuredMeta.mistake}</p>
              </article>
            ) : null}
          </>
        ) : takeaways.length > 0 ? (
          <article className="card stack" style={{ background: "rgba(10, 107, 73, 0.05)", border: "1px solid rgba(10, 107, 73, 0.15)" }}>
            <h2 className="section-title" style={{ color: "var(--success-strong)", display: "flex", gap: "10px", alignItems: "center" }}>
              <span>Key takeaways</span>
            </h2>
            <ul className="bullet-list" style={{ marginTop: "16px" }}>
              {takeaways.map((item, index) => (
                <li key={index} style={{ fontSize: "1.1rem", paddingBottom: "8px" }}>
                  <strong>{String(item)}</strong>
                </li>
              ))}
            </ul>
          </article>
        ) : null}
      </div>

      <section className="card stack" style={{ textAlign: "center", padding: "40px", marginTop: "16px" }}>
        <h3 className="section-title">Continue the roadmap</h3>
        <p className="muted">Return to the library and open the next micro-lesson for this language.</p>
        <Link className="button-link" href="/lessons" style={{ alignSelf: "center", marginTop: "16px", padding: "12px 32px" }}>
          Back to library
        </Link>
      </section>
    </div>
  );
}
