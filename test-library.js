const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ include: { studentProfile: true } });
  const profile = users[0].studentProfile;
  console.log("Profile:", profile);

  let secondaryLanguages = [];
  try {
    if (profile.secondaryLanguagesJson) {
      const parsed = typeof profile.secondaryLanguagesJson === "string" 
        ? JSON.parse(profile.secondaryLanguagesJson) 
        : profile.secondaryLanguagesJson;
      if (Array.isArray(parsed)) secondaryLanguages = parsed;
    }
  } catch(e) {}

  const activeLanguages = [profile.primaryLanguage, ...secondaryLanguages];
  console.log("Active Languages:", activeLanguages);

  const filterBySection = (items) => {
    if (!profile.bacSection) return items;
    return items.filter(item => 
      !item.bacSections || item.bacSections.length === 0 || item.bacSections.includes(profile.bacSection)
    );
  };

  const grammarRules = await prisma.grammarRule.findMany({ where: { language: { in: activeLanguages } }});
  const vocabSets = await prisma.vocabularySet.findMany({ where: { language: { in: activeLanguages } }});
  const lessons = await prisma.lesson.findMany({ where: { language: { in: activeLanguages } }});

  console.log("Raw Grammar:", grammarRules.length);
  console.log("Raw Vocab:", vocabSets.length);
  console.log("Raw Lessons:", lessons.length);

  const filteredGrammar = filterBySection(grammarRules);
  const filteredVocab = filterBySection(vocabSets);

  console.log("Filtered Grammar:", filteredGrammar.length);
  console.log("Filtered Vocab:", filteredVocab.length);

  for (const lang of activeLanguages) {
    console.log(`\nLang: ${lang}`);
    console.log(`Lessons:`, lessons.filter(x => x.language === lang).length);
    console.log(`Grammar:`, filteredGrammar.filter(x => x.language === lang).length);
    console.log(`Vocab:`, filteredVocab.filter(x => x.language === lang).length);
  }
}

main().finally(() => prisma.$disconnect());
