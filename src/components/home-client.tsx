"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { HeroPathSelector } from "@/components/home-path-selector";
import { BookOpen, PenTool, Library, Target, ArrowRight, Sparkles, Zap, Award, Star, Trophy, Crown } from "lucide-react";
import { SiteLanguage } from "@/lib/translations";

interface HomeClientProps {
  lang: SiteLanguage;
  t: any;
  isRTL: boolean;
}

// Particle component for background
function Particle({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 bg-amber-400/30 rounded-full"
      initial={{ 
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
        y: typeof window !== 'undefined' ? window.innerHeight : 800 
      }}
      animate={{ 
        y: -10,
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)
      }}
      transition={{ 
        duration: 8 + Math.random() * 4, 
        repeat: Infinity, 
        delay,
        ease: "linear"
      }}
    />
  );
}

// Floating Score Badge (3D effect)
function ScoreBadge() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);
  
  const springConfig = { stiffness: 100, damping: 20 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  return (
    <motion.div
      className="absolute right-8 top-1/4 hidden lg:block"
      style={{ perspective: 1000 }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left - rect.width / 2);
        mouseY.set(e.clientY - rect.top - rect.height / 2);
      }}
      initial={{ opacity: 0, scale: 0, rotateY: 180 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 1, delay: 0.8, type: "spring" }}
    >
      <motion.div
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d"
        }}
        className="relative w-32 h-32"
      >
        {/* Glowing background */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl blur-xl opacity-50 animate-pulse" />
        
        {/* Main badge */}
        <div className="relative w-full h-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded-2xl flex flex-col items-center justify-center shadow-2xl border border-amber-300/50">
          <Crown className="w-8 h-8 text-amber-100 mb-1" />
          <span className="text-4xl font-black text-white">17</span>
          <span className="text-xs text-amber-100 font-bold">/20</span>
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
            <Star className="w-4 h-4 text-white fill-white" />
          </div>
        </div>
        
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/30 to-transparent"
          animate={{ x: [-100, 200], opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="text-center mt-2 text-amber-400/80 text-sm font-medium"
      >
        Your Target
      </motion.p>
    </motion.div>
  );
}

// Typing text effect
function TypeText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i <= text.length) {
          setDisplayText(text.slice(0, i));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);
  
  return (
    <span>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-0.5 h-8 bg-amber-400 ml-1 align-middle"
      />
    </span>
  );
}

