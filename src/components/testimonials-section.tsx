"use client";

export function TestimonialsSection() {
  return (
    <section className="testimonials-section" style={{ padding: "80px 20px", background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" }}>
      <div className="container" style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="section-header" style={{ textAlign: "center", marginBottom: "48px" }}>
          <span className="eyebrow" style={{ color: "#fff", fontSize: "14px", fontWeight: 600, textTransform: "uppercase" }}>
            📊 Statistiques
          </span>
          <h2 className="section-title" style={{ color: "#fff", fontSize: "2.5rem", marginTop: "16px" }}>
            Notre Impact
          </h2>
          <p className="section-subtitle" style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.1rem", marginTop: "16px" }}>
            La plateforme de préparation BAC la plus utilisée en Tunisie
          </p>
        </div>

        <div className="stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", padding: "32px", background: "rgba(255,255,255,0.1)", borderRadius: "16px" }}>
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
