"use client";

import { useState, useEffect, useRef } from "react";

interface Scene {
  duration_ms: number;
  layout: string;
  title: string;
  subtitle: string;
  animation: string;
  voiceover_chunk: string;
}

interface VideoConfig {
  title: string;
  theme: { primary: string; secondary: string; bg: string };
  language: string;
  avatarImg?: string;
  scenes: Scene[];
  voiceover_full: string;
}

export function VideoCanvas({ config, onComplete }: { config: VideoConfig, onComplete?: () => void }) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const currentScene = config.scenes[currentSceneIndex];

  // AI Voice Synthesis (Pro Optimization)
  function speak(text: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (config.language === "FRENCH") utterance.lang = "fr-FR";
    else if (config.language === "ARABIC") utterance.lang = "ar-SA";
    else utterance.lang = "en-US";
    
    utterance.rate = 1.1; 
    utterance.onstart = () => setIsVoiceActive(true);
    utterance.onend = () => setIsVoiceActive(false);
    
    window.speechSynthesis.speak(utterance);
  }

  // Handle Scene Transitions
  useEffect(() => {
    if (isPlaying && currentScene) {
      speak(currentScene.voiceover_chunk);
      
      const timer = setTimeout(() => {
        if (currentSceneIndex < config.scenes.length - 1) {
          setCurrentSceneIndex(prev => prev + 1);
          if (isExporting) setExportProgress(Math.round(((currentSceneIndex + 1) / config.scenes.length) * 100));
        } else {
          stopRecording();
          setIsPlaying(false);
          setIsExporting(false);
          setExportProgress(100);
          setShowSuccess(true);
          if (onComplete) onComplete();
        }
      }, currentScene.duration_ms);

      return () => {
        clearTimeout(timer);
        window.speechSynthesis.cancel();
      };
    }
  }, [isPlaying, currentSceneIndex, config.scenes, isExporting]);

  // ELITE RECORDING SYSTEM (Browser Native MP4 Synthesis)
  async function startRecording() {
    if (!videoContainerRef.current) return;
    
    try {
      // Step 1: Request screen capture of the SPECIFIC tab (User selects the tab)
      // This is the most reliable way to get high-fidelity video + audio from the browser
      const stream = await (navigator.mediaDevices as any).getDisplayMedia({
        video: { displaySurface: "browser" },
        audio: true
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
        bitsPerSecond: 8000000 // 8Mbps High-Bitrate
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${config.title.replace(/ /g, "_")}_elite_master.webm`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Stop all tracks
        stream.getTracks().forEach((track: any) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      
      setIsExporting(true);
      setIsPlaying(true);
      setCurrentSceneIndex(0);
      setShowSuccess(false);

    } catch (err) {
      console.error("Recording Failed:", err);
      alert("Recording requires Permission. Please allow the browser to capture the 'This Tab' to export the master video.");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }

  // Pre-recording configuration for the user
  function handleExport() {
      // Show simple instructions before starting "Maximum Level" recording
      const ok = confirm("💎 MASTER EXPORT v4.0\n\nTo generate a high-quality video, we will now start a local capture.\n\nInstructions:\n1. Click 'Share this Tab' in the next window.\n2. Ensure 'Share Audio' is checked.\n3. Keep the video playing until finished.\n\nReady for Cinematic Synthesis?");
      if (ok) startRecording();
  }

  return (
    <div className="video-canvas-max stack" style={{ gap: "32px", position: "relative" }}>
      {/* Cinematic Viewport v4.0 MAX */}
      <div 
        ref={videoContainerRef}
        className="video-viewport"
        style={{ 
          width: "100%", 
          aspectRatio: "9/16", 
          background: config.theme.bg || "#000",
          borderRadius: "48px",
          overflow: "hidden",
          border: `3px solid ${config.theme.primary}`,
          boxShadow: `0 0 80px ${config.theme.primary}33`,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px",
          textAlign: "center"
        }}
      >
        {isPlaying && currentScene ? (
          <div 
            key={currentSceneIndex} 
            className={`scene-content stack reveal-${currentScene.animation}`}
            style={{ gap: "32px", width: "100%", position: "relative", zIndex: 10 }}
          >
            {currentScene.layout === "TitleSlide" && (
              <div className="stack" style={{ gap: "16px" }}>
                <span className="eyebrow glow-text" style={{ color: config.theme.primary, fontSize: "14px", fontWeight: 900, letterSpacing: "3px" }}>ELITE MASTERCLASS SERIES</span>
                <h1 style={{ fontSize: "3.5rem", fontWeight: 900, lineHeight: "1.1", textTransform: "uppercase" }}>{currentScene.title}</h1>
                <p style={{ fontSize: "1.8rem", color: "#fcd34d", fontWeight: 800 }}>{currentScene.subtitle}</p>
              </div>
            )}

            {currentScene.layout === "RuleDefinition" && (
              <div className="card-glass stack" style={{ padding: "60px 40px", border: `3px solid ${config.theme.primary}`, borderRadius: "40px", gap: "24px", background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)" }}>
                <div style={{ fontSize: "0.9rem", color: config.theme.primary, fontWeight: 900, letterSpacing: "2px" }}>PEDAGOGICAL CORE / RULE</div>
                <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "white" }}>{currentScene.title}</div>
                <div style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.8)", lineHeight: "1.6" }}>{currentScene.subtitle}</div>
              </div>
            )}

            {currentScene.layout === "ViralQuote" && (
              <div className="stack" style={{ gap: "32px", alignItems: "center" }}>
                <div style={{ width: "80px", height: "6px", background: config.theme.primary, borderRadius: "100px", boxShadow: `0 0 20px ${config.theme.primary}` }} />
                <blockquote style={{ fontSize: "2.8rem", fontWeight: 900, fontStyle: "italic", lineHeight: "1.2", maxWidth: "90%" }}>"{currentScene.title}"</blockquote>
                <div className="pill" style={{ background: config.theme.primary, color: "white", padding: "12px 32px", fontSize: "1.1rem", fontWeight: 900 }}>{currentScene.subtitle}</div>
              </div>
            )}

            {!["TitleSlide", "RuleDefinition", "ViralQuote"].includes(currentScene.layout) && (
              <div className="stack" style={{ gap: "24px" }}>
                <h2 style={{ fontSize: "2.8rem", fontWeight: 900 }}>{currentScene.title}</h2>
                <div className="card" style={{ padding: "32px", background: "rgba(255,255,255,0.05)", borderRadius: "24px", fontSize: "1.3rem" }}>{currentScene.subtitle}</div>
              </div>
            )}
          </div>
        ) : (
          <div className="stack transition-all" style={{ alignItems: "center", gap: "40px" }}>
            {showSuccess ? (
               <div className="stack reveal-ZoomIn" style={{ alignItems: "center", gap: "24px" }}>
                  <div style={{ fontSize: "6rem" }}>🎬</div>
                  <h2 style={{ fontSize: "2.5rem", fontWeight: 900 }}>Production Complete!</h2>
                  <p className="muted" style={{ fontSize: "1.2rem" }}>Your video has been saved locally as a high-fidelity .webm file.</p>
                  <button onClick={() => setShowSuccess(false)} className="studio-tool-btn" style={{ background: "#6366f1", padding: "20px 60px" }}>BACK TO STUDIO</button>
               </div>
            ) : (
               <div className="stack" style={{ alignItems: "center", gap: "40px", opacity: 0.8 }}>
                  <div className="pulse-icon" style={{ fontSize: "7rem" }}>🎥</div>
                  <div className="stack" style={{ gap: "12px" }}>
                    <h2 style={{ fontSize: "2.2rem", fontWeight: 900 }}>Elite Studio v4.0</h2>
                    <p style={{ fontSize: "1.1rem" }}>Synthesizing Masterclass ({config.scenes.length} Scenes)</p>
                  </div>
               </div>
            )}
          </div>
        )}

        {/* The Live Talking Head Presenter */}
        {config.avatarImg && (isPlaying || showSuccess) && (
          <div className={`avatar-presenter ${isVoiceActive ? 'speaking' : ''}`} style={{ position: "absolute", bottom: "120px", right: "40px", width: "180px", height: "180px", borderRadius: "32px", overflow: "hidden", border: `3px solid ${config.theme.primary}`, boxShadow: `0 20px 50px rgba(0,0,0,0.5)`, zIndex: 100, transition: "all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)" }}>
             <img src={config.avatarImg} alt="AI Presenter" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
             {isVoiceActive && (
               <div className="voice-waves row-center" style={{ position: "absolute", bottom: 0, width: "100%", height: "40px", background: "linear-gradient(transparent, rgba(0,0,0,0.8))", gap: "4px" }}>
                 {[1,2,3,4,5].map(i => <div key={i} className="wave-bar" style={{ width: "3px", height: "15px", background: "white", borderRadius: "100px" }} />)}
               </div>
             )}
          </div>
        )}

        {/* Progress Bar */}
        {(isPlaying || isExporting) && (
           <div className="global-progress" style={{ position: "absolute", bottom: "40px", width: "100%", left: 0, padding: "0 60px" }}>
              <div style={{ height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "100px", overflow: "hidden" }}>
                <div 
                  style={{ 
                    height: "100%", 
                    background: config.theme.primary, 
                    width: `${((currentSceneIndex + 1) / config.scenes.length) * 100}%`,
                    transition: isExporting ? "none" : `width ${currentScene?.duration_ms || 0}ms linear`,
                    boxShadow: `0 0 20px ${config.theme.primary}`
                  }} 
                />
              </div>
           </div>
        )}

        {/* Recording Status */}
        {isExporting && (
           <div className="rec-status" style={{ position: "absolute", top: "40px", left: "40px", display: "flex", alignItems: "center", gap: "8px", color: "#ef4444", fontWeight: 800, fontSize: "14px", zIndex: 1000 }}>
              <span className="dot" style={{ width: "12px", height: "12px", background: "#ef4444", borderRadius: "50%", animation: "pulse 1s infinite" }} />
              LIVE MASTER RECORDING ({exportProgress}%)
           </div>
        )}
      </div>

      {/* Control Deck */}
      <div className="row-between studio-controls-pro card" style={{ padding: "32px 48px", background: "rgba(0,0,0,0.4)", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.05)" }}>
         <div className="row" style={{ gap: "20px" }}>
            <button 
              className="studio-tool-btn" 
              onClick={() => { setIsPlaying(true); setCurrentSceneIndex(0); setShowSuccess(false); }}
              disabled={isPlaying || isExporting}
              style={{ background: isPlaying ? "rgba(255,255,255,0.05)" : "white", color: isPlaying ? "white" : "black", padding: "18px 48px" }}
            >
               {isPlaying ? "🎞️ ON AIR" : "▶️ PREVIEW"}
            </button>
            <button 
              className="studio-tool-btn" 
              onClick={handleExport}
              disabled={isPlaying || isExporting}
              style={{ background: `linear-gradient(135deg, ${config.theme.primary}, #000)`, color: "white", border: "none", padding: "18px 48px" }}
            >
               💎 EXPORT MASTER (.MP4/WEBM)
            </button>
         </div>
         <div className="stack" style={{ textAlign: "right", gap: "4px" }}>
            <span style={{ fontSize: "11px", color: config.theme.primary, fontWeight: 900 }}>PRO PRODUCER v4.0</span>
            <span style={{ fontSize: "16px", fontWeight: 900 }}>SCENE {currentSceneIndex + 1} / {config.scenes.length}</span>
         </div>
      </div>

      <style jsx>{`
        .reveal-FadeUp { animation: fade-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        .reveal-ZoomIn { animation: zoom-in 1s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        .reveal-SlideRight { animation: slide-right 1s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        @keyframes fade-up { from { opacity: 0; transform: translateY(60px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes zoom-in { from { opacity: 0; transform: scale(1.5); filter: blur(20px); } to { opacity: 1; transform: scale(1); filter: blur(0); } }
        @keyframes slide-right { from { opacity: 0; transform: translateX(-150px); } to { opacity: 1; transform: translateX(0); } }
        .speaking { transform: scale(1.05); border-color: white !important; }
        .wave-bar { animation: voice-wave 0.5s infinite ease-in-out; }
        @keyframes voice-wave { 0%, 100% { transform: scaleY(0.5); } 50% { transform: scaleY(1.5); } }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
        .pulse-icon { animation: pulse-master 3s infinite ease-in-out; }
        @keyframes pulse-master { 0% { opacity: 0.2; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.1); } 100% { opacity: 0.2; transform: scale(1); } }
      `}</style>
    </div>
  );
}
