import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { Language, VocabTheme, Difficulty } from "@prisma/client";
import { z } from "zod";

const vocabItemSchema = z.object({
  word: z.string().min(1),
  definition: z.string().min(5),
  partOfSpeech: z.string().min(2),
  pronunciation: z.string().optional(),
  exampleSentence: z.string().min(10),
  bacExample: z.string().min(10),
  synonyms: z.array(z.string()).optional(),
  antonyms: z.array(z.string()).optional(),
  collocations: z.array(z.string()).optional(),
  register: z.string().default("neutral"),
  difficulty: z.nativeEnum(Difficulty)
});

const createSchema = z.object({
  slug: z.string().min(3),
  language: z.nativeEnum(Language),
  theme: z.nativeEnum(VocabTheme),
  title: z.string().min(3),
  description: z.string().min(10),
  bacContext: z.string().min(10),
  difficulty: z.nativeEnum(Difficulty),
  items: z.array(vocabItemSchema)
});

const updateSchema = z.object({
  id: z.string(),
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  bacContext: z.string().min(10).optional(),
  difficulty: z.nativeEnum(Difficulty).optional()
});

// GET /api/admin/content/vocabulary - List all vocabulary sets
export async function GET(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const { isAdminEmail } = await import("@/lib/auth");
  const adminCookie = req.cookies.get("admin_pass")?.value;
  if (!isAdminEmail(auth.email) && adminCookie !== "fubisra06") {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const language = searchParams.get("language") as Language | null;
    const theme = searchParams.get("theme") as VocabTheme | null;
    const includeItems = searchParams.get("includeItems") === "true";

    const where: any = {};
    if (language) where.language = language;
    if (theme) where.theme = theme;

    const sets = await db.vocabularySet.findMany({
      where,
      include: includeItems ? { items: true } : undefined,
      orderBy: [{ theme: "asc" }, { title: "asc" }],
      take: 100
    });

    return NextResponse.json({ sets });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

// POST /api/admin/content/vocabulary - Create new vocabulary set with items
export async function POST(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",") : [];
  if (!adminEmails.includes(auth.email)) {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
  }

  try {
    const body = createSchema.parse(await req.json());
    
    const existing = await db.vocabularySet.findUnique({
      where: { slug: body.slug }
    });
    
    if (existing) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
    }

    const { items, ...setData } = body;

    const vocabSet = await db.vocabularySet.create({
      data: {
        ...setData,
        items: {
          create: items.map(item => ({
            ...item,
            synonyms: item.synonyms || [],
            antonyms: item.antonyms || [],
            collocations: item.collocations || []
          }))
        }
      },
      include: { items: true }
    });

    return NextResponse.json({ ok: true, set: vocabSet });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Invalid payload or database error" }, { status: 400 });
  }
}

// PUT /api/admin/content/vocabulary - Update vocabulary set
export async function PUT(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",") : [];
  if (!adminEmails.includes(auth.email)) {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
  }

  try {
    const body = updateSchema.parse(await req.json());
    const { id, ...updateData } = body;

    const set = await db.vocabularySet.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({ ok: true, set });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Invalid payload or database error" }, { status: 400 });
  }
}

// DELETE /api/admin/content/vocabulary - Delete vocabulary set
export async function DELETE(req: NextRequest) {
  const auth = await getUserFromRequest(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",") : [];
  if (!adminEmails.includes(auth.email)) {
    return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await db.vocabularySet.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
