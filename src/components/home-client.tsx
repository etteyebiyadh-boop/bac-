"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle2,
  Library,
  NotebookPen,
  Target,
} from "lucide-react";
import { HeroPathSelector } from "@/components/home-path-selector";
import { SiteLanguage } from "@/lib/translations";

interface HomeClientProps {
  lang: SiteLanguage;
  t: any;
  isRTL: boolean;
}

interface LandingCopy {
  badge: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryCta: string;
  secondaryCta: string;
  proof: string[];
  metrics: Array<{ value: string; label: string }>;
  visualEyebrow: string;
  visualTitle: string;
  visualNote: string;
  weeklyLabel: string;
  weeklyTasks: string[];
  stripCards: Array<{ title: string; description: string }>;
  workflowEyebrow: string;
  workflowTitle: string;
  workflowSubtitle: string;
  workflowBullets: string[];
  workflowSteps: Array<{ title: string; description: string }>;
  sectionsLabel: string;
  selectorEyebrow: string;
  selectorTitle: string;
  selectorSubtitle: string;
  featureEyebrow: string;
  featureTitle: string;
  featureSubtitle: string;
  diagnosticTitle: string;
  diagnosticDescription: string;
  finalEyebrow: string;
  finalNote: string;
}

const landingCopy: Record<SiteLanguage, LandingCopy> = {
  en: {
    badge: "Focused Tunisian Bac prep",
    heroTitle: "Know what to study next from the first screen.",
    heroSubtitle:
      "Choose your Bac section, unlock the right diagnostic, and work with /20 feedback built for Tunisian Baccalaureate students.",
    primaryCta: "Choose my Bac path",
    secondaryCta: "Open diagnostic",
    proof: [
      "Bac-style writing correction with clear /20 logic.",
      "Roadmaps shaped by section and optional language.",
      "A calmer start that helps students move instead of hesitating.",
    ],
    metrics: [
      { value: "6", label: "Bac sections covered" },
      { value: "3", label: "Optional languages" },
      { value: "/20", label: "Feedback-first scoring" },
    ],
    visualEyebrow: "Student view",
    visualTitle: "One dashboard. One roadmap. One place to improve.",
    visualNote:
      "The opening experience now feels more academic, more credible, and easier to trust on day one.",
    weeklyLabel: "This week's focus",
    weeklyTasks: [
      "Take the English diagnostic",
      "Fix writing structure and transitions",
      "Review the optional language roadmap",
    ],
    stripCards: [
      {
        title: "Know your level",
        description:
          "Students begin with a real starting point instead of guessing what to revise first.",
      },
      {
        title: "Fix what costs marks",
        description:
          "Writing feedback points to structure, grammar, and Bac scoring expectations.",
      },
      {
        title: "Keep momentum",
        description:
          "Daily study actions make the platform feel useful after the first visit too.",
      },
    ],
    workflowEyebrow: "Built around the Bac workflow",
    workflowTitle: "A platform that tells students what to do next.",
    workflowSubtitle:
      "The first page now introduces the real study loop: diagnose, practice, and track progress without the noise of a generic language app.",
    workflowBullets: [
      "Start with a diagnostic before touching random lessons.",
      "Keep writing, reading, and roadmap work in the same system.",
      "Make English, French, and the optional language feel connected.",
    ],
    workflowSteps: [
      {
        title: "Diagnose",
        description: "Find the current level quickly and stop revising blindly.",
      },
      {
        title: "Practice",
        description: "Work on the skills that matter most for Bac performance.",
      },
      {
        title: "Improve",
        description: "Follow one roadmap and keep progress visible every week.",
      },
    ],
    sectionsLabel: "Available sections",
    selectorEyebrow: "Personalized start",
    selectorTitle: "Choose the track the student actually belongs to.",
    selectorSubtitle:
      "This is where the experience becomes personal: section, optional language, and a roadmap that makes sense from the first click.",
    featureEyebrow: "What the platform gives you",
    featureTitle: "Every screen should lead back to better Bac marks.",
    featureSubtitle:
      "These are the study tools students expect to see immediately when they open the platform.",
    diagnosticTitle: "Level-based diagnostics",
    diagnosticDescription:
      "Quick tests give each student a tighter roadmap before they dive into lessons.",
    finalEyebrow: "Ready to begin",
    finalNote:
      "Create an account to save the roadmap, feedback history, and next study steps in one place.",
  },
  fr: {
    badge: "Préparation Bac tunisien, claire et sérieuse",
    heroTitle: "Dès le premier écran, l'étudiant sait quoi réviser ensuite.",
    heroSubtitle:
      "Choisissez votre section, lancez le bon diagnostic et travaillez avec un feedback sur 20 pensé pour le Bac tunisien.",
    primaryCta: "Choisir mon parcours",
    secondaryCta: "Ouvrir le diagnostic",
    proof: [
      "Correction d'écriture alignée sur une logique Bac et une note sur 20.",
      "Roadmaps adaptées à la section et à la langue optionnelle.",
      "Une entrée plus calme et plus crédible pour donner envie de commencer.",
    ],
    metrics: [
      { value: "6", label: "Sections Bac couvertes" },
      { value: "3", label: "Langues optionnelles" },
      { value: "/20", label: "Feedback orienté note" },
    ],
    visualEyebrow: "Vue étudiant",
    visualTitle: "Un dashboard, une roadmap, un seul endroit pour progresser.",
    visualNote:
      "L'ouverture paraît maintenant plus académique, plus crédible et plus rassurante dès le premier jour.",
    weeklyLabel: "Focus de la semaine",
    weeklyTasks: [
      "Passer le diagnostic d'anglais",
      "Corriger la structure et les transitions",
      "Revoir la roadmap de la langue optionnelle",
    ],
    stripCards: [
      {
        title: "Connaître son niveau",
        description:
          "L'étudiant commence avec un vrai point de départ au lieu de réviser au hasard.",
      },
      {
        title: "Corriger ce qui fait perdre des points",
        description:
          "Le feedback d'écriture cible la structure, la grammaire et les attentes du Bac.",
      },
      {
        title: "Garder le rythme",
        description:
          "Les actions quotidiennes rendent la plateforme utile après la première visite aussi.",
      },
    ],
    workflowEyebrow: "Construit autour du vrai flux Bac",
    workflowTitle: "Une plateforme qui indique quoi faire ensuite.",
    workflowSubtitle:
      "La première page introduit maintenant la vraie boucle de travail: diagnostiquer, pratiquer et suivre ses progrès sans l'effet application générique.",
    workflowBullets: [
      "Commencer par un diagnostic avant d'ouvrir des leçons au hasard.",
      "Garder écriture, lecture et roadmap dans le même système.",
      "Relier anglais, français et langue optionnelle dans une seule routine.",
    ],
    workflowSteps: [
      {
        title: "Diagnostiquer",
        description: "Situer rapidement le niveau et arrêter de réviser à l'aveugle.",
      },
      {
        title: "Pratiquer",
        description: "Travailler les compétences qui pèsent vraiment dans la note.",
      },
      {
        title: "Progresser",
        description: "Suivre une roadmap claire et garder les progrès visibles.",
      },
    ],
    sectionsLabel: "Sections disponibles",
    selectorEyebrow: "Départ personnalisé",
    selectorTitle: "Choisissez la filière réelle de l'étudiant.",
    selectorSubtitle:
      "C'est ici que l'expérience devient personnelle: section, langue optionnelle et roadmap cohérente dès le premier clic.",
    featureEyebrow: "Ce que la plateforme apporte",
    featureTitle: "Chaque écran doit rapprocher d'une meilleure note au Bac.",
    featureSubtitle:
      "Voici les outils d'étude que les étudiants veulent voir immédiatement en arrivant.",
    diagnosticTitle: "Diagnostics par niveau",
    diagnosticDescription:
      "Des tests rapides donnent une roadmap plus précise avant même d'entrer dans la bibliothèque.",
    finalEyebrow: "Prêt à commencer",
    finalNote:
      "Créez un compte pour enregistrer la roadmap, l'historique des corrections et les prochaines étapes.",
  },
  ar: {
    badge: "منصة باك تونسية أوضح وأكثر جدية",
    heroTitle: "من أول شاشة، الطالب يعرف شنوّة يراجع بعد.",
    heroSubtitle:
      "اختار الشعبة متاعك، افتح التشخيص الصحيح، وخذ Feedback على /20 معمول خصيصًا لتلامذة الباك التونسي.",
    primaryCta: "اختار مسارك",
    secondaryCta: "افتح التشخيص",
    proof: [
      "تصحيح Writing بمنطق الباك ومع ملاحظات واضحة على /20.",
      "Roadmaps تتبدل حسب الشعبة واللغة الاختيارية.",
      "بداية أهدأ وأوضح تخلي الطالب يحب يبدأ من أول مرة.",
    ],
    metrics: [
      { value: "6", label: "شعب باك" },
      { value: "3", label: "لغات اختيارية" },
      { value: "/20", label: "Feedback موجّه للنقطة" },
    ],
    visualEyebrow: "واجهة الطالب",
    visualTitle: "Dashboard واحدة، roadmap واحدة، ومكان واحد للتحسن.",
    visualNote:
      "الانطباع الأول ولىّ أكثر أكاديمية، أكثر مصداقية، وأسهل باش يثق فيه الطالب من النهار الأول.",
    weeklyLabel: "تركيز الأسبوع",
    weeklyTasks: [
      "اعمل تشخيص الإنجليزية",
      "صلّح structure و transitions",
      "راجع roadmap متاع اللغة الاختيارية",
    ],
    stripCards: [
      {
        title: "اعرف مستواك",
        description:
          "الطالب يبدأ من نقطة واضحة بدل ما يضيع في مراجعة عشوائية.",
      },
      {
        title: "صلّح الحاجات اللي تنقص في النقطة",
        description:
          "تصحيح الكتابة يركّز على structure و grammar ومتطلبات الباك.",
      },
      {
        title: "حافظ على النسق",
        description:
          "المهام اليومية تخلي المنصة نافعة حتى بعد أول زيارة.",
      },
    ],
    workflowEyebrow: "مبنية على طريقة خدمة الباك",
    workflowTitle: "منصة تقول للطالب شنوّة يعمل بعد.",
    workflowSubtitle:
      "الصفحة الأولى تقدّم الآن الدورة الحقيقية للمراجعة: تشخيص، تدريب، ومتابعة تقدّم بدون ضجيج تطبيقات اللغات العادية.",
    workflowBullets: [
      "ابدأ بتشخيص قبل ما تدخل لدروس عشوائية.",
      "خلّي الكتابة والقراءة والroadmap في نفس المنظومة.",
      "اربط الإنجليزية والفرنسية واللغة الاختيارية في routine وحدة.",
    ],
    workflowSteps: [
      {
        title: "شخّص",
        description: "اعرف المستوى بسرعة وبطّل المراجعة العشوائية.",
      },
      {
        title: "تدرّب",
        description: "خدم على المهارات اللي تفرق فعلاً في نقطة الباك.",
      },
      {
        title: "تقدّم",
        description: "اتبع roadmap واضحة وخلي التقدّم ظاهر كل أسبوع.",
      },
    ],
    sectionsLabel: "الشعب الموجودة",
    selectorEyebrow: "بداية شخصية",
    selectorTitle: "اختار المسار الحقيقي متاع الطالب.",
    selectorSubtitle:
      "من هنا تولّي التجربة شخصية: شعبة، لغة اختيارية، وroadmap منطقية من أول click.",
    featureEyebrow: "شنوّة تعطيك المنصة",
    featureTitle: "كل شاشة لازم تقرّب الطالب من نقطة خير في الباك.",
    featureSubtitle:
      "هاذم أهم أدوات الدراسة اللي الطالب يحب يلقاهم مباشرة كي يفتح المنصة.",
    diagnosticTitle: "تشخيص حسب المستوى",
    diagnosticDescription:
      "اختبارات سريعة تعطي لكل طالب roadmap أدق قبل ما يدخل للمكتبة.",
    finalEyebrow: "جاهز تبدأ",
    finalNote:
      "اعمل compte باش تحفظ roadmap والfeedback وكل الخطوات الجاية في بلاصة واحدة.",
  },
};

