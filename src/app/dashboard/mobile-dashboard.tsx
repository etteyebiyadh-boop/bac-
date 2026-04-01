"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { DashboardIcon, FireIcon, ChartIcon, BookIcon, ClockIcon, ArrowRightIcon } from "@/components/icons";
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

// Premium card with subtle glass effect
function PremiumCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl border border-white/5 rounded-3xl ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Animated circular progress
function RingProgress({ value, size = 120, strokeWidth = 8, color = "#f59e0b" }: { value: number; size?: number; strokeWidth?: number; color?: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
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
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{value}%</span>
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">Ready</span>
      </div>
    </div>
  );
}

// Stat pill
function StatPill({ icon: Icon, value, label, color }: { icon: any; value: string; label: string; color: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <div className="text-lg font-bold text-white leading-none">{value}</div>
        <div className="text-xs text-slate-400 mt-0.5">{label}</div>
      </div>
    </div>
  );
}

// Activity item
function ActivityItem({ item, index }: { item: ActivityItem; index: number }) {
  const Icon = item.type === "mock" ? DashboardIcon : BookIcon;
  const color = item.type === "mock" ? "#10b981" : "#6366f1";
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0"
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{item.title}</p>
        <p className="text-xs text-slate-500">{item.date} ago</p>
      </div>
      {item.score && (
        <div className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ backgroundColor: `${color}20`, color }}>
          {item.score}/20
        </div>
      )}
    </motion.div>
  );
}

// Primary CTA Button
function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}>
      <motion.div
        whileTap={{ scale: 0.98 }}
        className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-4 flex items-center justify-between group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <BookIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg">Start Practice</p>
            <p className="text-amber-100/80 text-sm">20 min essay session</p>
          </div>
        </div>
        <motion.div
          animate={{ x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="relative"
        >
          <ArrowRightIcon className="w-6 h-6 text-white" />
        </motion.div>
      </motion.div>
    </Link>
  );
}

export function MobileDashboard({ user, profile, translations: t, lang }: MobileDashboardProps) {
  const [greeting, setGreeting] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  // Fetch data once
  useEffect(() => {
    fetch("/api/dashboard")
      .then(res => res.json())
      .then(data => {
        setData(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  // Memoized greeting
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

  // Memoized calculations
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
    return data.recentSubmissions.slice(0, 3).map((sub: any) => ({
      id: sub.id,
      title: sub.exam?.title || `${sub.language} Essay`,
      score: sub.overallScore,
      date: formatDistanceToNow(new Date(sub.createdAt), { addSuffix: false }),
      type: sub.exam ? "mock" : "essay"
    }));
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 p-5 pb-24">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-white/5 rounded-2xl" />
          <div className="h-40 bg-white/5 rounded-3xl" />
          <div className="h-20 bg-white/5 rounded-2xl" />
          <div className="h-32 bg-white/5 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-5 pb-24">
      {/* Header */}
      <PremiumCard className="p-4 mb-4 flex items-center justify-between" delay={0}>
        <div>
          <p className="text-slate-400 text-sm">{greeting}</p>
          <h1 className="text-xl font-bold text-white">{user.fullName?.split(" ")[0] || "Student"}</h1>
        </div>
        <div className="relative">
          <Image
            src={`https://ui-avatars.com/api/?name=${user.fullName}&background=6366f1&color=fff&size=96`}
            alt={user.fullName}
            width={44}
            height={44}
            className="rounded-full border-2 border-amber-500/30"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950" />
        </div>
      </PremiumCard>

      {/* Main Progress Card */}
      <PremiumCard className="p-6 mb-4" delay={0.1}>
        <div className="flex items-center gap-6">
          <RingProgress value={stats.progress} />
          <div className="flex-1">
            <p className="text-slate-400 text-sm mb-1">BAC Progress</p>
            <p className="text-2xl font-bold text-white mb-2">
              {stats.average ? stats.average.toFixed(1) : "--"}<span className="text-slate-500 text-lg">/20</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">
                🔥 {stats.streak} day streak
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400">
                {profile.bacSection || "Science"}
              </span>
            </div>
          </div>
        </div>
      </PremiumCard>

      {/* Primary CTA */}
      <div className="mb-4">
        <PrimaryButton href="/write">
          Start Practice
        </PrimaryButton>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatPill icon={BookIcon} value={stats.essays.toString()} label="Essays written" color="#6366f1" />
        <StatPill icon={ChartIcon} value={stats.average ? `${stats.average.toFixed(1)}/20` : "--"} label="Best score" color="#10b981" />
      </div>

      {/* Secondary Actions */}
      <PremiumCard className="p-4 mb-4" delay={0.3}>
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: DashboardIcon, label: "Mock Exams", href: "/exams", color: "#8b5cf6" },
            { icon: FireIcon, label: "BAC Week", href: "/bac-week", color: "#ec4899" },
            { icon: ClockIcon, label: "Lessons", href: "/lessons", color: "#f59e0b" }
          ].map((action) => (
            <Link key={action.href} href={action.href}>
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <action.icon className="w-6 h-6" style={{ color: action.color }} />
                <span className="text-xs text-slate-300 text-center">{action.label}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </PremiumCard>

      {/* Recent Activity */}
      <PremiumCard className="p-4" delay={0.4}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white">Recent Activity</h3>
          <Link href="/write" className="text-xs text-amber-500 hover:text-amber-400 transition-colors">
            View all
          </Link>
        </div>
        
        <AnimatePresence>
          {activity.length > 0 ? (
            <div>
              {activity.map((item: ActivityItem, idx: number) => (
                <ActivityItem key={item.id} item={item} index={idx} />
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 text-sm font-medium"
              >
                Write first essay
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </PremiumCard>
    </div>
  );
}
