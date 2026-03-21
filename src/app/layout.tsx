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
        <div className="site-shell">
          <header className="topbar">
            <div className="topbar-inner">
              <Link className="brand" href="/">
                <span className="brand-mark">B</span>
                <span className="brand-copy">
                  <strong>{APP_NAME}</strong>
                  <span>Focused Bac language preparation</span>
                </span>
              </Link>

              <nav aria-label="Primary" className="nav-links">
                <Link className="nav-link" href="/dashboard">
                  Dashboard
                </Link>
                <Link className="nav-link" href="/daily">
                  Daily
                </Link>
                <Link className="nav-link" href="/lessons">
                  Library
                </Link>
                <Link className="nav-link" href="/write">
                  Write
                </Link>
                <Link className="nav-link" href="/exams">
                  Exams
                </Link>
                <Link className="nav-link" href="/pricing">
                  Pricing
                </Link>
                {session && isAdminEmail(session.email) ? (
                  <Link className="nav-link" href="/admin">
                    Admin
                  </Link>
                ) : null}
              </nav>

              <div className="nav-actions">
                {session ? (
                  <LogoutButton />
                ) : (
                  <>
                    <Link className="nav-link" href="/auth/login">
                      Login
                    </Link>
                    <Link className="button-link nav-link-cta" href="/auth/signup">
                      Start free
                    </Link>
                  </>
                )}
              </div>
            </div>
          </header>

          <main className="container">{children}</main>

          <footer className="site-footer">
            <div className="footer-inner">
              <div className="footer-brand">
                <strong>{APP_NAME}</strong>
                <p>
                  AI-guided bac language prep with structured practice, daily learning loops, and
                  score-focused feedback.
                </p>
              </div>
              <div className="footer-links">
                <Link href="/privacy">Privacy</Link>
                <Link href="/terms">Terms</Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
