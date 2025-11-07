"use client";

import useSWR from "swr";
import { useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  Image as ImageIcon,
  Users,
  Rocket,
  LogOut,
  Eye,
  PenSquare,
} from "lucide-react";

const fetcher = (u: string) => fetch(u, { cache: "no-store" }).then((r) => r.json());

function toList<T = any>(v: any): T[] {
  if (Array.isArray(v)) return v as T[];
  if (Array.isArray(v?.data)) return v.data as T[];
  if (Array.isArray(v?.items)) return v.items as T[];
  if (Array.isArray(v?.results)) return v.results as T[];
  return [];
}

export default function AdminHome() {
  const { data: articlesRaw } = useSWR("/api/articles", fetcher);
  const { data: membersRaw } = useSWR("/api/members", fetcher);
  const { data: mediaRaw } = useSWR("/api/media", fetcher);

  const articles = toList<any>(articlesRaw);
  const members = toList<any>(membersRaw);
  const media = toList<any>(mediaRaw);

  const publishedCount = useMemo(
    () => articles.filter((a: any) => !!a?.published).length,
    [articles]
  );

  const publishRate = useMemo(() => {
    const total = articles.length || 1;
    return Math.round((publishedCount / total) * 100);
  }, [articles.length, publishedCount]);

  async function onLogout() {
    try {
      const r = await fetch("/api/auth/logout", { method: "POST" });
      if (!r.ok) throw new Error("Logout gagal");
    } catch {
      // ignore
    } finally {
      window.location.href = "/login";
    }
  }

  return (
    <div className="relative">
      <style>{`
        :root{
          --ink:#0f0f0f;
          --muted:#6b6b6b;
          --line:rgba(15,15,15,.12);
          --card:#ffffff;
          --sheet:#faf9f6;
          --accent:#d2a456;
        }
      `}</style>

      {/* Decorative gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-80 w-[720px] -translate-x-1/2 rounded-[48px] bg-[radial-gradient(60%_60%_at_50%_50%,rgba(210,164,86,0.18),rgba(210,164,86,0)_70%)] blur-2xl" />
      </div>

      {/* Page container */}
      <div className="space-y-8">
        {/* Header */}
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)]/70 px-5 py-5 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-3 py-1 text-xs text-[var(--muted)]">
                Panel Admin • AskCraft
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)]">
                Selamat datang kembali
              </h1>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Kelola artikel, media, dan pengguna dalam satu tempat.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm text-[var(--ink)] hover:bg-neutral-50"
              >
                <Eye className="h-4 w-4" />
                Lihat Situs
              </Link>
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--ink)] px-3 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <KpiCard
            icon={<FileText className="h-5 w-5" />}
            label="Artikel"
            value={articles.length}
            hint="Total artikel"
          />
          <KpiCard
            icon={<Rocket className="h-5 w-5" />}
            label="Published"
            value={publishedCount}
            hint={`${publishRate}% publish rate`}
            progress={publishRate}
          />
          <KpiCard
            icon={<ImageIcon className="h-5 w-5" />}
            label="Media"
            value={media.length}
            hint="Gambar/Video"
          />
          <KpiCard
            icon={<Users className="h-5 w-5" />}
            label="Users"
            value={members.length}
            hint="ADMIN/EDITOR/USER"
          />
        </div>

        {/* Quick actions */}
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-medium text-[var(--ink)]">Aksi Cepat</div>
              <p className="text-xs text-[var(--muted)]">
                Tambah konten baru atau kelola aset dengan cepat
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/admin/articles/new"
                className="rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm hover:bg-neutral-50"
              >
                + Artikel Baru
              </Link>
              <Link
                href="/admin/media"
                className="rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm hover:bg-neutral-50"
              >
                + Tambah Media
              </Link>
              <Link
                href="/admin/members/new"
                className="rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm hover:bg-neutral-50"
              >
                + User Baru
              </Link>
            </div>
          </div>
        </div>

        {/* Lists */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Articles */}
          <ListCard
            title="Artikel Terbaru"
            action={{ href: "/admin/articles", label: "Lihat semua" }}
          >
            {articles.slice(0, 6).map((a: any) => (
              <RowItem
                key={a.id}
                title={a.title}
                subtitle={`${a.slug ?? a.id} • ${a.published ? "Published" : "Draft"}`}
                actionHref={`/admin/articles/${a.id}`}
                actionLabel="Edit"
              />
            ))}
            {!articles.length && (
              <EmptyRow text="Belum ada artikel." />
            )}
          </ListCard>

          {/* Users */}
          <ListCard title="Users Terbaru" action={{ href: "/admin/members", label: "Kelola" }}>
            {members.slice(0, 6).map((m: any) => (
              <RowItem
                key={m.id}
                title={m.name}
                subtitle={`${m.email ?? "-"} • ${m.role ?? "USER"}`}
                actionHref={`/admin/members/${m.id}`}
                actionLabel="Edit"
              />
            ))}
            {!members.length && (
              <EmptyRow text="Belum ada user." />
            )}
          </ListCard>

          {/* Media */}
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)]">
            <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
              <h2 className="font-semibold text-[var(--ink)]">Media Terbaru</h2>
              <Link
                href="/admin/media"
                className="text-sm text-[var(--muted)] underline-offset-4 hover:text-[var(--ink)] hover:underline"
              >
                Kelola
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-2 p-5">
              {media.slice(0, 6).map((m: any) => (
                <div key={m.id} className="aspect-video overflow-hidden rounded-xl border border-[var(--line)]">
                  {m.type === "video" ? (
                    <video src={m.url} className="h-full w-full object-cover" />
                  ) : (
                    <img src={m.url} className="h-full w-full object-cover" />
                  )}
                </div>
              ))}
              {!media.length && (
                <div className="col-span-full rounded-xl border border-[var(--line)] bg-white p-4 text-sm text-[var(--muted)]">
                  Belum ada media.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer mini */}
        <div className="pb-2 text-center text-xs text-[var(--muted)]">
          © {new Date().getFullYear()} AskCraft • Admin Dashboard
        </div>
      </div>
    </div>
  );
}

