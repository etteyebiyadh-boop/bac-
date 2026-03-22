const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ include: { studentProfile: true } });
  console.log("Users:", JSON.stringify(users, null, 2));

  const lessons = await prisma.lesson.findMany();
  console.log("Lessons count:", lessons.length);
  if(lessons.length > 0) console.log("First Lesson language:", lessons[0].language);

  const grammar = await prisma.grammarRule.findMany();
  console.log("Grammar count:", grammar.length);
  if(grammar.length > 0) console.log("First Grammar language:", grammar[0].language, grammar[0].bacSections);

  const vocab = await prisma.vocabularySet.findMany();
  console.log("Vocab count:", vocab.length);
  if(vocab.length > 0) console.log("First Vocab language:", vocab[0].language, vocab[0].bacSections);
}

main().finally(() => prisma.$disconnect());
