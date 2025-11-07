"use client";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const fetcher = (u: string) => fetch(u).then(r => r.json());

export default function EditArticle() {
  const { id } = useParams<{ id: string }>();
  const r = useRouter();
  const { data } = useSWR(`/api/articles/${id}`, fetcher);
  const [cover, setCover] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (data?.coverUrl) setCover(data.coverUrl); }, [data]);

  async function onUpload(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json();
    setCover(json.url);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const f = new FormData(e.currentTarget);
    const payload: any = {
      title: String(f.get("title")),
      content: String(f.get("content")),
      coverUrl: cover ?? undefined,
      published: Boolean(f.get("published")),
    };
    const res = await fetch(`/api/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (res.ok) r.push("/admin/articles");
    else alert("Gagal memperbarui");
  }

  if (!data) return <div>Memuat…</div>;

  return (
    <form onSubmit={submit} className="grid gap-4">
      <h1 className="text-xl font-semibold">Edit Artikel</h1>

      <input name="title" defaultValue={data.title} required className="rounded-lg border px-3 py-2" />
      <textarea name="content" defaultValue={data.content} required rows={10} className="rounded-lg border px-3 py-2" />

      <div className="grid gap-2">
        <label className="text-sm">Cover</label>
        {cover && <img src={cover} className="h-40 w-72 rounded-lg border object-cover" />}
        <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && onUpload(e.target.files[0])} />
      </div>

      <label className="inline-flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={data.published} /> Published
      </label>

      <button disabled={loading} className="w-fit rounded-lg bg-black px-4 py-2 text-sm text-white">
        {loading ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </form>
  );
}
