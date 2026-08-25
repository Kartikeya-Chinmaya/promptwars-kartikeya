"use client";

import { useData } from "@/lib/data-context";
import { useGlitchBursts } from "@/lib/useGlitchBursts";
import { LinkButton } from "@/components/ui/Button";
import { NeedCard } from "@/components/NeedCard";
import { ProfileCard } from "@/components/ProfileCard";
import { GlitchLine } from "@/components/GlitchLine";
import { SweepHeading } from "@/components/SweepHeading";
import { ScrambleText } from "@/components/ScrambleText";

export default function Home() {
  const { needs, profiles } = useData();
  const glitching = useGlitchBursts();

  return (
    <main className="flex-1">
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="grid md:grid-cols-[1.4fr_1fr] gap-10 items-end">
          <div>
            <p className="text-meta font-mono text-accent-text uppercase mb-3 animate-enter">
              [team_formation.exe]
            </p>
            <h1 className="font-display text-display-xl text-foreground animate-enter">
              <GlitchLine text="FIND THE" glitching={glitching} />
              <br />
              <GlitchLine text="TEAMMATE" glitching={glitching} />
              <br />
              <GlitchLine text="YOU'RE MISSING." glitching={glitching} />
            </h1>
            <p className="mt-6 text-muted max-w-md font-mono text-sm animate-enter">
              Post a need or a profile. Get ranked matches with a transparent,
              skill-by-skill coverage breakdown — not a black-box score.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="animate-enter" style={{ animationDelay: "80ms" }}>
                <LinkButton href="/needs/new">
                  <ScrambleText text="Post a Need" /> →
                </LinkButton>
              </div>
              <div className="animate-enter" style={{ animationDelay: "140ms" }}>
                <LinkButton href="/profiles/new" variant="secondary">
                  Post my Profile →
                </LinkButton>
              </div>
            </div>
          </div>

          <div className="flex md:flex-col gap-8 md:gap-6 md:border-l md:border-surface-border md:pl-8">
            <div className="animate-enter" style={{ animationDelay: "180ms" }}>
              <div className="font-display text-stat text-accent-text">{needs.length}</div>
              <div className="text-meta font-mono text-muted uppercase">needs posted</div>
            </div>
            <div className="animate-enter" style={{ animationDelay: "240ms" }}>
              <div className="font-display text-stat text-accent-text">{profiles.length}</div>
              <div className="text-meta font-mono text-muted uppercase">profiles posted</div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-14">
        <div className="flex items-center justify-between mb-5 border-b border-surface-border pb-3">
          <h2 className="font-display text-display-md text-foreground">
            <SweepHeading>Open project needs</SweepHeading>
          </h2>
          <span className="text-meta font-mono text-muted uppercase">{needs.length} posted</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {needs.map((need, i) => (
            <NeedCard key={need.id} need={need} index={i} />
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-5 border-b border-surface-border pb-3">
          <h2 className="font-display text-display-md text-foreground">
            <SweepHeading>Teammates available</SweepHeading>
          </h2>
          <span className="text-meta font-mono text-muted uppercase">
            {profiles.length} posted
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile, i) => (
            <ProfileCard key={profile.id} profile={profile} index={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
