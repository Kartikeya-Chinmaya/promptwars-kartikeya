import { ReactNode } from "react";

export function SweepHeading({ children }: { children: ReactNode }) {
  return (
    <span className="sweep-hover relative inline-block">
      {children}
      <span className="sweep-underline" />
    </span>
  );
}
