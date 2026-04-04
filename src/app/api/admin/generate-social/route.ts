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
    const { topic, language, platform, section, campaignMode } = await req.json();
    
    const context = campaignMode ? "FULL 7-DAY VIRAL CAMPAIGN (Monday-Sunday)" : `SINGLE CONTENT PACK for ${platform}`;
    const sectionContext = section ? `Target Section: ${section}.` : "Target: All BAC sections.";
    
    const prompt = `${BAC_AI_PERSONA}

    VIRAL CAMPAIGN DIRECTIVE: 
    - Construct a high-conversion series of posts/videos.
    - Phase 1 (Education): Hook them with value.
    - Phase 2 (Desire): Show them the "Bac Excellence" platform results.
    - Phase 3 (Action): Scarcity and XP rewards.

Create a ${context} for: ${language} - "${topic}". ${sectionContext}

Return ONLY a valid JSON object with these EXACT keys:

{
  "campaignPlan": [
    { "day": "Mon", "type": "Educational Hook", "visual": "...", "caption": "..." },
    { "day": "Tue", "type": "The 'Bac Excellence' Advantage", "visual": "...", "caption": "..." },
    { "day": "Wed", "type": "Peak Performance Quiz", "visual": "...", "caption": "..." },
    { "day": "Thu", "type": "Common Mistakes / Recovery", "visual": "...", "caption": "..." },
    { "day": "Fri", "type": "Live Study Deep-Dive", "visual": "...", "caption": "..." },
    { "day": "Sat", "type": "Social Proof / Student Success", "visual": "...", "caption": "..." },
    { "day": "Sun", "type": "The 20/20 Challenge Launch", "visual": "...", "caption": "..." }
  ],
  "tiktokScript": {
    "hook": "0-3s hook with visual interrupt",
    "body": [
       { "time": "3-15s", "visual": "[Overlay: text]", "audio": "what to say" },
       { "time": "15-45s", "visual": "[Screen share: Bac Excellence dashboard]", "audio": "..." }
    ],
    "cta": "Engagement hack for comments"
  },
  "viralTitle": "<MAX 6 words, high-impact hook>",
  "visualBody": "<EXACTLY 2 LINES — curiosity gap focused>",

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
    "challenge": { "title": "7-Day X Mastery", "reward": "Elite Badge", "rule": "tag 3 friends" },
    "quiz": { "question": "sophisticated ${language} question", "optionA": "...", "optionB": "...", "correct": "A" },
    "checklist": ["5 items specific to mastering ${topic}"],
    "motivation": { "quote": "powerful quote in ${language} or about learning", "author": "..." },
    "essayTransformation": { "before": "basic/simple version", "after": "elite/advanced version", "result": "why it is better" },
    "didYouKnow": "surprising fact about ${topic} or ${language} usage",
    "thisOrThat": { "option1": "choice A", "option2": "choice B" },
    "fillBlank": { "sentence": "sentence with _____ blank", "options": ["word 1", "word 2", "word 3", "word 4"], "answer": "the correct one" },
    "mythFact": { "myth": "common misconception about ${topic}", "fact": "the reality" }
  },

  "captions": {
    "instagram": "<optimized for Instagram feed — visual storytelling, carousel-ready>",
    "tiktok": "<optimized for TikTok — fast hook, trend potential, sound-friendly>",
    "facebook": "<optimized for Facebook — longer form, parent-friendly, detailed>"
  }
}

QUANTITY INSTRUCTIONS:
- synonyms/antonyms/vocabulary/phrases/collocations: 5 items each.
- Full 7-day campaign strategy included. 
`;

    const response = await getReliableCompletion({
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_tokens: 4000,
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

    const sanitized = {
      campaignPlan: Array.isArray(body.campaignPlan) ? body.campaignPlan : [],
      tiktokScript: typeof body.tiktokScript === 'object' ? body.tiktokScript : null,
      visualTitle: body.viralTitle || body.visualTitle || "Hook Title",
      visualBody: typeof body.visualBody === 'string' ? body.visualBody : (Array.isArray(body.visualBody) ? body.visualBody.join('\n') : ""),
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
