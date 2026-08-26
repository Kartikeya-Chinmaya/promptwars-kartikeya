import { TrustScoreResult } from "@/lib/types";

const VERDICT_ICON: Record<string, string> = { true: "✓", false: "✗", unclear: "?" };

export function TrustScorePanel({
  githubUsername,
  trustScore,
}: {
  githubUsername: string;
  trustScore: TrustScoreResult;
}) {
  const tone =
    trustScore.trust_score >= 70 ? "covered" : trustScore.trust_score < 40 ? "missing" : "neutral";

  return (
    <div className="border border-surface-border bg-surface p-5">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-meta font-mono font-semibold uppercase text-muted">
          GitHub Trust Score
        </h2>
        <a
          href={`https://github.com/${githubUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-meta font-mono text-accent-text hover:underline"
        >
          @{githubUsername} ↗
        </a>
      </div>

      <div className="flex items-baseline gap-2 mb-4">
        <span
          className={`font-display text-stat ${
            tone === "covered" ? "text-accent-text" : tone === "missing" ? "text-muted-2" : "text-foreground"
          }`}
        >
          {trustScore.trust_score}
        </span>
        <span className="text-meta font-mono text-muted uppercase">/ 100</span>
      </div>

      <ul className="flex flex-col gap-2 mb-4">
        {trustScore.per_skill.map((item) => (
          <li
            key={item.skill}
            className="tag flex items-start gap-2 px-3 py-2 font-mono text-sm"
          >
            <span
              aria-hidden="true"
              className={
                item.supported === "true"
                  ? "text-accent-text"
                  : item.supported === "false"
                    ? "text-danger"
                    : "text-muted-2"
              }
            >
              {VERDICT_ICON[item.supported] ?? "?"}
            </span>
            <span>
              <span className="font-semibold text-foreground">{item.skill}</span>
              <span className="text-muted"> — {item.reason}</span>
            </span>
          </li>
        ))}
      </ul>

      {trustScore.flags.length > 0 && (
        <div className="mb-3">
          <p className="text-micro font-mono font-semibold uppercase text-muted mb-1.5">Flags</p>
          <ul className="flex flex-wrap gap-1.5">
            {trustScore.flags.map((flag, i) => (
              <li key={i} className="tag px-2 py-1 font-mono text-micro text-muted-2">
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="text-micro font-mono text-muted-2">
        Based on public GitHub activity only — a soft signal, not a verdict.
      </p>
    </div>
  );
}
