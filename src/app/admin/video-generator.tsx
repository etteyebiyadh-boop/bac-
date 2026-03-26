"use client";

import { useState } from "react";

export function VideoGenerator() {
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("ENGLISH");
  const [duration, setDuration] = useState("3"); // Minutes
  const [loading, setLoading] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [blueprint, setBlueprint] = useState<any>(null);
  const [rendering, setRendering] = useState(false);
  const [renderStatus, setRenderStatus] = useState<string | null>(null);
  const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null);

  async function handleRender() {
    if (!blueprint?.voiceover) return;
    
    setRendering(true);
    setRenderStatus("Initiating Digital Teacher...");
    setFinalVideoUrl(null);

    try {
      const res = await fetch("/api/admin/render-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: blueprint.voiceover })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Start polling
      const poll = setInterval(async () => {
        const checkRes = await fetch("/api/admin/render-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "check", videoId: data.videoId })
        });
        const checkData = await checkRes.json();
        
        if (checkData.status === "completed") {
           setFinalVideoUrl(checkData.url);
           setRenderStatus("Completed!");
           setRendering(false);
           clearInterval(poll);
        } else if (checkData.status === "failed") {
           setRenderStatus("Generation Failed.");
           setRendering(false);
           clearInterval(poll);
        } else {
           setRenderStatus(`Rendering Digital Teacher... (${checkData.status || "Processing"})`);
        }
      }, 5000);

    } catch(e: any) {
      alert(e.message);
      setRendering(false);
    }
  }

  async function handleSuggest() {
    setSuggesting(true);
    setSuggestions([]);
    try {
      const res = await fetch("/api/admin/suggest-topics");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const list = Array.isArray(data.suggestions) ? data.suggestions : (Object.values(data.suggestions || {})[0] as string[]);
      setSuggestions(Array.isArray(list) ? list : []);
    } catch(e) {
      console.error(e);
      alert("Failed to suggest topics. Ensure you have content in the library.");
    } finally {
      setSuggesting(false);
    }
  }

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
        <div className="row-between">
           <div className="stack">
              <span className="eyebrow" style={{ color: "#ef4444" }}>🎬 Production Master Studio</span>
              <h2 className="section-title" style={{ fontSize: "2.5rem" }}>Elite Video Architect.</h2>
              <p className="muted" style={{ fontSize: "1.1rem" }}>
                Generate cinematic lesson blueprints, high-energy Tunisian voiceovers, and frame-by-frame storyboards for <strong>Bac Excellence</strong>. 
              </p>
           </div>
           <button 
             type="button" 
             onClick={handleSuggest} 
             disabled={suggesting}
             style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--accent-glow)", color: "var(--accent)", padding: "16px 24px", borderRadius: "100px", cursor: "pointer", fontWeight: 800 }}
           >
              {suggesting ? "Analyzing Viral Potential..." : "💡 SUGGEST VIRAL TOPICS"}
           </button>
        </div>

        {suggestions.length > 0 && (
          <div className="stack" style={{ marginTop: "24px", gap: "10px", padding: "20px", background: "rgba(245, 158, 11, 0.05)", border: "1px solid var(--accent-glow)", borderRadius: "20px" }}>
             <span className="eyebrow" style={{ color: "var(--accent)", fontSize: "10px" }}>ADAPTED TO YOUR CONTENT:</span>
             <div className="row-between" style={{ flexWrap: "wrap", gap: "10px", justifyContent: "flex-start" }}>
                {suggestions.map((s, i) => (
                  <button 
                    key={i} 
                    type="button" 
                    onClick={() => { setTopic(s); setSuggestions([]); }} 
                    style={{ background: "white", color: "black", padding: "8px 16px", borderRadius: "100px", fontSize: "12px", border: "none", cursor: "pointer", fontWeight: 700 }}
                  >
                    🔥 {s}
                  </button>
                ))}
             </div>
          </div>
        )}
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

              <div style={{ marginTop: "40px", padding: "40px", border: "2px solid #ef4444", borderRadius: "24px", background: "rgba(239, 68, 68, 0.05)", textAlign: "center" }}>
                  <h3 className="section-title" style={{ fontSize: "1.5rem" }}>Step 2: Synthesize Real Video</h3>
                  <p className="muted" style={{ marginBottom: "24px" }}>Turn this script into a high-fidelity AI Talking Head (Digital Teacher).</p>
                  
                  {!finalVideoUrl ? (
                    <button 
                      onClick={handleRender} 
                      disabled={rendering}
                      className="button-link hover-glow" 
                      style={{ background: "#ef4444", color: "white", padding: "16px 48px", fontSize: "1.1rem", fontWeight: 800, border: "none" }}
                    >
                      {rendering ? `🎬 ${renderStatus}` : "💎 GENERATE DIGITAL TEACHER"}
                    </button>
                  ) : (
                    <div className="stack" style={{ gap: "20px" }}>
                       <span className="pill success-pill" style={{ alignSelf: "center" }}>AI TEACHER READY 🎬</span>
                       <video src={finalVideoUrl} controls style={{ width: "100%", borderRadius: "20px", boxShadow: "0 0 50px rgba(0,0,0,0.5)", border: "1px solid var(--primary)" }} />
                       <a href={finalVideoUrl} download className="button-link" style={{ alignSelf: "center", background: "var(--primary)", color: "white" }}>Download .MP4</a>
                    </div>
                  )}
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
