"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useData } from "@/lib/data-context";
import { matchProfilesToNeed } from "@/lib/match";
import { Chip } from "@/components/ui/Chip";
import { MatchCard } from "@/components/MatchCard";

export default function NeedDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getNeed, profiles } = useData();
  const need = getNeed(id);

  if (!need) {
    return (
      <main className="flex-1 max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-muted font-mono">Need not found.</p>
        <Link
          href="/"
          className="text-accent-text font-mono text-sm font-medium hover:underline"
        >
          ← Back home
        </Link>
      </main>
    );
  }

  const matches = matchProfilesToNeed(need, profiles);

  return (
    <main className="flex-1 max-w-5xl mx-auto px-6 py-12">
      <Link href="/" className="text-meta font-mono text-accent-text font-medium hover:underline">
        ← Back to all needs
      </Link>

      <h1 className="font-display text-display-lg text-foreground mt-3">{need.title}</h1>
      <p className="text-muted mt-2 max-w-2xl font-mono text-sm">{need.description}</p>

      <div className="flex flex-wrap gap-2 mt-4">
        {need.skills_required.map((skill) => (
          <Chip key={skill}>{skill}</Chip>
        ))}
        <Chip>{need.availability_required}</Chip>
      </div>

      <h2 className="font-display text-display-md text-foreground mt-10 mb-4 border-b border-surface-border pb-3">
        Ranked matches ({matches.length})
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => (
          <MatchCard key={match.profile.id} match={match} needId={need.id} />
        ))}
      </div>
    </main>
  );
}
