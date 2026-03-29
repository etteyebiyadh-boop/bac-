import OpenAI from "openai";

export type AIProvider = "openai" | "google" | "groq";

export interface AIConfig {
   client: OpenAI;
   model: string;
   provider: AIProvider;
}

function hasConfiguredKey(provider: AIProvider) {
  if (provider === "openai") {
    return Boolean(process.env.OPENAI_API_KEY?.trim().replace(/^["']|["']$/g, ""));
  }

  if (provider === "google") {
    return Boolean(process.env.GOOGLE_API_KEY?.trim().replace(/^["']|["']$/g, ""));
  }

  return Boolean(process.env.GROQ_API_KEY?.trim().replace(/^["']|["']$/g, ""));
}

/**
 * Returns the primary AI configuration based on .env
 * Also provides a list of backup providers for senior fallback logic.
 */
export function getAIClient(requestedProvider?: AIProvider): AIConfig {
  const rawProvider = process.env.AI_PROVIDER?.trim().replace(/^["']|["']$/g, "");
  const groqKey = process.env.GROQ_API_KEY?.trim().replace(/^["']|["']$/g, "");
  const googleKey = process.env.GOOGLE_API_KEY?.trim().replace(/^["']|["']$/g, "");
  const openaiKey = process.env.OPENAI_API_KEY?.trim().replace(/^["']|["']$/g, "");

  // Priority: 1. Requested | 2. Configured | 3. Auto-detected
  let provider: AIProvider = (requestedProvider || rawProvider || "openai") as AIProvider;
  
  // Auto-detection logic if blank
  if (!requestedProvider && !rawProvider) {
    if (groqKey && groqKey.length > 10) provider = "groq";
    else if (googleKey && googleKey.length > 10) provider = "google";
  }

  // 1. Google Gemini (Tier 2 / Reliable Fallback)
  if (provider === "google") {
    if (!googleKey || googleKey.length < 5) throw new Error("Missing GOOGLE_API_KEY");
    return {
      client: new OpenAI({
        apiKey: googleKey,
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      }),
      model: "gemini-1.5-flash",
      provider: "google"
    };
  }

  // 2. Groq (Tier 1 / Performance)
  if (provider === "groq") {
     if (!groqKey || groqKey.length < 5) throw new Error("Missing GROQ_API_KEY");
     return {
        client: new OpenAI({
           apiKey: groqKey,
           baseURL: "https://api.groq.com/openai/v1",
        }),
        model: "llama-3.3-70b-versatile",
        provider: "groq"
     };
  }

  // 3. OpenAI (Tier 3 / Premium)
  if (!openaiKey || openaiKey.length < 5) {
     // If OpenAI is missing but we have others, try falling back immediately
     if (groqKey) return getAIClient("groq");
     if (googleKey) return getAIClient("google");
     
     throw new Error("No AI Provider configured. Please set GROQ_API_KEY, GOOGLE_API_KEY, or OPENAI_API_KEY.");
  }

  return {
    client: new OpenAI({ apiKey: openaiKey }),
    model: (process.env.OPENAI_MODEL?.trim().replace(/^["']|["']$/g, "") || "gpt-4o-mini"),
    provider: "openai"
  };
}

export function getVisionAIClient(): AIConfig {
  const supportedVisionProviders: AIProvider[] = ["openai", "google"];

  for (const provider of supportedVisionProviders) {
    if (!hasConfiguredKey(provider)) continue;
    return getAIClient(provider);
  }

  throw new Error("Image scanning requires OPENAI_API_KEY or GOOGLE_API_KEY.");
}

export async function extractTextFromWorkImage(imageFile: File, language: string) {
  const config = getVisionAIClient();
  const mimeType = imageFile.type || "image/jpeg";
  const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
  const imageUrl = `data:${mimeType};base64,${imageBuffer.toString("base64")}`;

  const response = await config.client.chat.completions.create({
    model: config.model,
    messages: [
      {
        role: "system",
        content:
          `You extract a student's answer from a photo of schoolwork. ` +
          `Preserve the original language (${language}). ` +
          `Return plain text only. Do not explain. Do not solve the exercise. ` +
          `Ignore printed instructions, notebook lines, watermarks, and page decorations unless they are part of the student's answer. ` +
          `Keep paragraph breaks when they are visible.`
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
              "Read this photo and extract only the student's written answer. " +
              "If part of the answer is unreadable, make the best possible plain-text transcription."
          },
          {
            type: "image_url",
            image_url: {
              url: imageUrl,
              detail: "high"
            }
          }
        ]
      }
    ],
    max_tokens: 900,
    temperature: 0.1,
  });

  const extractedText = response.choices[0]?.message?.content?.trim() || "";
  const cleanedText = extractedText
    .replace(/^```(?:text)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  if (!cleanedText) {
    throw new Error("Image scan returned no text.");
  }

  return cleanedText;
}

/**
 * Senior Helper: Executes a completion with automatic fallback if the primary fails (e.g. 429 Rate Limit)
 */
export async function getReliableCompletion(payload: any) {
   const primary = getAIClient();
   const order: AIProvider[] = ["groq", "google", "openai"];
   
   // Move primary to the front
   const sequence = [primary.provider, ...order.filter(p => p !== primary.provider)];
   
   let lastError: any = null;
   
   for (const provider of sequence) {
      try {
         const config = getAIClient(provider as AIProvider);
         return await config.client.chat.completions.create({
            model: config.model,
            ...payload
         });
      } catch (err: any) {
         console.warn(`[AI FALLBACK] ${provider} failed. Trying next... Error: ${err.message}`);
         lastError = err;
         // Continue to next provider...
      }
   }
   
   throw lastError || new Error("All AI providers failed.");
}
