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

export interface Profile {
  id: string;
  name: string;
  skills: string[];
  interests: string[];
  availability: Availability;
  bio: string;
  email: string;
}

export interface Need {
  id: string;
  title: string;
  description: string;
  skills_required: string[];
  availability_required: Availability;
}
