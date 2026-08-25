import Link from "next/link";
import { Profile } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";

export function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <Link href={`/profiles/${profile.id}`} className="block group">
      <Card className="p-5 h-full transition-shadow group-hover:shadow-md group-hover:border-primary/40">
        <h3 className="font-semibold text-foreground">{profile.name}</h3>
        <p className="text-sm text-muted mt-1 mb-3 line-clamp-2">{profile.bio}</p>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {profile.skills.map((skill) => (
            <Chip key={skill}>{skill}</Chip>
          ))}
        </div>
        <p className="text-xs text-muted">{profile.availability}</p>
      </Card>
    </Link>
  );
}
