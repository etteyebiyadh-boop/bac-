"use client";

import { useState, useEffect, useRef } from "react";
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
  Clock,
  ShieldCheck,
  ZapIcon,
  FlameIcon,
  CrownIcon
} from "lucide-react";
import { SiteLanguage } from "@/lib/translations";

interface NextLevelMobileProps {
  lang: SiteLanguage;
  t: any;
  isRTL: boolean;
}

const springTransition = {
  type: "spring" as const,
  stiffness: 260,
  damping: 20
};

export function NextLevelMobile({ lang, t, isRTL }: NextLevelMobileProps) {
  const [step, setStep] = useState(0); // 0: Intro, 1: Hero, 2: Config
  const [configStep, setConfigStep] = useState(1);
  const [formData, setFormData] = useState({ section: "", language: "" });
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Animation sequences
  useEffect(() => {
    const timer = setTimeout(() => setStep(1), 3000);
    return () => clearTimeout(timer);
  }, []);

  const copy = {
    en: {
      badge: "BAC 2026 ELITE",
      headline: "Master Your Baccalaureate",
      subheadline: "Join the top 2% of students with our AI-driven pedagogical engine.",
      cta: "Initialize My Path",
      sections: ["Mathematics", "Experimental Sciences", "Technical Sciences", "Economy & Management", "Letters", "Computer Science"],
      languages: ["German", "Spanish", "Italian", "Chinese"],
      next: "Continue",
      finish: "Activate My Roadmap",
      configTitle: "Configure Your Matrix",
      sectionLabel: "Select Your Section",
      langLabel: "Optional Language",
    },
    fr: {
      badge: "ELITE BAC 2026",
      headline: "Maîtrisez Votre Bac",
      subheadline: "Rejoignez le top 2% des élèves avec notre moteur pédagogique IA.",
      cta: "Initialiser Mon Parcours",
      sections: ["Mathématiques", "Sciences Expérimentales", "Sciences Techniques", "Économie et Gestion", "Lettres", "Informatique"],
      languages: ["Allemand", "Espagnol", "Italien", "Chinois"],
      next: "Continuer",
      finish: "Activer Ma Roadmap",
      configTitle: "Configuration de Matrice",
      sectionLabel: "Sélectionnez Votre Section",
      langLabel: "Langue Optionnelle",
    },
    ar: {
      badge: "نخبة الباك 2026",
      headline: "تمكّن من الباك",
      subheadline: "التحق بأفضل 2% من الطلاب مع محركنا البيداغوجي الذكي.",
      cta: "ابدأ مساري",
      sections: ["رياضيات", "علوم تجريبية", "علوم تقنية", "اقتصاد وتصرف", "آداب", "إعلامية"],
      languages: ["ألمانية", "إسبانية", "إيطالية", "صينية"],
      next: "متابعة",
      finish: "تفعيل خارطة الطريق",
      configTitle: "تهيئة مصفوفة الدراسة",
      sectionLabel: "اختر شعبتك",
      langLabel: "اللغة الاختيارية",
    }
  };

  const c = copy[lang] || copy.en;

  return (
    <div className={`relative min-h-screen bg-[#050508] text-white overflow-hidden ${isRTL ? "rtl" : "ltr"}`} ref={containerRef}>
      <AnimatePresence mode="wait">
        {/* Step 0: Cinematic Curtains / Intro */}
        {step === 0 && (
          <motion.div 
            key="intro"
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050508]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "circOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-amber-500/20 blur-[100px] rounded-full" />
              <div 
                className="w-24 h-24 bg-gradient-to-br from-white via-amber-400 to-amber-600 rounded-[24px] flex items-center justify-center border-2 border-white/20 shadow-[0_0_50px_rgba(245,158,11,0.3)]"
                style={{ transform: "rotate(-10deg)" }}
              >
                <span className="text-4xl font-black text-black">B</span>
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8 text-3xl font-black tracking-tighter text-center"
            >
              BAC<br/>EXCELLENCE
            </motion.h1>
            
            <div className="absolute bottom-12 w-48 h-[2px] bg-white/5 overflow-hidden">
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full bg-gradient-to-r from-transparent via-amber-500 to-transparent"
              />
            </div>
          </motion.div>
        )}

        {/* Step 1: Main Hero Experience */}
        {step === 1 && (
          <motion.div 
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            className="relative z-10 px-6 pt-24 pb-12 min-h-screen flex flex-col"
          >
            {/* Background Orbs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
               <motion.div 
                 animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
                 transition={{ duration: 20, repeat: Infinity }}
                 className="absolute -top-1/4 -right-1/4 w-[150vw] h-[150vw] bg-indigo-500/10 blur-[120px] rounded-full" 
               />
               <motion.div 
                 animate={{ scale: [1, 1.3, 1], x: [0, -30, 0], y: [0, -50, 0] }}
                 transition={{ duration: 15, repeat: Infinity, delay: 1 }}
                 className="absolute -bottom-1/4 -left-1/4 w-[120vw] h-[120vw] bg-amber-500/5 blur-[100px] rounded-full" 
               />
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center mb-8"
            >
              <span className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-black tracking-[0.2em] text-amber-500 uppercase">
                {c.badge}
              </span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl font-black text-center leading-[0.95] tracking-tight mb-6"
            >
              {c.headline}
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center text-slate-400 text-lg font-medium max-w-sm mx-auto mb-12"
            >
              {c.subheadline}
            </motion.p>

            <div className="grid grid-cols-2 gap-4 mb-12">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.3 }}
                 className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-3xl text-center"
               >
                 <div className="text-2xl font-black mb-1">17.5+</div>
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target Score</div>
               </motion.div>
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.4 }}
                 className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-3xl text-center"
               >
                 <div className="text-2xl font-black mb-1">Top 2%</div>
                 <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ranking</div>
               </motion.div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="mt-auto"
            >
               <button 
                 onClick={() => setStep(2)}
                 className="w-full py-6 rounded-3xl bg-white text-black font-black text-lg flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(255,255,255,0.2)] active:scale-95 transition-transform"
               >
                 {c.cta}
                 <ArrowRight className="w-5 h-5" />
               </button>
               <p className="text-center text-slate-500 text-xs mt-6 font-bold uppercase tracking-widest">
                 Bac Excellence &copy; 2026 Elite Edition
               </p>
            </motion.div>
          </motion.div>
        )}

        {/* Step 2: Interactive Configuration Flow */}
        {step === 2 && (
          <motion.div 
            key="config"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed inset-0 z-50 bg-[#050508] p-6 pt-20"
          >
            <div className="max-w-md mx-auto h-full flex flex-col">
               <div className="flex items-center justify-between mb-8">
                  <div className="stack">
                    <span className="text-[10px] font-black text-amber-500 tracking-widest uppercase">Step 0{configStep} of 02</span>
                    <h3 className="text-3xl font-black leading-tight">{c.configTitle}</h3>
                  </div>
                  <button 
                    onClick={() => setStep(1)}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400"
                  >
                    ✕
                  </button>
               </div>

               <AnimatePresence mode="wait">
                  {configStep === 1 && (
                    <motion.div 
                      key="s1"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex-1 overflow-y-auto pr-2"
                    >
                       <p className="text-slate-400 font-bold text-sm mb-6 uppercase tracking-widest">{c.sectionLabel}</p>
                       <div className="grid gap-3">
                          {c.sections.map(section => (
                            <button
                              key={section}
                              onClick={() => { setFormData({...formData, section}); setConfigStep(2); }}
                              className={`p-6 rounded-[24px] text-left transition-all border ${formData.section === section ? "bg-amber-500 border-amber-500 text-black" : "bg-white/[0.03] border-white/10 text-white"}`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-black text-lg">{section}</span>
                                {formData.section === section && <ShieldCheck className="w-6 h-6" />}
                              </div>
                            </button>
                          ))}
                       </div>
                    </motion.div>
                  )}

                  {configStep === 2 && (
                    <motion.div 
                      key="s2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="flex-1"
                    >
                       <p className="text-slate-400 font-bold text-sm mb-6 uppercase tracking-widest">{c.langLabel}</p>
                       <div className="grid gap-3 mb-12">
                          {c.languages.map(langName => (
                            <button
                              key={langName}
                              onClick={() => setFormData({...formData, language: langName})}
                              className={`p-6 rounded-[24px] text-left transition-all border ${formData.language === langName ? "bg-white text-black border-white" : "bg-white/[0.03] border-white/10 text-white"}`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-black text-lg">{langName}</span>
                                {formData.language === langName ? <CrownIcon className="w-6 h-6" /> : <div className="w-6 h-6 rounded-full border-2 border-white/20" />}
                              </div>
                            </button>
                          ))}
                       </div>

                       <div className="mt-auto">
                          <Link href="/auth/signup">
                            <button 
                              className="w-full py-6 rounded-3xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(79,70,229,0.4)] active:scale-95 transition-transform"
                            >
                              {c.finish}
                              <ZapIcon className="w-5 h-5 fill-white" />
                            </button>
                          </Link>
                          <button 
                            onClick={() => setConfigStep(1)}
                            className="w-full py-4 text-slate-500 text-sm font-black uppercase tracking-widest mt-4"
                          >
                            Back to sections
                          </button>
                       </div>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
