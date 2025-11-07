import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { verify } from "../../../../lib/auth";
import { z } from "zod";

const upd = z.object({
  title: z.string().min(3).optional(),
  content: z.string().min(10).optional(),
  coverUrl: z.string().url().optional(),
  published: z.boolean().optional(),
});

// ---- GET /api/articles/[id]
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }  // ⬅️ params adalah Promise
) {
  const { id } = await ctx.params;          // ⬅️ WAJIB di-await
  const data = await db.article.findUnique({ where: { id } });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

// ---- PATCH /api/articles/[id]
export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }  // ⬅️ Promise
) {
  const { id } = await ctx.params;          // ⬅️ await dulu
  const auth = verify((await (req as any).cookies)?.get?.("token")?.value ?? "");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json();
  const parsed = upd.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const { title, content, coverUrl, published } = parsed.data;
  const updated = await db.article.update({
    where: { id },
    data: {
      ...(title ? { title } : {}),
      ...(content ? { content } : {}),
      ...(coverUrl ? { imageUrl: coverUrl } : {}),    // ⬅️ mapping ke kolom DB
      ...(typeof published === "boolean" ? { published } : {}),
    },
  });

  return NextResponse.json(updated);
}

// ---- DELETE /api/articles/[id]
export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }  // ⬅️ Promise
) {
  const { id } = await ctx.params;          // ⬅️ await dulu
  const auth = verify((await (_req as any).cookies)?.get?.("token")?.value ?? "");
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.article.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });      // 204 No Content
}
