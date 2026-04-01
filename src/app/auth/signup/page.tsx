"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SiteLanguage, translations } from "@/lib/translations";

function SignupContent() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [lang, setLang] = useState<SiteLanguage>("en");
  const router = useRouter();
  const searchParams = useSearchParams();
  const method = searchParams.get("method") || "email";

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
    
    // Determine if we are sending email or phone
    const payload = method === 'phone' 
      ? { phone: emailOrPhone, password }
      : { email: emailOrPhone, password };

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    
    if (!res.ok) {
      setError(lang === "ar" ? "فشل إنشاء الحساب" : (lang === "fr" ? "Échec de l'inscription" : "Signup failed"));
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="auth-shell" style={{ 
      direction: lang === "ar" ? "rtl" : "ltr",
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #0a0a1a 0%, #000 100%)',
      padding: '20px'
    }}>
      <div className="magic-background">
        <div className="glow-orb orb-indigo"></div>
        <div className="glow-orb orb-amber"></div>
      </div>

      <form className="card auth-card stack" onSubmit={onSubmit} style={{ 
        maxWidth: "500px", 
        width: '100%',
        padding: "clamp(24px, 8vw, 60px)", 
        border: "1px solid var(--accent)",
        background: 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(40px)',
        borderRadius: '32px',
        boxShadow: '0 40px 100px rgba(0,0,0,0.5)'
      }}>
        <span className="eyebrow" style={{ color: "var(--accent)" }}>
          {method === 'google' ? 'Google Access' : method === 'phone' ? 'Phone Access' : 'Create Account'}
        </span>
        <h1 className="section-title" style={{ fontSize: "clamp(1.8rem, 8vw, 2.8rem)", marginBottom: '1rem' }}>
          {t.auth_signup_title}
        </h1>
        <p className="muted" style={{ fontSize: "1.1rem", marginBottom: '2rem' }}>
          {method === 'phone' 
            ? 'Entrez votre numéro pour sécuriser votre accès.' 
            : 'Rejoignez la plateforme d\'élite pour réussir votre Bac.'}
        </p>

        <div className="stack" style={{ gap: "24px" }}>
           <div className="stack" style={{ gap: '10px' }}>
              <label className="field-label" style={{ fontWeight: 700, opacity: 0.8 }}>
                {method === 'phone' ? 'Numéro de Téléphone' : t.auth_email}
              </label>
              <input
                type={method === 'phone' ? 'tel' : 'email'}
                placeholder={method === 'phone' ? '+216 -- --- ---' : 'bac@student.tn'}
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                required
                style={{ 
                  background: "rgba(255,255,255,0.05)", 
                  padding: "20px", 
                  borderRadius: "16px", 
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: 'white',
                  fontSize: '1.1rem'
                }}
              />
           </div>
           
           <div className="stack" style={{ gap: '10px' }}>
              <label className="field-label" style={{ fontWeight: 700, opacity: 0.8 }}>{t.auth_password}</label>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ 
                  background: "rgba(255,255,255,0.05)", 
                  padding: "20px", 
                  borderRadius: "16px", 
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: 'white',
                  fontSize: '1.1rem'
                }}
              />
           </div>
        </div>

        {error ? <p className="error-text" style={{ marginTop: "24px", color: 'var(--error)' }}>{error}</p> : null}

        <button className="full-width hover-glow" type="submit" style={{ 
          marginTop: "40px", 
          padding: "22px", 
          background: 'white', 
          color: 'black',
          borderRadius: '16px',
          fontSize: '1.2rem',
          fontWeight: 900,
          boxShadow: '0 20px 40px rgba(255,255,255,0.2)'
        }}>
          {t.auth_btn_signup}
        </button>

        <p className="muted" style={{ textAlign: "center", marginTop: "32px" }}>
          {t.auth_have_account} <Link href="/auth/login" style={{ color: "var(--accent)", fontWeight: 700 }}>{t.auth_btn_login}</Link>
        </p>
      </form>

      <style jsx>{`
        .auth-shell {
          transition: all 0.5s ease;
        }
        input:focus {
          outline: none;
          border-color: var(--accent);
          background: rgba(255,255,255,0.08);
        }
        @media (max-width: 480px) {
          .card {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}
