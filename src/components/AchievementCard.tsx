"use client";

import React, { useRef } from "react";
import { Share2, Download, Award, Zap, Target, Star } from "lucide-react";
import { toPng } from 'html-to-image';

interface AchievementCardProps {
  studentName: string;
  section: string;
  streak: number;
  progress: number;
  predictedScore: string;
}

export function AchievementCard({ 
  studentName, 
  section, 
  streak, 
  progress, 
  predictedScore 
}: AchievementCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadImage = async () => {
    if (cardRef.current === null) return;
    
    // Scale for better quality
    const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = `bac-excellence-achievement-${studentName.toLowerCase()}.png`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="stack" style={{ gap: "24px" }}>
      <div className="row-between">
        <h3 style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: 800 }}>
           ✨ SHARE YOUR EXCELLENCE
        </h3>
        <span className="pill" style={{ opacity: 0.6 }}>Viral Ready</span>
      </div>

      <div style={{ position: "relative" }}>
        {/* The Actual Shareable Card - This is what gets captured */}
        <div 
          ref={cardRef}
          className="card-vibrant"
          style={{
            width: "400px",
            aspectRatio: "4/5",
            background: "linear-gradient(135deg, #020617 0%, #0f172a 100%)",
            borderRadius: "32px",
            padding: "40px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            border: "1px solid rgba(99, 102, 241, 0.3)"
          }}
        >
          {/* Decorative Elements */}
          <div style={{ 
            position: "absolute", 
            top: "-50px", 
            right: "-50px", 
            width: "200px", 
            height: "200px", 
            background: "var(--primary-glow)", 
            filter: "blur(60px)",
            borderRadius: "50%",
            opacity: 0.4
          }} />
          
          {/* Branding */}
          <div className="row-between" style={{ marginBottom: "40px" }}>
             <div className="brand" style={{ gap: "10px" }}>
                <div className="brand-mark" style={{ width: "32px", height: "32px", fontSize: "14px" }}>B</div>
                <span style={{ fontSize: "14px", fontWeight: 900, letterSpacing: "-0.5px" }}>Bac Excellence 🇹🇳</span>
             </div>
             <div className="pill" style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", fontSize: "10px" }}>
                Session 2026
             </div>
          </div>

          <div className="stack" style={{ gap: "32px", position: "relative", zIndex: 1 }}>
             <div className="stack" style={{ gap: "4px" }}>
                <span className="muted" style={{ fontSize: "12px", letterSpacing: "1px", fontWeight: 700 }}>STUDENT ACHIEVEMENT</span>
                <h2 style={{ fontSize: "2.2rem", fontWeight: 900, fontFamily: "var(--font-display)", lineHeight: 1.1 }}>
                  {studentName}
                </h2>
                <span className="text-gradient" style={{ fontWeight: 800 }}>{section} Specialization</span>
             </div>

             <div className="grid grid-cols-2 gap-16">
                <div className="stack" style={{ gap: "4px" }}>
                   <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--accent)" }}>
                      <Zap size={14} fill="var(--accent)" />
                      <span style={{ fontSize: "10px", fontWeight: 800 }}>STREAK</span>
                   </div>
                   <div style={{ fontSize: "1.8rem", fontWeight: 900 }}>{streak} Days</div>
                </div>
                <div className="stack" style={{ gap: "4px" }}>
                   <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--primary)" }}>
                      <Target size={14} />
                      <span style={{ fontSize: "10px", fontWeight: 800 }}>PREDICTION</span>
                   </div>
                   <div style={{ fontSize: "1.8rem", fontWeight: 900 }}>{predictedScore}</div>
                </div>
             </div>

             <div style={{ marginTop: "20px" }}>
                <div className="row-between" style={{ marginBottom: "12px" }}>
                   <span style={{ fontSize: "12px", fontWeight: 700 }}>EXCELLENCE PROGRESS</span>
                   <span style={{ fontSize: "12px", fontWeight: 800 }}>{progress}%</span>
                </div>
                <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "100px", overflow: "hidden" }}>
                   <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(to right, var(--primary), #ec4899)", borderRadius: "100px" }} />
                </div>
             </div>

             <div className="card stack" style={{ 
                padding: "16px", 
                background: "rgba(99, 102, 241, 0.1)", 
                border: "1px dashed rgba(99, 102, 241, 0.4)",
                alignItems: "center",
                textAlign: "center"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "white", fontWeight: 700, fontSize: "13px" }}>
                  <Star size={16} fill="white" />
                  MENTION TRÈS BIEN PACE
                </div>
             </div>
          </div>

          {/* Verification Badge */}
          <div style={{ position: "absolute", bottom: "32px", left: "40px", right: "40px" }} className="row-between">
             <span className="muted" style={{ fontSize: "10px" }}>VERIFIED ON BAC-EXCELLENCE.TN</span>
             <Award size={20} className="muted" />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
           <button 
             onClick={downloadImage}
             className="button-link" 
             style={{ flex: 1, padding: "14px", fontSize: "14px" }}
           >
              <Download size={18} />
              Download Card
           </button>
           <button 
             className="button-link button-secondary" 
             style={{ padding: "14px", aspectRatio: "1", width: "auto" }}
           >
              <Share2 size={18} />
           </button>
        </div>
      </div>
    </div>
  );
}
