"use client";

import { ArrowDownToLine, ChevronLeft, Clock, FileArchive, LockKeyhole, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { PublicShell } from "@/components/public-shell";
import { formatBytes, formatDate } from "@/lib/format";
import type { AppDetail, AppVersion } from "@/lib/types";

export default function AppDetailPage() {
  const params = useParams<{ id: string }>();
  const [app, setApp] = useState<AppDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordVersion, setPasswordVersion] = useState<AppVersion | null>(null);
  const [password, setPassword] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetch(`/api/apps/${params.id}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setApp(data?.app ?? null))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!passwordVersion) {
      return;
    }

    setDownloading(true);
    setDownloadError("");
    try {
      const res = await fetch(`/api/downloads/${passwordVersion.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.url) {
        setDownloadError(body?.error ?? "Download could not be unlocked.");
        return;
      }

      window.location.href = body.url;
      setPasswordVersion(null);
      setPassword("");
    } finally {
      setDownloading(false);
    }
  }

  function closePasswordDialog() {
    setPasswordVersion(null);
    setPassword("");
    setDownloadError("");
  }

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
                      {version.has_download_password ? (
                        <button
                          type="button"
                          onClick={() => {
                            setPasswordVersion(version);
                            setDownloadError("");
                          }}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold text-white hover:bg-violet-700"
                        >
                          <LockKeyhole className="size-4" />
                          Download
                        </button>
                      ) : (
                        <a href={version.file_url ?? `/api/downloads/${version.id}`} className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold text-white hover:bg-violet-700">
                          <ArrowDownToLine className="size-4" />
                          Download
                        </a>
                      )}
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
        {passwordVersion ? (
          <div className="fixed inset-0 z-50 grid place-items-center bg-violet-950/40 px-4">
            <form onSubmit={submitPassword} className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-violet-500">Protected Download</p>
                  <h2 className="mt-1 text-xl font-bold text-violet-950">{passwordVersion.version_name}</h2>
                </div>
                <button type="button" onClick={closePasswordDialog} className="rounded-lg p-2 text-slate-500 hover:bg-violet-50 hover:text-violet-800">
                  <X className="size-5" />
                </button>
              </div>
              <label className="mt-5 block text-sm font-semibold text-violet-950">
                Password
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  required
                  autoFocus
                  className="focus-ring mt-2 w-full rounded-lg border border-violet-200 px-3 py-2.5"
                />
              </label>
              {downloadError ? <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{downloadError}</p> : null}
              <button type="submit" disabled={downloading} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-70">
                <ArrowDownToLine className="size-4" />
                {downloading ? "Checking" : "Download"}
              </button>
            </form>
          </div>
        ) : null}
      </section>
    </PublicShell>
  );
}
