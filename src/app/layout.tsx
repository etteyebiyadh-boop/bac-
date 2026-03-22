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
        <div className="bg-engine">
          <div className="bg-orb orb-1" />
          <div className="bg-orb orb-2" />
        </div>
        
        <div className="site-shell">
          <header className="topbar">
            <div className="container topbar-inner">
              <Link className="brand" href="/">
                <div className="brand-mark">B</div>
                <div className="brand-copy">
                  <strong style={{ display: 'block', fontSize: '1.2rem', fontWeight: 800 }}>{APP_NAME}</strong>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--ink-dim)' }}>Elite Bac Preparation</span>
                </div>
              </Link>

              <nav aria-label="Primary" className="nav-links">
                <Link className="nav-link" href="/dashboard">Dashboard</Link>
                <Link className="nav-link" href="/daily">Daily Mission</Link>
                <Link className="nav-link" href="/lessons">Study Hub</Link>
                <Link className="nav-link" href="/write">Writing Lab</Link>
                <Link className="nav-link" href="/exams">Exam Archive</Link>
                {session && isAdminEmail(session.email) ? (
                  <Link className="nav-link" href="/admin">Admin</Link>
                ) : null}
              </nav>

              <div className="nav-actions">
                {session ? (
                  <LogoutButton />
                ) : (
                  <>
                    <Link className="nav-link" href="/auth/login" style={{ marginRight: '16px' }}>Login</Link>
                    <Link className="button-link" href="/auth/signup" style={{ padding: '10px 24px', minHeight: 'auto' }}>
                      Start Now
                    </Link>
                  </>
                )}
              </div>
            </div>
          </header>

          <main className="container">{children}</main>

          <footer style={{ padding: '80px 0 40px', borderTop: '1px solid var(--card-border)', marginTop: '100px' }}>
            <div className="container row-between" style={{ alignItems: 'flex-start' }}>
              <div className="stack" style={{ maxWidth: '400px' }}>
                <strong style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)' }}>{APP_NAME}</strong>
                <p className="muted">
                  The ultimate AI-first companion for Tunisian students aiming for Excellence in the National Baccalaureate.
                </p>
              </div>
              <div className="row-between" style={{ gap: '40px' }}>
                <Link className="nav-link" href="/privacy">Privacy Policy</Link>
                <Link className="nav-link" href="/terms">Terms of Service</Link>
              </div>
            </div>
            <div className="container" style={{ textAlign: 'center', marginTop: '40px', color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>
              &copy; 2026 {APP_NAME}. For Tunisian students, with 💙.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
