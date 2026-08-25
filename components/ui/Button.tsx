import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-foreground border border-accent hover:shadow-[0_0_0_3px_rgba(57,255,136,0.25)]",
  secondary:
    "bg-transparent text-foreground border border-surface-border hover:border-accent",
  ghost: "text-accent border border-transparent hover:border-accent/40",
};

const base =
  "btn-hover inline-flex items-center justify-center gap-2 rounded-none px-4 py-2.5 font-mono text-sm font-semibold uppercase tracking-wide disabled:opacity-40 disabled:pointer-events-none";

export function buttonClasses(variant: Variant = "primary", className = "") {
  return `${base} ${variantClasses[variant]} ${className}`;
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; children: ReactNode }) {
  return (
    <button className={buttonClasses(variant, className)} {...props}>
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={buttonClasses(variant, className)}>
      {children}
    </Link>
  );
}
