import { Need, Profile } from "./types";

export interface SkillCoverageItem {
  skill: string;
  covered: boolean;
}

export interface CoverageResult {
  coverage: SkillCoverageItem[];
  coveredCount: number;
  totalRequired: number;
  coverageRatio: number;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function computeSkillCoverage(
  requiredSkills: string[],
  candidateSkills: string[],
): CoverageResult {
  const owned = new Set(candidateSkills.map(normalize));
  const coverage = requiredSkills.map((skill) => ({
    skill,
    covered: owned.has(normalize(skill)),
  }));
  const coveredCount = coverage.filter((item) => item.covered).length;
  const totalRequired = requiredSkills.length;
  return {
    coverage,
    coveredCount,
    totalRequired,
    coverageRatio: totalRequired === 0 ? 0 : coveredCount / totalRequired,
  };
}

export function availabilityMatches(a: string, b: string): boolean {
  if (a === b) return true;
  if (a === "Flexible / Anytime" || b === "Flexible / Anytime") return true;
  return false;
}

export interface ProfileMatch extends CoverageResult {
  profile: Profile;
  availabilityMatch: boolean;
}

export interface NeedMatch extends CoverageResult {
  need: Need;
  availabilityMatch: boolean;
}

function byRankThenName<T extends CoverageResult & { availabilityMatch: boolean }>(
  a: T,
  b: T,
  nameA: string,
  nameB: string,
): number {
  if (b.coverageRatio !== a.coverageRatio) return b.coverageRatio - a.coverageRatio;
  if (a.availabilityMatch !== b.availabilityMatch) return a.availabilityMatch ? -1 : 1;
  return nameA.localeCompare(nameB);
}

export function matchProfilesToNeed(need: Need, profiles: Profile[]): ProfileMatch[] {
  return profiles
    .map((profile) => ({
      profile,
      availabilityMatch: availabilityMatches(profile.availability, need.availability_required),
      ...computeSkillCoverage(need.skills_required, profile.skills),
    }))
    .sort((a, b) => byRankThenName(a, b, a.profile.name, b.profile.name));
}

export function matchNeedsToProfile(profile: Profile, needs: Need[]): NeedMatch[] {
  return needs
    .map((need) => ({
      need,
      availabilityMatch: availabilityMatches(profile.availability, need.availability_required),
      ...computeSkillCoverage(need.skills_required, profile.skills),
    }))
    .sort((a, b) => byRankThenName(a, b, a.need.title, b.need.title));
}
