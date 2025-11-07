import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "./db";

const SECRET = process.env.JWT_SECRET!;

export async function login(email: string, password: string) {
    const user = await db.user.findUnique({ where: { email} });
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return null;
    const token = jwt.sign(
        { sub: user.id, role: user.role },
        SECRET,
        { expiresIn: "15min" }
    );
    return { token, user: { id: user.id, role: user.role, email: user.email, name: user.name } };
}

export function verify(token?: string) {
    try {
        if (!token) return null;
        return jwt.verify(token, SECRET) as { sub: string; role: "ADMIN" | "EDITOR" };
    } catch { return null; }
}