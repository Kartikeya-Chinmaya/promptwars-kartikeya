import { HTMLAttributes, ReactNode } from "react";

export function Card({
  className = "",
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={`btn-hover rounded-none border border-surface-border bg-surface ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
