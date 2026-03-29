"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { LightweightHero, LightweightFeatureCard, OptimizedSectionTitle, OptimizedScrollReveal, OptimizedStagger, OptimizedStaggerItem, LightweightStatCard } from "@/components/premium-animations-optimized";
import { HeroPathSelector } from "@/components/home-path-selector";
import { BookOpen, PenTool, Library, Target, ArrowRight, Sparkles, Zap, Award } from "lucide-react";
import { SiteLanguage } from "@/lib/translations";

interface HomeClientProps {
  lang: SiteLanguage;
  t: any;
  isRTL: boolean;
}

export function HomeClient({ lang, t, isRTL }: HomeClientProps) {
  return (
    <div className="relative overflow-hidden">
      {/* Lightweight Hero - No Three.js, CSS 3D only */}
      <LightweightHero
        badge={isRTL ? "✨ نسخة 2026 - مباشرة" : (lang === "fr" ? "✨ ÉDITION 2026 - EN DIRECT" : "✨ 2026 EDITION - LIVE")}
        title={t.hero_title}
        subtitle={t.hero_subtitle}
        ctaText={t.hero_cta}
        ctaHref="#selector"
        secondaryCtaText={t.hero_explore}
        secondaryCtaHref="/lessons"
      />

      {/* Path Selector Section */}
      <section id="selector" className="relative py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <OptimizedSectionTitle
            eyebrow={isRTL ? "خارطة الطريق متاعك" : (lang === "fr" ? "Moteur de Personnalisation" : "Personalization Engine")}
            title={isRTL ? "منين تحب تبدا؟" : (lang === "fr" ? "Par où commencer ?" : "Where do you start?")}
            subtitle={isRTL 
              ? "اختار شعبتك واللغات اللي تقراهم باش نطلعولك الـ Roadmap اللي توصلك للـ 17/20."
              : (lang === "fr" 
                ? "Choisissez votre section et langue optionnelle pour générer votre roadmap personnalisée."
                : "Select your section and optional language to generate your custom 17/20 roadmap.")}
          />

          <OptimizedScrollReveal delay={0.3}>
            <div className="mt-16">
              <HeroPathSelector lang={lang} />
            </div>
          </OptimizedScrollReveal>
        </div>
      </section>

      {/* Bac Sections Showcase */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <OptimizedScrollReveal direction="left">
              <span className="inline-block text-sm font-bold tracking-widest uppercase bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent mb-4">
                {isRTL ? "جميع الشعب موجودة" : (lang === "fr" ? "Toutes les séries incluses" : "All Series Included")}
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                {isRTL ? "مصممة لكل شعبة بالتدقيق." : (lang === "fr" ? "Adapté à chaque section." : "Tailored for every single section.")}
              </h2>
              <p className="text-lg text-white/60 mb-8 leading-relaxed">
                {isRTL 
                  ? "من الماط للاقتصاد، خدمنا على كل كبيرة وصغيرة في المنهج التونسي باش تضمن أحسن الأعداد."
                  : (lang === "fr" 
                    ? "Des mathématiques à l'économie, nous avons cartographié chaque exigence du programme."
                    : "From Mathematics to Economy, we've mapped every syllabus requirement, coefficient, and exam pattern unique to your track.")}
              </p>

              <OptimizedStagger staggerDelay={0.05} className="space-y-3">
                {['Maths', 'Sciences', 'Technique', 'Econ', 'Lettres', 'Info', 'Sport'].map((s) => (
                  <OptimizedStaggerItem key={s}>
                    <motion.div 
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                      whileHover={{ x: 8, backgroundColor: "rgba(255,255,255,0.08)" }}
                    >
                      <span className="font-bold text-white">{s}</span>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-sm text-emerald-400 font-semibold">
                          {isRTL ? "موجود" : (lang === "fr" ? "PRÊT" : "READY")}
                        </span>
                      </div>
                    </motion.div>
                  </OptimizedStaggerItem>
                ))}
              </OptimizedStagger>
            </OptimizedScrollReveal>

            <OptimizedScrollReveal direction="right" delay={0.2}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl" />
                <Image 
                  src="/sections.png" 
                  alt="Bac Sections"
                  width={600}
                  height={400}
                  className="relative rounded-3xl shadow-2xl shadow-black/50"
                />
              </div>
            </OptimizedScrollReveal>
          </div>
        </div>
      </section>

      {/* Features Section - Lightweight Cards */}
      <section className="relative py-32">
        <div className="max-w-7xl mx-auto px-6">
          <OptimizedSectionTitle
            eyebrow={t.feat_eyebrow}
            title={t.feat_title}
            subtitle={t.feat_subtitle}
          />

          <div className="grid md:grid-cols-2 gap-6 mt-16">
            <LightweightFeatureCard
              icon={<PenTool className="w-7 h-7" />}
              title={t.feat_writing_title}
              description={t.feat_writing_desc}
              gradient="from-indigo-500/30 via-purple-500/20 to-pink-500/10"
            />
            <LightweightFeatureCard
              icon={<BookOpen className="w-7 h-7" />}
              title={t.feat_reading_title}
              description={t.feat_reading_desc}
              gradient="from-emerald-500/30 via-teal-500/20 to-cyan-500/10"
            />
            <LightweightFeatureCard
              icon={<Library className="w-7 h-7" />}
              title={t.feat_library_title}
              description={t.feat_library_desc}
              gradient="from-amber-500/30 via-orange-500/20 to-red-500/10"
            />
            <LightweightFeatureCard
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
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "50K+", label: isRTL ? "طالب" : (lang === "fr" ? "Étudiants" : "Students"), icon: <Sparkles className="w-5 h-5" /> },
              { value: "17/20", label: isRTL ? "متوسط النتائج" : (lang === "fr" ? "Moyenne" : "Avg Score"), icon: <Award className="w-5 h-5" /> },
              { value: "98%", label: isRTL ? "نسبة النجاح" : (lang === "fr" ? "Réussite" : "Success"), icon: <Zap className="w-5 h-5" /> },
              { value: "24/7", label: isRTL ? "دعم AI" : (lang === "fr" ? "Support IA" : "AI Support"), icon: <ArrowRight className="w-5 h-5" /> },
            ].map((stat, i) => (
              <OptimizedScrollReveal key={i} delay={i * 0.1}>
                <LightweightStatCard {...stat} />
              </OptimizedScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-32">
        <div className="max-w-7xl mx-auto px-6">
          <OptimizedScrollReveal>
            <div className="relative p-12 md:p-20 rounded-3xl overflow-hidden">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-pink-600/30" />
              <div className="absolute inset-0 bg-[#0a0a12]/80 backdrop-blur-3xl" />
              
              {/* Animated orbs */}
              <motion.div
                className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-0 right-1/4 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.3, 1], x: [0, -50, 0] }}
                transition={{ duration: 10, repeat: Infinity, delay: 2 }}
              />
              
              <div className="relative text-center max-w-2xl mx-auto">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 mb-8 shadow-lg shadow-indigo-500/30"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
                
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                  {t.cta_title}
                </h2>
                <p className="text-xl text-white/60 mb-10">
                  {t.cta_subtitle}
                </p>
                
                <motion.div
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.a
                    href="/auth/signup"
                    className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                    <span className="relative flex items-center gap-2">
                      {t.cta_btn}
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.span>
                    </span>
                  </motion.a>
                </motion.div>
              </div>
            </div>
          </OptimizedScrollReveal>
        </div>
      </section>
    </div>
  );
}
