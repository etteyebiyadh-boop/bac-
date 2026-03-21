import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { getSession, isAdminEmail } from "@/lib/auth";
import { APP_NAME } from "@/lib/constants";
import { LogoutButton } from "@/components/logout-button";

export const metadata: Metadata = {
  title: `${APP_NAME} | English-First Tunisian Bac Prep`,
  description:
    "English-first AI correction and bac exam practice for Tunisian Baccalaureate students, designed to expand into a broader language prep platform."
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <Link className="brand" href="/">
            {APP_NAME}
          </Link>
          <nav className="nav-links">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/write">Write</Link>
            <Link href="/exams">Exams</Link>
            {session && isAdminEmail(session.email) ? <Link href="/admin">Admin</Link> : null}
            {session ? (
              <LogoutButton />
            ) : (
              <>
                <Link href="/auth/login">Login</Link>
                <Link className="button-link nav-link-cta" href="/auth/signup">
                  Start free
                </Link>
              </>
            )}
          </nav>
        </header>
        <main className="container">{children}</main>
        <footer className="footer-links">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </footer>
      </body>
    </html>
  );
}
