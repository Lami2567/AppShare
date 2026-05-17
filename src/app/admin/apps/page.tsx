"use client";

import { ImagePlus, Pencil, Plus, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { Button } from "@/components/button";
import { formatDate } from "@/lib/format";
import type { AppRecord } from "@/lib/types";

export default function AppsAdminPage() {
  const [apps, setApps] = useState<AppRecord[]>([]);
  const [editing, setEditing] = useState<AppRecord | null>(null);
  const [iconName, setIconName] = useState("");
  const [status, setStatus] = useState("");

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
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setStatus("");

    try {
      let iconUrl = editing?.icon_url ?? null;
      const iconFile = form.get("iconFile");

      if (iconFile instanceof File && iconFile.size > 0) {
        setStatus("Uploading icon");
        const iconForm = new FormData();
        iconForm.append("file", iconFile);
        const iconRes = await fetch("/api/upload-icon", {
          method: "POST",
          body: iconForm
        });

        if (!iconRes.ok) {
          const error = await iconRes.json().catch(() => null);
          setStatus(error?.error ?? "Icon upload failed.");
          return;
        }

        const iconData = await iconRes.json();
        iconUrl = iconData.url;
      }

      const payload = {
        name: form.get("name"),
        description: form.get("description"),
        iconUrl
      };
      setStatus(editing ? "Saving app" : "Creating app");
      const res = await fetch(editing ? `/api/apps/${editing.id}` : "/api/apps", {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        setStatus(error?.error ?? "App could not be saved.");
        return;
      }

      formElement.reset();
      setEditing(null);
      setIconName("");
      setStatus("");
      load();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "App could not be saved.");
    }
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
          App Icon
          <span className="mt-2 flex cursor-pointer items-center gap-3 rounded-lg border border-violet-200 bg-violet-50/60 p-3 transition hover:border-violet-400">
            <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-violet-600 text-sm font-bold text-white">
              {editing?.icon_url ? <img src={editing.icon_url} alt="" className="size-full object-cover" /> : <ImagePlus className="size-6" />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold text-violet-950">{iconName || (editing?.icon_url ? "Current icon selected" : "Select an icon file")}</span>
              <span className="mt-1 block text-xs font-semibold text-slate-500">PNG, JPG, or WebP up to 2 MB</span>
            </span>
            <span className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-violet-700 shadow-sm">Choose</span>
          </span>
          <input
            name="iconFile"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={(event) => setIconName(event.target.files?.[0]?.name ?? "")}
          />
        </label>
        {status ? <p className="mt-3 rounded-lg bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700">{status}</p> : null}
        <Button className="mt-5 w-full">{editing ? "Save Changes" : "Create App"}</Button>
      </form>
      <section className="overflow-hidden rounded-xl border border-violet-100 bg-white shadow-sm">
        <div className="border-b border-violet-100 p-5">
          <h2 className="text-xl font-bold text-violet-950">Apps</h2>
        </div>
        <div className="divide-y divide-violet-50">
          {apps.map((app) => (
            <div key={app.id} className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
              <div className="flex gap-4">
                <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-violet-600 text-sm font-bold text-white">
                  {app.icon_url ? <img src={app.icon_url} alt="" className="size-full object-cover" /> : app.name.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <p className="font-bold text-violet-950">{app.name}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">{app.description}</p>
                  <p className="mt-2 text-xs font-semibold text-slate-500">Updated {formatDate(app.updated_at)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="secondary" onClick={() => { setEditing(app); setIconName(""); setStatus(""); }}>
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
