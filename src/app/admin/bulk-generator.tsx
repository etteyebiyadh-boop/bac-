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
  
  // Video Tools State
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  // 1. SURPRISE ME (Random Rich Topics)
  function handleSurpriseMe() {
    const richTopics: Record<string, string[]> = {
      ENGLISH: ["Passive Voice Mastery", "Inversion Hacks (Never/Seldom)", "Conditional Type 3 & Regrets", "Essay Connectors (Elite)", "Phrasal Verbs for BAC", "Brain Drain Vocabulary", "Technology & Human Rights", "Formal Letter Structures", "Sustainable Development Lexicon", "Reported Speech Precision"],
      FRENCH:  ["Le Subjonctif (Usage Avancé)", "La Voix Passive en Français", "Les Connecteurs Logiques (Dissertation)", "La Nominalisation (Style)", "L'Immigration et l'Identité", "La Mondialisation et son Impact", "Le Discours Indirect", "Le Conditionnel Passe & Regrets", "Vocabulaire de l'Environnement", "Analyse de Texte: Outils Stylistiques"],
      ARABIC:  ["النحو: الجملة الحجاجية", "البلاغة: الاستعارة والتشبيه", "تحليل المقال الأدبي", "أدوات الربط والانسجام", "قضية الهوية والتحول", "الفعل المبني للمجهول", "المنهجية في التلخيص", "مصطلحات حقوق الإنسان", "الأدب التونسي الحديث", "الأساليب الإنشائية"],
      ITALIAN: ["Il Congiuntivo (Presente/Passato)", "La Voce Passiva in Italiano", "I Connettivi Logici", "L'Ambiente e la Sostenibilità", "La Tecnologia nel Futuro", "Il Bel Paese: Cultura e Tradizione"],
      SPANISH: ["El Subjuntivo (Presente/Pasado)", "La Voz Pasiva en Español", "Los Conectores de Discurso", "El Medio Ambiente", "La Juventud y el Empleo", "La Cultura Hispana"],
      GERMAN:  ["Der Konjunktiv II", "Das Passiv (Vorgang/Zustand)", "Relativsätze & Nebensätze", "Umwelt & Nachhaltigkeit", "Technik & Innovation", "Arbeit & Beruf"],
      RUSSIAN: ["Виды глагола", "Падежи (Система 6 падежей)", "Причастия и деепричастия", "Экология и природа", "Наука и технологии"],
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
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  // 3. EXPORT CSV (for Canva Bulk Create)
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

  // 4. VIDEO ENGINE (Enhanced Visuals)
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
      
      // DEEP GRADIENT BG
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, "#05070a");
      grad.addColorStop(0.4, "#0f172a");
      grad.addColorStop(0.7, "#1e1b4b");
      grad.addColorStop(1, "#000000");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ANIMATED GLOW ORBS
      const time = frame * 0.012;
      const orbs = [
        { x: canvas.width * 0.2 + Math.cos(time * 0.7) * 150, y: canvas.height * 0.3 + Math.sin(time * 0.8) * 200, color: "rgba(99, 102, 241, 0.22)", size: 600 },
        { x: canvas.width * 0.8 + Math.sin(time * 0.9) * 120, y: canvas.height * 0.7 + Math.cos(time * 0.6) * 180, color: "rgba(168, 85, 247, 0.18)", size: 500 },
        { x: canvas.width * 0.5 + Math.cos(time * 0.5) * 180, y: canvas.height * 0.5 + Math.sin(time * 0.4) * 250, color: "rgba(245, 158, 11, 0.1)", size: 700 }
      ];

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      orbs.forEach(orb => {
        const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.size);
        g.addColorStop(0, orb.color);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });
      ctx.restore();

      // DYNAMIC GRID LINES
      ctx.strokeStyle = "rgba(99, 102, 241, 0.08)";
      ctx.lineWidth = 1;
      const gridOffset = (frame * 1.5) % 80;
      for (let y = gridOffset; y < canvas.height; y += 80) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
      }
      for (let x = gridOffset; x < canvas.width; x += 80) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
      }

      // FLOATING PARTICLES
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      particles.forEach(p => {
        p.y -= p.v; 
        p.x += Math.sin(frame * 0.03 + p.a) * 0.5;
        if (p.y < -20) p.y = canvas.height + 20;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      });

      // GLASS CARD MARGIN BORDER
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 2;
      ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

      // LOGO: BAC EXCELLENCE (UPGRADED)
      ctx.save();
      const logoX = canvas.width / 2;
      const logoY = 180;
      
      // Revolving Ring
      ctx.strokeStyle = "rgba(99, 102, 241, 0.4)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(logoX, logoY, 110, time * 2, time * 2 + Math.PI * 0.8);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(logoX, logoY, 110, time * 2 + Math.PI, time * 2 + Math.PI * 1.8);
      ctx.stroke();
      
      // Gradient Box for "B"
      const boxSize = 90;
      const bGrad = ctx.createLinearGradient(logoX - 45, logoY - 45, logoX + 45, logoY + 45);
      bGrad.addColorStop(0, "#6366f1");
      bGrad.addColorStop(1, "#a855f7");
      ctx.fillStyle = bGrad;
      ctx.shadowBlur = 40; ctx.shadowColor = "rgba(99,102,241,0.6)";
      ctx.beginPath(); ctx.roundRect(logoX - 45, logoY - 45, boxSize, boxSize, 24); ctx.fill();
      ctx.shadowBlur = 0;
      
      ctx.fillStyle = "white";
      ctx.font = "bold 56px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("B", logoX, logoY);
      
      ctx.font = "900 40px sans-serif"; ctx.letterSpacing = "8px";
      ctx.fillText("BAC EXCELLENCE", logoX, logoY + 105);
      
      ctx.font = "700 18px sans-serif"; ctx.fillStyle = "#6366f1";
      ctx.fillText("ELITE PREP / 2026", logoX, logoY + 140);

      // FIXED BRANDING SENTENCES (TOP)
      const brandingY = logoY + 200;
      ctx.textAlign = "center";
      
      // English
      ctx.font = "600 24px sans-serif"; ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fillText("The first AI platform in Tunisia for languages", canvas.width/2, brandingY);
      
      // Arabic
      ctx.font = "bold 28px sans-serif"; ctx.fillStyle = "white";
      ctx.fillText("أول منصة ذكاء اصطناعي في تونس للغات", canvas.width/2, brandingY + 50);
      ctx.restore();

      // CENTRAL FOCUS AREA
      ctx.save();
      const cardW = canvas.width - 200;
      const cardH = 400;
      ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
      ctx.beginPath(); ctx.roundRect(100, canvas.height/2 - 100, cardW, cardH, 40); ctx.fill();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.stroke();
      
      ctx.fillStyle = "white"; ctx.globalAlpha = (Math.sin(time * 2) + 1.2) / 2.2;
      ctx.font = "900 32px sans-serif";
      ctx.fillText("MASTERING:", canvas.width/2, canvas.height/2);
      ctx.font = "bold 42px sans-serif"; ctx.fillStyle = "#f59e0b";
      ctx.fillText(topic ? topic.toUpperCase() : "SELECT TOPIC", canvas.width/2, canvas.height/2 + 80);
      ctx.restore();

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [topic]);

  // 5. GENERATE VIDEO 
  const generateVideo = async () => {
    if (!canvasRef.current) return;
    setIsRecording(true);
    setRecordProgress(0);
    const canvas = canvasRef.current;
    const stream = canvas.captureStream(60); 
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `bac-excellence-${topic.toLowerCase()}-template.webm`; a.click();
      setIsRecording(false); setRecordProgress(0);
    };
    recorder.start();
    const duration = 7000; const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start; const progress = Math.min(100, (elapsed / duration) * 100);
      setRecordProgress(progress);
      if (elapsed >= duration) { clearInterval(interval); recorder.stop(); }
    }, 100);
  };

  return (
    <div className="stack" style={{ gap: "40px", padding: "40px 0" }}>
      
      {/* HEADER */}
      <header className="card row-between" style={{ padding: "40px", border: "1px solid var(--primary)", background: "rgba(99, 102, 241, 0.03)" }}>
        <div className="stack" style={{ gap: "12px" }}>
           <span className="eyebrow" style={{ color: "var(--primary)" }}>Media Forge — Bulk Engine V2</span>
           <h2 className="section-title" style={{ fontSize: "2.5rem" }}>Branded Viral content Engine.</h2>
           <p className="muted">Generate high-volume social content and premium video assets with AI precision.</p>
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
              <span className="eyebrow" style={{ fontSize: "10px" }}>Topic / Skill</span>
              <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic..." style={{ padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", color: "white" }} />
            </div>
            <div className="stack" style={{ width: "160px", gap: "8px" }}>
               <span className="eyebrow" style={{ fontSize: "10px" }}>Language</span>
               <select value={language} onChange={e => setLanguage(e.target.value)} style={{ padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", color: "white" }}>
                  <option value="ENGLISH">🇬🇧 English</option><option value="FRENCH">🇫🇷 French</option><option value="ARABIC">🇹🇳 Arabic</option>
                  <option value="ITALIAN">🇮🇹 Italian</option><option value="SPANISH">🇪🇸 Spanish</option><option value="GERMAN">🇩🇪 German</option>
                  <option value="RUSSIAN">🇷🇺 Russian</option><option value="CHINESE">🇨🇳 Chinese</option>
               </select>
            </div>
            <button disabled={loading} className="button-primary" style={{ alignSelf: "flex-end", height: "48px", minWidth: "160px" }}>
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />} {loading ? "Forging..." : "Generate Table"}
            </button>
          </form>

          {items.length > 0 && (
            <div className="card stack" style={{ padding: "0", overflow: "hidden", border: "1px solid var(--glass-border)" }}>
              <div className="row-between" style={{ padding: "20px 24px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid var(--glass-border)" }}>
                <h3 className="row" style={{ gap: "10px", fontSize: "1rem", fontWeight: 900 }}><Table size={20} color="var(--primary)" /> CONTENT ({items.length} items)</h3>
                <button onClick={downloadCSV} className="row" style={{ gap: "8px", background: "#22c55e", color: "black", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: 900, fontSize: "12px" }}>
                  <FileSpreadsheet size={16} /> Download CSV
                </button>
              </div>
              <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead style={{ background: "rgba(0,0,0,0.4)", position: "sticky", top: 0 }}>
                    <tr><th style={{ padding: "15px", textAlign: "left" }}>#</th><th style={{ padding: "15px", textAlign: "left" }}>Hook</th><th style={{ padding: "15px", textAlign: "left" }}>Title</th><th style={{ padding: "15px", textAlign: "left" }}>Body</th><th style={{ padding: "15px", textAlign: "left" }}>CTA</th></tr>
                  </thead>
                  <tbody>
                    {items.map((it, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <td style={{ padding: "15px", opacity: 0.4 }}>{i + 1}</td><td style={{ padding: "15px", fontWeight: 700 }}>{it.hook}</td>
                        <td style={{ padding: "15px", color: "var(--primary)" }}>{it.title}</td><td style={{ padding: "15px", opacity: 0.8 }}>{it.body}</td>
                        <td style={{ padding: "15px" }}><span className="pill">{it.cta}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Video Preview */}
        <div className="stack" style={{ gap: "24px", position: "sticky", top: "40px" }}>
           <div className="card stack" style={{ padding: "32px", gap: "24px", background: "rgba(0,0,0,0.5)", border: "1px solid var(--accent)" }}>
              <div className="row-between"><h3 style={{ fontSize: "1.2rem", fontWeight: 900 }}>🎬 Elite Template</h3><span className="pill" style={{ background: "var(--accent)", color: "black" }}>9:16 VERTICAL</span></div>
              <div style={{ width: "270px", height: "480px", margin: "0 auto", borderRadius: "20px", overflow: "hidden", border: "2px solid rgba(255,255,255,0.1)", boxShadow: "0 0 60px rgba(0,0,0,0.5)", position: "relative" }}>
                <canvas ref={canvasRef} width={1080} height={1920} style={{ width: "100%", height: "100%", display: "block" }} />
                {isRecording && (
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", zIndex: 20 }}>
                    <Loader2 className="animate-spin" size={40} color="var(--accent)" />
                    <div className="stack" style={{ alignItems: "center", gap: "8px" }}>
                      <strong style={{ color: "white", fontSize: "16px" }}>FORGING VIDEO...</strong>
                      <span style={{ color: "var(--accent)", fontWeight: 800 }}>{Math.round(recordProgress)}%</span>
                    </div>
                    <div style={{ width: "70%", height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "10px", overflow: "hidden" }}>
                       <div style={{ width: `${recordProgress}%`, height: "100%", background: "var(--accent)", boxShadow: "0 0 20px var(--accent)" }} />
                    </div>
                  </div>
                )}
              </div>
              <div className="stack" style={{ gap: "12px" }}>
                <p className="muted" style={{ fontSize: "11px", textAlign: "center" }}>Premium motion background for direct Canva import.</p>
                <button onClick={generateVideo} disabled={isRecording} className="row-center" style={{ gap: "12px", padding: "16px", borderRadius: "12px", background: isRecording ? "rgba(255,255,255,0.1)" : "white", color: "black", fontWeight: 900, cursor: "pointer", boxShadow: "0 10px 30px rgba(255,255,255,0.1)" }}>
                  {isRecording ? <Square size={18} fill="currentColor" /> : <Video size={18} />} {isRecording ? "Preparing MP4..." : "Export Elite Template (.mp4)"}
                </button>
              </div>
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
