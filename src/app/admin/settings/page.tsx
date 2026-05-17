import { Database, KeyRound, Server, ShieldCheck } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";

const settings = [
  { label: "Neon PostgreSQL", env: "NEON_DATABASE_URL", icon: Database },
  { label: "Cloudflare R2 Access", env: "R2_ACCESS_KEY / R2_SECRET_KEY", icon: KeyRound },
  { label: "R2 Bucket", env: "R2_BUCKET_NAME", icon: Server },
  { label: "Authentication Secret", env: "AUTH_SECRET", icon: ShieldCheck }
];

export default function SettingsPage() {
  return (
    <AdminShell>
    <section className="rounded-xl border border-violet-100 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-violet-950">Settings</h2>
      <p className="mt-2 text-slate-600">Configure these values in Vercel environment variables before production deployment.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {settings.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-xl border border-violet-100 p-5">
              <Icon className="size-6 text-violet-600" />
              <p className="mt-4 font-bold text-violet-950">{item.label}</p>
              <code className="mt-2 block rounded-lg bg-violet-50 px-3 py-2 text-sm text-violet-800">{item.env}</code>
            </div>
          );
        })}
      </div>
    </section>
    </AdminShell>
  );
}
