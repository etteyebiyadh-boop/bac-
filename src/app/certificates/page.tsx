"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { toPng } from "html-to-image";

interface Certificate {
  type: "achievement" | "exam_score" | "course_complete" | "streak";
  title: string;
  subtitle: string;
  score?: number;
  maxScore?: number;
  date: string;
  description?: string;
  badge?: string;
  earned: boolean;
}

// Simple card component with built-in download
function CertificateCard({ 
  cert, 
  userName, 
  onClick 
}: { 
  cert: Certificate; 
  userName: string;
  onClick: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!cardRef.current) return;
    
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#0a0a1a",
      });
      
      const link = document.createElement("a");
      link.download = `bac-excellence-${cert.type}-${userName.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to generate certificate:", error);
    } finally {
      setIsDownloading(false);
    }
  }, [cert.type, userName]);

  const config = {
    achievement: { bgGradient: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)" },
    exam_score: { bgGradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" },
    course_complete: { bgGradient: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" },
    streak: { bgGradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" },
  }[cert.type] || { bgGradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" };

  return (
    <div
      onClick={onClick}
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        border: "1px solid var(--glass-border)",
        borderRadius: "20px",
        padding: "32px",
        cursor: "pointer",
        transition: "transform 0.2s, box-shadow 0.2s",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Hidden card for download generation */}
      <div
        ref={cardRef}
        style={{
          position: "absolute",
          left: "-9999px",
          width: "600px",
          padding: "40px",
          background: "linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a1a 100%)",
          borderRadius: "20px",
          border: `3px solid transparent`,
          borderImage: `${config.bgGradient} 1`,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>{cert.badge || "⭐"}</div>
          <h2 style={{ fontSize: "28px", fontWeight: "800", color: "white", marginBottom: "8px" }}>
            {cert.title}
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", marginBottom: "24px" }}>
            {cert.subtitle}
          </p>
          {cert.score !== undefined && (
            <div style={{ fontSize: "48px", fontWeight: "900", color: cert.score >= 15 ? "#22c55e" : "#eab308" }}>
              {cert.score}<span style={{ fontSize: "24px", color: "rgba(255,255,255,0.5)" }}>/{cert.maxScore || 20}</span>
            </div>
          )}
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", marginTop: "24px" }}>
            {cert.date}
          </p>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.3)", marginTop: "16px" }}>
            {userName}
          </p>
          <div style={{ marginTop: "24px", fontSize: "12px", color: "rgba(255,255,255,0.2)" }}>
            Bac Excellence
          </div>
        </div>
      </div>

      {/* Visible content */}
      <div style={{
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        background: config.bgGradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "36px",
        marginBottom: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
      }}>
        {cert.badge || "⭐"}
      </div>

      <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px", color: "white" }}>
        {cert.title}
      </h3>
      <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "16px", fontSize: "14px" }}>
        {cert.subtitle}
      </p>

      {cert.score !== undefined && (
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(255,255,255,0.05)",
          padding: "8px 16px",
          borderRadius: "100px",
          marginBottom: "16px",
        }}>
          <span style={{
            fontSize: "20px",
            fontWeight: "900",
            color: cert.score >= 15 ? "#22c55e" : cert.score >= 12 ? "#eab308" : "#ef4444"
          }}>
            {cert.score}
          </span>
          <span style={{ color: "rgba(255,255,255,0.4)" }}>/</span>
          <span style={{ color: "rgba(255,255,255,0.6)" }}>{cert.maxScore || 20}</span>
        </div>
      )}

      <p style={{ fontSize: "12px", color: "var(--ink-dim)", marginBottom: "16px" }}>
        Earned: {cert.date}
      </p>

      {/* One-click download button */}
      <div style={{
        display: "flex",
        gap: "8px",
        marginTop: "12px",
        paddingTop: "16px",
        borderTop: "1px solid var(--glass-border)",
      }}>
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            padding: "10px 16px",
            background: "var(--primary)",
            border: "none",
            borderRadius: "10px",
            color: "white",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
          }}
        >
          {isDownloading ? "⏳" : "📥"} {isDownloading ? "Generating..." : "Download"}
        </button>
      </div>
    </div>
  );
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Student");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile
        const profileRes = await fetch("/api/profile");
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setUserName(profileData.user?.fullName || "Student");
        }

        // Fetch submissions for exam scores
        const submissionsRes = await fetch("/api/dashboard");
        if (submissionsRes.ok) {
          const data = await submissionsRes.json();
          
          // Generate certificates from submissions
          const examCerts: Certificate[] = (data.submissions || [])
            .slice(0, 5)
            .map((sub: any, index: number) => ({
              type: "exam_score" as const,
              title: sub.examTitle || "Bac Exam Practice",
              subtitle: sub.language || "English",
              score: Math.round(sub.overallScore * 20 * 10) / 10,
              date: new Date(sub.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              }),
              description: `Achieved an overall score of ${Math.round(sub.overallScore * 20 * 10) / 10}/20 in ${sub.language || "English"} writing.`,
              badge: "📝",
              earned: true,
            }));

          setCertificates(examCerts);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Add some default certificates for demo
        setCertificates([
          {
            type: "streak",
            title: "7 Day Streak",
            subtitle: "Consistent Learner",
            score: 7,
            maxScore: 7,
            date: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            }),
            description: "Completed daily exercises for 7 consecutive days!",
            badge: "🔥",
            earned: true,
          },
          {
            type: "achievement",
            title: "First Steps",
            subtitle: "Writing Pioneer",
            score: 1,
            maxScore: 1,
            date: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            }),
            description: "Submitted your first essay for AI correction!",
            badge: "🌟",
            earned: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="page-stack" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
        <div className="muted">Loading certificates...</div>
      </div>
    );
  }

  return (
    <div className="page-stack" style={{ paddingTop: "40px" }}>
      <div className="container">
        {/* Header */}
        <div className="row-between" style={{ marginBottom: "40px", alignItems: "flex-start" }}>
          <div>
            <h1 className="section-title-large">🎓 My Certificates</h1>
            <p className="muted">Download and share your achievements</p>
          </div>
          <Link href="/dashboard" className="button-link" style={{ padding: "12px 24px", background: "var(--primary)", borderRadius: "12px" }}>
            ← Back to Dashboard
          </Link>
        </div>

        {/* Certificates Grid */}
        {certificates.length === 0 ? (
              <div className="glass" style={{ padding: "60px", borderRadius: "24px", textAlign: "center" }}>
                <div style={{ fontSize: "64px", marginBottom: "24px" }}>📜</div>
                <h2 style={{ marginBottom: "16px" }}>No Certificates Yet</h2>
                <p className="muted" style={{ marginBottom: "32px", maxWidth: "400px", margin: "0 auto 32px" }}>
                  Complete exams, achieve streaks, and finish courses to earn certificates!
                </p>
                <Link href="/exams" className="button-link" style={{ padding: "16px 32px", background: "var(--primary)", borderRadius: "12px" }}>
                  Start an Exam
                </Link>
              </div>
            ) : (
              <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
                {certificates.map((cert, index) => (
                  <CertificateCard
                    key={index}
                    cert={cert}
                    userName={userName}
                    onClick={() => {}}
                  />
                ))}
              </div>
            )}

            {/* Locked Certificates */}
            <div style={{ marginTop: "60px" }}>
              <h2 style={{ marginBottom: "24px" }}>Certificates to Unlock</h2>
              <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
                {[
                  { title: "Perfect Score", subtitle: "Score 20/20 on any exam", badge: "💯", requirement: "Score 20/20" },
                  { title: "Week Warrior", subtitle: "Maintain a 7-day streak", badge: "🔥", requirement: "7 day streak" },
                  { title: "Vocabulary Master", subtitle: "Learn 100 vocabulary words", badge: "📚", requirement: "100 words" },
                  { title: "Challenge Champion", subtitle: "Win 5 challenges", badge: "🏆", requirement: "5 wins" },
                ].map((cert, index) => (
                  <div
                    key={index}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px dashed var(--glass-border)",
                      borderRadius: "20px",
                      padding: "32px",
                      textAlign: "center",
                      opacity: 0.6,
                    }}
                  >
                    <div style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "28px",
                      margin: "0 auto 16px",
                      filter: "grayscale(100%)",
                    }}>
                      {cert.badge}
                    </div>
                    <h4 style={{ marginBottom: "8px", opacity: 0.5 }}>{cert.title}</h4>
                    <p style={{ fontSize: "13px", color: "var(--ink-dim)", marginBottom: "12px" }}>{cert.subtitle}</p>
                    <span style={{
                      fontSize: "11px",
                      padding: "4px 12px",
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: "100px",
                      color: "var(--ink-dim)",
                    }}>
                      🔒 {cert.requirement}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
