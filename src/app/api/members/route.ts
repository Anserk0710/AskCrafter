import { NextResponse } from "next/server";
import { db } from "@/src/lib/db";
import { verify } from "@/lib/auth";
import { z } from "zod";
import bcrypt from "bcrypt";

// Buat member baru (user baru). Hanya ADMIN.
const createSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6, "Password harus minimal 6 karakter"),
  role: z.enum(["ADMIN", "EDITOR", "USER"]).default("EDITOR"),
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
    return { error: "Access denied, Anda bukan Admin", status: 403 as const, auth, me };
  }

  return { error: null, status: 200 as const, auth, me };
}

// GET /api/members
// List semua user (atau filter sesuai kebutuhan). ADMIN only.
export async function GET(req: Request) {
  const check = await requireAdmin(req);
  if (check.error) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return NextResponse.json(users);
}

// POST /api/members
// Buat user/member baru. Hanya ADMIN.
export async function POST(req: Request) {
  const check = await requireAdmin(req);
  if (check.error) return NextResponse.json({ error: check.error }, { status: check.status });

  const json = await req.json();
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  const { name, email, role, password } = parsed.data;
  const hashed = await bcrypt.hash(password, 10);

  try {
    const created = await db.user.create({
      data: { name, email, role, password: hashed },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    // unik email
    if (e?.code === "P2002") {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }
    throw e;
  }
}