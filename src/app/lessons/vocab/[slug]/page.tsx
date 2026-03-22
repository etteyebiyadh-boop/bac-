import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getLanguageLabel } from "@/lib/learning";

export default async function VocabDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireCurrentUser();
  const { slug } = await params;

  const vocabSet = await db.vocabularySet.findUnique({
    where: { slug },
    include: { items: true }
  });

  if (!vocabSet) notFound();

  return (
    <div className="page-stack">
      <div className="row-between" style={{ alignItems: "center" }}>
        <Link className="button-link button-secondary" href="/lessons" style={{ textDecoration: "none" }}>
          Back to library
        </Link>
        <div className="row-between" style={{ gap: "8px" }}>
          <span className="pill">{getLanguageLabel(vocabSet.language)}</span>
          <span className="pill" style={{ background: "rgba(10, 107, 73, 0.1)", color: "#065f46" }}>Vocabulary</span>
          <span className={`pill ${vocabSet.difficulty === "HARD" ? "error-pill" : "success-pill"}`}>
            {vocabSet.difficulty}
          </span>
        </div>
      </div>

      <section className="card stack hero-panel" style={{ padding: "48px 32px", position: "relative", overflow: "hidden" }}>
        <span className="eyebrow" style={{ color: "#e7bf87" }}>Theme: {vocabSet.theme.replace(/_/g, " ")}</span>
        <h1 className="section-title" style={{ fontSize: "2.5rem", color: "white" }}>{vocabSet.title}</h1>
        <p className="muted" style={{ fontSize: "1.2rem", maxWidth: "800px", color: "rgba(255,255,255,0.85)" }}>
          {vocabSet.description}
        </p>
        <p className="pill" style={{ alignSelf: "flex-start", marginTop: "16px", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)", color: "white" }}>
          BAC Context: {vocabSet.bacContext}
        </p>
        <div style={{ position: "absolute", right: "-10%", top: "-30%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(231,191,135,0.1) 0%, transparent 70%)", borderRadius: "50%" }} />
      </section>

      <div className="recent-list" style={{ gap: "16px" }}>
        {vocabSet.items.map((item) => (
          <article key={item.id} className="card stack" style={{ padding: "24px" }}>
            <div className="row-between">
              <div className="stack">
                <h3 className="section-title" style={{ fontSize: "1.5rem", margin: 0, fontWeight: 700 }}>{item.word}</h3>
                <span className="pill eyebrow" style={{ padding: "2px 8px", fontSize: "0.75rem", alignSelf: "flex-start" }}>{item.partOfSpeech}</span>
              </div>
              <p className="muted" style={{ fontSize: "1.1rem", fontStyle: "italic", flex: 1, maxWidth: "60%" }}>
                {item.definition}
              </p>
            </div>

            <div className="stack" style={{ marginTop: "16px", background: "var(--bg-muted)", padding: "16px", borderRadius: "8px" }}>
              <div className="stack">
                <span className="eyebrow">Example usage</span>
                <p style={{ fontSize: "1rem", margin: 0 }}>"{item.exampleSentence}"</p>
              </div>
              <div className="stack" style={{ marginTop: "12px", borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
                <span className="eyebrow" style={{ color: "var(--primary-strong)" }}>Tunisian BAC Contextual usage</span>
                <p style={{ fontSize: "1rem", margin: 0, fontWeight: 500 }}>"{item.bacExample}"</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="card stack" style={{ textAlign: "center", padding: "40px", marginTop: "16px" }}>
        <h3 className="section-title">Ready to test these words?</h3>
        <p className="muted">Write a practice essay and see if the AI detects your usage of these key terms.</p>
        <Link className="button-link" href="/write" style={{ alignSelf: "center", marginTop: "16px", padding: "12px 32px" }}>
          Start practice essay
        </Link>
      </section>
    </div>
  );
}
