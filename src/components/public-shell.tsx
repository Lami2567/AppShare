import { Smartphone } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <main>
      <header className="mx-auto flex max-w-7xl items-center px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 font-bold text-violet-950">
          <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20">
            <Smartphone className="size-5" />
          </span>
          AppShare
        </Link>
      </header>
      {children}
    </main>
  );
}
