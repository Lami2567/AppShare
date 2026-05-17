"use client";

import { Boxes, CloudUpload, Layers3 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { MetricCard } from "@/components/metric-card";
import { formatDate } from "@/lib/format";
import type { AppRecord } from "@/lib/types";

export default function AdminDashboard() {
  const [apps, setApps] = useState<AppRecord[]>([]);

  useEffect(() => {
    fetch("/api/apps", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setApps(data.apps ?? []));
  }, []);

  const versionCount = useMemo(() => apps.reduce((sum, app) => sum + (app.version_count ?? 0), 0), [apps]);

  return (
    <AdminShell>
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Published Apps" value={apps.length} icon={Boxes} />
        <MetricCard label="Total Versions" value={versionCount} icon={Layers3} />
        <MetricCard label="Upload Target" value="R2" icon={CloudUpload} />
      </div>
      <section className="mt-8 rounded-xl border border-violet-100 bg-white shadow-sm">
        <div className="border-b border-violet-100 p-5">
          <h2 className="text-xl font-bold text-violet-950">Recent Apps</h2>
        </div>
        <div className="divide-y divide-violet-50">
          {apps.slice(0, 6).map((app) => (
            <div key={app.id} className="grid gap-3 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="font-bold text-violet-950">{app.name}</p>
                <p className="mt-1 text-sm text-slate-500">{app.current_version ?? "No version"} · Updated {formatDate(app.updated_at)}</p>
              </div>
              <span className="rounded-lg bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700">{app.version_count ?? 0} versions</span>
            </div>
          ))}
          {!apps.length ? <p className="p-5 text-slate-600">No apps yet. Create one from the Apps section.</p> : null}
        </div>
      </section>
    </AdminShell>
  );
}
