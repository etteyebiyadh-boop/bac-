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

  const currentScene = config.scenes[currentSceneIndex];

  // AI Voice Synthesis (Browser Native - Free)
  function speak(text: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Auto-detect language for Synthesis
    if (config.language === "FRENCH") {
        utterance.lang = "fr-FR";
    } else if (config.language === "ARABIC") {
        utterance.lang = "ar-SA"; // Fusha Arabic (Saudi)
    } else {
        utterance.lang = "en-US";
    }
    
    utterance.rate = 1.0; 
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

  function handleExport() {
    setIsExporting(true);
    setIsPlaying(true);
    setCurrentSceneIndex(0);
    setShowSuccess(false);
  }

  return (
    <div className="video-canvas-studio stack" style={{ gap: "24px", position: "relative" }}>
      {/* Cinematic Viewport */}
      <div 
        ref={videoContainerRef}
        className="video-viewport"
        style={{ 
          width: "100%", 
          aspectRatio: "9/16", 
          background: config.theme.bg || "#000",
          borderRadius: "32px",
          overflow: "hidden",
          border: `2px solid ${config.theme.primary}`,
          boxShadow: `0 0 50px ${config.theme.primary}33`,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
          textAlign: "center"
        }}
      >
        {isPlaying && currentScene ? (
          <div 
            key={currentSceneIndex} 
            className={`scene-content stack reveal-${currentScene.animation}`}
            style={{ gap: "24px", width: "100%" }}
          >
            {currentScene.layout === "TitleSlide" && (
              <div className="stack" style={{ gap: "12px" }}>
                <span className="eyebrow" style={{ color: config.theme.primary, fontSize: "12px", fontWeight: 800, letterSpacing: "2px" }}>BAC EXCELLENCE MASTERCLASS</span>
                <h1 style={{ fontSize: "2.8rem", fontWeight: 900, lineHeight: "1.1", textTransform: "uppercase" }}>{currentScene.title}</h1>
                <p style={{ fontSize: "1.4rem", color: "#fcd34d", fontWeight: 700 }}>{currentScene.subtitle}</p>
              </div>
            )}

            {currentScene.layout === "RuleDefinition" && (
              <div className="card-glass stack" style={{ padding: "40px 32px", border: `2px solid ${config.theme.primary}`, borderRadius: "32px", gap: "20px", background: "rgba(255,255,255,0.02)", backdropFilter: "blur(10px)" }}>
                <div style={{ fontSize: "0.8rem", color: config.theme.primary, fontWeight: 900 }}>ELITE PEDAGOGY / RULE</div>
                <div style={{ fontSize: "1.8rem", fontWeight: 900 }}>{currentScene.title}</div>
                <div style={{ fontSize: "1rem", color: "rgba(255,255,255,0.7)" }}>{currentScene.subtitle}</div>
              </div>
            )}

            {currentScene.layout === "ViralQuote" && (
              <div className="stack stagger-reveal" style={{ gap: "24px", alignItems: "center" }}>
                <div style={{ width: "60px", height: "4px", background: config.theme.primary, borderRadius: "100px" }} />
                <blockquote style={{ fontSize: "2.2rem", fontWeight: 900, fontStyle: "italic", lineHeight: "1.3" }}>"{currentScene.title}"</blockquote>
                <div className="pill" style={{ background: config.theme.primary, color: "white", padding: "8px 20px" }}>{currentScene.subtitle}</div>
              </div>
            )}

            {!["TitleSlide", "RuleDefinition", "ViralQuote"].includes(currentScene.layout) && (
              <div className="stack" style={{ gap: "16px" }}>
                <h2 style={{ fontSize: "2.2rem", fontWeight: 900 }}>{currentScene.title}</h2>
                <div className="card" style={{ padding: "20px", background: "rgba(255,255,255,0.05)" }}>{currentScene.subtitle}</div>
              </div>
            )}

            <div className="scene-progress" style={{ position: "absolute", bottom: "40px", width: "100%", left: 0, padding: "0 40px" }}>
              <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "100px", overflow: "hidden" }}>
                <div 
                  style={{ 
                    height: "100%", 
                    background: config.theme.primary, 
                    width: `${((currentSceneIndex + 1) / config.scenes.length) * 100}%`,
                    transition: `width ${currentScene.duration_ms}ms linear` 
                  }} 
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="stack transition-all" style={{ alignItems: "center", gap: "32px" }}>
            {showSuccess ? (
               <div className="stack reveal-ZoomIn" style={{ alignItems: "center", gap: "16px" }}>
                  <div style={{ fontSize: "5rem" }}>✅</div>
                  <h2 style={{ fontSize: "2rem", fontWeight: 900 }}>Cinematic Export Ready!</h2>
                  <p className="muted">Static MP4 synthesized locally.</p>
                  <button onClick={() => setShowSuccess(false)} className="pill" style={{ background: "rgba(255,255,255,0.1)", color: "white", cursor: "pointer" }}>Back to Cinema</button>
               </div>
            ) : (
               <div className="stack" style={{ alignItems: "center", gap: "32px", opacity: 0.5 }}>
                  <div className="pulse-icon" style={{ fontSize: "5rem" }}>🎬</div>
                  <div className="stack" style={{ gap: "8px" }}>
                    <h2 style={{ fontSize: "1.8rem", fontWeight: 900 }}>International AI Studio</h2>
                    <p>Director Config Loaded ({config.scenes.length} Scenes)</p>
                  </div>
               </div>
            )}
          </div>
        )}

        {isExporting && (
           <div className="export-overlay stack-center" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", zIndex: 10 }}>
              <div className="stack" style={{ alignItems: "center", gap: "12px" }}>
                 <div className="spinner-large" />
                 <span style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "2px", color: config.theme.primary }}>SYNTHESIZING MASTER MP4: {exportProgress}%</span>
              </div>
           </div>
        )}
      </div>

      {/* Controls */}
      <div className="row-between studio-controls card" style={{ padding: "20px 32px", background: "rgba(255,255,255,0.02)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
         <div className="row" style={{ gap: "16px" }}>
            <button 
              className="studio-tool-btn" 
              onClick={() => { setIsPlaying(true); setCurrentSceneIndex(0); setShowSuccess(false); }}
              disabled={isPlaying || isExporting}
              style={{ background: isPlaying ? "rgba(255,255,255,0.05)" : "white", color: isPlaying ? "white" : "black", padding: "12px 32px" }}
            >
               {isPlaying ? "🎬 PLAYING" : "▶️ PREVIEW"}
            </button>
            <button 
              className="studio-tool-btn" 
              onClick={handleExport}
              disabled={isPlaying || isExporting}
              style={{ background: `linear-gradient(135deg, ${config.theme.primary}, #000)`, color: "white", border: "none", padding: "12px 32px" }}
            >
               💎 CINEMATIC EXPORT (.MP4)
            </button>
         </div>
         <div className="stack" style={{ textAlign: "right", gap: "2px" }}>
            <span style={{ fontSize: "10px", opacity: 0.5 }}>SYNCHRONIZER</span>
            <span style={{ fontSize: "13px", fontWeight: 800 }}>SCENE {currentSceneIndex + 1} / {config.scenes.length}</span>
         </div>
      </div>

      <style jsx>{`
        .reveal-FadeUp { animation: fade-up 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        .reveal-ZoomIn { animation: zoom-in 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        .reveal-SlideRight { animation: slide-right 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
        @keyframes fade-up { from { opacity: 0; transform: translateY(40px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes zoom-in { from { opacity: 0; transform: scale(1.5); filter: blur(10px); } to { opacity: 1; transform: scale(1); filter: blur(0); } }
        @keyframes slide-right { from { opacity: 0; transform: translateX(-100px); } to { opacity: 1; transform: translateX(0); } }
        .pulse-icon { animation: pulse 2s infinite ease-in-out; }
        @keyframes pulse { 0% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.1); } 100% { opacity: 0.3; transform: scale(1); } }
        .spinner-large { width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.1); border-top-color: #10b981; borderRadius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
