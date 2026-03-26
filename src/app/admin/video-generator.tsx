"use client";

import { useState } from "react";

export function VideoGenerator() {
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("ENGLISH");
  const [duration, setDuration] = useState("3"); // Minutes
  const [loading, setLoading] = useState(false);
  const [blueprint, setBlueprint] = useState<any>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!topic) return;
    
    setLoading(true);
    setBlueprint(null);

    try {
      const res = await fetch("/api/admin/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, language, duration })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate video blueprint");
      setBlueprint(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="stack" style={{ gap: "40px", padding: "40px 0" }}>
      <header className="card stack" style={{ padding: "40px", background: "radial-gradient(circle at top right, rgba(239, 68, 68, 0.05), transparent)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
        <span className="eyebrow" style={{ color: "#ef4444" }}>🎬 Production Master Studio</span>
        <h2 className="section-title" style={{ fontSize: "2.5rem" }}>Elite Video Architect.</h2>
        <p className="muted" style={{ fontSize: "1.1rem" }}>
          Generate cinematic lesson blueprints, high-energy Tunisian voiceovers, and frame-by-frame storyboards for <strong>Bac Excellence</strong>. 
        </p>
      </header>

      <form className="card stack" onSubmit={handleGenerate} style={{ gap: "32px", padding: "40px", border: "1px solid var(--glass-border)", background: "rgba(0,0,0,0.2)" }}>
        <div className="grid grid-cols-3" style={{ gap: "24px" }}>
          <label className="stack" style={{ gap: "8px" }}>
            <span className="eyebrow" style={{ fontSize: "10px", opacity: 0.6 }}>Language Track</span>
            <select value={language} onChange={e => setLanguage(e.target.value)} style={{ padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)" }}>
               <option value="ENGLISH">English (Live)</option>
               <option value="FRENCH">French (Live)</option>
               <option value="ARABIC">Arabic (Live)</option>
               <option value="SPANISH">Spanish (Optional)</option>
            </select>
          </label>
          <label className="stack" style={{ gap: "8px" }}>
             <span className="eyebrow" style={{ fontSize: "10px", opacity: 0.6 }}>Duration (Minutes)</span>
             <select value={duration} onChange={e => setDuration(e.target.value)} style={{ padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)" }}>
                <option value="1">1 Min / High Viral</option>
                <option value="3">3 Min / Mid Lesson</option>
                <option value="5">5 Min / Deep Tutorial</option>
                <option value="8">8 Min / Masterclass</option>
             </select>
          </label>
          <label className="stack" style={{ gap: "8px" }}>
             <span className="eyebrow" style={{ fontSize: "10px", opacity: 0.6 }}>Video Topic / Myth to Bust</span>
             <input 
               placeholder="e.g. 'Simple Past vs Present Perfect'" 
               value={topic}
               onChange={e => setTopic(e.target.value)}
               required
               style={{ padding: "16px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", fontSize: "1rem" }}
             />
          </label>
        </div>

        <button type="submit" disabled={loading} className="full-width hover-glow" style={{ background: "#ef4444", color: "white", padding: "20px", fontSize: "1.2rem", fontWeight: 900, border: "none" }}>
          {loading ? "Synthesizing Producer Blueprint..." : "🎬 Initiate Video Production"}
        </button>
      </form>

      {blueprint && (
        <div className="page-stack reveal" style={{ gap: "32px" }}>
           {/* Summary Cards */}
           <div className="grid grid-cols-2" style={{ gap: "24px" }}>
              <div className="card stack" style={{ border: "1px solid var(--accent)", background: "rgba(245, 158, 11, 0.05)" }}>
                 <span className="eyebrow" style={{ color: "var(--accent)" }}>🎧 MUSIC VIBE</span>
                 <p style={{ margin: "10px 0 0", fontSize: "1.1rem", fontWeight: 700 }}>{blueprint.musicVibe}</p>
              </div>
              <div className="card stack" style={{ border: "1px solid #ef4444", background: "rgba(239, 68, 68, 0.05)" }}>
                 <span className="eyebrow" style={{ color: "#ef4444" }}>🖼️ THUMBNAIL HOOK</span>
                 <p style={{ margin: "10px 0 0", fontSize: "1.1rem", fontWeight: 700 }}>{blueprint.thumbnailHook}</p>
              </div>
           </div>

           {/* Voiceover Script */}
           <div className="card stack" style={{ padding: "48px", background: "rgba(0,0,0,0.4)" }}>
              <div className="row-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "24px", marginBottom: "32px" }}>
                 <div className="stack" style={{ gap: "4px" }}>
                    <h3 className="section-title" style={{ fontSize: "1.8rem" }}>{blueprint.title}</h3>
                    <span className="pill success-pill">Vibe: Tunisian Senior 🇹🇳</span>
                 </div>
                 <button onClick={() => { navigator.clipboard.writeText(blueprint.voiceover); alert("Script Copied!"); }} className="pill" style={{ background: "transparent", border: "1px solid var(--glass-border)", color: "white", cursor: "pointer" }}>Copy Script</button>
              </div>

              <div style={{ background: "rgba(255,255,255,0.02)", padding: "24px", borderRadius: "16px", border: "1px solid var(--glass-border)", marginBottom: "32px" }}>
                  <span className="eyebrow" style={{ color: "var(--accent)", display: "block", marginBottom: "12px" }}>🚀 THE HOOK (FIRST 5s)</span>
                  <p style={{ fontSize: "1.4rem", color: "white", fontWeight: 800 }}>"{blueprint.hook}"</p>
              </div>

              <div style={{ whiteSpace: "pre-wrap", fontSize: "1.1rem", lineHeight: "1.8", opacity: 0.9 }}>
                 {blueprint.voiceover}
              </div>
           </div>

           {/* Performance Storyboard */}
           <div className="stack" style={{ gap: "24px" }}>
              <h3 className="section-title">🎬 Storyboard / Performance Plan</h3>
              <div className="grid grid-cols-1" style={{ gap: "16px" }}>
                {blueprint.storyboard?.map((s: any, i: number) => (
                  <div key={i} className="card row-between" style={{ padding: "32px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--glass-border)", gap: "40px" }}>
                    <div style={{ minWidth: "120px", color: "var(--accent)", fontSize: "1.2rem", fontWeight: 900 }}>{s.time}</div>
                    <div className="stack" style={{ flex: 1, gap: "10px" }}>
                       <div style={{ color: "white", fontSize: "1.1rem", fontWeight: 800 }}>{s.scene}</div>
                       <div className="muted" style={{ fontSize: "0.9rem" }}>{s.instruction}</div>
                    </div>
                    <div className="pill" style={{ background: "rgba(255,255,255,0.05)", borderColor: "var(--primary)", color: "var(--primary)", whiteSpace: "nowrap" }}>
                      {s.visual}
                    </div>
                  </div>
                ))}
              </div>
           </div>

           <div style={{ padding: "40px", textAlign: "center", background: "rgba(255,255,255,0.02)", border: "1px dashed #ef4444", borderRadius: "20px" }}>
               <h3 className="section-title" style={{ fontSize: "1.3rem" }}>Director's Note</h3>
               <p className="muted" style={{ marginTop: "10px" }}>
                 Keep the energy high. In Tunisian videos, the personality is 70% of the result. Use fast cuts when changing from rule explanation to Derja examples.
               </p>
           </div>
        </div>
      )}
    </section>
  );
}
