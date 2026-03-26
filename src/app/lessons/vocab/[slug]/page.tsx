import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getLanguageLabel } from "@/lib/learning";

export default async function VocabVaultPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireCurrentUser();
  const { slug } = await params;

  const vocabSet = await db.vocabularySet.findUnique({
    where: { slug },
    include: { items: true }
  });

  if (!vocabSet) notFound();

  return (
    <div className="page-stack">
      <header className="row-between" style={{ alignItems: "center" }}>
        <Link className="button-link button-secondary" href="/lessons">Back to Library</Link>
        <div className="row-between" style={{ gap: "8px" }}>
          <span className="pill">{getLanguageLabel(vocabSet.language)}</span>
          <span className="pill success-pill">{vocabSet.theme}</span>
        </div>
      </header>

      <section className="card stack hero-panel" style={{ padding: "56px 40px", border: "1px solid var(--success-glow)", background: "radial-gradient(circle at top right, rgba(16, 185, 129, 0.1), transparent)" }}>
        <div className="stack" style={{ zIndex: 1, position: "relative" }}>
          <span className="eyebrow" style={{ color: "var(--success)" }}>Vocabulary Vault</span>
          <h1 className="section-title" style={{ fontSize: "3rem" }}>{vocabSet.title}</h1>
          <p className="muted" style={{ fontSize: "1.2rem", maxWidth: "800px" }}>{vocabSet.description}</p>
          <div style={{ marginTop: "24px", padding: "16px", background: "rgba(255,255,255,0.02)", borderLeft: "4px solid var(--success)", borderRadius: "12px" }}>
             <strong>BAC Context:</strong> {vocabSet.bacContext}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2" style={{ gap: "24px" }}>
        {vocabSet.items.map((item) => (
          <article key={item.id} className="card stack" style={{ padding: "32px", background: "rgba(0,0,0,0.3)", border: "1px solid var(--glass-border)", transition: "all 0.3s ease" }}>
            <div className="row-between">
               <strong style={{ fontSize: "1.8rem", color: "var(--primary)" }}>{item.word}</strong>
               <span className="pill" style={{ opacity: 0.5 }}>{item.partOfSpeech}</span>
            </div>
            
            <p style={{ fontSize: "1.1rem", margin: "16px 0", color: "rgba(255,255,255,0.9)" }}>{item.definition}</p>
            
            <div className="stack" style={{ gap: "10px", marginTop: "16px" }}>
               <div style={{ padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid var(--glass-border)" }}>
                  <span className="eyebrow" style={{ fontSize: "10px" }}>COMMON USE</span>
                  <p style={{ margin: "4px 0 0", fontStyle: "italic" }}>"{item.exampleSentence}"</p>
               </div>
               <div style={{ padding: "16px", background: "rgba(99, 102, 241, 0.05)", borderRadius: "12px", border: "1px solid var(--primary-glow)" }}>
                  <span className="eyebrow" style={{ fontSize: "10px", color: "var(--primary)" }}>BAC EXAM EXAMPLE</span>
                  <p style={{ margin: "4px 0 0", fontWeight: 700 }}>"{item.bacExample}"</p>
               </div>
            </div>

            {item.synonyms && Array.isArray(item.synonyms) && item.synonyms.length > 0 && (
              <div style={{ marginTop: "20px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                 <span className="muted" style={{ fontSize: "11px", alignSelf: "center", marginRight: "8px" }}>Synonyms:</span>
                 {(item.synonyms as string[]).map(s => <span key={s} className="pill" style={{ fontSize: "10px", borderColor: "var(--accent)", color: "var(--accent)" }}>{s}</span>)}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
