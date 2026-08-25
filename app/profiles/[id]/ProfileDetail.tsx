"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useData } from "@/lib/data-context";
import { matchNeedsToProfile } from "@/lib/match";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { NeedMatchCard } from "@/components/NeedMatchCard";
import { ConnectModal } from "@/components/ConnectModal";

export function ProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const fromNeedId = searchParams.get("fromNeed");
  const { getProfile, getNeed, needs } = useData();
  const profile = getProfile(id);
  const fromNeed = fromNeedId ? getNeed(fromNeedId) : undefined;
  const [connectOpen, setConnectOpen] = useState(false);

  if (!profile) {
    return (
      <main className="flex-1 max-w-3xl mx-auto px-6 py-16 text-center">
        <p className="text-muted font-mono">Profile not found.</p>
        <Link href="/" className="text-accent-text font-mono text-sm font-medium hover:underline">
          ← Back home
        </Link>
      </main>
    );
  }

  const mailSubject = fromNeed
    ? `Let's team up on "${fromNeed.title}"`
    : "Let's team up on ProjectMatch";
  const mailBody = fromNeed
    ? `Hi ${profile.name.split(" ")[0]}, I saw your profile matched my project "${fromNeed.title}" on ProjectMatch and wanted to connect.`
    : `Hi ${profile.name.split(" ")[0]}, I found your profile on ProjectMatch and wanted to connect.`;
  const matches = matchNeedsToProfile(profile, needs);

  return (
    <main className="flex-1 max-w-5xl mx-auto px-6 py-12">
      <Link
        href={fromNeed ? `/needs/${fromNeed.id}` : "/"}
        className="text-meta font-mono text-accent-text font-medium hover:underline"
      >
        ← {fromNeed ? `Back to ${fromNeed.title}` : "Back home"}
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mt-3">
        <div>
          <h1 className="font-display text-display-lg text-foreground">{profile.name}</h1>
          <p className="text-muted mt-2 max-w-xl font-mono text-sm">{profile.bio}</p>
        </div>
        <Button onClick={() => setConnectOpen(true)}>Connect</Button>
      </div>

      <ConnectModal
        profile={profile}
        subject={mailSubject}
        body={mailBody}
        open={connectOpen}
        onClose={() => setConnectOpen(false)}
      />

      <div className="grid sm:grid-cols-2 gap-8 mt-8">
        <div>
          <h2 className="text-meta font-mono font-semibold uppercase text-muted mb-2">Skills</h2>
          <div className="flex flex-wrap gap-1.5">
            {profile.skills.map((skill) => (
              <Chip key={skill}>{skill}</Chip>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-meta font-mono font-semibold uppercase text-muted mb-2">
            Interests
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {profile.interests.map((interest) => (
              <Chip key={interest}>{interest}</Chip>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-muted mt-6 font-mono">
        Availability: {profile.availability}
      </p>

      <h2 className="font-display text-display-md text-foreground mt-10 mb-4 border-b border-surface-border pb-3">
        Projects that fit this profile
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => (
          <NeedMatchCard key={match.need.id} match={match} />
        ))}
      </div>
    </main>
  );
}
