"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useData } from "@/lib/data-context";
import { AVAILABILITY_OPTIONS, INTEREST_OPTIONS, SKILL_OPTIONS, TrustScoreResult } from "@/lib/types";
import { Field, TextInput, TextArea, Select } from "@/components/ui/Field";
import { MultiSelectChips } from "@/components/ui/MultiSelectChips";
import { Button, LinkButton } from "@/components/ui/Button";
import { ScrambleText } from "@/components/ScrambleText";

export default function NewProfilePage() {
  const router = useRouter();
  const { addProfile } = useData();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string>(AVAILABILITY_OPTIONS[2]);
  const [error, setError] = useState<string | null>(null);
  const [checkingGithub, setCheckingGithub] = useState(false);
  const [postedWithWarning, setPostedWithWarning] = useState<{
    profileId: string;
    message: string;
  } | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || skills.length === 0) {
      setError("Add your name, email, and at least one skill.");
      return;
    }
    setError(null);

    const trimmedUsername = githubUsername.trim();
    let trustScore: TrustScoreResult | undefined;
    let warning: string | null = null;

    if (trimmedUsername) {
      setCheckingGithub(true);
      try {
        const res = await fetch("/api/trust-score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: trimmedUsername, skills }),
        });
        const data = await res.json();
        if (res.ok) {
          trustScore = data as TrustScoreResult;
        } else {
          warning = typeof data.error === "string" ? data.error : "Couldn't check GitHub activity.";
        }
      } catch {
        warning = "Couldn't reach the GitHub check.";
      } finally {
        setCheckingGithub(false);
      }
    }

    const profile = addProfile({
      name: name.trim(),
      bio: bio.trim() || "No bio yet.",
      email: email.trim(),
      skills,
      interests,
      availability: availability as (typeof AVAILABILITY_OPTIONS)[number],
      ...(trimmedUsername ? { github_username: trimmedUsername } : {}),
      ...(trustScore ? { trust_score: trustScore } : {}),
    });

    if (warning) {
      // Soft signal, not a gate — the profile is posted either way. Surface
      // why the score is missing instead of silently swallowing it or
      // auto-navigating past a message the user'd never see.
      setPostedWithWarning({
        profileId: profile.id,
        message: `${warning} Profile was posted without a GitHub trust score.`,
      });
    } else {
      router.push(`/profiles/${profile.id}`);
    }
  }

  if (postedWithWarning) {
    return (
      <main className="flex-1 max-w-2xl mx-auto px-6 py-12 w-full">
        <h1 className="font-display text-display-lg text-foreground mb-3">Profile posted</h1>
        <p className="text-sm text-danger font-mono mb-6">{postedWithWarning.message}</p>
        <LinkButton href={`/profiles/${postedWithWarning.profileId}`}>View profile →</LinkButton>
      </main>
    );
  }

  return (
    <main className="flex-1 max-w-2xl mx-auto px-6 py-12 w-full">
      <Link href="/" className="text-meta font-mono text-accent-text font-medium hover:underline">
        ← Back home
      </Link>
      <h1 className="font-display text-display-lg text-foreground mt-3 mb-1">
        <ScrambleText text="Post your Profile" />
      </h1>
      <p className="text-muted mb-8 font-mono text-sm">
        Share your skills and availability — we&apos;ll rank the projects that fit you.
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

        <Field
          label="GitHub username"
          hint="Optional — we'll check your public activity and show a trust score alongside your claimed skills."
        >
          <TextInput
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
            placeholder="e.g. torvalds"
          />
        </Field>

        <Field grouped label="Skills">
          <MultiSelectChips options={SKILL_OPTIONS} selected={skills} onChange={setSkills} />
        </Field>

        <Field grouped label="Interests" hint="Optional">
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

        <Button type="submit" disabled={checkingGithub}>
          {checkingGithub ? "Checking GitHub…" : "Post profile & see matches"}
        </Button>
      </form>
    </main>
  );
}
