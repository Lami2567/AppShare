"use client";

import { LockKeyhole, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/button";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") })
    });
    setLoading(false);
    if (!res.ok) {
      setError("Invalid admin credentials.");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <form onSubmit={submit} className="glass-panel w-full max-w-md rounded-2xl p-8">
        <div className="grid size-12 place-items-center rounded-xl bg-violet-600 text-white">
          <LockKeyhole className="size-6" />
        </div>
        <h1 className="mt-5 text-3xl font-bold text-violet-950">Admin Login</h1>
        <p className="mt-2 text-slate-600">Sign in to publish builds and manage app metadata.</p>
        <label className="mt-6 block text-sm font-semibold text-violet-950">
          Email
          <input name="email" type="email" required className="focus-ring mt-2 w-full rounded-lg border border-violet-200 bg-white px-3 py-2.5" />
        </label>
        <label className="mt-4 block text-sm font-semibold text-violet-950">
          Password
          <input name="password" type="password" required className="focus-ring mt-2 w-full rounded-lg border border-violet-200 bg-white px-3 py-2.5" />
        </label>
        {error ? <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{error}</p> : null}
        <Button disabled={loading} className="mt-6 w-full">
          <LogIn className="size-4" />
          {loading ? "Signing in" : "Sign In"}
        </Button>
      </form>
    </main>
  );
}
