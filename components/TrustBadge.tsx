import { TrustScoreResult } from "@/lib/types";
import { Chip } from "@/components/ui/Chip";

export function TrustBadge({ trustScore }: { trustScore: TrustScoreResult }) {
  const tone =
    trustScore.trust_score >= 70 ? "covered" : trustScore.trust_score < 40 ? "missing" : "neutral";

  return <Chip tone={tone}>GH {trustScore.trust_score}</Chip>;
}
