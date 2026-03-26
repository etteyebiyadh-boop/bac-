import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, hasAdminAccess } from "@/lib/auth";
import { generateHeyGenVideo, checkHeyGenStatus } from "@/lib/video-ai";

/**
 * PROFESSIONAL VIDEO RENDER ENGINE
 * Handles synthesis of Digital Teacher AI into MP4.
 */

const ELITE_MOCK_VIDEOS = [
  "https://pub-2da8b7f83713430ebe53df9ef43c3330.r2.dev/BacExcellence_DigitalTeacher_Sample.mp4",
  "https://v-cg.heygen.ai/f47d3c01-8b9a-4c2a-8d6b-7e5f1a2b3c4d/video.mp4"
];

export async function POST(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  if (!hasAdminAccess(req, auth.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { script, action, videoId, vibe } = await req.json();

    // 1. MOCK SIMULATION MODE (When no HEYGEN_API_KEY)
    if (!process.env.HEYGEN_API_KEY) {
       console.log("No HeyGen Key - Running Professional Simulation for Vibe:", vibe);
       
       if (action === "check") {
          return NextResponse.json({ 
            ok: true, 
            status: "completed", 
            url: ELITE_MOCK_VIDEOS[0] 
          });
       }
       
       return NextResponse.json({ 
         ok: true, 
         videoId: "professional-master-" + Date.now(),
         message: "Synthesizing Professional Scene..." 
       });
    }

    // 2. ACTUAL PRODUCTION MODE (HeyGen Integration)
    if (action === "check" && videoId) {
      const result = await checkHeyGenStatus(videoId);
      return NextResponse.json({ ok: true, status: result.status, url: result.video_url });
    }

    if (!script) throw new Error("Production Blueprint is incomplete (Missing Script).");
    
    // Choose Avatar based on Production Vibe
    let avatarId = "josh_lite_20220901_talking_photo";
    if (vibe === "THE MASTER") avatarId = "academic_professor_legacy_001";
    if (vibe === "VIRAL REBEL") avatarId = "tech_creator_vibe_002";

    const newVideoId = await generateHeyGenVideo(script, avatarId);
    
    return NextResponse.json({ ok: true, videoId: newVideoId });

  } catch (error: any) {
    console.error("PRODUCTION ERROR:", error);
    return NextResponse.json({ error: error.message || "Failed to initiate professional production." }, { status: 500 });
  }
}
