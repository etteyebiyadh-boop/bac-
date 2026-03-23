import Link from "next/link";
import { HeroPathSelector } from "./home-path-selector";
import { FeaturesSection, ResultsSection, TestimonialsSection, FinalCTA } from "@/components/landing-sections";

export default function HomePage() {
  return (
    <div className="page-stack home-page">
      {/* 🏔️ THE CINEMATIC HERO */}
      <section className="hero" style={{ minHeight: '80vh', justifyContent: 'center', position: 'relative' }}>
        <div className="grid-overlay" style={{ position: 'absolute', inset: 0, opacity: 0.3 }} />
        
        <div className="hero-content reveal" style={{ zIndex: 1 }}>
          <div className="hero-badge" style={{ marginBottom: "24px" }}>
            <span className="pill" style={{ background: "rgba(99, 102, 241, 0.1)", color: "var(--primary)", border: "1px solid var(--primary-glow)" }}>
              ✨ 2026 EDITION - LIVE
            </span>
          </div>
          
          <h1 className="hero-title">
            The Easiest Path <br/>
            to <span className="text-gradient">Bac Excellence.</span>
          </h1>
          
          <p className="hero-text" style={{ maxWidth: "720px", margin: "0 auto 48px", fontSize: '1.4rem' }}>
            The all-in-one AI platform designed specifically for the Tunisian Baccalaureate. 
            Master your languages, track your progress, and secure your future.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '80px' }}>
             <a href="#selector" className="button-link hover-glow" style={{ padding: '20px 48px' }}>
                Build My Pathway
             </a>
             <Link href="/lessons" className="button-link button-secondary" style={{ padding: '20px 48px' }}>
                Explore Library
             </Link>
          </div>
        </div>

        {/* Floating UI Elements or Visuals can go here */}
        <div className="reveal delay-3" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
           <div className="glass" style={{ padding: '12px', background: 'rgba(0,0,0,0.4)', borderRadius: '24px', boxShadow: '0 40px 100px rgba(0,0,0,0.6)' }}>
              <img src="/student.png" alt="Student studying" style={{ width: '100%', borderRadius: '16px', display: 'block', height: '500px', objectFit: 'cover' }} />
           </div>
        </div>
      </section>

      {/* 🛤️ THE PATH SELECTOR */}
      <section id="selector" className="section-padding" style={{ background: 'rgba(99, 102, 241, 0.02)' }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span className="eyebrow reveal">Personalization Engine</span>
          <h2 className="section-title-large reveal delay-1">Where do you start?</h2>
          <p className="muted reveal delay-2" style={{ marginBottom: '60px', fontSize: '1.2rem' }}>
            Select your section and optional language to generate your custom 17/20 roadmap.
          </p>
          <div className="reveal delay-3">
             <HeroPathSelector />
          </div>
        </div>
      </section>

      {/* 🎨 THE SECTIONS GRID */}
      <section className="section-padding container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
           <div className="reveal">
              <span className="eyebrow">All Series Included</span>
              <h2 className="section-title-large">Tailored for every single section.</h2>
              <p className="muted" style={{ fontSize: '1.2rem', marginBottom: '32px' }}>
                From Mathematics to Economy, we've mapped every syllabus requirement, coefficient, and exam pattern unique to your track.
              </p>
              <div className="stack" style={{ gap: '16px' }}>
                 {['Maths', 'Sciences', 'Technique', 'Econ', 'Lettres', 'Info', 'Sport'].map((s) => (
                   <div key={s} className="row-between" style={{ padding: '12px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '100px', border: '1px solid var(--glass-border)' }}>
                      <span style={{ fontWeight: 700 }}>{s}</span>
                      <span style={{ color: 'var(--success)', fontSize: '12px', fontWeight: 800 }}>✓ READY</span>
                   </div>
                 ))}
              </div>
           </div>
           <div className="reveal delay-2">
              <img src="/sections.png" alt="Bac Sections" style={{ width: '100%', borderRadius: '24px', boxShadow: '0 30px 60px rgba(0,0,0,0.4)' }} />
           </div>
        </div>
      </section>

      <FeaturesSection />
      
      <ResultsSection />

      <TestimonialsSection />

      <FinalCTA />
    </div>
  );
}
