import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ReadingPassagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const passage = await db.readingPassage.findUnique({
    where: { slug },
  });

  if (!passage) notFound();

  const questions = typeof passage.comprehensionQuestions === "string" 
    ? JSON.parse(passage.comprehensionQuestions) 
    : (passage.comprehensionQuestions as any[]) || [];

  return (
    <div className="page-stack reading-experience">
      <header className="row-between" style={{ padding: "40px 0" }}>
        <Link href="/lessons" className="button-link button-secondary">← Back to Library</Link>
        <span className="pill" style={{ color: "var(--accent)", borderColor: "var(--accent)" }}>BAC Practice Mode</span>
      </header>

      <div className="grid" style={{ gridTemplateColumns: "1.2fr 0.8fr", gap: "60px", alignItems: "start" }}>
        {/* Left: The Text */}
        <section className="card stack" style={{ padding: "60px", background: "white", color: "black", boxShadow: "0 40px 100px rgba(0,0,0,0.5)" }}>
          <div className="row-between" style={{ marginBottom: "40px" }}>
            <span className="eyebrow" style={{ color: "var(--primary)" }}>{passage.passageType}</span>
            <span className="muted" style={{ fontSize: "12px" }}>{passage.wordCount} words</span>
          </div>
          <h1 style={{ fontSize: "3rem", fontWeight: 900, marginBottom: "32px", lineHeight: 1 }}>{passage.title}</h1>
          <div className="reading-content" style={{ fontSize: "1.25rem", lineHeight: 1.8, textAlign: "justify", fontFamily: "serif" }}>
            {passage.content}
          </div>
        </section>

        {/* Right: The Questions */}
        <aside className="stack" style={{ gap: "32px", position: "sticky", top: "40px" }}>
          <div className="card stack" style={{ padding: "32px", border: "1px solid var(--glass-border)" }}>
             <h2 className="section-title" style={{ fontSize: "1.5rem", margin: 0 }}>Comprehension</h2>
             <p className="muted" style={{ fontSize: "13px" }}>Check your understanding of the text below.</p>
             
             <div className="stack" style={{ gap: "40px", marginTop: "32px" }}>
                {questions.map((q: any, i: number) => (
                  <div key={q.id || i} className="stack" style={{ gap: "16px" }}>
                    <div className="row-between">
                       <span style={{ fontSize: "12px", opacity: 0.5 }}>Question {i + 1}</span>
                       <span className="pill" style={{ fontSize: "9px" }}>{q.type?.replace(/_/g, " ")}</span>
                    </div>
                    <p style={{ fontWeight: 600, fontSize: "1.1rem" }}>{q.question}</p>
                    <details style={{ background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid var(--glass-border)" }}>
                       <summary style={{ padding: "16px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}>Show Correct Answer</summary>
                       <div style={{ padding: "0 16px 16px", color: "var(--success)", fontSize: "0.95rem" }}>
                          {q.answer}
                       </div>
                    </details>
                  </div>
                ))}
             </div>
          </div>

          <div className="card stack" style={{ padding: "32px", background: "rgba(99, 102, 241, 0.05)", border: "1px dotted var(--primary)" }}>
             <span className="eyebrow" style={{ color: "var(--primary)" }}>Methodology Tip</span>
             <p style={{ marginTop: "12px", fontSize: "0.9rem", fontStyle: "italic" }}>
                "In {passage.language} Bac exams, always look for synonyms in the text. Often the question uses a keyword that is paraphrased in the passage."
             </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
