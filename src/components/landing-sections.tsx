"use client";

import Link from "next/link";
import Image from "next/image";

export function FeaturesSection() {
  return (
    <section className="section-padding container">
      <span className="eyebrow reveal">The New Standard</span>
      <div className="row-between" style={{ alignItems: 'flex-end', marginBottom: '60px', gap: '40px' }}>
        <h2 className="section-title-large reveal delay-1" style={{ maxWidth: '800px', margin: 0 }}>
          Everything you need for a <span className="text-gradient">distinction-level</span> score.
        </h2>
        <p className="muted reveal delay-2" style={{ maxWidth: '400px', fontSize: '1.1rem' }}>
          Stop juggling between books and PDF files. We've centralized the entire Tunisian Bac curriculum into one intelligent platform.
        </p>
      </div>

      <div className="grid grid-cols-2" style={{ gap: "32px" }}>
        <div className="card stack reveal delay-1">
          <div style={{ fontSize: '40px' }}>🖋️</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Writing Lab AI</h3>
          <p className="muted">Submit your essays and get instant feedback based on official exam criteria (Grammar, Vocab, Content, Cohesion).</p>
        </div>
        <div className="card stack reveal delay-2">
          <div style={{ fontSize: '40px' }}>📖</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Comprehension Masterclass</h3>
          <p className="muted">Master the 12/20 points of your exam with 50+ reading passages designed to mimic the national BAC format.</p>
        </div>
        <div className="card stack reveal delay-3">
          <div style={{ fontSize: '40px' }}>📚</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Section-Specific Library</h3>
          <p className="muted">Whether you're Maths or Lettres, your library only shows the content relevant to your coefficient and series.</p>
        </div>
        <div className="card stack reveal delay-4">
          <div style={{ fontSize: '40px' }}>🎯</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Daily High-Yield Missions</h3>
          <p className="muted">15-minute daily sessions designed to tackle your weakest points and ensure you never lose your streak.</p>
        </div>
      </div>
    </section>
  );
}

export function ResultsSection() {
  return (
    <section className="section-padding" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--glass-border)', borderBottom: '1px solid var(--glass-border)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '80px', alignItems: 'center' }}>
        <div className="stack reveal">
          <span className="eyebrow">Data-Driven Success</span>
          <h2 className="section-title-large">Real Results. <br/>Real Fast.</h2>
          <p className="muted" style={{ fontSize: '1.2rem' }}>
            Students using Bac Excellence improve their language scores by an average of 4.5 points within the first month.
          </p>
          
          <div className="stack" style={{ gap: '32px', marginTop: '40px' }}>
             <div className="row-between" style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                <div className="stack" style={{ gap: '4px' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>92%</span>
                  <span className="muted" style={{ fontSize: '12px', fontWeight: 700 }}>STUDENT SATISFACTION</span>
                </div>
                <div className="stack" style={{ gap: '4px', textAlign: 'right' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent)' }}>+4.5</span>
                  <span className="muted" style={{ fontSize: '12px', fontWeight: 700 }}>AVG. POINT INCREASE</span>
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
          <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', background: 'var(--primary)', padding: '30px', borderRadius: '24px', boxShadow: '0 20px 40px var(--primary-glow)', zIndex: 2 }}>
             <strong style={{ fontSize: '2.5rem', display: 'block' }}>17.50</strong>
             <span style={{ fontSize: '12px', fontWeight: 800, opacity: 0.8 }}>PREDICTED GRADE</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const testimonials = [
    { name: "Ahmed K.", school: "Lycée Pilote Bourguiba", quote: "The Writing Lab changed everything. I went from 11/20 to 16.5/20 in English in just 3 weeks.", avatar: "👨‍🎓" },
    { name: "Sarra M.", school: "Lycée Menzah 9", quote: "Finally a platform that understands Tunisian students. The section-specific content is a lifesaver.", avatar: "👩‍🎓" },
    { name: "Yassine B.", school: "Lycée Sousse", quote: "The daily missions keep me motivated. It doesn't feel like studying anymore.", avatar: "👨‍🎓" }
  ];

  return (
    <section className="section-padding container">
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <span className="eyebrow">Success Stories</span>
        <h2 className="section-title-large">Trusted by over 1,000+ <br/>Tunisian students.</h2>
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

export function FinalCTA() {
  return (
    <section className="section-padding container">
      <div className="card stack" style={{ padding: '100px 40px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(245, 158, 11, 0.05))', border: '1px solid var(--primary)' }}>
        <h2 className="section-title-large">Ready to master your Bac?</h2>
        <p className="muted" style={{ fontSize: '1.3rem', maxWidth: '600px', margin: '0 auto 48px' }}>
          Join the waitlist or start your personalized pathway today. Excellence is just a click away.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <Link href="/auth/signup" className="button-link hover-glow" style={{ padding: '24px 60px' }}>
            Get Started Now 🚀
          </Link>
        </div>
      </div>
    </section>
  );
}
