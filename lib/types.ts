export const SKILL_OPTIONS = [
  "React",
  "TypeScript",
  "Node.js",
  "Python",
  "Machine Learning",
  "UI Design",
  "Figma",
  "Backend",
  "PostgreSQL",
  "DevOps",
  "Data Analysis",
  "TensorFlow",
  "Mobile Dev",
  "System Design",
  "Product Management",
  "Marketing",
] as const;

export type Skill = (typeof SKILL_OPTIONS)[number];

export const INTEREST_OPTIONS = [
  "Frontend",
  "Backend",
  "AI/ML",
  "Design Systems",
  "DevOps",
  "APIs",
  "Data Viz",
  "Research",
  "Accessibility",
  "Product",
] as const;

export type Interest = (typeof INTEREST_OPTIONS)[number];

export const AVAILABILITY_OPTIONS = [
  "Weekday mornings",
  "Weekday evenings",
  "Weekends",
  "Flexible / Anytime",
] as const;

export type Availability = (typeof AVAILABILITY_OPTIONS)[number];

export interface SkillVerdict {
  skill: string;
  supported: "true" | "false" | "unclear";
  reason: string;
}

export interface TrustScoreResult {
  trust_score: number;
  per_skill: SkillVerdict[];
  flags: string[];
  checked_at: string;
}

export interface Profile {
  id: string;
  name: string;
  skills: string[];
  interests: string[];
  availability: Availability;
  bio: string;
  email: string;
  /** Optional — set when the profile owner supplied a GitHub username. */
  github_username?: string;
  /** Optional — a soft signal from public GitHub activity, not a verdict.
   * Absent if no github_username was given, or if the lookup failed. */
  trust_score?: TrustScoreResult;
}

export interface Need {
  id: string;
  title: string;
  description: string;
  skills_required: string[];
  availability_required: Availability;
}
