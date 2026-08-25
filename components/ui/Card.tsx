import { HTMLAttributes, ReactNode } from "react";

export function Card({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={`rounded-xl border border-surface-border bg-surface shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
