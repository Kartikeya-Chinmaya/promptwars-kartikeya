import { ReactNode } from "react";

type ChipTone = "neutral" | "covered" | "missing";

const toneClasses: Record<ChipTone, string> = {
  neutral: "bg-missing-soft text-foreground border border-surface-border",
  covered: "bg-success-soft text-success border border-success/30",
  missing: "bg-missing-soft text-muted border border-surface-border",
};

export function Chip({ tone = "neutral", children }: { tone?: ChipTone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses[tone]}`}
    >
      {children}
    </span>
  );
}
