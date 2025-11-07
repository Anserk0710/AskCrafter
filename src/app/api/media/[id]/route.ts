import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { verify } from "@/lib/auth";
import { z } from "zod";
import { cookies } from "next/headers";

const updateSchema = z.object({
  caption: z.string().max(300).optional(),
  // type: z.enum(["image", "video"]).optional(), // aktifkan jika mau izinkan ubah type
  // url: z.string().url().optional(),            // aktifkan jika mau izinkan ubah url
});

// GET /api/media/[id] — publik
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const media = await db.media.findUnique({ where: { id } });
  if (!media) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(media);
}

// PATCH /api/media/[id] — ADMIN & EDITOR (editor hanya miliknya)
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  // ⬇⬇⬇ cookies() harus di-await
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
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  if (me.role === "EDITOR") {
    const owned = await db.media.findUnique({
      where: { id },
      select: { uploaderId: true },
    });
    if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (owned.uploaderId !== me.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const updated = await db.media.update({
    where: { id },
    data: {
      ...(parsed.data.caption ? { caption: parsed.data.caption } : {}),
      // ...(parsed.data.type ? { type: parsed.data.type } : {}),
      // ...(parsed.data.url ? { url: parsed.data.url } : {}),
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/media/[id] — ADMIN & EDITOR (editor hanya miliknya)
export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  // ⬇⬇⬇ cookies() harus di-await
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

  if (me.role === "EDITOR") {
    const owned = await db.media.findUnique({
      where: { id },
      select: { uploaderId: true },
    });
    if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (owned.uploaderId !== me.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  await db.media.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
