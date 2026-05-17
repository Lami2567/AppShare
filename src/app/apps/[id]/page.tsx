"use client";

import { ArrowDownToLine, ChevronLeft, Clock, FileArchive } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PublicShell } from "@/components/public-shell";
import { formatBytes, formatDate } from "@/lib/format";
import type { AppDetail } from "@/lib/types";

export default function AppDetailPage() {
  const params = useParams<{ id: string }>();
  const [app, setApp] = useState<AppDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/apps/${params.id}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setApp(data?.app ?? null))
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <PublicShell>
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-violet-700">
          <ChevronLeft className="size-4" />
          Back to apps
        </Link>
        {loading ? (
          <div className="mt-8 h-96 animate-pulse rounded-xl bg-white/70" />
        ) : app ? (
          <div className="mt-8">
            <div className="glass-panel rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="grid size-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-2xl font-bold text-white shadow-lg shadow-violet-600/20">
                  {app.icon_url ? <img src={app.icon_url} alt="" className="size-full rounded-2xl object-cover" /> : app.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-500">App Details</p>
                  <h1 className="mt-2 text-4xl font-bold text-violet-950">{app.name}</h1>
                  <p className="mt-3 max-w-3xl text-slate-600">{app.description}</p>
                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-2 rounded-lg bg-violet-50 px-3 py-2 font-semibold text-violet-800">
                      <Clock className="size-4" />
                      Updated {formatDate(app.updated_at)}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-lg bg-violet-50 px-3 py-2 font-semibold text-violet-800">
                      <FileArchive className="size-4" />
                      {app.version_count ?? 0} versions
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-violet-950">Version History</h2>
              <div className="mt-4 overflow-hidden rounded-xl border border-violet-100 bg-white shadow-sm">
                {app.versions.length ? (
                  app.versions.map((version) => (
                    <div key={version.id} className="grid gap-4 border-b border-violet-50 p-5 last:border-0 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div>
                        <p className="font-bold text-violet-950">{version.version_name}</p>
                        <p className="mt-1 text-sm text-slate-500">{formatDate(version.created_at)} · {formatBytes(version.file_size)}</p>
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{version.changelog || "No changelog provided."}</p>
                      </div>
                      <a href={version.file_url} className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold text-white hover:bg-violet-700">
                        <ArrowDownToLine className="size-4" />
                        Download
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-slate-600">No versions have been published for this app.</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-xl bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-violet-950">App not found</h1>
          </div>
        )}
      </section>
    </PublicShell>
  );
}
