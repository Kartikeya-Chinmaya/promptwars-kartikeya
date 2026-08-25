import { ReactNode } from "react";

type ChipTone = "neutral" | "covered" | "missing";

const toneClasses: Record<ChipTone, string> = {
  neutral: "bg-missing-soft text-foreground border-surface-border",
  covered: "bg-success-soft text-accent-text border-accent/40",
  missing: "bg-missing-soft text-muted-2 border-surface-border",
};

export function Chip({ tone = "neutral", children }: { tone?: ChipTone; children: ReactNode }) {
  return (
    <span
      className={`tag inline-flex items-center gap-1 px-2 py-1 text-xs font-medium ${toneClasses[tone]}`}
    >
      [{children}]
    </span>
  );
}
