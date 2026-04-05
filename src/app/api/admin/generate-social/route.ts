import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, hasAdminAccess } from "@/lib/auth";
import { getAIClient, getReliableCompletion } from "@/lib/ai-provider";

// Per-language BAC curriculum context so the AI knows what to teach
const LANGUAGE_CONTEXT: Record<string, string> = {
  ENGLISH: `
ENGLISH BAC (Tunisia):
- Grammar priorities: Passive Voice, Conditionals (1/2/3), Inversion, Modal Verbs, Reported Speech, Wish/If Only, Causative, Relative Clauses, Gerund vs Infinitive, Compound Adjectives
- Writing types: Argumentative essay, Article, Formal letter, Informal email
- Themes: Brain Drain, Technology, Environment, Human Rights, Education, Health, Youth
- Register: Formal academic writing expected. Complex structures rewarded.
- ALL generated content (vocabulary words, synonyms, antonyms, examples, sentences, grammar patterns, quiz questions, fill-in-the-blank, captions) MUST be written IN ENGLISH.`,

  FRENCH: `
FRENCH BAC (Tunisia):
- Grammar priorities: Le Subjonctif, Le Conditionnel, La Voix Passive, Le Discours Indirect, Les Connecteurs Logiques, La Concordance des Temps, Le Gérondif, La Nominalisation, Les Pronoms Relatifs (dont/lequel), L'Imparfait vs Passé Composé
- Writing types: La Dissertation, Le Commentaire de texte, L'article de presse, La lettre formelle, Le rapport
- Themes: La mondialisation, L'environnement, Les droits de l'homme, La technologie, La jeunesse, L'immigration, La culture
- Register: Registre soutenu attendu. Richesse du vocabulaire valorisée.
- ALL generated content (vocabulary words, synonyms, antonyms, examples, sentences, grammar patterns, quiz questions, fill-in-the-blank, captions) MUST be written IN FRENCH.`,

  ARABIC: `
ARABIC BAC (Tunisia):
- Grammar priorities (النحو): الجملة الاسمية والفعلية، الإعراب، الفعل المبني للمجهول، أسلوب الشرط، الأساليب الإنشائية (الأمر والنهي والاستفهام)، التوكيد، البدل، المفعول المطلق، الحال، التمييز
- Literary skills (الأدب): التحليل الأدبي، الأساليب البيانية (الاستعارة، التشبيه، الكناية)، الصور الشعرية، تحليل النصوص
- Writing types: المقالة الحجاجية، التحليل الأدبي، التلخيص، الإنشاء الحر
- Themes: القضايا الاجتماعية، التراث، التحديث والأصالة، الهوية الوطنية
- Register: الفصحى الراقية مطلوبة. إتقان البلاغة ميزة.
- ALL generated content MUST be written IN ARABIC (Modern Standard Arabic / الفصحى). Use Arabic script.`,

  ITALIAN: `
ITALIAN BAC OPTION (Tunisia):
- Grammar priorities: Il Congiuntivo (presente/passato/imperfetto), Il Condizionale, La Voce Passiva, Il Discorso Indiretto, I Pronomi Relativi, Il Gerundio, I Tempi del Passato (passato prossimo vs imperfetto vs trapassato)
- Writing types: Il Tema argomentativo, L'articolo di giornale, La lettera formale, L'email informale
- Themes: L'ambiente, La tecnologia, La globalizzazione, I diritti umani, I giovani, La cultura italiana
- Register: Registro formale e ricco lessico.
- ALL generated content MUST be written IN ITALIAN.`,

  SPANISH: `
SPANISH BAC OPTION (Tunisia):
- Grammar priorities: El Subjuntivo (presente/pasado/imperfecto), El Condicional, La Voz Pasiva, El Estilo Indirecto, Los Relativos (cuyo/el cual), El Gerundio, Ser vs Estar, Los Tiempos del Pasado
- Writing types: El ensayo argumentativo, El artículo periodístico, La carta formal, El correo informal
- Themes: El medioambiente, La tecnología, La globalización, Los derechos humanos, La juventud, La cultura hispana
- Register: Registro formal. Riqueza léxica valorada.
- ALL generated content MUST be written IN SPANISH.`,

  GERMAN: `
GERMAN BAC OPTION (Tunisia):
- Grammar priorities: Der Konjunktiv II, Die Passivkonstruktionen (Vorgangs- und Zustandspassiv), Die indirekten Rede (Konjunktiv I), Relativsätze, Infinitivkonstruktionen (um...zu / ohne...zu), Kausale und konzessive Konnektoren, Die Wortstellung in Nebensätzen, Partizipialattribute
- Writing types: Der Aufsatz (argumentativ), Der Zeitungsartikel, Der formelle Brief, Die E-Mail
- Themes: Umwelt, Technologie, Globalisierung, Menschenrechte, Jugend, Deutsche Kultur
- Register: Gehobenes Register. Grammatikalische Korrektheit entscheidend.
- ALL generated content MUST be written IN GERMAN.`,

  RUSSIAN: `
RUSSIAN BAC OPTION (Tunisia):
- Grammar priorities: Виды глагола (совершенный/несовершенный), Падежи (все 6 падежей), Причастия и деепричастия, Сложноподчинённые предложения, Степени сравнения, Возвратные глаголы, Числительные
- Writing types: Аргументативное эссе, Статья, Официальное письмо, Электронное письмо
- Themes: Экология, Технологии, Глобализация, Права человека, Молодёжь, Русская культура
- Register: Правильный литературный язык. Богатый словарный запас.
- ALL generated content MUST be written IN RUSSIAN. Use Cyrillic script.`,

  CHINESE: `
CHINESE BAC OPTION (Tunisia):
- Grammar priorities: 把字句和被字句 (ba/bei constructions), 补语 (complements: 结果/趋向/程度), 连词使用 (connectors: 虽然...但是, 因为...所以, 只要...就), 量词 (measure words), 离合词, 兼语句, 紧缩句
- Writing types: 议论文, 说明文, 书信, 日记
- Themes: 环境保护, 科技发展, 全球化, 人权, 青年, 中国文化
- Register: 规范书面语. 词汇丰富, 语法准确.
- ALL generated content MUST be written IN CHINESE (Simplified characters). Use Mandarin.`,
};

