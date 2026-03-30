"use client";

import { useState, useRef, useCallback } from "react";
import { toPng } from "html-to-image";

interface ShareResultsProps {
  score: number;
  examTitle: string;
  language: string;
  userName: string;
  date: string;
  breakdown?: {
    grammar: number;
    vocabulary: number;
    structure: number;
  };
  lang?: string;
}

export function ShareResults({
  score,
  examTitle,
  language,
  userName,
  date,
  breakdown,
  lang = "en"
}: ShareResultsProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const translations = {
    en: {
      share: "Share",
      download: "Download",
      copy: "Copy Link",
      copied: "Copied!",
      myScore: "My Score",
      on: "on",
      tryIt: "Try it yourself on Bac Excellence!",
      grade: score >= 15 ? "Excellent!" : score >= 12 ? "Good!" : "Keep practicing!",
    },
    fr: {
      share: "Partager",
      download: "Télécharger",
      copy: "Copier le lien",
      copied: "Copié!",
      myScore: "Mon Score",
      on: "sur",
      tryIt: "Essaie toi-même sur Bac Excellence!",
      grade: score >= 15 ? "Excellent!" : score >= 12 ? "Bien!" : "Continue à pratiquer!",
    },
    ar: {
      share: "مشاركة",
      download: "تحميل",
      copy: "نسخ الرابط",
      copied: "تم النسخ!",
      myScore: "درجتي",
      on: "في",
      tryIt: "جرب بنفسك على Bac Excellence!",
      grade: score >= 15 ? "ممتاز!" : score >= 12 ? "جيد!" : "استمر في التمرين!",
    },
    tn: {
      share: "بارتاجي",
      download: "تهبّط",
      copy: "كوبي ليان",
      copied: "تكوبا!",
      myScore: "سكوري",
      on: "في",
      tryIt: "جرب وحدك في Bac Excellence!",
      grade: score >= 17 ? "طيّارة برشا! 🔥" : score >= 15 ? "برافو يا معلم! 🚀" : score >= 12 ? "مزيان، زيد اخدم! 💪" : "ما تسلمش، عاود جرب! 🛡️",
    }
  };

  const t = translations[lang as keyof typeof translations] || translations.en;

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#0a0a1a",
      });
      
      const link = document.createElement("a");
      link.download = `baclang-score-${examTitle.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to generate image:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [cardRef, examTitle]);

  const handleCopyLink = useCallback(async () => {
    const isTunisian = lang === "tn" || lang === "ar";
    const statusEmoji = score >= 15 ? "🔥" : "🚀";
    const shareText = isTunisian 
      ? `🎯 جبت ${score}/20 في ${examTitle} (${language})! ${statusEmoji}\n\n${t.grade}\n\nجرب وحدك هنا: bacexcellence.com`
      : `🎯 I scored ${score}/20 on ${examTitle} (${language})! ${statusEmoji}\n\n${t.grade}\n\nTry it yourself: bacexcellence.com`;
    
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }, [score, examTitle, language, t, lang]);

  const handleNativeShare = useCallback(async () => {
    const isTunisian = lang === "tn" || lang === "ar";
    const statusEmoji = score >= 15 ? "🔥" : "🚀";
    const shareText = isTunisian 
      ? `🎯 جبت ${score}/20 في ${examTitle} (${language})! ${statusEmoji}\n\n${t.grade}\n\nجرب وحدك هنا: bacexcellence.com`
      : `🎯 I scored ${score}/20 on ${examTitle} (${language})! ${statusEmoji}\n\n${t.grade}\n\nTry it yourself: bacexcellence.com`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "BacLang Score",
          text: shareText,
          url: window.location.origin,
        });
      } catch (error) {
        // User cancelled or error
      }
    } else {
      handleCopyLink();
    }
  }, [score, examTitle, language, t, handleCopyLink, lang]);

  const scoreColor = score >= 15 ? "#22c55e" : score >= 12 ? "#eab308" : "#ef4444";

  return (
    <div className="stack" style={{ gap: "16px" }}>
      {/* Hidden card for image generation */}
      <div
        ref={cardRef}
        style={{
          width: "600px",
          padding: "40px",
          background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 100%)",
          borderRadius: "24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative elements */}
        <div style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute",
          bottom: "-30px",
          left: "-30px",
          width: "150px",
          height: "150px",
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "bold",
              color: "white",
            }}>
              B
            </div>
            <span style={{ fontSize: "20px", fontWeight: "bold", color: "white" }}>Bac Excellence</span>
          </div>
          <div style={{
            padding: "8px 16px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "100px",
            fontSize: "14px",
            color: "rgba(255, 255, 255, 0.7)",
          }}>
            {date}
          </div>
        </div>

        {/* Score Display */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            fontSize: "14px",
            color: "rgba(255, 255, 255, 0.6)",
            marginBottom: "8px",
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}>
            {t.myScore}
          </div>
          <div style={{
            fontSize: "120px",
            fontWeight: "900",
            color: scoreColor,
            lineHeight: 1,
            textShadow: `0 0 60px ${scoreColor}40`,
          }}>
            {score}
            <span style={{ fontSize: "48px", color: "rgba(255, 255, 255, 0.4)" }}>/20</span>
          </div>
          <div style={{
            fontSize: "18px",
            color: scoreColor,
            marginTop: "8px",
            fontWeight: "600",
          }}>
            {t.grade}
          </div>
        </div>

        {/* Exam Info */}
        <div style={{
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "24px",
        }}>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "white", marginBottom: "4px" }}>
            {examTitle}
          </div>
          <div style={{ fontSize: "16px", color: "rgba(255, 255, 255, 0.6)" }}>
            {language} • {t.on} Bac Excellence
          </div>
        </div>

        {/* Score Breakdown */}
        {breakdown && (
          <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
            <div style={{ flex: 1, background: "rgba(255, 255, 255, 0.05)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.5)", marginBottom: "4px" }}>Grammar</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#6366f1" }}>{breakdown.grammar}/5</div>
            </div>
            <div style={{ flex: 1, background: "rgba(255, 255, 255, 0.05)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.5)", marginBottom: "4px" }}>Vocabulary</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#8b5cf6" }}>{breakdown.vocabulary}/5</div>
            </div>
            <div style={{ flex: 1, background: "rgba(255, 255, 255, 0.05)", borderRadius: "12px", padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.5)", marginBottom: "4px" }}>Structure</div>
              <div style={{ fontSize: "24px", fontWeight: "bold", color: "#22c55e" }}>{breakdown.structure}/5</div>
            </div>
          </div>
        )}

        {/* User */}
        <div style={{ textAlign: "center", color: "rgba(255, 255, 255, 0.5)", fontSize: "14px" }}>
          by {userName}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="row-between" style={{ gap: "12px", flexWrap: "wrap" }}>
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="button-link"
          style={{
            flex: "1 1 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "12px 24px",
            background: "var(--primary)",
            color: "white",
            borderRadius: "12px",
            fontWeight: 600,
          }}
        >
          {isGenerating ? "..." : "📥"} {t.download}
        </button>
        
        <button
          onClick={handleNativeShare}
          className="button-link"
          style={{
            flex: "1 1 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "12px 24px",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid var(--glass-border)",
            color: "white",
            borderRadius: "12px",
            fontWeight: 600,
          }}
        >
          📤 {t.share}
        </button>
        
        <button
          onClick={handleCopyLink}
          className="button-link"
          style={{
            flex: "1 1 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "12px 24px",
            background: copied ? "var(--success)" : "rgba(255, 255, 255, 0.05)",
            border: "1px solid var(--glass-border)",
            color: "white",
            borderRadius: "12px",
            fontWeight: 600,
            transition: "background 0.2s",
          }}
        >
          {copied ? "✓" : "🔗"} {copied ? t.copied : t.copy}
        </button>
      </div>
    </div>
  );
}
