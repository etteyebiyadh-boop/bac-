import OpenAI from "openai";

export type AIProvider = "openai" | "google" | "groq";

export function getAIClient() {
  const rawProvider = process.env.AI_PROVIDER?.trim().replace(/^["']|["']$/g, "");
  const groqKey = process.env.GROQ_API_KEY?.trim().replace(/^["']|["']$/g, "");
  const googleKey = process.env.GOOGLE_API_KEY?.trim().replace(/^["']|["']$/g, "");
  const openaiKey = process.env.OPENAI_API_KEY?.trim().replace(/^["']|["']$/g, "");

  console.log(`[AI DIAGNOSTIC] Provider: ${rawProvider || 'NONE'}, GroqKey: ${!!groqKey}, GoogleKey: ${!!googleKey}, OpenAIKey: ${!!openaiKey}`);

  // Auto-detect provider if AI_PROVIDER is blank
  let provider = (rawProvider || "openai") as AIProvider;
  if (!rawProvider) {
    if (groqKey && (groqKey !== "replace_me_free_groq_key" && groqKey.length > 5)) provider = "groq";
    else if (googleKey && (googleKey !== "replace_me_free_gemini_key" && googleKey.length > 5)) provider = "google";
  }
  
  // 1. Google Gemini (FREE via AI Studio)
  if (provider === "google") {
    if (!googleKey || googleKey === "replace_me_free_gemini_key" || googleKey.length < 5) {
       throw new Error(`Missing or invalid GOOGLE_API_KEY. Detected provider: ${provider}. Get one for FREE at: https://aistudio.google.com/app/apikey`);
    }
    return {
      client: new OpenAI({
        apiKey: googleKey,
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      }),
      model: "gemini-1.5-flash",
    };
  }

  // 2. Groq (FAST & FREE Tier)
  if (provider === "groq") {
     if (!groqKey || groqKey === "replace_me_free_groq_key" || groqKey.length < 5) {
        throw new Error(`Missing or invalid GROQ_API_KEY. Detected provider: ${provider}. Get one for FREE at: https://console.groq.com/keys`);
     }
     return {
        client: new OpenAI({
           apiKey: groqKey,
           baseURL: "https://api.groq.com/openai/v1",
        }),
        model: "llama-3.3-70b-versatile",
     };
  }

  // 3. Original OpenAI
  if (!openaiKey || openaiKey === "replace_me" || openaiKey.length < 5) {
     throw new Error(`AI Config Error. 
     Detected Settings: Provider=${rawProvider || 'none'}, GroqSet=${!!groqKey}, GoogleSet=${!!googleKey}, OpenAISet=${!!openaiKey}. 
     Missing OPENAI_API_KEY. Update your .env or switch AI_PROVIDER to 'google' or 'groq'.`);
  }

  return {
    client: new OpenAI({ apiKey: openaiKey }),
    model: (process.env.OPENAI_MODEL?.trim().replace(/^["']|["']$/g, "") || "gpt-4o-mini"),
  };
}
