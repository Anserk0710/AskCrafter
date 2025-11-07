// src/app/api/members/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { verify } from "@/lib/auth";
import { z } from "zod";
import bcrypt from "bcrypt";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  role: z.enum(["ADMIN", "EDITOR", "USER"]).optional(),
  password: z.string().min(6, "Password harus minimal 6 karakter").optional(),
});

async function requireAdmin(req: Request) {
  const token = (await (req as any).cookies)?.get?.("token")?.value ?? "";
  const auth = verify(token);
  if (!auth) return { error: "Unauthorized", status: 401 as const, auth: null, me: null };

  const me = await db.user.findUnique({
    where: { id: auth.sub },
    select: { id: true, role: true },
  });

  if (!me || me.role !== "ADMIN") {
    return { error: "Forbidden", status: 403 as const, auth, me };
  }

  return { error: null, status: 200 as const, auth, me };
}

// GET /api/members/[id]
// Detail user. Hanya ADMIN.
export async function GET(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const check = await requireAdmin(req);
  if (check.error) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const check = await requireAdmin(req);
  if (check.error) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const json = await req.json();
  const parsed = updateSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }

  // 🔐 Siapkan payload aman & hash password jika ada
  const data: any = {};
  if (parsed.data.name) data.name = parsed.data.name;
  if (parsed.data.email) data.email = parsed.data.email;
  if (parsed.data.role) data.role = parsed.data.role;

  if (parsed.data.password) {
    const hashed = await bcrypt.hash(parsed.data.password, 10);
    data.password = hashed;
  }

  const updated = await db.user.update({
    where: { id },
    data,
    // ⚠️ jangan pernah expose password ke response
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return NextResponse.json(updated);
}

// DELETE /api/members/[id]
// Hapus user. Hanya ADMIN.
export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const check = await requireAdmin(req);
  if (check.error) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  await db.user.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}