"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { APP_NAME } from "@/lib/constants";
import { LanguageSwitcher } from "@/components/language-switcher";

interface NavbarProps {
  session: any;
  translations: any;
  lang: string;
}

function isAdminEmail(email: string): boolean {
  const adminEmails = ["anis@bacexcellence.com", "admin@bacexcellence.com"];
  return adminEmails.includes(email?.toLowerCase());
}

function AdminAccessLink({ t, email }: { t: any; email: string }) {
  const router = useRouter();
  
  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    const code = window.prompt("Enter Admin Verification Code:");
    if (code === "fubisra06") {
      document.cookie = "admin_pass=fubisra06; path=/; max-age=86400;";
      router.push("/admin");
    } else if (code !== null) {
      alert("Unauthorized Access.");
    }
  }
  
  // Only show for admin emails
  if (!isAdminEmail(email)) return null;
  
  return (
    <button 
      onClick={handleClick}
      className="pill" 
      style={{ background: "var(--primary)", color: "white", border: "none", cursor: "pointer" }}
    >
      {t.nav_controlRoom}
    </button>
  );
}

export function Navbar({ session, translations, lang }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const t = translations;

  // Close menu on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: "/dashboard", label: t.nav_dashboard },
    { href: "/lessons", label: t.nav_library },
    { href: "/diagnostic", label: lang === "ar" ? "🚀 تشخيص المستوى" : (lang === "fr" ? "Diagnostic" : "Diagnostic") },
    { href: "/calculator", label: t.nav_calc },
    { href: "/write", label: t.nav_writing },
    { href: "/exams", label: t.nav_exams },
    { href: "/challenges", label: "🏆 Challenges" },
    { href: "/certificates", label: "🎓 Certificates" },
  ];

  return (
    <header className={`topbar ${isOpen ? "mobile-open" : ""}`}>
      <div className="topbar-inner">
        <Link className="brand" href="/" style={{ gap: "12px", flexDirection: lang === "ar" ? "row-reverse" : "row" }}>
          <div className="brand-mark">B</div>
          <strong style={{ fontSize: '1.1rem', fontWeight: 900, letterSpacing: "-0.5px" }}>
            {lang === "ar" ? "🇹🇳 " : ""}{APP_NAME}
          </strong>
        </Link>

        {/* Desktop Nav */}
        <nav aria-label="Primary" className="nav-links desktop-only">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              className={`nav-link ${pathname === link.href ? "active" : ""}`} 
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
          {session ? (
            <AdminAccessLink t={t} email={session.email} />
          ) : null}
        </nav>

        <div className="nav-actions row-between desktop-only" style={{ gap: "20px" }}>
          <LanguageSwitcher />
          {session ? (
            <Link className="pill" href="/profile" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", color: "white" }}>
               {(session.email || 'User').split('@')[0]}
            </Link>
          ) : (
            <Link className="pill" href="/auth/signup" style={{ background: 'white', color: 'black', border: 'none' }}>
              {t.nav_join}
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="mobile-toggle" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          style={{ background: "transparent", padding: "8px", boxShadow: "none" }}
        >
          <div className={`hamburger ${isOpen ? "is-active" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="mobile-menu-overlay reveal" style={{ direction: lang === "ar" ? "rtl" : "ltr" }}>
          <div className="stack" style={{ gap: "16px", padding: "40px 24px" }}>
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                className={`nav-link-mobile ${pathname === link.href ? "active" : ""}`} 
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
            
            {session && isAdminEmail(session.email) && (
              <div style={{ marginTop: "8px" }}>
                <AdminAccessLink t={t} email={session.email} />
              </div>
            )}
            
            <div style={{ height: "1px", background: "var(--glass-border)", margin: "16px 0" }} />
            <div className="row-between" style={{ padding: "0 16px" }}>
               <LanguageSwitcher />
               {session ? (
                 <Link className="pill" href="/profile" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", color: "white" }}>
                    {(session.email || 'User').split('@')[0]}
                 </Link>
               ) : (
                 <Link className="pill" href="/auth/signup" style={{ background: "white", color: "black", border: "none" }}>{t.nav_join}</Link>
               )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
