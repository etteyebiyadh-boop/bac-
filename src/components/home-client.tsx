"use client";

export function HomeClient({ lang, t, isRTL }: any) {
  return (
    <div style={{ padding: "100px 20px", textAlign: "center" }}>
      <h1 style={{ fontSize: "3rem", color: "white", marginBottom: "20px" }}>
        {t?.hero_title || "Welcome"}
      </h1>
      <p style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.7)" }}>
        {t?.hero_subtitle || "Test content"}
      </p>
      <a 
        href="#selector" 
        style={{ 
          display: "inline-block", 
          marginTop: "30px", 
          padding: "15px 30px", 
          background: "white", 
          color: "black",
          borderRadius: "30px",
          textDecoration: "none",
          fontWeight: "bold"
        }}
      >
        {t?.hero_cta || "Get Started"}
      </a>
    </div>
  );
}
