const { PrismaClient, BacSection } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * BAC TUNISIA - LANGUAGE SUBJECTS ONLY
 * 
 * Each section has its specific language subjects with coefficients.
 * Focus on: Arabic, French, English + Literature subjects for Lettres
 */

async function main() {
  console.log('📚 Seeding BAC Language Subjects by Section...\n');

  // Clear existing subjects
  await prisma.bacSubject.deleteMany();

  const languageSubjects = [
    // ==========================================
    // COMMON LANGUAGE SUBJECTS (All Sections)
    // ==========================================
    {
      name: 'Arabic',
      nameAr: 'العربية',
      nameFr: 'Arabe',
      coefficient: 2,
      bacSections: Object.values(BacSection),
      isCommon: true,
      isLanguage: true
    },
    {
      name: 'French',
      nameAr: 'الفرنسية',
      nameFr: 'Français',
      coefficient: 2,
      bacSections: Object.values(BacSection),
      isCommon: true,
      isLanguage: true
    },
    {
      name: 'English',
      nameAr: 'الإنجليزية',
      nameFr: 'Anglais',
      coefficient: 2,
      bacSections: Object.values(BacSection),
      isCommon: true,
      isLanguage: true
    },

    // ==========================================
    // LETTRES SECTION - Literature Subjects
    // ==========================================
    {
      name: 'Literature (Arabic)',
      nameAr: 'أدب عربي',
      nameFr: 'Littérature Arabe',
      coefficient: 3,
      bacSections: [BacSection.LETTRES],
      isCommon: false,
      isLanguage: true
    },
    {
      name: 'Literature (French)',
      nameAr: 'أدب فرنسي',
      nameFr: 'Littérature Française',
      coefficient: 3,
      bacSections: [BacSection.LETTRES],
      isCommon: false,
      isLanguage: true
    },
    {
      name: 'Literature (English)',
      nameAr: 'أدب إنجليزي',
      nameFr: 'Littérature Anglaise',
      coefficient: 3,
      bacSections: [BacSection.LETTRES],
      isCommon: false,
      isLanguage: true
    }
  ];

  for (const subject of languageSubjects) {
    await prisma.bacSubject.create({ data: subject });
  }

  console.log('✅ Created Language Subjects\n');

  // Print summary by section
  console.log('📊 LANGUAGE SUBJECTS BY SECTION');
  console.log('==============================================');
  
  const sections = [
    { name: 'Mathématiques', enum: BacSection.MATHEMATIQUES },
    { name: 'Sciences Expérimentales', enum: BacSection.SCIENCES_EXPERIMENTALES },
    { name: 'Sciences Informatique', enum: BacSection.SCIENCES_INFORMATIQUE },
    { name: 'Sciences Techniques', enum: BacSection.SCIENCES_TECHNIQUES },
    { name: 'Lettres', enum: BacSection.LETTRES },
    { name: 'Économie et Gestion', enum: BacSection.ECONOMIE_GESTION }
  ];

  for (const section of sections) {
    const subjects = await prisma.bacSubject.findMany({
      where: {
        bacSections: { hasSome: [section.enum] }
      }
    });
    
    const common = subjects.filter(s => s.isCommon);
    const specific = subjects.filter(s => !s.isCommon);
    const totalCoeff = subjects.reduce((sum, s) => sum + s.coefficient, 0);
    
    console.log(`\n📚 ${section.name}`);
    console.log(`   Common: ${common.map(s => `${s.name} (Coef: ${s.coefficient})`).join(', ')}`);
    if (specific.length > 0) {
      console.log(`   Specific: ${specific.map(s => `${s.name} (Coef: ${s.coefficient})`).join(', ')}`);
    }
    console.log(`   Total Language Coefficient: ${totalCoeff}`);
  }

  console.log('\n==============================================');
  console.log('Platform Goal: Language learning across all BAC sections');
  console.log('- All sections: Arabic, French, English (Coef 2 each)');
  console.log('- Lettres: + Arabic Lit, French Lit, English Lit (Coef 3 each)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
