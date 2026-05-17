"use client";

import { ArrowDownToLine, Calendar, Layers } from "lucide-react";
import Link from "next/link";
import type { AppRecord } from "@/lib/types";
import { formatDate } from "@/lib/format";

export function AppCard({ app }: { app: AppRecord }) {
  return (
    <article className="glass-panel flex h-full flex-col rounded-xl p-5">
      <div className="flex items-start gap-4">
        <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-lg font-bold text-white shadow-lg shadow-violet-600/20">
          {app.icon_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={app.icon_url} alt="" className="size-full rounded-xl object-cover" />
          ) : (
            app.name.slice(0, 2).toUpperCase()
          )}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold text-violet-950">{app.name}</h3>
          <p className="mt-1 flex items-center gap-2 text-sm text-violet-700">
            <Layers className="size-4" />
            {app.current_version ?? "No release yet"}
          </p>
        </div>
      </div>
      <p className="mt-4 line-clamp-3 flex-1 text-sm leading-6 text-slate-600">{app.description}</p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-violet-100 pt-4">
        <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
          <Calendar className="size-4" />
          {formatDate(app.updated_at)}
        </span>
        <Link
          href={`/apps/${app.id}`}
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
        >
          <ArrowDownToLine className="size-4" />
          Download
        </Link>
      </div>
    </article>
  );
}