/* ========== Reusable UI bits ========== */

function KpiCard({
  icon,
  label,
  value,
  hint,
  progress,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  hint?: string;
  progress?: number; // 0-100
}) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--line)] bg-white">
          {icon}
        </div>
        {typeof progress === "number" && (
          <div className="w-24">
            <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200">
              <div
                className="h-full bg-[var(--accent)]"
                style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight text-[var(--ink)]">{value}</div>
      <div className="text-sm text-[var(--muted)]">{label}</div>
      {hint && <div className="mt-1 text-xs text-[var(--muted)]">{hint}</div>}
    </div>
  );
}

function ListCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)]">
      <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
        <h2 className="font-semibold text-[var(--ink)]">{title}</h2>
        {action && (
          <Link
            href={action.href}
            className="text-sm text-[var(--muted)] underline-offset-4 hover:text-[var(--ink)] hover:underline"
          >
            {action.label}
          </Link>
        )}
      </div>
      <ul className="divide-y divide-[var(--line)]">{children}</ul>
    </div>
  );
}

function RowItem({
  title,
  subtitle,
  actionHref,
  actionLabel = "Edit",
}: {
  title: string;
  subtitle?: string;
  actionHref: string;
  actionLabel?: string;
}) {
  return (
    <li className="flex items-center justify-between gap-3 px-5 py-4">
      <div className="min-w-0">
        <div className="truncate font-medium text-[var(--ink)]">{title}</div>
        {subtitle && <div className="truncate text-xs text-[var(--muted)]">{subtitle}</div>}
      </div>
      <Link
        href={actionHref}
        className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 py-1.5 text-xs hover:bg-neutral-50"
      >
        <PenSquare className="h-3.5 w-3.5" />
        {actionLabel}
      </Link>
    </li>
  );
}

function EmptyRow({ text }: { text: string }) {
  return <li className="px-5 py-6 text-sm text-[var(--muted)]">{text}</li>;
}
