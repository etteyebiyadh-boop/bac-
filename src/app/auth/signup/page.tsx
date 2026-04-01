"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SiteLanguage, translations } from "@/lib/translations";

function SignupContent() {
  const [step, setStep] = useState(1);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [bacSection, setBacSection] = useState("MATH");
  const [targetScore, setTargetScore] = useState(16);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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

  const sections = [
    { id: "MATH", icon: "📐", label: "Mathématiques", color: "#6366f1" },
    { id: "SCIENCE", icon: "🔬", label: "Sciences Exp.", color: "#10b981" },
    { id: "TECH", icon: "⚙️", label: "Technique", color: "#f59e0b" },
    { id: "LETTRES", icon: "🎭", label: "Lettres", color: "#ec4899" },
    { id: "ECO", icon: "📈", label: "Éco-Gestion", color: "#8b5cf6" },
    { id: "INFO", icon: "💻", label: "Informatique", color: "#3b82f6" },
    { id: "SPORT", icon: "🏅", label: "Sport", color: "#ef4444" },
  ];

  async function onSubmit() {
    setLoading(true);
    setError("");
    
    const payload = {
      fullName,
      ...(method === 'phone' ? { phone: emailOrPhone } : { email: emailOrPhone }),
      password,
      bacSection,
      targetScore,
      primaryLanguage: "ENGLISH"
    };

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || (lang === "ar" ? "فشل إنشاء الحساب" : (lang === "fr" ? "Échec de l'inscription" : "Signup failed")));
        setStep(1);
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell" style={{ 
      direction: lang === "ar" ? "rtl" : "ltr",
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #0a0a1a 0%, #000 100%)',
      padding: '20px',
      overflow: 'hidden'
    }}>
      <div className="card auth-card stack" style={{ 
        maxWidth: step === 2 ? "850px" : "500px", 
        width: '100%',
        padding: "clamp(24px, 5vw, 48px)", 
        border: "1px solid rgba(255,255,255,0.1)",
        background: 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(40px)',
        borderRadius: '32px',
        boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
        zIndex: 1,
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        
        {/* Progress Bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ flex: 1, height: '4px', borderRadius: '2px', background: i <= step ? 'var(--primary)' : 'rgba(255,255,255,0.1)', transition: 'all 0.4s ease' }} />
          ))}
        </div>

        {step === 1 && (
          <div className="stack slide-in" style={{ gap: '20px' }}>
            <span className="eyebrow" style={{ color: "var(--accent)" }}>STEP 1: IDENTITY</span>
            <h1 className="section-title" style={{ fontSize: "2rem", marginBottom: '8px' }}>Launch your campaign.</h1>
            
            <div className="stack" style={{ gap: '20px' }}>
              <div className="stack" style={{ gap: '8px' }}>
                <label className="field-label" style={{ fontSize: '13px', opacity: 0.6 }}>Full Name</label>
                <input type="text" placeholder="Beji Caid Essebsi" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-premium" />
              </div>
              <div className="stack" style={{ gap: '8px' }}>
                <label className="field-label" style={{ fontSize: '13px', opacity: 0.6 }}>{method === 'phone' ? 'Phone Number' : 'Email Address'}</label>
                <input type={method === 'phone' ? 'tel' : 'email'} placeholder={method === 'phone' ? '+216 -- --- ---' : 'bac@student.tn'} value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} className="input-premium" />
              </div>
              <div className="stack" style={{ gap: '8px' }}>
                <label className="field-label" style={{ fontSize: '13px', opacity: 0.6 }}>Create Passkey</label>
                <input type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} className="input-premium" />
              </div>
            </div>

            {error && <p className="error-text" style={{ color: '#ff4444', fontSize: '14px', marginTop: '12px' }}>{error}</p>}

            <button onClick={() => fullName && emailOrPhone && password.length >= 6 ? setStep(2) : setError("Identity incomplete.")} className="button-link hover-glow" style={{ marginTop: '32px', background: 'white', color: 'black', padding: '20px', borderRadius: '14px', fontWeight: 900 }}>
              Deploy Identity →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="stack slide-in" style={{ gap: '24px' }}>
            <span className="eyebrow" style={{ color: "var(--primary)" }}>STEP 2: THE BATTLEFIELD</span>
            <h1 className="section-title" style={{ fontSize: "2rem" }}>Target your official Section.</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
              {sections.map(s => (
                <button 
                  key={s.id} 
                  onClick={() => setBacSection(s.id)}
                  style={{
                    padding: '24px',
                    borderRadius: '20px',
                    border: '2px solid',
                    borderColor: bacSection === s.id ? s.color : 'rgba(255,255,255,0.05)',
                    background: bacSection === s.id ? `${s.color}15` : 'rgba(255,255,255,0.03)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{s.icon}</div>
                  <div style={{ fontWeight: 800, color: 'white', fontSize: '14px' }}>{s.label}</div>
                </button>
              ))}
            </div>

            <div className="row-between" style={{ marginTop: '32px', gap: '16px' }}>
              <button onClick={() => setStep(1)} className="button-link" style={{ flex: 1, color: 'white', opacity: 0.5 }}>← Identity</button>
              <button onClick={() => setStep(3)} className="button-link hover-glow" style={{ flex: 2, background: 'var(--primary)', color: 'white', padding: '18px', borderRadius: '12px' }}>Set Ambition →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="stack slide-in" style={{ gap: '32px', textAlign: 'center' }}>
            <div className="stack" style={{ gap: '8px' }}>
              <span className="eyebrow" style={{ color: "var(--success)" }}>STEP 3: AMBITION</span>
              <h1 className="section-title" style={{ fontSize: "3.5rem", fontWeight: 900 }}>{targetScore}/20</h1>
              <p className="muted">Our AI calibrates your roadmap to this target.</p>
            </div>

            <div style={{ padding: '20px 0' }}>
              <input 
                type="range" min="10" max="20" step="0.5" 
                value={targetScore} 
                onChange={(e) => setTargetScore(parseFloat(e.target.value))}
                style={{ width: '100%', height: '12px', accentColor: 'var(--success)' }}
              />
            </div>

            <div style={{ padding: '24px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
               <strong>{targetScore >= 16 ? 'Distinguished (Mention Très Bien)' : targetScore >= 14 ? 'Good (Mention Bien)' : 'Success (Pass)'}</strong>
               <p style={{ opacity: 0.5, fontSize: '12px', marginTop: '8px' }}>We will prioritize content that bridges your gap to {targetScore}.</p>
            </div>

            <div className="stack" style={{ gap: '16px' }}>
              <button onClick={onSubmit} disabled={loading} className="button-link hover-glow" style={{ width: '100%', padding: '24px', background: 'white', color: 'black', borderRadius: '20px', fontWeight: 900 }}>
                {loading ? "FINALIZING ACCESS..." : "ENTER THE HUB"}
              </button>
              <button onClick={() => setStep(2)} disabled={loading} style={{ background: 'transparent', border: 'none', color: 'var(--ink-dim)', cursor: 'pointer' }}>Change Section</button>
            </div>
          </div>
        )}

        <p className="muted" style={{ textAlign: "center", marginTop: "40px", fontSize: '14px' }}>
          {t.auth_have_account} <Link href="/auth/login" style={{ color: "white", fontWeight: 700, textDecoration: 'underline' }}>{t.auth_btn_login}</Link>
        </p>
      </div>

      <style jsx>{`
        .input-premium {
          background: rgba(255,255,255,0.05);
          padding: 18px 24px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        .input-premium:focus {
          outline: none;
          border-color: var(--primary);
          background: rgba(255,255,255,0.08);
        }
        .slide-in {
          animation: slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
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
