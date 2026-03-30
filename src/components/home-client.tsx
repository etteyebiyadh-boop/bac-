"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { HeroPathSelector } from "@/components/home-path-selector";
import { BookOpen, PenTool, Library, Target, ArrowRight, Sparkles, Zap, Award } from "lucide-react";
import { SiteLanguage } from "@/lib/translations";

interface HomeClientProps {
  lang: SiteLanguage;
  t: any;
  isRTL: boolean;
}

// Premium Hero with gradient animations
function PremiumHero({ badge, title, subtitle, ctaText, ctaHref, secondaryCtaText, secondaryCtaHref }: any) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-30 animate-float-slow" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)', top: '-10%', left: '-10%' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-20 animate-float-slow-reverse" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)', bottom: '-5%', right: '-5%' }} />
        <div className="absolute w-[300px] h-[300px] rounded-full opacity-25 animate-float" style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.4) 0%, transparent 70%)', top: '40%', right: '20%' }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-medium text-white/80">{badge}</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-[1.1]">
          {title.split(' ').map((word: string, i: number, arr: string[]) => (
            <span key={i} className="inline-block" style={{ background: i === arr.length - 1 ? 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)' : 'none', WebkitBackgroundClip: i === arr.length - 1 ? 'text' : 'initial', WebkitTextFillColor: i === arr.length - 1 ? 'transparent' : 'white' }}>
              {word}&nbsp;
            </span>
          ))}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10">
          {subtitle}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href={ctaHref} className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-lg hover:shadow-white/20">
            <span className="relative z-10">{ctaText}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          {secondaryCtaText && <a href={secondaryCtaHref} className="px-8 py-4 text-white font-medium rounded-full border border-white/20 hover:bg-white/5 transition-colors">{secondaryCtaText}</a>}
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2 animate-bounce">
          <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
        </div>
      </div>
    </section>
  );
}

// Section title with animations
function SectionTitle({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center max-w-3xl mx-auto">
      <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-block text-sm font-bold tracking-widest uppercase bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent mb-4">{eyebrow}</motion.span>
      <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">{title}</motion.h2>
      {subtitle && <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-lg text-white/60">{subtitle}</motion.p>}
    </div>
  );
}

// Feature card with hover effects
function FeatureCard({ icon, title, description, gradient }: { icon: React.ReactNode; title: string; description: string; gradient: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.3 }} className={`relative p-[1px] rounded-2xl bg-gradient-to-br ${gradient}`}>
      <div className="p-8 rounded-2xl bg-[#0a0a12]/90 backdrop-blur-xl h-full">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center mb-4"><div className="text-indigo-400">{icon}</div></div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/60 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

// Stat card
function StatCard({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} whileHover={{ scale: 1.05 }} className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
      <div className="flex justify-center mb-3 text-indigo-400">{icon}</div>
      <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">{value}</div>
      <div className="text-sm text-white/50 mt-1">{label}</div>
    </motion.div>
  );
}

