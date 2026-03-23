"use client";

import { useState } from "react";

export function SocialGenerator() {
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("ENGLISH");
  const [platform, setPlatform] = useState("Instagram Carousel");
  const [loading, setLoading] = useState(false);
  const [generatedPost, setGeneratedPost] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPost);
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
      setGeneratedPost(data.content);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card stack" style={{ border: "1px solid var(--primary)", background: "radial-gradient(circle at top right, rgba(99, 102, 241, 0.1), transparent)", padding: "60px" }}>
      <div className="row-between" style={{ alignItems: "flex-start" }}>
        <div className="stack" style={{ maxWidth: "600px" }}>
          <span className="eyebrow" style={{ color: "var(--primary)" }}>Content Engine</span>
          <h2 className="section-title" style={{ fontSize: "3rem" }}>Generate Viral <br/>BAC Excellence.</h2>
          <p className="muted" style={{ fontSize: "1.1rem" }}>
            Create shareable Social Media hooks and carousel scripts crafted in the elite Bac Excellence style. 
            Perfect for Instagram, TikTok, and scaling our community.
          </p>
        </div>
        <div className="pill" style={{ borderColor: "var(--primary)", color: "var(--primary)" }}>AD-HOC MARKETING</div>
      </div>

      <form className="stack" onSubmit={handleGenerate} style={{ marginTop: "40px", gap: "24px" }}>
        <div className="grid grid-cols-3">
          <label className="stack" style={{ gap: "8px" }}>
            <span className="eyebrow" style={{ fontSize: "10px", opacity: 0.6 }}>Language Track</span>
            <select value={language} onChange={e => setLanguage(e.target.value)}>
              <option value="ENGLISH">English (Live)</option>
              <option value="FRENCH">French (Expansion)</option>
              <option value="ARABIC">Arabic (Expansion)</option>
              <option value="SPANISH">Spanish (Optional)</option>
              <option value="GERMAN">German (Optional)</option>
              <option value="ITALIAN">Italian (Optional)</option>
            </select>
          </label>
          <label className="stack" style={{ gap: "8px" }}>
            <span className="eyebrow" style={{ fontSize: "10px", opacity: 0.6 }}>Format</span>
            <select value={platform} onChange={e => setPlatform(e.target.value)}>
              <option value="Instagram Carousel">Instagram Carousel</option>
              <option value="TikTok/Reels Script">TikTok Script</option>
              <option value="High-Impact Twitter thread">Thread Pack</option>
            </select>
          </label>
          <label className="stack" style={{ gap: "8px" }}>
            <span className="eyebrow" style={{ fontSize: "10px", opacity: 0.6 }}>Viral Topic / Rule</span>
            <input 
              placeholder="e.g. 'How to master inversions' or 'Environment Vocab'" 
              value={topic}
              onChange={e => setTopic(e.target.value)}
              required
            />
          </label>
        </div>

        <button type="submit" disabled={loading} style={{ background: "linear-gradient(135deg, var(--primary), #ec4899)", padding: "20px", fontSize: "1rem", boxShadow: "0 0 30px var(--primary-glow)" }}>
          {loading ? "Optimizing Viral Hooks..." : "Generate Social Strategy 🚀"}
        </button>
      </form>

      {generatedPost && (
        <div className="grid grid-cols-2" style={{ gap: "32px", marginTop: "48px" }}>
          {/* Script Copy */}
          <div className="card stack" style={{ background: "rgba(0,0,0,0.3)", padding: "32px" }}>
            <div className="row-between">
               <span className="eyebrow">The Script</span>
               <button onClick={handleCopy} className="pill" style={{ cursor: "pointer", background: "rgba(255,255,255,0.1)", fontSize: "10px" }}>COPY TEXT</button>
            </div>
            <textarea 
              readOnly 
              value={generatedPost} 
              style={{ minHeight: "450px", background: "transparent", color: "white", border: "none", resize: "none", fontSize: "14px", lineHeight: "1.6", fontFamily: "monospace" }} 
            />
          </div>

          {/* Visual Concept Card */}
          <div className="stack" style={{ gap: "20px" }}>
             <span className="eyebrow">Elite Visual Style Preview</span>
             <div className="card stack" style={{ minHeight: "500px", padding: "40px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", background: "radial-gradient(circle at 10% 10%, #6366f1 0%, #000 70%)" }}>
                <div style={{ position: "absolute", top: "20px", left: "20px", opacity: 0.4 }}><strong style={{ fontFamily: "Outfit" }}>Bac Excellence</strong></div>
                <div style={{ position: "absolute", bottom: "20px", right: "20px", opacity: 0.4 }}><span style={{ fontSize: "10px" }}>bacexcellence.com</span></div>
                
                <h1 style={{ fontSize: "2.5rem", fontFamily: "Outfit", fontWeight: 900, lineHeight: 1 }}>{generatedPost.split('\n')[0].replace(/Slide 1:|Hook:/, "").trim()}</h1>
                <p className="muted" style={{ marginTop: "24px", color: "var(--ink)", fontWeight: 600 }}>{language} Track excellence.</p>
                <div style={{ marginTop: "40px", width: "100%", height: "2px", background: "linear-gradient(to right, transparent, var(--primary), transparent)" }}></div>
                <p style={{ marginTop: "20px", fontSize: "0.9rem", color: "rgba(255,255,255,0.6)" }}>Bac Excellence Elite Content Engine &copy; 2026</p>
             </div>
             <p className="muted" style={{ fontSize: "12px", textAlign: "center" }}>This is the elite visual branding to follow for your cards.</p>
          </div>
        </div>
      )}
    </section>
  );
}
