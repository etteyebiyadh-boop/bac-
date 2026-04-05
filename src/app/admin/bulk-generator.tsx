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
  
  // Video Tools State
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  // Bulk Export State
  const [isForging, setIsForging] = useState(false);
  const [forgeProgress, setForgeProgress] = useState(0);
  const [forgeIndex, setForgeIndex] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Branding Pre-render
  const [brandOverlay, setBrandOverlay] = useState<string | null>(null);
  const brandRef = useRef<HTMLDivElement>(null);

  // 1. SURPRISE ME (Random Rich Topics)
  function handleSurpriseMe() {
    const richTopics: Record<string, string[]> = {
      ENGLISH: ["Passive Voice Mastery", "Inversion Hacks (Never/Seldom)", "Conditional Type 3 & Regrets", "Essay Connectors (Elite)", "Phrasal Verbs for BAC", "Brain Drain Vocabulary", "Technology & Human Rights", "Formal Letter Structures", "Sustainable Development Lexicon", "Reported Speech Precision"],
      FRENCH:  ["Le Subjonctif (Usage Avancé)", "La Voix Passive en Français", "Les Connecteurs Logiques (Dissertation)", "La Nominalisation (Style)", "L'Immigration et l'Identité", "La Mondialisation et son Impact", "Le Discours Indirect", "Le Conditionnel Passe & Regrets", "Vocabulaire de l'Environnement", "Analyse de Texte: Outils Stylistiques"],
      ARABIC:  ["النحو: الجملة الحجاجية", "البلاغة: الاستعارة والتشبيه", "تحليل المقال الأدبي", "أدوات الربط والانسجام", "قضية الهوية والتحول", "الفعل المبني للمجهول", "المنهجية في التلخيص", "مصطلحات حقوق الإنسان", "الأدب التونسي الحديث", "الأساليب الإنشائية"],
      ITALIAN: ["Il Congiuntivo (Presente/Passato)", "La Voce Passiva in Italiano", "I Connettivi Logici", "L'Ambiente e la Sostenibilità", "La Tecnologia nel Futuro", "Il Bel Paese: Cultura e Tradizione"],
      SPANISH: ["El Subjuntivo (Presente/Pasado)", "La Voz Pasiva en Español", "Los Conectores de Discurso", "El Medio Ambiente", "La Juventud y el Empleo", "La Cultura Hispana"],
      GERMAN:  ["Der Konjunktiv II", "Das Passiv (Vorgang/Zustand)", "Relativsätze & Nebensätze", "Umwelt & Nachhaltigkeit", "Technik & Innovation", "Arbeit & Beruf"],
      RUSSIAN: ["Виды глагола", "Падежи (Система 6 падежей)", "Причастиያ и деепричастия", "Экология и природа", "Наука и технологии"],
      CHINESE: ["把/被字句 (Ba/Bei)", "补语用法 (Result/Direction)", "连词与复杂句", "环境保护", "科技与生活"]
    };
    const list = richTopics[language] || richTopics["ENGLISH"];
    setTopic(list[Math.floor(Math.random() * list.length)]);
  }

  // Effect to pre-render the branding overlay as a PNG for perfect Arabic/Type rendering
  useEffect(() => {
    if (brandRef.current) {
      toPng(brandRef.current, { pixelRatio: 2, cacheBust: true })
        .then(dataUrl => setBrandOverlay(dataUrl))
        .catch(err => console.error("Branding render failed", err));
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
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  // 3. NATIVE BULK IMAGE EXPORT
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

  // 4. FORGE VIDEO PACK
  async function forgeVideoPack() {
    if (items.length === 0 || !canvasRef.current) return;
    setIsForging(true); setForgeProgress(0);
    const zip = new JSZip(); const folder = zip.folder(`bac-excellence-videos`);
    
    for (let i = 0; i < items.length; i++) {
        setForgeIndex(i);
        setForgeProgress(Math.round((i / items.length) * 100));
        await new Promise(r => setTimeout(r, 300));
        
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
        await new Promise(r => setTimeout(r, 5000));
        rec.stop();
        await recordingPromise;
    }
    
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `bac-excellence-video-pack.zip`);
    setIsForging(false); setForgeProgress(0); setForgeIndex(null);
  }

  // 5. VIDEO ENGINE (Elite Design Upgrade)
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Load branding image if available
    let overlayImg: HTMLImageElement | null = null;
    if (brandOverlay) {
        overlayImg = new Image();
        overlayImg.src = brandOverlay;
    }

    let frame = 0;
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      v: Math.random() * 0.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.2
    }));

    const render = () => {
      frame++;
      const time = frame * 0.01;
      
      // 1. DEEP CINEMATIC BACKGROUND
      ctx.fillStyle = "#02040a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. ANIMATED GRADIENT ORBS (Pulse + Move)
      const orbs = [
        { x: canvas.width * 0.3 + Math.cos(time * 0.5) * 200, y: canvas.height * 0.3 + Math.sin(time * 0.6) * 300, c: "#4f46e5", s: 800, o: 0.15 },
        { x: canvas.width * 0.7 + Math.sin(time * 0.4) * 250, y: canvas.height * 0.6 + Math.cos(time * 0.5) * 200, c: "#7c3aed", s: 700, o: 0.12 },
        { x: canvas.width * 0.5, y: canvas.height * 0.9 + Math.sin(time) * 100, c: "#f59e0b", s: 600, o: 0.08 }
      ];

      ctx.save();
      ctx.globalCompositeOperation = "screen";
      orbs.forEach(orb => {
          const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.s);
          g.addColorStop(0, orb.c);
          g.addColorStop(1, "transparent");
          ctx.globalAlpha = orb.o;
          ctx.fillStyle = g;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
      });
      ctx.restore();

      // 3. PERSPECTIVE GRID (Cyberpunk feel)
      ctx.strokeStyle = "rgba(99, 102, 241, 0.05)";
      ctx.lineWidth = 1;
      const spacing = 100;
      const shift = (frame * 2) % spacing;
      
      for (let i = shift; i < canvas.width; i += spacing) {
          ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      }
      for (let i = shift; i < canvas.height; i += spacing) {
          ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
      }

      // 4. PARTICLES (Floating Dust)
      ctx.fillStyle = "white";
      particles.forEach(p => {
          p.y -= p.v;
          if (p.y < -20) p.y = canvas.height + 20;
          ctx.globalAlpha = p.opacity;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;

      // 5. BRANDING OVERLAY (Perfectly joined Arabic from HTML)
      if (overlayImg && overlayImg.complete) {
          ctx.drawImage(overlayImg, 0, 0, canvas.width, canvas.height);
      }

      // 6. LOGO PULSE / RING DYNAMICS
      const lX = canvas.width / 2;
      const lY = 220; // Lowered a bit
      ctx.save();
      const pulse = Math.sin(time * 4) * 10;
      ctx.strokeStyle = "rgba(99, 102, 241, 0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(lX, lY, 130 + pulse, time * 2, time * 2 + Math.PI * 0.8);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(lX, lY, 130 + pulse, time * 2 + Math.PI, time * 2 + Math.PI * 1.8);
      ctx.stroke();
      ctx.restore();

      // 7. CONTENT RENDERER
      const active = forgeIndex !== null ? items[forgeIndex] : null;
      if (active || topic) {
          ctx.save();
          const cardY = canvas.height / 2;
          
          // Floating Glass Card
          const cardFloat = Math.sin(time * 2) * 15;
          ctx.translate(0, cardFloat);
          
          ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
          ctx.beginPath(); ctx.roundRect(120, cardY - 200, canvas.width - 240, 600, 60); ctx.fill();
          ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"; ctx.lineWidth = 2; ctx.stroke();
          
          // HOOK (Yellow Elite Label)
          ctx.textAlign = "center";
          ctx.font = "900 42px sans-serif";
          ctx.fillStyle = "#f59e0b";
          ctx.letterSpacing = "6px";
          ctx.fillText(active?.hook.toUpperCase() || "ELITE INSIGHT", lX, cardY - 50);
          
          // TITLE (Large White Bold)
          ctx.font = "bold 80px sans-serif";
          ctx.fillStyle = "white";
          const titleText = active?.title || topic || "TOPIC";
          
          // Wrap Title
          const words = titleText.split(" ");
          if (words.length > 3) {
             ctx.fillText(words.slice(0, 3).join(" "), lX, cardY + 80);
             ctx.fillText(words.slice(3).join(" "), lX, cardY + 180);
          } else {
             ctx.fillText(titleText, lX, cardY + 120);
          }
          
          // BODY (High-Glow Text)
          if (active) {
              ctx.font = "500 32px sans-serif";
              ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
              const bodyWords = active.body.split(" ");
              ctx.fillText(bodyWords.slice(0, 7).join(" "), lX, cardY + 300);
              ctx.fillText(bodyWords.slice(7).join(" "), lX, cardY + 360);
          }
          ctx.restore();
      }

      // 8. FINAL TOUCH: VIGNETTE
      const vig = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width);
      vig.addColorStop(0, "transparent");
      vig.addColorStop(1, "rgba(0,0,0,0.6)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [topic, forgeIndex, items, brandOverlay]);

  return (
    <div className="stack" style={{ gap: "40px", padding: "40px 0" }}>
      
      {/* 1. HIDDEN BRAND RENDERER: We use this to capture perfect Arabic/Typography as an image for the canvas */}
      <div style={{ position: "absolute", left: "-9999px", top: 0, opacity: 0, pointerEvents: "none" }}>
          <div ref={brandRef} style={{ width: "1080px", height: "1920px", position: "relative", fontFamily: "sans-serif" }}>
             <div style={{ position: "absolute", top: "220px", left: 0, right: 0, textAlign: "center" }}>
                <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
                   {/* Logo Box */}
                   <div style={{ width: "120px", height: "120px", background: "linear-gradient(135deg, #6366f1, #a855f7)", borderRadius: "34px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "74px", fontWeight: "900", marginBottom: "40px", boxShadow: "0 20px 40px rgba(99,102,241,0.5)" }}>B</div>
                   <div style={{ fontSize: "52px", fontWeight: "900", color: "white", letterSpacing: "14px", textShadow: "0 0 20px rgba(255,255,255,0.3)" }}>BAC EXCELLENCE</div>
                   <div style={{ fontSize: "24px", color: "#6366f1", fontWeight: "800", marginTop: "16px", letterSpacing: "4px" }}>ELITE PREP / 2026</div>
                   
                   {/* Slogans with perfect Arabic shaping */}
                   <div style={{ marginTop: "60px", stack: "stack", gap: "16px" }}>
                      <div style={{ fontSize: "32px", color: "rgba(255,255,255,0.9)", fontWeight: "600" }}>The first AI platform in Tunisia for languages</div>
                      <div style={{ fontSize: "44px", color: "white", fontWeight: "900", marginTop: "15px" }}>أول منصة ذكاء اصطناعي في تونس للغات</div>
                   </div>
                </div>
             </div>
             
             {/* Bottom Watermark */}
             <div style={{ position: "absolute", bottom: "100px", left: 0, right: 0, textAlign: "center", opacity: 0.2, color: "white", fontSize: "24px", letterSpacing: "10px", fontWeight: "900" }}>@BACEXCELLENCE</div>
          </div>
      </div>

      {/* HEADER */}
      <header className="card row-between" style={{ padding: "40px", border: "1px solid var(--primary)", background: "rgba(99, 102, 241, 0.03)" }}>
        <div className="stack" style={{ gap: "12px" }}>
           <span className="eyebrow" style={{ color: "var(--primary)" }}>AI Content Automator — Elite Forge 2.5</span>
           <h2 className="section-title" style={{ fontSize: "2.5rem" }}>Branded Viral content Engine.</h2>
           <p className="muted">Generate high-volume social content and premium video assets with AI precision.</p>
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
              <span className="eyebrow" style={{ fontSize: "10px" }}>Topic / Skill</span>
              <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic..." style={{ padding: "12px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)", color: "white" }} />
            </div>
            <div className="stack" style={{ width: "160px", gap: "8px" }}>
               <span className="eyebrow" style={{ fontSize: "10px" }}>Language</span>
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
              <div className="card row-between" style={{ padding: "24px", border: "1px solid var(--accent)", background: "rgba(245, 158, 11, 0.05)" }}>
                  <div className="stack" style={{ gap: "4px" }}>
                      <strong style={{ fontSize: "1.2rem", color: "var(--accent)" }}>Automated Pack Forge</strong>
                      <p className="muted" style={{ fontSize: "12px" }}>Render 30+ items into premium video & image packs instantly.</p>
                  </div>
                  <div className="row" style={{ gap: "12px" }}>
                      <button onClick={forgeCardPack} disabled={isForging} className="button-secondary" style={{ padding: "12px 20px" }}>
                          <ImageIcon size={16} /> IMAGE PACK
                      </button>
                      <button 
                        onClick={forgeVideoPack} 
                        disabled={isForging}
                        style={{ background: "white", color: "black", border: "none", padding: "12px 24px", borderRadius: "12px", fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                      >
                        {isForging ? <Loader2 className="animate-spin" size={16} /> : <Film size={16} />}
                        {isForging ? `Forging ${forgeProgress}%` : "VIDEO PACK (.zip)"}
                      </button>
                  </div>
              </div>
            </div>
          )}

          {/* TABLE PREVIEW */}
          {items.length > 0 && (
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
          )}
        </div>

        <div className="stack" style={{ gap: "24px", position: "sticky", top: "40px" }}>
           <div className="card stack" style={{ padding: "32px", gap: "24px", background: "rgba(0,0,0,0.5)", border: "1px solid var(--accent)" }}>
              <div className="row-between">
                <h3 style={{ fontSize: "1.2rem", fontWeight: 900 }}>🎬 Elite Template</h3>
                <span className="pill" style={{ background: "var(--accent)", color: "black" }}>LIVE</span>
              </div>
              <div style={{ width: "270px", height: "480px", margin: "0 auto", borderRadius: "20px", border: "2px solid rgba(255,255,255,0.1)", position: "relative", overflow: "hidden" }}>
                <canvas ref={canvasRef} width={1080} height={1920} style={{ width: "100%", height: "100%", display: "block" }} />
                {isForging && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", zIndex: 20 }}>
                    <Loader2 className="animate-spin" size={40} color="var(--accent)" />
                    <strong style={{ color: "white" }}>{forgeIndex !== null ? `Forging Video ${forgeIndex+1}/${items.length}` : "Preparing..."}</strong>
                    <span style={{ color: "var(--accent)" }}>{forgeProgress}%</span>
                </div>}
              </div>
              {!brandOverlay && (
                <div className="row" style={{ gap: "8px", color: "var(--primary)", fontSize: "11px" }}>
                   <AlertCircle size={14} /> Synchronizing Branding Overlay...
                </div>
              )}
           </div>
        </div>
      </div>

      {/* HIDDEN RENDERER (For Zip Image Pack Only) */}
      <div style={{ position: "absolute", left: "-9999px", top: 0, opacity: 0, pointerEvents: "none" }}>
          {items.map((it, idx) => (
             <div key={idx} ref={el => cardRefs.current[idx] = el} style={{ width: "1080px", height: "1920px", background: "#060812", position: "relative", display: "flex", flexDirection: "column", padding: "80px", fontFamily: "sans-serif" }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 30%, rgba(99,102,241,0.1), transparent), radial-gradient(circle at 70% 70%, rgba(168,85,247,0.1), transparent)" }} />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "120px" }}>
                   <div style={{ width: "120px", height: "120px", background: "linear-gradient(135deg, #6366f1, #a855f7)", borderRadius: "34px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "74px", fontWeight: "900", marginBottom: "40px" }}>B</div>
                   <div style={{ fontSize: "52px", fontWeight: "900", color: "white", letterSpacing: "14px" }}>BAC EXCELLENCE</div>
                   <div style={{ fontSize: "24px", color: "#6366f1", fontWeight: "800", marginTop: "16px" }}>ELITE PREP / 2026</div>
                   <div style={{ marginTop: "60px", textAlign: "center" }}>
                      <div style={{ fontSize: "32px", color: "rgba(255,255,255,0.9)", fontWeight: "600", marginBottom: "15px" }}>The first AI platform in Tunisia for languages</div>
                      <div style={{ fontSize: "44px", color: "white", fontWeight: "900" }}>أول منصة ذكاء اصطناعي في تونس للغات</div>
                   </div>
                </div>
                <div style={{ flex: 1, marginTop: "80px", background: "rgba(255,255,255,0.03)", border: "2px solid rgba(255,255,255,0.1)", borderRadius: "60px", padding: "80px", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
                   <div style={{ fontSize: "42px", color: "#f59e0b", fontWeight: 900, marginBottom: "40px" }}>{it.hook}</div>
                   <div style={{ fontSize: "76px", color: "white", fontWeight: 900, lineHeight: 1.1, marginBottom: "40px" }}>{it.title}</div>
                   <div style={{ fontSize: "36px", color: "rgba(255,255,255,0.8)" }}>{it.body}</div>
                   <div style={{ marginTop: "auto", alignSelf: "center", background: "#6366f1", color: "white", padding: "30px 80px", borderRadius: "100px", fontSize: "34px", fontWeight: 900 }}>{it.cta}</div>
                </div>
             </div>
          ))}
      </div>

      <style jsx>{` .animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } `}</style>
    </div>
  );
}
