"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { HeroPathSelector } from "@/components/home-path-selector";
import { BookOpen, PenTool, Library, Target, ArrowRight, GraduationCap, Users, Award, Clock, Star, Sparkles, Zap, TrendingUp, CheckCircle2, Play } from "lucide-react";
import { SiteLanguage } from "@/lib/translations";
import { useRef } from "react";

interface HomeClientProps {
  lang: SiteLanguage;
  t: any;
  isRTL: boolean;
}

// Animated text reveal component
function AnimatedTitle({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ');
  return (
    <motion.h1 className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 50, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.8, delay: i * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
          className="inline-block"
          style={{ transformOrigin: 'bottom', marginRight: '0.3em' }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
}

// Trust badge component
function TrustBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8 }}
      className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
    >
      {icon}
      <span className="text-sm font-medium text-white/90">{text}</span>
    </motion.div>
  );
}

// Floating card component
function FloatingCard({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.215, 0.61, 0.355, 1] }}
      className={`absolute ${className}`}
      style={{ willChange: 'transform' }}
    >
      <motion.div
        animate={{ y: [0, -12, 0], rotate: [0, 1.5, -1.5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="bg-white rounded-2xl shadow-2xl shadow-black/20 p-5 border border-slate-100/50"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// Cinematic Hero - 1000/10 Premium
function CinematicHero({ badge, title, subtitle, ctaText, ctaHref, secondaryCtaText, secondaryCtaHref, isRTL, lang }: any) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/30" />
        <motion.div
          className="absolute top-1/4 left-1/4 w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 60%)' }}
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 60%)' }}
          animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`, backgroundSize: '80px 80px' }}
      />

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-20">
        <div className={`grid lg:grid-cols-2 gap-16 items-center ${isRTL ? 'rtl' : ''}`}>
          {/* Text Content */}
          <div className="relative">
            {/* Badge with pulse */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 mb-8"
            >
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-sm font-semibold text-amber-400 tracking-wider uppercase">{badge}</span>
            </motion.div>

            {/* Animated Title */}
            <AnimatedTitle text={title} className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight" />

            {/* Subtitle */}
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="text-xl text-slate-400 mb-8 leading-relaxed max-w-xl">{subtitle}</motion.p>

            {/* CTAs */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="flex flex-col sm:flex-row gap-4 mb-12">
              <motion.a href={ctaHref} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/30 transition-all">
                <Sparkles className="w-5 h-5 mr-2" />
                {ctaText}
                <motion.span className="ml-2" animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                </motion.span>
              </motion.a>
              {secondaryCtaText && (
                <motion.a href={secondaryCtaHref} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center justify-center px-8 py-4 text-white font-medium rounded-xl border border-white/20 hover:bg-white/5 backdrop-blur-sm transition-all">
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  {secondaryCtaText}
                </motion.a>
              )}
            </motion.div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3">
              <TrustBadge icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />} text={isRTL ? "معتمد من الوزارة" : (lang === "fr" ? "Ministère approuvé" : "Ministry approved")} />
              <TrustBadge icon={<Users className="w-4 h-4 text-amber-400" />} text={isRTL ? "٥٠ ألف طالب" : (lang === "fr" ? "50K+ étudiants" : "50K+ students")} />
              <TrustBadge icon={<Star className="w-4 h-4 text-yellow-400" />} text="4.9/5 Rating" />
            </div>
          </div>

          {/* Visual Side - Floating Cards */}
          <div className="relative hidden lg:block h-[500px] w-full">
            <FloatingCard delay={0.5} className="top-0 left-[5%] z-30">
              <div className="flex items-center gap-3 w-52">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">{isRTL ? "المعدل المتوقع" : (lang === "fr" ? "Score Prévu" : "Predicted")}</div>
                  <div className="text-2xl font-bold text-slate-900">17.5/20</div>
                </div>
              </div>
            </FloatingCard>

            <FloatingCard delay={0.7} className="top-28 right-[10%] z-20">
              <div className="w-56">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600 font-medium">{isRTL ? "التقدم" : (lang === "fr" ? "Progression" : "Progress")}</span>
                  <span className="font-bold text-amber-600">87%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full" 
                    initial={{ width: 0 }} 
                    animate={{ width: "87%" }} 
                    transition={{ delay: 1.2, duration: 1.2, ease: "easeOut" }} 
                  />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span>+12% {isRTL ? "هذا الشهر" : (lang === "fr" ? "ce mois" : "this month")}</span>
                </div>
              </div>
            </FloatingCard>

            <FloatingCard delay={0.9} className="bottom-24 left-[15%] z-10">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-1.5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 border-2 border-white flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5 text-white" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">14 {isRTL ? "يوم" : (lang === "fr" ? "jours" : "days")}</div>
                  <div className="text-xs text-slate-500">{isRTL ? "أداء ممتاز" : (lang === "fr" ? "Excellente série!" : "Great streak!")}</div>
                </div>
              </div>
            </FloatingCard>

            <FloatingCard delay={1.1} className="bottom-4 right-[5%]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{isRTL ? "اختبار مُنجز" : (lang === "fr" ? "Examen réussi" : "Exam passed")}</div>
                  <div className="text-lg font-bold text-emerald-600">18/20</div>
                </div>
              </div>
            </FloatingCard>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-2">
            <span className="text-xs text-slate-500 uppercase tracking-widest">{isRTL ? "اسحب للأسفل" : (lang === "fr" ? "Défiler" : "Scroll")}</span>
            <div className="w-6 h-10 rounded-full border-2 border-slate-600 flex justify-center pt-2">
              <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

// Premium stat card
function PremiumStatCard({ value, label, icon, delay = 0 }: { value: string; label: string; icon: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      className="text-center p-8 rounded-2xl bg-gradient-to-b from-white to-slate-50 border border-slate-200 hover:border-amber-500/30 hover:shadow-lg transition-all duration-300"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ duration: 0.3 }}
        className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white mb-4 shadow-lg shadow-amber-500/30"
      >
        {icon}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: delay + 0.2 }}
        className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2"
      >
        {value}
      </motion.div>
      <div className="text-sm font-medium text-slate-500">{label}</div>
    </motion.div>
  );
}

// Premium feature card
function PremiumFeatureCard({ icon, title, description, delay = 0 }: { icon: React.ReactNode; title: string; description: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-amber-500/30 hover:bg-white/10 transition-all duration-500"
    >
      <div className="relative">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mb-5 group-hover:from-amber-500 group-hover:to-amber-600 transition-all duration-500">
          <div className="text-slate-300 group-hover:text-white transition-colors duration-500">{icon}</div>
        </div>
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

// Premium series card
function PremiumSeriesCard({ name, isRTL, lang, index }: { name: string; isRTL: boolean; lang: string; index: number }) {
  const labels: Record<string, string> = {
    'Maths': isRTL ? 'الرياضيات' : (lang === 'fr' ? 'Mathématiques' : 'Mathematics'),
    'Sciences': isRTL ? 'العلوم' : (lang === 'fr' ? 'Sciences' : 'Sciences'),
    'Technique': isRTL ? 'التقنية' : (lang === 'fr' ? 'Technique' : 'Technical'),
    'Econ': isRTL ? 'الاقتصاد' : (lang === 'fr' ? 'Économie' : 'Economy'),
    'Lettres': isRTL ? 'الآداب' : (lang === 'fr' ? 'Lettres' : 'Literature'),
    'Info': isRTL ? 'إعلامية' : (lang === 'fr' ? 'Informatique' : 'Computer Science'),
    'Sport': isRTL ? 'رياضة' : (lang === 'fr' ? 'Sport' : 'Sports'),
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ x: isRTL ? -8 : 8, scale: 1.02 }}
      className="group flex items-center justify-between p-5 rounded-xl bg-white border border-slate-200 hover:border-amber-500/50 hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center group-hover:from-amber-500 group-hover:to-amber-600 transition-all duration-300">
          <span className="text-sm font-bold text-slate-700 group-hover:text-white transition-colors">{name.slice(0, 2)}</span>
        </div>
        <div>
          <div className="font-semibold text-slate-900">{name}</div>
          <div className="text-xs text-slate-500">{labels[name] || name}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2.5 h-2.5 rounded-full bg-emerald-500"
        />
        <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
          {isRTL ? 'متاح' : (lang === 'fr' ? 'ACTIF' : 'ACTIVE')}
        </span>
      </div>
    </motion.div>
  );
}

// Section title with premium styling
function SectionTitle({ eyebrow, title, subtitle, centered = true }: { eyebrow: string; title: string; subtitle?: string; centered?: boolean }) {
  return (
    <div className={`max-w-3xl ${centered ? 'mx-auto text-center' : ''}`}>
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`inline-flex items-center gap-3 text-sm font-semibold text-amber-600 uppercase tracking-wider mb-4 ${centered ? '' : ''}`}
      >
        {!centered && <span className="w-8 h-[2px] bg-amber-500" />}
        {eyebrow}
        <span className={`h-[2px] bg-amber-500 ${centered ? 'w-8' : 'w-8'}`} />
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight"
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

// Clean Feature Card
function FeatureCard({ icon, title, description, delay = 0 }: { icon: React.ReactNode; title: string; description: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="group p-6 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
    >
      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-slate-900 transition-colors">
        <div className="text-slate-600 group-hover:text-white transition-colors">{icon}</div>
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

// Stat Card - Clean numbers
function StatCard({ value, label, icon, delay = 0 }: { value: string; label: string; icon: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="text-center"
    >
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 text-slate-600 mb-3">
        {icon}
      </div>
      <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
    </motion.div>
  );
}

// Series Card
function SeriesCard({ name, isRTL, lang, index }: { name: string; isRTL: boolean; lang: string; index: number }) {
  const labels: Record<string, string> = {
    'Maths': isRTL ? 'الرياضيات' : (lang === 'fr' ? 'Mathématiques' : 'Mathematics'),
    'Sciences': isRTL ? 'العلوم' : (lang === 'fr' ? 'Sciences' : 'Sciences'),
    'Technique': isRTL ? 'التقنية' : (lang === 'fr' ? 'Technique' : 'Technical'),
    'Econ': isRTL ? 'الاقتصاد' : (lang === 'fr' ? 'Économie' : 'Economy'),
    'Lettres': isRTL ? 'الآداب' : (lang === 'fr' ? 'Lettres' : 'Literature'),
    'Info': isRTL ? 'إعلامية' : (lang === 'fr' ? 'Informatique' : 'Computer Science'),
    'Sport': isRTL ? 'رياضة' : (lang === 'fr' ? 'Sport' : 'Sports'),
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center justify-between p-4 rounded-lg bg-white border border-slate-200 hover:border-slate-400 transition-colors cursor-pointer"
    >
      <div>
        <div className="font-semibold text-slate-900">{name}</div>
        <div className="text-xs text-slate-500">{labels[name] || name}</div>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="text-xs font-medium text-emerald-600 uppercase tracking-wider">
          {isRTL ? 'متاح' : (lang === 'fr' ? 'DISPONIBLE' : 'AVAILABLE')}
        </span>
      </div>
    </motion.div>
  );
}

export function HomeClient({ lang, t, isRTL }: HomeClientProps) {
  return (
    <div className="bg-slate-50">
      {/* Cinematic Hero */}
      <CinematicHero
        badge={isRTL ? "المنصة الرائدة للبكالوريا التونسية 2026" : (lang === "fr" ? "La plateforme référence du Bac 2026" : "The definitive Bac platform 2026")}
        title={t.hero_title}
        subtitle={t.hero_subtitle}
        ctaText={t.hero_cta}
        ctaHref="#selector"
        secondaryCtaText={isRTL ? "شاهد العرض التوضيحي" : (lang === "fr" ? "Voir la démo" : "Watch demo")}
        secondaryCtaHref="/demo"
        isRTL={isRTL}
        lang={lang}
      />

      {/* Stats Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white" />
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <PremiumStatCard value="50K+" label={isRTL ? "طالب مسجل" : (lang === "fr" ? "Étudiants" : "Students")} icon={<Users className="w-6 h-6" />} delay={0} />
            <PremiumStatCard value="17.2" label={isRTL ? "متوسط النقاط" : (lang === "fr" ? "Moyenne" : "Average")} icon={<Award className="w-6 h-6" />} delay={0.1} />
            <PremiumStatCard value="97%" label={isRTL ? "نسبة النجاح" : (lang === "fr" ? "Réussite" : "Pass Rate")} icon={<GraduationCap className="w-6 h-6" />} delay={0.2} />
            <PremiumStatCard value="24/7" label={isRTL ? "دعم AI" : (lang === "fr" ? "Support IA" : "AI Support")} icon={<Clock className="w-6 h-6" />} delay={0.3} />
          </div>
        </div>
      </section>

      {/* Path Selector Section */}
      <section id="selector" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <SectionTitle
            eyebrow={isRTL ? "ابدأ رحلتك" : (lang === "fr" ? "Commencez" : "Get Started")}
            title={isRTL ? "من أي نقطة تبدأ؟" : (lang === "fr" ? "Par où commencer ?" : "Where do you start?")}
            subtitle={isRTL
              ? "حدد شعبتك واحصل على خطة دراسية مخصصة للحصول على 17/20"
              : (lang === "fr"
                ? "Sélectionnez votre section et obtenez un plan d'étude personnalisé pour viser 17/20"
                : "Select your section and get a personalized study plan to target 17/20")}
          />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-16"
          >
            <HeroPathSelector lang={lang} />
          </motion.div>
        </div>
      </section>

      {/* Bac Sections */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className={`grid lg:grid-cols-2 gap-16 items-start ${isRTL ? 'rtl' : ''}`}>
            <div>
              <SectionTitle
                eyebrow={isRTL ? "جميع الشعب" : (lang === "fr" ? "Toutes les séries" : "All Series")}
                title={isRTL ? "متوافق مع جميع شعب البكالوريا" : (lang === "fr" ? "Compatible avec toutes les séries" : "Compatible with all series")}
                subtitle={isRTL
                  ? "من الرياضيات إلى الاقتصاد، لدينا تغطية شاملة لجميع المواد"
                  : (lang === "fr"
                    ? "Des mathématiques à l'économie, couverture complète de toutes les matières"
                    : "From Mathematics to Economy, complete coverage of all subjects")}
                centered={false}
              />
              <div className="mt-10 space-y-4">
                {['Maths', 'Sciences', 'Technique', 'Econ', 'Lettres', 'Info', 'Sport'].map((s, i) => (
                  <PremiumSeriesCard key={s} name={s} isRTL={isRTL} lang={lang} index={i} />
                ))}
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-3xl blur-3xl" />
              <Image
                src="/sections.png"
                alt="Bac Sections"
                width={600}
                height={400}
                className="relative rounded-2xl shadow-2xl border border-slate-200"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-500 uppercase tracking-wider mb-4"
            >
              <span className="w-8 h-[2px] bg-amber-500" />
              {t.feat_eyebrow}
              <span className="w-8 h-[2px] bg-amber-500" />
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              {t.feat_title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-400"
            >
              {t.feat_subtitle}
            </motion.p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <PremiumFeatureCard
              icon={<PenTool className="w-6 h-6" />}
              title={t.feat_writing_title}
              description={t.feat_writing_desc}
              delay={0}
            />
            <PremiumFeatureCard
              icon={<BookOpen className="w-6 h-6" />}
              title={t.feat_reading_title}
              description={t.feat_reading_desc}
              delay={0.1}
            />
            <PremiumFeatureCard
              icon={<Library className="w-6 h-6" />}
              title={t.feat_library_title}
              description={t.feat_library_desc}
              delay={0.2}
            />
            <PremiumFeatureCard
              icon={<Target className="w-6 h-6" />}
              title={t.feat_missions_title}
              description={t.feat_missions_desc}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-amber-500/10 blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 mb-8 shadow-2xl shadow-amber-500/30"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {t.cta_title}
            </h2>
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
              {t.cta_subtitle}
            </p>
            <motion.a
              href="/auth/signup"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-lg rounded-xl hover:shadow-xl hover:shadow-amber-500/30 transition-all"
            >
              <Zap className="w-5 h-5 mr-2" />
              {t.cta_btn}
              <motion.span
                className="ml-2"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              </motion.span>
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
