import Link from "next/link";
import { Profile } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";

export function ProfileCard({ profile, index = 0 }: { profile: Profile; index?: number }) {
  return (
    <Link href={`/profiles/${profile.id}`} className="block group">
      <Card
        className="animate-enter p-5 h-full hover:border-accent card-glow"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <h3 className="font-display text-display-md text-foreground">{profile.name}</h3>
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
