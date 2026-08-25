import Link from "next/link";
import { Need } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";

export function NeedCard({ need }: { need: Need }) {
  return (
    <Link href={`/needs/${need.id}`} className="block group">
      <Card className="p-5 h-full transition-shadow group-hover:shadow-md group-hover:border-primary/40">
        <h3 className="font-semibold text-foreground">{need.title}</h3>
        <p className="text-sm text-muted mt-1 mb-3 line-clamp-2">{need.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {need.skills_required.map((skill) => (
            <Chip key={skill}>{skill}</Chip>
          ))}
        </div>
        <p className="text-xs text-muted">{need.availability_required}</p>
      </Card>
    </Link>
  );
}
