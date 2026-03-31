import { NextRequest, NextResponse } from "next/server";
import { Language } from "@prisma/client";

export const dynamic = "force-dynamic";

// Word of the Day database - rotates based on day of year
const wordDatabase: Record<Language, Array<{
  word: string;
  meaning: string;
  example: string;
  bacContext?: string;
}>> = {
  ENGLISH: [
    { word: "Paradigm", meaning: "A typical example or pattern of something; a model.", example: "The shift to AI is a new paradigm in education.", bacContext: "Technology & Innovation" },
    { word: "Ubiquitous", meaning: "Present, appearing, or found everywhere.", example: "Smartphones have become ubiquitous in modern society.", bacContext: "Technology & Society" },
    { word: "Eloquent", meaning: "Fluent or persuasive in speaking or writing.", example: "Her eloquent speech moved the entire audience.", bacContext: "Communication & Arts" },
    { word: "Resilience", meaning: "The capacity to recover quickly from difficulties.", example: "Climate resilience is crucial for coastal communities.", bacContext: "Environment" },
    { word: "Sustainable", meaning: "Able to be maintained at a certain rate or level.", example: "We must adopt sustainable practices to protect our planet.", bacContext: "Environment" },
    { word: "Advocate", meaning: "A person who publicly supports or recommends a particular cause.", example: "She is an advocate for women's education rights.", bacContext: "Women's Rights" },
    { word: "Innovation", meaning: "The action or process of innovating; a new method or idea.", example: "Technological innovation drives economic growth.", bacContext: "Technology" },
    { word: "Globalization", meaning: "The process by which businesses develop international influence.", example: "Globalization has transformed the job market.", bacContext: "Economy" },
    { word: "Diversity", meaning: "The state of being diverse; variety.", example: "Cultural diversity enriches our society.", bacContext: "Society & Culture" },
    { word: "Empower", meaning: "To give someone the authority or power to do something.", example: "Education empowers young people to achieve their dreams.", bacContext: "Education" },
    { word: "Perspective", meaning: "A particular attitude toward or way of regarding something.", example: "Travel broadens your perspective on life.", bacContext: "Travel & Culture" },
    { word: "Collaborate", meaning: "To work jointly on an activity or project.", example: "Students collaborate on projects to develop teamwork skills.", bacContext: "Education" },
    { word: "Consequence", meaning: "A result or effect of an action or condition.", example: "Every choice has a consequence.", bacContext: "General" },
    { word: "Initiative", meaning: "The ability to assess and act independently.", example: "Taking initiative is valued by employers.", bacContext: "Work" },
    { word: "Transition", meaning: "The process or a period of changing from one state to another.", example: "The transition to renewable energy is accelerating.", bacContext: "Environment" }
  ],
  FRENCH: [
    { word: "Éphémère", meaning: "Qui ne dure qu'un très court moment.", example: "La gloire est souvent éphémère.", bacContext: "Arts & Littérature" },
    { word: "Incontournable", meaning: "Qu'on ne peut éviter, indispensable.", example: "L'anglais est devenu incontournable dans le monde du travail.", bacContext: "Travail" },
    { word: "Résilience", meaning: "Capacité d'un système à retrouver son équilibre.", example: "La résilience des jeunes face aux défis est admirable.", bacContext: "Jeunesse" },
    { word: "Citoyenneté", meaning: "Statut de citoyen; ensemble des droits et devoirs.", example: "La citoyenneté numérique pose de nouvelles questions.", bacContext: "Société" },
    { word: "Pluralisme", meaning: "État d'une société où coexistent des groupes divers.", example: "Le pluralisme culturel enrichit notre démocratie.", bacContext: "Culture" },
    { word: "Ambivalent", meaning: "Qui contient en soi des sentiments ou des aspects contradictoires.", example: "Nous avons une attitude ambivalente face aux réseaux sociaux.", bacContext: "Technologie" },
    { word: "Bienveillance", meaning: "Disposition à vouloir le bien d'autrui.", example: "La bienveillance des enseignants favorise l'apprentissage.", bacContext: "Éducation" },
    { word: "Proactivité", meaning: "Attitude qui consiste à anticiper les événements.", example: "La proactivité est une qualité recherchée par les recruteurs.", bacContext: "Travail" },
    { word: "Durable", meaning: "Qui dure dans le temps sans s'épuiser.", example: "Le développement durable est un enjeu majeur.", bacContext: "Environnement" },
    { word: "Égalitaire", meaning: "Qui tend à l'égalité des conditions.", example: "Une société plus égalitaire offre plus d'opportunités.", bacContext: "Société" },
    { word: "Hermétique", meaning: "Qui est difficile à comprendre, inaccessible.", example: "Ce texte philosophique m'est hermétique.", bacContext: "Littérature" },
    { word: "Patrimoine", meaning: "Ce qui est transmis de génération en génération.", example: "Nous devons préserver notre patrimoine culturel.", bacContext: "Culture" },
    { word: "Solidaire", meaning: "Qui manifeste de la solidarité envers autrui.", example: "Les communautés solidaires s'entraident en temps de crise.", bacContext: "Société" },
    { word: "Vertueux", meaning: "Qui a de la vertu, qui est moral.", example: "Un cercle vertueux de croissance économique.", bacContext: "Économie" },
    { word: "Tribulation", meaning: "Difficultés, événements fâcheux d'une vie.", example: "Les tribulations du héros mènent à sa transformation.", bacContext: "Littérature" }
  ],
  ARABIC: [
    { word: "جوهري", meaning: "أساسي أو حقيقي.", example: "التعليم عنصر جوهري في بناء المستقبل.", bacContext: "التعليم" },
    { word: "متجدد", meaning: "دائم التجدد والاستمرار.", example: "الطاقة المتجددة هي مستقبل العالم.", bacContext: "البيئة" },
    { word: "مرن", meaning: "قادر على التكيف مع الظروف.", example: "الشباب المرن يتغلب على التحديات.", bacContext: "المجتمع" },
    { word: "شمولي", meaning: "شامل وكامل.", example: "نحتاج رؤية شمولية للتنمية.", bacContext: "التنمية المستدامة" },
    { word: "تفاعلي", meaning: "قائم على التفاعل.", example: "التعلم التفاعلي أكثر فعالية.", bacContext: "التعليم" },
    { word: "مبادر", meaning: "من يقوم بأعمال دون انتظار الأوامر.", example: "الموظف المبادر ينجح في عمله.", bacContext: "العمل" },
    { word: "متنوع", meaning: "ذو أنواع وأشكال مختلفة.", example: "التنوع الثقافي يغني المجتمع.", bacContext: "الثقافة" },
    { word: "مستدام", meaning: "قادر على الاستمرار.", example: "النمو المستدام يحافظ على البيئة.", bacContext: "البيئة" },
    { word: "فاعل", meaning: "مؤثر وقوي.", example: "التواصل الفاعل ينجح في حل المشاكل.", bacContext: "التواصل" },
    { word: "إيجابي", meaning: "محسن وبناء.", example: "التفكير الإيجابي يساعد على النجاح.", bacContext: "النفسية" },
    { word: "متميز", meaning: "مختلف ومميز.", example: "الطالب المتميز يحصل على تقديرات عالية.", bacContext: "التعليم" },
    { word: "متكامل", meaning: "كامل ومحكم.", example: "نظام متكامل للتعليم.", bacContext: "التعليم" },
    { word: "واعٍ", meaning: "مدرك ومدرك.", example: "المواطن الواعي يشارك في الحياة العامة.", bacContext: "المجتمع" },
    { word: "مبدع", meaning: "قادر على الإبداع.", example: "العقول المبدعة تقود التقدم.", bacContext: "الابتكار" },
    { word: "عالمي", meaning: "شامل للعالم.", example: "التحديات العالمية تتطلب تعاونا دوليا.", bacContext: "العالمية" }
  ],
  SPANISH: [
    { word: "Paradigma", meaning: "Ejemplo o patrón típico de algo.", example: "El cambio a la IA es un nuevo paradigma en educación.", bacContext: "Tecnología" },
    { word: "Resiliencia", meaning: "Capacidad de recuperarse de dificultades.", example: "La resiliencia es clave para el éxito estudiantil.", bacContext: "Educación" },
    { word: "Sostenible", meaning: "Que se puede mantener a largo plazo.", example: "Necesitamos energía sostenible para el futuro.", bacContext: "Medio Ambiente" },
    { word: "Innovador", meaning: "Que introduce novedades.", example: "El pensamiento innovador resuelve problemas complejos.", bacContext: "Tecnología" },
    { word: "Globalización", meaning: "Proceso de expansión mundial.", example: "La globalización afecta a todas las culturas.", bacContext: "Economía" },
    { word: "Diverso", meaning: "Que tiene variedad.", example: "La diversidad cultural enriquece nuestras vidas.", bacContext: "Cultura" },
    { word: "Empoderar", meaning: "Dar poder o autoridad.", example: "La educación empodera a las personas.", bacContext: "Educación" },
    { word: "Perspectiva", meaning: "Manera particular de ver algo.", example: "Viajar amplía tu perspectiva del mundo.", bacContext: "Viajes" },
    { word: "Colaborar", meaning: "Trabajar juntos.", example: "Los estudiantes colaboran en proyectos.", bacContext: "Educación" },
    { word: "Consecuencia", meaning: "Resultado de una acción.", example: "Cada elección tiene una consecuencia.", bacContext: "General" },
    { word: "Iniciativa", meaning: "Capacidad de actuar independientemente.", example: "La iniciativa es valorada por los empleadores.", bacContext: "Trabajo" },
    { word: "Transición", meaning: "Cambio de un estado a otro.", example: "La transición a energías limpias es necesaria.", bacContext: "Medio Ambiente" },
    { word: "Igualdad", meaning: "Estado de ser igual.", example: "La igualdad de género es un derecho humano.", bacContext: "Sociedad" },
    { word: "Creatividad", meaning: "Capacidad de crear.", example: "La creatividad es esencial para resolver problemas.", bacContext: "Innovación" },
    { word: "Consciencia", meaning: "Conocimiento de algo.", example: "La consciencia ambiental está creciendo.", bacContext: "Medio Ambiente" }
  ],
  GERMAN: [
    { word: "Paradigma", meaning: "Typisches Beispiel oder Muster.", example: "Der Wechsel zu KI ist ein neues Paradigma in der Bildung.", bacContext: "Technologie" },
    { word: "Resilienz", meaning: "Fähigkeit, sich von Schwierigkeiten zu erholen.", example: "Resilienz ist der Schlüssel zum Erfolg.", bacContext: "Bildung" },
    { word: "Nachhaltig", meaning: "Langfristig aufrechterhaltbar.", example: "Wir brauchen nachhaltige Energie für die Zukunft.", bacContext: "Umwelt" },
    { word: "Innovativ", meaning: "Neuartig und kreativ.", example: "Innovatives Denken löst komplexe Probleme.", bacContext: "Technologie" },
    { word: "Globalisierung", meaning: "Prozess der weltweiten Verflechtung.", example: "Globalisierung beeinflusst alle Kulturen.", bacContext: "Wirtschaft" },
    { word: "Vielfältig", meaning: "Abwechslungsreich und verschieden.", example: "Kulturelle Vielfalt bereichert unser Leben.", bacContext: "Kultur" },
    { word: "Stärken", meaning: "Unterstützen und ermutigen.", example: "Bildung stärkt die Menschen.", bacContext: "Bildung" },
    { word: "Perspektive", meaning: "Besondere Art, etwas zu sehen.", example: "Reisen erweitert deine Perspektive.", bacContext: "Reisen" },
    { word: "Zusammenarbeiten", meaning: "Gemeinsam arbeiten.", example: "Schüler arbeiten in Projekten zusammen.", bacContext: "Bildung" },
    { word: "Konsequenz", meaning: "Ergebnis einer Handlung.", example: "Jede Wahl hat eine Konsequenz.", bacContext: "Allgemein" },
    { word: "Initiative", meaning: "Fähigkeit, selbstständig zu handeln.", example: "Initiative wird von Arbeitgebern geschätzt.", bacContext: "Arbeit" },
    { word: "Übergang", meaning: "Wechsel von einem Zustand zum anderen.", example: "Der Übergang zu sauberer Energie ist nötig.", bacContext: "Umwelt" },
    { word: "Gleichheit", meaning: "Zustand des Gleichseins.", example: "Gleichheit der Geschlechter ist ein Menschenrecht.", bacContext: "Gesellschaft" },
    { word: "Kreativität", meaning: "Fähigkeit zu schaffen.", example: "Kreativität ist wesentlich für Problemlösung.", bacContext: "Innovation" },
    { word: "Bewusstsein", meaning: "Wissen um etwas.", example: "Das Umweltbewusstsein wächst.", bacContext: "Umwelt" }
  ],
  ITALIAN: [
    { word: "Paradigma", meaning: "Esempio o modello tipico di qualcosa.", example: "Il passaggio all'IA è un nuovo paradigma in educazione.", bacContext: "Tecnologia" },
    { word: "Resilienza", meaning: "Capacità di recupero dalle difficoltà.", example: "La resilienza è la chiave per il successo.", bacContext: "Educazione" },
    { word: "Sostenibile", meaning: "Mantenibile a lungo termine.", example: "Abbiamo bisogno di energia sostenibile per il futuro.", bacContext: "Ambiente" },
    { word: "Innovativo", meaning: "Che introduce novità.", example: "Il pensiero innovativo risolve problemi complessi.", bacContext: "Tecnologia" },
    { word: "Globalizzazione", meaning: "Processo di espansione mondiale.", example: "La globalizzazione influenza tutte le culture.", bacContext: "Economia" },
    { word: "Diverso", meaning: "Che ha varietà.", example: "La diversità culturale arricchisce le nostre vite.", bacContext: "Cultura" },
    { word: "Empowerment", meaning: "Dare potere o autorità.", example: "L'istruzione dà potere alle persone.", bacContext: "Educazione" },
    { word: "Prospettiva", meaning: "Modo particolare di vedere qualcosa.", example: "Viaggiare amplia la tua prospettiva.", bacContext: "Viaggi" },
    { word: "Collaborare", meaning: "Lavorare insieme.", example: "Gli studenti collaborano nei progetti.", bacContext: "Educazione" },
    { word: "Conseguenza", meaning: "Risultato di un'azione.", example: "Ogni scelta ha una conseguenza.", bacContext: "Generale" },
    { word: "Iniziativa", meaning: "Capacità di agire indipendentemente.", example: "L'iniziativa è apprezzata dai datori di lavoro.", bacContext: "Lavoro" },
    { word: "Transizione", meaning: "Passaggio da uno stato all'altro.", example: "La transizione alle energie pulite è necessaria.", bacContext: "Ambiente" },
    { word: "Uguaglianza", meaning: "Stato di essere uguali.", example: "L'uguaglianza di genere è un diritto umano.", bacContext: "Società" },
    { word: "Creatività", meaning: "Capacità di creare.", example: "La creatività è essenziale per risolvere problemi.", bacContext: "Innovazione" },
    { word: "Consapevolezza", meaning: "Conoscenza di qualcosa.", example: "La consapevolezza ambientale sta crescendo.", bacContext: "Ambiente" }
  ]
};

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function getWordForLanguage(language: Language) {
  const words = wordDatabase[language] || wordDatabase.ENGLISH;
  const dayOfYear = getDayOfYear();
  const index = dayOfYear % words.length;
  return words[index];
}

// GET /api/word-of-the-day?language=ENGLISH
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const languageParam = (searchParams.get("language") as Language) || Language.ENGLISH;
    
    // Validate language
    const language = Object.values(Language).includes(languageParam) 
      ? languageParam 
      : Language.ENGLISH;

    const word = getWordForLanguage(language);
    
    return NextResponse.json({
      success: true,
      word,
      language,
      date: new Date().toISOString().split('T')[0]
    });
  } catch (error) {
    console.error("[WORD_OF_THE_DAY] Error:", error);
    return NextResponse.json({ 
      success: false,
      error: "Failed to fetch word of the day" 
    }, { status: 500 });
  }
}
