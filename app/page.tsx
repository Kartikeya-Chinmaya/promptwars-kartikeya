"use client";

import { useData } from "@/lib/data-context";
import { LinkButton } from "@/components/ui/Button";
import { NeedCard } from "@/components/NeedCard";
import { ProfileCard } from "@/components/ProfileCard";

export default function Home() {
  const { needs, profiles } = useData();

  return (
    <main className="flex-1">
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          ProjectMatch
        </h1>
        <p className="mt-4 text-lg text-muted max-w-2xl mx-auto">
          You've got the idea and most of the team. Find the one or two teammates
          you're missing — fast, with a transparent breakdown of who covers what.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <LinkButton href="/needs/new">Post a Need — find teammates</LinkButton>
          <LinkButton href="/profiles/new" variant="secondary">
            Post my Profile — get matched
          </LinkButton>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-14">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Open project needs</h2>
          <span className="text-sm text-muted">{needs.length} posted</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {needs.map((need) => (
            <NeedCard key={need.id} need={need} />
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">Teammates available</h2>
          <span className="text-sm text-muted">{profiles.length} posted</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <ProfileCard key={profile.id} profile={profile} />
          ))}
        </div>
      </section>
    </main>
  );
}
