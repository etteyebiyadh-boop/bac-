import { NextRequest, NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET - Fetch all challenges for current user
export async function GET(request: NextRequest) {
  try {
    const user = await requireCurrentUser();
    
    const challenges = await db.challenge.findMany({
      where: {
        OR: [
          { challengerId: user.id },
          { challengedEmail: user.email },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ challenges });
  } catch (error) {
    console.error("Get challenges error:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenges" },
      { status: 500 }
    );
  }
}

// POST - Create a new challenge
export async function POST(request: NextRequest) {
  try {
    const user = await requireCurrentUser();
    const body = await request.json();
    const { examSlug, examTitle, language, challengedEmail } = body;

    if (!examSlug || !examTitle) {
      return NextResponse.json(
        { error: "Exam slug and title are required" },
        { status: 400 }
      );
    }

    // Create challenge, expires in 7 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const challenge = await db.challenge.create({
      data: {
        challengerId: user.id,
        challengerName: user.fullName || user.email.split("@")[0],
        challengedEmail: challengedEmail || null,
        examSlug,
        examTitle,
        language: language || "ENGLISH",
        status: challengedEmail ? "PENDING" : "PENDING",
        expiresAt,
        xpReward: 100,
      },
    });

    return NextResponse.json({ challenge });
  } catch (error) {
    console.error("Create challenge error:", error);
    return NextResponse.json(
      { error: "Failed to create challenge" },
      { status: 500 }
    );
  }
}
