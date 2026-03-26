"use client";

import { useState, useRef, useCallback } from "react";
import { toPng, toJpeg } from "html-to-image";

interface CertificateData {
  type: "achievement" | "exam_score" | "course_complete" | "streak";
  title: string;
  subtitle?: string;
  userName: string;
  date: string;
  score?: number;
  maxScore?: number;
  description?: string;
  badge?: string;
  lang?: string;
}

export function CertificateExport({
  type,
  title,
  subtitle,
  userName,
  date,
  score,
  maxScore = 20,
  description,
  badge,
  lang = "en"
}: CertificateData) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const cardRef = useRef<HTMLDivElement>(null);

  const translations = {
    en: {
      certificateOf: "Certificate of",
      achieved: "Achieved",
      completed: "Completed",
      score: "Score",
      download: "Download Certificate",
      share: "Share",
    },
    fr: {
      certificateOf: "Certificat de",
      achieved: "Obtenu",
      completed: "Complété",
      score: "Score",
      download: "Télécharger le Certificat",
      share: "Partager",
    },
    ar: {
      certificateOf: "شهادة",
      achieved: "تحقيق",
      completed: "إكمال",
      score: "الدرجة",
      download: "تحميل الشهادة",
      share: "مشاركة",
    }
  };

  const t = translations[lang as keyof typeof translations] || translations.en;

  const getTypeConfig = () => {
    switch (type) {
      case "achievement":
        return { icon: "🏆", bgGradient: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)" };
      case "exam_score":
        return { icon: "📝", bgGradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" };
      case "course_complete":
        return { icon: "🎓", bgGradient: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" };
      case "streak":
        return { icon: "🔥", bgGradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" };
      default:
        return { icon: "⭐", bgGradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" };
    }
  };

  const config = getTypeConfig();

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);
    try {
      const options = {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#0a0a1a",
      };

      const dataUrl = format === "png"
        ? await toPng(cardRef.current, options)
        : await toJpeg(cardRef.current, { ...options, quality: 0.95 });
      
      const link = document.createElement("a");
      link.download = `baclang-${type}-${userName.toLowerCase().replace(/\s+/g, "-")}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to generate certificate:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [cardRef, format, type, userName]);

  const handleShare = useCallback(async () => {
    const shareText = `🎓 I just earned a ${title} certificate on BacLang!\n\n${t.achieved} ${subtitle || title}\n\n${t.score}: ${score}/${maxScore}\n\nCheck it out!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "BacLang Certificate",
          text: shareText,
          url: window.location.origin,
        });
      } catch (error) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      alert("Certificate shared! (Copied to clipboard)");
    }
  }, [title, subtitle, score, maxScore, t]);

  return (
    <div className="stack" style={{ gap: "16px", alignItems: "center" }}>
      {/* Certificate Preview */}
      <div
        ref={cardRef}
        style={{
          width: "800px",
          maxWidth: "100%",
          aspectRatio: "1.414", // A4 landscape ratio
          padding: "48px",
          background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a1a 100%)",
          borderRadius: "24px",
          position: "relative",
          overflow: "hidden",
          border: "3px solid",
          borderImage: `linear-gradient(135deg, ${type === "achievement" ? "#fbbf24" : type === "exam_score" ? "#6366f1" : "#22c55e"}, transparent, ${type === "achievement" ? "#f59e0b" : type === "exam_score" ? "#8b5cf6" : "#16a34a"}) 1`,
        }}
      >
        {/* Decorative corners */}
        <div style={{
          position: "absolute",
          top: "24px",
          left: "24px",
          width: "60px",
          height: "60px",
          borderTop: "3px solid rgba(99, 102, 241, 0.5)",
          borderLeft: "3px solid rgba(99, 102, 241, 0.5)",
        }} />
        <div style={{
          position: "absolute",
          top: "24px",
          right: "24px",
          width: "60px",
          height: "60px",
          borderTop: "3px solid rgba(99, 102, 241, 0.5)",
          borderRight: "3px solid rgba(99, 102, 241, 0.5)",
        }} />
        <div style={{
          position: "absolute",
          bottom: "24px",
          left: "24px",
          width: "60px",
          height: "60px",
          borderBottom: "3px solid rgba(99, 102, 241, 0.5)",
          borderLeft: "3px solid rgba(99, 102, 241, 0.5)",
        }} />
        <div style={{
          position: "absolute",
          bottom: "24px",
          right: "24px",
          width: "60px",
          height: "60px",
          borderBottom: "3px solid rgba(99, 102, 241, 0.5)",
          borderRight: "3px solid rgba(99, 102, 241, 0.5)",
        }} />

        {/* Background pattern */}
        <div style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        {/* Content */}
        <div style={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}>
          {/* Badge */}
          {badge && (
            <div style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              background: config.bgGradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
              marginBottom: "24px",
              boxShadow: `0 20px 40px ${type === "achievement" ? "rgba(251, 191, 36, 0.3)" : type === "exam_score" ? "rgba(99, 102, 241, 0.3)" : "rgba(34, 197, 94, 0.3)"}`,
            }}>
              {badge}
            </div>
          )}

          {/* Title */}
          <div style={{
            fontSize: "14px",
            color: "rgba(255, 255, 255, 0.5)",
            textTransform: "uppercase",
            letterSpacing: "4px",
            marginBottom: "8px",
          }}>
            {t.certificateOf}
          </div>

          <h1 style={{
            fontSize: "42px",
            fontWeight: "900",
            color: "white",
            marginBottom: "8px",
            textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          }}>
            {title}
          </h1>

          {subtitle && (
            <h2 style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "rgba(255, 255, 255, 0.8)",
              marginBottom: "24px",
            }}>
              {subtitle}
            </h2>
          )}

          {/* Score */}
          {score !== undefined && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              background: "rgba(255, 255, 255, 0.05)",
              padding: "16px 32px",
              borderRadius: "100px",
              marginBottom: "24px",
            }}>
              <span style={{ fontSize: "32px", fontWeight: "900", color: score >= 15 ? "#22c55e" : score >= 12 ? "#eab308" : "#ef4444" }}>
                {score}
              </span>
              <span style={{ fontSize: "24px", color: "rgba(255, 255, 255, 0.4)" }}>/</span>
              <span style={{ fontSize: "24px", color: "rgba(255, 255, 255, 0.6)" }}>{maxScore}</span>
              <span style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.5)", marginLeft: "8px" }}>
                {t.score}
              </span>
            </div>
          )}

          {/* Description */}
          {description && (
            <p style={{
              fontSize: "16px",
              color: "rgba(255, 255, 255, 0.6)",
              maxWidth: "500px",
              lineHeight: 1.6,
              marginBottom: "32px",
            }}>
              {description}
            </p>
          )}

          {/* Divider */}
          <div style={{
            width: "200px",
            height: "2px",
            background: "linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent)",
            marginBottom: "32px",
          }} />

          {/* User and Date */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{
              width: "80px",
              height: "2px",
              background: "rgba(255, 255, 255, 0.3)",
              margin: "0 auto 16px",
            }} />
            <div style={{
              fontSize: "20px",
              fontWeight: "700",
              color: "white",
              marginBottom: "8px",
            }}>
              {userName}
            </div>
            <div style={{
              fontSize: "14px",
              color: "rgba(255, 255, 255, 0.5)",
            }}>
              {date}
            </div>
          </div>

          {/* Brand */}
          <div style={{
            position: "absolute",
            bottom: "48px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}>
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: "bold",
              color: "white",
            }}>
              B
            </div>
            <span style={{
              fontSize: "16px",
              fontWeight: "800",
              color: "rgba(255, 255, 255, 0.7)",
            }}>
              BacLang
            </span>
          </div>

          {/* ID */}
          <div style={{
            position: "absolute",
            bottom: "48px",
            right: "48px",
            fontSize: "10px",
            color: "rgba(255, 255, 255, 0.2)",
            fontFamily: "monospace",
          }}>
            BAC-{Date.now().toString(36).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Download Options */}
      <div className="row-between" style={{ gap: "16px", flexWrap: "wrap", maxWidth: "600px" }}>
        {/* Format selector */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <span style={{ fontSize: "14px", color: "var(--ink-dim)" }}>Format:</span>
          {(["png", "jpeg"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              style={{
                padding: "8px 16px",
                background: format === f ? "var(--primary)" : "rgba(255,255,255,0.05)",
                border: `1px solid ${format === f ? "var(--primary)" : "var(--glass-border)"}`,
                borderRadius: "8px",
                color: "white",
                cursor: "pointer",
                fontSize: "13px",
                textTransform: "uppercase",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="button-link"
            style={{
              display: "flex",
              alignItems: "center",
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
            onClick={handleShare}
            className="button-link"
            style={{
              display: "flex",
              alignItems: "center",
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
        </div>
      </div>
    </div>
  );
}
