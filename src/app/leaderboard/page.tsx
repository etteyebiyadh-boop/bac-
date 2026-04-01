"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface LeaderboardEntry {
  userId: string;
  displayName: string;
  xp: number;
  level: number;
  levelTitle: string;
  avgScore: number;
  totalEssays: number;
  bacSection: string | null;
  isCurrentUser: boolean;
  rank: number;
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  currentUserRank: number | null;
  totalParticipants: number;
  period: string;
}

type Period = "week" | "month" | "alltime";

const PERIOD_LABELS: Record<Period, string> = {
  week: "Cette Semaine",
  month: "Ce Mois",
  alltime: "Tout Temps",
};

const SECTION_LABELS: Record<string, string> = {
  MATHEMATIQUES: "Maths",
  SCIENCES_EXPERIMENTALES: "Sciences",
  SCIENCES_INFORMATIQUE: "Info",
  SCIENCES_TECHNIQUES: "Tech",
  LETTRES: "Lettres",
  ECONOMIE_GESTION: "Éco",
};

const SECTION_COLORS: Record<string, string> = {
  MATHEMATIQUES: "#6366f1",
  SCIENCES_EXPERIMENTALES: "#10b981",
  SCIENCES_INFORMATIQUE: "#06b6d4",
  SCIENCES_TECHNIQUES: "#f59e0b",
  LETTRES: "#ec4899",
  ECONOMIE_GESTION: "#8b5cf6",
};

function getRankMedal(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return null;
}

function getXpForNextLevel(level: number) {
  return level * 200;
}

function XpBar({ xp, level }: { xp: number; level: number }) {
  const prev = (level - 1) * 200;
  const next = level * 200;
  const pct = Math.min(((xp - prev) / (next - prev)) * 100, 100);
  return (
    <div style={{ width: "100%", background: "rgba(255,255,255,0.08)", borderRadius: 4, height: 4, marginTop: 4 }}>
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          borderRadius: 4,
          background: "linear-gradient(90deg, #6366f1, #ec4899)",
          transition: "width 1s ease",
        }}
      />
    </div>
  );
}

