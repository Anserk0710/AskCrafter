import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { verify } from "@/lib/auth";
import { z } from "zod";
import { cookies } from "next/headers";

const mediaSchema = z.object({
  type: z.enum(["image", "video"]),
  url: z.string().url(),
  caption: z.string().max(300).optional(),
});

// GET /api/media?type=image|video&limit=12&cursor=<id>
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const typeQP = searchParams.get("type");
  const type = typeQP === "image" || typeQP === "video" ? (typeQP as "image" | "video") : null;

  const limitQP = Number(searchParams.get("limit") ?? 12);
  const limit = Number.isFinite(limitQP) ? Math.min(Math.max(limitQP, 1), 50) : 12;

  const cursor = searchParams.get("cursor") ?? undefined;
  const where = type ? { type } : {};

  const rows = await db.media.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasNext = rows.length > limit;
  const items = hasNext ? rows.slice(0, limit) : rows;
  const nextCursor = hasNext ? items[items.length - 1].id : null;

  return NextResponse.json({ items, nextCursor });
}

// POST /api/media  (ADMIN & EDITOR only)
export async function POST(req: Request) {
  // ⬇⬇⬇ perubahan di sini: cookies() harus di-await
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value ?? "";
  const auth = verify(token);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const me = await db.user.findUnique({
    where: { id: auth.sub },
    select: { id: true, role: true },
  });
  if (!me || (me.role !== "ADMIN" && me.role !== "EDITOR")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const json = await req.json();
  const parsed = mediaSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const { type, url, caption } = parsed.data;

  // (opsional) sanity check type vs ekstensi
  if (type === "image" && /\.(mp4|webm|mov|m4v|avi)(\?|$)/i.test(url)) {
    return NextResponse.json({ error: "URL is not an image" }, { status: 400 });
  }
  if (type === "video" && /\.(jpe?g|png|gif|webp|avif|svg)(\?|$)/i.test(url)) {
    return NextResponse.json({ error: "URL is not a video" }, { status: 400 });
  }

  try {
    const created = await db.media.create({
      data: {
        type,
        url,
        caption: caption ?? null,
        uploaderId: me.id,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    if (e?.code === "P2002") {
      return NextResponse.json({ error: "Duplicate media URL" }, { status: 409 });
    }
    throw e;
  }
}
