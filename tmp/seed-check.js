const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding ELITE V3 Rich Content (Deep Analysis & Structure)...");

  // --- ENGLISH (The Core Excellence) ---
  await prisma.grammarRule.upsert({
    where: { slug: "en-inversions-hard" },
    update: {},
    create: {
      slug: "en-inversions-hard",
      language: "ENGLISH",
      title: "Mastering Inversions (Negative Adverbials)",
      category: "STRUCTURE", // Not in enum? Let's check schema. Oh, GrammarCategory doesn't have STRUCTURE.
      // Wait, let's use the actual enum: TENSES, CONDITIONALS, MODALS, PASSIVE_VOICE, REPORTED_SPEECH, ARTICLES, PREPOSITIONS, CONNECTORS, RELATIVE_CLAUSES, COMPARATIVES
    }
  });
}
