"use client";

import { useState, useRef, useEffect } from "react";
import { Download, Table, Sparkles, Video, FileSpreadsheet, Play, Square, Loader2 } from "lucide-react";

interface BulkItem {
  hook: string;
  title: string;
  body: string;
  cta: string;
}

export function BulkGenerator() {
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("ENGLISH");
  const [count, setCount] = useState(30);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<BulkItem[]>([]);
  
  // Video Preview Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  // 1. GENERATE BULK TABLE
  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!topic) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/generate-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, language, count }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setItems(data.items || []);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  // 2. EXPORT CSV (for Canva Bulk Create)
  function downloadCSV() {
    if (items.length === 0) return;
    const header = "Hook,Title,Body,CTA\n";
    const rows = items.map(it => 
      `"${it.hook.replace(/"/g, '""')}","${it.title.replace(/"/g, '""')}","${it.body.replace(/"/g, '""')}","${it.cta.replace(/"/g, '""')}"`
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `bulk-${topic.toLowerCase().replace(/\s+/g, "-")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // 3. VIDEO ENGINE (Canvas Animation)
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    const particles: { x: number; y: number; r: number; v: number }[] = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      v: Math.random() * 0.5 + 0.2
    }));

    const render = () => {
      frame++;
      
      // Background Gradient
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, "#0f172a");
      grad.addColorStop(0.5, "#1e1b4b");
      grad.addColorStop(1, "#000000");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Glow spots
      const time = frame * 0.01;
      const x1 = canvas.width/2 + Math.cos(time) * 100;
      const y1 = canvas.height/3 + Math.sin(time*0.8) * 150;
      const g1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, 400);
      g1.addColorStop(0, "rgba(99, 102, 241, 0.15)");
      g1.addColorStop(1, "transparent");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Particles
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      particles.forEach(p => {
        p.y -= p.v;
        if (p.y < -10) p.y = canvas.height + 10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Glass Card Overlay (Simplified for BG)
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

      // LOGO: BAC EXCELLENCE
      ctx.save();
      const logoX = canvas.width / 2;
      const logoY = 150;
      
      // Gradient Box for "B"
      const boxSize = 80;
      const bGrad = ctx.createLinearGradient(logoX - 40, logoY - 40, logoX + 40, logoY + 40);
      bGrad.addColorStop(0, "#6366f1");
      bGrad.addColorStop(1, "#a855f7");
      ctx.fillStyle = bGrad;
      ctx.beginPath();
      ctx.roundRect(logoX - 40, logoY - 40, boxSize, boxSize, 20);
      ctx.fill();
      
      ctx.fillStyle = "white";
      ctx.font = "bold 50px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("B", logoX, logoY);
      
      ctx.font = "900 32px sans-serif";
      ctx.letterSpacing = "6px";
      ctx.fillText("BAC EXCELLENCE", logoX, logoY + 90);
      
      ctx.font = "600 16px sans-serif";
      ctx.fillStyle = "#6366f1";
      ctx.fillText("ELITE PREP / 2026", logoX, logoY + 125);
      ctx.restore();

      // FIXED BRANDING SENTENCES (Bottom)
      ctx.save();
      const bottomY = canvas.height - 180;
      
      // Glass Bar for branding
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      ctx.beginPath();
      ctx.roundRect(100, bottomY - 60, canvas.width - 200, 120, 30);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.stroke();

      ctx.textAlign = "center";
      
      // English
      ctx.font = "600 24px sans-serif";
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fillText("The first AI platform in Tunisia for languages", canvas.width/2, bottomY - 15);
      
      // Arabic
      ctx.font = "bold 28px sans-serif";
      ctx.fillStyle = "var(--primary)";
      ctx.fillText("أول منصة ذكاء اصطناعي في تونس للغات", canvas.width/2, bottomY + 25);
      ctx.restore();

      // Placeholder for bulk content text (Central Area)
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.font = "italic 18px sans-serif";
      ctx.fillText("[ ADD BULK CONTENT HERE IN CANVA ]", canvas.width/2, canvas.height/2 + 50);

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  return (
    <div className="stack" style={{ gap: "40px", padding: "40px 0" }}>
      
      {/* HEADER */}
      <header className="card row-between" style={{ padding: "40px", border: "1px solid var(--primary)", background: "rgba(99, 102, 241, 0.03)" }}>
        <div className="stack" style={{ gap: "12px" }}>
           <span className="eyebrow" style={{ color: "var(--primary)" }}>Bulk Content Forge 1.0</span>
           <h2 className="section-title" style={{ fontSize: "2.5rem" }}>Massive Content, Minimized Effort.</h2>
           <p className="muted">Generate 30+ educational reels/posts in seconds and export to Canva Bulk Create.</p>
        </div>
        <Sparkles size={48} color="var(--primary)" style={{ opacity: 0.3 }} />
      </header>

      <div className="grid grid-cols-[1fr,400px] gap-40">
        
        {/* LEFT: Config & Table */}
        <div className="stack" style={{ gap: "32px" }}>
          
          {/* Config Form */}
          <form className="card row" onSubmit={handleGenerate} style={{ gap: "20px", padding: "24px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)" }}>
            <div className="stack" style={{ flex: 1, gap: "8px" }}>
              <span className="eyebrow" style={{ fontSize: "10px" }}>Topic / Skill</span>
              <input 
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="e.g. Passive Voice Mastery, Brain Drain Vocab..."
                style={{ padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", color: "white" }}
              />
            </div>
            <div className="stack" style={{ width: "160px", gap: "8px" }}>
               <span className="eyebrow" style={{ fontSize: "10px" }}>Language</span>
               <select value={language} onChange={e => setLanguage(e.target.value)} style={{ padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", color: "white" }}>
                 <option value="ENGLISH">🇬🇧 English</option>
                 <option value="FRENCH">🇫🇷 French</option>
                 <option value="ARABIC">🇹🇳 Arabic</option>
                 <option value="ITALIAN">🇮🇹 Italian</option>
               </select>
            </div>
            <div className="stack" style={{ width: "100px", gap: "8px" }}>
               <span className="eyebrow" style={{ fontSize: "10px" }}>Count</span>
               <input type="number" value={count} onChange={e => setCount(Number(e.target.value))} style={{ padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", color: "white" }} />
            </div>
            <button 
              disabled={loading}
              className="button-primary" 
              style={{ alignSelf: "flex-end", height: "48px", minWidth: "160px" }}
            >
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
              {loading ? "Generating..." : "Generate Table"}
            </button>
          </form>

          {/* TABLE */}
          {items.length > 0 && (
            <div className="card stack" style={{ padding: "0", overflow: "hidden", border: "1px solid var(--glass-border)" }}>
              <div className="row-between" style={{ padding: "20px 24px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid var(--glass-border)" }}>
                <h3 className="row" style={{ gap: "10px", fontSize: "1rem", fontWeight: 900 }}>
                  <Table size={20} color="var(--primary)" />
                  CONTENT DATA TABLE ({items.length} items)
                </h3>
                <button onClick={downloadCSV} className="row" style={{ gap: "8px", background: "#22c55e", color: "black", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: 900, fontSize: "12px", cursor: "pointer" }}>
                  <FileSpreadsheet size={16} />
                  Download CSV for Canva
                </button>
              </div>
              
              <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead style={{ background: "rgba(0,0,0,0.4)", position: "sticky", top: 0, zIndex: 10 }}>
                    <tr>
                      <th style={{ padding: "15px", textAlign: "left", borderBottom: "1px solid var(--glass-border)" }}>#</th>
                      <th style={{ padding: "15px", textAlign: "left", borderBottom: "1px solid var(--glass-border)" }}>Hook</th>
                      <th style={{ padding: "15px", textAlign: "left", borderBottom: "1px solid var(--glass-border)" }}>Title</th>
                      <th style={{ padding: "15px", textAlign: "left", borderBottom: "1px solid var(--glass-border)" }}>Body</th>
                      <th style={{ padding: "15px", textAlign: "left", borderBottom: "1px solid var(--glass-border)" }}>CTA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((it, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <td style={{ padding: "15px", opacity: 0.4 }}>{i + 1}</td>
                        <td style={{ padding: "15px", fontWeight: 700 }}>{it.hook}</td>
                        <td style={{ padding: "15px", color: "var(--primary)" }}>{it.title}</td>
                        <td style={{ padding: "15px", opacity: 0.8 }}>{it.body}</td>
                        <td style={{ padding: "15px" }}><span className="pill" style={{ fontSize: "10px" }}>{it.cta}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Video Template Preview */}
        <div className="stack" style={{ gap: "24px", position: "sticky", top: "40px" }}>
           <div className="card stack" style={{ padding: "32px", gap: "24px", background: "rgba(0,0,0,0.5)", border: "1px solid var(--accent)" }}>
              <div className="row-between">
                 <h3 style={{ fontSize: "1.2rem", fontWeight: 900 }}>🎬 Video Preview</h3>
                 <span className="pill" style={{ background: "var(--accent)", color: "black", border: "none" }}>9:16 Vertical</span>
              </div>
              
              {/* CANVAS BOX */}
              <div style={{ 
                width: "270px", 
                height: "480px", 
                margin: "0 auto", 
                borderRadius: "20px", 
                overflow: "hidden", 
                border: "2px solid rgba(255,255,255,0.1)",
                boxShadow: "0 0 40px rgba(0,0,0,0.5)",
                position: "relative"
              }}>
                <canvas 
                  ref={canvasRef} 
                  width={1080} 
                  height={1920} 
                  style={{ width: "100%", height: "100%", display: "block" }} 
                />
              </div>

              <div className="stack" style={{ gap: "12px" }}>
                <p className="muted" style={{ fontSize: "11px", textAlign: "center" }}>
                  Download the official high-quality branded background for your Canva bulk content.
                </p>
                <a 
                  href="/videos/template.mp4"
                  download="bac-excellence-template.mp4"
                  className="row-center" 
                  style={{ 
                    gap: "12px", 
                    padding: "16px", 
                    borderRadius: "12px", 
                    background: "white", 
                    color: "black", 
                    fontWeight: 900, 
                    border: "none", 
                    textDecoration: "none",
                    cursor: "pointer",
                    boxShadow: "0 10px 20px rgba(255,255,255,0.1)"
                  }}
                >
                  <Video size={18} />
                  Download Ready MP4 Template
                </a>
              </div>
           </div>

           <div className="card stack" style={{ padding: "24px", gap: "12px", background: "rgba(34, 197, 94, 0.05)", border: "1px solid #22c55e" }}>
              <div className="row" style={{ gap: "8px", color: "#22c55e" }}>
                <Sparkles size={16} />
                <strong style={{ fontSize: "12px" }}>CANVA BULK TIP</strong>
              </div>
              <p style={{ fontSize: "12px", opacity: 0.8 }}>
                1. Import the generated **CSV** file into Canva.<br/>
                2. Upload the **MP4 Template** as background.<br/>
                3. Connect CSV fields to text elements.<br/>
                4. Click "Generate" to get {items.length || 30} videos instantly.
              </p>
           </div>
        </div>

      </div>

      <style jsx>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .row-center { display: flex; align-items: center; justify-content: center; }
      `}</style>
    </div>
  );
}
