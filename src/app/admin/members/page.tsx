"use client";
import useSWR from "swr";
const fetcher = (u: string) => fetch(u).then(r => r.json());

function toList<T = any>(v: any): T[] {
  if (Array.isArray(v)) return v as T[];
  if (Array.isArray(v?.data)) return v.data as T[];
  if (Array.isArray(v?.items)) return v.items as T[];
  if (Array.isArray(v?.results)) return v.results as T[];
  return [];
}

export default function MembersList() {
  const { data, mutate } = useSWR("/api/members", fetcher);
  const list = toList<any>(data);

  async function remove(id: string) {
    if (!confirm("Hapus member ini?")) return;
    const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
    if (res.ok) mutate();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Members</h1>
        <a href="/admin/members/new" className="rounded-lg border px-3 py-2 text-sm">+ Baru</a>
      </div>

      <div className="mt-4 divide-y rounded-xl border">
        {list.map((m: any) => (
          <div key={m.id} className="flex items-center justify-between gap-3 p-4">
            <div>
              <div className="font-medium">{m.name}</div>
              <div className="text-sm text-neutral-500">{m.email ?? "-"} • {m.status}</div>
            </div>
            <div className="flex items-center gap-2">
              <a href={`/admin/members/${m.id}`} className="text-sm underline">Edit</a>
              <button onClick={() => remove(m.id)} className="text-sm text-red-600">Hapus</button>
            </div>
          </div>
        ))}

        {!list.length && <div className="p-4 text-sm text-neutral-500">Belum ada data.</div>}
      </div>
    </div>
  );
}
