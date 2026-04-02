import { cookies } from "next/headers";
import { SiteLanguage, translations } from "@/lib/translations";
import { requireCurrentUser } from "@/lib/auth";
import { ensureStudentProfile } from "@/lib/missions";
import { db } from "@/lib/db";
import { getVisionAvailability } from "@/lib/ai-provider";
import { WriteWorkspace } from "./write-workspace";

export const dynamic = "force-dynamic";

export default async function WritingLabPage() {
  let user;
  let profile;
  let exams: any[] = [];
  let vocabSets: any[] = [];
  let error: string | null = null;

  try {
    user = await requireCurrentUser();
    profile = await ensureStudentProfile(user.id);
  } catch (e) {
    console.error("Auth error:", e);
    error = "Authentication required";
  }

  const cookieStore = await cookies();
  const langCookie = (cookieStore.get("site-lang")?.value as SiteLanguage) || "en";
  const t = translations[langCookie] || translations.en;

  // Only fetch data if user is authenticated
  if (profile) {
    try {
      // Fetch vocabulary sets
      vocabSets = await db.vocabularySet.findMany({
        where: { language: profile.primaryLanguage },
        take: 10,
        include: { items: true }
      });
    } catch (e) {
      console.error("Vocab fetch error:", e);
      vocabSets = [];
    }

    try {
      // Fetch exams
      exams = await db.exam.findMany({
        where: { language: profile.primaryLanguage },
        orderBy: { year: "desc" }
      });
    } catch (e) {
      console.error("Exam fetch error:", e);
      exams = [];
    }
  }

  const visionAvailability = getVisionAvailability();

  return (
    <div className="page-stack" style={{ direction: langCookie === "ar" ? "rtl" : "ltr" }}>
      <section className="card stack hero-panel" style={{ padding: "48px 32px", border: "1px solid var(--primary)", background: "rgba(99, 102, 241, 0.03)" }}>
        <div style={{ position: "absolute", right: "-10%", top: "-50%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)", borderRadius: "50%" }} />
        <div className="stack" style={{ zIndex: 1, position: "relative", gap: "16px" }}>
          <span className="eyebrow" style={{ color: "var(--primary)" }}>{t.nav_writing}</span>
          <h1 className="section-title" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: 1 }}>{t.wr_title}</h1>
          <p className="muted" style={{ maxWidth: "600px" }}>{t.wr_subtitle}</p>
        </div>
      </section>

      {error ? (
        <section className="card stack" style={{ padding: "48px", textAlign: "center" }}>
          <h2 className="section-title" style={{ color: "var(--primary)" }}>⚠️ {error}</h2>
          <p className="muted">Please sign in to access the Writing Lab.</p>
        </section>
      ) : (
        <WriteWorkspace 
          lang={langCookie} 
          bacSection={profile?.bacSection ?? null}
          exams={JSON.parse(JSON.stringify(exams))}
          selectedExam={null} 
          scanAvailable={visionAvailability.available}
          scanProviderLabel={visionAvailability.providerLabel}
        />
      )}
    </div>
  );
}
