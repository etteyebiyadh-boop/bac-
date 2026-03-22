const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Ultimate Rich Content for all tracks (Fixed Enums)...");

  // --- ARABIC (Core) ---
  await prisma.grammarRule.upsert({
    where: { slug: "ar-balagha-istiara" },
    update: {},
    create: {
      slug: "ar-balagha-istiara",
      language: "ARABIC",
      title: "الاستعارة المكنية والتصريحية",
      category: "CONNECTORS", // Nearest match for Balagha tools
      difficulty: "HARD",
      rule: "الاستعارة هي تشبيه حذف أحد طرفيه. المكنية هي التي يحذف فيها المشبه به، والتصريحية هي التي يصرح فيها بلفظ المشبه به.",
      formula: "استعارة مكنية = المشبه + صفة من صفات المشبه به",
      examples: ["طأطأ الموت رأسه (مكنية)", "زغردت الرصاصات (تصريحية)"],
      usageNotes: "تستخدم بكثرة في مواضيع التحرير الأدبي لشعبة الآداب.",
      bacSections: ["LETTRES"]
    }
  });

  await prisma.vocabularySet.upsert({
    where: { slug: "ar-critical-terms" },
    update: {},
    create: {
      slug: "ar-critical-terms",
      language: "ARABIC",
      title: "مصطلحات النقد الأدبي",
      theme: "ARTS_ENTERTAINMENT",
      bacContext: "التحليل الأدبي للقصيدة والمقال",
      difficulty: "HARD",
      description: "مجموعة من المصطلحات الأساسية لتحليل النصوص الأدبية في البكالوريا التونسية.",
      bacSections: ["LETTRES"]
    }
  });

  // --- FRENCH (Core) ---
  await prisma.grammarRule.upsert({
    where: { slug: "fr-concordance-temps" },
    update: {},
    create: {
      slug: "fr-concordance-temps",
      language: "FRENCH",
      title: "La Concordance des Temps",
      category: "TENSES",
      difficulty: "MEDIUM",
      rule: "Règle indispensable pour exprimer l'antériorité, la simultanéité ou la postériorité dans les récits complexes.",
      formula: "Passé Composé -> Plus-que-parfait / Présent -> Futur Simple",
      examples: ["Il a dit qu'il viendrait (Postériorité)", "Elle pensait qu'il était parti (Antériorité)"],
      usageNotes: "Vital pour la section Essai en Français.",
      bacSections: ["MATHEMATIQUES", "SCIENCES_EXPERIMENTALES", "LETTRES", "ECONOMIE_GESTION", "SCIENCES_INFORMATIQUE", "SCIENCES_TECHNIQUES"]
    }
  });

  // --- SPANISH (Optional) ---
  await prisma.grammarRule.upsert({
    where: { slug: "es-subjuntivo-presente" },
    update: {},
    create: {
      slug: "es-subjuntivo-presente",
      language: "SPANISH",
      title: "El Subjuntivo Presente",
      category: "CONDITIONALS", // Subjunctive often goes here in simplified schemas
      difficulty: "HARD",
      rule: "El subjuntivo se usa para expresar deseos, dudas, o emociones subjetivas.",
      formula: "Raíz del presente + -e/-a (inverso)",
      examples: ["Espero que estudies mucho", "Dudo que venga hoy"],
      usageNotes: "Imprescindible para las cartas de opinión en el examen de español.",
      bacSections: ["LETTRES"]
    }
  });

  await prisma.vocabularySet.upsert({
    where: { slug: "es-vocab-medio-ambiente" },
    update: {},
    create: {
      slug: "es-vocab-medio-ambiente",
      language: "SPANISH",
      title: "El Medio Ambiente",
      theme: "ENVIRONMENT",
      bacContext: "Redacción sobre el cambio climático",
      difficulty: "MEDIUM",
      description: "Léxico esencial para hablar de la sostenibilidad y el planeta.",
      bacSections: ["LETTRES", "ECONOMIE_GESTION"]
    }
  });

  // --- GERMAN (Optional) ---
  await prisma.grammarRule.upsert({
    where: { slug: "de-passiv-mit-werden" },
    update: {},
    create: {
      slug: "de-passiv-mit-werden",
      language: "GERMAN",
      title: "Das Passiv mit 'werden'",
      category: "PASSIVE_VOICE",
      difficulty: "HARD",
      rule: "Bildung des Passivs im Präsens und Präteritum.",
      formula: "werden + Partizip II",
      examples: ["Das Haus wird gebaut", "Die Hausaufgabe wurde gemacht"],
      usageNotes: "Wird oft in Texten über Wissenschaft und Geschichte verwendet.",
      bacSections: ["LETTRES", "SCIENCES_EXPERIMENTALES"]
    }
  });

  // --- ITALIAN (Optional) ---
  await prisma.vocabularySet.upsert({
    where: { slug: "it-produzione-scritta" },
    update: {},
    create: {
      slug: "it-produzione-scritta",
      language: "ITALIAN",
      title: "L'Arte della Scrittura",
      theme: "ARTS_ENTERTAINMENT",
      bacContext: "Analisi di testo e saggio",
      difficulty: "MEDIUM",
      description: "Termini per collegare le idee e strutturare un saggio perfetto.",
      bacSections: ["LETTRES"]
    }
  });

  console.log("Seed Completed Successfully!");
}

main().finally(() => prisma.$disconnect());