// Eye-catching gradient hero
function EyeCatchingHero({ badge, title, subtitle, ctaText, ctaHref, secondaryCtaText, secondaryCtaHref, isRTL }: any) {
  const particles = Array.from({ length: 30 }, (_, i) => i);
  const words = title.split(' ');
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950"
      onMouseMove={handleMouseMove}
    >
      {/* Particle background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((i) => (
          <Particle key={i} delay={i * 0.3} />
        ))}
      </div>
      
      {/* BAC Diploma Background */}
      <BacDiploma mouseX={mouseX} mouseY={mouseY} />
      
      {/* Ambient glow effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/90 to-amber-950/20" />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      {/* 3D Score Badge */}
      <ScoreBadge />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge with glow */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 relative group cursor-pointer hover:bg-white/10 transition-colors"
        >
          <motion.span 
            className="w-2 h-2 rounded-full bg-emerald-400"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-sm font-medium text-white/80">{badge}</span>
          <motion.div
            className="absolute inset-0 rounded-full bg-amber-400/20 blur-md -z-10"
            animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Animated title with staggered word reveal */}
        <motion.h1
          className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.1] min-h-[1.2em]"
        >
          {words.map((word: string, i: number, arr: string[]) => (
            <motion.span 
              key={i} 
              className="inline-block mr-3"
              initial={{ opacity: 0, y: 40, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.3 + i * 0.1,
                type: "spring",
                stiffness: 100
              }}
              style={{
                background: i >= arr.length - 2
                  ? 'linear-gradient(135deg, #f59e0b, #fbbf24, #f59e0b, #fbbf24)' 
                  : 'linear-gradient(135deg, #ffffff, #e2e8f0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundSize: i >= arr.length - 2 ? '200% 200%' : '100% 100%',
                animation: i >= arr.length - 2 ? 'gradient 3s ease infinite' : 'none'
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtitle with typing effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed h-16"
        >
          <TypeText text={subtitle} delay={1000} />
        </motion.div>

        {/* CTAs with hover effects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href={ctaHref}
            className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span 
              className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <span className="relative z-10 flex items-center gap-2">
              {ctaText}
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
          </motion.a>
          
          {secondaryCtaText && (
            <motion.a
              href={secondaryCtaHref}
              className="px-8 py-4 text-white font-medium rounded-full border border-white/20 hover:bg-white/5 transition-colors relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">{secondaryCtaText}</span>
            </motion.a>
          )}
        </motion.div>

        {/* Animated feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="flex flex-wrap items-center justify-center gap-8 mt-12 text-sm text-slate-400"
        >
          {[
            { icon: Sparkles, text: "AI Writing Feedback" },
            { icon: Zap, text: "Personalized Path" },
            { icon: Award, text: "All Bac Sections" },
            { icon: Trophy, text: "17/20 Guarantee" }
          ].map((item, i) => (
            <motion.div 
              key={item.text}
              className="flex items-center gap-2 cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5 + i * 0.1 }}
              whileHover={{ scale: 1.1, color: '#f59e0b' }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <item.icon className="w-4 h-4 text-amber-500" />
              </motion.div>
              <span>{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Animated scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
      >
        <motion.div 
          className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div 
            className="w-1.5 h-1.5 rounded-full bg-amber-400"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      <style jsx global>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
}

// BAC Diploma SVG Component
function BacDiploma({ mouseX, mouseY }: { mouseX: any; mouseY: any }) {
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);
  const springRotateX = useSpring(rotateX, { stiffness: 50, damping: 20 });
  const springRotateY = useSpring(rotateY, { stiffness: 50, damping: 20 });

  return (
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ perspective: 1000 }}
    >
      <motion.svg
        width="600"
        height="800"
        viewBox="0 0 600 800"
        fill="none"
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d"
        }}
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 0.15, scale: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        {/* Diploma Background */}
        <rect x="50" y="50" width="500" height="700" rx="20" fill="#1a1a2e" stroke="#f59e0b" strokeWidth="3" />
        
        {/* Inner Border */}
        <rect x="70" y="70" width="460" height="660" rx="15" stroke="#f59e0b" strokeWidth="1" strokeDasharray="10 5" fill="none" opacity="0.5" />
        
        {/* Republic of Tunisia Seal */}
        <circle cx="300" cy="150" r="50" fill="#f59e0b" opacity="0.8" />
        <circle cx="300" cy="150" r="40" fill="#1a1a2e" />
        <text x="300" y="140" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold">REPUBLIC</text>
        <text x="300" y="160" textAnchor="middle" fill="#f59e0b" fontSize="10">of TUNISIA</text>
        
        {/* Ministry Title */}
        <text x="300" y="240" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold" opacity="0.9">Ministry of Education</text>
        
        {/* BAC Title */}
        <text x="300" y="300" textAnchor="middle" fill="#f59e0b" fontSize="32" fontWeight="900">BACCALAUREATE</text>
        <text x="300" y="340" textAnchor="middle" fill="#fbbf24" fontSize="18" opacity="0.8">Diploma</text>
        
        {/* Decorative Line */}
        <line x1="150" y1="380" x2="450" y2="380" stroke="#f59e0b" strokeWidth="2" opacity="0.5" />
        
        {/* Awarded to */}
        <text x="300" y="430" textAnchor="middle" fill="#94a3b8" fontSize="12" fontStyle="italic">This diploma is awarded to</text>
        
        {/* Student Name Placeholder */}
        <text x="300" y="480" textAnchor="middle" fill="#fff" fontSize="28" fontWeight="bold">YOU</text>
        
        {/* Score Display */}
        <rect x="200" y="520" width="200" height="80" rx="10" fill="#f59e0b" opacity="0.9" />
        <text x="300" y="560" textAnchor="middle" fill="#1a1a2e" fontSize="36" fontWeight="900">17.00</text>
        <text x="300" y="580" textAnchor="middle" fill="#1a1a2e" fontSize="14" fontWeight="bold">/ 20</text>
        
        {/* Mention */}
        <text x="300" y="640" textAnchor="middle" fill="#22c55e" fontSize="20" fontWeight="bold">Très Bien</text>
        
        {/* Session */}
        <text x="300" y="690" textAnchor="middle" fill="#64748b" fontSize="12">Session: June 2026</text>
        
        {/* Corner Decorations */}
        <circle cx="100" cy="100" r="8" fill="#f59e0b" opacity="0.6" />
        <circle cx="500" cy="100" r="8" fill="#f59e0b" opacity="0.6" />
        <circle cx="100" cy="700" r="8" fill="#f59e0b" opacity="0.6" />
        <circle cx="500" cy="700" r="8" fill="#f59e0b" opacity="0.6" />
      </motion.svg>
    </motion.div>
  );
}
function SectionTitle({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="inline-block text-sm font-bold tracking-widest uppercase bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent mb-4"
      >
        {eyebrow}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-600"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

// Feature card with hover effect
function FeatureCard({ icon, title, description, gradient }: { icon: React.ReactNode; title: string; description: string; gradient: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={`relative p-[1px] rounded-2xl bg-gradient-to-br ${gradient}`}
    >
      <div className="p-8 rounded-2xl bg-[#0a0a12]/90 backdrop-blur-xl h-full">
        <div className="flex flex-col h-full">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/30 to-amber-600/30 flex items-center justify-center mb-4">
            <div className="text-amber-400">{icon}</div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-white/60 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Stat card
function StatCard({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      className="text-center p-6 rounded-2xl bg-gradient-to-b from-white to-slate-50 border border-slate-200 hover:border-amber-500/30 hover:shadow-lg transition-all"
    >
      <div className="flex justify-center mb-3 text-amber-500">{icon}</div>
      <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
        {value}
      </div>
      <div className="text-sm text-slate-500 mt-1">{label}</div>
    </motion.div>
  );
}

export function HomeClient({ lang, t, isRTL }: HomeClientProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <EyeCatchingHero
        badge={isRTL ? "✨ نسخة 2026 - مباشرة" : (lang === "fr" ? "✨ ÉDITION 2026 - EN DIRECT" : "✨ 2026 EDITION - LIVE")}
        title={t.hero_title}
        subtitle={t.hero_subtitle}
        ctaText={t.hero_cta}
        ctaHref="#selector"
        secondaryCtaText={t.hero_explore}
        secondaryCtaHref="/lessons"
        isRTL={isRTL}
      />

      {/* Path Selector Section */}
      <section id="selector" className="relative py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <SectionTitle
            eyebrow={isRTL ? "خارطة الطريق متاعك" : (lang === "fr" ? "Moteur de Personnalisation" : "Personalization Engine")}
            title={isRTL ? "منين تحب تبدا؟" : (lang === "fr" ? "Par où commencer ?" : "Where do you start?")}
            subtitle={isRTL 
              ? "اختار شعبتك واللغات اللي تقراهم باش نطلعولك الـ Roadmap اللي توصلك للـ 17/20."
              : (lang === "fr" 
                ? "Choisissez votre section et langue optionnelle pour générer votre roadmap personnalisée."
                : "Select your section and optional language to generate your custom 17/20 roadmap.")}
          />

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <HeroPathSelector lang={lang} />
          </motion.div>
        </div>
      </section>

      {/* Bac Sections Showcase */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block text-sm font-bold tracking-widest uppercase bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent mb-4">
                {isRTL ? "جميع الشعب موجودة" : (lang === "fr" ? "Toutes les séries incluses" : "All Series Included")}
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                {isRTL ? "مصممة لكل شعبة بالتدقيق." : (lang === "fr" ? "Adapté à chaque section." : "Tailored for every single section.")}
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                {isRTL 
                  ? "من الماط للاقتصاد، خدمنا على كل كبيرة وصغيرة في المنهج التونسي باش تضمن أحسن الأعداد."
                  : (lang === "fr" 
                    ? "Des mathématiques à l'économie, nous avons cartographié chaque exigence du programme."
                    : "From Mathematics to Economy, we've mapped every syllabus requirement, coefficient, and exam pattern unique to your track.")}
              </p>

              <div className="space-y-3">
                {['Maths', 'Sciences', 'Technique', 'Econ', 'Lettres', 'Info', 'Sport'].map((s, i) => (
                  <motion.div 
                    key={s}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ x: 8, backgroundColor: "rgba(245,158,11,0.05)" }}
                    className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-500/30 transition-all cursor-pointer"
                  >
                    <span className="font-bold text-slate-900">{s}</span>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-sm text-emerald-600 font-semibold">
                        {isRTL ? "موجود" : (lang === "fr" ? "PRÊT" : "READY")}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-3xl blur-2xl" />
              <Image 
                src="/sections.png" 
                alt="Bac Sections"
                width={600}
                height={400}
                className="relative rounded-3xl shadow-2xl shadow-black/20"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle
            eyebrow={t.feat_eyebrow}
            title={t.feat_title}
            subtitle={t.feat_subtitle}
          />

          <div className="grid md:grid-cols-2 gap-6 mt-16">
            <FeatureCard 
              icon={<PenTool className="w-7 h-7" />}
              title={t.feat_writing_title}
              description={t.feat_writing_desc}
              gradient="from-amber-500/30 via-orange-500/20 to-red-500/10"
            />
            <FeatureCard 
              icon={<BookOpen className="w-7 h-7" />}
              title={t.feat_reading_title}
              description={t.feat_reading_desc}
              gradient="from-emerald-500/30 via-teal-500/20 to-cyan-500/10"
            />
            <FeatureCard 
              icon={<Library className="w-7 h-7" />}
              title={t.feat_library_title}
              description={t.feat_library_desc}
              gradient="from-blue-500/30 via-indigo-500/20 to-violet-500/10"
            />
            <FeatureCard 
              icon={<Target className="w-7 h-7" />}
              title={t.feat_missions_title}
              description={t.feat_missions_desc}
              gradient="from-rose-500/30 via-pink-500/20 to-purple-500/10"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-amber-500/5" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard 
              value="50K+" 
              label={isRTL ? "طالب" : (lang === "fr" ? "Étudiants" : "Students")} 
              icon={<Sparkles className="w-5 h-5" />}
            />
            <StatCard 
              value="17/20" 
              label={isRTL ? "متوسط النتائج" : (lang === "fr" ? "Moyenne" : "Avg Score")} 
              icon={<Award className="w-5 h-5" />}
            />
            <StatCard 
              value="98%" 
              label={isRTL ? "نسبة النجاح" : (lang === "fr" ? "Réussite" : "Success")} 
              icon={<Zap className="w-5 h-5" />}
            />
            <StatCard 
              value="24/7" 
              label={isRTL ? "دعم AI" : (lang === "fr" ? "Support IA" : "AI Support")} 
              icon={<ArrowRight className="w-5 h-5" />}
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-12 md:p-20 rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950"
          >
            {/* Animated glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/10 blur-3xl" />
            
            <div className="relative text-center max-w-2xl mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 mb-8 shadow-lg shadow-amber-500/30"
              >
                <Sparkles className="w-8 h-8 text-white" />
              </motion.div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {t.cta_title}
              </h2>
              <p className="text-xl text-slate-400 mb-10">
                {t.cta_subtitle}
              </p>
              
              <motion.a
                href="/auth/signup"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-full hover:shadow-lg hover:shadow-amber-500/30 transition-all"
              >
                {t.cta_btn}
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

