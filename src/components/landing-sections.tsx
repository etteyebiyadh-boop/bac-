"use client";

import Link from "next/link";
import { SiteLanguage, translations } from "@/lib/translations";

interface SectionProps {
  lang: SiteLanguage;
}

export function FeaturesSection({ lang }: SectionProps) {
  const t = translations[lang];
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

export function ResultsSection({ lang }: SectionProps) {
  const t = translations[lang];
  return (
    <section className="section-padding" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '80px', alignItems: 'center' }}>
        <div className="stack reveal">
          <span className="eyebrow">{t.results_eyebrow}</span>
          <h2 className="section-title-large">{t.results_title}</h2>
          <p className="muted" style={{ fontSize: '1.2rem' }}>
            {t.results_desc}
          </p>
          
          <div className="stack" style={{ gap: '32px', marginTop: '40px' }}>
             <div className="row-between" style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                <div className="stack" style={{ gap: "4px", textAlign: lang === "ar" ? "right" : "left" }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>92%</span>
                  <span className="muted" style={{ fontSize: '12px', fontWeight: 700 }}>{t.results_stat1}</span>
                </div>
                <div className="stack" style={{ gap: "4px", textAlign: lang === "ar" ? "left" : "right" }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent)' }}>+4.5</span>
                  <span className="muted" style={{ fontSize: '12px', fontWeight: 700 }}>{t.results_stat2}</span>
                </div>
             </div>
          </div>
        </div>

        <div className="reveal delay-2" style={{ position: 'relative' }}>
          <div className="glass" style={{ padding: '10px', overflow: 'hidden', transform: 'perspective(1000px) rotateY(-10deg) rotateX(5deg)', boxShadow: '0 50px 100px rgba(0,0,0,0.8)' }}>
             <img 
               src="/dashboard.png" 
               alt="Dashboard Preview" 
               style={{ width: '100%', borderRadius: '12px', display: 'block' }} 
             />
          </div>
          <div style={{ position: 'absolute', bottom: '-40px', right: lang === "ar" ? "auto" : "-40px", left: lang === "ar" ? "-40px" : "auto", background: 'var(--primary)', padding: '30px', borderRadius: '24px', boxShadow: '0 20px 40px var(--primary-glow)', zIndex: 2 }}>
             <strong style={{ fontSize: '2.5rem', display: 'block' }}>17.50</strong>
             <span style={{ fontSize: '12px', fontWeight: 800, opacity: 0.8 }}>{t.results_predicted}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection({ lang }: SectionProps) {
  const t = translations[lang];
  const testimonials = [
    { name: "Ahmed K.", school: "Lycée Pilote Bourguiba", quote: lang === "ar" ? "مخبر الكتابة غير كل شيء. انتقلت من 11/20 إلى 16.5/20 في الإنجليزية في 3 أسابيع فقط." : (lang === "fr" ? "L'Atelier d'Écriture a tout changé. Je suis passé de 11/20 à 16.5/20 en anglais en seulement 3 semaines." : "The Writing Lab changed everything. I went from 11/20 to 16.5/20 in English in just 3 weeks."), avatar: "👨‍🎓" },
    { name: "Sarra M.", school: "Lycée Menzah 9", quote: lang === "ar" ? "أخيرا منصة تفهم طلاب الباكالوريا التونسيين. المحتوى المخصص حسب الشعبة هو المنقذ." : (lang === "fr" ? "Enfin une plateforme qui comprend les bacheliers tunisiens. Le contenu par section est indispensable." : "Finally a platform that understands Tunisian students. The section-specific content is a lifesaver."), avatar: "👩‍🎓" },
    { name: "Yassine B.", school: "Lycée Sousse", quote: lang === "ar" ? "المهام اليومية تبقيني متحمساً. لم يعد الأمر وكأنه دراسة مملة." : (lang === "fr" ? "Les missions quotidiennes me motivent. J'ai enfin l'impression de progresser sereinement." : "The daily missions keep me motivated. It doesn't feel like studying anymore."), avatar: "👨‍🎓" }
  ];

  return (
    <section className="section-padding container">
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <span className="eyebrow">{t.testimonials_eyebrow}</span>
        <h2 className="section-title-large">{t.testimonials_title}</h2>
      </div>

      <div className="grid grid-cols-3">
        {testimonials.map((t, i) => (
          <div key={i} className={`card stack reveal delay-${i+1}`} style={{ padding: '40px' }}>
            <div style={{ fontSize: '32px' }}>{t.avatar}</div>
            <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--ink-dim)' }}>"{t.quote}"</p>
            <div style={{ marginTop: '20px' }}>
              <strong style={{ display: 'block' }}>{t.name}</strong>
              <small className="muted">{t.school}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FinalCTA({ lang }: SectionProps) {
  const t = translations[lang];
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
