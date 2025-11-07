"use client";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
const fetcher = (u: string) => fetch(u).then(r => r.json());

export default function EditMember() {
  const { id } = useParams<{ id: string }>();
  const r = useRouter();
  const { data } = useSWR(`/api/members/${id}`, fetcher);
  const [loading, setLoading] = useState(false);

  if (!data) return <div>Memuat…</div>;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const f = new FormData(e.currentTarget);
    const payload = {
      name: String(f.get("name") || data.name),
      email: String(f.get("email") || "") || null,
      phone: String(f.get("phone") || "") || null,
      status: String(f.get("status") || data.status),
      notes: String(f.get("notes") || "") || null,
    };
    const res = await fetch(`/api/members/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (res.ok) r.push("/admin/members");
    else alert("Gagal memperbarui");
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <h1 className="text-xl font-semibold">Edit Member</h1>
      <input name="name" defaultValue={data.name} className="rounded-lg border px-3 py-2" />
      <div className="grid gap-3 md:grid-cols-2">
        <input name="email" defaultValue={data.email ?? ""} className="rounded-lg border px-3 py-2" />
        <input name="phone" defaultValue={data.phone ?? ""} className="rounded-lg border px-3 py-2" />
      </div>
      <select name="status" defaultValue={data.status} className="rounded-lg border px-3 py-2">
        <option value="active">active</option>
        <option value="inactive">inactive</option>
      </select>
      <textarea name="notes" defaultValue={data.notes ?? ""} rows={5} className="rounded-lg border px-3 py-2" />
      <button disabled={loading} className="w-fit rounded-lg bg-black px-4 py-2 text-sm text-white">
        {loading ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}
