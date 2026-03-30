import { requireCurrentUser } from "@/lib/auth";
import { ensureStudentProfile } from "@/lib/missions";
import { OverallProgress, GradePredictions, HighYieldTopics, LanguageModules, WordOfTheDay, DailyStreakWidget, SmartStudyPlanner, AdminAccessButton, NextBestActionCard } from "./excellence-components";
import { SkillProgressHeatmap } from "./skill-heatmap";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { SiteLanguage, translations } from "@/lib/translations";
import { ProfileSetupForm } from "./profile-setup-form";
import { ResponsiveDashboard } from "./responsive-dashboard";
import { MobileDashboard } from "./mobile-dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireCurrentUser();
  const profile = await ensureStudentProfile(user.id);
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("site-lang")?.value as SiteLanguage || "en";
  const t = translations[langCookie];

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
        />
      }
    >
      <div className="dashboard-layout" style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#000205", direction: langCookie === "ar" ? "rtl" : "ltr" }}>
        {/* 🧭 SIDEBAR */}
        <aside className="sidebar">
          <div className="brand" style={{ marginBottom: "20px" }}>
             <div className="brand-mark">B</div>
             <strong style={{ fontSize: "1.2rem", fontWeight: 900 }}>BAC</strong>
          </div>

          <nav className="stack" style={{ gap: "10px", flex: 1 }}>
              <Link href="/dashboard" className="nav-link active" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", borderRadius: "16px" }}>
                 <span style={{ fontSize: "1.2rem" }}>📊</span>
                 <span>{t.nav_dashboard}</span>
              </Link>
              <Link href="/lessons" className="nav-link" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", borderRadius: "16px", opacity: 0.6 }}>
                 <span style={{ fontSize: "1.2rem" }}>📚</span>
                 <span>{t.nav_library}</span>
              </Link>
              <Link href="/calculator" className="nav-link" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", borderRadius: "16px", opacity: 0.6 }}>
                 <span style={{ fontSize: "1.2rem" }}>🖩</span>
                 <span>{t.nav_calc}</span>
              </Link>
              <Link href="/write" className="nav-link" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", borderRadius: "16px", opacity: 0.6 }}>
                 <span style={{ fontSize: "1.2rem" }}>✍️</span>
                 <span>{t.nav_writing}</span>
              </Link>
              <Link href="/exams" className="nav-link" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", borderRadius: "16px", opacity: 0.6 }}>
                 <span style={{ fontSize: "1.2rem" }}>📝</span>
                 <span>{t.nav_exams}</span>
              </Link>
              <Link href="/challenges" className="nav-link" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", borderRadius: "16px", opacity: 0.6 }}>
                 <span style={{ fontSize: "1.2rem" }}>🏆</span>
                 <span>Challenges</span>
              </Link>
              <Link href="/certificates" className="nav-link" style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", borderRadius: "16px", opacity: 0.6 }}>
                 <span style={{ fontSize: "1.2rem" }}>🎓</span>
                 <span>Certificates</span>
              </Link>
              <AdminAccessButton />
          </nav>

          <div className="stack" style={{ gap: "20px" }}>
             <Link href="/" className="nav-link" style={{ fontSize: "1.2rem", opacity: 0.6 }}>🏠</Link>
             <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "white" }}>
                {serializedUser.fullName?.charAt(0) || "U"}
             </div>
          </div>
        </aside>

        {/* 🏙️ MAIN AREA */}
        <main style={{ padding: "40px 60px", overflowY: "auto", flex: 1 }}>
           {/* Top Header */}
           <header className="row-between" style={{ marginBottom: "60px", alignItems: "center" }}>
              <h1 className="section-title" style={{ margin: 0, fontSize: "2rem", fontWeight: 900 }}>{t.nav_dashboard}</h1>
              
              <div className="row-between" style={{ gap: "32px", alignItems: "center" }}>
                 <div style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.03)", padding: "10px 20px", borderRadius: "100px", border: "1px solid var(--glass-border)", width: "300px" }}>
                    <span style={{ opacity: 0.4 }}>🔍</span>
                    <input type="text" placeholder="Search..." style={{ background: "none", border: "none", color: "white", width: "100%", fontSize: "14px" }} />
                 </div>
                 <div style={{ fontSize: "1.2rem", position: "relative" }}>
                    🔔
                    <div style={{ position: "absolute", top: 0, right: 0, width: "8px", height: "8px", background: "var(--error)", borderRadius: "50%", border: "2px solid #000" }} />
                 </div>
                 <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "2px solid var(--primary-glow)", overflow: "hidden", position: "relative" }}>
                       <Image 
                         src={`https://ui-avatars.com/api/?name=${serializedUser.fullName}&background=6366f1&color=fff`} 
                         alt={serializedUser.fullName || "User"} 
                         width={40} 
                         height={40} 
                       />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: "14px" }}>{serializedUser.fullName}</span>
                 </div>
              </div>
           </header>

           {/* Gamification and AI Layers */}
           <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              <DailyStreakWidget />
              <div style={{ marginTop: "-24px" }}>
                <SmartStudyPlanner lang={langCookie} />
              </div>
           </div>

           {/* Next Best Action - Personalized Recommendation */}
           <NextBestActionCard />

           {/* Grid Layout mimicking the mockup */}
           <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1.2fr", gap: "24px", alignItems: "stretch" }}>
              <div className="stack" style={{ gap: "24px" }}>
                 <OverallProgress />
                 <SkillProgressHeatmap />
              </div>
              <div className="stack" style={{ gap: "24px" }}>
                 <GradePredictions />
              </div>
              <div className="stack" style={{ gap: "24px" }}>
                 <HighYieldTopics lang={langCookie} />
                 <WordOfTheDay lang={langCookie} />
              </div>
           </div>

           {/* Language Modules Section */}
           <div style={{ marginTop: "60px" }}>
              <h2 className="eyebrow" style={{ color: "var(--ink-dim)", fontSize: "12px" }}>LANGUAGE MODULES</h2>
              <LanguageModules
                activeLanguages={activeLanguages}
                sectionLabel={serializedProfile.bacSection}
                targetScore={serializedProfile.targetScore}
              />
           </div>
        </main>
      </div>
    </ResponsiveDashboard>
  );
}
