import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateGrammarDrill } from "@/lib/ai";
import { getUserFromRequest } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";

const DRILL_RATE_LIMIT = 5;
const RATE_WINDOW = 60000; // 1 minute

export async function POST(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown-ip";
  const rateCheck = checkRateLimit(`${auth.userId}:${ip}`, DRILL_RATE_LIMIT, RATE_WINDOW);
  if (!rateCheck.allowed) {
    return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });
  }

  try {
    const { ruleId } = await req.json();

    if (!ruleId) {
      return NextResponse.json({ error: "Rule ID is required" }, { status: 400 });
    }

    const rule = await db.grammarRule.findUnique({
      where: { id: ruleId }
    });

    if (!rule) {
      return NextResponse.json({ error: "Grammar rule not found" }, { status: 404 });
    }

    // Generate drill using AI
    const result = await generateGrammarDrill(
      rule.title,
      rule.rule,
      rule.language
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Grammar drill generation failed", error);
    
    if (error.message === "AI_TIMEOUT") {
      return NextResponse.json({ error: "AI took too long to generate the drill. Please try again." }, { status: 504 });
    }

    return NextResponse.json(
      { error: "Failed to generate practice drill. Please try again." },
      { status: 500 }
    );
  }
}
