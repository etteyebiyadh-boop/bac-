import { cookies } from "next/headers";
import { SiteLanguage, translations } from "@/lib/translations";
import { requireCurrentUser } from "@/lib/auth";
import { ensureStudentProfile } from "@/lib/missions";
import { db } from "@/lib/db";
import { getVisionAvailability } from "@/lib/ai-provider";
import { WriteWorkspace } from "./write-workspace";

export const dynamic = "force-dynamic";

export default async function WritingLabPage() {
  const user = await requireCurrentUser();
  const profile = await ensureStudentProfile(user.id);
  const cookieStore = await cookies();
  const langCookie = (cookieStore.get("site-lang")?.value as SiteLanguage) || "en";
  const t = translations[langCookie] || translations.en;

  // We should also look for vocabulary and synonyms here to provide as cheat sheets.
  const vocabSets = await db.vocabularySet.findMany({
    where: { language: profile.primaryLanguage },
    take: 10,
    include: { items: true }
  });

  const exams = await db.exam.findMany({
    where: { language: profile.primaryLanguage },
    orderBy: { year: "desc" }
  });
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

      <WriteWorkspace 
        lang={langCookie} 
        bacSection={profile.bacSection}
        exams={JSON.parse(JSON.stringify(exams))}
        selectedExam={null} 
        scanAvailable={visionAvailability.available}
        scanProviderLabel={visionAvailability.providerLabel}
      />
    </div>
  );
}
