const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const models = ['lesson', 'exercise', 'readingPassage', 'grammarRule', 'vocabularySet'];
  const languages = ['ENGLISH', 'FRENCH', 'ARABIC', 'SPANISH', 'GERMAN', 'ITALIAN'];

  console.log("--- DATA COUNTS BY LANGUAGE ---");
  for (const lang of languages) {
    console.log(`\nLanguage: ${lang}`);
    for (const model of models) {
      const count = await prisma[model].count({ where: { language: lang } });
      console.log(`  ${model}: ${count}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
