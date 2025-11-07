"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewMember() {
  const r = useRouter();
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const f = new FormData(e.currentTarget);
    const payload = {
      name: String(f.get("name")),
      email: String(f.get("email") || "") || undefined,
      phone: String(f.get("phone") || "") || undefined,
      status: String(f.get("status") || "active"),
      notes: String(f.get("notes") || "") || undefined,
    };
    const res = await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (res.ok) r.push("/admin/members");
    else alert("Gagal menyimpan");
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <h1 className="text-xl font-semibold">Member Baru</h1>
      <input name="name" required placeholder="Nama" className="rounded-lg border px-3 py-2" />
      <div className="grid gap-3 md:grid-cols-2">
        <input name="email" placeholder="Email" className="rounded-lg border px-3 py-2" />
        <input name="phone" placeholder="Telepon" className="rounded-lg border px-3 py-2" />
      </div>
      <select name="status" className="rounded-lg border px-3 py-2">
        <option value="active">active</option>
        <option value="inactive">inactive</option>
      </select>
      <textarea name="notes" rows={5} placeholder="Catatan" className="rounded-lg border px-3 py-2" />
      <button disabled={loading} className="w-fit rounded-lg bg-black px-4 py-2 text-sm text-white">
        {loading ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}
