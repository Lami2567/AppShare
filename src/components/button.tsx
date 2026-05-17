import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary: "bg-violet-600 text-white shadow-lg shadow-violet-600/25 hover:bg-violet-700",
  secondary: "border border-violet-200 bg-white text-violet-950 hover:bg-violet-50",
  ghost: "text-violet-950 hover:bg-violet-100",
  danger: "bg-rose-600 text-white shadow-lg shadow-rose-600/20 hover:bg-rose-700"
};

const base =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition focus-ring disabled:cursor-not-allowed disabled:opacity-55";

export function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function LinkButton({
  className = "",
  variant = "primary",
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; variant?: Variant; children: ReactNode }) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
}
