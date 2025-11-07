"use client";
import useSWR from "swr";
import { useState } from "react";
const fetcher = (u: string) => fetch(u).then(r => r.json());

function toList<T = any>(v: any): T[] {
  if (Array.isArray(v)) return v as T[];
  if (Array.isArray(v?.data)) return v.data as T[];
  if (Array.isArray(v?.items)) return v.items as T[];
  if (Array.isArray(v?.results)) return v.results as T[];
  return [];
}

export default function MediaPage() {
  const { data, mutate } = useSWR("/api/media", fetcher);
  const list = toList<any>(data);

  const [busy, setBusy] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [type, setType] = useState<"image" | "video">("image");
  const [caption, setCaption] = useState("");

  async function uploadFile(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch("/api/upload", { method: "POST", body: fd });
    const j = await r.json();
    setUploadedUrl(j.url);
  }

  async function createMedia(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!uploadedUrl) { alert("Upload file dulu"); return; }
    setBusy(true);
    const res = await fetch("/api/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, url: uploadedUrl, caption: caption || undefined }),
    });
    setBusy(false);
    if (res.ok) {
      setUploadedUrl(null);
      setCaption("");
      mutate();
    } else {
      alert("Gagal menambah media");
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <section className="md:col-span-2 rounded-xl border p-5">
        <h1 className="text-lg font-semibold">Tambah Media</h1>
        <form onSubmit={createMedia} className="mt-3 grid gap-3">
          <select
            value={type}
            onChange={e => setType(e.target.value as any)}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="image">image</option>
            <option value="video">video</option>
          </select>

          <div className="grid gap-2">
            <input
              type="file"
              accept={type === "image" ? "image/*" : "video/*"}
              onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0])}
            />
            {uploadedUrl && (
              <div className="rounded-lg border p-2">
                {type === "video" ? (
                  <video src={uploadedUrl} className="h-36 w-full object-cover" />
                ) : (
                  <img src={uploadedUrl} className="h-36 w-full object-cover" />
                )}
                <div className="mt-1 text-xs text-neutral-600">{uploadedUrl}</div>
              </div>
            )}
          </div>

          <input
            value={caption}
            onChange={e => setCaption(e.target.value)}
            placeholder="Caption (opsional)"
            className="rounded-lg border px-3 py-2 text-sm"
          />

          <button disabled={busy} className="w-fit rounded-lg bg-black px-4 py-2 text-sm text-white">
            {busy ? "Menyimpan..." : "Tambah"}
          </button>
        </form>
      </section>

      <section className="md:col-span-3 rounded-xl border p-5">
        <h2 className="font-semibold">Daftar Media</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
          {list.map((m: any) => (
            <div key={m.id} className="rounded-lg border">
              {m.type === "video" ? (
                <video src={m.url} className="aspect-video w-full rounded-t-lg object-cover" />
              ) : (
                <img src={m.url} className="aspect-video w-full rounded-t-lg object-cover" />
              )}
              <div className="p-2 text-xs">
                <div className="truncate">{m.caption ?? "-"}</div>
                <div className="mt-1 truncate text-neutral-500">{m.url}</div>
              </div>
            </div>
          ))}
          {!list.length && (
            <div className="col-span-full text-sm text-neutral-500">Belum ada media.</div>
          )}
        </div>
      </section>
    </div>
  );
}
