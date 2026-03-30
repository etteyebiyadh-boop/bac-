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

    const prompt = `${BAC_AI_PERSONA}

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

  "captions": {
    "instagram": "<optimized for Instagram feed — visual storytelling, carousel-ready>",
    "tiktok": "<optimized for TikTok — fast hook, trend potential, sound-friendly>",
    "facebook": "<optimized for Facebook — longer form, parent-friendly, detailed>"
  }
}

QUANTITY:
- synonyms: 5 items
- antonyms: 5 items
- vocabulary: 4 items
- phrases: 6 items
- collocations: 5 items
- idioms: 4 items
- connectors: 6 items (mix of types)
- wordFamily: 3 items
- paraphrases: 3 items
- commonMistakes: 4 items
- grammarPatterns: 3 items
- writingTips: 5 tips

All content MUST be in ${language} and DIRECTLY relevant to "${topic}". High-scoring, exam-ready. Elite quality only.`;

    const response = await getReliableCompletion({
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 2400,
        temperature: 0.6,
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
