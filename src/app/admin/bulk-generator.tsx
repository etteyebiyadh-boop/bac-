"use client";

import { useState, useRef, useEffect } from "react";
import { Download, Table, Sparkles, Video, FileSpreadsheet, Play, Square, Loader2, Image as ImageIcon, Box, CheckCircle2, Film } from "lucide-react";
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

  // 1. SURPRISE ME (Random Rich Topics)
  function handleSurpriseMe() {
    const richTopics: Record<string, string[]> = {
      ENGLISH: ["Passive Voice Mastery", "Inversion Hacks (Never/Seldom)", "Conditional Type 3 & Regrets", "Essay Connectors (Elite)", "Phrasal Verbs for BAC", "Brain Drain Vocabulary", "Technology & Human Rights", "Formal Letter Structures", "Sustainable Development Lexicon", "Reported Speech Precision"],
      FRENCH:  ["Le Subjonctif (Usage Avancé)", "La Voix Passive en Français", "Les Connecteurs Logiques (Dissertation)", "La Nominalisation (Style)", "L'Immigration et l'Identité", "La Mondialisation et son Impact", "Le Discours Indirect", "Le Conditionnel Passe & Regrets", "Vocabulaire de l'Environnement", "Analyse de Texte: Outils Stylistiques"],
      ARABIC:  ["النحو: الجملة الحجاجية", "البلاغة: الاستعارة والتشبيه", "تحليل المقال الأدبي", "أدوات الربط والانسجام", "قضية الهوية والتحول", "الفعل المبني للمجهول", "المنهجية في التلخيص", "مصطلحات حقوق الإنسان", "الأدب التونسي الحديث", "الأساليب الإنشائية"],
      ITALIAN: ["Il Congiuntivo (Presente/Passato)", "La Voce Passiva in Italiano", "I Connettivi Logici", "L'Ambiente e la Sostenibilità", "La Tecnologia nel Futuro", "Il Bel Paese: Cultura e Traditione"],
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

  // 4. THE ULTIMATE "FORGE VIDEO PACK" (Real-time automation)
  async function forgeVideoPack() {
    if (items.length === 0 || !canvasRef.current) return;
    setIsForging(true);
    setForgeProgress(0);
    
    const zip = new JSZip();
    const folder = zip.folder(`bac-excellence-videos`);
    
    for (let i = 0; i < items.length; i++) {
        setForgeIndex(i);
        setForgeProgress(Math.round((i / items.length) * 100));
        
        // Let the state update and canvas re-render the specific item
        await new Promise(r => setTimeout(r, 200));
        
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
        // Record each for 4 seconds (sweet spot for social reels)
        await new Promise(r => setTimeout(r, 4000));
        rec.stop();
        await recordingPromise;
    }
    
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `bac-excellence-video-pack.zip`);
    
    setIsForging(false);
    setForgeProgress(0);
    setForgeIndex(null);
  }

  // 5. VIDEO ENGINE (Renders background + active item text)
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
      const grOff = (frame * 1.5) % 80;
      for (let y = grOff; y < canvas.height; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
      for (let x = grOff; x < canvas.width; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }

      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      particles.forEach(p => { p.y -= p.v; p.x += Math.sin(frame * 0.03 + p.a) * 0.5; if (p.y < -20) p.y = canvas.height + 20; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); });

      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)"; ctx.lineWidth = 2; ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);

      // Logo & Slogans
      ctx.save(); const lX = canvas.width/2; const lY = 180;
      ctx.strokeStyle = "rgba(99, 102, 241, 0.4)"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(lX, lY, 110, time*2, time*2 + Math.PI*0.8); ctx.stroke();
      ctx.beginPath(); ctx.arc(lX, lY, 110, time*2+Math.PI, time*2+Math.PI*1.8); ctx.stroke();
      const bS = 90; const bG = ctx.createLinearGradient(lX-45, lY-45, lX+45, lY+45); bG.addColorStop(0, "#6366f1"); bG.addColorStop(1, "#a855f7");
      ctx.fillStyle = bG; ctx.shadowBlur = 40; ctx.shadowColor = "rgba(99,102,241,0.6)"; ctx.beginPath(); ctx.roundRect(lX-45, lY-45, bS, bS, 24); ctx.fill();
      ctx.shadowBlur = 0; ctx.fillStyle="white"; ctx.font="bold 56px sans-serif"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText("B", lX, lY);
      ctx.font="900 40px sans-serif"; ctx.letterSpacing="8px"; ctx.fillText("BAC EXCELLENCE", lX, lY+105);
      ctx.font="700 18px sans-serif"; ctx.fillStyle="#6366f1"; ctx.fillText("ELITE PREP / 2026", lX, lY+140);
      const brY = lY+200; ctx.textAlign="center"; ctx.font="600 24px sans-serif"; ctx.fillStyle="rgba(255,255,255,0.9)";
      ctx.fillText("The first AI platform in Tunisia for languages", canvas.width/2, brY);
      ctx.font="bold 28px sans-serif"; ctx.fillStyle="white"; ctx.fillText("أول منصة ذكاء اصطناعي في تونس للغات", canvas.width/2, brY+50);
      ctx.restore();

      // CONTENT DRAWING (If forging or specific topic selected)
      const activeItem = forgeIndex !== null ? items[forgeIndex] : null;
      
      if (activeItem || topic) {
          ctx.save();
          const cardW = canvas.width - 200;
          const cardH = 500;
          const cardY = canvas.height / 2 - 50;
          
          ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
          ctx.beginPath(); ctx.roundRect(100, cardY, cardW, cardH, 40); ctx.fill();
          ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"; ctx.stroke();
          
          // Hook
          ctx.font = "900 36px sans-serif"; ctx.fillStyle = "#f59e0b"; ctx.letterSpacing = "4px";
          ctx.fillText(activeItem?.hook.toUpperCase() || "MASTERING:", lX, cardY + 100);
          
          // Title
          ctx.font = "bold 64px sans-serif"; ctx.fillStyle = "white";
          const title = activeItem?.title || (topic ? topic.toUpperCase() : "SELECT TOPIC");
          
          // Simple multi-line for title
          const words = title.split(" ");
          if (words.length > 3) {
             ctx.fillText(words.slice(0, 3).join(" "), lX, cardY + 200);
             ctx.fillText(words.slice(3).join(" "), lX, cardY + 280);
          } else {
             ctx.fillText(title, lX, cardY + 240);
          }
          
          // Body (if forging)
          if (activeItem) {
              ctx.font = "600 28px sans-serif"; ctx.fillStyle = "rgba(255,255,255,0.7)";
              const bodyWords = activeItem.body.split(" ");
              ctx.fillText(bodyWords.slice(0, 6).join(" "), lX, cardY + 380);
              ctx.fillText(bodyWords.slice(6).join(" "), lX, cardY + 430);
          }
          
          ctx.restore();
      }

      animationRef.current = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animationRef.current);
  }, [topic, forgeIndex, items]);

  return (
    <div className="stack" style={{ gap: "40px", padding: "40px 0" }}>
      
      <header className="card row-between" style={{ padding: "40px", border: "1px solid var(--primary)", background: "rgba(99, 102, 241, 0.03)" }}>
        <div className="stack" style={{ gap: "12px" }}>
           <span className="eyebrow" style={{ color: "var(--primary)" }}>AI Video Factory — Elite Automator</span>
           <h2 className="section-title" style={{ fontSize: "2.5rem" }}>Sack Canva. Automate Viral Videos.</h2>
           <p className="muted">Generate 30+ custom-designed videos & cards instantly with zero manual work.</p>
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
               <span className="eyebrow" style={{ fontSize: "10px" }}>Track</span>
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
                      <strong style={{ fontSize: "1.2rem", color: "var(--accent)" }}>Forge Your Pack</strong>
                      <p className="muted" style={{ fontSize: "12px" }}>Our AI will now render 30 individual videos and cards for you.</p>
                  </div>
                  <div className="row" style={{ gap: "12px" }}>
                      <button onClick={forgeCardPack} disabled={isForging} className="button-secondary" style={{ padding: "12px 20px" }}>
                          <ImageIcon size={16} /> IMAGE PACK (.zip)
                      </button>
                      <button 
                        onClick={forgeVideoPack} 
                        disabled={isForging}
                        style={{ background: "white", color: "black", border: "none", padding: "12px 24px", borderRadius: "12px", fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                      >
                        {isForging ? <Loader2 className="animate-spin" size={16} /> : <Film size={16} />}
                        {isForging ? `Forging ${forgeProgress}%` : "FORGE VIDEO PACK (.zip)"}
                      </button>
                  </div>
              </div>

              {/* HIDDEN Card Renderers (for ZIP cards) */}
              <div style={{ display: "none" }}>
                {items.map((it, idx) => (
                  <div key={idx} ref={el => { cardRefs.current[idx] = el; }} style={{ width: "1080px", height: "1920px", background: "#0a0a0f", position: "relative", display: "flex", flexDirection: "column", padding: "80px" }}>
                    <div style={{ textAlign: "center", marginBottom: "120px" }}>
                       <div style={{ width: "120px", height: "120px", background: "linear-gradient(135deg, #6366f1, #a855f7)", borderRadius: "30px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "70px", margin: "0 auto 30px" }}>B</div>
                       <div style={{ fontSize: "50px", fontWeight: 900, color: "white", letterSpacing: "10px" }}>BAC EXCELLENCE</div>
                    </div>
                    <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "2px solid rgba(255,255,255,0.1)", borderRadius: "60px", padding: "80px", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center" }}>
                       <div style={{ fontSize: "40px", color: "#f59e0b", fontWeight: 900, marginBottom: "40px" }}>{it.hook}</div>
                       <div style={{ fontSize: "72px", color: "white", fontWeight: 900, lineHeight: 1.1, marginBottom: "40px" }}>{it.title}</div>
                       <div style={{ fontSize: "36px", color: "rgba(255,255,255,0.8)" }}>{it.body}</div>
                    </div>
                  </div>
                ))}
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
              <div style={{ width: "270px", height: "480px", margin: "0 auto", borderRadius: "20px", overflow: "hidden", border: "2px solid rgba(255,255,255,0.1)", position: "relative" }}>
                <canvas ref={canvasRef} width={1080} height={1920} style={{ width: "100%", height: "100%", display: "block" }} />
                {isForging && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", zIndex: 20 }}>
                    <Loader2 className="animate-spin" size={40} color="var(--accent)" />
                    <strong style={{ color: "white" }}>{forgeIndex !== null ? `Forging Video ${forgeIndex+1}/${items.length}` : "Preparing..."}</strong>
                    <span style={{ color: "var(--accent)" }}>{forgeProgress}%</span>
                </div>}
              </div>
           </div>
        </div>
      </div>

      <style jsx>{` .animate-spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .row-center { display: flex; align-items: center; justify-content: center; } `}</style>
    </div>
  );
}