function getErrorStatus(error: any): number | undefined {
  return (
    error?.status ??
    error?.response?.status ??
    error?.error?.status ??
    error?.code
  );
}

export async function POST(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  if (!hasAdminAccess(req, auth.email)) {
    return NextResponse.json({ error: `Forbidden: Access denied for ${auth.email}. Use the Admin Passcode if needed.` }, { status: 403 });
  }

  try {
    const { topic, language, platform, section, campaignMode } = await req.json();
    
    const langContext = LANGUAGE_CONTEXT[language] || LANGUAGE_CONTEXT["ENGLISH"];
    const context = campaignMode ? "FULL 7-DAY VIRAL CAMPAIGN (Monday-Sunday)" : `SINGLE CONTENT PACK for ${platform}`;
    const sectionContext = section ? `Target BAC Section: ${section}.` : "Target: All BAC sections.";
    
    const prompt = `You are "BacSocial AI" — Elite Tunisian BAC social media content specialist.

LANGUAGE & CURRICULUM CONTEXT:
${langContext}

VIRAL CONTENT RULES:
1. Lead with a "pattern interrupt" (shocking stat, relatable pain, or curiosity gap)
2. Max 2 lines per beat — use line breaks strategically
3. Emojis as visual anchors (not decoration)
4. Always specific + actionable advice (never generic "study hard")
5. End with engagement CTA that sparks comments
6. Captions should feel native to Tunisian student culture

CRITICAL LANGUAGE RULE:
⚠️ ALL content in synonyms, antonyms, vocabulary, phrases, collocations, idioms, connectors, wordFamily, paraphrases, commonMistakes, grammarPatterns, writingTips, quiz question, fill-blank sentence, checklist items, motivation quote, essay transformation, didYouKnow, and ALL captions MUST be written IN ${language}. Zero exceptions.

Create a ${context} for the ${language} BAC topic: "${topic}". ${sectionContext}

Return ONLY a valid JSON object with these EXACT keys:

{
  "campaignPlan": [
    { "day": "Mon", "type": "Educational Hook", "visual": "describe the card visual in ${language}", "caption": "full caption in ${language}" },
    { "day": "Tue", "type": "The 'Bac Excellence' Advantage", "visual": "...", "caption": "..." },
    { "day": "Wed", "type": "Peak Performance Quiz", "visual": "...", "caption": "..." },
    { "day": "Thu", "type": "Common Mistakes / Recovery", "visual": "...", "caption": "..." },
    { "day": "Fri", "type": "Live Study Deep-Dive", "visual": "...", "caption": "..." },
    { "day": "Sat", "type": "Social Proof / Student Success", "visual": "...", "caption": "..." },
    { "day": "Sun", "type": "The 20/20 Challenge Launch", "visual": "...", "caption": "..." }
  ],
  "tiktokScript": {
    "hook": "0-3s hook written IN ${language}",
    "body": [
       { "time": "3-15s", "visual": "[card overlay description]", "audio": "what to say IN ${language}" },
       { "time": "15-45s", "visual": "[screen share: Bac Excellence]", "audio": "IN ${language}" }
    ],
    "cta": "engagement CTA IN ${language}"
  },
  "viralTitle": "<MAX 6 words IN ${language}, high-impact>",
  "visualBody": "<EXACTLY 2 LINES IN ${language} — curiosity gap>",

  "synonyms": [{ "word": "${language} word", "synonym": "${language} synonym", "usage": "short tip IN ${language}" }],
  "antonyms": [{ "word": "${language} word", "antonym": "${language} antonym", "contrast": "contrast note IN ${language}" }],
  "vocabulary": [{ "word": "${language} word", "definition": "definition IN ${language}", "example": "example sentence IN ${language}", "register": "formal/neutral/informal" }],
  "phrases": ["high-scoring BAC phrase IN ${language}", "phrase 2", "phrase 3", "phrase 4", "phrase 5"],
  "collocations": [{ "collocation": "collocation IN ${language}", "example": "sentence IN ${language}" }],
  "idioms": [{ "idiom": "idiom IN ${language}", "meaning": "meaning IN ${language}", "example": "example IN ${language}" }],
  "connectors": [{ "connector": "connector word IN ${language}", "use": "adding/contrasting/cause-effect/example/conclusion", "example": "sentence IN ${language}" }],
  "wordFamily": [{ "root": "root IN ${language}", "noun": "...", "verb": "...", "adjective": "...", "adverb": "..." }],
  "paraphrases": [{ "original": "sentence IN ${language}", "paraphrase": "rephrased IN ${language}" }],
  "commonMistakes": [{ "mistake": "wrong usage IN ${language}", "correction": "correct IN ${language}", "rule": "rule explained IN ${language}" }],
  "grammarPatterns": [{ "pattern": "${language} grammar structure", "example": "sentence IN ${language}", "tip": "tip IN ${language}" }],
  "writingTips": ["actionable tip IN ${language}", "tip 2", "tip 3", "tip 4", "tip 5"],
  
  "growthCards": {
    "gradeFlip": { "before": "8/20", "after": "18/20", "benefit": "reason IN ${language}" },
    "quiz": { "question": "BAC-level question IN ${language}", "optionA": "option IN ${language}", "optionB": "option IN ${language}", "correct": "A" },
    "checklist": ["item IN ${language}", "item 2", "item 3", "item 4", "item 5"],
    "motivation": { "quote": "powerful quote about learning (can be a famous quote translated to ${language} or originally in ${language})", "author": "..." },
    "essayTransformation": { "before": "weak version IN ${language}", "after": "elite version IN ${language}", "result": "improvement note IN ${language}" },
    "didYouKnow": "surprising linguistic fact about ${topic} IN ${language}",
    "thisOrThat": { "option1": "choice IN ${language}", "option2": "choice IN ${language}" },
    "fillBlank": { "sentence": "sentence with _____ IN ${language}", "options": ["word1 IN ${language}", "word2", "word3", "word4"], "answer": "correct word" },
    "mythFact": { "myth": "misconception IN ${language}", "fact": "reality IN ${language}" }
  },

  "captions": {
    "instagram": "<Instagram caption written IN ${language}, carousel-ready, with hashtags>",
    "tiktok": "<TikTok caption written IN ${language}, fast hook, trending>",
    "facebook": "<Facebook caption written IN ${language}, longer form, parent-friendly>"
  }
}

QUANTITY: synonyms/antonyms/vocabulary/phrases/collocations/idioms/connectors/wordFamily: 5 items each. commonMistakes/grammarPatterns/writingTips: 5 each. Full 7-day campaign included.
REMINDER: Every single word of generated content must be in ${language}. This is non-negotiable.
`;

    const response = await getReliableCompletion({
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 4000,
        temperature: 0.75,
    });

    const content = response.choices[0]?.message?.content || "{}";
    let body: any = {};
    try {
      body = JSON.parse(content);
    } catch (e) {
      console.error("AI JSON Parse Error:", e);
      throw new Error("AI returned invalid JSON format.");
    }

    const sanitized = {
      campaignPlan:   Array.isArray(body.campaignPlan)    ? body.campaignPlan    : [],
      tiktokScript:   typeof body.tiktokScript === "object" ? body.tiktokScript  : null,
      visualTitle:    body.viralTitle || body.visualTitle  || "Hook Title",
      visualBody:     typeof body.visualBody === "string"  ? body.visualBody     : (Array.isArray(body.visualBody) ? body.visualBody.join("\n") : ""),
      captions:       typeof body.captions === "object"    ? body.captions       : {},
      synonyms:       Array.isArray(body.synonyms)         ? body.synonyms       : [],
      antonyms:       Array.isArray(body.antonyms)         ? body.antonyms       : [],
      vocabulary:     Array.isArray(body.vocabulary)       ? body.vocabulary     : [],
      phrases:        Array.isArray(body.phrases)          ? body.phrases        : [],
      collocations:   Array.isArray(body.collocations)     ? body.collocations   : [],
      idioms:         Array.isArray(body.idioms)           ? body.idioms         : [],
      connectors:     Array.isArray(body.connectors)       ? body.connectors     : [],
      wordFamily:     Array.isArray(body.wordFamily)       ? body.wordFamily     : [],
      paraphrases:    Array.isArray(body.paraphrases)      ? body.paraphrases    : [],
      commonMistakes: Array.isArray(body.commonMistakes)   ? body.commonMistakes : [],
      grammarPatterns:Array.isArray(body.grammarPatterns)  ? body.grammarPatterns: [],
      writingTips:    Array.isArray(body.writingTips)      ? body.writingTips    : [],
      growthCards:    typeof body.growthCards === "object"  ? body.growthCards   : {},
    };

    return NextResponse.json({ ok: true, ...sanitized });
  } catch (error: any) {
    console.error(error);
    const status = getErrorStatus(error);
    if (status === 429) {
      return NextResponse.json(
        { error: "AI quota reached (429). Please wait and retry." },
        { status: 429 }
      );
    }
    return NextResponse.json({ error: error.message || "Failed to generate content" }, { status: 500 });
  }
}
