import { NextResponse } from "next/server";

export async function POST() {
    const r = NextResponse.json({ message: "Logged out" });
    r.cookies.set("token", "", { expires: new Date(0), path: "/" });
    return r;
}