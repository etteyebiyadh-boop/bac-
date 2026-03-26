/**
 * Bac Excellence Cinematic Video Library
 * Integrates with HeyGen for Talking Heads and ElevenLabs for Premium Voiceovers.
 */

export async function generateHeyGenVideo(
  script: string, 
  avatarId: string = "josh_lite_20220901", 
  vibe: string = "ELITE BROTHER"
) {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) return null; // Fallback to mock

  // 1. Submit Video Generation Task (Talking Head)
  // Higher resolution for Elite users
  const response = await fetch("https://api.heygen.com/v2/video/generate", {
    method: "POST",
    headers: {
      "X-Api-Key": apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      video_inputs: [
        {
          character: {
            type: "avatar",
            avatar_id: avatarId,
            avatar_style: "normal",
            background: { 
              type: "color", 
              value: vibe === "VIRAL REBEL" ? "#000" : "#111" 
            }
          },
          voice: {
            type: "text",
            input_text: script,
            voice_id: "en-US-Wavenet-D" // Defaulting, ideally map to Tunisian later
          }
        }
      ],
      dimension: {
        width: 1080,
        height: 1920 // Cinematic Vertical for TikTok/Reels
      }
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "HeyGen Synthesis Failed.");

  return data.data.video_id;
}

export async function checkHeyGenStatus(videoId: string) {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) return { status: "completed", url: "#" };

  const response = await fetch(`https://api.heygen.com/v2/video_status.get?video_id=${videoId}`, {
    method: "GET",
    headers: {
      "X-Api-Key": apiKey
    }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Failed to check production status.");

  return data.data; 
}
