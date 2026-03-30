"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { BookOpen, Target, TrendingUp, Award, Clock, Zap, Flame, Trophy } from "lucide-react";

// ==========================================
// DASHBOARD STAT CARD - 3D premium card
// ==========================================
interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  gradient?: string;
  delay?: number;
}

export function DashboardStatCard({ 
  title, 
  value, 
  change, 
  changeType = "positive",
  icon, 
  gradient = "from-indigo-500 to-purple-500",
  delay = 0 
}: StatCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8]);
  
  const springConfig = { damping: 20, stiffness: 300 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) / rect.width);
    y.set((e.clientY - centerY) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const changeColors = {
    positive: "text-emerald-400",
    negative: "text-red-400",
    neutral: "text-white/60"
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="relative group"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
      
      <div className="relative h-full p-6 rounded-2xl bg-[#0a0a12]/80 backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-300 group-hover:border-white/20 group-hover:shadow-xl group-hover:shadow-indigo-500/5">
        {/* Gradient border on hover */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 transition-opacity`} />
        
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
        />
        
        <div className="relative flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}>
            {icon}
          </div>
          {change && (
            <span className={`text-sm font-semibold ${changeColors[changeType]}`}>
              {change}
            </span>
          )}
        </div>
        
        <div className="relative">
          <motion.div
            className="text-3xl font-black text-white mb-1"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
          >
            {value}
          </motion.div>
          <div className="text-sm text-white/50">{title}</div>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// PROGRESS CARD - Circular progress with 3D
// ==========================================
interface ProgressCardProps {
  title: string;
  progress: number;
  total: number;
  subtitle: string;
  color?: string;
  delay?: number;
}

export function ProgressCard({ 
  title, 
  progress, 
  total, 
  subtitle,
  color = "#6366f1",
  delay = 0 
}: ProgressCardProps) {
  const percentage = Math.round((progress / total) * 100);
  const circumference = 2 * Math.PI * 45;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="relative group"
    >
      <div className="relative p-6 rounded-2xl bg-[#0a0a12]/80 backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-300 group-hover:border-white/20">
        <div className="flex items-center gap-6">
          {/* Circular progress */}
          <div className="relative w-28 h-28 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - (percentage / 100) * circumference }}
                transition={{ duration: 1.5, delay: delay + 0.3, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span 
                className="text-2xl font-black"
                style={{ color }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: delay + 0.5 }}
              >
                {percentage}%
              </motion.span>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
            <p className="text-sm text-white/50 mb-3">{subtitle}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: delay + 0.3 }}
                />
              </div>
              <span className="text-xs text-white/40">{progress}/{total}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// STREAK WIDGET - Gamified with animations
// ==========================================
interface StreakWidgetProps {
  currentStreak: number;
  bestStreak: number;
  daysThisWeek: number[]; // Array of completed days (0-6)
  delay?: number;
}

export function PremiumStreakWidget({ 
  currentStreak, 
  bestStreak, 
  daysThisWeek,
  delay = 0 
}: StreakWidgetProps) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -5 }}
      className="relative group"
    >
      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-orange-500/20 via-red-500/10 to-transparent border border-orange-500/20 overflow-hidden">
        {/* Animated flame background */}
        <motion.div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-orange-500/20 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        <div className="relative flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30"
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Flame className="w-6 h-6" />
            </motion.div>
            <div>
              <div className="text-2xl font-black text-white">{currentStreak}</div>
              <div className="text-sm text-white/60">Day streak</div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-white/40">Best: {bestStreak}</div>
            <div className="flex items-center gap-1 text-xs text-orange-400">
              <Trophy className="w-3 h-3" />
              Keep it up!
            </div>
          </div>
        </div>
        
        {/* Week progress */}
        <div className="flex justify-between">
          {days.map((day, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 0.1 + i * 0.05 }}
            >
              <motion.div
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                  daysThisWeek.includes(i) 
                    ? "bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-lg shadow-orange-500/20" 
                    : "bg-white/5 text-white/30"
                }`}
                whileHover={{ scale: 1.2 }}
                animate={daysThisWeek.includes(i) ? {
                  boxShadow: ["0 0 0px rgba(251,146,60,0)", "0 0 20px rgba(251,146,60,0.5)", "0 0 0px rgba(251,146,60,0)"]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {daysThisWeek.includes(i) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: delay + 0.3 + i * 0.1, type: "spring" }}
                  >
                    <Zap className="w-4 h-4" />
                  </motion.div>
                )}
              </motion.div>
              <span className="text-xs text-white/40">{day}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// LANGUAGE MODULE CARD - 3D interactive
// ==========================================
interface LanguageModuleProps {
  language: string;
  flag: string;
  progress: number;
  lessonsCompleted: number;
  totalLessons: number;
  color: string;
  delay?: number;
}

export function LanguageModuleCard({ 
  language, 
  flag, 
  progress, 
  lessonsCompleted, 
  totalLessons,
  color,
  delay = 0 
}: LanguageModuleProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        y: -8, 
        rotateY: 3,
        transition: { duration: 0.2 } 
      }}
      className="relative group cursor-pointer"
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
    >
      <motion.div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl"
        style={{ background: `linear-gradient(135deg, ${color}40, transparent)` }}
      />
      
      <div className="relative h-full p-6 rounded-2xl bg-[#0a0a12]/90 backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-300 group-hover:border-white/20">
        {/* Language accent line */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: color }}
          animate={{ scaleX: isHovered ? 1 : 0.3 }}
          transition={{ duration: 0.3 }}
        />
        
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{flag}</span>
            <div>
              <h3 className="text-lg font-bold text-white">{language}</h3>
              <p className="text-sm text-white/50">{lessonsCompleted}/{totalLessons} lessons</p>
            </div>
          </div>
          
          <motion.div
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 90 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/60">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.div>
        </div>
        
        {/* Progress visualization */}
        <div className="relative h-3 bg-white/10 rounded-full overflow-hidden mb-4">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: delay + 0.3 }}
          />
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold" style={{ color }}>{progress}%</span>
          <span className="text-xs text-white/40">Continue learning</span>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// ACTIVITY HEATMAP - GitHub-style contribution
