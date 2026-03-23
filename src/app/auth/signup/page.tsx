"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SiteLanguage, translations } from "@/lib/translations";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [lang, setLang] = useState<SiteLanguage>("en");
  const router = useRouter();

  useEffect(() => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("site-lang="))
      ?.split("=")[1];
    if (cookieValue === "ar" || cookieValue === "fr" || cookieValue === "en") {
      setLang(cookieValue as SiteLanguage);
    }
  }, []);

  const t = translations[lang];

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      setError(lang === "ar" ? "فشل إنشاء الحساب" : (lang === "fr" ? "Échec de l'inscription" : "Signup failed"));
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="auth-shell" style={{ direction: lang === "ar" ? "rtl" : "ltr" }}>
      <form className="card auth-card stack" onSubmit={onSubmit} style={{ maxWidth: "500px", padding: "clamp(24px, 5vw, 60px)", border: "1px solid var(--primary)" }}>
        <span className="eyebrow" style={{ color: "var(--primary)" }}>{lang === "ar" ? "ابدأ مجاناً" : (lang === "fr" ? "Commencer gratuitement" : "Start free")}</span>
        <h1 className="section-title" style={{ fontSize: "clamp(1.8rem, 5vw, 2.5rem)" }}>{t.auth_signup_title}</h1>
        <p className="muted" style={{ fontSize: "1.1rem" }}>
          {t.auth_signup_subtitle}
        </p>

        <div className="stack" style={{ marginTop: "40px", gap: "24px" }}>
           <div className="stack">
              <label className="field-label">{t.auth_email}</label>
              <input
                type="email"
                placeholder="bac@student.tn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "12px", border: "1px solid var(--glass-border)" }}
              />
           </div>
           
           <div className="stack">
              <label className="field-label">{t.auth_password}</label>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "12px", border: "1px solid var(--glass-border)" }}
              />
           </div>
        </div>

        {error ? <p className="error-text" style={{ marginTop: "24px" }}>{error}</p> : null}

        <button className="full-width hover-glow" type="submit" style={{ marginTop: "40px", padding: "20px" }}>
          {t.auth_btn_signup}
        </button>

        <p className="muted" style={{ textAlign: "center", marginTop: "32px" }}>
          {t.auth_have_account} <Link href="/auth/login" style={{ color: "var(--primary)", fontWeight: 700 }}>{t.auth_btn_login}</Link>
        </p>
      </form>
    </div>
  );
}
