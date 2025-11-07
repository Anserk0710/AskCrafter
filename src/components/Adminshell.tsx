"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/members", label: "Members" },
    { href: "/admin/articles", label: "Artikel" },
    { href: "/admin/media", label: "Media" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    return (
        <div className="min-h-screen">
        <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
            <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
            <div className="font-semibold">Admin • FurniCraft</div>
            <nav className="flex items-center gap-5 text-sm">
                {NAV.map(n => (
                <Link key={n.href} href={n.href} className={pathname.startsWith(n.href) ? "font-medium" : "text-neutral-600 hover:text-black"}>
                    {n.label}
                </Link>
                ))}
            </nav>
            </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </div>
    );
}