function PodiumCard({ entry, delay }: { entry: LeaderboardEntry; delay: number }) {
  const heights = { 1: 140, 2: 100, 3: 80 };
  const h = heights[entry.rank as keyof typeof heights] || 80;
  const colors = {
    1: "linear-gradient(135deg, #f59e0b, #fbbf24)",
    2: "linear-gradient(135deg, #9ca3af, #d1d5db)",
    3: "linear-gradient(135deg, #b45309, #d97706)",
  };
  const glow = {
    1: "0 0 40px rgba(245,158,11,0.5)",
    2: "0 0 30px rgba(156,163,175,0.4)",
    3: "0 0 25px rgba(180,83,9,0.4)",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        animation: `slideUp 0.6s ease ${delay}ms both`,
        flex: 1,
        maxWidth: 200,
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: entry.rank === 1 ? 80 : 64,
          height: entry.rank === 1 ? 80 : 64,
          borderRadius: "50%",
          background: colors[entry.rank as keyof typeof colors] || "#6366f1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: entry.rank === 1 ? 32 : 26,
          fontWeight: 900,
          color: "#fff",
          boxShadow: glow[entry.rank as keyof typeof glow],
          marginBottom: 8,
          border: "3px solid rgba(255,255,255,0.2)",
          position: "relative",
        }}
      >
        {entry.displayName.charAt(0).toUpperCase()}
        <span style={{ position: "absolute", top: -8, right: -4, fontSize: 20 }}>
          {getRankMedal(entry.rank)}
        </span>
      </div>

      {/* Name + section */}
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: entry.rank === 1 ? 14 : 12,
            color: entry.isCurrentUser ? "#a5b4fc" : "#f1f5f9",
            maxWidth: 120,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {entry.isCurrentUser ? "Vous" : entry.displayName}
        </div>
        <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
          {entry.bacSection ? SECTION_LABELS[entry.bacSection] : ""} · Niv.{entry.level}
        </div>
      </div>

      {/* Podium block */}
      <div
        style={{
          width: "100%",
          height: h,
          background: colors[entry.rank as keyof typeof colors] || "#6366f1",
          borderRadius: "8px 8px 0 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: glow[entry.rank as keyof typeof glow],
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div style={{ fontWeight: 900, fontSize: entry.rank === 1 ? 22 : 18, color: "#fff" }}>
          #{entry.rank}
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.85)", marginTop: 2 }}>
          {entry.xp.toLocaleString()} XP
        </div>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [period, setPeriod] = useState<Period>("week");
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async (p: Period) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard?period=${p}&limit=50`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard(period);
  }, [period, fetchLeaderboard]);

  const top3 = data?.leaderboard.slice(0, 3) || [];
  const rest = data?.leaderboard.slice(3) || [];

  // Reorder podium: 2nd, 1st, 3rd
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
        color: "#f1f5f9",
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: "0 0 80px 0",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .leaderboard-row:hover {
          background: rgba(99,102,241,0.12) !important;
          transform: translateX(4px);
          transition: all 0.2s ease;
        }
        .period-btn:hover {
          background: rgba(99,102,241,0.3) !important;
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          padding: "24px 20px 0",
          display: "flex",
          alignItems: "center",
          gap: 12,
          maxWidth: 700,
          margin: "0 auto",
        }}
      >
        <Link
          href="/dashboard"
          style={{
            color: "#94a3b8",
            textDecoration: "none",
            fontSize: 22,
            lineHeight: 1,
            padding: "6px 10px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
          }}
        >
          ←
        </Link>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0, letterSpacing: "-0.5px" }}>
            🏆 Classement BAC
          </h1>
          <p style={{ fontSize: 12, color: "#64748b", margin: "2px 0 0" }}>
            Compétition entre élèves — Tunisie
          </p>
        </div>
      </div>

      {/* Period Selector */}
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "16px 20px",
          maxWidth: 700,
          margin: "0 auto",
        }}
      >
        {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
          <button
            key={p}
            className="period-btn"
            onClick={() => setPeriod(p)}
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 10,
              border: period === p ? "1.5px solid #6366f1" : "1.5px solid rgba(255,255,255,0.08)",
              background: period === p ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.04)",
              color: period === p ? "#a5b4fc" : "#64748b",
              fontWeight: period === p ? 700 : 500,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      {data && (
        <div
          style={{
            display: "flex",
            gap: 12,
            padding: "0 20px 16px",
            maxWidth: 700,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.04)",
              borderRadius: 10,
              padding: "10px 14px",
              border: "1px solid rgba(255,255,255,0.06)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 800, color: "#a5b4fc" }}>
              {data.totalParticipants}
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Participants</div>
          </div>
          <div
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.04)",
              borderRadius: 10,
              padding: "10px 14px",
              border: "1px solid rgba(255,255,255,0.06)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fbbf24" }}>
              #{data.currentUserRank || "?"}
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Votre Rang</div>
          </div>
          <div
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.04)",
              borderRadius: 10,
              padding: "10px 14px",
              border: "1px solid rgba(255,255,255,0.06)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 20, fontWeight: 800, color: "#34d399" }}>
              {data.leaderboard[0]?.xp.toLocaleString() || "0"}
            </div>
            <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>XP Max</div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div
            style={{
              width: 40,
              height: 40,
              border: "3px solid rgba(99,102,241,0.3)",
              borderTop: "3px solid #6366f1",
              borderRadius: "50%",
              margin: "0 auto 16px",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <div style={{ color: "#64748b", fontSize: 14 }}>Chargement du classement...</div>
        </div>
      ) : (
        <>
          {/* Podium */}
          {top3.length >= 2 && (
            <div
              style={{
                maxWidth: 700,
                margin: "0 auto",
                padding: "8px 20px 0",
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 16,
                  padding: "24px 16px 0",
                  overflow: "hidden",
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", letterSpacing: "0.1em", textAlign: "center", marginBottom: 16, textTransform: "uppercase" }}>
                  Podium
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  {podiumOrder.map((entry, i) => (
                    <PodiumCard key={entry.userId} entry={entry} delay={i * 120} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Rest of leaderboard */}
          {rest.length > 0 && (
            <div
              style={{
                maxWidth: 700,
                margin: "16px auto 0",
                padding: "0 20px",
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 16,
                  overflow: "hidden",
                }}
              >
                {/* Header row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "40px 1fr 80px 60px",
                    padding: "12px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#475569",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  <span>#</span>
                  <span>Élève</span>
                  <span style={{ textAlign: "right" }}>XP</span>
                  <span style={{ textAlign: "right" }}>Moy.</span>
                </div>

                {rest.map((entry, idx) => (
                  <div
                    key={entry.userId}
                    className="leaderboard-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "40px 1fr 80px 60px",
                      padding: "14px 16px",
                      borderBottom:
                        idx < rest.length - 1
                          ? "1px solid rgba(255,255,255,0.04)"
                          : "none",
                      background: entry.isCurrentUser
                        ? "rgba(99,102,241,0.08)"
                        : "transparent",
                      borderLeft: entry.isCurrentUser
                        ? "3px solid #6366f1"
                        : "3px solid transparent",
                      animation: `fadeIn 0.4s ease ${idx * 40}ms both`,
                      cursor: "default",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {/* Rank */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontWeight: 800,
                        fontSize: 13,
                        color: entry.isCurrentUser ? "#a5b4fc" : "#475569",
                      }}
                    >
                      {entry.rank}
                    </div>

                    {/* Name + info */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: entry.bacSection
                            ? `${SECTION_COLORS[entry.bacSection]}33`
                            : "rgba(99,102,241,0.2)",
                          border: `2px solid ${
                            entry.bacSection
                              ? SECTION_COLORS[entry.bacSection]
                              : "#6366f1"
                          }44`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          fontWeight: 800,
                          color: entry.bacSection
                            ? SECTION_COLORS[entry.bacSection]
                            : "#a5b4fc",
                          flexShrink: 0,
                        }}
                      >
                        {entry.displayName.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 13,
                            color: entry.isCurrentUser ? "#a5b4fc" : "#e2e8f0",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {entry.isCurrentUser ? "Vous" : entry.displayName}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#475569",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            marginTop: 1,
                          }}
                        >
                          <span
                            style={{
                              background: entry.bacSection
                                ? `${SECTION_COLORS[entry.bacSection]}22`
                                : "rgba(99,102,241,0.15)",
                              color: entry.bacSection
                                ? SECTION_COLORS[entry.bacSection]
                                : "#a5b4fc",
                              padding: "1px 6px",
                              borderRadius: 4,
                              fontSize: 9,
                              fontWeight: 700,
                            }}
                          >
                            {entry.bacSection ? SECTION_LABELS[entry.bacSection] : "BAC"}
                          </span>
                          <span style={{ color: "#334155" }}>Niv. {entry.level}</span>
                          <span style={{ color: "#334155" }}>{entry.levelTitle}</span>
                        </div>
                        <XpBar xp={entry.xp} level={entry.level} />
                      </div>
                    </div>

                    {/* XP */}
                    <div
                      style={{
                        textAlign: "right",
                        fontWeight: 800,
                        fontSize: 14,
                        color: entry.isCurrentUser ? "#a5b4fc" : "#c4b5fd",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        justifyContent: "center",
                      }}
                    >
                      {entry.xp.toLocaleString()}
                      <span style={{ fontSize: 9, color: "#475569", fontWeight: 500 }}>XP</span>
                    </div>

                    {/* Avg score */}
                    <div
                      style={{
                        textAlign: "right",
                        fontWeight: 700,
                        fontSize: 13,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        color:
                          entry.avgScore >= 14
                            ? "#34d399"
                            : entry.avgScore >= 12
                            ? "#fbbf24"
                            : "#f87171",
                      }}
                    >
                      {entry.avgScore > 0 ? entry.avgScore.toFixed(1) : "--"}
                      <span style={{ fontSize: 9, color: "#475569", fontWeight: 500 }}>/20</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {data?.leaderboard.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                maxWidth: 400,
                margin: "0 auto",
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#e2e8f0", marginBottom: 8 }}>
                Classement vide
              </div>
              <div style={{ fontSize: 14, color: "#64748b", marginBottom: 24 }}>
                Soyez le premier à gagner des XP et dominer le classement !
              </div>
              <Link
                href="/write"
                style={{
                  display: "inline-block",
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #6366f1, #ec4899)",
                  borderRadius: 12,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: "none",
                }}
              >
                Commencer à pratiquer →
              </Link>
            </div>
          )}

          {/* CTA: Earn XP */}
          <div
            style={{
              maxWidth: 700,
              margin: "16px auto 0",
              padding: "0 20px",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(236,72,153,0.1))",
                border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: 16,
                padding: "20px",
                display: "flex",
                alignItems: "center",
                gap: 16,
              }}
            >
              <div style={{ fontSize: 32 }}>⚡</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: "#e2e8f0", marginBottom: 4 }}>
                  Gagnez plus de XP !
                </div>
                <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>
                  +10 XP par dissertation · +20-50 XP par exercice · +100 XP par défi gagné
                </div>
              </div>
              <Link
                href="/challenges"
                style={{
                  padding: "10px 16px",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  borderRadius: 10,
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 13,
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                Défier
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
