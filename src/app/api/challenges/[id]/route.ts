import { NextRequest, NextResponse } from "next/server";
import { requireCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

// GET - Get a specific challenge
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireCurrentUser();
    const { id } = await params;
    
    const challenge = await db.challenge.findUnique({
      where: { id },
    });

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    // Verify user has access
    if (challenge.challengerId !== user.id && challenge.challengedEmail !== user.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    return NextResponse.json({ challenge });
  } catch (error) {
    console.error("Get challenge error:", error);
    return NextResponse.json(
      { error: "Failed to fetch challenge" },
      { status: 500 }
    );
  }
}

// PATCH - Update challenge (accept, submit score, complete)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireCurrentUser();
    const { id } = await params;
    const body = await request.json();
    const { action, score } = body;

    const challenge = await db.challenge.findUnique({
      where: { id },
    });

    if (!challenge) {
      return NextResponse.json(
        { error: "Challenge not found" },
        { status: 404 }
      );
    }

    // Verify user has access
    const isChallenger = challenge.challengerId === user.id;
    const isChallenged = challenge.challengedEmail === user.email;

    if (!isChallenger && !isChallenged) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Handle different actions
    switch (action) {
      case "accept":
        if (!isChallenged) {
          return NextResponse.json(
            { error: "Only the challenged user can accept" },
            { status: 403 }
          );
        }
        const updatedChallenge = await db.challenge.update({
          where: { id },
          data: {
            status: "ACCEPTED",
            challengedId: user.id,
          },
        });
        return NextResponse.json({ challenge: updatedChallenge });

      case "submit-score":
        if (!isChallenged) {
          return NextResponse.json(
            { error: "Only the challenged user can submit a score" },
            { status: 403 }
          );
        }
        const scoreUpdate = await db.challenge.update({
          where: { id },
          data: {
            challengedScore: score,
            status: "COMPLETED",
            completedAt: new Date(),
            winnerId: score > (challenge.challengerScore || 0) ? user.id : challenge.challengerId,
          },
        });
        return NextResponse.json({ challenge: scoreUpdate });

      case "decline":
        if (!isChallenged) {
          return NextResponse.json(
            { error: "Only the challenged user can decline" },
            { status: 403 }
          );
        }
        const declinedChallenge = await db.challenge.update({
          where: { id },
          data: { status: "DECLINED" },
        });
        return NextResponse.json({ challenge: declinedChallenge });

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Update challenge error:", error);
    return NextResponse.json(
      { error: "Failed to update challenge" },
      { status: 500 }
    );
  }
}
