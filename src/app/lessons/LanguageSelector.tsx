"use client";

import React from "react";
import { profileLanguageOptions } from "@/lib/learning";

export function LanguageSelector({ currentLang, activeTab }: { currentLang: string, activeTab: string }) {
  return (
    <form method="get" action="/lessons" style={{ margin: 0 }}>
      <input type="hidden" name="tab" value={activeTab} />
      <select 
        name="lang" 
        defaultValue={currentLang} 
        onChange={(e) => e.target.form?.submit()}
        style={{ padding: '6px 28px 6px 12px', borderRadius: '14px', border: 'none', fontSize: '0.85rem', fontWeight: 700, background: 'rgba(255,255,255,0.95)' }}
      >
        {profileLanguageOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </form>
  );
}
