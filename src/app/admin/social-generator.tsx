"use client";

import { useState, useRef } from "react";
import { toPng } from 'html-to-image';

export function SocialGenerator() {
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("ENGLISH");
  const [platform, setPlatform] = useState("Instagram Carousel");
  const [loading, setLoading] = useState(false);
  const [generatedPost, setGeneratedPost] = useState("");
  const visualRef = useRef<HTMLDivElement>(null);

  // Unified State
  const [cardTitle, setCardTitle] = useState("The 15/20 Rule 🚀");
  const [cardBody, setCardBody] = useState("Never start a sentence with 'Never' unless you invert the subject and the verb.\n\n❌ Never I have seen...\n✅ Never have I seen...");
  const [cardTheme, setCardTheme] = useState<"grammar" | "vocab" | "mindset">("grammar");
  const [cardWatermark, setCardWatermark] = useState("@bacexcellence");

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPost);
  };

  const handleDownload = async () => {
    if (visualRef.current === null) return;
    try {
      const dataUrl = await toPng(visualRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `bac-excellence-${cardTheme}-post.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download image", err);
      alert("Failed to download image.");
    }
  };

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!topic) return;
    
    setLoading(true);
    setGeneratedPost("");

    try {
      const res = await fetch("/api/admin/generate-social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, language, platform })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate");
      setGeneratedPost(data.script);
      
      // Auto-populate Visual card from AI
      if (data.visualTitle) setCardTitle(data.visualTitle);
      if (data.visualBody) setCardBody(data.visualBody);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  const themeColors = {
    grammar: { bg: "radial-gradient(circle at 10% 10%, #6366f1 0%, #000205 80%)", accent: "#6366f1", glow: "rgba(99, 102, 241, 0.4)" },
    vocab: { bg: "radial-gradient(circle at 10% 10%, #10b981 0%, #000205 80%)", accent: "#10b981", glow: "rgba(16, 185, 129, 0.4)" },
    mindset: { bg: "radial-gradient(circle at 10% 10%, #f59e0b 0%, #000205 80%)", accent: "#f59e0b", glow: "rgba(245, 158, 11, 0.4)" }
  };

  const currentTheme = themeColors[cardTheme];

  return (
    <section className="stack" style={{ gap: "32px", padding: "40px 0" }}>
      <div className="card row-between" style={{ padding: "40px", border: "1px solid var(--primary)", background: "radial-gradient(circle at right, rgba(99, 102, 241, 0.05), transparent)" }}>
        <div className="stack" style={{ maxWidth: "800px" }}>
          <span className="eyebrow" style={{ color: "var(--primary)" }}>Viral Content Engine</span>
          <h2 className="section-title" style={{ fontSize: "2.5rem" }}>Elite Social Studio.</h2>
          <p className="muted" style={{ fontSize: "1.1rem" }}>
            Generate viral social media scripts and beautifully branded visual cards for "Bac Excellence" instantly. 
          </p>
        </div>
        <div className="stack" style={{ gap: "8px", textAlign: "right" }}>
            <span className="pill success-pill">AI Engine: Enabled</span>
            <span className="eyebrow" style={{ fontSize: "10px", opacity: 0.5 }}>Branding: Active</span>
        </div>
      </div>

      <div className="grid grid-cols-2" style={{ gap: "40px", alignItems: "start" }}>
        {/* Left Column: Script Writer & Configuration */}
        <div className="stack" style={{ gap: "32px" }}>
          <form className="card stack" onSubmit={handleGenerate} style={{ gap: "24px", border: "1px solid var(--glass-border)", background: "rgba(0,0,0,0.2)", padding: "32px" }}>
            <div className="row-between">
              <h3 className="section-title" style={{ fontSize: "1.5rem" }}>1. Content Config 🤖</h3>
              <button 
                type="button" 
                onClick={() => {
                   const suggestions = ["Score 20/20 Mastery", "Inversion Hacks", "Vocab Explosions", "Grammar Secrets"];
                   setTopic(suggestions[Math.floor(Math.random() * suggestions.length)]);
                }} 
                style={{ background: "transparent", border: "none", color: "var(--primary)", fontSize: "10px", cursor: "pointer", fontWeight: 800 }}
              >
                🎲 SURPRISE ME
              </button>
            </div>
            
            <div className="grid grid-cols-2" style={{ gap: "20px" }}>
              <label className="stack" style={{ gap: "8px" }}>
                <span className="eyebrow" style={{ fontSize: "10px", opacity: 0.6 }}>Language Track</span>
                <select value={language} onChange={e => setLanguage(e.target.value)} style={{ padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)" }}>
                  <option value="ENGLISH">English (Live)</option>
                  <option value="FRENCH">French (Expansion)</option>
                  <option value="ARABIC">Arabic (Expansion)</option>
                </select>
              </label>
              <label className="stack" style={{ gap: "8px" }}>
                <span className="eyebrow" style={{ fontSize: "10px", opacity: 0.6 }}>Format</span>
                <select value={platform} onChange={e => setPlatform(e.target.value)} style={{ padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)" }}>
                  <option value="Instagram Carousel">Instagram Carousel</option>
                  <option value="TikTok/Reels Script">TikTok Script</option>
                  <option value="High-Impact Twitter thread">Thread Pack</option>
                </select>
              </label>
            </div>

            <div className="stack" style={{ gap: "8px" }}>
              <span className="eyebrow" style={{ fontSize: "10px", opacity: 0.6 }}>Topic / Secret Rule</span>
              <input 
                placeholder="e.g. 'How to master inversions'" 
                value={topic}
                onChange={e => setTopic(e.target.value)}
                required
                style={{ padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", fontSize: "1rem" }}
              />
            </div>

            <button type="submit" disabled={loading} className="full-width hover-glow" style={{ background: "var(--primary)", color: "black", padding: "20px", fontSize: "1.1rem", fontWeight: 800 }}>
              {loading ? "Optimizing Viral Strategy..." : "Generate Social Content 🌌"}
            </button>
          </form>

          {generatedPost && (
            <div className="card stack" style={{ background: "rgba(10, 15, 25, 0.4)", border: "1px solid var(--primary-glow)", padding: "32px", animation: "slideUp 0.5s ease" }}>
              <div className="row-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "16px" }}>
                 <div className="stack" style={{ gap: "4px" }}>
                    <span className="eyebrow" style={{ color: "var(--primary)" }}>The Viral Script</span>
                    <span className="muted" style={{ fontSize: "10px" }}>Ready for @bacexcellence</span>
                 </div>
                 <button type="button" onClick={handleCopy} className="button-link hover-glow" style={{ cursor: "pointer", background: "var(--primary)", color: "black", padding: "10px 24px", fontSize: "12px", fontWeight: 800 }}>COPY SCRIPT</button>
              </div>
              <textarea 
                readOnly 
                value={generatedPost} 
                style={{ minHeight: "500px", background: "transparent", color: "white", border: "none", resize: "none", fontSize: "15px", lineHeight: "1.8", fontFamily: "inherit", marginTop: "24px", outline: "none" }} 
              />
            </div>
          )}
        </div>

        {/* Right Column: Branded Designer */}
        <div className="stack" style={{ gap: "32px" }}>
          <div className="card stack" style={{ padding: "32px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)" }}>
            <h3 className="section-title" style={{ fontSize: "1.5rem" }}>2. Card Designer 🎨</h3>
            
            <div className="stack" style={{ gap: "24px", marginTop: "24px" }}>
              <div className="grid grid-cols-2" style={{ gap: "20px" }}>
                <label className="stack" style={{ gap: "8px" }}>
                  <span className="eyebrow" style={{ fontSize: "10px" }}>Vibe</span>
                  <select value={cardTheme} onChange={e => setCardTheme(e.target.value as any)} style={{ padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)" }}>
                    <option value="grammar">Grammar</option>
                    <option value="vocab">Vocabulary</option>
                    <option value="mindset">Mindset</option>
                  </select>
                </label>
                <label className="stack" style={{ gap: "8px" }}>
                  <span className="eyebrow" style={{ fontSize: "10px" }}>Branding</span>
                  <input 
                    value={cardWatermark}
                    onChange={e => setCardWatermark(e.target.value)}
                    style={{ padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", fontSize: "1rem" }}
                  />
                </label>
              </div>

              <label className="stack" style={{ gap: "8px" }}>
                <span className="eyebrow" style={{ fontSize: "10px" }}>Hook Title</span>
                <input 
                  value={cardTitle}
                  onChange={e => setCardTitle(e.target.value)}
                  style={{ padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", fontSize: "1.1rem", fontWeight: 800 }}
                />
              </label>

              <label className="stack" style={{ gap: "8px" }}>
                <span className="eyebrow" style={{ fontSize: "10px" }}>Card Content</span>
                <textarea 
                  rows={4}
                  value={cardBody}
                  onChange={e => setCardBody(e.target.value)}
                  style={{ padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", fontSize: "1.1rem", fontFamily: "monospace", resize: "vertical" }}
                />
              </label>

              <button onClick={handleDownload} className="pill hover-glow" style={{ background: "var(--primary)", color: "black", border: "none", cursor: "pointer", fontWeight: 800, padding: "16px", textAlign: "center", fontSize: "1.1rem" }}>
                ⬇️ Export Branded Card (.png)
              </button>
            </div>
          </div>

          <div className="stack" style={{ alignItems: "center" }}>
            <span className="eyebrow" style={{ marginBottom: "16px" }}>Elite Canvas Preview (1080x1080)</span>
            <div 
              ref={visualRef}
              style={{
                width: "400px",
                height: "400px",
                background: currentTheme.bg,
                border: `1px solid ${currentTheme.glow}`,
                boxShadow: `0 0 40px ${currentTheme.glow}, inset 0 0 100px rgba(0,0,0,0.8)`,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                padding: "30px",
                overflow: "hidden",
                borderRadius: "20px"
              }}
            >
              <div className="row-between" style={{ opacity: 0.8, marginBottom: "20px", zIndex: 2 }}>
                 <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "24px", height: "24px", background: currentTheme.accent, borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontWeight: 900, fontSize: "14px" }}>B</div>
                    <span style={{ fontSize: "12px", fontWeight: 800, letterSpacing: "1px" }}>BAC EXCELLENCE</span>
                 </div>
                 <span style={{ fontSize: "12px", fontWeight: 800, color: currentTheme.accent }}>SWIPE ➔</span>
              </div>

              <div className="stack" style={{ flex: 1, justifyContent: "center", gap: "16px", zIndex: 2 }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 900, lineHeight: 1.1, textShadow: `0 0 20px ${currentTheme.glow}` }}>
                  {cardTitle}
                </h1>
                <div style={{ 
                  fontSize: (cardBody?.length || 0) > 200 ? "0.85rem" : ((cardBody?.length || 0) > 120 ? "0.9rem" : "1.05rem"), 
                  lineHeight: 1.5, 
                  opacity: 0.9,
                  whiteSpace: "pre-wrap",
                  paddingLeft: "16px",
                  borderLeft: `4px solid ${currentTheme.accent}`,
                  transition: "all 0.3s ease"
                }}>
                  {String(cardBody || "")}
                </div>
                <div style={{ marginTop: "10px", padding: "8px 12px", background: "rgba(255,255,255,0.05)", borderRadius: "8px", border: `1px solid ${currentTheme.accent}`, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                   <span style={{ color: currentTheme.accent, fontWeight: 900, fontSize: "10px" }}>🛡️ ELITE GRADE FACTOR: +3 PTS</span>
                </div>
              </div>

              <div style={{ textAlign: "center", marginTop: "20px", zIndex: 2 }}>
                <span style={{ fontSize: "12px", opacity: 0.5, letterSpacing: "2px", fontWeight: 700 }}>{cardWatermark}</span>
              </div>

              <div style={{ position: "absolute", bottom: "-50px", right: "-50px", width: "200px", height: "200px", border: `2px solid ${currentTheme.accent}`, borderRadius: "50%", opacity: 0.1, zIndex: 1 }} />
              <div style={{ position: "absolute", top: "100px", left: "-20px", width: "100px", height: "100px", border: `2px solid ${currentTheme.accent}`, borderRadius: "50%", opacity: 0.1, zIndex: 1 }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
