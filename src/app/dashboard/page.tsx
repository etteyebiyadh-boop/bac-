import { requireCurrentUser } from "@/lib/auth";
import { ensureStudentProfile, ensureDailyMission, getXpTotal } from "@/lib/missions";
import { db } from "@/lib/db";
import { OverallProgress, GradePredictions, HighYieldTopics, LanguageModules, WordOfTheDay, DailyStreakWidget, SmartStudyPlanner, AdminAccessButton, NextBestActionCard } from "./excellence-components";
import { SkillProgressHeatmap } from "./skill-heatmap";
import Link from "next/link";
import { cookies } from "next/headers";
import { SiteLanguage, translations } from "@/lib/translations";
import { ProfileSetupForm } from "./profile-setup-form";
import { ResponsiveDashboard } from "./responsive-dashboard";
import { MobileDashboard } from "./mobile-dashboard";
import { buildDashboardMetrics } from "@/lib/dashboard";
import { FREE_CORRECTIONS_PER_WEEK } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireCurrentUser();
  const profile = await ensureStudentProfile(user.id);
  const mission = await ensureDailyMission(user.id);
  const xpTotal = await getXpTotal(user.id);
  
  // Fetch metrics directly here for RSC efficiency
  const totalCorrections = await db.submission.count({ where: { userId: user.id } });
  
  const correctionsThisWeek = await db.submission.count({
    where: {
      userId: user.id,
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    }
  });

  const recentSubmissions = await db.submission.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      createdAt: true,
      overallScore: true,
      grammarScore: true,
      vocabularyScore: true,
      structureScore: true,
      wordCount: true,
      exam: { select: { title: true, year: true } },
      language: true
    }
  });

  const cookieStore = await cookies();
  const langCookie = cookieStore.get("site-lang")?.value as SiteLanguage || "en";
  const t = translations[langCookie] || translations.en;

  let secondaryLanguages: string[] = [];
  try {
    if (profile.secondaryLanguagesJson) {
      const parsed = typeof profile.secondaryLanguagesJson === "string"
        ? JSON.parse(profile.secondaryLanguagesJson)
        : profile.secondaryLanguagesJson;
      if (Array.isArray(parsed)) secondaryLanguages = parsed as string[];
    }
  } catch {}

  const activeLanguages = [profile.primaryLanguage, ...secondaryLanguages];

  const serializedUser = JSON.parse(JSON.stringify(user));
  const serializedProfile = JSON.parse(JSON.stringify(profile));
  const serializedMission = JSON.parse(JSON.stringify(mission));
  const serializedSubmissions = JSON.parse(JSON.stringify(recentSubmissions));

  const metrics = buildDashboardMetrics({
    recentSubmissions,
    totalCorrections,
    correctionsThisWeek,
    isPremium: user.isPremium,
    freeCorrectionLimit: FREE_CORRECTIONS_PER_WEEK
  });

  const dashboardData = {
    user: serializedUser,
    profile: serializedProfile,
    mission: serializedMission,
    metrics,
    xpTotal,
    totalCorrections,
    recentSubmissions: serializedSubmissions,
    translations: t,
    lang: langCookie,
    activeLanguages
  };

  if (!serializedProfile.bacSection) {
    return (
      <div className="dashboard-layout" style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#000205", direction: langCookie === "ar" ? "rtl" : "ltr" }}>
        <main style={{ padding: "40px 60px", overflowY: "auto", flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ maxWidth: "600px", width: "100%" }}>
            <ProfileSetupForm initialProfile={serializedProfile as any} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <ResponsiveDashboard 
      mobileComponent={
        <MobileDashboard 
          user={serializedUser} 
          profile={serializedProfile} 
          translations={t} 
          lang={langCookie} 
          initialData={dashboardData}
        />
      }
    >
      <div className="dashboard-layout" style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#000205", direction: langCookie === "ar" ? "rtl" : "ltr" }}>
        {/* 🧭 SIDEBAR */}
        <aside className="sidebar">
          <Link className="brand" href="/" style={{ gap: "12px" }}>
            <div className="brand-mark" style={{ width: "32px", height: "32px", fontSize: "16px" }}>B</div>
            <strong style={{ fontSize: "1.2rem", fontWeight: 900 }}>{langCookie === "ar" ? "باك إكسلنس" : "BAC EXCELLENCE"}</strong>
          </Link>

          <nav className="stack" style={{ gap: "8px" }}>
            <Link className="nav-link-mobile active" href="/dashboard">
              <span style={{ marginRight: "12px" }}>📊</span> {t.nav_dashboard}
            </Link>
            <Link className="nav-link-mobile" href="/library">
              <span style={{ marginRight: "12px" }}>📚</span> {t.nav_library}
            </Link>
            <Link className="nav-link-mobile" href="/diagnostic">
              <span style={{ marginRight: "12px" }}>🩺</span> Diagnostic
            </Link>
            <Link className="nav-link-mobile" href="/calc">
              <span style={{ marginRight: "12px" }}>🧮</span> {t.nav_calc}
            </Link>
            <Link className="nav-link-mobile" href="/write">
              <span style={{ marginRight: "12px" }}>✍️</span> {t.nav_writing}
            </Link>
            <Link className="nav-link-mobile" href="/exams">
              <span style={{ marginRight: "12px" }}>📝</span> {t.nav_exams}
            </Link>
            <Link className="nav-link-mobile" href="/challenges">
              <span style={{ marginRight: "12px" }}>⚔️</span> Challenges
            </Link>
            <Link className="nav-link-mobile" href="/certificates">
              <span style={{ marginRight: "12px" }}>🎓</span> Certificates
            </Link>
          </nav>

          <div style={{ marginTop: "auto" }} className="stack">
            <AdminAccessButton />
            <div className="card row-between" style={{ padding: "16px", borderRadius: "16px", background: "rgba(255,255,255,0.02)" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "18px" }}>
                {serializedUser.fullName?.charAt(0) || "U"}
              </div>
              <div className="stack" style={{ gap: "2px", flex: 1, marginLeft: "12px" }}>
                <span style={{ fontSize: "14px", fontWeight: 700 }}>{serializedUser.fullName || "Student"}</span>
                <span className="muted" style={{ fontSize: "11px" }}>{serializedUser.isPremium ? "Premium Plan" : "Free Student"}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* 🚀 MAIN CONTENT */}
        <main style={{ padding: "48px 60px", overflowY: "auto", flex: 1 }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div className="row-between" style={{ marginBottom: "48px", alignItems: "flex-end" }}>
              <div className="stack" style={{ gap: "8px" }}>
                <span className="eyebrow" style={{ color: "var(--primary)" }}>MY DASHBOARD</span>
                <h1 className="section-title" style={{ fontSize: "3rem" }}>
                  {langCookie === "ar" ? "أهلاً بك،" : "Welcome back,"} <span className="text-gradient">{serializedUser.fullName?.split(" ")[0] || "Student"}</span>
                </h1>
              </div>
              <DailyStreakWidget initialMetrics={metrics} />
            </div>

            <div className="grid grid-cols-2" style={{ gridTemplateColumns: "1fr 400px", gap: "40px" }}>
              {/* LEFT COLUMN: PRIMARY MODULES */}
              <div className="stack" style={{ gap: "40px" }}>
                <div className="grid grid-cols-2" style={{ gap: "24px" }}>
                  <OverallProgress initialMetrics={metrics} />
                  <GradePredictions initialMetrics={metrics} />
                </div>

                <div className="row-between">
                  <h2 className="section-title" style={{ fontSize: "1.8rem" }}>Language Modules</h2>
                  <div className="pill">Active: {activeLanguages.length}</div>
                </div>

                <LanguageModules 
                  activeLanguages={activeLanguages} 
                  sectionLabel={serializedProfile.bacSection} 
                  targetScore={serializedProfile.targetScore || 15} 
                />

                <div className="grid grid-cols-2" style={{ gap: "24px" }}>
                  <WordOfTheDay lang={langCookie} />
                  <SmartStudyPlanner lang={langCookie} />
                </div>
              </div>

              {/* RIGHT COLUMN: INSIGHTS & ACTIONS */}
              <div className="stack" style={{ gap: "40px" }}>
                <NextBestActionCard />
                <SkillProgressHeatmap initialHistory={serializedSubmissions} />
                <HighYieldTopics lang={langCookie} section={serializedProfile.bacSection} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </ResponsiveDashboard>
  );
}
