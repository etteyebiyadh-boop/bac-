import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { getSession } from "@/lib/auth";
import { APP_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { SiteLanguage, translations } from "@/lib/translations";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Navbar } from "@/components/navbar";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { OptimizedParticles } from "@/components/premium-animations-optimized";
import { CustomCursor, FilmGrain, PageTransition } from "@/components/premium-micro-interactions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${APP_NAME} | All-in-one Tunisian Bac Prep`,
  description:
    "Master French, English, Arabic, and all Option Languages for the Tunisian Baccalaureate with AI-powered instant corrections and targeted practice."
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  const cookieStore = await cookies();
  const langCookie = (cookieStore.get("site-lang")?.value as SiteLanguage) || "en";
  const t = translations[langCookie] || translations.en;

  return (
    <html lang={langCookie} dir={langCookie === "ar" ? "rtl" : "ltr"}>
      <body className="bg-[#000205] text-white antialiased cursor-none">
        {/* Ultimate Premium Effects */}
        <CustomCursor color="#6366f1" size={20} trailLength={10} />
        <FilmGrain />
        
        {/* Optimized Particles - CSS only, disabled on mobile */}
        <OptimizedParticles count={15} />
        
        {/* Legacy magic background for compatibility */}
        <div className="magic-background">
          <div className="glow-orb orb-indigo" />
          <div className="glow-orb orb-amber" />
        </div>
        
        <PageTransition>
          <div className="site-shell">
            <Navbar session={session} translations={t} lang={langCookie} />

          <main className="container relative z-10" style={{ paddingTop: '120px' }}>{children}</main>

          <MobileBottomNav session={session} translations={t} lang={langCookie} />

          <footer className="relative z-10" style={{ padding: '80px 0 40px', borderTop: '1px solid var(--glass-border)', marginTop: '100px' }}>
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
        </PageTransition>
      </body>
    </html>
  );
}
