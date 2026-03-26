"use client";

import Link from "next/link";
import { SiteLanguage, translations } from "@/lib/translations";

interface SectionProps {
  lang: SiteLanguage;
}

export function FeaturesSection({ lang }: SectionProps) {
  const t = translations[lang] || translations.en;
  return (
    <section className="section-padding container">
      <span className="eyebrow reveal">{t.feat_eyebrow}</span>
      <div className="row-between" style={{ alignItems: 'flex-end', marginBottom: '60px', gap: '40px' }}>
        <h2 className="section-title-large reveal delay-1" style={{ maxWidth: '800px', margin: 0 }}>
          {t.feat_title}
        </h2>
        <p className="muted reveal delay-2" style={{ maxWidth: '400px', fontSize: '1.1rem' }}>
          {t.feat_subtitle}
        </p>
      </div>

      <div className="grid grid-cols-2" style={{ gap: "32px" }}>
        <div className="card stack reveal delay-1">
          <div style={{ fontSize: '40px' }}>🖋️</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t.feat_writing_title}</h3>
          <p className="muted">{t.feat_writing_desc}</p>
        </div>
        <div className="card stack reveal delay-2">
          <div style={{ fontSize: '40px' }}>📖</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t.feat_reading_title}</h3>
          <p className="muted">{t.feat_reading_desc}</p>
        </div>
        <div className="card stack reveal delay-3">
          <div style={{ fontSize: '40px' }}>📚</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t.feat_library_title}</h3>
          <p className="muted">{t.feat_library_desc}</p>
        </div>
        <div className="card stack reveal delay-4">
          <div style={{ fontSize: '40px' }}>🎯</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t.feat_missions_title}</h3>
          <p className="muted">{t.feat_missions_desc}</p>
        </div>
      </div>
    </section>
  );
}

export function FinalCTA({ lang }: SectionProps) {
  const t = translations[lang] || translations.en;
  return (
    <section className="section-padding container">
      <div className="card stack" style={{ padding: '100px 40px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(245, 158, 11, 0.05))', border: '1px solid var(--primary)' }}>
        <h2 className="section-title-large">{t.cta_title}</h2>
        <p className="muted" style={{ fontSize: '1.3rem', maxWidth: '600px', margin: '0 auto 48px' }}>
          {t.cta_subtitle}
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <Link href="/auth/signup" className="button-link hover-glow" style={{ padding: '24px 60px' }}>
            {t.cta_btn}
          </Link>
        </div>
      </div>
    </section>
  );
}
