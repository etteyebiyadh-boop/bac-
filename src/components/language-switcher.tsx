"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function LanguageSwitcher() {
  const [lang, setLang] = useState<string>("en");
  const router = useRouter();

  useEffect(() => {
    // Check initial preference from cookie or localstorage
    const saved = document.cookie
      .split("; ")
      .find((row) => row.startsWith("site-lang="))
      ?.split("=")[1];
    
    if (saved) setLang(saved);
  }, []);

  const changeLanguage = (newLang: string) => {
    setLang(newLang);
    // Set cookie for persistence
    document.cookie = `site-lang=${newLang}; path=/; max-age=31536000`; // 1 year
    // Refresh to apply changes globally
    router.refresh();
  };

  return (
    <div className="language-selector row-between" style={{ gap: "8px", background: "rgba(255,255,255,0.03)", padding: "4px", borderRadius: "100px", border: "1px solid var(--glass-border)" }}>
      <button 
        onClick={() => changeLanguage("ar")} 
        className="nav-link" 
        style={{ padding: "6px 12px", borderRadius: "100px", background: lang === "ar" ? "rgba(255,255,255,0.1)" : "transparent", fontSize: "12px", border: "none", color: lang === "ar" ? "white" : "var(--ink-dim)" }}
      >
        عربي
      </button>
      <button 
        onClick={() => changeLanguage("en")} 
        className="nav-link" 
        style={{ padding: "6px 12px", borderRadius: "100px", background: lang === "en" ? "rgba(255,255,255,0.1)" : "transparent", fontSize: "12px", border: "none", color: lang === "en" ? "white" : "var(--ink-dim)" }}
      >
        EN
      </button>
      <button 
        onClick={() => changeLanguage("fr")} 
        className="nav-link" 
        style={{ padding: "6px 12px", borderRadius: "100px", background: lang === "fr" ? "rgba(255,255,255,0.1)" : "transparent", fontSize: "12px", border: "none", color: lang === "fr" ? "white" : "var(--ink-dim)" }}
      >
        FR
      </button>
    </div>
  );
}
