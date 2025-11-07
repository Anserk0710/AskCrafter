'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff, LogIn, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const q = useSearchParams();
  const nextUrl = useMemo(() => q.get('next') || '/admin', [q]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setErr(null);
  }, [email, password]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setErr(null);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (res.ok) {
      window.location.href = nextUrl;
      return;
    }

    const j = await res.json().catch(() => ({}));
    setErr(j?.error || 'Email atau password salah.');
  }

  return (
    <div className="min-h-screen bg-[var(--bg,#0b0b0b)] text-[var(--fg,#111)]">
      <style>{`
        :root{
          --paper:#f7f5f2;
          --ink:#0f0f0f;
          --muted:#6b6b6b;
          --line:rgba(15,15,15,.12);
          --accent:#d2a456;
        }
      `}</style>

      <div className="grid min-h-screen md:grid-cols-2">
        {/* Left: Form */}
        <div className="flex items-center justify-center bg-[var(--paper)] p-6">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-xl bg-[var(--ink)]" />
                <div className="text-lg font-semibold tracking-tight text-[var(--ink)]">AskCraft Furniture</div>
              </div>
              <h1 className="mt-6 text-2xl font-semibold text-[var(--ink)]">Masuk Admin</h1>
              <p className="mt-1 text-sm text-[var(--muted)]">Gunakan akun dengan role <span className="font-medium">ADMIN</span> atau <span className="font-medium">EDITOR</span>.</p>
            </div>

            {err && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {err}
              </div>
            )}

            <form onSubmit={onSubmit} className="grid gap-4">
              <label className="text-sm text-[var(--ink)]">
                Email
                <div className="mt-1 flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3">
                  <Mail className="h-4 w-4 text-[var(--muted)]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="h-11 w-full bg-transparent text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
                  />
                </div>
              </label>

              <label className="text-sm text-[var(--ink)]">
                Password
                <div className="mt-1 flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3">
                  <Lock className="h-4 w-4 text-[var(--muted)]" />
                  <input
                    type={show ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 w-full bg-transparent text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="rounded-md p-1 text-[var(--muted)] hover:bg-neutral-100"
                    aria-label={show ? 'Sembunyikan password' : 'Lihat password'}
                  >
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--ink)] px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                <LogIn className="h-4 w-4" />
                {loading ? 'Memproses…' : 'Masuk'}
              </button>

              <p className="mt-1 text-center text-xs text-[var(--muted)]">
                Setelah masuk, Anda akan diarahkan ke <span className="font-medium">{nextUrl}</span>.
              </p>
            </form>

            <div className="mt-8 space-y-2 rounded-xl border border-[var(--line)] bg-white p-4 text-xs text-[var(--muted)]">
              <div className="font-medium text-[var(--ink)]">Catatan</div>
              <ul className="list-inside list-disc space-y-1">
                <li>Pastikan variabel <code className="rounded bg-neutral-100 px-1">JWT_SECRET</code> sudah di-set.</li>
                <li>Hanya role <span className="font-medium">ADMIN</span> / <span className="font-medium">EDITOR</span> yang bisa akses /admin.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Visual */}
        <div className="relative hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1503602642458-232111445657?q=80&w=2070&auto=format&fit=crop"
            alt="Showroom"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-black/30 to-transparent" />
          <div className="relative z-10 flex h-full items-end p-10 text-white">
            <div className="max-w-md">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur">
                Premium • Custom • Garansi
              </div>
              <h2 className="mt-3 text-3xl font-semibold leading-snug">Panel Admin AskCraft</h2>
              <p className="mt-2 text-sm text-white/80">Kelola artikel, media, dan pengguna dalam satu tempat dengan workflow yang lebih rapi.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
