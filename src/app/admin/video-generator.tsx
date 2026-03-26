"use client";

import { useState } from "react";
import { VideoCanvas } from "./video-canvas";

export function VideoGenerator() {
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("ENGLISH");
  const [duration, setDuration] = useState("1"); // Default to 1min for Viral format
  const [vibe, setVibe] = useState("ELITE BROTHER");
  const [loading, setLoading] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [blueprint, setBlueprint] = useState<any>(null);
  const [productionStep, setProductionStep] = useState<"CONFIG" | "PREVIEW" | "EXPORT">("CONFIG");

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
    setProductionStep("CONFIG");

    try {
      const res = await fetch("/api/admin/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, language, duration, vibe })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to direct cinematic production");
      setBlueprint(data);
      setProductionStep("PREVIEW");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="video-studio-container stack-center" style={{ gap: "40px", padding: "40px 0" }}>
      {/* Studio Header: Free Elite Tech */}
      <header className="card studio-header stack" style={{ width: "100%", maxWidth: "1200px" }}>
        <div className="row-between studio-nav">
           <div className="stack" style={{ gap: "8px" }}>
              <div className="live-pill" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "10px", color: "#10b981", fontWeight: 800 }}>
                  <span className="dot" style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 10px #10b981" }} />
                  SPECIAL AI PRODUCTION (FREE LOCAL ENGINE)
              </div>
              <h1 className="studio-title">Elite Video Architect.</h1>
              <p className="muted" style={{ fontSize: "1.1rem", maxWidth: "600px" }}>
                Generating cinematic MP4 pedagogical experiences with **locally synthesis** (No paid API keys needed).
              </p>
           </div>
           
           <div className="studio-controls row" style={{ gap: "12px" }}>
              <button 
                type="button" 
                onClick={handleSuggest} 
                className="studio-tool-btn"
                disabled={suggesting}
              >
                 {suggesting ? "Analyzing Viral Pot..." : "💡 VIRAL RADAR"}
              </button>
           </div>
        </div>

        {suggestions.length > 0 && (
          <div className="suggestion-cloud row" style={{ marginTop: "24px", flexWrap: "wrap", gap: "10px" }}>
             {suggestions.map((s, i) => (
                <button 
                  key={i} 
                  type="button" 
                  onClick={() => { setTopic(s); setSuggestions([]); }} 
                  className="suggestion-pill"
                >
                  🔥 {s}
                </button>
             ))}
          </div>
        )}
      </header>

      {/* Main Studio Workspace */}
      <div className="grid grid-cols-12" style={{ gap: "32px", width: "100%", maxWidth: "1200px", alignItems: "flex-start" }}>
        
        {/* Left Control Panel */}
        <div className="col-span-4 stack" style={{ gap: "24px", position: "sticky", top: "20px" }}>
          <form className="card studio-sidebar stack" onSubmit={handleGenerate} style={{ gap: "24px", padding: "32px", border: "1px solid rgba(255,255,255,0.05)" }}>
             <h3 className="section-title" style={{ fontSize: "1.1rem", color: "var(--ink-dim)" }}>Production Deck</h3>
             
             <label className="stack" style={{ gap: "8px" }}>
                <span className="eyebrow" style={{ fontSize: "10px", opacity: 0.6 }}>Language Track</span>
                <select value={language} onChange={e => setLanguage(e.target.value)} className="studio-select">
                   <option value="ENGLISH">English (Elite)</option>
                   <option value="FRENCH">French (Elite)</option>
                   <option value="ARABIC">Arabic (Core)</option>
                </select>
             </label>

             <label className="stack" style={{ gap: "8px" }}>
                <span className="eyebrow" style={{ fontSize: "10px", opacity: 0.6 }}>Directorial Vibe</span>
                <select value={vibe} onChange={e => setVibe(e.target.value)} className="studio-select">
                   <option value="ELITE BROTHER">Elite Brother (Tunisian Senior)</option>
                   <option value="THE MASTER">The Master Mentor</option>
                   <option value="VIRAL REBEL">Social Viral Rebel</option>
                </select>
             </label>

             <label className="stack" style={{ gap: "12px" }}>
                <span className="eyebrow" style={{ fontSize: "10px", opacity: 0.6 }}>Lesson Focus / Myth</span>
                <textarea 
                  placeholder="e.g. 'Why everyone fails the Reading Section'" 
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  required
                  className="studio-input"
                  style={{ height: "100px", resize: "none" }}
                />
             </label>

             <button type="submit" disabled={loading} className="studio-generate-btn hover-glow">
               {loading ? "AI DIRECTOR ANALYZING..." : "🚀 DIRECT CINEMATIC PRODUCTION"}
             </button>
          </form>

          {blueprint && (
            <div className="card stack" style={{ padding: "24px", background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
               <h4 style={{ fontSize: "0.9rem", color: "#10b981", fontWeight: 800 }}>Master Script Generated</h4>
               <p className="muted" style={{ fontSize: "0.8rem", marginTop: "8px", fontStyle: "italic" }}>
                 "{blueprint.voiceover_full.substring(0, 100)}..."
               </p>
            </div>
          )}
        </div>

        {/* Cinematic Preview & Canvas */}
        <div className="col-span-8 stack" style={{ gap: "32px", minHeight: "800px" }}>
           {blueprint && productionStep === "PREVIEW" ? (
             <div className="page-stack reveal" style={{ gap: "32px" }}>
                <div className="row-between">
                   <h2 className="section-title">Cinematic Canvas Preview</h2>
                   <button className="pill" onClick={() => setProductionStep("CONFIG")} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", cursor: "pointer" }}>EDIT PRODUCTION CONFIG</button>
                </div>
                
                <VideoCanvas 
                  config={blueprint} 
                  onComplete={() => console.log("Video Finished")}
                />

                <div className="card stack" style={{ padding: "24px", background: "rgba(0,0,0,0.3)", border: "1px dashed rgba(255,255,255,0.1)" }}>
                   <p className="muted" style={{ fontSize: "0.9rem" }}>
                     💡 <strong>Free Local Hack:</strong> This video uses your browser's native hardware to render animations and text-to-speech. To share it, click <strong>EXPORT .MP4</strong> and we will initiate the local capture sequence.
                   </p>
                </div>
             </div>
           ) : (
             <div className="studio-empty-state card stack" style={{ height: "100%", minHeight: "700px", justifyContent: "center", alignItems: "center", gap: "24px", border: "2px dashed rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.01)" }}>
                {loading ? (
                   <div className="stack" style={{ alignItems: "center", gap: "20px" }}>
                      <div className="spinner" style={{ width: "50px", height: "50px", border: "4px solid rgba(255,255,255,0.1)", borderTopColor: "#ef4444", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                      <p className="muted">The AI Director is designing scene layouts and syncing Tunisian script...</p>
                   </div>
                ) : (
                  <div className="stack" style={{ alignItems: "center", gap: "24px", textAlign: "center" }}>
                    <div className="cinema-icon" style={{ fontSize: "4rem", opacity: 0.1 }}>🎬</div>
                    <div className="stack" style={{ gap: "8px" }}>
                       <h2 className="section-title" style={{ opacity: 0.3 }}>Production Studio Idle</h2>
                       <p className="muted" style={{ maxWidth: "400px" }}>Configure your viral pedagogical mission on the left to start the local AI Cinema engine.</p>
                    </div>
                  </div>
                )}
             </div>
           )}
        </div>
      </div>

      <style jsx>{`
        .studio-header {
           padding: 48px;
           background: radial-gradient(circle at top right, rgba(16, 185, 129, 0.05), transparent);
           border-radius: 32px;
        }
        .studio-title {
           font-size: 3rem;
           font-weight: 900;
           letter-spacing: -2px;
        }
        .studio-tool-btn {
           background: rgba(255,255,255,0.05);
           border: 1px solid rgba(255,255,255,0.1);
           color: white;
           padding: 12px 24px;
           border-radius: 100px;
           font-weight: 700;
           cursor: pointer;
        }
        .studio-tool-btn:hover { background: rgba(255,255,255,0.1); }
        .suggestion-pill {
           background: white;
           color: black;
           padding: 8px 16px;
           border-radius: 100px;
           font-size: 0.85rem;
           font-weight: 800;
           border: none;
           cursor: pointer;
        }
        .studio-select, .studio-input {
           padding: 16px;
           background: rgba(255,255,255,0.03);
           border: 1px solid rgba(255,255,255,0.1);
           border-radius: 16px;
           color: white;
           outline: none;
        }
        .studio-generate-btn {
           background: linear-gradient(135deg, #10b981, #059669);
           color: white;
           padding: 24px;
           border-radius: 20px;
           font-size: 1.1rem;
           font-weight: 900;
           border: none;
           cursor: pointer;
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .reveal { animation: reveal 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        @keyframes reveal { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
