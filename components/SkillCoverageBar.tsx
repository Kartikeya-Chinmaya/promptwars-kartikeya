import { SkillCoverageItem } from "@/lib/match";

export function SkillCoverageBar({
  coverage,
  coveredCount,
  totalRequired,
}: {
  coverage: SkillCoverageItem[];
  coveredCount: number;
  totalRequired: number;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-semibold text-foreground">
          {coveredCount}/{totalRequired} skills covered
        </span>
      </div>

      {totalRequired > 0 && (
        <div className="flex gap-1 mb-2.5" aria-hidden="true">
          {coverage.map((item, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full ${
                item.covered ? "bg-success" : "bg-missing"
              }`}
            />
          ))}
        </div>
      )}

      <ul className="flex flex-wrap gap-1.5">
        {coverage.map((item) => (
          <li
            key={item.skill}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border ${
              item.covered
                ? "bg-success-soft text-success border-success/30"
                : "bg-missing-soft text-muted border-surface-border"
            }`}
          >
            <span aria-hidden="true">{item.covered ? "✓" : "✗"}</span>
            {item.skill}
          </li>
        ))}
      </ul>
    </div>
  );
}
