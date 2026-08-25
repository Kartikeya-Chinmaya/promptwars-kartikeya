"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useData } from "@/lib/data-context";
import { AVAILABILITY_OPTIONS, SKILL_OPTIONS } from "@/lib/types";
import { Field, TextInput, TextArea, Select } from "@/components/ui/Field";
import { MultiSelectChips } from "@/components/ui/MultiSelectChips";
import { Button } from "@/components/ui/Button";
import { ScrambleText } from "@/components/ScrambleText";

export default function NewNeedPage() {
  const router = useRouter();
  const { addNeed } = useData();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skillsRequired, setSkillsRequired] = useState<string[]>([]);
  const [availabilityRequired, setAvailabilityRequired] = useState<string>(
    AVAILABILITY_OPTIONS[2],
  );
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim() || skillsRequired.length === 0) {
      setError("Add a title, a short description, and at least one required skill.");
      return;
    }
    const need = addNeed({
      title: title.trim(),
      description: description.trim(),
      skills_required: skillsRequired,
      availability_required: availabilityRequired as (typeof AVAILABILITY_OPTIONS)[number],
    });
    router.push(`/needs/${need.id}`);
  }

  return (
    <main className="flex-1 max-w-2xl mx-auto px-6 py-12 w-full">
      <Link href="/" className="text-meta font-mono text-accent font-medium hover:underline">
        ← Back home
      </Link>
      <h1 className="font-display text-display-lg text-foreground mt-3 mb-1">
        <ScrambleText text="Post a Need" />
      </h1>
      <p className="text-muted mb-8 font-mono text-sm">
        Describe your project and the skills you&apos;re missing — we&apos;ll rank who covers them.
      </p>

      <form onSubmit={handleSubmit}>
        <Field label="Project title">
          <TextInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. AI Study Buddy"
            required
          />
        </Field>

        <Field label="Description" hint="What are you building, and what's missing?">
          <TextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="A hackathon app that..."
            required
          />
        </Field>

        <Field grouped label="Skills required" hint="Select every skill the project needs.">
          <MultiSelectChips
            options={SKILL_OPTIONS}
            selected={skillsRequired}
            onChange={setSkillsRequired}
          />
        </Field>

        <Field label="Availability required">
          <Select
            value={availabilityRequired}
            onChange={(e) => setAvailabilityRequired(e.target.value)}
          >
            {AVAILABILITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </Field>

        {error && <p className="text-sm text-danger mb-4 font-mono">{error}</p>}

        <Button type="submit">Post need &amp; see matches</Button>
      </form>
    </main>
  );
}
