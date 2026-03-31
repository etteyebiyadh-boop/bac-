"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Award,
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

interface HeroStep {
  title: string;
  description: string;
  cue: string;
}

interface LandingCopy {
  badge: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryCta: string;
  secondaryCta: string;
  proof: string[];
  metrics: Array<{ value: string; label: string }>;
  buildLabel: string;
  candidateLabel: string;
  candidateName: string;
  candidateNote: string;
  buildSteps: HeroStep[];
  diplomaTag: string;
  diplomaNote: string;
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
    badge: "The diploma is the target",
    heroTitle: "Build the Bac diploma before exam day arrives.",
    heroSubtitle:
      "Turn diagnostics, writing, revision, and mock practice into a hero that feels earned. The first screen should look like the goal students actually care about.",
    primaryCta: "Start building my Bac path",
    secondaryCta: "Open diagnostic",
    proof: [
      "The diploma becomes the visual target instead of a generic premium UI.",
      "Every animated step maps to real study work students understand immediately.",
      "The background now uses the real Tunisian Bac diploma as the visual target.",
    ],
    metrics: [
      { value: "4", label: "Study stages build the paper" },
      { value: "6", label: "Bac sections supported" },
      { value: "/20", label: "Score logic stays visible" },
    ],
    buildLabel: "How the diploma gets built",
    candidateLabel: "Bac candidate",
    candidateName: "Student 2026",
    candidateNote: "Each finished step locks another part of the diploma into place.",
    buildSteps: [
      {
        title: "Diagnostic",
        description: "Find the real starting level before touching random lessons.",
        cue: "draws the frame",
      },
      {
        title: "Writing Lab",
        description: "Correct structure, grammar, and Bac-style expression.",
        cue: "writes the body",
      },
      {
        title: "Revision",
        description: "Strengthen the weak spots that actually cost marks.",
        cue: "protects the mention",
      },
      {
        title: "Mock Exam",
        description: "Seal progress with timed practice under exam pressure.",
        cue: "stamps the result",
      },
    ],
    diplomaTag: "Tunisian Bac target",
    diplomaNote:
      "A real diploma hero makes the ambition visible: not just learning languages, but earning the paper students dream about holding.",
    stripCards: [
      {
        title: "A real symbol",
        description: "The hero now points to the official-looking paper students are chasing, not a decorative dashboard.",
      },
      {
        title: "A visible build-up",
        description: "The animation tells a story: each study action adds a real layer instead of moving abstract shapes.",
      },
      {
        title: "A student-first mood",
        description: "The page feels serious, ambitious, and emotionally tied to the Bac goal from the first second.",
      },
    ],
    workflowEyebrow: "Built around the Bac workflow",
    workflowTitle: "Every study block should feel like it adds something real.",
    workflowSubtitle:
      "The diploma-first opening works because the study loop is clear: diagnose, practise, reinforce, then prove it under mock conditions.",
    workflowBullets: [
      "Start from the section and language combination that actually matches the student.",
      "Keep writing, reading, and roadmap work inside one focused routine.",
      "Make the dream outcome visible without making the page childish or noisy.",
    ],
    workflowSteps: [
      {
        title: "Diagnose",
        description: "Set the right level and remove the guesswork from revision.",
      },
      {
        title: "Practise",
        description: "Work on the exact skills that move the Bac result upward.",
      },
      {
        title: "Earn It",
        description: "Turn consistent effort into a result students can imagine holding.",
      },
    ],
    sectionsLabel: "Available sections",
    selectorEyebrow: "Personalized start",
    selectorTitle: "Choose the Bac path that will build the right diploma.",
    selectorSubtitle:
      "The roadmap should begin with the student's real section and optional language, not with a generic lesson library.",
    featureEyebrow: "What the platform gives you",
    featureTitle: "The study tools should feel connected to the final paper.",
    featureSubtitle:
      "The home page now points every action back to the result: stronger writing, smarter diagnostics, and better Bac decisions.",
    diagnosticTitle: "Level-based diagnostics",
    diagnosticDescription:
      "Quick tests give each student a real starting point before they commit to the next lessons.",
    finalEyebrow: "Ready to build it",
    finalNote:
      "Create an account to save the roadmap, writing feedback, and every stage that moves the student closer to the diploma.",
  },
  fr: {
    badge: "Le diplôme devient la cible",
    heroTitle: "Construisez le diplôme du Bac avant même le jour de l'examen.",
    heroSubtitle:
      "Transformez diagnostic, écriture, révision et simulation en une entrée qui semble méritée. Le premier écran doit montrer l'objectif que l'étudiant veut vraiment atteindre.",
    primaryCta: "Commencer mon parcours Bac",
    secondaryCta: "Ouvrir le diagnostic",
    proof: [
      "Le diplôme devient la cible visuelle au lieu d'une interface premium générique.",
      "Chaque étape animée correspond à un vrai travail scolaire compréhensible par l'étudiant.",
      "L'arrière-plan utilise maintenant le vrai diplôme du Bac tunisien comme cible visuelle.",
    ],
    metrics: [
      { value: "4", label: "Étapes pour construire le diplôme" },
      { value: "6", label: "Sections Bac prises en charge" },
      { value: "/20", label: "La logique de note reste visible" },
    ],
    buildLabel: "Comment le diplôme se construit",
    candidateLabel: "Candidat Bac",
    candidateName: "Étudiant 2026",
    candidateNote: "Chaque étape terminée verrouille une nouvelle partie du diplôme.",
    buildSteps: [
      {
        title: "Diagnostic",
        description: "Définir le vrai niveau avant d'ouvrir des leçons au hasard.",
        cue: "trace le cadre",
      },
      {
        title: "Atelier d'écriture",
        description: "Corriger structure, grammaire et expression type Bac.",
        cue: "écrit le contenu",
      },
      {
        title: "Révision",
        description: "Renforcer les faiblesses qui coûtent vraiment des points.",
        cue: "protège la mention",
      },
      {
        title: "Simulation",
        description: "Valider les progrès sous la pression d'un vrai sujet chronométré.",
        cue: "pose le sceau final",
      },
    ],
    diplomaTag: "Cible Bac tunisien",
    diplomaNote:
      "Un hero construit sur le vrai diplôme rend l'ambition visible: il ne s'agit pas seulement d'apprendre, mais d'obtenir le papier que l'étudiant rêve de tenir.",
    stripCards: [
      {
        title: "Un vrai symbole",
        description: "Le hero montre maintenant le papier officiel que l'étudiant vise, pas un tableau de bord décoratif.",
      },
      {
        title: "Une construction visible",
        description: "L'animation raconte une progression: chaque effort ajoute une vraie couche au lieu de déplacer des formes abstraites.",
      },
      {
        title: "Une ambiance plus juste",
        description: "La page paraît plus sérieuse, ambitieuse et liée au vrai objectif du Bac dès la première seconde.",
      },
    ],
    workflowEyebrow: "Construit autour du vrai rythme Bac",
    workflowTitle: "Chaque session d'étude doit sembler utile et concrète.",
    workflowSubtitle:
      "L'ouverture centrée sur le diplôme fonctionne parce que la boucle d'étude est claire: diagnostiquer, pratiquer, renforcer, puis prouver le niveau en simulation.",
    workflowBullets: [
      "Partir de la vraie section et de la bonne langue optionnelle.",
      "Garder écriture, lecture et roadmap dans une seule routine cohérente.",
      "Rendre le résultat final visible sans tomber dans un design enfantin.",
    ],
    workflowSteps: [
      {
        title: "Diagnostiquer",
        description: "Fixer le bon niveau et enlever le hasard de la révision.",
      },
      {
        title: "Pratiquer",
        description: "Travailler les compétences qui font réellement monter la note.",
      },
      {
        title: "Le mériter",
        description: "Transformer l'effort régulier en résultat que l'étudiant peut déjà imaginer.",
      },
    ],
    sectionsLabel: "Sections disponibles",
    selectorEyebrow: "Départ personnalisé",
    selectorTitle: "Choisissez le parcours Bac qui construira le bon diplôme.",
    selectorSubtitle:
      "La roadmap doit commencer par la vraie section et la vraie langue optionnelle, pas par une bibliothèque générique.",
    featureEyebrow: "Ce que la plateforme apporte",
    featureTitle: "Les outils d'étude doivent tous pointer vers le diplôme final.",
    featureSubtitle:
      "La page d'accueil relie désormais chaque action au résultat: meilleure écriture, diagnostic plus juste et décisions Bac plus intelligentes.",
    diagnosticTitle: "Diagnostics par niveau",
    diagnosticDescription:
      "Des tests rapides donnent à chaque étudiant un point de départ réel avant les prochaines leçons.",
    finalEyebrow: "Prêt à le construire",
    finalNote:
      "Créez un compte pour sauvegarder la roadmap, les corrections d'écriture et chaque étape qui rapproche du diplôme.",
  },
  ar: {
    badge: "الدبلوم ولى هو الهدف",
    heroTitle: "ابني دبلوم الباك قبل ما يجي نهار الامتحان.",
    heroSubtitle:
      "حوّل التشخيص والكتابة والمراجعة والامتحان التجريبي إلى افتتاحية تحسّها مستحقّة. أول شاشة لازم توري الطالب الهدف اللي يحب يوصل له فعلاً.",
    primaryCta: "ابدأ مسار الباك",
    secondaryCta: "افتح التشخيص",
    proof: [
      "الدبلوم ولى الهدف البصري بدل واجهة premium عامة وما عندها حتى معنى.",
      "كل مرحلة في الأنيميشن مربوطة بخدمة حقيقية يفهمها الطالب مباشرة.",
      "شكل الورقة جدي ومستوحي من شهادة الباك التونسية بالعربية والفرنسية.",
    ],
    metrics: [
      { value: "4", label: "مراحل تبني الشهادة" },
      { value: "6", label: "شعب باك مدعومة" },
      { value: "/20", label: "منطق النقطة حاضر" },
    ],
    buildLabel: "كيفاش تتبنى الشهادة",
    candidateLabel: "مترشح باك",
    candidateName: "طالب 2026",
    candidateNote: "كل مرحلة تكملها تركّب جزء جديد من الشهادة في بلاصتو.",
    buildSteps: [
      {
        title: "التشخيص",
        description: "حدّد المستوى الحقيقي قبل ما تدخل لدروس عشوائية.",
        cue: "يرسم الإطار",
      },
      {
        title: "مخبر الكتابة",
        description: "يصلّح structure و grammar والتعبير متاع الباك.",
        cue: "يكتب المحتوى",
      },
      {
        title: "المراجعة",
        description: "يقوّي النقاط الضعيفة اللي تنقص فعلاً في العدد.",
        cue: "يحمي الملاحظة",
      },
      {
        title: "الامتحان التجريبي",
        description: "يثبّت التقدّم تحت الضغط وفي وقت حقيقي.",
        cue: "يحط الختم النهائي",
      },
    ],
    diplomaTag: "هدف الباك التونسي",
    diplomaNote:
      "Hero مستوحى من الشهادة يخلّي الطموح ظاهر: موش مجرد تعلّم لغات، بل الورقة اللي الطالب يحلم يشدّها بيديه.",
    stripCards: [
      {
        title: "رمز حقيقي",
        description: "الافتتاحية تورّي الآن الورقة اللي الطالب يجري عليها، موش dashboard مزخرفة.",
      },
      {
        title: "بناء واضح",
        description: "الأنيميشن يروي قصة: كل خدمة دراسية تضيف طبقة حقيقية بدل أشكال تتحرّك بلا معنى.",
      },
      {
        title: "إحساس أقرب للطالب",
        description: "الصفحة ولات أكثر جدية وطموح ومرتبطة بهدف الباك من أول ثانية.",
      },
    ],
    workflowEyebrow: "مبنية على منطق خدمة الباك",
    workflowTitle: "كل session مراجعة لازم تحسّها تضيف حاجة حقيقية.",
    workflowSubtitle:
      "الافتتاحية المرتكزة على الشهادة تنجح خاطر دورة الخدمة واضحة: تشخيص، تدريب، تقوية، وبعدها إثبات المستوى في mock.",
    workflowBullets: [
      "ابدأ بالشعبة واللغة الاختيارية اللي يخصّوا الطالب فعلاً.",
      "خلّي الكتابة والقراءة والroadmap في routine وحدة مركّزة.",
      "ورّي النتيجة النهائية من غير ما الصفحة تولّي طفولية أو noisy.",
    ],
    workflowSteps: [
      {
        title: "شخّص",
        description: "حدّد المستوى الصحيح وانحّي العشوائية من المراجعة.",
      },
      {
        title: "تدرّب",
        description: "اخدم على المهارات اللي ترفع فعلاً نتيجة الباك.",
      },
      {
        title: "استحقّه",
        description: "حوّل الجهد المنتظم لنتيجة الطالب ينجم يتخيلها قدّامه.",
      },
    ],
    sectionsLabel: "الشعب الموجودة",
    selectorEyebrow: "بداية شخصية",
    selectorTitle: "اختار مسار الباك اللي يبني الشهادة الصحيحة.",
    selectorSubtitle:
      "الroadmap لازم تبدأ بالشعبة واللغة الاختيارية الحقيقيتين، موش بمكتبة دروس عامة.",
    featureEyebrow: "شنوّة تعطيك المنصة",
    featureTitle: "كل أداة دراسة لازم تربطك بالشهادة النهائية.",
    featureSubtitle:
      "الصفحة الأولى تردّ كل action لنفس الهدف: كتابة أقوى، تشخيص أذكى، وقرارات باك أوضح.",
    diagnosticTitle: "تشخيص حسب المستوى",
    diagnosticDescription:
      "اختبارات سريعة تعطي لكل طالب نقطة انطلاق حقيقية قبل ما يكمل الطريق.",
    finalEyebrow: "جاهز تبنيه",
    finalNote:
      "اعمل compte باش تحفظ roadmap وتصحيح الكتابة وكل مرحلة تقرّبك من الشهادة.",
  },
};

