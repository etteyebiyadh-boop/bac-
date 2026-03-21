import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getLanguageLabel } from "@/lib/learning";

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireCurrentUser();
  
  const resolvedParams = await params;
  const lesson = await db.lesson.findUnique({
    where: { slug: resolvedParams.slug }
  });

  if (!lesson) {
    notFound();
  }

  const takeaways = Array.isArray(lesson.takeawayJson) ? lesson.takeawayJson : [];

  return (
    <div className="page-stack">
      <div className="row-between" style={{ alignItems: "center" }}>
        <Link className="button-link button-secondary" href="/lessons" style={{ textDecoration: 'none' }}>
          ← Back to Library
        </Link>
        <div className="row-between" style={{ gap: "8px" }}>
          <span className="pill">{getLanguageLabel(lesson.language)}</span>
          <span className="pill success-pill">{lesson.estimatedMinutes} min read</span>
        </div>
      </div>

      <section className="card stack hero-panel" style={{ padding: "48px 32px", position: "relative", overflow: "hidden" }}>
        <span className="eyebrow" style={{ color: "#e7bf87" }}>{lesson.theme} • {lesson.skillFocus.charAt(0).toUpperCase() + lesson.skillFocus.slice(1)}</span>
        <h1 className="section-title" style={{ fontSize: "2.5rem", color: "white", zIndex: 1 }}>{lesson.title}</h1>
        <p className="muted" style={{ fontSize: "1.2rem", maxWidth: "800px", color: "rgba(255,255,255,0.85)", zIndex: 1, marginTop: "8px" }}>
          {lesson.summary}
        </p>
        <div style={{ position: "absolute", right: "-10%", top: "-30%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(231,191,135,0.1) 0%, transparent 70%)", borderRadius: "50%" }} />
      </section>

      <div className="feature-grid" style={{ gridTemplateColumns: "1fr", gap: "24px" }}>
        <article className="card stack" style={{ padding: "40px", fontSize: "1.1rem", lineHeight: "1.8", color: "var(--ink)" }}>
          {lesson.body.split('\n').map((paragraph, idx) => (
            <p key={idx} style={{ marginBottom: "16px" }}>{paragraph}</p>
          ))}
        </article>

        {takeaways.length > 0 && (
          <article className="card stack" style={{ background: "rgba(10, 107, 73, 0.05)", border: "1px solid rgba(10, 107, 73, 0.15)" }}>
            <h2 className="section-title" style={{ color: "var(--success-strong)", display: "flex", gap: "10px", alignItems: "center" }}>
              <span>💡</span> Key Takeaways
            </h2>
            <ul className="bullet-list" style={{ marginTop: "16px" }}>
              {takeaways.map((item, index) => (
                <li key={index} style={{ fontSize: "1.1rem", paddingBottom: "8px" }}>
                  <strong>{String(item)}</strong>
                </li>
              ))}
            </ul>
          </article>
        )}
      </div>
      
      <section className="card stack" style={{ textAlign: "center", padding: "40px", marginTop: "16px" }}>
        <h3 className="section-title">Ready to test this out?</h3>
        <p className="muted">Write a practice essay and see if the AI detects your improvement.</p>
        <Link className="button-link" href="/write" style={{ alignSelf: "center", marginTop: "16px", padding: "12px 32px" }}>
          Start Practice Essay →
        </Link>
      </section>
    </div>
  );
}
