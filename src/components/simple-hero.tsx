"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Award } from "lucide-react";
import { SiteLanguage } from "@/lib/translations";

interface SimpleHeroProps {
  lang: SiteLanguage;
  t: any;
  isRTL: boolean;
}

export function SimpleHero({ lang, t, isRTL }: SimpleHeroProps) {
  const copy = {
    en: {
      badge: "BAC 2026 • Now Open",
      title: "Your path to",
      titleHighlight: "17/20",
      subtitle: "AI-powered preparation for the Tunisian Baccalaureate. Personalized study plans, essay feedback, and mock exams.",
      cta: "Start Free",
      ctaSub: "No credit card required"
    },
    fr: {
      badge: "BAC 2026 • Ouvert",
      title: "Votre chemin vers",
      titleHighlight: "17/20",
      subtitle: "Préparation IA pour le Baccalauréat tunisien. Plans d'étude personnalisés, corrections d'essais et examens blancs.",
      cta: "Commencer",
      ctaSub: "Gratuit, sans engagement"
    },
    ar: {
      badge: "الباك 2026 • مفتوح",
      title: "طريقك نحو",
      titleHighlight: "17/20",
      subtitle: "تحضير ذكي للباكالوريا التونسية. خطط دراسية مخصصة، تصحيح مقالات واختبارات تجريبية.",
      cta: "ابدأ مجاناً",
      ctaSub: "مجاني، بدون بطاقة بنكية"
    }
  };

  const c = copy[lang] || copy.en;

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 py-20 overflow-hidden bg-slate-950">
      {/* Simple gradient background - no Three.js */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/20" />
      
      {/* Static decorative elements - minimal, no animation */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="absolute bottom-40 right-10 w-40 h-40 rounded-full bg-indigo-500/10 blur-3xl" />

      {/* Content */}
      <div className={`relative z-10 max-w-lg mx-auto w-full ${isRTL ? "text-right" : "text-left"}`}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-xs font-medium text-white/70">{c.badge}</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4"
        >
          {c.title}{" "}
          <span className="text-amber-400">{c.titleHighlight}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base text-slate-400 leading-relaxed mb-8"
        >
          {c.subtitle}
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            href="/auth/signup"
            className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl transition-colors"
          >
            {c.cta}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-xs text-slate-500 mt-2">{c.ctaSub}</p>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-2 mt-10"
        >
          {[
            { icon: Sparkles, text: lang === "en" ? "AI Feedback" : lang === "fr" ? "Correction IA" : "تصحيح ذكي" },
            { icon: Zap, text: lang === "en" ? "Mock Exams" : lang === "fr" ? "Examens blancs" : "اختبارات تجريبية" },
            { icon: Award, text: lang === "en" ? "All Sections" : lang === "fr" ? "Toutes sections" : "جميع الشعب" }
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-slate-400"
            >
              <item.icon className="w-3.5 h-3.5 text-amber-500" />
              {item.text}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Simple stats at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="relative z-10 mt-auto pt-12"
      >
        <div className="flex justify-center gap-8 sm:gap-12">
          {[
            { value: "50K+", label: lang === "en" ? "Students" : lang === "fr" ? "Étudiants" : "طالب" },
            { value: "17/20", label: lang === "en" ? "Target" : lang === "fr" ? "Objectif" : "الهدف" },
            { value: "98%", label: lang === "en" ? "Success" : lang === "fr" ? "Réussite" : "نجاح" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
