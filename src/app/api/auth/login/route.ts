import { NextResponse } from "next/server";
import { login } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const res = await login(parsed.data.email, parsed.data.password);
  if (!res) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const r = NextResponse.json({ user: res.user });
  r.cookies.set("token", res.token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 3,
  });
  return r;
}