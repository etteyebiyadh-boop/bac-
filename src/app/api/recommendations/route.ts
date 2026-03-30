import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { getDashboardNextAction, generateStudyPath } from "@/lib/recommendations";

export const dynamic = "force-dynamic";

// GET /api/recommendations - Get single next best action for dashboard
export async function GET(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const nextAction = await getDashboardNextAction(auth.userId);
    
    if (!nextAction) {
      return NextResponse.json({ 
        action: null,
        message: "Complete a writing submission to get personalized recommendations."
      });
    }

    return NextResponse.json({ action: nextAction });
  } catch (error) {
    console.error("[RECOMMENDATIONS] Error:", error);
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 });
  }
}

// POST /api/recommendations - Get full study path (multiple recommendations)
export async function POST(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const limit = body.limit || 3;
    
    const path = await generateStudyPath(auth.userId, limit);
    
    return NextResponse.json({ 
      path,
      count: path.length 
    });
  } catch (error) {
    console.error("[RECOMMENDATIONS] Error:", error);
    return NextResponse.json({ error: "Failed to generate study path" }, { status: 500 });
  }
}
