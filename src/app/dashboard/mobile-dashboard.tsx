"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { DashboardIcon, FireIcon, ChartIcon, BookIcon, ClockIcon, ArrowRightIcon, TrophyIcon, TargetIcon } from "@/components/icons";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

interface MobileDashboardProps {
  user: any;
  profile: any;
  translations: any;
  lang: string;
}

interface ActivityItem {
  id: string;
  title: string;
  score: number | null;
  date: string;
  type: "essay" | "mock" | "lesson";
}

// Apple-style card with premium glass
function GlassCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-xl shadow-black/20 ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Premium score ring with glow
function ScoreRing({ value, size = 100 }: { value: number; size?: number }) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  
  const getColor = (v: number) => {
    if (v >= 80) return "#22c55e";
    if (v >= 60) return "#f59e0b";
    return "#ef4444";
  };
  
  const color = getColor(value);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <div 
        className="absolute inset-0 rounded-full blur-xl opacity-30"
        style={{ backgroundColor: color }}
      />
      <svg width={size} height={size} className="transform -rotate-90 relative">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ strokeDasharray: circumference, filter: `drop-shadow(0 0 6px ${color}50)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-white tracking-tight">{value}%</span>
      </div>
    </div>
  );
}

// Metric tile
function Metric({ icon: Icon, value, label, trend }: { icon: any; value: string; label: string; trend?: string }) {
  return (
    <div className="flex flex-col p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-slate-400" />
        <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-semibold text-white">{value}</span>
        {trend && <span className="text-xs text-emerald-400">{trend}</span>}
      </div>
    </div>
  );
}

// Activity row
function ActivityRow({ item, index }: { item: ActivityItem; index: number }) {
  const Icon = item.type === "mock" ? DashboardIcon : BookIcon;
  const color = item.type === "mock" ? "#10b981" : "#6366f1";
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-3 py-3 border-b border-white/[0.04] last:border-0"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/[0.04]">
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-200 truncate">{item.title}</p>
        <p className="text-xs text-slate-500">{item.date}</p>
      </div>
      {item.score && (
        <div className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/[0.06] text-slate-300">
          {item.score}/20
        </div>
      )}
    </motion.div>
  );
}

// Primary action button
function ActionButton({ href, icon: Icon, title, subtitle, color }: { href: string; icon: any; title: string; subtitle: string; color: string }) {
  return (
    <Link href={href}>
      <motion.div
        whileTap={{ scale: 0.97 }}
        className="relative overflow-hidden group"
      >
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(135deg, ${color}20, transparent)` }}
        />
        <div className="relative flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="w-5 h-5" style={{ color }} />
          </div>
          <div className="flex-1">
            <p className="font-medium text-slate-200">{title}</p>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
          <ArrowRightIcon className="w-4 h-4 text-slate-500" />
        </div>
      </motion.div>
    </Link>
  );
}

