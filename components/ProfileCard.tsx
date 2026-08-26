import Link from "next/link";
import { Profile } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { TrustBadge } from "@/components/TrustBadge";

export function ProfileCard({ profile, index = 0 }: { profile: Profile; index?: number }) {
  return (
    <Link href={`/profiles/${profile.id}`} className="block group">
      <Card
        className="animate-enter p-5 h-full hover:border-accent card-glow"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-display-md text-foreground">{profile.name}</h3>
          {profile.trust_score && <TrustBadge trustScore={profile.trust_score} />}
        </div>
        <p className="text-sm text-muted mt-1.5 mb-3 line-clamp-2 font-mono">{profile.bio}</p>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {profile.skills.map((skill) => (
            <Chip key={skill}>{skill}</Chip>
          ))}
        </div>
        <p className="text-meta font-mono text-muted uppercase">{profile.availability}</p>
      </Card>
    </Link>
  );
}
