"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Target, BookOpen, BarChart3, Award } from "lucide-react";
import { SiteLanguage } from "@/lib/translations";

interface MobileLandingProps {
  lang: SiteLanguage;
  t: any;
}

// Apple-style smooth easing
const smoothEasing: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Glass card component
function GlassCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: smoothEasing }}
      className={`bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Metric badge
function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-2xl font-semibold text-white">{value}</span>
      <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
    </div>
  );
}

// Step card
function StepCard({ number, title, description, icon: Icon, delay }: { number: string; title: string; description: string; icon: any; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay, ease: smoothEasing }}
      className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]"
    >
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-amber-400" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-amber-500 font-medium">{number}</span>
          <h3 className="text-sm font-medium text-slate-200">{title}</h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

// Primary CTA Button
function PrimaryCTA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}>
      <motion.div
        whileTap={{ scale: 0.97 }}
        className="relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative flex items-center justify-center gap-2 px-6 py-4 rounded-xl">
          <span className="font-semibold text-white">{children}</span>
          <motion.div
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight className="w-4 h-4 text-white" />
          </motion.div>
        </div>
      </motion.div>
    </Link>
  );
}

// Secondary button
function SecondaryCTA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}>
      <motion.div
        whileTap={{ scale: 0.97 }}
        className="flex items-center justify-center px-6 py-4 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] transition-colors"
      >
        <span className="font-medium text-slate-300">{children}</span>
      </motion.div>
    </Link>
  );
}

export function MobileLanding({ lang, t }: MobileLandingProps) {
  const copy = {
    en: {
      badge: "BAC 2026 Preparation",
      title: "Master your exam with precision",
      subtitle: "AI-powered diagnostics, personalized study plans, and real-time feedback to maximize your score.",
      primaryCta: "Start My Journey",
      secondaryCta: "Take Diagnostic",
      metrics: [
        { value: "06", label: "Sections" },
        { value: "17+", label: "Target Score" },
        { value: "AI", label: "Powered" }
      ],
      steps: [
        { number: "01", title: "Diagnose", description: "AI analyzes your current level in 5 minutes", icon: Target },
        { number: "02", title: "Train", description: "Follow your personalized study roadmap", icon: BookOpen },
        { number: "03", title: "Achieve", description: "Hit your target score with confidence", icon: Award }
      ]
    },
    fr: {
      badge: "Préparation Bac 2026",
      title: "Maîtrisez votre examen avec précision",
      subtitle: "Diagnostics IA, plans d'étude personnalisés et feedback en temps réel pour maximiser votre note.",
      primaryCta: "Commencer",
      secondaryCta: "Diagnostic",
      metrics: [
        { value: "06", label: "Sections" },
        { value: "17+", label: "Objectif" },
        { value: "IA", label: "Powered" }
      ],
      steps: [
        { number: "01", title: "Diagnostiquer", description: "L'IA analyse votre niveau actuel en 5 minutes", icon: Target },
        { number: "02", title: "Entraîner", description: "Suivez votre plan d'étude personnalisé", icon: BookOpen },
        { number: "03", title: "Réussir", description: "Atteignez votre objectif avec confiance", icon: Award }
      ]
    },
    ar: {
      badge: "تحضير الباك 2026",
      title: "تحكم في امتحانك بدقة",
      subtitle: "تشخيص ذكي، خطط دراسية مخصصة، وfeedback فوري لتحقيق أعلى نقطة.",
      primaryCta: "ابدأ الآن",
      secondaryCta: "التشخيص",
      metrics: [
        { value: "٠٦", label: "شعب" },
        { value: "١٧+", label: "الهدف" },
        { value: "AI", label: "ذكي" }
      ],
      steps: [
        { number: "٠١", title: "شخّص", description: "الذكاء الاصطناعي يحلل مستواك في 5 دقائق", icon: Target },
        { number: "٠٢", title: "تدرّب", description: "اتبع خطتك الدراسية المخصصة", icon: BookOpen },
        { number: "٠٣", title: "انجح", description: "حقق هدفك بثقة", icon: Award }
      ]
    }
  };

  const c = copy[lang] || copy.en;
  const isRTL = lang === "ar";

  return (
    <div className={`min-h-screen bg-[#0a0a0f] ${isRTL ? "rtl" : "ltr"}`}>
      {/* Hero Section */}
      <section className="relative px-5 pt-12 pb-8 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
        
        {/* Content */}
        <div className="relative">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-medium text-amber-400">{c.badge}</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-bold text-white leading-tight mb-4"
            style={{ textAlign: isRTL ? "right" : "left" }}
          >
            {c.title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base text-slate-400 leading-relaxed mb-8"
            style={{ textAlign: isRTL ? "right" : "left" }}
          >
            {c.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col gap-3 mb-8"
          >
            <PrimaryCTA href="/auth/signup">{c.primaryCta}</PrimaryCTA>
            <SecondaryCTA href="/diagnostic">{c.secondaryCta}</SecondaryCTA>
          </motion.div>

          {/* Metrics */}
          <GlassCard className="p-5" delay={0.4}>
            <div className="flex justify-around">
              {c.metrics.map((m, i) => (
                <Metric key={i} value={m.value} label={m.label} />
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Steps Section */}
      <section className="px-5 py-8">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-lg font-semibold text-white mb-4"
          style={{ textAlign: isRTL ? "right" : "left" }}
        >
          {lang === "en" ? "How it works" : lang === "fr" ? "Comment ça marche" : "كيف يعمل"}
        </motion.h2>

        <div className="space-y-3">
          {c.steps.map((step, i) => (
            <StepCard
              key={i}
              number={step.number}
              title={step.title}
              description={step.description}
              icon={step.icon}
              delay={0.1 + i * 0.1}
            />
          ))}
        </div>
      </section>

      {/* Bac Sections */}
      <section className="px-5 py-8">
        <GlassCard className="p-5" delay={0.2}>
          <h3 
            className="text-sm font-medium text-slate-300 mb-4"
            style={{ textAlign: isRTL ? "right" : "left" }}
          >
            {lang === "en" ? "All Bac Sections Covered" : lang === "fr" ? "Toutes les sections Bac" : "جميع شعب الباك"}
          </h3>
          <div className="flex flex-wrap gap-2">
            {["Maths", "Sciences", "Technique", "Éco", "Lettres", "Informatique"].map((section) => (
              <span 
                key={section}
                className="px-3 py-1.5 rounded-lg bg-white/[0.05] text-xs text-slate-400"
              >
                {section}
              </span>
            ))}
          </div>
        </GlassCard>
      </section>

      {/* Trust indicators */}
      <section className="px-5 py-8 border-t border-white/[0.04]">
        <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4" />
            {lang === "en" ? "Real-time analytics" : lang === "fr" ? "Analytics temps réel" : "تحليلات فورية"}
          </span>
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            {lang === "en" ? "Score tracking" : lang === "fr" ? "Suivi de notes" : "تتبع النقاط"}
          </span>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-5 py-8 pb-12">
        <GlassCard className="p-6 text-center" delay={0.2}>
          <p className="text-slate-400 text-sm mb-4">
            {lang === "en" 
              ? "Join thousands of students preparing for success" 
              : lang === "fr" 
              ? "Rejoignez des milliers d'étudiants qui se préparent" 
              : "انضم لآلاف الطلاب الذين يستعدون للنجاح"}
          </p>
          <PrimaryCTA href="/auth/signup">
            {lang === "en" ? "Get Started Free" : lang === "fr" ? "Commencer Gratuitement" : "ابدأ مجاناً"}
          </PrimaryCTA>
        </GlassCard>
      </section>
    </div>
  );
}
