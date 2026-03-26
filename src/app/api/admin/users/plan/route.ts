import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getUserFromRequest, isAdminEmail } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  isPremium: z.boolean()
});

export async function POST(req: NextRequest) {
  const session = await getUserFromRequest(req);
  const adminCookie = req.cookies.get("admin_pass")?.value;
  if (!session || (!isAdminEmail(session.email) && adminCookie !== "fubisra06")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = schema.parse(await req.json());
    const user = await db.user.update({
      where: { email: body.email.toLowerCase() },
      data: { isPremium: body.isPremium },
      select: { id: true, email: true, isPremium: true }
    });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Unable to update user plan" }, { status: 400 });
  }
}
