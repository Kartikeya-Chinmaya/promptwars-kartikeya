import Link from "next/link";
import { ProfileMatch } from "@/lib/match";
import { Card } from "@/components/ui/Card";
import { SkillCoverageBar } from "@/components/SkillCoverageBar";

export function MatchCard({ match, needId }: { match: ProfileMatch; needId: string }) {
  const { profile, coverage, coveredCount, totalRequired, availabilityMatch } = match;

  return (
    <Link href={`/profiles/${profile.id}?fromNeed=${needId}`} className="block group">
      <Card className="p-5 h-full transition-shadow group-hover:shadow-md group-hover:border-primary/40">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3 className="font-semibold text-foreground">{profile.name}</h3>
            <p className="text-xs text-muted mt-0.5">{profile.availability}</p>
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

        <SkillCoverageBar
          coverage={coverage}
          coveredCount={coveredCount}
          totalRequired={totalRequired}
        />

        {profile.interests.length > 0 && (
          <p className="text-xs text-muted mt-3 truncate">
            Interested in {profile.interests.slice(0, 3).join(", ")}
          </p>
        )}

        <span className="inline-block text-sm font-medium text-primary mt-3 group-hover:underline">
          View profile →
        </span>
      </Card>
    </Link>
  );
}
