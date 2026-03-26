"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CertificateExport } from "@/components/certificate-export";

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

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
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

        {/* Certificate Preview or Grid */}
        {selectedCert ? (
          <div style={{ marginBottom: "40px" }}>
            <button
              onClick={() => setSelectedCert(null)}
              className="button-link"
              style={{
                marginBottom: "24px",
                padding: "8px 16px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--glass-border)",
                borderRadius: "8px",
                color: "white",
              }}
            >
              ← View All Certificates
            </button>
            <CertificateExport
              type={selectedCert.type}
              title={selectedCert.title}
              subtitle={selectedCert.subtitle}
              userName={userName}
              date={selectedCert.date}
              score={selectedCert.score}
              description={selectedCert.description}
              badge={selectedCert.badge}
              lang="en"
            />
          </div>
        ) : (
          <>
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
                  <div
                    key={index}
                    onClick={() => setSelectedCert(cert)}
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "20px",
                      padding: "32px",
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s",
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
                    {/* Badge */}
                    <div style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "50%",
                      background: cert.type === "achievement" ? "linear-gradient(135deg, #fbbf24, #f59e0b)" :
                                   cert.type === "exam_score" ? "linear-gradient(135deg, #6366f1, #8b5cf6)" :
                                   cert.type === "course_complete" ? "linear-gradient(135deg, #22c55e, #16a34a)" :
                                   "linear-gradient(135deg, #ef4444, #dc2626)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "36px",
                      marginBottom: "20px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                    }}>
                      {cert.badge || "⭐"}
                    </div>

                    {/* Title */}
                    <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px", color: "white" }}>
                      {cert.title}
                    </h3>
                    <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "16px", fontSize: "14px" }}>
                      {cert.subtitle}
                    </p>

                    {/* Score */}
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

                    {/* Date */}
                    <p style={{ fontSize: "12px", color: "var(--ink-dim)" }}>
                      Earned: {cert.date}
                    </p>

                    {/* View Button */}
                    <div style={{
                      marginTop: "20px",
                      paddingTop: "20px",
                      borderTop: "1px solid var(--glass-border)",
                      display: "flex",
                      justifyContent: "center",
                    }}>
                      <span style={{ fontSize: "13px", color: "var(--primary)", fontWeight: 600 }}>
                        View & Download →
                      </span>
                    </div>
                  </div>
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
          </>
        )}
      </div>
    </div>
  );
}
