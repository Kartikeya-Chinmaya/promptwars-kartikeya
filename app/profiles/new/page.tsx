"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useData } from "@/lib/data-context";
import { AVAILABILITY_OPTIONS, INTEREST_OPTIONS, SKILL_OPTIONS } from "@/lib/types";
import { Field, TextInput, TextArea, Select } from "@/components/ui/Field";
import { MultiSelectChips } from "@/components/ui/MultiSelectChips";
import { Button } from "@/components/ui/Button";
import { ScrambleText } from "@/components/ScrambleText";

export default function NewProfilePage() {
  const router = useRouter();
  const { addProfile } = useData();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string>(AVAILABILITY_OPTIONS[2]);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || skills.length === 0) {
      setError("Add your name, email, and at least one skill.");
      return;
    }
    const profile = addProfile({
      name: name.trim(),
      bio: bio.trim() || "No bio yet.",
      email: email.trim(),
      skills,
      interests,
      availability: availability as (typeof AVAILABILITY_OPTIONS)[number],
    });
    router.push(`/profiles/${profile.id}`);
  }

  return (
    <main className="flex-1 max-w-2xl mx-auto px-6 py-12 w-full">
      <Link href="/" className="text-meta font-mono text-accent font-medium hover:underline">
        ← Back home
      </Link>
      <h1 className="font-display text-display-lg text-foreground mt-3 mb-1">
        <ScrambleText text="Post your Profile" />
      </h1>
      <p className="text-muted mb-8 font-mono text-sm">
        Share your skills and availability — we'll rank the projects that fit you.
      </p>

      <form onSubmit={handleSubmit}>
        <Field label="Name">
          <TextInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </Field>

        <Field label="Email" hint="Used for the Connect button on your profile.">
          <TextInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </Field>

        <Field label="Short bio" hint="Optional — one or two sentences.">
          <TextArea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="What do you like building?"
          />
        </Field>

        <Field label="Skills">
          <MultiSelectChips options={SKILL_OPTIONS} selected={skills} onChange={setSkills} />
        </Field>

        <Field label="Interests" hint="Optional">
          <MultiSelectChips
            options={INTEREST_OPTIONS}
            selected={interests}
            onChange={setInterests}
          />
        </Field>

        <Field label="Availability">
          <Select value={availability} onChange={(e) => setAvailability(e.target.value)}>
            {AVAILABILITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </Field>

        {error && <p className="text-sm text-danger mb-4 font-mono">{error}</p>}

        <Button type="submit">Post profile &amp; see matches</Button>
      </form>
    </main>
  );
}
