import { SkillCoverageItem } from "@/lib/match";

export function SkillCoverageBar({
  coverage,
  coveredCount,
  totalRequired,
  large = false,
}: {
  coverage: SkillCoverageItem[];
  coveredCount: number;
  totalRequired: number;
  large?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span
          className={`font-display ${large ? "text-display-md" : "text-lg"} text-foreground`}
        >
          {coveredCount}/{totalRequired}
          <span className="text-meta font-mono font-normal text-muted ml-2 uppercase">
            covered
          </span>
        </span>
      </div>

      {totalRequired > 0 && (
        <div className={`flex gap-1 ${large ? "mb-3" : "mb-2.5"}`} aria-hidden="true">
          {coverage.map((item, i) => (
            <span
              key={i}
              className={`animate-bar ${large ? "h-2.5" : "h-1.5"} flex-1 ${
                item.covered ? "bg-accent" : "bg-missing"
              }`}
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>
      )}

      <ul className="flex flex-wrap gap-1.5">
        {coverage.map((item, i) => (
          <li
            key={item.skill}
            className={`tag animate-enter inline-flex items-center gap-1 px-2 py-1 font-mono text-xs font-medium ${
              item.covered
                ? "bg-success-soft text-accent border-accent/40"
                : "bg-missing-soft text-muted-2 border-surface-border"
            }`}
            style={{ animationDelay: `${i * 30}ms` }}
          >
            <span aria-hidden="true">{item.covered ? "✓" : "✗"}</span>
            {item.skill}
          </li>
        ))}
      </ul>
    </div>
  );
}
