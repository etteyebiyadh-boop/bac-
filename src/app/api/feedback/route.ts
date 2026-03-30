import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  submissionId: z.string(),
  rating: z.number().int().min(1).max(5),
  feedback: z.string().optional()
});

export async function POST(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = schema.parse(await req.json());
    
    // Verify the submission belongs to this user
    const submission = await db.submission.findFirst({
      where: { id: body.submissionId, userId: auth.userId }
    });
    
    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    // Create feedback
    const feedback = await db.feedback.create({
      data: {
        submissionId: body.submissionId,
        userId: auth.userId,
        rating: body.rating,
        comment: body.feedback
      }
    });

    return NextResponse.json({ ok: true, feedback });
  } catch (error) {
    console.error("[FEEDBACK] Error:", error);
    return NextResponse.json({ error: "Failed to save feedback" }, { status: 500 });
  }
}
