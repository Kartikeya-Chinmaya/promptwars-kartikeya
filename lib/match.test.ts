import { describe, expect, it } from "vitest";
import {
  availabilityMatches,
  computeSkillCoverage,
  matchNeedsToProfile,
  matchProfilesToNeed,
} from "./match";
import { AVAILABILITY_OPTIONS, Need, Profile } from "./types";

describe("computeSkillCoverage", () => {
  it("counts exact matches and reports the correct ratio", () => {
    const result = computeSkillCoverage(
      ["React", "Backend", "Machine Learning"],
      ["React", "Backend", "Figma"],
    );
    expect(result.coveredCount).toBe(2);
    expect(result.totalRequired).toBe(3);
    expect(result.coverageRatio).toBeCloseTo(2 / 3);
    expect(result.coverage).toEqual([
      { skill: "React", covered: true },
      { skill: "Backend", covered: true },
      { skill: "Machine Learning", covered: false },
    ]);
  });

  it("matches case-insensitively and ignores surrounding whitespace", () => {
    const result = computeSkillCoverage(["React"], [" react "]);
    expect(result.coveredCount).toBe(1);
    expect(result.coverage[0].covered).toBe(true);
  });

  it("reports zero coverage when the candidate has none of the required skills", () => {
    const result = computeSkillCoverage(["React", "Backend"], ["Python"]);
    expect(result.coveredCount).toBe(0);
    expect(result.coverageRatio).toBe(0);
  });

  it("treats zero required skills as zero ratio, not division by zero", () => {
    const result = computeSkillCoverage([], ["React"]);
    expect(result.totalRequired).toBe(0);
    expect(result.coverageRatio).toBe(0);
    expect(result.coverage).toEqual([]);
  });
});

describe("availabilityMatches", () => {
  it("matches identical availability strings", () => {
    expect(availabilityMatches("Weekends", "Weekends")).toBe(true);
  });

  it("does not match different availability strings", () => {
    expect(availabilityMatches("Weekends", "Weekday evenings")).toBe(false);
  });

  it("treats 'Flexible / Anytime' as matching anything, on either side", () => {
    expect(availabilityMatches("Flexible / Anytime", "Weekends")).toBe(true);
    expect(availabilityMatches("Weekday mornings", "Flexible / Anytime")).toBe(true);
  });

  it("keeps 'Flexible / Anytime' as a real option other availabilities can rely on", () => {
    // Regression guard: availabilityMatches special-cases this exact string,
    // so if it's ever renamed in types.ts the special case silently breaks.
    expect(AVAILABILITY_OPTIONS).toContain("Flexible / Anytime");
  });
});

function makeProfile(overrides: Partial<Profile>): Profile {
  return {
    id: "profile-test",
    name: "Test Person",
    skills: [],
    interests: [],
    availability: "Weekends",
    bio: "",
    email: "test@example.com",
    ...overrides,
  };
}

function makeNeed(overrides: Partial<Need>): Need {
  return {
    id: "need-test",
    title: "Test Need",
    description: "",
    skills_required: [],
    availability_required: "Weekends",
    ...overrides,
  };
}

describe("matchProfilesToNeed", () => {
  const need = makeNeed({
    title: "AI Study Buddy",
    skills_required: ["React", "UI Design", "Backend", "Machine Learning"],
    availability_required: "Weekends",
  });

  it("ranks profiles by coverage ratio, highest first", () => {
    const strong = makeProfile({ id: "p-strong", name: "Strong", skills: ["React", "UI Design", "Backend"] });
    const weak = makeProfile({ id: "p-weak", name: "Weak", skills: ["React"] });

    const matches = matchProfilesToNeed(need, [weak, strong]);

    expect(matches.map((m) => m.profile.id)).toEqual(["p-strong", "p-weak"]);
    expect(matches[0].coverageRatio).toBeCloseTo(0.75);
    expect(matches[1].coverageRatio).toBeCloseTo(0.25);
  });

  it("breaks a coverage tie in favor of the profile whose availability matches", () => {
    const available = makeProfile({
      id: "p-available",
      name: "Available",
      skills: ["React"],
      availability: "Weekends",
    });
    const unavailable = makeProfile({
      id: "p-unavailable",
      name: "Unavailable",
      skills: ["React"],
      availability: "Weekday evenings",
    });

    const matches = matchProfilesToNeed(need, [unavailable, available]);

    expect(matches.map((m) => m.profile.id)).toEqual(["p-available", "p-unavailable"]);
    expect(matches[0].availabilityMatch).toBe(true);
    expect(matches[1].availabilityMatch).toBe(false);
  });

  it("falls back to alphabetical name order for a full tie", () => {
    const bob = makeProfile({ id: "p-bob", name: "Bob", skills: ["React"] });
    const alice = makeProfile({ id: "p-alice", name: "Alice", skills: ["React"] });

    const matches = matchProfilesToNeed(need, [bob, alice]);

    expect(matches.map((m) => m.profile.name)).toEqual(["Alice", "Bob"]);
  });
});

describe("matchNeedsToProfile", () => {
  it("ranks needs by how well the profile covers each one's required skills", () => {
    const profile = makeProfile({ skills: ["Python", "Machine Learning", "TensorFlow"] });
    const strongFit = makeNeed({
      id: "need-strong",
      title: "Fitness Tracker ML",
      skills_required: ["Python", "Machine Learning", "TensorFlow", "React"],
    });
    const weakFit = makeNeed({
      id: "need-weak",
      title: "Campus Marketplace",
      skills_required: ["React", "Node.js", "PostgreSQL"],
    });

    const matches = matchNeedsToProfile(profile, [weakFit, strongFit]);

    expect(matches.map((m) => m.need.id)).toEqual(["need-strong", "need-weak"]);
  });
});
