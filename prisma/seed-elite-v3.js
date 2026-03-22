const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Elite V3 Rich Content (Deep Analysis & Structure)...");

  // --- ENGLISH (Advanced Structure) ---
  await prisma.grammarRule.upsert({
    where: { slug: "en-advanced-connectors" },
    update: {},
    create: {
      slug: "en-advanced-connectors",
      language: "ENGLISH",
      title: "Elevating Cohesion: Advanced Connectors",
      category: "CONNECTORS",
      difficulty: "HARD",
      rule: "Connectors aren't just for linking; they signal the logical progression of your argument. For a 17/20, avoid 'But' and 'So'; instead, use sophisticated signposts.",
      formula: "[Statement] + [Semicolon] + [Advanced Connector] + [Comma] + [Consequence/Contrast]",
      examples: [
        "The technological leap is immense; nevertheless, ethical concerns remain paramount.",
        "Governments must act now; otherwise, environmental degradation will be irreversible."
      ],
      usageNotes: "Essential for the 'Coherence and Cohesion' score in your Bac Essay.",
      bacSections: ["MATHEMATIQUES", "SCIENCES_EXPERIMENTALES", "LETTRES", "ECONOMIE_GESTION"]
    }
  });

  // --- FRENCH (Advanced Subjunctive) ---
  await prisma.grammarRule.upsert({
    where: { slug: "fr-subjonctif-exigence" },
    update: {},
    create: {
      slug: "fr-subjonctif-exigence",
      language: "FRENCH",
      title: "Le Subjonctif: L'Exigence de l'Expression",
      category: "CONDITIONALS", // Closest match in current simplified Enum
      difficulty: "HARD",
      rule: "Le subjonctif exprime l'incertitude, le désir, ou la nécessité. C'est le marqueur d'un niveau de langue 'Elite' en Bac.",
      formula: "Que + Sujet + Verbe (terminaisons: -e, -es, -e, -ions, -iez, -ent)",
      examples: [
        "Il est primordial que nous agissions (Agir).",
        "Bien que le progrès soit (Être) indéniable, il faut rester vigilant."
      ],
      usageNotes: "Utilisez 'Bien que' + Subjonctif au lieu de 'Même si' pour impressionner le correcteur.",
      bacSections: ["LETTRES", "ECONOMIE_GESTION"]
    }
  });

  // --- ARABIC (Rhetoric & Analysis) ---
  await prisma.grammarRule.upsert({
    where: { slug: "ar-rhetoric-pinnacle" },
    update: {},
    create: {
      slug: "ar-rhetoric-pinnacle",
      language: "ARABIC",
      title: "الطباق والمقابلة: أسرار التوازن",
      category: "CONNECTORS",
      difficulty: "MEDIUM",
      rule: "الطباق هو الجمع بين الشيء وضده، والمقابلة هي ترتيب معان ضد معان أخرى. يهدفان لتوضيح المعنى وتأكيده.",
      formula: "الطباق الإيجابي (أبيض/أسود)، الطباق السلبي (يعلم/لا يعلم)",
      examples: [
        "وتحسبهم أيقاظاً وهم رقود (طباق)",
        "فليضحكوا قليلاً وليبكوا كثيراً (مقابلة)"
      ],
      usageNotes: "ركيزة أساسية في تحليل النصوص الشعرية في البكالوريا.",
      bacSections: ["LETTRES", "MATHEMATIQUES"]
    }
  });

  // --- WORLD VOCABULARY (Broad Themes) ---
  await prisma.vocabularySet.upsert({
    where: { slug: "en-vocab-future-tech" },
    update: {},
    create: {
      slug: "en-vocab-future-tech",
      language: "ENGLISH",
      title: "The Tech Revolution & AI Ethics",
      theme: "TECHNOLOGY",
      bacContext: "Writing on scientific progress vs human values",
      difficulty: "HARD",
      description: "Advanced vocabulary to discuss the double-edged sword of innovation.",
      bacSections: ["SCIENCES_INFORMATIQUE", "MATHEMATIQUES", "SCIENCES_TECHNIQUES"]
    }
  });

  // --- SPANISH (Excellence) ---
  await prisma.vocabularySet.upsert({
    where: { slug: "es-vocab-turismo" },
    update: {},
    create: {
      slug: "es-vocab-turismo",
      language: "SPANISH",
      title: "El Turismo en España",
      theme: "TOURISM",
      bacContext: "Comprensión sobre el impacto económico del turismo",
      difficulty: "MEDIUM",
      description: "Léxico fundamental sobre los viajes, la cultura y la economía.",
      bacSections: ["LETTRES", "ECONOMIE_GESTION"]
    }
  });

  // --- GERMAN (Excellence) ---
  await prisma.vocabularySet.upsert({
    where: { slug: "de-vocab-umwelt" },
    update: {},
    create: {
      slug: "de-vocab-umwelt",
      language: "GERMAN",
      title: "Nachhaltigkeit & Umweltschutz",
      theme: "ENVIRONMENT",
      bacContext: "Schreiben über Erneuerbare Energien",
      difficulty: "MEDIUM",
      description: "Kernbegriffe für das Thema Ökologie und Klimawandel.",
      bacSections: ["MATHEMATIQUES", "SCIENCES_EXPERIMENTALES"]
    }
  });

  // --- ITALIAN (Excellence) ---
  await prisma.vocabularySet.upsert({
    where: { slug: "it-vocab-tecnologia" },
    update: {},
    create: {
      slug: "it-vocab-tecnologia",
      language: "ITALIAN",
      title: "La Rivoluzione Digitale",
      theme: "TECHNOLOGY",
      bacContext: "Analisi di testo sull'uso dei social network",
      difficulty: "MEDIUM",
      description: "Termini moderni per discutere dell'impatto di internet.",
      bacSections: ["LETTRES", "ECONOMIE_GESTION"]
    }
  });

  console.log("Elite V3 Seeding Completed Successfully!");
}

main().finally(() => prisma.$disconnect());