// ==========================================
interface ActivityHeatmapProps {
  data: number[]; // Activity level 0-4 for each day
  delay?: number;
}

export function ActivityHeatmap({ data, delay = 0 }: ActivityHeatmapProps) {
  const levels = [
    "bg-white/5",
    "bg-emerald-500/30",
    "bg-emerald-500/50",
    "bg-emerald-500/70",
    "bg-emerald-500"
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
      className="relative p-6 rounded-2xl bg-[#0a0a12]/80 backdrop-blur-xl border border-white/10"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-white/60" />
          <span className="text-sm font-semibold text-white">Activity</span>
        </div>
        <span className="text-xs text-white/40">Last 30 days</span>
      </div>
      
      <div className="grid grid-cols-15 gap-1">
        {data.map((level, i) => (
          <motion.div
            key={i}
            className={`w-3 h-3 rounded-sm ${levels[level]}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + i * 0.01, type: "spring", stiffness: 500 }}
            whileHover={{ scale: 1.3, zIndex: 10 }}
          />
        ))}
      </div>
      
      <div className="flex items-center justify-end gap-2 mt-3 text-xs text-white/40">
        <span>Less</span>
        {levels.map((l, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm ${l}`} />
        ))}
        <span>More</span>
      </div>
    </motion.div>
  );
}

// ==========================================
// PREMIUM SIDEBAR - Glassmorphism with animations
// ==========================================
interface SidebarProps {
  items: { icon: React.ReactNode; label: string; href: string; active?: boolean }[];
  user: { name: string; avatar: string };
}

export function PremiumSidebar({ items, user }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="w-72 h-screen sticky top-0 p-6 flex flex-col gap-6 bg-[#0a0a12]/50 backdrop-blur-2xl border-r border-white/10"
    >
      {/* Logo */}
      <motion.div 
        className="flex items-center gap-3 px-2"
        whileHover={{ scale: 1.02 }}
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">
          B
        </div>
        <span className="text-xl font-bold text-white">BacExcellence</span>
      </motion.div>
      
      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-2">
        {items.map((item, i) => (
          <motion.a
            key={item.href}
            href={item.href}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            whileHover={{ x: 4 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              item.active 
                ? "bg-white/10 text-white shadow-lg shadow-white/5" 
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className={item.active ? "text-indigo-400" : ""}>{item.icon}</span>
            <span className="font-medium">{item.label}</span>
            {item.active && (
              <motion.div
                layoutId="activeIndicator"
                className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400"
              />
            )}
          </motion.a>
        ))}
      </nav>
      
      {/* User profile */}
      <motion.div 
        className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
        whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
      >
        <Image 
          src={user.avatar} 
          alt={user.name}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full border-2 border-indigo-500/50"
        />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white truncate">{user.name}</div>
          <div className="text-xs text-white/50">Pro Student</div>
        </div>
        <motion.button 
          whileHover={{ rotate: 90 }}
          className="text-white/40 hover:text-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </motion.button>
      </motion.div>
    </motion.aside>
  );
}

// ==========================================
// NOTIFICATION TOAST - Premium toast notification
// ==========================================
interface ToastProps {
  type: "success" | "info" | "achievement";
  title: string;
  message: string;
  onClose: () => void;
}

export function PremiumToast({ type, title, message, onClose }: ToastProps) {
  const icons = {
    success: <Award className="w-5 h-5 text-emerald-400" />,
    info: <Zap className="w-5 h-5 text-indigo-400" />,
    achievement: <Trophy className="w-5 h-5 text-amber-400" />
  };
  
  const gradients = {
    success: "from-emerald-500/20 to-transparent",
    info: "from-indigo-500/20 to-transparent",
    achievement: "from-amber-500/20 to-transparent"
  };
  
  return (
    <motion.div
      initial={{ x: 100, opacity: 0, scale: 0.9 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: 100, opacity: 0, scale: 0.9 }}
      className={`relative p-4 rounded-xl bg-gradient-to-r ${gradients[type]} backdrop-blur-xl border border-white/10 overflow-hidden`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
          {icons[type]}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-white">{title}</h4>
          <p className="text-xs text-white/60 mt-0.5">{message}</p>
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}
