"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Target,
  BookOpen,
  BarChart3,
  Zap,
  ChevronRight,
  Star,
  TrendingUp,
  Award,
  Clock
} from "lucide-react";
import { SiteLanguage } from "@/lib/translations";

interface NextLevelMobileProps {
  lang: SiteLanguage;
  t: any;
  isRTL: boolean;
}

// Spring physics for premium feel
const springTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30
};

// Stagger children animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springTransition
  }
};

// Animated gradient mesh background
function AnimatedMesh() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      
      {/* Animated orbs */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-[100px]"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-indigo-500/10 blur-[80px]"
        animate={{
          x: [0, -40, 0],
          y: [0, -30, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-purple-500/5 blur-[60px]"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
}

// Glass card component
function GlassCard({ 
  children, 
  className = "",
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={itemVariants}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] ${className}`}
    >
      {/* Shine effect on hover */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
      </div>
      <div className="relative">{children}</div>
    </motion.div>
  );
}

// Feature row with icon
function FeatureRow({ 
  icon: Icon, 
  title, 
  description,
  delay 
}: { 
  icon: any; 
  title: string; 
    description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ ...springTransition, delay }}
      className="flex items-start gap-4 p-4"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-amber-400" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0 mt-1" />
    </motion.div>
  );
}

// Stats pill
function StatPill({ value, label, icon: Icon }: { value: string; label: string; icon: any }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/[0.03] border border-white/[0.06]">
      <Icon className="w-3.5 h-3.5 text-amber-500" />
      <span className="text-sm font-semibold text-white">{value}</span>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  );
}

// Section badge
function SectionBadge({ name, color }: { name: string; color: string }) {
  return (
    <motion.span
      whileTap={{ scale: 0.95 }}
      className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-slate-300"
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-2`} style={{ backgroundColor: color }} />
      {name}
    </motion.span>
  );
}

export function NextLevelMobile({ lang, t, isRTL }: NextLevelMobileProps) {
  const [activeTab, setActiveTab] = useState(0);

  const copy = {
    en: {
      badge: "BAC 2026 Preparation",
      headline: "Your Path to Excellence",
      subheadline: "Master the Bac with AI-powered personalized study plans",
      cta: "Start My Journey",
      ctaSub: "Free. No credit card required.",
      features: [
        { icon: Target, title: "Smart Diagnostics", desc: "AI analyzes your level in 5 minutes" },
        { icon: BookOpen, title: "Personalized Roadmap", desc: "Study plan adapted to your section" },
        { icon: BarChart3, title: "Progress Tracking", desc: "Real-time score predictions" },
        { icon: Zap, title: "Mock Exams", desc: "Timed practice under exam conditions" }
      ],
      stats: [
        { value: "50K+", label: "Students", icon: Star },
        { value: "17+", label: "Target Score", icon: TrendingUp },
        { value: "98%", label: "Success", icon: Award }
      ],
      sections: [
        { name: "Math", color: "#f59e0b" },
        { name: "Science", color: "#10b981" },
        { name: "Tech", color: "#6366f1" },
        { name: "Eco", color: "#ec4899" },
        { name: "Lettres", color: "#8b5cf6" },
        { name: "Info", color: "#06b6d4" }
      ],
      trustBadge: "Trusted by 50,000+ students"
    },
    fr: {
      badge: "Préparation Bac 2026",
      headline: "Votre Voie vers l'Excellence",
      subheadline: "Maîtrisez le Bac avec des plans d'étude IA personnalisés",
      cta: "Commencer Mon Parcours",
      ctaSub: "Gratuit. Sans engagement.",
      features: [
        { icon: Target, title: "Diagnostics Intelligents", desc: "L'IA analyse votre niveau en 5 min" },
        { icon: BookOpen, title: "Parcours Personnalisé", desc: "Plan adapté à votre section" },
        { icon: BarChart3, title: "Suivi de Progrès", desc: "Prédictions de notes en temps réel" },
        { icon: Zap, title: "Examens Blancs", desc: "Pratique chronométrée" }
      ],
      stats: [
        { value: "50K+", label: "Étudiants", icon: Star },
        { value: "17+", label: "Objectif", icon: TrendingUp },
        { value: "98%", label: "Réussite", icon: Award }
      ],
      sections: [
        { name: "Math", color: "#f59e0b" },
        { name: "Sciences", color: "#10b981" },
        { name: "Tech", color: "#6366f1" },
        { name: "Éco", color: "#ec4899" },
        { name: "Lettres", color: "#8b5cf6" },
        { name: "Info", color: "#06b6d4" }
      ],
      trustBadge: "Utilisé par 50 000+ étudiants"
    },
    ar: {
      badge: "تحضير الباك 2026",
      headline: "طريقك نحو التميز",
      subheadline: "تفوق في الباك مع خطط دراسية ذكية مخصصة",
      cta: "ابدأ رحلتي",
      ctaSub: "مجاني. بدون بطاقة بنكية.",
      features: [
        { icon: Target, title: "تشخيص ذكي", desc: "الذكاء الاصطناعي يحلل مستواك في 5 دقائق" },
        { icon: BookOpen, title: "خطة مخصصة", desc: "خطة دراسية تتكيف مع شعبتك" },
        { icon: BarChart3, title: "تتبع التقدم", desc: "توقع درجاتك في الوقت الفعلي" },
        { icon: Zap, title: "اختبارات تجريبية", desc: "تمرين بضغط الامتحان" }
      ],
      stats: [
        { value: "50K+", label: "طالب", icon: Star },
        { value: "17+", label: "الهدف", icon: TrendingUp },
        { value: "98%", label: "نجاح", icon: Award }
      ],
      sections: [
        { name: "رياضيات", color: "#f59e0b" },
        { name: "علوم", color: "#10b981" },
        { name: "تقنية", color: "#6366f1" },
        { name: "اقتصاد", color: "#ec4899" },
        { name: "آداب", color: "#8b5cf6" },
        { name: "إعلامية", color: "#06b6d4" }
      ],
      trustBadge: "موثوق من 50,000+ طالب"
    }
  };

  const c = copy[lang] || copy.en;

  return (
    <div className={`relative min-h-screen bg-slate-950 overflow-x-hidden ${isRTL ? "rtl" : "ltr"}`}>
      <AnimatedMesh />

      {/* Main Content */}
      <div className="relative z-10 px-5 pt-12 pb-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-md mx-auto"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-medium text-amber-400">{c.badge}</span>
            </span>
          </motion.div>

          {/* Hero Title */}
          <motion.h1 
            variants={itemVariants}
            className="text-3xl sm:text-4xl font-bold text-center text-white mb-3 leading-tight"
          >
            {c.headline.split(" ").map((word, i) => (
              <span key={i}>
                {i === c.headline.split(" ").length - 1 ? (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">
                    {word}
                  </span>
                ) : (
                  word + " "
                )}
              </span>
            ))}
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-center text-slate-400 text-sm mb-8 px-4"
          >
            {c.subheadline}
          </motion.p>

          {/* Primary CTA */}
          <motion.div variants={itemVariants} className="mb-4">
            <Link href="/auth/signup">
              <motion.div
                whileTap={{ scale: 0.97 }}
                className="group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-400 rounded-xl" />
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center justify-center gap-2 px-6 py-4 rounded-xl">
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span className="font-semibold text-slate-950">{c.cta}</span>
                  <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            </Link>
            <p className="text-center text-xs text-slate-500 mt-2">{c.ctaSub}</p>
          </motion.div>

          {/* Stats Pills */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-2 mb-8"
          >
            {c.stats.map((stat, i) => (
              <StatPill key={i} {...stat} />
            ))}
          </motion.div>

          {/* Features Card */}
          <GlassCard className="mb-6" delay={0.3}>
            <div className="p-1">
              {c.features.map((feature, i) => (
                <FeatureRow
                  key={i}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.desc}
                  delay={0.4 + i * 0.1}
                />
              ))}
            </div>
          </GlassCard>

          {/* Sections Supported */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mb-6"
          >
            <p className="text-xs text-slate-500 text-center mb-3">
              {lang === "en" ? "All Bac Sections Supported" : lang === "fr" ? "Toutes les sections Bac" : "جميع شعب الباك المدعومة"}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {c.sections.map((section, i) => (
                <SectionBadge key={i} {...section} />
              ))}
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex items-center justify-center gap-4 text-xs text-slate-500"
          >
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {lang === "en" ? "5 min setup" : lang === "fr" ? "5 min setup" : "٥ دقائق إعداد"}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              {c.trustBadge}
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom CTA Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, ...springTransition }}
        className="relative z-10 px-5 pb-8"
      >
        <GlassCard className="p-5">
          <div className="text-center">
            <p className="text-sm text-slate-300 mb-3">
              {lang === "en" 
                ? "Join the students already preparing for success" 
                : lang === "fr" 
                ? "Rejoignez les étudiants qui se préparent" 
                : "انضم للطلاب الذين يستعدون للنجاح"}
            </p>
            <Link href="/auth/signup">
              <motion.span
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 text-amber-400 font-medium text-sm"
              >
                {lang === "en" ? "Get Started Free →" : lang === "fr" ? "Commencer Gratuitement →" : "ابدأ مجاناً →"}
              </motion.span>
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
