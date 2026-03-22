import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { getSession, isAdminEmail } from "@/lib/auth";
import { APP_NAME } from "@/lib/constants";
import { LogoutButton } from "@/components/logout-button";

export const metadata: Metadata = {
  title: `${APP_NAME} | All-in-one Tunisian Bac Prep`,
  description:
    "Master French, English, Arabic, and all Option Languages for the Tunisian Baccalaureate with AI-powered instant corrections and targeted practice."
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  return (
    <html lang="en">
      <body>
        <div className="magic-background">
          <div className="glow-orb orb-indigo" />
          <div className="glow-orb orb-amber" />
        </div>
        
        <div className="site-shell">
          <header className="topbar">
            <div className="topbar-inner">
              <Link className="brand" href="/">
                <div className="brand-mark">B</div>
                <strong style={{ fontSize: '1rem', fontWeight: 800 }}>{APP_NAME}</strong>
              </Link>

              <nav aria-label="Primary" className="nav-links">
                <Link className="nav-link" href="/dashboard">Dashboard</Link>
                <Link className="nav-link" href="/lessons">Library</Link>
                <Link className="nav-link" href="/write">Writing Lab</Link>
                <Link className="nav-link" href="/exams">Exams</Link>
                {session && isAdminEmail(session.email) ? (
                  <Link className="pill" href="/admin" style={{ background: 'var(--primary)', color: 'white', border: 'none', marginLeft: '12px', padding: '6px 14px' }}>
                    ⚡ ADMIN
                  </Link>
                ) : null}
              </nav>

              <div className="nav-actions">
                {session ? (
                  <LogoutButton />
                ) : (
                  <Link className="pill" href="/auth/signup" style={{ background: 'white', color: 'black', border: 'none' }}>
                    Join Now
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
                  The AI-first companion for Tunisian students.
                </p>
              </div>
              <div className="row-between" style={{ gap: '32px' }}>
                <Link className="nav-link" href="/privacy">Privacy</Link>
                <Link className="nav-link" href="/terms">Terms</Link>
              </div>
            </div>
            <div className="container" style={{ textAlign: 'center', marginTop: '40px', color: 'var(--ink-dim)', fontSize: '12px' }}>
              &copy; 2026 {APP_NAME}. For Tunisian students, with 💙.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
