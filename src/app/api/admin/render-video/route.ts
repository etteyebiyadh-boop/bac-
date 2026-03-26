import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest, hasAdminAccess } from "@/lib/auth";
import { generateHeyGenVideo, checkHeyGenStatus } from "@/lib/video-ai";

export async function POST(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  if (!hasAdminAccess(req, auth.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { script, avatarId, action, videoId } = await req.json();

    if (action === "check" && videoId) {
      const result = await checkHeyGenStatus(videoId);
      return NextResponse.json({ ok: true, status: result.status, url: result.video_url });
    }

    if (!script) throw new Error("Voiceover Script is required.");
    
    // Default avatar for Bac Excellence (Elite Teacher style)
    const newVideoId = await generateHeyGenVideo(script, avatarId || "josh_lite_20220901_talking_photo");
    
    return NextResponse.json({ ok: true, videoId: newVideoId });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Failed to initiate digital teacher generation." }, { status: 500 });
  }
}
