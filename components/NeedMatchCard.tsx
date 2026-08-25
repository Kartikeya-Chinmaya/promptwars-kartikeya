import Link from "next/link";
import { NeedMatch } from "@/lib/match";
import { Card } from "@/components/ui/Card";
import { SkillCoverageBar } from "@/components/SkillCoverageBar";

export function NeedMatchCard({ match }: { match: NeedMatch }) {
  const { need, coverage, coveredCount, totalRequired, availabilityMatch } = match;

  return (
    <Link href={`/needs/${need.id}`} className="block group">
      <Card className="p-5 h-full hover:border-accent hover:shadow-[0_0_0_1px_rgba(57,255,136,0.3)]">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="font-display text-display-md text-foreground">{need.title}</h3>
            <p className="text-meta font-mono text-muted mt-0.5 uppercase">
              {need.availability_required}
            </p>
          </div>
          <span
            className={`tag shrink-0 text-micro font-mono font-medium px-2 py-1 uppercase ${
              availabilityMatch
                ? "bg-success-soft text-accent border-accent/40"
                : "bg-missing-soft text-muted border-surface-border"
            }`}
          >
            {availabilityMatch ? "Available ✓" : "Diff. schedule"}
          </span>
        </div>

        <p className="text-sm text-muted mb-3 line-clamp-2 font-mono">{need.description}</p>

        <SkillCoverageBar
          coverage={coverage}
          coveredCount={coveredCount}
          totalRequired={totalRequired}
          large
        />

        <span className="inline-block text-meta font-mono font-semibold uppercase text-accent mt-4 group-hover:underline">
          View need →
        </span>
      </Card>
    </Link>
  );
}
