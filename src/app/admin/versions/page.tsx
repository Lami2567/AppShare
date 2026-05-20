"use client";

import { Layers3, LockKeyhole, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { formatBytes, formatDate } from "@/lib/format";
import type { AppDetail, AppRecord } from "@/lib/types";

export default function VersionsPage() {
  const [apps, setApps] = useState<AppRecord[]>([]);
  const [details, setDetails] = useState<AppDetail[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    fetch("/api/apps", { cache: "no-store" })
      .then((res) => res.json())
      .then(async (data) => {
        const list = data.apps ?? [];
        setApps(list);
        const loaded = await Promise.all(
          list.map((app: AppRecord) => fetch(`/api/apps/${app.id}`).then((res) => res.json()).then((body) => body.app))
        );
        setDetails(loaded.filter(Boolean));
      });
  }

  async function removeVersion(id: string) {
    await fetch(`/api/versions/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <AdminShell>
    <section className="rounded-xl border border-violet-100 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-violet-100 p-5">
        <Layers3 className="size-5 text-violet-600" />
        <h2 className="text-xl font-bold text-violet-950">Upload History</h2>
      </div>
      <div className="divide-y divide-violet-50">
        {details.flatMap((app) =>
          app.versions.map((version) => (
            <div key={version.id} className="grid gap-3 p-5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="font-bold text-violet-950">{app.name} - {version.version_name}</p>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  <span>{formatDate(version.created_at)} - {formatBytes(version.file_size)}</span>
                  {version.has_download_password ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-1 text-xs font-bold text-violet-700">
                      <LockKeyhole className="size-3" />
                      Protected
                    </span>
                  ) : null}
                </p>
              </div>
              <div className="flex gap-2">
                <a href={`/api/downloads/${version.id}`} className="rounded-lg border border-violet-200 px-3 py-2 text-center text-sm font-semibold text-violet-900">Download</a>
                <button onClick={() => removeVersion(version.id)} className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white">
                  <Trash2 className="size-4" />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
        {!apps.length ? <p className="p-5 text-slate-600">No upload history yet.</p> : null}
      </div>
    </section>
    </AdminShell>
  );
}
