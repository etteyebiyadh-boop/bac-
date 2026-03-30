"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { HeroPathSelector } from "@/components/home-path-selector";
import { BookOpen, PenTool, Library, Target, ArrowRight, GraduationCap, Users, Award, Clock } from "lucide-react";
import { SiteLanguage } from "@/lib/translations";

interface HomeClientProps {
  lang: SiteLanguage;
  t: any;
  isRTL: boolean;
}

// Senior Professional Hero - Clean & Authoritative
function SeniorHero({ badge, title, subtitle, ctaText, ctaHref, secondaryCtaText, secondaryCtaHref, isRTL }: any) {
  return (
    <section className="relative min-h-[85vh] flex items-center bg-slate-50">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className={`grid lg:grid-cols-2 gap-12 items-center ${isRTL ? 'rtl' : ''}`}>
          {/* Text Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-slate-50 text-sm font-medium mb-6"
            >
              <GraduationCap className="w-4 h-4" />
              {badge}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-[1.15] tracking-tight"
            >
              {title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl"
            >
              {subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href={ctaHref}
                className="inline-flex items-center justify-center px-8 py-3.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
              >
                {ctaText}
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
              </a>
              {secondaryCtaText && (
                <a
                  href={secondaryCtaHref}
                  className="inline-flex items-center justify-center px-8 py-3.5 text-slate-700 font-medium hover:text-slate-900 transition-colors"
                >
                  {secondaryCtaText}
                </a>
              )}
            </motion.div>
          </div>

          {/* Visual - Clean card stack */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Award className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Score Prévu</div>
                  <div className="text-2xl font-bold text-amber-600">17.5/20</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Compréhension</span>
                  <span className="font-medium text-slate-900">18/20</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[90%] bg-amber-500 rounded-full" />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Expression</span>
                  <span className="font-medium text-slate-900">17/20</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-amber-500 rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Section Title - Clean academic style
function SectionTitle({ eyebrow, title, subtitle, centered = true }: { eyebrow: string; title: string; subtitle?: string; centered?: boolean }) {
  return (
    <div className={`max-w-3xl ${centered ? 'mx-auto text-center' : ''}`}>
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="inline-block text-sm font-semibold text-amber-600 uppercase tracking-wider mb-3"
      >
        {eyebrow}
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
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
    <div className="bg-white">
      {/* Hero Section */}
      <SeniorHero
        badge={isRTL ? "المنصة الرائدة للبكالوريا التونسية" : (lang === "fr" ? "La plateforme référence du Bac tunisien" : "The definitive Tunisian Bac platform")}
        title={t.hero_title}
        subtitle={t.hero_subtitle}
        ctaText={t.hero_cta}
        ctaHref="#selector"
        secondaryCtaText={t.hero_explore}
        secondaryCtaHref="/lessons"
        isRTL={isRTL}
      />

      {/* Stats Bar */}
      <section className="py-12 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value="50K+" label={isRTL ? "طالب مسجل" : (lang === "fr" ? "Étudiants" : "Students")} icon={<Users className="w-5 h-5" />} delay={0} />
            <StatCard value="17.2" label={isRTL ? "متوسط النقاط" : (lang === "fr" ? "Moyenne générale" : "Average Score")} icon={<Award className="w-5 h-5" />} delay={0.1} />
            <StatCard value="97%" label={isRTL ? "نسبة النجاح" : (lang === "fr" ? "Taux de réussite" : "Pass Rate")} icon={<GraduationCap className="w-5 h-5" />} delay={0.2} />
            <StatCard value="24/7" label={isRTL ? "دعم مستمر" : (lang === "fr" ? "Support IA" : "AI Support")} icon={<Clock className="w-5 h-5" />} delay={0.3} />
          </div>
        </div>
      </section>

      {/* Path Selector Section */}
      <section id="selector" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <SectionTitle
            eyebrow={isRTL ? "اختر مسارك" : (lang === "fr" ? "Personnalisation" : "Personalization")}
            title={isRTL ? "من أي نقطة تبدأ؟" : (lang === "fr" ? "Par où commencer ?" : "Where do you start?")}
            subtitle={isRTL
              ? "حدد شعبتك واحصل على خطة دراسية مخصصة"
              : (lang === "fr"
                ? "Sélectionnez votre section et obtenez un plan d'étude personnalisé"
                : "Select your section and get a personalized study plan")}
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <HeroPathSelector lang={lang} />
          </motion.div>
        </div>
      </section>

      {/* Bac Sections */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className={`grid lg:grid-cols-2 gap-16 items-start ${isRTL ? 'rtl' : ''}`}>
            <div>
              <SectionTitle
                eyebrow={isRTL ? "جميع الشعب" : (lang === "fr" ? "Toutes les séries" : "All Series")}
                title={isRTL ? "متوافق مع جميع شعب البكالوريا" : (lang === "fr" ? "Compatible avec toutes les séries du Bac" : "Compatible with all Bac series")}
                subtitle={isRTL
                  ? "من الرياضيات إلى الاقتصاد، لدينا تغطية شاملة لجميع المواد"
                  : (lang === "fr"
                    ? "Des mathématiques à l'économie, couverture complète de toutes les matières"
                    : "From Mathematics to Economy, complete coverage of all subjects")}
                centered={false}
              />
              <div className="mt-8 space-y-3">
                {['Maths', 'Sciences', 'Technique', 'Econ', 'Lettres', 'Info', 'Sport'].map((s, i) => (
                  <SeriesCard key={s} name={s} isRTL={isRTL} lang={lang} index={i} />
                ))}
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Image
                src="/sections.png"
                alt="Bac Sections"
                width={600}
                height={400}
                className="rounded-2xl shadow-lg border border-slate-200"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <SectionTitle
            eyebrow={t.feat_eyebrow}
            title={t.feat_title}
            subtitle={t.feat_subtitle}
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <FeatureCard
              icon={<PenTool className="w-5 h-5" />}
              title={t.feat_writing_title}
              description={t.feat_writing_desc}
              delay={0}
            />
            <FeatureCard
              icon={<BookOpen className="w-5 h-5" />}
              title={t.feat_reading_title}
              description={t.feat_reading_desc}
              delay={0.1}
            />
            <FeatureCard
              icon={<Library className="w-5 h-5" />}
              title={t.feat_library_title}
              description={t.feat_library_desc}
              delay={0.2}
            />
            <FeatureCard
              icon={<Target className="w-5 h-5" />}
              title={t.feat_missions_title}
              description={t.feat_missions_desc}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t.cta_title}
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              {t.cta_subtitle}
            </p>
            <motion.a
              href="/auth/signup"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center px-8 py-4 bg-amber-500 text-slate-900 font-semibold rounded-lg hover:bg-amber-400 transition-colors"
            >
              {t.cta_btn}
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