const sectionLabels: Record<SiteLanguage, string[]> = {
  en: ["Maths", "Sciences", "Technique", "Eco", "Lettres", "Info"],
  fr: ["Maths", "Sciences", "Technique", "Éco", "Lettres", "Info"],
  ar: ["رياضيات", "علوم", "تقني", "اقتصاد", "آداب", "إعلامية"],
};

const stripIcons: LucideIcon[] = [Target, NotebookPen, Award];
const workflowIcons: LucideIcon[] = [Target, NotebookPen, Award];
const featureIcons: LucideIcon[] = [NotebookPen, Library, Target, Calendar];
const buildIcons: LucideIcon[] = [Target, NotebookPen, BookOpen, BarChart3];

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

function DiplomaScene({ copy }: { copy: LandingCopy }) {
  return (
    <div className="landing-diploma-scene">
      <div className="landing-diploma-target" aria-hidden="true" />

      <motion.div
        className="landing-builder-candidate"
        initial={{ opacity: 0, x: -32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="landing-builder-avatar">
          <Image
            src="/student.png"
            alt="Bac student preparing for the diploma target"
            fill
            sizes="72px"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="landing-builder-candidate-copy">
          <span className="landing-builder-label">{copy.candidateLabel}</span>
          <strong>{copy.candidateName}</strong>
          <p>{copy.candidateNote}</p>
        </div>
      </motion.div>

      <div className="landing-builder-rail">
        <span className="landing-builder-rail-title">{copy.buildLabel}</span>
        {copy.buildSteps.map((step, index) => {
          const Icon = buildIcons[index];

          return (
            <motion.div
              key={step.title}
              className={`landing-builder-card landing-puzzle-piece landing-puzzle-piece-${index + 1}`}
              initial={{
                opacity: 0,
                x: index % 2 === 0 ? -70 : 70,
                y: index < 2 ? -40 : 50,
                rotate: index % 2 === 0 ? -10 : 10,
              }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
              transition={{ duration: 0.65, delay: 0.28 + index * 0.18 }}
            >
              <div className="landing-builder-card-top">
                <div className="landing-builder-icon">
                  <Icon size={18} />
                </div>
                <span className="landing-builder-step">0{index + 1}</span>
              </div>
              <strong>{step.title}</strong>
              <p>{step.description}</p>
              <span className="landing-builder-cue">{step.cue}</span>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="landing-diploma-paper"
        initial={{ opacity: 0, y: 20, rotate: 7, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, rotate: 5, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="landing-diploma-pattern landing-diploma-pattern-a" aria-hidden="true" />
        <div className="landing-diploma-pattern landing-diploma-pattern-b" aria-hidden="true" />

        <motion.div
          className="landing-diploma-score-chip"
          initial={{ opacity: 0, y: -10, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, delay: 1.55 }}
        >
          <span>Target</span>
          <strong>17.20/20</strong>
        </motion.div>

        <motion.div
          className="landing-diploma-header"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.62 }}
        >
          <span className="landing-diploma-republic">REPUBLIQUE TUNISIENNE</span>
          <span className="landing-diploma-ministry">MINISTERE DE L&apos;EDUCATION ET DE LA FORMATION</span>
          <div className="landing-diploma-title-wrap">
            <strong>DIPLOME DU BACCALAUREAT</strong>
            <span className="landing-diploma-subline">Le Ministre de l&apos;Education et de la Formation</span>
          </div>
          <div className="landing-diploma-divider" />
        </motion.div>

        <motion.div
          className="landing-diploma-body"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.95 }}
        >
          <p className="landing-diploma-script landing-diploma-script-law">
            Vu la loi n°2002-80 du 23 Juillet 2002, relative au régime éducatif et à l&apos;enseignement scolaire et notamment son article 62.
          </p>
          <p className="landing-diploma-script landing-diploma-script-fr">
            Vu le procès verbal final d&apos;admission à l&apos;examen du Baccalauréat. A décerné le présent Diplôme à :
          </p>

          <div className="landing-diploma-fields">
            <div className="landing-diploma-field">
              <span className="landing-diploma-field-label">Nom et prénom</span>
              <strong className="landing-diploma-field-value">Wassim BESSAAD</strong>
            </div>
            <div className="landing-diploma-field">
              <span className="landing-diploma-field-label">Né le</span>
              <strong className="landing-diploma-field-value">19.02.1990 à Tunis - Gouvernorat de Tunis</strong>
            </div>
            <div className="landing-diploma-field-grid">
              <div className="landing-diploma-field">
                <span className="landing-diploma-field-label">Session de Juin 2008</span>
                <strong className="landing-diploma-field-value">Section : Sciences Informatiques</strong>
              </div>
              <div className="landing-diploma-field">
                <span className="landing-diploma-field-label">Identification</span>
                <strong className="landing-diploma-field-value">Série : 00018 - N° d&apos;inscription : 113392</strong>
              </div>
            </div>
          </div>

          <div className="landing-diploma-award">
            <div className="landing-diploma-law">
              <span>Avec la mention : « Passable ».</span>
              <span>Tunis, le 24.06.2008</span>
              <span>P/Le Ministre de l&apos;Education et de la Formation et P.O</span>
            </div>
            <div className="landing-diploma-mention-box">
              <span>Numéro</span>
              <strong>N°502942</strong>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="landing-diploma-seal"
          initial={{ opacity: 0, scale: 0.4, rotate: -28 }}
          animate={{ opacity: 1, scale: 1, rotate: -16 }}
          transition={{ type: "spring", stiffness: 180, damping: 18, delay: 1.45 }}
        >
          <span>
            MINISTERE
            <br />
            EDUCATION
          </span>
        </motion.div>

        <motion.div
          className="landing-diploma-signatures"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 1.3 }}
        >
          <div className="landing-signature">
            <span>Chef du Centre de Correction</span>
          </div>
          <div className="landing-signature">
            <span>NB : le présent n&apos;est délivré qu&apos;une seule fois</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="landing-diploma-caption"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 1.7 }}
      >
        <span className="landing-photo-kicker">{copy.diplomaTag}</span>
        <p>{copy.diplomaNote}</p>
      </motion.div>
    </div>
  );
}

function RealDiplomaScene({ copy }: { copy: LandingCopy }) {
  const pieceMotions = [
    { x: -180, y: -110, rotate: -15, delay: 0.24 },
    { x: 170, y: -120, rotate: 14, delay: 0.42 },
    { x: -150, y: 136, rotate: -11, delay: 0.6 },
    { x: 162, y: 128, rotate: 12, delay: 0.78 },
  ];

  return (
    <div className="landing-diploma-scene landing-diploma-scene-real">
      <div className="landing-diploma-target" aria-hidden="true" />

      <motion.div
        className="landing-diploma-board-wrap"
        initial={{ opacity: 0, y: 28, rotate: 1, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
        transition={{ duration: 0.75, delay: 0.12 }}
      >
        <div className="landing-diploma-board">
          <div className="landing-diploma-ghost" aria-hidden="true" />
          <div className="landing-diploma-board-grain" aria-hidden="true" />

          {copy.buildSteps.map((step, index) => {
            const Icon = buildIcons[index];
            const motionState = pieceMotions[index];

            return (
              <motion.div
                key={step.title}
                className={`landing-diploma-piece landing-diploma-piece-${index + 1}`}
                initial={{
                  opacity: 0,
                  x: motionState.x,
                  y: motionState.y,
                  rotate: motionState.rotate,
                  scale: 0.88,
                }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 130,
                  damping: 18,
                  delay: motionState.delay,
                }}
              >
                <div className="landing-diploma-piece-chip">
                  <div className="landing-builder-icon">
                    <Icon size={16} />
                  </div>
                  <div className="landing-diploma-piece-copy">
                    <strong>{step.title}</strong>
                    <span>{step.cue}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}

          <motion.div
            className="landing-diploma-score-chip"
            initial={{ opacity: 0, y: -12, scale: 0.86 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, delay: 1.18 }}
          >
            <span>Session</span>
            <strong>2022</strong>
          </motion.div>

          <motion.div
            className="landing-diploma-glint"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 150 }}
            transition={{ duration: 1.25, delay: 1.2 }}
            aria-hidden="true"
          />
        </div>
      </motion.div>

      <motion.div
        className="landing-builder-candidate landing-builder-candidate-real"
        initial={{ opacity: 0, x: -32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="landing-builder-avatar">
          <Image
            src="/student.png"
            alt="Bac student preparing for the diploma target"
            fill
            sizes="72px"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="landing-builder-candidate-copy">
          <span className="landing-builder-label">{copy.candidateLabel}</span>
          <strong>{copy.candidateName}</strong>
          <p>{copy.candidateNote}</p>
        </div>
      </motion.div>

      <div className="landing-builder-rail landing-builder-rail-real">
        <span className="landing-builder-rail-title">{copy.buildLabel}</span>
        {copy.buildSteps.map((step, index) => {
          const Icon = buildIcons[index];

          return (
            <motion.div
              key={step.title}
              className="landing-builder-card landing-builder-card-real"
              initial={{ opacity: 0, x: -24, y: 10 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: 0.45, delay: 0.92 + index * 0.12 }}
            >
              <div className="landing-builder-card-top">
                <div className="landing-builder-icon">
                  <Icon size={18} />
                </div>
                <span className="landing-builder-step">0{index + 1}</span>
              </div>
              <strong>{step.title}</strong>
              <p>{step.description}</p>
              <span className="landing-builder-cue">{step.cue}</span>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="landing-diploma-caption landing-diploma-caption-real"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 1.45 }}
      >
        <span className="landing-photo-kicker">{copy.diplomaTag}</span>
        <p>{copy.diplomaNote}</p>
      </motion.div>
    </div>
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
            <div className="landing-hero-inner landing-hero-inner-diploma">
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

              <div className="landing-visual">
                <RealDiplomaScene copy={copy} />
              </div>
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
