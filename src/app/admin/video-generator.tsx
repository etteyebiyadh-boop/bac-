"use client";

import { useState } from "react";
import { VideoCanvas } from "./video-canvas";

export function VideoGenerator() {
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("ENGLISH");
  const [duration, setDuration] = useState("1");
  const [vibe, setVibe] = useState("PEER MENTOR");
  const [avatar, setAvatar] = useState("JOSH_MASTER");
  const [loading, setLoading] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [blueprint, setBlueprint] = useState<any>(null);
  const [productionStep, setProductionStep] = useState<"CONFIG" | "PREVIEW" | "EXPORT">("CONFIG");

  const AVATARS = [
    { id: "JOSH_MASTER", name: "Josh (Elite Master)", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80" },
    { id: "SARA_ED", name: "Sarah (Pedagogical Architect)", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" },
    { id: "OMAR_PRO", name: "Omar (Academic Senior)", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80" }
  ];

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
        body: JSON.stringify({ topic, language, duration, vibe, avatar })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to direct cinematic production");
      
      data.language = language;
      data.avatarImg = AVATARS.find(a => a.id === avatar)?.img;
      
      setBlueprint(data);
      setProductionStep("PREVIEW");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="video-studio-max stack-center" style={{ gap: "40px", padding: "40px 0" }}>
      {/* Studio Header: High-Resolution Edition */}
      <header className="card studio-header stack" style={{ width: "100%", maxWidth: "1400px", padding: "60px", background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(0,0,0,0.4))", borderRadius: "48px", border: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="row-between studio-nav">
           <div className="stack" style={{ gap: "12px" }}>
              <div className="live-pill" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "#6366f1", fontWeight: 900, background: "rgba(99, 102, 241, 0.1)", padding: "8px 16px", borderRadius: "100px", border: "1px solid #6366f1" }}>
                  <span className="dot" style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#6366f1", boxShadow: "0 0 15px #6366f1" }} />
                  DIRECTOR 4.0 MAX | CINEMATIC AI
              </div>
              <h1 className="studio-title" style={{ fontSize: "4rem", fontWeight: 900, letterSpacing: "-3px" }}>Production Master Studio.</h1>
              <p className="muted" style={{ fontSize: "1.3rem", maxWidth: "800px", lineHeight: "1.6" }}>
                Pushing pedagogical AI to the limit. **Real-time avatars**, **High-bitrate voice**, and **Master-level .MP4** export for international excellence.
              </p>
           </div>
           
           <button 
             type="button" 
             onClick={handleSuggest} 
             className="studio-tool-btn hover-glow"
             disabled={suggesting}
             style={{ padding: "20px 40px", fontSize: "1rem" }}
           >
              {suggesting ? "Analyzing Viral Potential..." : "💡 VIRAL RADAR MAX"}
           </button>
        </div>

        {suggestions.length > 0 && (
          <div className="suggestion-cloud row" style={{ marginTop: "32px", flexWrap: "wrap", gap: "12px" }}>
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

      {/* Production Workspace */}
      <div className="grid grid-cols-12" style={{ gap: "40px", width: "100%", maxWidth: "1400px", alignItems: "flex-start" }}>
        
        {/* Left Control Panel: High-End Synthesis */}
        <div className="col-span-4 stack" style={{ gap: "24px", position: "sticky", top: "20px" }}>
          <form className="card studio-sidebar stack" onSubmit={handleGenerate} style={{ gap: "32px", padding: "40px", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.3)" }}>
             <h3 className="section-title" style={{ fontSize: "1.3rem", color: "white" }}>Synthesis Configuration</h3>
             
             <div className="grid grid-cols-2" style={{ gap: "20px" }}>
                <label className="stack" style={{ gap: "8px" }}>
                   <span className="eyebrow" style={{ fontSize: "10px", opacity: 0.6 }}>Language Track</span>
                   <select value={language} onChange={e => setLanguage(e.target.value)} className="studio-select">
                      <option value="ENGLISH">English (Elite)</option>
                      <option value="FRENCH">French (Elite)</option>
                      <option value="ARABIC">Arabic (Standard)</option>
                   </select>
                </label>
                <label className="stack" style={{ gap: "8px" }}>
                   <span className="eyebrow" style={{ fontSize: "10px", opacity: 0.6 }}>Directorial Vibe</span>
                   <select value={vibe} onChange={e => setVibe(e.target.value)} className="studio-select">
                      <option value="PEER MENTOR">Peer Mentor</option>
                      <option value="THE MASTER">Master Mentor</option>
                      <option value="VIRAL REBEL">Viral Rebel</option>
                   </select>
                </label>
             </div>

             <div className="stack" style={{ gap: "12px" }}>
                <span className="eyebrow" style={{ fontSize: "10px", opacity: 0.6 }}>AI Teacher Avatar</span>
                <div className="grid grid-cols-3" style={{ gap: "12px" }}>
                   {AVATARS.map(a => (
                      <button 
                        key={a.id}
                        type="button"
                        onClick={() => setAvatar(a.id)}
                        className={`avatar-choice ${avatar === a.id ? 'active' : ''}`}
                        style={{ padding: "10px", borderRadius: "16px", background: avatar === a.id ? "rgba(99, 102, 241, 0.2)" : "rgba(255,255,255,0.02)", border: `2px solid ${avatar === a.id ? "#6366f1" : "transparent"}`, cursor: "pointer", textAlign: "center", transition: "all 0.3s ease" }}
                      >
                         <img src={a.img} alt={a.name} style={{ width: "100%", aspectRatio: "1/1", borderRadius: "12px", objectFit: "cover", marginBottom: "8px" }} />
                         <span style={{ fontSize: "9px", fontWeight: 800, color: "white", display: "block" }}>{a.name.split(' ')[0]}</span>
                      </button>
                   ))}
                </div>
             </div>

             <label className="stack" style={{ gap: "12px" }}>
                <span className="eyebrow" style={{ fontSize: "10px", opacity: 0.6 }}>Lesson Focus / Objective</span>
                <textarea 
                  placeholder="e.g. 'Advanced Syntax Masterclass'" 
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  required
                  className="studio-input"
                  style={{ height: "120px", resize: "none", fontSize: "1.1rem" }}
                />
             </label>

             <button type="submit" disabled={loading} className="studio-generate-btn-max hover-glow">
               {loading ? "AI DIRECTOR ANALYZING..." : "🚀 SYNTHESIZE MASTER PRODUCTION"}
             </button>
          </form>

          {blueprint && (
            <div className="card stack" style={{ padding: "32px", background: "rgba(99, 102, 241, 0.08)", border: "1px solid rgba(99, 102, 241, 0.2)", borderRadius: "32px" }}>
               <h4 style={{ fontSize: "1rem", color: "#818cf8", fontWeight: 900 }}>Production Blueprint Validated</h4>
               <p className="muted" style={{ fontSize: "0.9rem", marginTop: "12px", lineHeight: "1.6" }}>
                 The AI Director has designed **{blueprint.scenes.length} professional scenes** with clear pedagogical hierarchies and high-energy narration.
               </p>
            </div>
          )}
        </div>

        {/* Cinematic Preview: The Max Level Canvas */}
        <div className="col-span-8 stack" style={{ gap: "40px", minHeight: "900px" }}>
           {blueprint && productionStep === "PREVIEW" ? (
             <div className="page-stack reveal" style={{ gap: "40px" }}>
                <div className="row-between">
                   <h2 className="section-title" style={{ fontSize: "2rem" }}>Cinematic High-Resolution Preview</h2>
                   <div className="row" style={{ gap: "16px" }}>
                      <button className="pill" onClick={() => setProductionStep("CONFIG")} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "white", cursor: "pointer" }}>EDIT CONFIG</button>
                      <span className="pill" style={{ background: "#10b981", color: "white", fontWeight: 800 }}>MASTER QUALITY ACTIVE</span>
                   </div>
                </div>
                
                <VideoCanvas 
                  config={blueprint} 
                  onComplete={() => console.log("Video Finished")}
                />

                <div className="card stack" style={{ padding: "40px", background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), transparent)", border: "1px dashed rgba(16, 185, 129, 0.3)", borderRadius: "32px" }}>
                   <div className="row" style={{ gap: "20px" }}>
                      <div style={{ fontSize: "2.5rem" }}>💎</div>
                      <div className="stack" style={{ gap: "4px" }}>
                        <h4 style={{ color: "#10b981", fontWeight: 900 }}>Elite MP4 Synthesis Guide</h4>
                        <p className="muted" style={{ fontSize: "1rem" }}>
                          This preview uses professional **Talking Head Sync** and high-fidelity text-to-speech. Click <strong>EXPORT</strong> to capture the master stream and download your high-quality lesson video.
                        </p>
                      </div>
                   </div>
                </div>
             </div>
           ) : (
             <div className="studio-empty-state card stack" style={{ height: "100%", minHeight: "800px", justifyContent: "center", alignItems: "center", gap: "32px", border: "2px dashed rgba(255,255,255,0.05)", background: "rgba(0,0,0,0.2)", borderRadius: "48px" }}>
                {loading ? (
                   <div className="stack" style={{ alignItems: "center", gap: "24px" }}>
                      <div className="spinner-master" />
                      <div className="stack" style={{ textAlign: "center", gap: "8px" }}>
                         <h3 style={{ fontSize: "1.5rem", fontWeight: 900 }}>Directing Production v4.0...</h3>
                         <p className="muted">Syncing avatar movement, professional script, and cinematic transitions.</p>
                      </div>
                   </div>
                ) : (
                  <div className="stack" style={{ alignItems: "center", gap: "32px", textAlign: "center" }}>
                    <div className="cinema-icon-max" style={{ fontSize: "6rem", opacity: 0.05 }}>🎬</div>
                    <div className="stack" style={{ gap: "12px" }}>
                       <h2 className="section-title" style={{ opacity: 0.3, fontSize: "2.5rem" }}>Production Idle</h2>
                       <p className="muted" style={{ maxWidth: "500px", fontSize: "1.2rem" }}>Configure your high-fidelity pedagogical masterclass on the left to start the Cinema 4.0 Max engine.</p>
                    </div>
                  </div>
                )}
             </div>
           )}
        </div>
      </div>

      <style jsx>{`
        .studio-title {
           background: linear-gradient(to right, #fff, #6366f1);
           -webkit-background-clip: text;
           -webkit-text-fill-color: transparent;
        }
        .studio-tool-btn {
           background: #6366f1;
           color: white;
           padding: 16px 32px;
           border-radius: 100px;
           font-weight: 800;
           border: none;
           cursor: pointer;
           box-shadow: 0 0 30px rgba(99, 102, 241, 0.3);
        }
        .studio-generate-btn-max {
           background: linear-gradient(135deg, #6366f1, #4f46e5);
           color: white;
           padding: 24px;
           border-radius: 20px;
           font-size: 1.2rem;
           font-weight: 900;
           border: none;
           cursor: pointer;
           box-shadow: 0 10px 40px rgba(99, 102, 241, 0.4);
        }
        .studio-select, .studio-input {
           padding: 18px;
           background: rgba(255,255,255,0.05);
           border: 1px solid rgba(255,255,255,0.1);
           border-radius: 20px;
           color: white;
           outline: none;
           transition: all 0.3s ease;
        }
        .studio-select:focus, .studio-input:focus {
           border-color: #6366f1;
           background: rgba(255,255,255,0.08);
        }
        .spinner-master {
           width: 60px;
           height: 60px;
           border: 4px solid rgba(99, 102, 241, 0.1);
           border-top-color: #6366f1;
           border-radius: 50%;
           animation: spin 1s linear infinite;
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .reveal { animation: reveal 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        @keyframes reveal { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .avatar-choice:hover {
           transform: translateY(-5px);
           box-shadow: 0 10px 20px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
}
