"use client";

import { useState, useRef } from "react";
import { toPng } from 'html-to-image';

export function SocialGenerator() {
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("ENGLISH");
  const [platform, setPlatform] = useState("Instagram Carousel");
  const [section, setSection] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedPost, setGeneratedPost] = useState("");
  const visualRef = useRef<HTMLDivElement>(null);
  
  // Pedagogical State
  const [synonyms, setSynonyms] = useState<any[]>([]);
  const [antonyms, setAntonyms] = useState<any[]>([]);
  const [vocabulary, setVocabulary] = useState<any[]>([]);
  const [phrases, setPhrases] = useState<string[]>([]);

  // Unified State
  const [cardTitle, setCardTitle] = useState("The 15/20 Rule 🚀");
  const [cardBody, setCardBody] = useState("Never start a sentence with 'Never' unless you invert the subject and the verb.\n\n❌ Never I have seen...\n✅ Never have I seen...");
  const [cardTheme, setCardTheme] = useState<"grammar" | "vocab" | "mindset" | "elite" | "cyber" | "retro" | "gold" | "vibrant" | "midnight" | "glass">("grammar");
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
    setSynonyms([]);
    setAntonyms([]);
    setVocabulary([]);
    setPhrases([]);

    try {
      const res = await fetch("/api/admin/generate-social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, language, platform, section })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate");
      setGeneratedPost(data.script);
      
      // Auto-populate from AI
      if (data.visualTitle) setCardTitle(data.visualTitle);
      if (data.visualBody) setCardBody(data.visualBody);
      if (data.synonyms) setSynonyms(data.synonyms);
      if (data.antonyms) setAntonyms(data.antonyms);
      if (data.vocabulary) setVocabulary(data.vocabulary);
      if (data.phrases) setPhrases(data.phrases);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  const themeColors = {
    grammar: { bg: "radial-gradient(circle at 10% 10%, #6366f1 0%, #000205 80%)", accent: "#6366f1", glow: "rgba(99, 102, 241, 0.4)" },
    vocab: { bg: "radial-gradient(circle at 10% 10%, #10b981 0%, #000205 80%)", accent: "#10b981", glow: "rgba(16, 185, 129, 0.4)" },
    mindset: { bg: "radial-gradient(circle at 10% 10%, #f59e0b 0%, #000205 80%)", accent: "#f59e0b", glow: "rgba(245, 158, 11, 0.4)" },
    elite: { bg: "radial-gradient(circle at 10% 10%, #333 0%, #000 80%)", accent: "#fff", glow: "rgba(255, 255, 255, 0.2)" },
    cyber: { bg: "radial-gradient(circle at 10% 10%, #ff00ff 0%, #000000 80%)", accent: "#00ffff", glow: "rgba(0, 255, 255, 0.5)" },
    retro: { bg: "radial-gradient(circle at 10% 10%, #ff4d4d 0%, #2b0000 80%)", accent: "#ffcc00", glow: "rgba(255, 204, 0, 0.4)" },
    gold: { bg: "radial-gradient(circle at 10% 10%, #d4af37 0%, #000 80%)", accent: "#ffd700", glow: "rgba(212, 175, 55, 0.5)" },
    vibrant: { bg: "linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)", accent: "#fff", glow: "rgba(236, 72, 153, 0.5)" },
    midnight: { bg: "linear-gradient(135deg, #0f172a 0%, #020617 100%)", accent: "#38bdf8", glow: "rgba(56, 189, 248, 0.3)" },
    glass: { bg: "rgba(255, 255, 255, 0.05)", accent: "#fff", glow: "rgba(255, 255, 255, 0.1)" }
  };

  const currentTheme = themeColors[cardTheme];

  return (
    <section className="stack" style={{ gap: "32px", padding: "40px 0" }}>
      <div className="card row-between" style={{ padding: "40px", border: "1px solid var(--primary)", background: "radial-gradient(circle at right, rgba(99, 102, 241, 0.1), transparent)" }}>
        <div className="stack" style={{ maxWidth: "800px" }}>
          <span className="eyebrow" style={{ color: "var(--primary)" }}>Elite Media Forge</span>
          <h2 className="section-title" style={{ fontSize: "2.5rem" }}>Social Studio & Mastery Hub.</h2>
          <p className="muted" style={{ fontSize: "1.1rem" }}>
            Generate viral scripts in <strong>Tunisian Derja</strong> and pedagogical mastery assets for "Bac Excellence" instantly. 
          </p>
        </div>
        <div className="stack" style={{ gap: "8px", textAlign: "right" }}>
            <span className="pill success-pill">Pedagogic Mode: ELITE 💎</span>
            <span className="eyebrow" style={{ fontSize: "10px", opacity: 0.5 }}>Branding: VIP Mastery</span>
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
                   const suggestions = ["Master the 20/20 Score", "Grammar Inversion Hacks", "Vocab Explosions", "The Examiner's Mindset", "Elite Writing Tips", "How to stop losing points"];
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
                  <option value="FRENCH">French (Live)</option>
                  <option value="ARABIC">Arabic (Live)</option>
                  <option value="SPANISH">Spanish (Optional)</option>
                  <option value="GERMAN">German (Optional)</option>
                  <option value="ITALIAN">Italian (Optional)</option>
                  <option value="PORTUGUESE">Portuguese (Optional)</option>
                </select>
              </label>
              <label className="stack" style={{ gap: "8px" }}>
                <span className="eyebrow" style={{ fontSize: "10px", opacity: 0.6 }}>Format</span>
                <select value={platform} onChange={e => setPlatform(e.target.value)} style={{ padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)" }}>
                  <option value="Instagram Carousel">Instagram Carousel</option>
                  <option value="Cheat Sheet Story">Viral Cheat Sheet Story</option>
                  <option value="High-Impact Thread">Mastery Thread Pack</option>
                  <option value="Educational Post">Premium Educational Post</option>
                </select>
              </label>
            </div>

            <div className="grid grid-cols-2" style={{ gap: "20px" }}>
              <label className="stack" style={{ gap: "8px" }}>
                <span className="eyebrow" style={{ fontSize: "10px", opacity: 0.6 }}>BAC Section Filter</span>
                <select value={section} onChange={e => setSection(e.target.value)} style={{ padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)" }}>
                  <option value="">All Sections</option>
                  <option value="MATHEMATIQUES">Mathématiques</option>
                  <option value="SCIENCES_EXPERIMENTALES">Sciences Exp</option>
                  <option value="ECONOMIE_GESTION">Economie & Gestion</option>
                  <option value="LETTRES">Lettres</option>
                  <option value="SCIENCES_INFORMATIQUE">Informatique</option>
                </select>
              </label>
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

          {/* New Pedagogical Assets Display */}
          {(synonyms.length > 0 || vocabulary.length > 0 || antonyms.length > 0 || phrases.length > 0) && (
            <div className="card stack" style={{ background: "rgba(0, 0, 0, 0.3)", border: "1px solid var(--accent)", padding: "40px", animation: "slideUp 0.6s ease" }}>
              <div className="row-between" style={{ borderBottom: "1px solid rgba(245, 158, 11, 0.2)", paddingBottom: "24px", marginBottom: "32px" }}>
                 <div className="stack" style={{ gap: "4px" }}>
                    <span className="eyebrow" style={{ color: "var(--accent)" }}>💎 PEDAGOGICAL MASTERCLASS</span>
                    <span className="muted" style={{ fontSize: "10px" }}>Elite Content Assets for @bacexcellence</span>
                 </div>
                 <div className="pill" style={{ background: "var(--accent-glow)", borderColor: "var(--accent)", color: "var(--accent)" }}>MASTERED ➔</div>
              </div>
              
              <div className="grid grid-cols-2" style={{ gap: "24px" }}>
                {synonyms.length > 0 && (
                  <div className="stack" style={{ gap: "12px" }}>
                    <span className="eyebrow" style={{ fontSize: "10px", color: "var(--primary)" }}>Synonyms</span>
                    {synonyms.map((s, idx) => (
                      <div key={idx} className="card" style={{ padding: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <span style={{ fontWeight: 800 }}>{s.word}</span> <span className="muted">➔</span> <span style={{ color: "var(--primary)" }}>{s.synonym}</span>
                      </div>
                    ))}
                  </div>
                )}
                {antonyms.length > 0 && (
                  <div className="stack" style={{ gap: "12px" }}>
                    <span className="eyebrow" style={{ fontSize: "10px", color: "#ff4d4d" }}>Antonyms</span>
                    {antonyms.map((a, idx) => (
                      <div key={idx} className="card" style={{ padding: "12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <span style={{ fontWeight: 800 }}>{a.word}</span> <span className="muted">➔</span> <span style={{ color: "#ff4d4d" }}>{a.antonym}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {vocabulary.length > 0 && (
                <div className="stack" style={{ gap: "16px", marginTop: "32px" }}>
                  <span className="eyebrow" style={{ fontSize: "10px", color: "#10b981" }}>Vocabulary Explosion</span>
                  {vocabulary.map((v, idx) => (
                    <div key={idx} className="card stack" style={{ padding: "16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                      <span style={{ fontWeight: 900, fontSize: "1.1rem", color: "#10b981" }}>{v.word}</span>
                      <p className="muted" style={{ fontSize: "14px", margin: "4px 0" }}>{v.definition}</p>
                      <q style={{ fontSize: "12px", borderLeft: "2px solid #10b981", paddingLeft: "8px", fontStyle: "italic", opacity: 0.8 }}>{v.example}</q>
                    </div>
                  ))}
                </div>
              )}

              {phrases.length > 0 && (
                <div className="stack" style={{ gap: "16px", marginTop: "32px" }}>
                  <span className="eyebrow" style={{ fontSize: "10px", color: "#00ffff" }}>Exam-Ready High-Scoring Phrases</span>
                  {phrases.map((p, idx) => (
                    <div key={idx} className="card" style={{ padding: "16px", background: "rgba(0,0,0,0.5)", border: "1px solid #00ffff", borderStyle: "dashed", display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ fontSize: "20px" }}>⚡</span>
                      <span style={{ fontSize: "1rem", fontWeight: 700, color: "#00ffff" }}>{p}</span>
                    </div>
                  ))}
                </div>
              )}
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
                    <option value="grammar">Grammar Blue</option>
                    <option value="vocab">Vocab Green</option>
                    <option value="mindset">Mindset Gold</option>
                    <option value="elite">Elite White</option>
                    <option value="cyber">Neon Cyber</option>
                    <option value="retro">Vintage Red</option>
                    <option value="gold">Royal Gold</option>
                    <option value="vibrant">Vibrant Power</option>
                    <option value="midnight">Midnight Pro</option>
                    <option value="glass">Pure Glass</option>
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
                border: cardTheme === 'glass' ? "1px solid rgba(255,255,255,0.2)" : `1px solid ${currentTheme.glow}`,
                backdropFilter: cardTheme === 'glass' ? "blur(20px)" : "none",
                boxShadow: cardTheme === 'glass' ? "0 8px 32px 0 rgba(31, 38, 135, 0.37)" : `0 0 40px ${currentTheme.glow}, inset 0 0 100px rgba(0,0,0,0.8)`,
                position: "relative",
                display: "flex",
                flexDirection: "column",
                padding: "35px",
                overflow: "hidden",
                borderRadius: "24px"
              }}
            >
              {/* Animated background elements */}
              <div 
                style={{ 
                  position: "absolute", 
                  top: "-10%", 
                  right: "-10%", 
                  width: "150px", 
                  height: "150px", 
                  background: currentTheme.accent, 
                  filter: "blur(80px)", 
                  opacity: 0.2,
                  borderRadius: "50%" 
                }} 
              />

              <div className="row-between" style={{ opacity: 0.8, marginBottom: "24px", zIndex: 2 }}>
                 <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "28px", height: "28px", background: currentTheme.accent, borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "black", fontWeight: 950, fontSize: "16px" }}>B</div>
                    <span style={{ fontSize: "13px", fontWeight: 900, letterSpacing: "1.5px" }}>BAC EXCELLENCE</span>
                 </div>
                 <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: currentTheme.accent }}>SWIPE</span>
                    <div style={{ width: "20px", height: "2px", background: currentTheme.accent, opacity: 0.5 }} />
                 </div>
              </div>

              <div className="stack" style={{ flex: 1, justifyContent: "center", gap: "20px", zIndex: 2 }}>
                <h1 style={{ 
                  fontSize: "2.2rem", 
                  fontWeight: 950, 
                  lineHeight: 1.05, 
                  textShadow: cardTheme === 'glass' ? "none" : `0 0 30px ${currentTheme.accent}44`,
                  background: cardTheme === 'vibrant' ? "linear-gradient(to bottom, #fff, #ddd)" : "none",
                  WebkitBackgroundClip: cardTheme === 'vibrant' ? "text" : "none",
                  WebkitTextFillColor: cardTheme === 'vibrant' ? "transparent" : "inherit"
                }}>
                  {cardTitle}
                </h1>
                
                <div style={{ 
                  fontSize: (cardBody?.length || 0) > 200 ? "0.9rem" : ((cardBody?.length || 0) > 120 ? "1rem" : "1.15rem"), 
                  lineHeight: 1.6, 
                  opacity: 0.95,
                  fontWeight: 500,
                  whiteSpace: "pre-wrap",
                  paddingLeft: "20px",
                  borderLeft: `5px solid ${currentTheme.accent}`,
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                }}>
                  {String(cardBody || "")}
                </div>

                <div style={{ 
                  marginTop: "12px", 
                  padding: "10px 16px", 
                  background: cardTheme === 'glass' ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)", 
                  borderRadius: "12px", 
                  border: `1px solid ${currentTheme.accent}44`, 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: "8px",
                  alignSelf: "flex-start",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}>
                   <span style={{ fontSize: "14px" }}>🛡️</span>
                   <span style={{ color: currentTheme.accent, fontWeight: 900, fontSize: "11px", letterSpacing: "1px" }}>ELITE GRADE BOOSTER</span>
                </div>
              </div>

              <div style={{ textAlign: "center", marginTop: "24px", zIndex: 2 }}>
                <span style={{ fontSize: "13px", opacity: 0.6, letterSpacing: "3px", fontWeight: 800 }}>{cardWatermark.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
