import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { verify } from "../../../lib/auth";
import { z } from "zod";
import slugify from "slugify";

const schema = z.object({
    title: z.string().min(3),
    content: z.string().min(10),
    coverUrl: z.string().url().optional(),
    published: z.boolean().optional()
});

export async function GET() {
    const data = await db.article.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(data);
}

export async function POST(req: Request) {
    const auth = verify((await (req as any).cookies)?.get?.("token")?.value ?? "");
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });

    const slug = slugify(parsed.data.title, { lower: true, strict: true });
    const created = await db.article.create({
        data: {
            ...parsed.data,
            slug,
            authorId: auth.sub,
            published: parsed.data.published ?? false,
        },
    });
    return NextResponse.json(created, { status: 201 });
}