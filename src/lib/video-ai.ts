export async function generateHeyGenVideo(script: string, avatarId: string = "josh_lite_20220901", voiceId: string = "en-US-Wavenet-D") {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) throw new Error("HEYGEN_API_KEY is not configured. Please add it to your .env file.");

  // 1. Submit Video Generation Task
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
            avatar_style: "normal"
          },
          input_text: script,
          voice: {
            type: "text",
            input_text: script,
            voice_id: voiceId
          }
        }
      ],
      dimension: {
        width: 1080,
        height: 1920
      }
    })
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Failed to initiate HeyGen video generation.");

  return data.data.video_id;
}

export async function checkHeyGenStatus(videoId: string) {
  const apiKey = process.env.HEYGEN_API_KEY;
  if (!apiKey) throw new Error("HEYGEN_API_KEY is not configured.");

  const response = await fetch(`https://api.heygen.com/v2/video_status.get?video_id=${videoId}`, {
    method: "GET",
    headers: {
      "X-Api-Key": apiKey
    }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Failed to check video status.");

  return data.data; // { status: "completed", video_url: "..." }
}
