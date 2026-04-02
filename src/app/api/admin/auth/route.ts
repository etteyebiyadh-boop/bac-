import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    const securedPasscode = process.env.ADMIN_PASSCODE || "fubisra06";
    
    if (code === securedPasscode) {
      const jar = await cookies();
      jar.set("admin_pass", securedPasscode, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax"
      });
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false, error: "Invalid code" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