export function HomeClient({ lang, t, isRTL }: HomeClientProps) {
  return (
    <div className="relative overflow-hidden">
      <PremiumHero badge={isRTL ? "✨ نسخة 2026 - مباشرة" : (lang === "fr" ? "✨ ÉDITION 2026 - EN DIRECT" : "✨ 2026 EDITION - LIVE")} title={t.hero_title} subtitle={t.hero_subtitle} ctaText={t.hero_cta} ctaHref="#selector" secondaryCtaText={t.hero_explore} secondaryCtaHref="/lessons" />

      {/* Path Selector */}
      <section id="selector" className="relative py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6">
          <SectionTitle eyebrow={isRTL ? "خارطة الطريق متاعك" : (lang === "fr" ? "Moteur de Personnalisation" : "Personalization Engine")} title={isRTL ? "منين تحب تبدا؟" : (lang === "fr" ? "Par où commencer ?" : "Where do you start?")} subtitle={isRTL ? "اختار شعبتك واللغات اللي تقراهم باش نطلعولك الـ Roadmap اللي توصلك للـ 17/20." : (lang === "fr" ? "Choisissez votre section et langue optionnelle pour générer votre roadmap personnalisée." : "Select your section and optional language to generate your custom 17/20 roadmap.")} />
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="mt-16"><HeroPathSelector lang={lang} /></motion.div>
        </div>
      </section>

      {/* Bac Sections */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="inline-block text-sm font-bold tracking-widest uppercase bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent mb-4">{isRTL ? "جميع الشعب موجودة" : (lang === "fr" ? "Toutes les séries incluses" : "All Series Included")}</span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">{isRTL ? "مصممة لكل شعبة بالتدقيق." : (lang === "fr" ? "Adapté à chaque section." : "Tailored for every single section.")}</h2>
              <p className="text-lg text-white/60 mb-8">{isRTL ? "من الماط للاقتصاد، خدمنا على كل كبيرة وصغيرة في المنهج التونسي باش تضمن أحسن الأعداد." : (lang === "fr" ? "Des mathématiques à l'économie, nous avons cartographié chaque exigence du programme." : "From Mathematics to Economy, we've mapped every syllabus requirement, coefficient, and exam pattern unique to your track.")}</p>
              <div className="space-y-3">
                {['Maths', 'Sciences', 'Technique', 'Econ', 'Lettres', 'Info', 'Sport'].map((s, i) => (
                  <motion.div key={s} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} whileHover={{ x: 8 }} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-pointer">
                    <span className="font-bold text-white">{s}</span>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /><span className="text-sm text-emerald-400 font-semibold">{isRTL ? "موجود" : (lang === "fr" ? "PRÊT" : "READY")}</span></div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl" />
              <Image src="/sections.png" alt="Bac Sections" width={600} height={400} className="relative rounded-3xl shadow-2xl shadow-black/50" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-32">
        <div className="max-w-7xl mx-auto px-6">
          <SectionTitle eyebrow={t.feat_eyebrow} title={t.feat_title} subtitle={t.feat_subtitle} />
          <div className="grid md:grid-cols-2 gap-6 mt-16">
            <FeatureCard icon={<PenTool className="w-7 h-7" />} title={t.feat_writing_title} description={t.feat_writing_desc} gradient="from-indigo-500/30 via-purple-500/20 to-pink-500/10" />
            <FeatureCard icon={<BookOpen className="w-7 h-7" />} title={t.feat_reading_title} description={t.feat_reading_desc} gradient="from-emerald-500/30 via-teal-500/20 to-cyan-500/10" />
            <FeatureCard icon={<Library className="w-7 h-7" />} title={t.feat_library_title} description={t.feat_library_desc} gradient="from-amber-500/30 via-orange-500/20 to-red-500/10" />
            <FeatureCard icon={<Target className="w-7 h-7" />} title={t.feat_missions_title} description={t.feat_missions_desc} gradient="from-rose-500/30 via-pink-500/20 to-purple-500/10" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value="50K+" label={isRTL ? "طالب" : (lang === "fr" ? "Étudiants" : "Students")} icon={<Sparkles className="w-5 h-5" />} />
            <StatCard value="17/20" label={isRTL ? "متوسط النتائج" : (lang === "fr" ? "Moyenne" : "Avg Score")} icon={<Award className="w-5 h-5" />} />
            <StatCard value="98%" label={isRTL ? "نسبة النجاح" : (lang === "fr" ? "Réussite" : "Success")} icon={<Zap className="w-5 h-5" />} />
            <StatCard value="24/7" label={isRTL ? "دعم AI" : (lang === "fr" ? "Support IA" : "AI Support")} icon={<ArrowRight className="w-5 h-5" />} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative p-12 md:p-20 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-pink-600/30" />
            <div className="absolute inset-0 bg-[#0a0a12]/80 backdrop-blur-3xl" />
            <motion.div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl" animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }} transition={{ duration: 8, repeat: Infinity }} />
            <motion.div className="absolute bottom-0 right-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl" animate={{ scale: [1, 1.3, 1], x: [0, -50, 0] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} />
            <div className="relative text-center max-w-2xl mx-auto">
              <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 200, delay: 0.2 }} className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 mb-8 shadow-lg shadow-indigo-500/30"><Sparkles className="w-8 h-8 text-white" /></motion.div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">{t.cta_title}</h2>
              <p className="text-xl text-white/60 mb-10">{t.cta_subtitle}</p>
              <motion.a href="/auth/signup" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center px-8 py-4 bg-white text-black font-bold rounded-full hover:shadow-lg hover:shadow-white/20 transition-all">{t.cta_btn}<ArrowRight className="w-5 h-5 ml-2" /></motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
