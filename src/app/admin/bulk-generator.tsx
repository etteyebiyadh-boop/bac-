"use client";

import { useState, useRef, useEffect } from "react";
import { Download, Table, Sparkles, Video, FileSpreadsheet, Play, Square, Loader2, Image as ImageIcon, Box, CheckCircle2 } from "lucide-react";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import { saveAs } from "file-saver";

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
  
  // Video Tools State
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  // Bulk Export State
  const [isForging, setIsForging] = useState(false);
  const [forgeProgress, setForgeProgress] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 1. SURPRISE ME (Random Rich Topics)
  function handleSurpriseMe() {
    const richTopics: Record<string, string[]> = {
      ENGLISH: ["Passive Voice Mastery", "Inversion Hacks (Never/Seldom)", "Conditional Type 3 & Regrets", "Essay Connectors (Elite)", "Phrasal Verbs for BAC", "Brain Drain Vocabulary", "Technology & Human Rights", "Formal Letter Structures", "Sustainable Development Lexicon", "Reported Speech Precision"],
      FRENCH:  ["Le Subjonctif (Usage Avancé)", "La Voix Passive en Français", "Les Connecteurs Logiques (Dissertation)", "La Nominalisation (Style)", "L'Immigration et l'Identité", "La Mondialisation et son Impact", "Le Discours Indirect", "Le Conditionnel Passe & Regrets", "Vocabulaire de l'Environnement", "Analyse de Texte: Outils Stylistiques"],
      ARABIC:  ["النحو: الجملة الحجاجية", "البلاغة: الاستعارة والتشبيه", "تحليل المقال الأدبي", "أدوات الربط والانسجام", "قضية الهوية والتحول", "الفعل المبني للمجهول", "المنهجية في التلخيص", "مصطلحات حقوق الإنسان", "الأدب التونسي الحديث", "الأساليب الإنشائية"],
      ITALIAN: ["Il Congiuntivo (Presente/Passato)", "La Voce Passiva in Italiano", "I Connettivi Logici", "L'Ambiente e la Sostenibilità", "La Tecnologia nel Futuro", "Il Bel Paese: Cultura e Tradizione"],
      SPANISH: ["El Subjuntivo (Presente/Pasado)", "La Voz Pasiva en Español", "Los Conectores de Discurso", "El Medio Ambiente", "La Juventud y el Empleo", "La Cultura Hispana"],
      GERMAN:  ["Der Konjunktiv II", "Das Passiv (Vorgang/Zustand)", "Relativsätze & Nebensätze", "Umwelt & Nachhaltigkeit", "Technik & Innovation", "Arbeit & Beruf"],
      RUSSIAN: ["Виды глагола", "Падежи (Система 6 падежей)", "Причастиيا и деепричастия", "Экология и природа", "Наука и технологии"],
      CHINESE: ["把/被字句 (Ba/Bei)", "补语用法 (Result/Direction)", "连词与复杂句", "环境保护", "科技与生活"]
    };
    const list = richTopics[language] || richTopics["ENGLISH"];
    setTopic(list[Math.floor(Math.random() * list.length)]);
  }

  // 2. GENERATE BULK TABLE
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
      // Reset card refs
      cardRefs.current = new Array(data.items.length).fill(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  // 3. NATIVE BULK RENDER (The "Canva Killer" feature)
  async function forgeCardPack() {
    if (items.length === 0) return;
    setIsForging(true);
    setForgeProgress(0);
    
    const zip = new JSZip();
    const folder = zip.folder(`bac-excellence-${topic.toLowerCase().replace(/\s+/g, "-")}-pack`);
    
    for (let i = 0; i < items.length; i++) {
        const ref = cardRefs.current[i];
        if (!ref) continue;
        
        try {
            // Tiny delay to ensure DOM is ready for each
            await new Promise(r => setTimeout(r, 100));
            
            const dataUrl = await toPng(ref, {
                pixelRatio: 2,
                cacheBust: true,
                style: { transform: 'scale(1)', transformOrigin: 'top left' }
            });
            
            const base64Data = dataUrl.split(",")[1];
            folder?.file(`card-${i + 1}.png`, base64Data, { base64: true });
            
            setForgeProgress(Math.round(((i + 1) / items.length) * 100));
        } catch (e) {
            console.error("Failed to render card", i, e);
        }
    }
    
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `bac-excellence-${topic.toLowerCase().replace(/\s+/g, "-")}-pack.zip`);
    
    setIsForging(false);
    setForgeProgress(0);
  }

  // 4. VIDEO ENGINE
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      v: Math.random() * 0.8 + 0.3,
      a: Math.random() * Math.PI * 2
    }));

    const render = () => {
      frame++;
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, "#05070a"); grad.addColorStop(0.4, "#0f172a"); grad.addColorStop(0.7, "#1e1b4b"); grad.addColorStop(1, "#000000");
      ctx.fillStyle = grad; ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = frame * 0.012;
      const orbs = [
        { x: canvas.width * 0.2 + Math.cos(time * 0.7) * 150, y: canvas.height * 0.3 + Math.sin(time * 0.8) * 200, color: "rgba(99, 102, 241, 0.22)", size: 600 },
        { x: canvas.width * 0.8 + Math.sin(time * 0.9) * 120, y: canvas.height * 0.7 + Math.cos(time * 0.6) * 180, color: "rgba(168, 85, 247, 0.18)", size: 500 },
        { x: canvas.width * 0.5 + Math.cos(time * 0.5) * 180, y: canvas.height * 0.5 + Math.sin(time * 0.4) * 250, color: "rgba(245, 158, 11, 0.1)", size: 700 }
      ];

      ctx.save(); ctx.globalCompositeOperation = "screen";
      orbs.forEach(orb => {
        const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.size); g.addColorStop(0, orb.color); g.addColorStop(1, "transparent");
        ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);
      });
      ctx.restore();

      ctx.strokeStyle = "rgba(99, 102, 241, 0.08)"; ctx.lineWidth = 1;
      const gridOffset = (frame * 1.5) % 80;
      for (let y = gridOffset; y < canvas.height; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
      for (let x = gridOffset; x < canvas.width; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }

      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      particles.forEach(p => { p.y -= p.v; p.x += Math.sin(frame * 0.03 + p.a) * 0.5; if (p.y < -20) p.y = canvas.height + 20; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); });

      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)"; ctx.lineWidth = 2; ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

      ctx.save(); const lX = canvas.width/2; const lY = 180;
      ctx.strokeStyle = "rgba(99, 102, 241, 0.4)"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(lX, lY, 110, time*2, time*2 + Math.PI*0.8); ctx.stroke();
      ctx.beginPath(); ctx.arc(lX, lY, 110, time*2+Math.PI, time*2+Math.PI*1.8); ctx.stroke();
      const bS = 90; const bG = ctx.createLinearGradient(lX-45, lY-45, lX+45, lY+45); bG.addColorStop(0, "#6366f1"); bG.addColorStop(1, "#a855f7");
      ctx.fillStyle = bG; ctx.shadowBlur = 40; ctx.shadowColor = "rgba(99,102,241,0.6)"; ctx.beginPath(); ctx.roundRect(lX-45, lY-45, bS, bS, 24); ctx.fill(); ctx.shadowBlur = 0;
      ctx.fillStyle="white"; ctx.font="bold 56px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("B", lX, lY);
      ctx.font="900 40px sans-serif"; ctx.letterSpacing="8px"; ctx.fillText("BAC EXCELLENCE", lX, lY+105);
      ctx.font="700 18px sans-serif"; ctx.fillStyle="#6366f1"; ctx.fillText("ELITE PREP / 2026", lX, lY+140);
      const brY = lY+200; ctx.textAlign="center"; ctx.font="600 24px sans-serif"; ctx.fillStyle="rgba(255, 255, 255, 0.9)";
      ctx.fillText("The first AI platform in Tunisia for languages", canvas.width/2, brY);
      ctx.font="bold 28px sans-serif"; ctx.fillStyle="white"; ctx.fillText("أول منصة ذكاء اصطناعي في تونس للغات", canvas.width/2, brY+50);
      ctx.restore();

      ctx.save(); ctx.fillStyle="rgba(255, 255, 255, 0.03)"; ctx.beginPath(); ctx.roundRect(100, canvas.height/2-100, canvas.width-200, 400, 40); ctx.fill(); ctx.strokeStyle="rgba(255, 255, 255, 0.08)"; ctx.stroke();
      ctx.fillStyle="white"; ctx.globalAlpha=(Math.sin(time*2)+1.2)/2.2; ctx.font="900 32px sans-serif"; ctx.fillText("MASTERING:", canvas.width/2, canvas.height/2);
      ctx.font="bold 42px sans-serif"; ctx.fillStyle="#f59e0b"; ctx.fillText(topic ? topic.toUpperCase() : "SELECT TOPIC", canvas.width/2, canvas.height/2+80);
      ctx.restore();

      animationRef.current = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [topic]);

  // 5. GENERATE VIDEO
  const generateVideo = async () => {
    if (!canvasRef.current) return;
    setIsRecording(true); setRecordProgress(0);
    const stream = canvasRef.current.captureStream(60); const rec = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });
    const chunks: Blob[] = []; rec.ondataavailable = (e) => chunks.push(e.data);
    rec.onstop = () => { const blob = new Blob(chunks, { type: "video/webm" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href=url; a.download=`bac-template.webm`; a.click(); setIsRecording(false); };
    rec.start(); const duration = 7000; const start = Date.now();
    const interval = setInterval(() => { const elapsed = Date.now()-start; setRecordProgress(Math.min(100,(elapsed/duration)*100)); if(elapsed>=duration){ clearInterval(interval); rec.stop(); } }, 100);
  };

  return (
    <div className="stack" style={{ gap: "40px", padding: "40px 0" }}>
      
      {/* HEADER */}
      <header className="card row-between" style={{ padding: "40px", border: "1px solid var(--primary)", background: "rgba(99, 102, 241, 0.03)" }}>
        <div className="stack" style={{ gap: "12px" }}>
           <span className="eyebrow" style={{ color: "var(--primary)" }}>AI Content Automator — Pro Forge</span>
           <h2 className="section-title" style={{ fontSize: "2.5rem" }}>Sack Canva. Automate Everything.</h2>
           <p className="muted">Generate 30+ custom-designed cards instantly using our high-end AI rendering engine.</p>
        </div>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
           <button onClick={handleSurpriseMe} className="button-secondary" style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid var(--accent-glow)", color: "var(--accent)" }}>
              🎲 SURPRISE ME
           </button>
           <Sparkles size={48} color="var(--primary)" style={{ opacity: 0.3 }} />
        </div>
      </header>

      <div className="grid grid-cols-[1fr,400px] gap-40">
        
        {/* LEFT: Config & Table */}
        <div className="stack" style={{ gap: "32px" }}>
          <form className="card row" onSubmit={handleGenerate} style={{ gap: "20px", padding: "24px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)" }}>
            <div className="stack" style={{ flex: 1, gap: "8px" }}>
              <span className="eyebrow" style={{ fontSize: "10px" }}>Topic</span>
              <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic..." style={{ padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", color: "white" }} />
            </div>
            <div className="stack" style={{ width: "160px", gap: "8px" }}>
               <span className="eyebrow" style={{ fontSize: "10px" }}>Language Track</span>
               <select value={language} onChange={e => setLanguage(e.target.value)} style={{ padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", color: "white" }}>
                  {["ENGLISH", "FRENCH", "ARABIC", "ITALIAN", "SPANISH", "GERMAN", "RUSSIAN", "CHINESE"].map(l => <option key={l} value={l}>{l}</option>)}
               </select>
            </div>
            <button disabled={loading} className="button-primary" style={{ alignSelf: "flex-end", height: "48px", minWidth: "160px" }}>
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />} {loading ? "Analyzing..." : "Generate AI Table"}
            </button>
          </form>

          {items.length > 0 && (
            <div className="stack" style={{ gap: "24px" }}>
              <div className="card row-between" style={{ padding: "24px", border: "1px solid #22c55e", background: "rgba(34, 197, 94, 0.05)" }}>
                  <div className="stack" style={{ gap: "4px" }}>
                      <strong style={{ fontSize: "1.2rem", color: "#22c55e" }}>Table Generated Successfully!</strong>
                      <p className="muted" style={{ fontSize: "12px" }}>You can now download the CSV for Canva OR use our **Native Bulk Renderer** below.</p>
                  </div>
                  <div className="row" style={{ gap: "12px" }}>
                      <button onClick={downloadCSV} className="button-secondary" style={{ padding: "12px 20px", fontSize: "12px" }}>
                          <FileSpreadsheet size={16} /> CSV Export
                      </button>
                      <button 
                        onClick={forgeCardPack} 
                        disabled={isForging}
                        style={{ 
                            background: "#22c55e", 
                            color: "black", 
                            border: "none", 
                            padding: "12px 24px", 
                            borderRadius: "12px", 
                            fontWeight: 900, 
                            fontSize: "12px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}
                      >
                        {isForging ? <Loader2 className="animate-spin" size={16} /> : <Box size={16} />}
                        {isForging ? `Forging ${forgeProgress}%` : "EXPORE ALL CARDS (.zip)"}
                      </button>
                  </div>
              </div>

              {/* TABLE PREVIEW */}
              <div className="card stack" style={{ padding: "0", overflow: "hidden", border: "1px solid var(--glass-border)" }}>
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                    <thead style={{ background: "rgba(0,0,0,0.4)", position: "sticky", top: 0 }}>
                      <tr><th style={{ padding: "12px", textAlign: "left" }}>#</th><th style={{ padding: "12px", textAlign: "left" }}>Hook</th><th style={{ padding: "12px", textAlign: "left" }}>Content</th><th style={{ padding: "12px", textAlign: "left" }}>CTA</th></tr>
                    </thead>
                    <tbody>
                      {items.map((it, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                          <td style={{ padding: "12px", opacity: 0.4 }}>{i + 1}</td><td style={{ padding: "12px", fontWeight: 700 }}>{it.hook}</td>
                          <td style={{ padding: "12px" }}><div style={{ fontWeight: 800, color: "var(--primary)" }}>{it.title}</div><div style={{ opacity: 0.7 }}>{it.body}</div></td>
                          <td style={{ padding: "12px" }}><span className="pill">{it.cta}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Video Preview */}
        <div className="stack" style={{ gap: "24px", position: "sticky", top: "40px" }}>
           <div className="card stack" style={{ padding: "32px", gap: "24px", background: "rgba(0,0,0,0.5)", border: "1px solid var(--accent)" }}>
              <div className="row-between"><h3 style={{ fontSize: "1.2rem", fontWeight: 900 }}>🎬 Elite Template</h3><span className="pill" style={{ background: "var(--accent)", color: "black" }}>BRANDED</span></div>
              <div style={{ width: "270px", height: "480px", margin: "0 auto", borderRadius: "20px", overflow: "hidden", border: "2px solid rgba(255,255,255,0.1)", position: "relative" }}>
                <canvas ref={canvasRef} width={1080} height={1920} style={{ width: "100%", height: "100%", display: "block" }} />
                {isRecording && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", zIndex: 20 }}>
                    <Loader2 className="animate-spin" size={40} color="var(--accent)" />
                    <strong style={{ color: "white" }}>FORGING MP4 {Math.round(recordProgress)}%</strong>
                </div>}
              </div>
              <button onClick={generateVideo} disabled={isRecording} className="row-center" style={{ gap: "12px", padding: "16px", borderRadius: "12px", background: "white", color: "black", fontWeight: 900, cursor: "pointer" }}>
                <Video size={18} /> Export Branded BG (.mp4)
              </button>
           </div>
        </div>
      </div>

      {/* HIDDEN RENDERER: This is where the magic happens */}
      <div style={{ position: "absolute", left: "-9999px", top: 0, opacity: 0, pointerEvents: "none" }}>
          {items.map((it, idx) => (
             <div 
                key={idx} 
                ref={el => cardRefs.current[idx] = el}
                style={{ 
                    width: "1080px", 
                    height: "1920px", 
                    background: "#0a0a0f",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    padding: "80px",
                    fontFamily: "sans-serif"
                }}
             >
                {/* Background Decor */}
                <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "50%", height: "40%", background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)", filter: "blur(80px)" }} />
                <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "50%", height: "40%", background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)", filter: "blur(80px)" }} />
                
                {/* Logo Area */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "120px" }}>
                   <div style={{ width: "120px", height: "120px", background: "linear-gradient(135deg, #6366f1, #a855f7)", borderRadius: "30px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "70px", fontWeight: "bold", marginBottom: "30px" }}>B</div>
                   <div style={{ fontSize: "50px", fontWeight: 900, color: "white", letterSpacing: "10px" }}>BAC EXCELLENCE</div>
                   <div style={{ fontSize: "24px", color: "#6366f1", fontWeight: 700, marginTop: "10px" }}>ELITE PREP / 2026</div>
                </div>

                {/* Slogans */}
                <div style={{ textAlign: "center", marginBottom: "150px" }}>
                   <div style={{ fontSize: "32px", color: "rgba(255,255,255,0.9)", fontWeight: 600, marginBottom: "20px" }}>The first AI platform in Tunisia for languages</div>
                   <div style={{ fontSize: "40px", color: "white", fontWeight: "bold" }}>أول منصة ذكاء اصطناعي في تونس للغات</div>
                </div>

                {/* Main Content Card */}
                <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "2px solid rgba(255,255,255,0.1)", borderRadius: "60px", padding: "80px", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center", backdropFilter: "blur(20px)" }}>
                   <div style={{ fontSize: "40px", color: "#f59e0b", fontWeight: 900, textTransform: "uppercase", marginBottom: "40px", letterSpacing: "4px" }}>{it.hook}</div>
                   <div style={{ fontSize: "72px", color: "white", fontWeight: 900, lineHeight: 1.1, marginBottom: "40px" }}>{it.title}</div>
                   <div style={{ fontSize: "36px", color: "rgba(255,255,255,0.8)", lineHeight: 1.5, marginBottom: "60px" }}>{it.body}</div>
                   <div style={{ marginTop: "auto", display: "inline-block", alignSelf: "center", background: "#6366f1", color: "white", padding: "30px 60px", borderRadius: "100px", fontSize: "32px", fontWeight: 900 }}>{it.cta}</div>
                </div>

                {/* Footer Watermark */}
                <div style={{ marginTop: "80px", textAlign: "center", opacity: 0.3, letterSpacing: "10px", color: "white", fontSize: "20px", fontWeight: 800 }}>@BACEXCELLENCE</div>
             </div>
          ))}
      </div>

      <style jsx>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .row-center { display: flex; align-items: center; justify-content: center; }
      `}</style>
    </div>
  );
}
