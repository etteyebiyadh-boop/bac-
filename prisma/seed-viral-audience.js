const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Viral & Attractive Content (Audience Catalyst)...");

  // --- ENGLISH (The Viral Hook) ---
  await prisma.lesson.upsert({
    where: { slug: "en-viral-essay-secrets" },
    update: {},
    create: {
      slug: "en-viral-essay-secrets",
      language: "ENGLISH",
      title: "The 'Golden 5': Verbs that Guarantee 17/20+",
      summary: "Stop using 'do' and 'get'. Use these elite lexical choices to impress the Bac examiner instantly.",
      body: "To reach the 17+ range in English, you must demonstrate 'Lexical Precision'. Replacing generic verbs with 'Pinnacle Choices' signals to the grader that you are an elite student.\n\n1. Instead of 'do', use **EXPERT** (e.g., Expert a positive influence).\n2. Instead of 'get', use **ACQUIRE** or **OBTAIN**.\n3. Instead of 'say', use **ASSERT** or **CONTEND**.\n4. Instead of 'show', use **ELUCIDATE** or **MANIFEST**.\n5. Instead of 'change', use **TRANSFIGURE** or **REVOLUTIONIZE**.",
      theme: "Writing Skills",
      skillFocus: "structure",
      difficulty: "HARD",
      estimatedMinutes: 8,
      takeawayJson: ["Replace generic verbs", "Precision = Higher Band Score", "Bac Graders look for lexical variety"]
    }
  });

  // --- FRENCH (The Fix) ---
  await prisma.lesson.upsert({
    where: { slug: "fr-viral-error-fix" },
    update: {},
    create: {
      slug: "fr-viral-error-fix",
      language: "FRENCH",
      title: "L'Erreur #1 qui vous fait perdre 2 points",
      summary: "Ne laissez pas une faute d'inattention détruire votre moyenne de Français.",
      body: "L'erreur la plus fréquente en Bac Français n'est pas la grammaire complexe, mais la confusion entre le **Futur Simple** et le **Conditionnel Présent** dans les si clauses.\n\n- Faux: Si j'étudie, je réussirais (Conditionnel).\n- Vrai: Si j'étudie, je réussirai (Futur).\n\nMaîtriser cette distinction est le 'ticket d'entrée' pour la note d'excellence (17+).",
      theme: "Grammar Fix",
      skillFocus: "grammar",
      difficulty: "MEDIUM",
      estimatedMinutes: 5,
      takeawayJson: ["Check Si-Clauses", "Futur vs Conditionnel", "Instant score boost"]
    }
  });

  // --- ARABIC (The Key) ---
  await prisma.lesson.upsert({
    where: { slug: "ar-viral-synthesis" },
    update: {},
    create: {
      slug: "ar-viral-synthesis",
      language: "ARABIC",
      title: "أسرار فقرة التأليف: كيف تضمن العلامة الكاملة؟",
      summary: "الطريقة المثالية لربط الأفكار والخروج بخلاصة تحليلية تبهر المصحح.",
      body: "فقرة التأليف (التركيب) هي قلب تحليل النص. المصحح يبحث عن دقة الاستنتاج والقدرة على التوليف بين الأبعاد المختلفة للموضوع.\n\nاستخدم مفاتيح الربط العالية:\n- بناءً على ما سبق ذكره...\n- يتبين لنا جلياً أن...\n- فضلاً عن كون النص يطرح إشكالية...",
      theme: "Analytical Skills",
      skillFocus: "communication",
      difficulty: "HARD",
      estimatedMinutes: 10,
      takeawayJson: ["دقة الاستنتاج", "التوليف بين الأفكار", "استخدام روابط نصية عالية"]
    }
  });

  // --- SPANISH (Viral Theme) ---
  await prisma.lesson.upsert({
    where: { slug: "es-viral-tech" },
    update: {},
    create: {
      slug: "es-viral-tech",
      language: "SPANISH",
      title: "Tecnología y Sociedad: Vocabulario 'Top'",
      summary: "Las palabras clave para dominar el tema de la tecnología en el examen de español.",
      body: "La tecnología es un tema estrella en la PAU/Bac. Para brillar, necesitas términos específicos como 'Brecha digital', 'Redes sociales' y 'Ciberseguridad'.",
      theme: "Technology",
      skillFocus: "vocabulary",
      difficulty: "MEDIUM",
      estimatedMinutes: 6,
      takeawayJson: ["Brecha digital", "Inovación", "Redes sociales"]
    }
  });

  // --- GERMAN (Viral Summary) ---
  await prisma.lesson.upsert({
    where: { slug: "de-viral-environment" },
    update: {},
    create: {
      slug: "de-viral-environment",
      language: "GERMAN",
      title: "Umwelt & Klima: Die 20 wichtigsten Wörter",
      summary: "Alles, was du für die Zusammenfassung zum Thema Umwelt brauchst.",
      body: "Deutschland ist führend in der Ökologie. Die Bac-Prüfer lieben Texte über Nachhaltigkeit (Nachhaltigkeit) und Klimawandel (Klimawandel).",
      theme: "Environment",
      skillFocus: "vocabulary",
      difficulty: "MEDIUM",
      estimatedMinutes: 7,
      takeawayJson: ["Nachhaltigkeit", "Klimawandel", "Energiewende"]
    }
  });

  // --- ITALIAN (Viral Arts) ---
  await prisma.lesson.upsert({
    where: { slug: "it-viral-arts" },
    update: {},
    create: {
      slug: "it-viral-arts",
      language: "ITALIAN",
      title: "L'Arte in Italia: Parlare come un esperto",
      summary: "Termini raffinati per descrivere la bellezza e il patrimonio culturale.",
      body: "L'Italia è il paese dell'arte. Impara a usare termini come 'Patrimonio dell'Umanità' e 'Rinascimento' per elevare il tuo punteggio.",
      theme: "Culture",
      skillFocus: "vocabulary",
      difficulty: "MEDIUM",
      estimatedMinutes: 5,
      takeawayJson: ["Patrimonio dell'Umanità", "Rinascimento", "Cultura"]
    }
  });

  console.log("Viral Seeding Completed Successfully!");
}

main().finally(() => prisma.$disconnect());
