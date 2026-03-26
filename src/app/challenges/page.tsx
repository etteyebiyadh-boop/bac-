"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Challenge {
  id: string;
  challengerId: string;
  challengerName: string;
  challengedEmail: string | null;
  examSlug: string;
  examTitle: string;
  language: string;
  status: "PENDING" | "ACCEPTED" | "COMPLETED" | "EXPIRED" | "DECLINED";
  challengerScore: number | null;
  challengedScore: number | null;
  winnerId: string | null;
  xpReward: number;
  createdAt: string;
  expiresAt: string;
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingChallenge, setCreatingChallenge] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user
        const userRes = await fetch("/api/profile");
        if (userRes.ok) {
          const userData = await userRes.json();
          setCurrentUserId(userData.user?.id);
        }

        // Fetch challenges
        const challengesRes = await fetch("/api/challenges");
        if (challengesRes.ok) {
          const data = await challengesRes.json();
          setChallenges(data.challenges || []);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateChallenge = async (examSlug: string, examTitle: string, language: string) => {
    setCreatingChallenge(true);
    try {
      const res = await fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examSlug,
          examTitle,
          language,
          challengedEmail: inviteEmail || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setChallenges([data.challenge, ...challenges]);
        setInviteEmail("");
        alert("Challenge created! Share the link with your friend.");
      }
    } catch (error) {
      console.error("Failed to create challenge:", error);
    } finally {
      setCreatingChallenge(false);
    }
  };

  const handleAcceptChallenge = async (challengeId: string) => {
    try {
      const res = await fetch(`/api/challenges/${challengeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "accept" }),
      });

      if (res.ok) {
        const data = await res.json();
        setChallenges(challenges.map(c => c.id === challengeId ? data.challenge : c));
        router.push(`/exams/${data.challenge.examSlug}/mock`);
      }
    } catch (error) {
      console.error("Failed to accept challenge:", error);
    }
  };

  const handleDeclineChallenge = async (challengeId: string) => {
    try {
      const res = await fetch(`/api/challenges/${challengeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "decline" }),
      });

      if (res.ok) {
        const data = await res.json();
        setChallenges(challenges.map(c => c.id === challengeId ? data.challenge : c));
      }
    } catch (error) {
      console.error("Failed to decline challenge:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "var(--warning)";
      case "ACCEPTED": return "var(--primary)";
      case "COMPLETED": return "var(--success)";
      case "EXPIRED": return "var(--ink-dim)";
      case "DECLINED": return "var(--error)";
      default: return "var(--ink)";
    }
  };

  const getStatusLabel = (status: string, lang: string = "en") => {
    const labels: Record<string, Record<string, string>> = {
      PENDING: { en: "Waiting", fr: "En attente", ar: "في الانتظار" },
      ACCEPTED: { en: "In Progress", fr: "En cours", ar: "قيد التنفيذ" },
      COMPLETED: { en: "Completed", fr: "Terminé", ar: "مكتمل" },
      EXPIRED: { en: "Expired", fr: "Expiré", ar: "منتهي الصلاحية" },
      DECLINED: { en: "Declined", fr: "Refusé", ar: "مرفوض" },
    };
    return labels[status]?.[lang] || labels[status]?.en || status;
  };

  const pendingChallenges = challenges.filter(c => c.status === "PENDING" && c.challengedEmail);
  const myChallenges = challenges.filter(c => c.challengerId === currentUserId);
  const incomingChallenges = challenges.filter(c => c.challengedEmail && c.status === "PENDING");
  const completedChallenges = challenges.filter(c => c.status === "COMPLETED");

  return (
    <div className="page-stack">
      <div className="container" style={{ paddingTop: "40px" }}>
        {/* Header */}
        <div className="row-between" style={{ marginBottom: "40px", alignItems: "flex-start" }}>
          <div>
            <h1 className="section-title-large">🏆 Challenge Friends</h1>
            <p className="muted">Compete with friends on the same exam and earn bonus XP!</p>
          </div>
          <Link href="/exams" className="button-link" style={{ padding: "12px 24px", background: "var(--primary)", borderRadius: "12px" }}>
            📝 Take an Exam
          </Link>
        </div>

        {/* Create Challenge Section */}
        <div className="glass" style={{ padding: "32px", marginBottom: "40px", borderRadius: "24px" }}>
          <h2 style={{ marginBottom: "16px" }}>Create New Challenge</h2>
          <p className="muted" style={{ marginBottom: "24px" }}>
            Choose an exam, optionally invite a friend by email, and challenge them to beat your score!
          </p>
          
          <div className="stack" style={{ gap: "16px" }}>
            <input
              type="email"
              placeholder="Friend's email (optional)"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="input"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--glass-border)",
                padding: "12px 16px",
                borderRadius: "12px",
                color: "white",
                width: "100%",
                maxWidth: "400px",
              }}
            />
            
            <div className="stack" style={{ gap: "12px" }}>
              <p style={{ fontWeight: 600 }}>Select an exam to challenge:</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                {[
                  { slug: "bac-english-2024-session-principale", title: "BAC 2024 - Session Principale", lang: "ENGLISH" },
                  { slug: "bac-english-2024-session-controle", title: "BAC 2024 - Session Contrôle", lang: "ENGLISH" },
                  { slug: "bac-english-2023-session-principale", title: "BAC 2023 - Session Principale", lang: "ENGLISH" },
                ].map((exam) => (
                  <button
                    key={exam.slug}
                    onClick={() => handleCreateChallenge(exam.slug, exam.title, exam.lang)}
                    disabled={creatingChallenge}
                    className="button-link"
                    style={{
                      padding: "12px 20px",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "12px",
                      color: "white",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {creatingChallenge ? "..." : "🎯"} {exam.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "24px" }}>
          {/* Incoming Challenges */}
          <div className="glass" style={{ padding: "24px", borderRadius: "20px" }}>
            <h3 style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              📥 Incoming Challenges
              {incomingChallenges.length > 0 && (
                <span style={{
                  background: "var(--primary)",
                  color: "white",
                  padding: "2px 8px",
                  borderRadius: "100px",
                  fontSize: "12px",
                }}>
                  {incomingChallenges.length}
                </span>
              )}
            </h3>
            
            {loading ? (
              <p className="muted">Loading...</p>
            ) : incomingChallenges.length === 0 ? (
              <p className="muted">No incoming challenges yet. Share your challenge link!</p>
            ) : (
              <div className="stack" style={{ gap: "12px" }}>
                {incomingChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "12px",
                      padding: "16px",
                    }}
                  >
                    <div className="row-between" style={{ marginBottom: "8px" }}>
                      <span style={{ fontWeight: 600 }}>{challenge.examTitle}</span>
                      <span style={{
                        padding: "4px 8px",
                        background: getStatusColor(challenge.status),
                        borderRadius: "100px",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}>
                        {getStatusLabel(challenge.status)}
                      </span>
                    </div>
                    <p className="muted" style={{ fontSize: "13px", marginBottom: "12px" }}>
                      Challenged by: {challenge.challengerName}
                    </p>
                    <div className="row-between" style={{ gap: "8px" }}>
                      <button
                        onClick={() => handleAcceptChallenge(challenge.id)}
                        className="button-link"
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          background: "var(--success)",
                          color: "white",
                          borderRadius: "8px",
                          fontWeight: 600,
                          fontSize: "13px",
                        }}
                      >
                        ✅ Accept
                      </button>
                      <button
                        onClick={() => handleDeclineChallenge(challenge.id)}
                        className="button-link"
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid var(--glass-border)",
                          color: "white",
                          borderRadius: "8px",
                          fontWeight: 600,
                          fontSize: "13px",
                        }}
                      >
                        ❌ Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* My Sent Challenges */}
          <div className="glass" style={{ padding: "24px", borderRadius: "20px" }}>
            <h3 style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
              📤 My Challenges
              {myChallenges.length > 0 && (
                <span style={{
                  background: "var(--primary)",
                  color: "white",
                  padding: "2px 8px",
                  borderRadius: "100px",
                  fontSize: "12px",
                }}>
                  {myChallenges.length}
                </span>
              )}
            </h3>
            
            {loading ? (
              <p className="muted">Loading...</p>
            ) : myChallenges.length === 0 ? (
              <p className="muted">You haven't challenged anyone yet. Create one above!</p>
            ) : (
              <div className="stack" style={{ gap: "12px" }}>
                {myChallenges.slice(0, 5).map((challenge) => (
                  <div
                    key={challenge.id}
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--glass-border)",
                      borderRadius: "12px",
                      padding: "16px",
                    }}
                  >
                    <div className="row-between" style={{ marginBottom: "8px" }}>
                      <span style={{ fontWeight: 600 }}>{challenge.examTitle}</span>
                      <span style={{
                        padding: "4px 8px",
                        background: getStatusColor(challenge.status),
                        borderRadius: "100px",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}>
                        {getStatusLabel(challenge.status)}
                      </span>
                    </div>
                    {challenge.challengedEmail && (
                      <p className="muted" style={{ fontSize: "13px", marginBottom: "8px" }}>
                        Challenging: {challenge.challengedEmail}
                      </p>
                    )}
                    {challenge.status === "COMPLETED" && (
                      <div style={{ display: "flex", gap: "16px", fontSize: "14px" }}>
                        <span style={{ color: "var(--primary)" }}>You: {challenge.challengerScore}/20</span>
                        {challenge.challengedScore !== null && (
                          <span style={{ color: challenge.winnerId === currentUserId ? "var(--success)" : "var(--error)" }}>
                            Them: {challenge.challengedScore}/20
                            {challenge.winnerId === currentUserId && " 🏆"}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Leaderboard / Completed */}
          <div className="glass" style={{ padding: "24px", borderRadius: "20px" }}>
            <h3 style={{ marginBottom: "16px" }}>🏆 Completed Duels</h3>
            
            {completedChallenges.length === 0 ? (
              <p className="muted">No completed challenges yet.</p>
            ) : (
              <div className="stack" style={{ gap: "12px" }}>
                {completedChallenges.map((challenge, index) => (
                  <div
                    key={challenge.id}
                    style={{
                      background: index === 0 ? "linear-gradient(135deg, rgba(234, 179, 8, 0.1), rgba(234, 179, 8, 0.05))" : "rgba(255,255,255,0.03)",
                      border: index === 0 ? "1px solid rgba(234, 179, 8, 0.3)" : "1px solid var(--glass-border)",
                      borderRadius: "12px",
                      padding: "16px",
                    }}
                  >
                    <div className="row-between" style={{ marginBottom: "8px" }}>
                      <span style={{ fontWeight: 600 }}>
                        {index === 0 && "🥇 "}{challenge.examTitle}
                      </span>
                      <span style={{ fontSize: "12px", color: "var(--success)" }}>
                        +{challenge.xpReward} XP
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                      <span style={{ color: "var(--primary)" }}>{challenge.challengerName}: {challenge.challengerScore}/20</span>
                      <span style={{ color: "var(--ink-dim)" }}>vs</span>
                      <span style={{ color: "var(--secondary)" }}>{challenge.challengedScore}/20</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Share Link Section */}
        <div className="glass" style={{ padding: "32px", marginTop: "40px", borderRadius: "20px", textAlign: "center" }}>
          <h3 style={{ marginBottom: "16px" }}>🔗 Share Your Challenge Link</h3>
          <p className="muted" style={{ marginBottom: "24px" }}>
            Share this link with friends to let them challenge you directly
          </p>
          <div className="row-between" style={{ maxWidth: "600px", margin: "0 auto", gap: "12px" }}>
            <input
              type="text"
              readOnly
              value={`${typeof window !== "undefined" ? window.location.origin : ""}/challenges`}
              className="input"
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--glass-border)",
                padding: "12px 16px",
                borderRadius: "12px",
                color: "white",
              }}
            />
            <button
              onClick={() => navigator.clipboard.writeText(`${window.location.origin}/challenges`)}
              className="button-link"
              style={{
                padding: "12px 24px",
                background: "var(--primary)",
                color: "white",
                borderRadius: "12px",
                fontWeight: 600,
              }}
            >
              📋 Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