const sectionLabels: Record<SiteLanguage, string[]> = {
  en: ["Maths", "Sciences", "Technique", "Eco", "Lettres", "Info"],
  fr: ["Maths", "Sciences", "Technique", "Éco", "Lettres", "Info"],
  ar: ["رياضيات", "علوم", "تقني", "اقتصاد", "آداب", "إعلامية"],
};

const stripIcons: LucideIcon[] = [BookOpen, NotebookPen, Calendar];
const workflowIcons: LucideIcon[] = [Target, NotebookPen, BarChart3];
const featureIcons: LucideIcon[] = [NotebookPen, Library, Target, Calendar];

const revealProps = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.55 },
};

function SectionHeading({
  eyebrow,
  title,
  subtitle,
  isRTL,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  isRTL: boolean;
}) {
  return (
    <div className="landing-section-heading" style={{ textAlign: isRTL ? "right" : "left" }}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="section-title-large" style={{ marginBottom: "16px" }}>
        {title}
      </h2>
      <p className="muted landing-section-subtitle">{subtitle}</p>
    </div>
  );
}

function StripCard({
  icon: Icon,
  title,
  description,
  isRTL,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  isRTL: boolean;
}) {
  return (
    <motion.article className="landing-strip-card" style={{ textAlign: isRTL ? "right" : "left" }} {...revealProps}>
      <div className="landing-card-icon">
        <Icon size={20} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.article>
  );
}

