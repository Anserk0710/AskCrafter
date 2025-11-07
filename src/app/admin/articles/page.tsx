"use client";
import useSWR from "swr";
const fetcher = (u: string) => fetch(u).then(r => r.json());

export default function ArticlesList() {
  const { data, mutate } = useSWR("/api/articles", fetcher);

  async function remove(id: string) {
    if (!confirm("Hapus artikel ini?")) return;
    const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
    if (res.ok) mutate();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Artikel</h1>
        <a href="/admin/articles/new" className="rounded-lg border px-3 py-2 text-sm">+ Baru</a>
      </div>
      <div className="mt-4 divide-y rounded-xl border">
        {(data ?? []).map((a: any) => (
          <div key={a.id} className="flex items-center justify-between gap-3 p-4">
            <div>
              <div className="font-medium">{a.title}</div>
              <div className="text-sm text-neutral-500">{a.slug} • {a.published ? "Published" : "Draft"}</div>
            </div>
            <div className="flex items-center gap-2">
              <a href={`/admin/articles/${a.id}`} className="text-sm underline">Edit</a>
              <button onClick={() => remove(a.id)} className="text-sm text-red-600">Hapus</button>
            </div>
          </div>
        ))}
        {!data?.length && <div className="p-4 text-sm text-neutral-500">Belum ada artikel.</div>}
      </div>
    </div>
  );
}
