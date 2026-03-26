import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest, hasAdminAccess } from "@/lib/auth";
import { Language, Difficulty } from "@prisma/client";
import { z } from "zod";

const createSchema = z.object({
  slug: z.string().min(3),
  language: z.nativeEnum(Language),
  baseForm: z.string().min(1),
  pastSimple: z.string().min(1),
  pastParticiple: z.string().min(1),
  presentParticiple: z.string().optional(),
  thirdPersonSingular: z.string().optional(),
  isRegular: z.boolean().default(true),
  isIrregular: z.boolean().default(false),
  isPhrasal: z.boolean().default(false),
  isModal: z.boolean().default(false),
  auxiliaryVerb: z.string().optional(),
  fullConjugation: z.record(z.any()).optional(),
  commonUses: z.array(z.string()),
  exampleSentences: z.array(z.string()),
  collocations: z.array(z.string()).optional(),
  difficulty: z.nativeEnum(Difficulty)
});

const updateSchema = createSchema.partial().extend({ id: z.string() });

// GET /api/admin/content/verbs - List all verbs
export async function GET(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  if (!hasAdminAccess(req, auth.email)) {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const language = searchParams.get("language") as Language | null;
    const isIrregular = searchParams.get("isIrregular");
    const isPhrasal = searchParams.get("isPhrasal");
    const search = searchParams.get("search");

    const where: any = {};
    if (language) where.language = language;
    if (isIrregular !== null) where.isIrregular = isIrregular === "true";
    if (isPhrasal !== null) where.isPhrasal = isPhrasal === "true";
    if (search) where.baseForm = { contains: search, mode: "insensitive" };

    const verbs = await db.verbConjugation.findMany({
      where,
      orderBy: [{ baseForm: "asc" }],
      take: 100
    });

    return NextResponse.json({ verbs });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// POST /api/admin/content/verbs - Create new verb
export async function POST(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  if (!hasAdminAccess(req, auth.email)) {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
  }

  try {
    const body = createSchema.parse(await req.json());
    
    const existing = await db.verbConjugation.findUnique({
      where: { slug: body.slug }
    });
    
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const verb = await db.verbConjugation.create({
      data: {
        ...body,
        fullConjugation: body.fullConjugation || {},
        commonUses: body.commonUses || [],
        exampleSentences: body.exampleSentences || [],
        collocations: body.collocations || []
      }
    });

    return NextResponse.json({ ok: true, verb });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Invalid payload or database error" }, { status: 400 });
  }
}

// PUT /api/admin/content/verbs - Update verb
export async function PUT(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  if (!hasAdminAccess(req, auth.email)) {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
  }

  try {
    const body = updateSchema.parse(await req.json());
    const { id, ...updateData } = body;

    const verb = await db.verbConjugation.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ ok: true, verb });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Invalid payload or database error" }, { status: 400 });
  }
}

// DELETE /api/admin/content/verbs - Delete verb
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

    await db.verbConjugation.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
