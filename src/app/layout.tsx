import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { getSession } from "@/lib/auth";
import { APP_NAME } from "@/lib/constants";
import { LogoutButton } from "@/components/logout-button";
import { cookies } from "next/headers";
import { SiteLanguage, translations } from "@/lib/translations";
import { LanguageSwitcher } from "@/components/language-switcher";

export const metadata: Metadata = {
  title: `${APP_NAME} | All-in-one Tunisian Bac Prep`,
  description:
    "Master French, English, Arabic, and all Option Languages for the Tunisian Baccalaureate with AI-powered instant corrections and targeted practice."
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  const cookieStore = await cookies();
  const langCookie = cookieStore.get("site-lang")?.value as SiteLanguage || "en";
  const t = translations[langCookie];

  return (
    <html lang={langCookie} dir={langCookie === "ar" ? "rtl" : "ltr"}>
      <body>
        <div className="magic-background">
          <div className="glow-orb orb-indigo" />
          <div className="glow-orb orb-amber" />
        </div>
        
        <div className="site-shell">
          <header className="topbar">
            <div className="topbar-inner">
              <Link className="brand" href="/" style={{ gap: langCookie === "ar" ? "12px" : "12px", flexDirection: langCookie === "ar" ? "row-reverse" : "row" }}>
                <div className="brand-mark">B</div>
                <strong style={{ fontSize: '1rem', fontWeight: 800 }}>{APP_NAME}</strong>
              </Link>

              <nav aria-label="Primary" className="nav-links">
                <Link className="nav-link" href="/dashboard">{t.nav_dashboard}</Link>
                <Link className="nav-link" href="/lessons">{t.nav_library}</Link>
                <Link className="nav-link" href="/calculator">{t.nav_calc}</Link>
                <Link className="nav-link" href="/write">{t.nav_writing}</Link>
                <Link className="nav-link" href="/exams">{t.nav_exams}</Link>
                {session ? (
                  <Link className="pill" href="/admin" style={{ background: 'var(--primary)', color: 'white', border: 'none', marginLeft: '12px', padding: '6px 14px', boxShadow: '0 0 15px var(--primary-glow)' }}>
                    {t.nav_controlRoom}
                  </Link>
                ) : null}
              </nav>

              <div className="nav-actions row-between" style={{ gap: "20px" }}>
                <LanguageSwitcher />
                {session ? (
                  <LogoutButton />
                ) : (
                  <Link className="pill" href="/auth/signup" style={{ background: 'white', color: 'black', border: 'none' }}>
                    {t.nav_join}
                  </Link>
                )}
              </div>
            </div>
          </header>

          <main className="container" style={{ paddingTop: '120px' }}>{children}</main>

          <footer style={{ padding: '80px 0 40px', borderTop: '1px solid var(--glass-border)', marginTop: '100px' }}>
            <div className="container row-between" style={{ alignItems: 'flex-start' }}>
              <div className="stack" style={{ maxWidth: '400px' }}>
                <strong style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>{APP_NAME}</strong>
                <p className="muted" style={{ fontSize: "14px" }}>
                  {t.footer_builtBy}
                </p>
              </div>
              <div className="row-between" style={{ gap: '32px' }}>
                <Link className="button-link button-secondary" href="/admin" style={{ padding: '12px 24px', fontSize: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>🛡️ ADMIN ACCESS</Link>
                <Link className="nav-link" href="/privacy">Privacy</Link>
                <Link className="nav-link" href="/terms">Terms</Link>
              </div>
            </div>
            <div className="container" style={{ textAlign: 'center', marginTop: '40px', color: 'var(--ink-dim)', fontSize: '12px' }}>
              &copy; 2026 {APP_NAME}. {t.footer_rights}
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
