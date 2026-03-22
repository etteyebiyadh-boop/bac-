"use client";

import React from "react";

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
        <option value="ENGLISH">English</option>
        <option value="FRENCH">French</option>
        <option value="ARABIC">Arabic</option>
        <option value="SPANISH">Spanish</option>
        <option value="GERMAN">German</option>
        <option value="ITALIAN">Italian</option>
      </select>
    </form>
  );
}
