"use client";

import { useState, useRef, useEffect } from "react";
import { Table, Sparkles, Video, FileSpreadsheet, Loader2, Image as ImageIcon, Box, Film, AlertCircle } from "lucide-react";
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
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  const [isForging, setIsForging] = useState(false);
  const [forgeProgress, setForgeProgress] = useState(0);
  const [forgeIndex, setForgeIndex] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const [brandOverlay, setBrandOverlay] = useState<string | null>(null);
  const brandRef = useRef<HTMLDivElement>(null);

  // 1. SURPRISE ME
  function handleSurpriseMe() {
    const richTopics: Record<string, string[]> = {
      ENGLISH: ["Passive Voice Mastery", "Inversion Hacks (Never/Seldom)", "Conditional Type 3 & Regrets", "Essay Connectors (Elite)", "Phrasal Verbs for BAC", "Brain Drain Vocabulary", "Technology & Human Rights", "Formal Letter Structures", "Sustainable Development Lexicon", "Reported Speech Precision"],
      FRENCH:  ["Le Subjonctif (Usage Avancé)", "La Voix Passive en Français", "Les Connecteurs Logiques (Dissertation)", "La Nominalisation (Style)", "L'Immigration et l'Identité", "La Mondialisation et son Impact", "Le Discours Indirect", "Le Conditionnel Passe & Regrets", "Vocabulaire de l'Environnement", "Analyse de Texte: Outils Stylistiques"],
      ARABIC:  ["النحو: الجملة الحجاجية", "البلاغة: الاستعارة والتشبيه", "تحليل المقال الأدبي", "أدوات الربط والانسجام", "قضية الهوية والتحول", "الفعل المبني للمجهول", "المنهجية في التلخيص", "مصطلحات حقوق الإنسان", "الأدب التونسي الحديث", "الأساليب الإنشائية"],
      ITALIAN: ["Il Congiuntivo (Presente/Passato)", "La Voce Passiva in Italiano", "I Connettivi Logici", "L'Ambiente e la Sostenibilità", "La Tecnologia nel Futuro", "Il Bel Paese: Cultura e Tradizione"],
      SPANISH: ["El Subjuntivo (Presente/Pasado)", "La Voz Pasiva en Español", "Los Conectores de Discurso", "El Medio Ambiente", "La Juventud y el Empleo", "La Cultura Hispana"],
      GERMAN:  ["Der Konjunktiv II", "Das Passiv (Vorgang/Zustand)", "Relativsätze & Nebensätze", "Umwelt & Nachhaltigkeit", "Technik & Innovation", "Arbeit & Beruf"],
      RUSSIAN: ["Виды глагола", "Падежи (Система 6 падежей)", "Причастиيا и деепричастиيا", "Экология и природа", "Наука и технологии"],
      CHINESE: ["把/البتة (Ba/Bei)", "补语用法 (Result/Direction)", "连词与复杂句", "环境保护", "科技与生活"]
    };
    const list = richTopics[language] || richTopics["ENGLISH"];
    setTopic(list[Math.floor(Math.random() * list.length)]);
  }

  // Pre-render branding
  useEffect(() => {
    if (brandRef.current) {
      toPng(brandRef.current, { pixelRatio: 2, cacheBust: true })
        .then(dataUrl => setBrandOverlay(dataUrl))
        .catch(err => console.error("Branding error", err));
    }
  }, []);

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
      cardRefs.current = new Array(data.items.length).fill(null);
    } catch (err: any) { alert(err.message); }
    finally { setLoading(false); }
  }

  // 3. IMAGE PACK
  async function forgeCardPack() {
    if (items.length === 0) return;
    setIsForging(true); setForgeProgress(0);
    const zip = new JSZip(); const folder = zip.folder(`bac-excellence-images`);
    for (let i = 0; i < items.length; i++) {
        const ref = cardRefs.current[i]; if (!ref) continue;
        try {
            await new Promise(r => setTimeout(r, 100));
            const dataUrl = await toPng(ref, { pixelRatio: 2, cacheBust: true });
            folder?.file(`card-${i + 1}.png`, dataUrl.split(",")[1], { base64: true });
            setForgeProgress(Math.round(((i + 1) / items.length) * 100));
        } catch (e) { console.error(e); }
    }
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `bac-excellence-images.zip`);
    setIsForging(false); setForgeProgress(0);
  }

  // 4. VIDEO PACK
  async function forgeVideoPack() {
    if (items.length === 0 || !canvasRef.current) return;
    setIsForging(true); setForgeProgress(0);
    const zip = new JSZip(); const folder = zip.folder(`bac-excellence-videos`);
    
    for (let i = 0; i < items.length; i++) {
        setForgeIndex(i);
        setForgeProgress(Math.round((i / items.length) * 100));
        await new Promise(r => setTimeout(r, 400));
        
        const stream = canvasRef.current.captureStream(60);
        const rec = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });
        const chunks: Blob[] = [];
        rec.ondataavailable = (e) => chunks.push(e.data);
        
        const recordingPromise = new Promise<void>((resolve) => {
            rec.onstop = () => {
                const blob = new Blob(chunks, { type: "video/webm" });
                folder?.file(`video-${i + 1}.webm`, blob);
                resolve();
            };
        });
        
        rec.start();
        await new Promise(r => setTimeout(r, 6000));
        rec.stop();
        await recordingPromise;
    }
    
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `bac-excellence-video-pack.zip`);
    setIsForging(false); setForgeProgress(0); setForgeIndex(null);
  }

  // Helper for text wrapping in Canvas
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
    const words = text.split(" ");
    const lines = [];
    let currentLine = words[0];
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  // 5. VIDEO ENGINE (Elite Re-design for 9:16 Social Ratios)
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let overlayImg: HTMLImageElement | null = null;
    if (brandOverlay) {
        overlayImg = new Image();
        overlayImg.src = brandOverlay;
    }

    let frame = 0;
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: Math.random() * 0.4 + 0.2,
      r: Math.random() * 2 + 1
    }));

    const render = () => {
      frame++;
      const time = frame * 0.01;
      
      // BACKGROUND
      ctx.fillStyle = "#010206"; ctx.fillRect(0, 0, canvas.width, canvas.height);

      // ANIMATED ORBS
      const orbs = [
        { x: canvas.width * 0.2 + Math.cos(time * 0.5) * 150, y: canvas.height * 0.2 + Math.sin(time * 0.6) * 200, c: "#4f46e5", s: 900, o: 0.15 },
        { x: canvas.width * 0.8 + Math.sin(time * 0.4) * 120, y: canvas.height * 0.5 + Math.cos(time * 0.7) * 250, c: "#7c3aed", s: 800, o: 0.12 },
        { x: canvas.width * 0.5, y: canvas.height * 0.8 + Math.sin(time * 0.3) * 150, c: "#10b981", s: 700, o: 0.1 }
      ];

      ctx.save(); ctx.globalCompositeOperation = "screen";
      orbs.forEach(orb => {
          const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.s);
          g.addColorStop(0, orb.c); g.addColorStop(1, "transparent");
          ctx.globalAlpha = orb.o; ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);
      });
      ctx.restore();

      // CYBER GRID
      ctx.strokeStyle = "rgba(99, 102, 241, 0.04)"; ctx.lineWidth = 1;
      const gS = 120; const gO = (frame * 1.2) % gS;
      for (let x = gO; x < canvas.width; x += gS) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
      for (let y = gO; y < canvas.height; y += gS) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }

      // FLOATING DUST
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      particles.forEach(p => { 
        p.y -= p.vy; p.x += p.vx; 
        if (p.y < -20) p.y = canvas.height + 20; 
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); 
      });

      // BRANDING UNDERLAY (PRE-RENDERED)
      if (overlayImg && overlayImg.complete) {
          ctx.drawImage(overlayImg, 0, 0, canvas.width, canvas.height);
      }

      // CONTENT AREA (Safety-First Design for Social Reels)
      const active = forgeIndex !== null ? items[forgeIndex] : null;
      if (active || topic) {
          ctx.save();
          const midX = canvas.width / 2;
          const midY = canvas.height / 2 + 100; // Shifted down to avoid branding
          const maxTextW = canvas.width - 240; // Wide safety margin
          
          // ANIMATED GLASS BOX
          const float = Math.sin(time * 2) * 20;
          ctx.translate(0, float);
          
          // Glowing Box Background
          ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; 
          ctx.beginPath(); ctx.roundRect(100, midY - 300, canvas.width - 200, 750, 60); ctx.fill();
          ctx.strokeStyle = "rgba(99, 102, 241, 0.2)"; ctx.lineWidth = 3; ctx.stroke();
          
          // 1. HOOK (Label)
          ctx.textAlign = "center";
          ctx.font = "900 38px sans-serif";
          ctx.fillStyle = "#fbbf24"; ctx.letterSpacing = "10px";
          ctx.fillText(active?.hook.toUpperCase() || "ELITE MASTERY", midX, midY - 200);
          
          // 2. TITLE (Wrapped)
          ctx.font = "900 74px sans-serif";
          ctx.fillStyle = "white";
          const title = active?.title || topic || "TOPIC";
          const titleLines = wrapText(ctx, title, maxTextW);
          titleLines.forEach((l, i) => ctx.fillText(l, midX, midY - 60 + (i * 90)));

          // 3. BODY (Wrapped)
          if (active) {
              const bodyY = midY - 60 + (titleLines.length * 90) + 40;
              ctx.font = "500 36px sans-serif";
              ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
              const bodyLines = wrapText(ctx, active.body, maxTextW);
              bodyLines.forEach((l, i) => ctx.fillText(l, midX, bodyY + (i * 50)));
              
              // 4. CTA (Animated Pill)
              const ctaY = bodyY + (bodyLines.length * 50) + 80;
              ctx.fillStyle = "#4f46e5";
              const ctaW = ctx.measureText(active.cta).width + 120;
              ctx.beginPath(); ctx.roundRect(midX - ctaW/2, ctaY - 50, ctaW, 100, 50); ctx.fill();
              ctx.fillStyle = "white"; ctx.font = "bold 38px sans-serif";
              ctx.fillText(active.cta, midX, ctaY + 15);
          }
          ctx.restore();
      }

      // FINAL VIGNETTE
      const v = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width);
      v.addColorStop(0, "transparent"); v.addColorStop(1, "rgba(0,0,0,0.8)");
      ctx.fillStyle = v; ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [topic, forgeIndex, items, brandOverlay]);

  return (
    <div className="stack" style={{ gap: "40px", padding: "40px 0" }}>
      
      <div style={{ position: "absolute", left: "-9999px", top: 0, opacity: 0, pointerEvents: "none" }}>
          <div ref={brandRef} style={{ width: "1080px", height: "1920px", background: "transparent", fontFamily: "sans-serif" }}>
             <div style={{ position: "absolute", top: "180px", left: 0, right: 0, textAlign: "center" }}>
                <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
                   <div style={{ width: "130px", height: "130px", background: "linear-gradient(135deg, #6366f1, #a855f7)", borderRadius: "34px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "74px", fontWeight: "900", marginBottom: "30px", boxShadow: "0 20px 50px rgba(99,102,241,0.6)" }}>B</div>
                   <div style={{ fontSize: "54px", fontWeight: "900", color: "white", letterSpacing: "14px", textShadow: "0 0 20px rgba(255,255,255,0.4)" }}>BAC EXCELLENCE</div>
                   <div style={{ marginTop: "50px", display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div style={{ fontSize: "32px", color: "rgba(255,255,255,0.8)", fontWeight: "600" }}>The first AI platform in Tunisia for languages</div>
                      <div style={{ fontSize: "46px", color: "white", fontWeight: "900", marginTop: "10px" }}>أول منصة ذكاء اصطناعي في تونس للغات</div>
                   </div>
                </div>
             </div>
             <div style={{ position: "absolute", bottom: "140px", left: 0, right: 0, textAlign: "center", opacity: 0.15, color: "white", fontSize: "28px", letterSpacing: "14px", fontWeight: "900" }}>@BACEXCELLENCE</div>
          </div>
      </div>

      <header className="card row-between" style={{ padding: "40px", border: "1px solid var(--primary)", background: "rgba(99, 102, 241, 0.03)" }}>
        <div className="stack" style={{ gap: "12px" }}>
           <span className="eyebrow" style={{ color: "var(--primary)" }}>AI Reels Factory — V3.0 (SAFE ZONE)</span>
           <h2 className="section-title" style={{ fontSize: "2.5rem" }}>Ratio Fix: Professional Auto-Video.</h2>
           <p className="muted">The system now automatically wraps text and respects social media safe zones.</p>
        </div>
        <div className="row" style={{ gap: "20px" }}>
           <button onClick={handleSurpriseMe} className="button-secondary">🎲 SURPRISE ME</button>
           <Sparkles size={48} color="var(--primary)" style={{ opacity: 0.3 }} />
        </div>
      </header>

      <div className="grid grid-cols-[1fr,400px] gap-40">
        <div className="stack" style={{ gap: "32px" }}>
          <form className="card row" onSubmit={handleGenerate} style={{ gap: "20px", padding: "24px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--glass-border)" }}>
            <div className="stack" style={{ flex: 1, gap: "8px" }}>
              <span className="eyebrow" style={{ fontSize: "10px" }}>Topic</span>
              <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic..." style={{ padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", color: "white" }} />
            </div>
            <div className="stack" style={{ width: "160px", gap: "8px" }}>
               <span className="eyebrow" style={{ fontSize: "10px" }}>Language</span>
               <select value={language} onChange={e => setLanguage(e.target.value)} style={{ padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", color: "white" }}>
                  {["ENGLISH", "FRENCH", "ARABIC", "ITALIAN", "SPANISH", "GERMAN", "RUSSIAN", "CHINESE"].map(l => <option key={l} value={l}>{l}</option>)}
               </select>
            </div>
            <button disabled={loading} className="button-primary" style={{ alignSelf: "flex-end", height: "48px", minWidth: "160px" }}>
              {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />} {loading ? "Analyzing..." : "Generate AI Data"}
            </button>
          </form>

          {items.length > 0 && (
            <div className="stack" style={{ gap: "24px" }}>
              <div className="card row-between" style={{ padding: "24px", border: "1px solid var(--accent)", background: "rgba(245, 158, 11, 0.05)" }}>
                  <div className="stack" style={{ gap: "4px" }}>
                      <strong style={{ fontSize: "1.2rem", color: "var(--accent)" }}>Safe Mode Render</strong>
                      <p className="muted" style={{ fontSize: "12px" }}>These items will be auto-wrapped to fit vertical social media ratios.</p>
                  </div>
                  <div className="row" style={{ gap: "12px" }}>
                      <button onClick={forgeCardPack} disabled={isForging} className="button-secondary">STATIC PACK</button>
                      <button onClick={forgeVideoPack} disabled={isForging} style={{ background: "white", color: "black", border: "none", padding: "12px 24px", borderRadius: "12px", fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                        {isForging ? <Loader2 className="animate-spin" size={16} /> : <Film size={16} />}
                        {isForging ? `Forging ${forgeProgress}%` : "REELS VIDEO PACK (.zip)"}
                      </button>
                  </div>
              </div>
            </div>
          )}
        </div>

        <div className="stack" style={{ gap: "24px", position: "sticky", top: "40px" }}>
           <div className="card stack" style={{ padding: "32px", gap: "24px", background: "rgba(0,0,0,0.5)", border: "1px solid var(--accent)" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 900 }}>🎬 Reel Preview (9:16)</h3>
              <div style={{ width: "270px", height: "480px", margin: "0 auto", borderRadius: "24px", border: "4px solid #333", position: "relative", overflow: "hidden", background: "#000" }}>
                <canvas ref={canvasRef} width={1080} height={1920} style={{ width: "100%", height: "100%", display: "block" }} />
                {isForging && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", zIndex: 20 }}>
                    <Loader2 className="animate-spin" size={40} color="var(--accent)" />
                    <strong style={{ color: "white" }}>{forgeIndex !== null ? `Forging Reel ${forgeIndex+1}/${items.length}` : "Preparing..."}</strong>
                    <span style={{ color: "var(--accent)" }}>{forgeProgress}%</span>
                </div>}
              </div>
           </div>
        </div>
      </div>

      <div style={{ position: "absolute", left: "-9999px", top: 0, opacity: 0, pointerEvents: "none" }}>
          {items.map((it, idx) => (
             <div key={idx} ref={el => { cardRefs.current[idx] = el; }} style={{ width: "1080px", height: "1920px", background: "#0a0b12", position: "relative", display: "flex", flexDirection: "column", padding: "100px", fontFamily: "sans-serif" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "120px" }}>
                   <div style={{ width: "130px", height: "130px", background: "linear-gradient(135deg, #6366f1, #a855f7)", borderRadius: "34px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "74px", fontWeight: "900", marginBottom: "30px" }}>B</div>
                   <div style={{ fontSize: "54px", fontWeight: "900", color: "white", letterSpacing: "14px" }}>BAC EXCELLENCE</div>
                   <div style={{ marginTop: "50px", textAlign: "center" }}>
                      <div style={{ fontSize: "32px", color: "rgba(255,255,255,0.8)", fontWeight: "600", marginBottom: "15px" }}>The first AI platform in Tunisia for languages</div>
                      <div style={{ fontSize: "46px", color: "white", fontWeight: "900" }}>أول منصة ذكاء اصطناعي في تونس للغات</div>
                   </div>
                </div>
                <div style={{ flex: 1, marginTop: "80px", background: "rgba(255,255,255,0.03)", border: "2px solid rgba(255,255,255,0.1)", borderRadius: "60px", padding: "80px", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
                   <div style={{ fontSize: "44px", color: "#fbbf24", fontWeight: 900, marginBottom: "40px" }}>{it.hook}</div>
                   <div style={{ fontSize: "78px", color: "white", fontWeight: 900, lineHeight: 1.1, marginBottom: "40px" }}>{it.title}</div>
                   <div style={{ fontSize: "38px", color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>{it.body}</div>
                   <div style={{ marginTop: "auto", alignSelf: "center", background: "#4f46e5", color: "white", padding: "40px 100px", borderRadius: "100px", fontSize: "40px", fontWeight: 900 }}>{it.cta}</div>
                </div>
             </div>
          ))}
      </div>

      <style jsx>{` .animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } `}</style>
    </div>
  );
}
