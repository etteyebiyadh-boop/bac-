import { db } from "@/lib/db";
import { requireCurrentUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { getLanguageLabel } from "@/lib/learning";
import { isStructuredLessonMeta, skillLabels } from "@/lib/language-system";
import { SiteLanguage, translations } from "@/lib/translations";
import { GrammarDrill } from "@/components/GrammarDrill";

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireCurrentUser();
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("site-lang")?.value as SiteLanguage || "en";
  const t = translations[langCookie];

  const resolvedParams = await params;
  const lesson = await db.lesson.findUnique({
    where: { slug: resolvedParams.slug }
  });

  if (!lesson) {
    notFound();
  }

  // Look for a matching grammar rule if this is a grammar lesson
  let grammarRule = null;
  if (lesson.skillFocus === "grammar") {
    grammarRule = await db.grammarRule.findFirst({
      where: {
        language: lesson.language,
        title: { contains: lesson.title, mode: "insensitive" }
      }
    });
  }

  const structuredMeta = isStructuredLessonMeta(lesson.takeawayJson) ? lesson.takeawayJson : null;
  const takeaways = Array.isArray(lesson.takeawayJson) ? lesson.takeawayJson : [];
  const skillLabel = structuredMeta
    ? skillLabels[structuredMeta.skill]
    : lesson.skillFocus.charAt(0).toUpperCase() + lesson.skillFocus.slice(1);

  const isRtl = langCookie === "ar";

  return (
    <div className="page-stack" style={{ direction: isRtl ? "rtl" : "ltr" }}>
      <div className="row-between" style={{ alignItems: "center" }}>
        <Link className="button-link button-secondary" href="/lessons" style={{ textDecoration: "none" }}>
          {langCookie === "ar" ? "العودة للمكتبة" : (langCookie === "fr" ? "Retour à la bibliothèque" : "Back to library")}
        </Link>
        <div className="row-between" style={{ gap: "8px" }}>
          <span className="pill">{getLanguageLabel(lesson.language)}</span>
          {structuredMeta ? <span className="pill">{structuredMeta.level}</span> : null}
          <span className="pill success-pill">{lesson.estimatedMinutes} min {langCookie === "ar" ? "قراءة" : "read"}</span>
        </div>
      </div>

      <section className="card stack hero-panel" style={{ padding: "48px 32px", position: "relative", overflow: "hidden", background: "rgba(0,0,0,0.4)" }}>
        <span className="eyebrow" style={{ color: "var(--accent)" }}>
          {lesson.theme} | {skillLabel}
        </span>
        <h1 className="section-title" style={{ fontSize: "2.5rem", color: "white", zIndex: 1, margin: "16px 0 8px" }}>{lesson.title}</h1>
        <p className="muted" style={{ fontSize: "1.2rem", maxWidth: "800px", color: "rgba(255,255,255,0.85)", zIndex: 1 }}>
          {lesson.summary}
        </p>
        <div style={{ position: "absolute", right: "-10%", top: "-30%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)", borderRadius: "50%" }} />
      </section>

      <div className="feature-grid" style={{ gridTemplateColumns: "1fr", gap: "24px" }}>
        <article className="card stack" style={{ padding: "40px", fontSize: "1.1rem", lineHeight: "1.8", color: "var(--ink)", background: "rgba(255,255,255,0.02)" }}>
          {lesson.body?.split("\n").map((line, index) => {
            if (line.startsWith("## ")) return <h2 key={index} className="section-title" style={{ marginTop: "24px", color: "var(--primary)" }}>{line.replace("## ", "")}</h2>;
            if (line.startsWith("### ")) return <h3 key={index} style={{ fontSize: "1.4rem", fontWeight: 700, marginTop: "20px", color: "var(--accent)" }}>{line.replace("### ", "")}</h3>;
            if (!line.trim()) return <br key={index} />;
            return <p key={index} style={{ marginBottom: "16px" }}>{line}</p>;
          })}
        </article>

        {grammarRule && (
          <GrammarDrill ruleId={grammarRule.id} ruleName={grammarRule.title} lang={langCookie} />
        )}

        {structuredMeta ? (
          <>
            {structuredMeta.arabicHint ? (
              <article className="card stack" style={{ background: "rgba(99, 102, 241, 0.06)", border: "1px solid rgba(99, 102, 241, 0.2)" }}>
                <h2 className="section-title" style={{ marginBottom: "8px" }}>{langCookie === "ar" ? "تلميح بالعربية" : "Arabic hint"}</h2>
                <p style={{ margin: 0, fontSize: "1.05rem" }}>{structuredMeta.arabicHint}</p>
              </article>
            ) : null}

            <article className="card stack">
              <h2 className="section-title">{langCookie === "ar" ? "مثال" : "Example"}</h2>
              <p style={{ margin: 0, fontSize: "1.05rem" }}>{structuredMeta.example}</p>
            </article>

            <article className="card stack" style={{ background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.15)" }}>
              <h2 className="section-title" style={{ color: "var(--success)" }}>{langCookie === "ar" ? "تمرين" : "Try it"}</h2>
              <p style={{ margin: 0, fontSize: "1.05rem" }}>{structuredMeta.exercise}</p>
              <details style={{ marginTop: "12px", background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "12px" }}>
                <summary style={{ cursor: "pointer", fontWeight: 700 }}>{langCookie === "ar" ? "عرض الإجابة والإصلاح" : "Show answer and correction"}</summary>
                <div className="stack" style={{ gap: "10px", marginTop: "12px" }}>
                  <p style={{ margin: 0 }}><strong>{langCookie === "ar" ? "الإجابة:" : "Answer:"}</strong> {structuredMeta.answer}</p>
                  <p style={{ margin: 0 }}><strong>{langCookie === "ar" ? "الإصلاح:" : "Correction:"}</strong> {structuredMeta.correction}</p>
                </div>
              </details>
            </article>

            {structuredMeta.mistake ? (
              <article className="card stack" style={{ background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.15)" }}>
                <h2 className="section-title" style={{ color: "var(--error)" }}>{langCookie === "ar" ? "خطأ شائع" : "Common mistake"}</h2>
                <p style={{ margin: 0, fontSize: "1.05rem" }}>{structuredMeta.mistake}</p>
              </article>
            ) : null}
          </>
        ) : takeaways.length > 0 ? (
          <article className="card stack" style={{ background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.15)" }}>
            <h2 className="section-title" style={{ color: "var(--success)", display: "flex", gap: "10px", alignItems: "center" }}>
              <span>{langCookie === "ar" ? "الخلاصة" : "Key takeaways"}</span>
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

      <section className="card stack" style={{ textAlign: "center", padding: "60px 40px", marginTop: "32px", background: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)" }}>
        <h3 className="section-title" style={{ fontSize: "1.8rem" }}>{langCookie === "ar" ? "واصل التقدم" : "Keep Moving Forward"}</h3>
        <p className="muted" style={{ fontSize: "1.1rem" }}>{langCookie === "ar" ? "عد للمكتبة واكمل الدرس القادم في خارطة الطريق." : "Return to the library and tackle the next lesson in your sequence."}</p>
        <Link className="button-link" href="/lessons" style={{ alignSelf: "center", marginTop: "24px", padding: "12px 48px", background: "var(--primary)", color: "white" }}>
           {langCookie === "ar" ? "عد للمكتبة" : "Back to Library"}
        </Link>
      </section>
    </div>
  );
}
