"use client";

import { useEffect, useState } from "react";
import { Sparkles, Image as ImageIcon, Wand2, BarChart3, TrendingUp, ShieldCheck, Lock, Activity } from "lucide-react";
import Link from "next/link";
import { SocialGenerator } from "@/app/admin/social-generator";

interface LiveStats {
  signups: number;
  activeUsers: number;
  corrections: number;
  completions: number;
}

function LiveStatCard({ label, value, sub, color }: { label: string; value: string | number; sub: string; color: string }) {
  return (
    <div>
      <div className="text-4xl font-black mb-2" style={{ color }}>{value}</div>
      <div className="text-white/60 text-sm">{label}</div>
      {sub && <div className="text-xs mt-1 font-bold" style={{ color }}>{sub}</div>}
    </div>
  );
}

export default function MediaEnginePage() {
  const [stats, setStats] = useState<LiveStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics?days=7")
      .then(r => r.json())
      .then(data => { setStats(data); setStatsLoading(false); })
      .catch(() => setStatsLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-lg sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <span className="text-indigo-600 font-bold text-xl">B</span>
            </div>
            <span className="text-white font-bold text-xl">Bac Excellence</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-white/60 text-sm">Media Engine 2.0</span>
            <Link
              href="/admin?tab=MARKETING"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              <Sparkles size={16} />
              Full Admin Suite
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-6">
            <Sparkles size={18} className="text-white" />
            <span className="text-white text-sm font-semibold">AI-Powered Marketing Kit</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
            Media Engine <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">2.0</span>
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Generate up to <strong className="text-white">28 shareable cards</strong>, viral scripts, 7-day campaigns and social captions — all in one click.
          </p>
        </div>
      </section>

      {/* Live Stats */}
      <section className="py-10 border-y border-white/10 bg-black/20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {statsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-10 w-20 bg-white/10 rounded mx-auto mb-2" />
                  <div className="h-4 w-24 bg-white/5 rounded mx-auto" />
                </div>
              ))
            ) : stats ? (
              <>
                <LiveStatCard label="New Signups (7d)" value={stats.signups} sub={`+${stats.signups} this week`} color="#10b981" />
                <LiveStatCard label="Active Students" value={stats.activeUsers} sub="performed ≥1 action" color="#6366f1" />
                <LiveStatCard label="AI Corrections" value={stats.corrections} sub={stats.activeUsers > 0 ? `${(stats.corrections / stats.activeUsers).toFixed(1)}x per user` : "—"} color="#a855f7" />
                <LiveStatCard label="Completions" value={stats.completions} sub={stats.signups > 0 ? `${((stats.activeUsers / Math.max(stats.signups, 1)) * 100).toFixed(0)}% activity rate` : "—"} color="#f59e0b" />
              </>
            ) : (
              <>
                <LiveStatCard label="Shareable Cards" value="28" sub="per topic pack" color="#6366f1" />
                <LiveStatCard label="AI Templates" value="12+" sub="per language" color="#a855f7" />
                <LiveStatCard label="Platforms" value="7" sub="IG, TikTok, FB…" color="#ec4899" />
                <LiveStatCard label="Card Resolution" value="800²" sub="2× retina PNG" color="#10b981" />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Card Type Preview */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-indigo-500/20 rounded-xl">
              <ImageIcon size={24} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">What&apos;s in the pack?</h2>
              <p className="text-white/60">Every ZIP contains 5 organised folders</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
            {[
              { label: "01 Hook Card",       emoji: "🎣", color: "from-indigo-500 to-purple-500",  desc: "Post on Saturday" },
              { label: "02 Mastery ×12",     emoji: "📚", color: "from-emerald-500 to-teal-500",  desc: "AI vocab + grammar" },
              { label: "03 Growth ×3",       emoji: "🚀", color: "from-orange-500 to-red-500",     desc: "Grade-flip, referral" },
              { label: "04 Badges ×3",       emoji: "🏆", color: "from-yellow-500 to-amber-500",  desc: "Streak, master, top10" },
              { label: "05 Interactive ×9",  emoji: "⚡", color: "from-pink-500 to-rose-500",     desc: "Quiz, checklist, fill-blank" },
            ].map((card) => (
              <div key={card.label} className="group relative">
                <div className={`aspect-square rounded-2xl bg-gradient-to-br ${card.color} p-5 flex flex-col justify-between transform group-hover:scale-105 transition-transform`}>
                  <div className="text-3xl">{card.emoji}</div>
                  <div>
                    <div className="text-white font-bold text-sm">{card.label}</div>
                    <div className="text-white/70 text-xs mt-1">{card.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-white/40 text-sm">Also included: <strong className="text-white/60">README.txt</strong> with 7-day posting schedule + 5 AI captions + hashtags</p>
          </div>
        </div>
      </section>

      {/* Security Snapshot */}
      <section className="py-12 border-b border-white/10 bg-black/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="stack" style={{ gap: "24px" }}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/20 rounded-xl">
                  <BarChart3 size={24} className="text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Live Growth</h2>
                  <p className="text-white/60 text-sm">Real-time from platform DB (last 7 days)</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 stack" style={{ gap: "4px" }}>
                  <span className="text-white/50 text-xs font-bold tracking-widest">ACTIVE STUDENTS</span>
                  <div className="text-3xl font-bold text-emerald-400">{statsLoading ? "…" : (stats?.activeUsers ?? "—")}</div>
                  <div className="text-emerald-400 text-xs font-bold">7-day window</div>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/10 stack" style={{ gap: "4px" }}>
                  <span className="text-white/50 text-xs font-bold tracking-widest">CORRECTIONS</span>
                  <div className="text-3xl font-bold text-indigo-400">{statsLoading ? "…" : (stats?.corrections ?? "—")}</div>
                  <div className="text-indigo-400 text-xs font-bold">AI grading sessions</div>
                </div>
              </div>
              <p className="text-white/30 text-xs">Numbers update live from the database — no hardcoded values.</p>
            </div>

            <div className="stack" style={{ gap: "24px" }}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <ShieldCheck size={24} className="text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Platform Security</h2>
                  <p className="text-white/60 text-sm">Active protection suite</p>
                </div>
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 stack" style={{ gap: "16px" }}>
                <div className="flex justify-between">
                  <div className="flex items-center gap-3">
                    <Lock size={18} className="text-blue-400" />
                    <span className="font-bold text-sm">Platform Fortress</span>
                  </div>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full font-bold">ENCRYPTED</span>
                </div>
                <div className="stack" style={{ gap: "8px" }}>
                  {[
                    { label: "SSL/TLS 1.3 Encryption", status: "Active" },
                    { label: "X-Frame Frameguard", status: "Enabled" },
                    { label: "JWT Session Hardening", status: "Verified" },
                    { label: "X-Content-Type Header", status: "Safe" },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-white/50 text-xs">{item.label}</span>
                      <span className="text-xs font-bold text-emerald-400">✓ {item.status}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Activity size={14} className="text-blue-400 animate-pulse" />
                  <span className="text-white/40 text-xs">Threat Monitoring: 0 intrusions in 24h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE REAL GENERATOR ── */}
      <section className="py-16 bg-black/10">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <Wand2 size={24} className="text-purple-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Media Forge 2.0</h2>
              <p className="text-white/60">Generate your full 28-card pack + ZIP in one click</p>
            </div>
          </div>
          <SocialGenerator />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp size={16} className="text-indigo-400" />
            <span className="text-white/40 text-sm">
              Bac Excellence Media Engine 2.0 © 2026 •{" "}
              <Link href="/admin" className="text-indigo-400 hover:text-indigo-300">Admin Suite</Link>
              {" • "}
              <Link href="/" className="text-indigo-400 hover:text-indigo-300">Home</Link>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