export function MobileDashboard({ user, profile, translations: t, lang }: MobileDashboardProps) {
  const [greeting, setGreeting] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(res => res.json())
      .then(data => {
        setData(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    const greetings: Record<string, { morning: string; afternoon: string; evening: string }> = {
      fr: { morning: "Bonjour", afternoon: "Bonjour", evening: "Bonsoir" },
      ar: { morning: "صباح الخير", afternoon: "مساء الخير", evening: "مساء النور" },
      en: { morning: "Good morning", afternoon: "Good afternoon", evening: "Good evening" }
    };
    const g = greetings[lang] || greetings.en;
    if (hour < 12) setGreeting(g.morning);
    else if (hour < 18) setGreeting(g.afternoon);
    else setGreeting(g.evening);
  }, [lang]);

  const stats = useMemo(() => {
    if (!data?.metrics) return { progress: 0, streak: 0, essays: 0, average: null };
    const avg = data.metrics.averageScore;
    return {
      progress: avg ? Math.round((avg / 20) * 100) : 0,
      streak: data.metrics.currentStreak || 0,
      essays: data.metrics.totalCorrections || 0,
      average: avg
    };
  }, [data]);

  const activity = useMemo(() => {
    if (!data?.recentSubmissions?.length) return [];
    return data.recentSubmissions.slice(0, 5).map((sub: any) => ({
      id: sub.id,
      title: sub.exam?.title || `${sub.language} Essay`,
      score: sub.overallScore,
      date: formatDistanceToNow(new Date(sub.createdAt), { addSuffix: false }),
      type: sub.exam ? "mock" : "essay"
    }));
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] p-5">
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-white/[0.03] rounded-2xl" />
          <div className="h-32 bg-white/[0.03] rounded-2xl" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-20 bg-white/[0.03] rounded-2xl" />
            <div className="h-20 bg-white/[0.03] rounded-2xl" />
            <div className="h-20 bg-white/[0.03] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-5 pb-28">
      {/* Header */}
      <GlassCard className="p-4 mb-4 flex items-center justify-between" delay={0}>
        <div>
          <p className="text-slate-500 text-sm">{greeting}</p>
          <h1 className="text-xl font-semibold text-white">{user.fullName?.split(" ")[0] || "Student"}</h1>
        </div>
        <div className="relative">
          <Image
            src={`https://ui-avatars.com/api/?name=${user.fullName}&background=6366f1&color=fff&size=96`}
            alt={user.fullName}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0a0a0f]" />
        </div>
      </GlassCard>

      {/* Main Score Card */}
      <GlassCard className="p-5 mb-4" delay={0.1}>
        <div className="flex items-center gap-5">
          <ScoreRing value={stats.progress} />
          <div className="flex-1">
            <p className="text-slate-500 text-sm mb-1">BAC Readiness</p>
            <p className="text-3xl font-semibold text-white mb-1">
              {stats.average ? stats.average.toFixed(1) : "--"}<span className="text-slate-500 text-lg">/20</span>
            </p>
            <div className="flex gap-2">
              {stats.streak > 0 && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400">
                  🔥 {stats.streak} streak
                </span>
              )}
              <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.06] text-slate-400">
                {profile.bacSection || "Science"}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Metrics */}
      <GlassCard className="mb-4" delay={0.15}>
        <div className="grid grid-cols-3 divide-x divide-white/[0.04]">
          <Metric icon={BookIcon} value={stats.essays.toString()} label="Essays" />
          <Metric icon={ChartIcon} value={stats.average ? stats.average.toFixed(1) : "--"} label="Avg" trend="+0.5" />
          <Metric icon={TrophyIcon} value="17.0" label="Target" />
        </div>
      </GlassCard>

      {/* Quick Actions */}
      <div className="space-y-2 mb-4">
        <ActionButton 
          href="/write" 
          icon={BookIcon} 
          title="Practice Writing" 
          subtitle="20 min essay session"
          color="#f59e0b"
        />
        <ActionButton 
          href="/exams" 
          icon={DashboardIcon} 
          title="Mock Exam" 
          subtitle="Test your readiness"
          color="#8b5cf6"
        />
        <ActionButton 
          href="/lessons" 
          icon={TargetIcon} 
          title="Daily Lesson" 
          subtitle="Grammar & vocabulary"
          color="#10b981"
        />
      </div>

      {/* Recent Activity */}
      <GlassCard className="p-4" delay={0.25}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-slate-300">Recent</h3>
          <Link href="/write" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            See all
          </Link>
        </div>
        
        <AnimatePresence>
          {activity.length > 0 ? (
            <div>
              {activity.map((item: ActivityItem, idx: number) => (
                <ActivityRow key={item.id} item={item} index={idx} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <p className="text-slate-500 text-sm mb-3">No activity yet</p>
              <Link 
                href="/write" 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.06] text-slate-300 text-sm font-medium hover:bg-white/[0.08] transition-colors"
              >
                Start writing
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </div>
  );
}
