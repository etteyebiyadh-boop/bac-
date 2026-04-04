import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";
import { BacSection } from "@prisma/client";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { section } = await req.json();

  if (!section || !Object.values(BacSection).includes(section as BacSection)) {
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  }

  try {
    const profile = await db.studentProfile.upsert({
      where: { userId: user.id },
      update: { bacSection: section as BacSection },
      create: { 
        userId: user.id, 
        bacSection: section as BacSection,
        targetScore: 16 // Default for BAC students
      }
    });

    return NextResponse.json({ success: true, profile });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
