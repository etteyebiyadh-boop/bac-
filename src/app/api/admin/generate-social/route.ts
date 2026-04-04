import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, hasAdminAccess } from "@/lib/auth";
import { getAIClient, getReliableCompletion } from "@/lib/ai-provider";

// BAC Social Media AI Specialist - System Configuration
const BAC_AI_PERSONA = `You are "BacSocial AI" — a specialized artificial intelligence trained exclusively for Tunisian Baccalaureate social media marketing.

YOUR EXPERTISE:
- Deep knowledge of BAC exam structure (Math, Sciences, Eco, Lettres, Info)
- Understanding of Tunisian student culture, stress points, study habits
- Mastery of viral educational content patterns on Instagram/TikTok/Facebook
- Proven formula: Hook (0-3s) → Value (10-15s) → CTA (3s)

VIRAL CONTENT RULES:
1. Lead with a "pattern interrupt" (shocking stat, relatable pain point, or curiosity gap)
2. Use line breaks strategically — max 2 lines per "beat"
3. Emojis as visual anchors (not decoration)
4. Always include specific, actionable advice (not generic "study hard")
5. End with engagement CTA that sparks comments

TONE: Energetic, empathetic, slightly irreverent but always helpful. Like a cool older sibling who's already aced the BAC.

HASHTAG STRATEGY: Mix 2 popular (#BAC2024, #StudyTips) + 2 niche (#BacTunisie, #EnglishBAC) + 1 branded (#BacExcellence)`;

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
    const { topic, language, platform, section } = await req.json();
    
    const sectionContext = section ? `Target Section: ${section}.` : "Target: All BAC sections.";
    const variationSeed = Math.floor(Math.random() * 1000000);
    
    const prompt = `${BAC_AI_PERSONA}

    VARIETY DIRECTIVE (Seed: ${variationSeed}): 
    - DO NOT use generic, overused textbook examples. 
    - Create fresh, modern, and highly relatable scenarios for Tunisian students. 
    - Use diverse sentence structures and high-impact vocabulary.
    - If this topic is generated twice, ensure the content is 100% different.

Create a COMPLETE viral content pack for: ${language} - "${topic}". ${sectionContext}

PLATFORM: ${platform}

Return ONLY a valid JSON object with these EXACT keys:

{
  "script": "<hook (1 line)\\n\\nvalue (2-3 lines)\\n\\nCTA (1 line) + emojis + hashtags>",
  "visualTitle": "<viral hook, MAX 6 words, pattern interrupt style>",
  "visualBody": "<EXACTLY 2 SHORT LINES in ${language}, 80 chars max — curiosity gap or value bomb>",

  "synonyms": [{ "word": "...", "synonym": "...", "usage": "short usage tip" }],
  "antonyms": [{ "word": "...", "antonym": "...", "contrast": "one-line contrast note" }],
  "vocabulary": [{ "word": "...", "definition": "...", "example": "...", "register": "formal/neutral/informal" }],
  "phrases": ["high-scoring exam phrase 1", "phrase 2", "..."],

  "collocations": [{ "collocation": "verb + noun pair", "example": "used in a sentence" }],
  "idioms": [{ "idiom": "...", "meaning": "...", "example": "..." }],
  "connectors": [{ "connector": "Furthermore / However / etc.", "use": "adding/contrasting/cause-effect/example/conclusion", "example": "..." }],
  "wordFamily": [{ "root": "...", "noun": "...", "verb": "...", "adjective": "...", "adverb": "..." }],
  "paraphrases": [{ "original": "a sentence to rephrase", "paraphrase": "rephrased version using different structure" }],
  "commonMistakes": [{ "mistake": "wrong usage", "correction": "correct usage", "rule": "why it's wrong" }],
  "grammarPatterns": [{ "pattern": "Subject + V + Object structure", "example": "...", "tip": "when to use it" }],
  "writingTips": ["concise actionable tip 1 for ${language} writing at the BAC level", "tip 2", "..."],

  "growthCards": {
    "gradeFlip": { "before": "8/20", "after": "18/20", "benefit": "re-written in perfect ${language}" },
    "quiz": { "question": "sophisticated ${language} question", "optionA": "...", "optionB": "...", "correct": "A" },
    "checklist": ["5 items specific to mastering ${topic}"],
    "motivation": { "quote": "powerful quote in ${language} or about learning", "author": "..." },
    "essayTransformation": { "before": "basic/simple version", "after": "elite/advanced version", "result": "why it is better" },
    "didYouKnow": "surprising fact about ${topic} or ${language} usage",
    "thisOrThat": { "option1": "choice A", "option2": "choice B" },
    "fillBlank": { "sentence": "sentence with _____ blank", "options": ["word 1", "word 2", "word 3", "word 4"], "answer": "the correct one" },
    "mythFact": { "myth": "common misconception about ${topic}", "fact": "the reality" },
    "schedule": [
      { "day": "Mon", "task": "..." },
      { "day": "Tue", "task": "..." },
      { "day": "Wed", "task": "..." },
      { "day": "Thu", "task": "..." },
      { "day": "Fri", "task": "..." }
    ]
  },

  "captions": {
    "instagram": "<optimized for Instagram feed — visual storytelling, carousel-ready>",
    "tiktok": "<optimized for TikTok — fast hook, trend potential, sound-friendly>",
    "facebook": "<optimized for Facebook — longer form, parent-friendly, detailed>"
  }
}

QUANTITY & QUALITY INSTRUCTIONS (MAKE IT RICH, ELITE & ADVANCED !!):
- synonyms: 10 items (sophisticated, academic vocabulary with subtle nuance explained)
- antonyms: 10 items (complex relational opposites with contextual markers)
- vocabulary: 8 items (comprehensive definitions + 2 examples each: one simple, one academic/BAC-style)
- phrases: 10 items (sophisticated, multi-clause structures for critical analysis and formal argumentation)
- collocations: 10 items (academic and literary pairings that impress examiners)
- idioms: 8 items (metaphorical expressions with historical/cultural context where relevant)
- connectors: 10 items (sophisticated transition markers for flow and cohesion)
- wordFamily: 5 items (detailed morphological breakdown across all parts of speech)
- paraphrases: 6 items (showing transformation from basic/colloquial to formal/academic register)
- commonMistakes: 8 items (deep-dive into 'False Friends', structural errors, and register mismatches)
- grammarPatterns: 6 items (complex syntax: inversion, cleft sentences, advanced modals, subjunctive)
- writingTips: 10 tips (strategic advice on structure, hook-building, conclusion-crafting, and vocabulary variety)
- growthCards: Ensure every field is contextually relevant to ${topic} and demonstrates ELITE ${language} mastery.

All examples MUST be detailed, context-rich, and clearly demonstrate high-end mastery of ${language}. They should be ready to be copied into a 20/20 BAC exam paper. Elite quality only. Use complex sentence structures in examples to show what a top-tier student would write.
`;

    const response = await getReliableCompletion({
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 3800,
        temperature: 0.8,
    });

    const content = response.choices[0]?.message?.content || "{}";
    let body: any = {};
    try {
      body = JSON.parse(content);
    } catch (e) {
      console.error("AI JSON Parse Error:", e);
      throw new Error("AI returned invalid JSON format.");
    }

    // Sanitize specifically for React rendering safety
    const sanitized = {
      script: typeof body.script === 'object' ? JSON.stringify(body.script, null, 2) : (body.script || ""),
      visualTitle: typeof body.visualTitle === 'object' ? JSON.stringify(body.visualTitle) : (body.visualTitle || "Hook Title"),
      visualBody: typeof body.visualBody === 'object' ? JSON.stringify(body.visualBody, null, 2) : (body.visualBody || ""),
      captions: typeof body.captions === 'object' ? body.captions : {},
      synonyms:       Array.isArray(body.synonyms)       ? body.synonyms       : [],
      antonyms:       Array.isArray(body.antonyms)       ? body.antonyms       : [],
      vocabulary:     Array.isArray(body.vocabulary)     ? body.vocabulary     : [],
      phrases:        Array.isArray(body.phrases)        ? body.phrases        : [],
      collocations:   Array.isArray(body.collocations)   ? body.collocations   : [],
      idioms:         Array.isArray(body.idioms)         ? body.idioms         : [],
      connectors:     Array.isArray(body.connectors)     ? body.connectors     : [],
      wordFamily:     Array.isArray(body.wordFamily)     ? body.wordFamily     : [],
      paraphrases:    Array.isArray(body.paraphrases)    ? body.paraphrases    : [],
      commonMistakes: Array.isArray(body.commonMistakes) ? body.commonMistakes : [],
      grammarPatterns:Array.isArray(body.grammarPatterns)? body.grammarPatterns: [],
      writingTips:    Array.isArray(body.writingTips)    ? body.writingTips    : [],
      growthCards:    typeof body.growthCards === 'object' ? body.growthCards : {},
    };

    return NextResponse.json({ ok: true, ...sanitized });
  } catch (error: any) {
    console.error(error);
    const status = getErrorStatus(error);
    if (status === 429) {
      return NextResponse.json(
        { error: "OpenAI quota reached (429). Please wait and retry later." },
        { status: 429 }
      );
    }
    return NextResponse.json({ error: error.message || "Failed to generate content" }, { status: 500 });
  }
}
