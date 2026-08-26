import Link from "next/link";
import { ProfileMatch } from "@/lib/match";
import { Card } from "@/components/ui/Card";
import { SkillCoverageBar } from "@/components/SkillCoverageBar";
import { TrustBadge } from "@/components/TrustBadge";

export function MatchCard({ match, needId }: { match: ProfileMatch; needId: string }) {
  const { profile, coverage, coveredCount, totalRequired, availabilityMatch } = match;

  return (
    <Link href={`/profiles/${profile.id}?fromNeed=${needId}`} className="block group">
      <Card className="p-5 h-full hover:border-accent card-glow">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-display-md text-foreground">{profile.name}</h3>
              {profile.trust_score && <TrustBadge trustScore={profile.trust_score} />}
            </div>
            <p className="text-meta font-mono text-muted mt-0.5 uppercase">
              {profile.availability}
            </p>
          </div>
          <span
            className={`tag shrink-0 text-micro font-mono font-medium px-2 py-1 uppercase ${
              availabilityMatch
                ? "bg-success-soft text-accent-text border-accent/40"
                : "bg-missing-soft text-muted border-surface-border"
            }`}
          >
            {availabilityMatch ? "Available ✓" : "Diff. schedule"}
          </span>
        </div>

        <SkillCoverageBar
          coverage={coverage}
          coveredCount={coveredCount}
          totalRequired={totalRequired}
          large
        />

        {profile.interests.length > 0 && (
          <p className="text-xs text-muted mt-3 truncate font-mono">
            interests: {profile.interests.slice(0, 3).join(", ")}
          </p>
        )}

        <span className="inline-block text-meta font-mono font-semibold uppercase text-accent-text mt-4 group-hover:underline">
          View profile →
        </span>
      </Card>
    </Link>
  );
}
