import OpenAI from "openai";

export type AIProvider = "openai" | "google" | "groq";

export function getAIClient() {
  const provider = (process.env.AI_PROVIDER?.trim().replace(/^["']|["']$/g, "") || "openai") as AIProvider;
  
  // 1. Google Gemini (FREE via AI Studio)
  if (provider === "google") {
    const apiKey = process.env.GOOGLE_API_KEY?.trim().replace(/^["']|["']$/g, "");
    if (!apiKey || apiKey === "replace_me_free_gemini_key") {
       throw new Error("Missing GOOGLE_API_KEY. Get one for FREE at: https://aistudio.google.com/app/apikey");
    }
    return {
      client: new OpenAI({
        apiKey,
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      }),
      model: "gemini-1.5-flash",
    };
  }

  // 2. Groq (FAST & FREE Tier)
  if (provider === "groq") {
     const apiKey = process.env.GROQ_API_KEY?.trim().replace(/^["']|["']$/g, "");
     if (!apiKey || apiKey === "replace_me_free_groq_key") {
        throw new Error("Missing GROQ_API_KEY. Get one for FREE at: https://console.groq.com/keys");
     }
     return {
        client: new OpenAI({
           apiKey,
           baseURL: "https://api.groq.com/openai/v1",
        }),
        model: "llama-3.3-70b-versatile",
     };
  }

  // 3. Original OpenAI
  const apiKey = process.env.OPENAI_API_KEY?.trim().replace(/^["']|["']$/g, "");
  if (!apiKey || apiKey === "replace_me") {
     throw new Error("Missing OPENAI_API_KEY. Update your .env or switch AI_PROVIDER to 'google' or 'groq'.");
  }

  return {
    client: new OpenAI({ apiKey }),
    model: (process.env.OPENAI_MODEL?.trim().replace(/^["']|["']$/g, "") || "gpt-4o-mini"),
  };
}
