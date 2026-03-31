"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Sparkles, MeshDistortMaterial, ContactShadows, Text, Torus, TorusKnot, Sphere, Box, PresentationControls } from "@react-three/drei";
import { useRef } from "react";
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

interface DeskSceneContent {
  sceneBadge: string;
  sceneTitle: string;
  sceneNote: string;
  sheetLabel: string;
  sheetTitle: string;
  promptLabel: string;
  promptTitle: string;
  promptNote: string;
  timerLabel: string;
  timerValue: string;
  timerNote: string;
  scoreLabel: string;
  scoreValue: string;
  scoreNote: string;
  caption: string;
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

const refreshedLandingCopy: Record<SiteLanguage, LandingCopy> = {
  en: {
    ...landingCopy.en,
    badge: "Turn Bac pressure into a clear plan",
    heroTitle: "Open the platform and feel your next win immediately.",
    heroSubtitle:
      "Students do not need a generic landing page. They need a first screen that feels focused, ambitious, and built for the weeks before the Bac.",
    primaryCta: "Build my study plan",
    secondaryCta: "Take the diagnostic",
    proof: [
      "The hero feels like an exam control room instead of a marketing template.",
      "Every card points to the next move: diagnose, repair, practise, simulate.",
      "The opening is serious, motivating, and made for students without looking childish.",
    ],
    metrics: [
      { value: "06", label: "Bac sections ready" },
      { value: "12d", label: "Sprint mindset" },
      { value: "+1.6", label: "Potential score lift" },
    ],
    buildLabel: "How strong weeks are built",
    candidateLabel: "Bac sprint",
    candidateName: "Session 2026",
    candidateNote: "A calm plan beats panic every single time.",
    buildSteps: [
      {
        title: "Diagnose",
        description: "Start with the real level so revision stops feeling random.",
        cue: "sets the target",
      },
      {
        title: "Repair",
        description: "Fix the weak skills first before spending energy everywhere.",
        cue: "fixes the weakness",
      },
      {
        title: "Train",
        description: "Build speed, writing confidence, and reading rhythm together.",
        cue: "builds the rhythm",
      },
      {
        title: "Simulate",
        description: "Test the result under the same pressure the Bac will bring.",
        cue: "proves the level",
      },
    ],
    diplomaTag: "Exam momentum",
    diplomaNote:
      "The home page should feel like momentum and control, not like decoration.",
    stripCards: [
      {
        title: "It feels like exam season",
        description: "The first screen now matches the student's real mood: pressure, ambition, and a need for clarity.",
      },
      {
        title: "The next move is obvious",
        description: "Instead of abstract design, the hero shows a sequence students can understand and act on fast.",
      },
      {
        title: "Motivation gets structure",
        description: "The page does not just hype the Bac. It turns that energy into a practical plan.",
      },
    ],
    workflowEyebrow: "Built for momentum",
    workflowTitle: "Students need direction fast, especially when pressure starts rising.",
    workflowSubtitle:
      "The new opening is built on a simple idea: reduce panic, show the next action, and make progress feel possible from the first second.",
    workflowBullets: [
      "Start from the real section and not from a generic lesson dump.",
      "Turn writing, reading, grammar, and mock exams into one visible system.",
      "Make the product feel sharp and motivating without falling into empty effects.",
    ],
    workflowSteps: [
      {
        title: "Diagnose",
        description: "See exactly where the student stands before losing time.",
      },
      {
        title: "Train",
        description: "Work on the skills that can move the score the fastest.",
      },
      {
        title: "Deliver",
        description: "Walk into the exam with rhythm, clarity, and proof.",
      },
    ],
    selectorEyebrow: "Personalized start",
    selectorTitle: "Choose the Bac path that matches the way you actually study.",
    selectorSubtitle:
      "Start from the real section, then build the right mix of writing, reading, grammar, and mock pressure.",
    featureEyebrow: "What the platform gives you",
    featureTitle: "Everything should push the next score upward.",
    featureSubtitle:
      "Diagnostics, writing feedback, and exam practice should feel like one system instead of disconnected tools.",
    finalEyebrow: "Ready to move",
    finalNote:
      "Create an account to save the plan, track the streak, and keep the next Bac win in front of you.",
  },
  fr: {
    ...landingCopy.fr,
    badge: "Transformez la pression du Bac en plan clair",
    heroTitle: "Ouvrez la plateforme et sentez votre prochaine victoire tout de suite.",
    heroSubtitle:
      "Les etudiants n'ont pas besoin d'une page d'accueil generique. Ils ont besoin d'un premier ecran net, ambitieux et pense pour les semaines avant le Bac.",
    primaryCta: "Construire mon plan Bac",
    secondaryCta: "Faire le diagnostic",
    proof: [
      "Le hero ressemble a une salle de controle d'examen plutot qu'a un template marketing.",
      "Chaque carte montre la prochaine action: diagnostiquer, reparer, pratiquer, simuler.",
      "L'ouverture est serieuse, motivante et pensee pour l'etudiant sans devenir enfantine.",
    ],
    metrics: [
      { value: "06", label: "Sections Bac" },
      { value: "12j", label: "Etat d'esprit sprint" },
      { value: "+1.6", label: "Gain possible" },
    ],
    buildLabel: "Comment une bonne semaine se construit",
    candidateLabel: "Sprint Bac",
    candidateName: "Session 2026",
    candidateNote: "Un plan calme bat la panique a chaque fois.",
    buildSteps: [
      {
        title: "Diagnostic",
        description: "Partir du vrai niveau pour arreter la revision au hasard.",
        cue: "fixe la cible",
      },
      {
        title: "Reparation",
        description: "Corriger d'abord les faiblesses qui bloquent vraiment la note.",
        cue: "repare la faille",
      },
      {
        title: "Entrainement",
        description: "Construire vitesse, confiance en ecriture et rythme de lecture.",
        cue: "cree le rythme",
      },
      {
        title: "Simulation",
        description: "Verifier le niveau sous la pression du vrai examen.",
        cue: "valide le niveau",
      },
    ],
    diplomaTag: "Momentum examen",
    diplomaNote:
      "La page d'accueil doit donner une sensation d'elan et de controle, pas seulement de decoration.",
    stripCards: [
      {
        title: "On sent la saison du Bac",
        description: "Le premier ecran reflète enfin l'etat reel de l'etudiant: pression, ambition et besoin de clarte.",
      },
      {
        title: "La suite est evidente",
        description: "Au lieu d'un design abstrait, le hero montre une progression que l'etudiant comprend tout de suite.",
      },
      {
        title: "La motivation gagne une structure",
        description: "La page ne vend pas juste le Bac. Elle transforme cette energie en plan concret.",
      },
    ],
    workflowEyebrow: "Construit pour l'elan",
    workflowTitle: "Les etudiants ont besoin d'une direction rapide, surtout quand la pression monte.",
    workflowSubtitle:
      "La nouvelle ouverture suit une idee simple: reduire la panique, montrer la prochaine action et rendre le progres visible des la premiere seconde.",
    workflowBullets: [
      "Commencer par la vraie section au lieu d'une bibliotheque generique.",
      "Relier ecriture, lecture, grammaire et examens blancs dans un seul systeme visible.",
      "Garder une interface forte et motivante sans tomber dans les effets vides.",
    ],
    workflowSteps: [
      {
        title: "Diagnostiquer",
        description: "Voir exactement ou l'etudiant en est avant de perdre du temps.",
      },
      {
        title: "Entrainer",
        description: "Travailler les competences qui font monter la note le plus vite.",
      },
      {
        title: "Assurer",
        description: "Arriver a l'examen avec rythme, clarte et preuves.",
      },
    ],
    selectorEyebrow: "Depart personnalise",
    selectorTitle: "Choisissez le parcours Bac qui correspond a votre vraie maniere d'etudier.",
    selectorSubtitle:
      "Partez de la vraie section puis composez le bon melange entre ecriture, lecture, grammaire et pression d'examen.",
    featureEyebrow: "Ce que la plateforme apporte",
    featureTitle: "Tout doit pousser la prochaine note vers le haut.",
    featureSubtitle:
      "Diagnostics, corrections d'ecriture et pratique d'examen doivent former un seul systeme au lieu d'outils separes.",
    finalEyebrow: "Pret a avancer",
    finalNote:
      "Creez un compte pour sauvegarder le plan, suivre la serie de travail et garder la prochaine victoire Bac devant vous.",
  },
  ar: {
    ...landingCopy.ar,
    badge: "حوّل ضغط الباك لخطة واضحة",
    heroTitle: "افتح المنصة وحس من أول ثانية بالربحة الجاية.",
    heroSubtitle:
      "الطالب ما يحتاجش صفحة أولى عامة. يحتاج افتتاحية تحسها مركزة وطموحة ومبنية للأسابيع اللي قبل الباك.",
    primaryCta: "ابني خطة المراجعة متاعي",
    secondaryCta: "اعمل التشخيص",
    proof: [
      "الواجهة ولات تحسها غرفة قيادة للامتحان موش template تسويق.",
      "كل card تورّيك الحركة الجاية: تشخّص، تصلّح، تتدرّب، وتعمل simulation.",
      "الافتتاحية جدية ومحفزة ومصممة للطالب من غير ما تولّي طفولية.",
    ],
    metrics: [
      { value: "06", label: "شعب الباك" },
      { value: "12ي", label: "عقلية sprint" },
      { value: "+1.6", label: "ارتفاع محتمل" },
    ],
    buildLabel: "كيفاش تتبنى semaine قوية",
    candidateLabel: "Sprint باك",
    candidateName: "Session 2026",
    candidateNote: "الخطة الهادية تغلب panic كل مرة.",
    buildSteps: [
      {
        title: "شخّص",
        description: "ابدأ بالمستوى الحقيقي باش المراجعة ما تبقاش عشوائية.",
        cue: "يحدد الهدف",
      },
      {
        title: "صلّح",
        description: "اصلح أولاً المهارات الضعيفة اللي تعطل فعلاً النقطة.",
        cue: "يسكر الضعف",
      },
      {
        title: "تدرّب",
        description: "ابني السرعة والثقة في الكتابة وريتم القراءة مع بعضهم.",
        cue: "يبني الريتم",
      },
      {
        title: "حاكي الامتحان",
        description: "جرّب النتيجة تحت نفس الضغط اللي يجي نهار الباك.",
        cue: "يثبت المستوى",
      },
    ],
    diplomaTag: "Momentum الامتحان",
    diplomaNote:
      "الصفحة الأولى لازم تعطيك إحساس بالتحكم والتقدم موش مجرد زينة.",
    stripCards: [
      {
        title: "تحسها موسم الباك",
        description: "أول شاشة ولات قريبة من حالة الطالب الحقيقية: ضغط وطموح وحاجة للوضوح.",
      },
      {
        title: "الحركة الجاية واضحة",
        description: "بلا تصميم abstract، الhero يوريك progression ينجم الطالب يفهمها بسرعة.",
      },
      {
        title: "الحماس ولى عنده structure",
        description: "الصفحة ما تعطيكش hype فقط. تحوّل الطاقة لخطة عملية.",
      },
    ],
    workflowEyebrow: "مبنية على الmomentum",
    workflowTitle: "الطالب يحتاج direction بسرعة، خاصة وقت الضغط يطلع.",
    workflowSubtitle:
      "الافتتاحية الجديدة مبنية على فكرة بسيطة: تنقص الpanic، تورّي الحركة الجاية، وتخلي التقدم يبان من أول ثانية.",
    workflowBullets: [
      "ابدأ بالشعبة الحقيقية موش بمكتبة دروس عامة.",
      "اربط الكتابة والقراءة والgrammar والmock exams في system واحد واضح.",
      "خلي الواجهة قوية ومحفزة من غير effects فارغة.",
    ],
    workflowSteps: [
      {
        title: "شخّص",
        description: "شوف بالضبط وين واقف قبل ما تضيع الوقت.",
      },
      {
        title: "تدرّب",
        description: "اخدم على المهارات اللي ترفع النقطة بأسرع طريقة.",
      },
      {
        title: "ادخل حاضر",
        description: "امش للامتحان بريتم واضح وثقة وأدلة على التقدم.",
      },
    ],
    selectorEyebrow: "بداية شخصية",
    selectorTitle: "اختار مسار الباك اللي يوافق الطريقة اللي تراجع بها فعلاً.",
    selectorSubtitle:
      "ابدأ بالشعبة الصحيحة وبعدها كوّن الخليط المناسب من كتابة وقراءة وgrammar وضغط mock.",
    featureEyebrow: "شنوّة تعطيك المنصة",
    featureTitle: "كل حاجة لازم تدز النقطة الجاية للفوق.",
    featureSubtitle:
      "التشخيص وتصحيح الكتابة وتدريب الامتحان لازم يحسّوك system واحد موش أدوات مقصوصة على بعضها.",
    finalEyebrow: "جاهز تتحرك",
    finalNote:
      "اعمل compte باش تحفظ الخطة وتتابع الstreak وتخلي ربحة الباك الجاية ديما قدامك.",
  },
};

const cinematicLandingOverrides: Partial<Record<SiteLanguage, Partial<LandingCopy>>> = {
  en: {
    badge: "The Ultimate Bac Intelligence Hub",
    heroTitle: "Unlock your true Baccalaureate potential.",
    heroSubtitle:
      "Stop guessing your score. Our proprietary AI engine identifies exactly what you need to master next to secure your target grade.",
    primaryCta: "Start My Journey",
    secondaryCta: "Take Free Diagnostic",
    proof: [
      "Precision diagnosis of your current academic level.",
      "Customized roadmap dynamically generated for you.",
      "Daily progress tracking and advanced analytics.",
    ],
    metrics: [
      { value: "48h", label: "Smart Diagnostic" },
      { value: "98%", label: "Accuracy" },
      { value: "24/7", label: "Availability" },
    ],
    buildLabel: "Today's Study Matrix",
    candidateLabel: "Academic Profile",
    candidateName: "Baccalaureate 2026",
    candidateNote: "Every minute spent here translates to exam points.",
    buildSteps: [
      {
        title: "Diagnose",
        description: "Pinpoint your weaknesses instantly.",
        cue: "Analyze current level",
      },
      {
        title: "Strategize",
        description: "Follow an optimized study roadmap.",
        cue: "Build study habits",
      },
      {
        title: "Practice",
        description: "Solve exam-grade questions.",
        cue: "Hone test skills",
      },
      {
        title: "Achieve",
        description: "Hit your target score reliably.",
        cue: "Ace the final",
      },
    ],
    diplomaTag: "Exam Ready",
    diplomaNote:
      "Walk into the exam room with the confidence of someone who has already seen the test.",
    stripCards: [
      {
        title: "Advanced AI Scoring",
        description: "Real-time grading on your essays and responses.",
      },
      {
        title: "Dynamic Feedback",
        description: "Line-by-line grammar and structure corrections.",
      },
      {
        title: "Deep Analytics",
        description: "Watch your projected score climb dynamically.",
      },
    ],
    workflowEyebrow: "Proven Methodology",
    workflowTitle: "Success isn't luck. It's an algorithm.",
    workflowSubtitle:
      "We broke down the last 15 years of exams to create the most efficient preparation engine ever designed.",
    workflowBullets: [
      "No wasted effort on concepts you already know.",
      "Instant feedback loops for faster retention.",
      "Simulated exam environments to build pressure tolerance.",
    ],
    finalNote:
      "Join thousands of students who have already hacked their way to academic excellence.",
  },
};

const deskSceneCopy: Partial<Record<SiteLanguage, DeskSceneContent>> = {
  en: {
    sceneBadge: "BAC 2026 FOCUS",
    sceneTitle: "Precision preparation for the Tunisian Baccalaureate.",
    sceneNote: "Your study roadmap is structured, targeted, and highly effective.",
    sheetLabel: "Diagnostic",
    sheetTitle: "Find your true starting point",
    promptLabel: "Mastery",
    promptTitle: "Target weaknesses, build confidence",
    promptNote: "Structure, grammar, and mock practice combined.",
    timerLabel: "Next Mock Exam",
    timerValue: "03 days",
    timerNote: "Stay on track with regular check-ins.",
    scoreLabel: "Goal",
    scoreValue: "16+/20",
    scoreNote: "Build the score you actually deserve.",
    caption: "A structured, premium environment built for exam success.",
  },
};

const heroSceneCopy: Record<
  SiteLanguage,
  {
    boardEyebrow: string;
    boardTitle: string;
    boardNote: string;
    liveLabel: string;
    focusLabel: string;
    focusItems: string[];
    forecastLabel: string;
    forecastValue: string;
    forecastNote: string;
    countdownLabel: string;
    countdownValue: string;
    streakLabel: string;
    streakValue: string;
    weakLabel: string;
    weakValue: string;
    routeStatus: string;
    sideNote: string;
    previewLabel: string;
    previewTitle: string;
    previewNote: string;
  }
> = {
  en: {
    boardEyebrow: "Bac Mode",
    boardTitle: "This is what focused revision should feel like.",
    boardNote: "Clear targets, fast feedback, zero visual noise.",
    liveLabel: "Focus mode active",
    focusLabel: "Tonight's focus",
    focusItems: ["Essay structure repair", "Grammar precision drill", "Timed reading pass"],
    forecastLabel: "Score forecast",
    forecastValue: "15.8/20",
    forecastNote: "+1.6 vs last mock when the sprint is complete",
    countdownLabel: "Next mock",
    countdownValue: "03 days",
    streakLabel: "Study streak",
    streakValue: "12 days",
    weakLabel: "Weak spot",
    weakValue: "Introductions",
    routeStatus: "72% ready",
    sideNote: "A strong homepage should feel like momentum, not decoration.",
    previewLabel: "Platform view",
    previewTitle: "One board. No panic.",
    previewNote: "Writing, diagnostics, reading, and mock exams finally feel connected.",
  },
  fr: {
    boardEyebrow: "Mode Bac",
    boardTitle: "Voila le type d'ouverture qui donne envie d'etudier.",
    boardNote: "Objectifs clairs, feedback rapide, zero bruit visuel.",
    liveLabel: "Mode focus actif",
    focusLabel: "Focus de ce soir",
    focusItems: ["Reparation du plan", "Drill de grammaire", "Lecture chronometree"],
    forecastLabel: "Projection de note",
    forecastValue: "15.8/20",
    forecastNote: "+1.6 par rapport au dernier blanc si le sprint est tenu",
    countdownLabel: "Prochain blanc",
    countdownValue: "03 jours",
    streakLabel: "Serie de travail",
    streakValue: "12 jours",
    weakLabel: "Point faible",
    weakValue: "Introductions",
    routeStatus: "72% pret",
    sideNote: "Une bonne page d'accueil doit donner de l'elan, pas juste decorer.",
    previewLabel: "Vue plateforme",
    previewTitle: "Un seul tableau. Zero panique.",
    previewNote: "Ecriture, diagnostic, lecture et examens blancs se lisent enfin comme un seul systeme.",
  },
  ar: {
    boardEyebrow: "وضع الباك",
    boardTitle: "هكّا لازم تحس المراجعة المركزة.",
    boardNote: "أهداف واضحة، feedback سريع، ومن غير ضجيج بصري.",
    liveLabel: "التركيز مفعّل",
    focusLabel: "تركيز الليلة",
    focusItems: ["إصلاح plan المقال", "drill على grammar", "قراءة بوقت محدد"],
    forecastLabel: "توقع النقطة",
    forecastValue: "15.8/20",
    forecastNote: "+1.6 على آخر mock كي تكمل الsprint",
    countdownLabel: "الmock الجاي",
    countdownValue: "03 أيام",
    streakLabel: "سلسلة المراجعة",
    streakValue: "12 يوم",
    weakLabel: "النقطة الضعيفة",
    weakValue: "المقدمات",
    routeStatus: "72% جاهز",
    sideNote: "الصفحة الأولى لازم تعطيك momentum موش مجرد زينة.",
    previewLabel: "نظرة على المنصة",
    previewTitle: "لوحة وحدة. بلا panic.",
    previewNote: "الكتابة والتشخيص والقراءة والmock exams ولاو مربوطين في system واحد.",
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

function MomentumScene({
  copy,
  lang,
  sections,
  isRTL,
}: {
  copy: LandingCopy;
  lang: SiteLanguage;
  sections: string[];
  isRTL: boolean;
}) {
  const scene = heroSceneCopy[lang] || heroSceneCopy.en;

  return (
    <div className="landing-momentum-scene" style={{ direction: isRTL ? "rtl" : "ltr" }}>
      <div className="landing-momentum-glow landing-momentum-glow-a" aria-hidden="true" />
      <div className="landing-momentum-glow landing-momentum-glow-b" aria-hidden="true" />

      <motion.div
        className="landing-command-board"
        initial={{ opacity: 0, y: 26, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, delay: 0.08 }}
      >
        <div className="landing-command-top">
          <div className="landing-command-heading">
            <span className="landing-chip-label">{scene.boardEyebrow}</span>
            <h3>{scene.boardTitle}</h3>
            <p>{scene.boardNote}</p>
          </div>
          <div className="landing-command-live">
            <span className="landing-command-live-dot" aria-hidden="true" />
            {scene.liveLabel}
          </div>
        </div>

        <div className="landing-command-grid">
          <motion.div
            className="landing-command-card landing-command-card-focus"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
          >
            <span className="landing-chip-label">{scene.focusLabel}</span>
            <div className="landing-command-list">
              {scene.focusItems.map((item) => (
                <div key={item} className="landing-command-list-item">
                  <CheckCircle2 size={16} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="landing-command-card landing-command-card-score"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3 }}
          >
            <span className="landing-chip-label">{scene.forecastLabel}</span>
            <div className="landing-command-score-wrap">
              <strong>{scene.forecastValue}</strong>
              <span>{scene.forecastNote}</span>
            </div>
            <div className="landing-command-bars" aria-hidden="true">
              <span className="landing-command-bar landing-command-bar-a" />
              <span className="landing-command-bar landing-command-bar-b" />
              <span className="landing-command-bar landing-command-bar-c" />
              <span className="landing-command-bar landing-command-bar-d" />
            </div>
          </motion.div>

          <motion.div
            className="landing-command-card landing-command-card-stats"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.4 }}
          >
            {[
              { label: scene.countdownLabel, value: scene.countdownValue },
              { label: scene.streakLabel, value: scene.streakValue },
              { label: scene.weakLabel, value: scene.weakValue },
            ].map((item) => (
              <div key={item.label} className="landing-command-mini-stat">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="landing-route-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="landing-route-head">
            <span className="landing-chip-label">{copy.buildLabel}</span>
            <strong>{scene.routeStatus}</strong>
          </div>
          <div className="landing-route-progress-track" aria-hidden="true">
            <motion.span
              className="landing-route-progress-fill"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.7 }}
            />
          </div>
          <div className="landing-route-steps">
            {copy.buildSteps.map((step, index) => {
              const Icon = buildIcons[index];

              return (
                <motion.div
                  key={step.title}
                  className="landing-route-step"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.42, delay: 0.72 + index * 0.1 }}
                >
                  <div className="landing-route-step-top">
                    <div className="landing-card-icon landing-card-icon-small">
                      <Icon size={18} />
                    </div>
                    <span className="landing-step-number">0{index + 1}</span>
                  </div>
                  <strong>{step.title}</strong>
                  <p>{step.description}</p>
                  <span className="landing-route-step-cue">{step.cue}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="landing-sprint-note"
        initial={{ opacity: 0, x: isRTL ? 30 : -30, y: 16 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.52, delay: 0.35 }}
      >
        <span className="landing-photo-kicker">{copy.candidateLabel}</span>
        <strong>{copy.candidateName}</strong>
        <p>{scene.sideNote}</p>
      </motion.div>

      <motion.div
        className="landing-section-cloud"
        initial={{ opacity: 0, x: isRTL ? -24 : 24, y: -8 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.5, delay: 0.48 }}
      >
        <span className="landing-photo-kicker">{copy.sectionsLabel}</span>
        <div className="landing-section-pill-row">
          {sections.map((section) => (
            <span key={section} className="landing-section-pill">
              {section}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="landing-preview-card"
        initial={{ opacity: 0, x: isRTL ? 32 : -32, y: 16, rotate: isRTL ? 3 : -3 }}
        animate={{ opacity: 1, x: 0, y: 0, rotate: isRTL ? 2 : -2 }}
        transition={{ duration: 0.55, delay: 0.6 }}
      >
        <div className="landing-preview-media">
          <Image
            src="/dashboard.png"
            alt="Platform dashboard preview"
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className="landing-preview-copy">
          <span className="landing-photo-kicker">{scene.previewLabel}</span>
          <strong>{scene.previewTitle}</strong>
          <p>{scene.previewNote}</p>
        </div>
      </motion.div>
    </div>
  );
}

function NextLevelCore() {
  const coreRef = useRef<any>(null);
  const ring1Ref = useRef<any>(null);
  const ring2Ref = useRef<any>(null);
  const ring3Ref = useRef<any>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.5;
      coreRef.current.rotation.x = t * 0.2;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.8;
      ring1Ref.current.rotation.y = t * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = t * -0.5;
      ring2Ref.current.rotation.z = t * 0.6;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = t * 0.4;
      ring3Ref.current.rotation.z = t * -0.3;
    }
  });

  return (
    <PresentationControls
      global
      snap={true}
      rotation={[0, 0.3, 0]}
      polar={[-Math.PI / 3, Math.PI / 3]}
      azimuth={[-Math.PI / 1.4, Math.PI / 2]}
    >
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
        <mesh ref={coreRef} scale={1.2}>
          <icosahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial 
            color="#a855f7" 
            emissive="#7e22ce" 
            emissiveIntensity={1.5} 
            wireframe 
            thickness={2}
          />
        </mesh>

        <mesh scale={1.8}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhysicalMaterial 
            color="#6366f1" 
            transmission={0.95} 
            opacity={1} 
            transparent 
            roughness={0.1} 
            ior={1.5}
            thickness={0.5}
          />
        </mesh>

        <Text
          position={[0, 0, 0]}
          fontSize={0.5}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
          font="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf"
        >
          A.I. MATRIX
        </Text>

        <group ref={ring1Ref}>
          <Torus args={[2.8, 0.015, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={2} />
          </Torus>
        </group>
        
        <group ref={ring2Ref}>
          <Torus args={[3.2, 0.015, 16, 100]} rotation={[0, Math.PI / 2, 0]}>
            <meshStandardMaterial color="#f472b6" emissive="#db2777" emissiveIntensity={2} />
          </Torus>
        </group>

        <group ref={ring3Ref}>
          <Torus args={[3.6, 0.025, 32, 100]} rotation={[Math.PI / 4, 0, Math.PI / 4]}>
            <meshPhysicalMaterial color="#ffffff" transmission={0.5} opacity={0.8} transparent roughness={0} />
          </Torus>
          <mesh position={[3.6, 0, 0]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={3} />
          </mesh>
          <mesh position={[-3.6, 0, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color="#a855f7" emissive="#a855f7" emissiveIntensity={2} />
          </mesh>
        </group>

        <Sparkles count={200} scale={10} size={2} speed={0.8} opacity={0.7} color="#e0e7ff" />
      </Float>
    </PresentationControls>
  );
}

function CinematicDeskScene({
  copy,
  lang,
  sections,
  isRTL,
}: {
  copy: LandingCopy;
  lang: SiteLanguage;
  sections: string[];
  isRTL: boolean;
}) {
  return (
    <div className="landing-desk-scene" style={{ width: "100%", position: "relative", zIndex: 10, cursor: "grab" }}>
      <Canvas camera={{ position: [0, 0, 9], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#6366f1" />
        <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#ec4899" />
        <NextLevelCore />
        <Environment preset="city" />
        <ContactShadows position={[0, -3.5, 0]} opacity={0.6} scale={18} blur={3} far={6} color="#a855f7" />
      </Canvas>
    </div>
  );
}

export function HomeClient({ lang, t, isRTL }: HomeClientProps) {
  const baseCopy = refreshedLandingCopy[lang] || refreshedLandingCopy.en;
  const copy = { ...baseCopy, ...(cinematicLandingOverrides[lang] || {}) };
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
      <style dangerouslySetInnerHTML={{ __html: `
        .landing-home {
          background-color: #000000 !important;
          background-image: 
            radial-gradient(circle at 10% 40%, rgba(99, 102, 241, 0.25), transparent 30%),
            radial-gradient(circle at 90% 60%, rgba(245, 158, 11, 0.15), transparent 35%) !important;
        }
        .landing-hero-inner-cinematic {
          position: relative;
          padding: 4.5rem !important;
          border-radius: 2.5rem !important;
          background: linear-gradient(145deg, rgba(20,20,30,0.6) 0%, rgba(5,5,10,0.95) 100%) !important;
          box-shadow: 
            0 0 0 1px rgba(255,255,255,0.05) inset,
            0 30px 60px rgba(0,0,0,0.8),
            0 0 120px rgba(99, 102, 241, 0.15) !important;
          backdrop-filter: blur(24px) !important;
          overflow: hidden;
          margin-top: 2rem;
        }
        .landing-hero-inner-cinematic::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
          transform: skewX(-20deg) translateX(-150%);
          animation: shine 8s infinite cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes shine {
          0%, 30% { transform: skewX(-20deg) translateX(-150%); }
          100% { transform: skewX(-20deg) translateX(300%); }
        }
        .landing-badge {
          display: inline-block;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(168, 85, 247, 0.15)) !important;
          color: #d8b4fe !important;
          border: 1px solid rgba(168, 85, 247, 0.4) !important;
          text-shadow: 0 0 15px rgba(168, 85, 247, 0.6) !important;
          padding: 10px 20px !important;
          border-radius: 100px !important;
          font-weight: 800 !important;
          font-size: 0.95rem !important;
          letter-spacing: 1.5px !important;
          margin-bottom: 2rem !important;
          box-shadow: 0 0 30px rgba(168, 85, 247, 0.25) !important;
        }
        .landing-desk-scene {
          height: 600px !important;
        }
        @media (max-width: 768px) {
          .landing-desk-scene {
            height: 350px !important;
            margin-top: -2rem !important;
          }
        }
        .landing-title {
          font-size: clamp(3rem, 5vw, 4.5rem) !important;
          line-height: 1.1 !important;
          background: linear-gradient(to bottom right, #ffffff 20%, #a855f7 80%, #6366f1 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          text-shadow: 0 15px 35px rgba(99, 102, 241, 0.25) !important;
          margin-bottom: 1.75rem !important;
          letter-spacing: -1px !important;
        }
        .landing-subtitle {
          font-size: 1.25rem !important;
          line-height: 1.6 !important;
          color: rgba(255,255,255,0.7) !important;
        }
        .button-link {
          background: linear-gradient(135deg, #ffffff, #e0e0e0) !important;
          color: #000 !important;
          box-shadow: 0 10px 30px rgba(255,255,255,0.35), 0 0 40px rgba(255,255,255,0.2) inset !important;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1) !important;
          border: 1px solid rgba(255,255,255,0.8) !important;
          font-weight: 800 !important;
        }
        .button-link:hover {
          transform: translateY(-5px) scale(1.04) !important;
          box-shadow: 0 20px 40px rgba(255,255,255,0.45), 0 0 50px rgba(255,255,255,0.3) inset !important;
        }
        .button-secondary {
          background: rgba(255,255,255,0.03) !important;
          color: #fff !important;
          border: 1px solid rgba(255,255,255,0.15) !important;
          box-shadow: 0 4px 15px rgba(0,0,0,0.2) !important;
        }
        .button-secondary:hover {
          background: rgba(255,255,255,0.08) !important;
          border-color: rgba(255,255,255,0.4) !important;
          box-shadow: 0 10px 30px rgba(255,255,255,0.15) !important;
        }
        .landing-metric-card {
          background: rgba(255,255,255,0.02) !important;
          backdrop-filter: blur(12px) !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          border-radius: 1.25rem !important;
          padding: 1.75rem !important;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1) !important;
          position: relative;
          overflow: hidden;
        }
        .landing-metric-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 120%, rgba(99, 102, 241, 0.1), transparent 70%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .landing-metric-card:hover {
          background: rgba(255,255,255,0.04) !important;
          border-color: rgba(168, 85, 247, 0.4) !important;
          transform: translateY(-4px) !important;
          box-shadow: 0 15px 40px rgba(168, 85, 247, 0.2) !important;
        }
        .landing-metric-card:hover::after {
          opacity: 1;
        }
        .landing-metric-card strong {
          background: linear-gradient(to right, #818cf8, #c084fc) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          font-size: 3rem !important;
          display: block !important;
          margin-bottom: 0.5rem !important;
          text-shadow: 0 0 25px rgba(168, 85, 247, 0.4) !important;
        }
        .landing-desk-scene {
          filter: drop-shadow(0 0 40px rgba(99, 102, 241, 0.3));
        }
        @media (max-width: 768px) {
          .landing-hero-inner-cinematic {
            padding: 2rem !important;
            border-radius: 1.5rem !important;
          }
        }
      `}} />
      <section className="landing-stage">
        <div className="landing-shell">
          <motion.div className="landing-hero" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="landing-hero-inner landing-hero-inner-cinematic">
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
                <CinematicDeskScene copy={copy} lang={lang} sections={sections} isRTL={isRTL} />
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