function WorkflowCard({
  icon: Icon,
  index,
  title,
  description,
  isRTL,
}: {
  icon: LucideIcon;
  index: number;
  title: string;
  description: string;
  isRTL: boolean;
}) {
  return (
    <motion.article className="landing-workflow-card" style={{ textAlign: isRTL ? "right" : "left" }} {...revealProps}>
      <div className="landing-workflow-card-top">
        <span className="landing-step-number">0{index + 1}</span>
        <div className="landing-card-icon landing-card-icon-small">
          <Icon size={18} />
        </div>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.article>
  );
}

function ProductCard({
  icon: Icon,
  title,
  description,
  isRTL,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  isRTL: boolean;
}) {
  return (
    <motion.article className="landing-product-card" style={{ textAlign: isRTL ? "right" : "left" }} {...revealProps}>
      <div className="landing-card-icon">
        <Icon size={20} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.article>
  );
}

export function HomeClient({ lang, t, isRTL }: HomeClientProps) {
  const copy = landingCopy[lang] || landingCopy.en;
  const sections = sectionLabels[lang] || sectionLabels.en;
  const featureCards = [
    {
      title: t.feat_writing_title,
      description: t.feat_writing_desc,
    },
    {
      title: t.feat_library_title,
      description: t.feat_library_desc,
    },
    {
      title: copy.diagnosticTitle,
      description: copy.diagnosticDescription,
    },
    {
      title: t.feat_missions_title,
      description: t.feat_missions_desc,
    },
  ];

  return (
    <div className="home-bleed landing-home">
      <section className="landing-stage">
        <div className="landing-shell">
          <motion.div className="landing-hero" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="landing-hero-inner">
              <div className="landing-copy" style={{ textAlign: isRTL ? "right" : "left" }}>
                <span className="landing-badge">{copy.badge}</span>
                <h1 className="landing-title">{copy.heroTitle}</h1>
                <p className="landing-subtitle">{copy.heroSubtitle}</p>

                <div className="landing-cta-row">
                  <a className="button-link" href="#selector">
                    {copy.primaryCta}
                    <ArrowRight size={18} />
                  </a>
                  <Link className="button-link button-secondary" href="/diagnostic">
                    {copy.secondaryCta}
                  </Link>
                </div>

                <div className="landing-proof-list">
                  {copy.proof.map((item) => (
                    <div key={item} className="landing-proof-item">
                      <CheckCircle2 className="landing-proof-icon" size={18} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="landing-metric-grid">
                  {copy.metrics.map((metric) => (
                    <div key={metric.label} className="landing-metric-card">
                      <strong>{metric.value}</strong>
                      <span>{metric.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <motion.div
                className="landing-visual"
                initial={{ opacity: 0, x: isRTL ? -24 : 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.65, delay: 0.1 }}
              >
                <div className="landing-portrait-card">
                  <div className="landing-portrait-media">
                    <Image
                      src="/student.png"
                      alt="Student studying with BacLang"
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      style={{ objectFit: "cover" }}
                      priority
                    />
                  </div>
                  <div className="landing-photo-caption" style={{ textAlign: isRTL ? "right" : "left" }}>
                    <span className="landing-photo-kicker">{copy.visualEyebrow}</span>
                    <h3>{copy.visualTitle}</h3>
                    <p>{copy.visualNote}</p>
                  </div>
                </div>

                <div className="landing-floating-card" style={{ textAlign: isRTL ? "right" : "left" }}>
                  <span className="landing-floating-label">{copy.weeklyLabel}</span>
                  <div className="landing-task-list">
                    {copy.weeklyTasks.map((task) => (
                      <div key={task} className="landing-task-item">
                        <span className="landing-task-dot" />
                        <span>{task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="landing-dashboard-peek">
                  <Image
                    src="/dashboard.png"
                    alt="BacLang dashboard preview"
                    width={360}
                    height={250}
                    className="landing-dashboard-image"
                  />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-shell">
          <div className="landing-strip">
            {copy.stripCards.map((card, index) => (
              <StripCard
                key={card.title}
                icon={stripIcons[index]}
                title={card.title}
                description={card.description}
                isRTL={isRTL}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-shell">
          <div className="landing-workflow-panel">
            <div className="landing-workflow-copy">
              <SectionHeading
                eyebrow={copy.workflowEyebrow}
                title={copy.workflowTitle}
                subtitle={copy.workflowSubtitle}
                isRTL={isRTL}
              />

              <div className="landing-workflow-grid">
                {copy.workflowSteps.map((step, index) => (
                  <WorkflowCard
                    key={step.title}
                    icon={workflowIcons[index]}
                    index={index}
                    title={step.title}
                    description={step.description}
                    isRTL={isRTL}
                  />
                ))}
              </div>

              <div className="landing-bullet-list" style={{ textAlign: isRTL ? "right" : "left" }}>
                {copy.workflowBullets.map((bullet) => (
                  <div key={bullet} className="landing-bullet-item">
                    <CheckCircle2 className="landing-proof-icon" size={18} />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              <div className="landing-chip-block" style={{ textAlign: isRTL ? "right" : "left" }}>
                <span className="landing-chip-label">{copy.sectionsLabel}</span>
                <div className="landing-chip-row">
                  {sections.map((section) => (
                    <span key={section} className="landing-chip">
                      {section}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <motion.div className="landing-screenshot-frame" {...revealProps}>
              <Image
                src="/dashboard.png"
                alt="BacLang learning dashboard"
                width={760}
                height={520}
                className="landing-screenshot-image"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section id="selector" className="landing-section">
        <div className="landing-shell">
          <SectionHeading
            eyebrow={copy.selectorEyebrow}
            title={copy.selectorTitle}
            subtitle={copy.selectorSubtitle}
            isRTL={isRTL}
          />

          <motion.div className="landing-selector-shell" {...revealProps}>
            <HeroPathSelector lang={lang} />
          </motion.div>
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-shell">
          <SectionHeading
            eyebrow={copy.featureEyebrow}
            title={copy.featureTitle}
            subtitle={copy.featureSubtitle}
            isRTL={isRTL}
          />

          <div className="landing-product-grid">
            {featureCards.map((card, index) => (
              <ProductCard
                key={card.title}
                icon={featureIcons[index]}
                title={card.title}
                description={card.description}
                isRTL={isRTL}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section landing-section-final">
        <div className="landing-shell">
          <motion.div className="landing-final-panel" {...revealProps}>
            <div style={{ textAlign: isRTL ? "right" : "left" }}>
              <span className="eyebrow">{copy.finalEyebrow}</span>
              <h2 className="section-title-large" style={{ marginBottom: "16px" }}>
                {t.cta_title}
              </h2>
              <p className="muted landing-section-subtitle" style={{ marginBottom: "16px" }}>
                {t.cta_subtitle}
              </p>
              <p className="landing-final-note">{copy.finalNote}</p>
            </div>

            <div className="landing-final-actions">
              <Link className="button-link" href="/auth/signup">
                {t.cta_btn}
                <ArrowRight size={18} />
              </Link>
              <Link className="button-link button-secondary" href="/lessons">
                {t.hero_explore}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
