"use client";

import { useState } from "react";
import Image from "next/image";

const TESTIMONIALS = [
  {
    name: "Ahmed K.",
    section: "Sciences Expérimentales",
    bacYear: "2024",
    score: "14.5/20",
    improvement: "+5.5 points",
    quote: "Je suis passé de 9 à 14.5 en anglais grâce à Bac Excellence. L'IA détecte toutes tes erreurs et te montre exactement quoi améliorer.",
    avatar: "/avatars/ahmed.jpg"
  },
  {
    name: "Sarah M.",
    section: "Mathématiques",
    bacYear: "2024",
    score: "16/20",
    improvement: "Mention Très Bien",
    quote: "J'ai écrit 20+ rédactions sur la plateforme avant le BAC. Le jour J, j'étais prête. Mention Très Bien obtenue!",
    avatar: "/avatars/sarah.jpg"
  },
  {
    name: "Mohamed R.",
    section: "Lettres",
    bacYear: "2024",
    score: "15/20",
    improvement: "+4 points",
    quote: "Le contenu français est incroyable. Les règles de grammaire expliquées avec des exemples du programme BAC. Résultat: 15/20 au BAC!",
    avatar: "/avatars/mohamed.jpg"
  },
  {
    name: "Yasmine B.",
    section: "Économie & Gestion",
    bacYear: "2024",
    score: "13.5/20",
    improvement: "Assez Bien",
    quote: "Je pensais que l'anglais était impossible pour moi. Bac Excellence m'a prouvé le contraire. 13.5 et Assez Bien!",
    avatar: "/avatars/yasmine.jpg"
  }
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="testimonials-section" style={{ padding: "80px 20px", background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}>
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="section-header" style={{ textAlign: "center", marginBottom: "48px" }}>
          <span className="eyebrow" style={{ color: "#fff", fontSize: "14px", fontWeight: 600, textTransform: "uppercase" }}>
            💬 Témoignages
          </span>
          <h2 className="section-title" style={{ color: "#fff", fontSize: "2.5rem", marginTop: "16px" }}>
            Ils Ont Réussi Grâce à Bac Excellence
          </h2>
          <p className="section-subtitle" style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.1rem", marginTop: "16px" }}>
            Rejoins 50,000+ élèves qui ont transformé leur BAC
          </p>
        </div>

        <div className="testimonials-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
          {TESTIMONIALS.map((testimonial, index) => (
            <div 
              key={index}
              className="testimonial-card"
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "32px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                transition: "transform 0.3s ease",
                transform: activeIndex === index ? "scale(1.02)" : "scale(1)"
              }}
              onMouseEnter={() => setActiveIndex(index)}
            >
              <div className="testimonial-header" style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                <div className="avatar" style={{ width: "56px", height: "56px", borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "24px", fontWeight: 700 }}>
                  {testimonial.name.charAt(0)}
                </div>
                <div className="info">
                  <h4 className="name" style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1f2937" }}>
                    {testimonial.name}
                  </h4>
                  <p className="section" style={{ fontSize: "0.9rem", color: "#6b7280" }}>
                    {testimonial.section} • BAC {testimonial.bacYear}
                  </p>
                </div>
              </div>

              <div className="score-badge" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#ecfdf5", color: "#059669", padding: "8px 16px", borderRadius: "20px", fontSize: "0.9rem", fontWeight: 600, marginBottom: "16px" }}>
                <span>🏆</span>
                <span>{testimonial.score}</span>
                <span style={{ color: "#10b981" }}>({testimonial.improvement})</span>
              </div>

              <blockquote className="quote" style={{ fontSize: "1rem", lineHeight: 1.6, color: "#374151", fontStyle: "italic" }}>
                "{testimonial.quote}"
              </blockquote>

              <div className="verified" style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "#6b7280" }}>
                <span style={{ color: "#10b981" }}>✓</span>
                <span>Résultat vérifié</span>
              </div>
            </div>
          ))}
        </div>

        <div className="stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", marginTop: "48px", padding: "32px", background: "rgba(255,255,255,0.1)", borderRadius: "16px" }}>
          <div className="stat-item" style={{ textAlign: "center" }}>
            <div className="stat-value" style={{ fontSize: "2rem", fontWeight: 800, color: "#fff" }}>50,000+</div>
            <div className="stat-label" style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>Élèves inscrits</div>
          </div>
          <div className="stat-item" style={{ textAlign: "center" }}>
            <div className="stat-value" style={{ fontSize: "2rem", fontWeight: 800, color: "#fff" }}>250,000+</div>
            <div className="stat-label" style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>Rédactions corrigées</div>
          </div>
          <div className="stat-item" style={{ textAlign: "center" }}>
            <div className="stat-value" style={{ fontSize: "2rem", fontWeight: 800, color: "#fff" }}>4.8/5</div>
            <div className="stat-label" style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>Note moyenne</div>
          </div>
          <div className="stat-item" style={{ textAlign: "center" }}>
            <div className="stat-value" style={{ fontSize: "2rem", fontWeight: 800, color: "#fff" }}>+3pts</div>
            <div className="stat-label" style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>En moyenne</div>
          </div>
        </div>
      </div>
    </section>
  );
}
