import Link from "next/link";
import { Need } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";

export function NeedCard({ need, index = 0 }: { need: Need; index?: number }) {
  return (
    <Link href={`/needs/${need.id}`} className="block group">
      <Card
        className="animate-enter p-5 h-full hover:border-accent card-glow"
        style={{ animationDelay: `${index * 60}ms` }}
      >
        <h3 className="font-display text-display-md text-foreground">{need.title}</h3>
        <p className="text-sm text-muted mt-1.5 mb-3 line-clamp-2 font-mono">
          {need.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {need.skills_required.map((skill) => (
            <Chip key={skill}>{skill}</Chip>
          ))}
        </div>
        <p className="text-meta font-mono text-muted uppercase">{need.availability_required}</p>
      </Card>
    </Link>
  );
}
