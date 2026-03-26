import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest, hasAdminAccess } from "@/lib/auth";
import { Language, GrammarCategory, Difficulty } from "@prisma/client";
import { z } from "zod";

const createSchema = z.object({
  slug: z.string().min(3),
  language: z.nativeEnum(Language),
  category: z.nativeEnum(GrammarCategory),
  title: z.string().min(3),
  rule: z.string().min(10),
  formula: z.string().optional(),
  examples: z.array(z.any()),
  exceptions: z.array(z.string()).optional(),
  usageNotes: z.string().optional(),
  commonErrors: z.array(z.string()).optional(),
  isEssential: z.boolean().default(false),
  relatedRules: z.array(z.string()).optional(),
  difficulty: z.nativeEnum(Difficulty)
});

const updateSchema = createSchema.partial().extend({ id: z.string() });

// GET /api/admin/content/grammar - List all grammar rules
export async function GET(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  if (!hasAdminAccess(req, auth.email)) {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const language = searchParams.get("language") as Language | null;
    const category = searchParams.get("category") as GrammarCategory | null;
    const isEssential = searchParams.get("isEssential");

    const where: any = {};
    if (language) where.language = language;
    if (category) where.category = category;
    if (isEssential !== null) where.isEssential = isEssential === "true";

    const rules = await db.grammarRule.findMany({
      where,
      orderBy: [{ category: "asc" }, { difficulty: "asc" }],
      take: 100
    });

    return NextResponse.json({ rules });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// POST /api/admin/content/grammar - Create new grammar rule
export async function POST(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  if (!hasAdminAccess(req, auth.email)) {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
  }

  try {
    const body = createSchema.parse(await req.json());
    
    const existing = await db.grammarRule.findUnique({
      where: { slug: body.slug }
    });
    
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const rule = await db.grammarRule.create({
      data: {
        ...body,
        exceptions: body.exceptions || [],
        commonErrors: body.commonErrors || [],
        relatedRules: body.relatedRules || []
      }
    });

    return NextResponse.json({ ok: true, rule });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Invalid payload or database error" }, { status: 400 });
  }
}

// PUT /api/admin/content/grammar - Update grammar rule
export async function PUT(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  if (!hasAdminAccess(req, auth.email)) {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
  }

  try {
    const body = updateSchema.parse(await req.json());
    const { id, ...updateData } = body;

    const rule = await db.grammarRule.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ ok: true, rule });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Invalid payload or database error" }, { status: 400 });
  }
}

// DELETE /api/admin/content/grammar - Delete grammar rule
export async function DELETE(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  if (!hasAdminAccess(req, auth.email)) {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await db.grammarRule.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
