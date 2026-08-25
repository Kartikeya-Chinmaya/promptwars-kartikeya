import Link from "next/link";
import { NeedMatch } from "@/lib/match";
import { Card } from "@/components/ui/Card";
import { SkillCoverageBar } from "@/components/SkillCoverageBar";

export function NeedMatchCard({ match }: { match: NeedMatch }) {
  const { need, coverage, coveredCount, totalRequired, availabilityMatch } = match;

  return (
    <Link href={`/needs/${need.id}`} className="block group">
      <Card className="p-5 h-full transition-shadow group-hover:shadow-md group-hover:border-primary/40">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="font-semibold text-foreground">{need.title}</h3>
            <p className="text-xs text-muted mt-0.5">{need.availability_required}</p>
          </div>
          <span
            className={`shrink-0 text-xs font-medium rounded-full px-2.5 py-1 ${
              availabilityMatch
                ? "bg-success-soft text-success"
                : "bg-missing-soft text-muted"
            }`}
          >
            {availabilityMatch ? "Available ✓" : "Availability differs"}
          </span>
        </div>

        <p className="text-sm text-muted mb-3 line-clamp-2">{need.description}</p>

        <SkillCoverageBar
          coverage={coverage}
          coveredCount={coveredCount}
          totalRequired={totalRequired}
        />

        <span className="inline-block text-sm font-medium text-primary mt-3 group-hover:underline">
          View need →
        </span>
      </Card>
    </Link>
  );
}
