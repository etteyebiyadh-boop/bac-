import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getLanguageLabel } from "@/lib/learning";
import { GrammarPractice } from "./GrammarPractice";

export default async function GrammarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireCurrentUser();
  const { slug } = await params;

  const rule = await db.grammarRule.findUnique({
    where: { slug }
  });

  if (!rule) notFound();

  const examples = Array.isArray(rule.examples) ? rule.examples : [];
  const exceptions = Array.isArray(rule.exceptions) ? rule.exceptions : [];
  const commonErrors = Array.isArray(rule.commonErrors) ? rule.commonErrors : [];

  return (
    <div className="page-stack">
      <div className="row-between" style={{ alignItems: "center" }}>
        <Link className="button-link button-secondary" href="/lessons" style={{ textDecoration: "none" }}>
          Back to library
        </Link>
        <div className="row-between" style={{ gap: "8px" }}>
          <span className="pill">{getLanguageLabel(rule.language)}</span>
          <span className="pill" style={{ background: "rgba(59, 130, 246, 0.1)", color: "#1d4ed8" }}>Grammar</span>
          <span className={`pill ${rule.difficulty === "HARD" ? "error-pill" : "success-pill"}`}>
            {rule.difficulty}
          </span>
        </div>
      </div>

      <section className="card stack hero-panel" style={{ padding: "48px 32px", position: "relative", overflow: "hidden" }}>
        <span className="eyebrow" style={{ color: "#e7bf87" }}>{rule.category.replace(/_/g, " ")}</span>
        <h1 className="section-title" style={{ fontSize: "2.5rem", color: "white" }}>{rule.title}</h1>
        <p className="muted" style={{ fontSize: "1.2rem", maxWidth: "800px", color: "rgba(255,255,255,0.85)" }}>
          {rule.rule}
        </p>
        <div style={{ position: "absolute", right: "-10%", top: "-30%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(231,191,135,0.1) 0%, transparent 70%)", borderRadius: "50%" }} />
      </section>

      <div className="grid grid-cols-2" style={{ gap: "24px" }}>
        {rule.formula && (
          <article className="card stack" style={{ background: "var(--bg-muted)", gridColumn: "span 2" }}>
            <h2 className="section-title">The Formula</h2>
            <div style={{ background: "var(--ink)", color: "white", padding: "16px", borderRadius: "8px", fontSize: "1.2rem", textAlign: "center", fontFamily: "monospace" }}>
              {rule.formula}
            </div>
          </article>
        )}

        <article className="card stack">
          <h2 className="section-title">Usage Examples</h2>
          <ul className="bullet-list" style={{ marginTop: "16px" }}>
            {examples.map((ex, i) => (
              <li key={i} style={{ fontSize: "1.1rem", borderBottom: "1px solid var(--border)", paddingBottom: "12px", marginBottom: "12px" }}>
                <span>{String(ex)}</span>
              </li>
            ))}
          </ul>
        </article>

        {exceptions.length > 0 && (
          <article className="card stack" style={{ background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.15)" }}>
            <h2 className="section-title" style={{ color: "#dc2626" }}>Exceptions</h2>
            <ul className="bullet-list" style={{ marginTop: "16px" }}>
              {exceptions.map((ex, i) => (
                <li key={i} style={{ fontSize: "1.1rem", paddingBottom: "8px" }}>
                  <strong>{String(ex)}</strong>
                </li>
              ))}
            </ul>
          </article>
        )}

        {commonErrors.length > 0 && (
          <article className="card stack" style={{ background: "rgba(245, 158, 11, 0.05)", border: "1px solid rgba(245, 158, 11, 0.15)", gridColumn: exceptions.length > 0 ? "span 1" : "span 2" }}>
            <h2 className="section-title" style={{ color: "var(--accent)" }}>⚠️ Common BAC Mistakes</h2>
            <ul className="bullet-list" style={{ marginTop: "16px" }}>
              {commonErrors.map((err, i) => (
                <li key={i} style={{ fontSize: "1.1rem", paddingBottom: "8px" }}>
                  <strong style={{ color: "white" }}>{String(err)}</strong>
                </li>
              ))}
            </ul>
          </article>
        )}

        <GrammarPractice title={rule.title} description={rule.rule} />
      </div>

      {rule.usageNotes && (
        <section className="card stack">
          <h2 className="section-title">Important Notes</h2>
          <p className="muted" style={{ fontSize: "1.1rem" }}>{rule.usageNotes}</p>
        </section>
      )}
    </div>
  );
}
