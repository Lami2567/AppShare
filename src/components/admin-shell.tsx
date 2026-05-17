"use client";

import { BarChart3, Boxes, CloudUpload, Layers3, Settings, Smartphone } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/apps", label: "Apps", icon: Boxes },
  { href: "/admin/upload", label: "Upload", icon: CloudUpload },
  { href: "/admin/versions", label: "Versions", icon: Layers3 },
  { href: "/admin/settings", label: "Settings", icon: Settings }
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#f7f4ff] text-violet-950">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-violet-100 bg-white/84 px-4 py-5 backdrop-blur lg:block">
        <Link href="/admin" className="flex items-center gap-3 px-2 text-lg font-bold">
          <span className="grid size-10 place-items-center rounded-xl bg-violet-600 text-white">
            <Smartphone className="size-5" />
          </span>
          AppShare
        </Link>
        <nav className="mt-8 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  active ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20" : "text-slate-600 hover:bg-violet-50 hover:text-violet-900"
                }`}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-violet-100 bg-white/80 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-500">Admin Console</p>
              <h1 className="text-xl font-bold">Distribution Control</h1>
            </div>
            <Link href="/" className="rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm font-semibold text-violet-900">
              Public Portal
            </Link>
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto lg:hidden">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${active ? "bg-violet-600 text-white" : "bg-violet-50 text-violet-900"}`}>
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
