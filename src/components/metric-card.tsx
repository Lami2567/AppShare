import type { LucideIcon } from "lucide-react";

export function MetricCard({ label, value, icon: Icon }: { label: string; value: string | number; icon: LucideIcon }) {
  return (
    <div className="rounded-xl border border-violet-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        <span className="grid size-10 place-items-center rounded-lg bg-violet-100 text-violet-700">
          <Icon className="size-5" />
        </span>
      </div>
      <p className="mt-5 text-3xl font-bold text-violet-950">{value}</p>
    </div>
  );
}
