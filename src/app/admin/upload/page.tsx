"use client";

import { CloudUpload, FileArchive } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin-shell";
import { Button } from "@/components/button";
import type { AppRecord } from "@/lib/types";

export default function UploadPage() {
  const [apps, setApps] = useState<AppRecord[]>([]);
  const [fileName, setFileName] = useState("");
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetch("/api/apps", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setApps(data.apps ?? []));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setStatus("Preparing upload");
    setProgress(12);
    try {
      const formData = new FormData(formElement);
      const file = formData.get("file");

      if (!(file instanceof File) || file.size === 0) {
        setProgress(0);
        setStatus("APK file is required.");
        return;
      }

      const uploadUrlRes = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId: formData.get("appId"),
          versionName: formData.get("versionName"),
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size
        })
      });
      const uploadUrlBody = await uploadUrlRes.json().catch(() => null);

      if (!uploadUrlRes.ok) {
        setProgress(0);
        setStatus(uploadUrlBody?.error ?? `Upload setup failed with status ${uploadUrlRes.status}.`);
        return;
      }

      setStatus("Uploading APK to storage");
      setProgress(45);
      const uploadRes = await fetch(uploadUrlBody.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": uploadUrlBody.contentType },
        body: file
      });

      if (!uploadRes.ok) {
        setProgress(0);
        setStatus(`Storage upload failed with status ${uploadRes.status}.`);
        return;
      }

      setStatus("Publishing version");
      setProgress(82);
      const completeRes = await fetch("/api/upload-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appId: formData.get("appId"),
          versionName: formData.get("versionName"),
          changelog: formData.get("changelog"),
          fileUrl: uploadUrlBody.fileUrl,
          fileKey: uploadUrlBody.key,
          fileSize: file.size
        })
      });
      const completeBody = await completeRes.json().catch(() => null);

      if (!completeRes.ok) {
        setProgress(0);
        setStatus(completeBody?.error ?? `Version could not be saved with status ${completeRes.status}.`);
        return;
      }

      setProgress(100);
      setStatus("Upload complete");
      formElement.reset();
      setFileName("");
    } catch (error) {
      setProgress(0);
      setStatus(error instanceof Error ? error.message : "Upload failed.");
    }
  }

  return (
    <AdminShell>
    <div className="mx-auto max-w-3xl">
      <form onSubmit={submit} className="rounded-xl border border-violet-100 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-violet-950">
          <CloudUpload className="size-6" />
          Upload APK
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold">
            App
            <select name="appId" required className="focus-ring mt-2 w-full rounded-lg border border-violet-200 bg-white px-3 py-2.5">
              <option value="">Select app</option>
              {apps.map((app) => (
                <option key={app.id} value={app.id}>{app.name}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Version Name
            <input name="versionName" required placeholder="1.0.0" className="focus-ring mt-2 w-full rounded-lg border border-violet-200 px-3 py-2.5" />
          </label>
        </div>
        <label className="mt-4 block text-sm font-semibold">
          Changelog
          <textarea name="changelog" rows={5} placeholder="Release notes" className="focus-ring mt-2 w-full rounded-lg border border-violet-200 px-3 py-2.5" />
        </label>
        <label className="mt-5 grid cursor-pointer place-items-center rounded-xl border-2 border-dashed border-violet-200 bg-violet-50/60 px-5 py-10 text-center transition hover:border-violet-400">
          <FileArchive className="size-10 text-violet-600" />
          <span className="mt-3 text-sm font-bold text-violet-950">{fileName || "Drop APK here or select a file"}</span>
          <span className="mt-1 text-xs font-semibold text-slate-500">APK files only</span>
          <input
            name="file"
            type="file"
            accept=".apk,application/vnd.android.package-archive"
            required
            className="sr-only"
            onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")}
          />
        </label>
        {progress > 0 ? (
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-violet-100">
            <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
        ) : null}
        {status ? <p className="mt-3 text-sm font-semibold text-violet-700">{status}</p> : null}
        <Button className="mt-6 w-full">
          <CloudUpload className="size-4" />
          Publish Version
        </Button>
      </form>
    </div>
    </AdminShell>
  );
}
