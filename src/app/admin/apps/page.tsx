"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { Button } from "@/components/button";
import { formatDate } from "@/lib/format";
import type { AppRecord } from "@/lib/types";

export default function AppsAdminPage() {
  const [apps, setApps] = useState<AppRecord[]>([]);
  const [editing, setEditing] = useState<AppRecord | null>(null);

  async function load() {
    const res = await fetch("/api/apps", { cache: "no-store" });
    const data = await res.json();
    setApps(data.apps ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: form.get("name"),
      description: form.get("description"),
      iconUrl: form.get("iconUrl")
    };
    await fetch(editing ? `/api/apps/${editing.id}` : "/api/apps", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    event.currentTarget.reset();
    setEditing(null);
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/apps/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <AdminShell>
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <form key={editing?.id ?? "new"} onSubmit={submit} className="h-fit rounded-xl border border-violet-100 bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-xl font-bold text-violet-950">
          <Plus className="size-5" />
          {editing ? "Edit App" : "Create App"}
        </h2>
        <label className="mt-5 block text-sm font-semibold">
          Name
          <input name="name" defaultValue={editing?.name ?? ""} required className="focus-ring mt-2 w-full rounded-lg border border-violet-200 px-3 py-2.5" />
        </label>
        <label className="mt-4 block text-sm font-semibold">
          Description
          <textarea name="description" defaultValue={editing?.description ?? ""} rows={5} className="focus-ring mt-2 w-full rounded-lg border border-violet-200 px-3 py-2.5" />
        </label>
        <label className="mt-4 block text-sm font-semibold">
          Icon URL
          <input name="iconUrl" defaultValue={editing?.icon_url ?? ""} className="focus-ring mt-2 w-full rounded-lg border border-violet-200 px-3 py-2.5" />
        </label>
        <Button className="mt-5 w-full">{editing ? "Save Changes" : "Create App"}</Button>
      </form>
      <section className="overflow-hidden rounded-xl border border-violet-100 bg-white shadow-sm">
        <div className="border-b border-violet-100 p-5">
          <h2 className="text-xl font-bold text-violet-950">Apps</h2>
        </div>
        <div className="divide-y divide-violet-50">
          {apps.map((app) => (
            <div key={app.id} className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="font-bold text-violet-950">{app.name}</p>
                <p className="mt-1 line-clamp-2 text-sm text-slate-600">{app.description}</p>
                <p className="mt-2 text-xs font-semibold text-slate-500">Updated {formatDate(app.updated_at)}</p>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={() => setEditing(app)}>
                  <Pencil className="size-4" />
                  Edit
                </Button>
                <Button type="button" variant="danger" onClick={() => remove(app.id)}>
                  <Trash2 className="size-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
    </AdminShell>
  );
}
