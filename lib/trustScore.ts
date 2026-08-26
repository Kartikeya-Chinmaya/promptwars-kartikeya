import "server-only";
import { TrustScoreResult } from "./types";

const GITHUB_API = "https://api.github.com";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
// llama-3.3-70b-versatile has been retired from Groq's catalog; gpt-oss-120b
// is the closest currently-available general-purpose replacement.
const GROQ_MODEL = "openai/gpt-oss-120b";

/** Errors safe to surface to the client as-is (expected failure modes). */
export class UserFacingError extends Error {}

interface GitHubUser {
  login: string;
  bio: string | null;
  public_repos: number;
  created_at: string;
}

interface GitHubRepo {
  name: string;
  language: string | null;
  description: string | null;
  fork: boolean;
  stargazers_count: number;
  updated_at: string;
}

async function githubGet<T>(path: string): Promise<T> {
  const res = await fetch(`${GITHUB_API}${path}`, {
    headers: {
      "User-Agent": "projectmatch-trust-score",
      Accept: "application/vnd.github+json",
    },
    cache: "no-store",
  });

  if (res.status === 404) {
    throw new UserFacingError(`GitHub user not found.`);
  }
  if (res.status === 403 || res.status === 429) {
    throw new UserFacingError(
      "GitHub API rate limit hit (unauthenticated requests are capped at 60/hour). Try again later.",
    );
  }
  if (!res.ok) {
    throw new UserFacingError(`GitHub API error ${res.status}.`);
  }
  return res.json();
}

interface GitHubSummary {
  username: string;
  bio: string | null;
  public_repos: number;
  account_created_at: string;
  account_age_days: number;
  languages_detected: string[];
  recent_own_repos: {
    name: string;
    language: string | null;
    description: string | null;
    stars: number;
    updated_at: string;
  }[];
  forked_repos_excluded_from_analysis: number;
}

function summarizeGitHubData(user: GitHubUser, repos: GitHubRepo[]): GitHubSummary {
  const nonForkRepos = repos.filter((r) => !r.fork);
  const languages = [...new Set(nonForkRepos.map((r) => r.language).filter((l): l is string => Boolean(l)))];
  const accountAgeDays = Math.floor(
    (Date.now() - new Date(user.created_at).getTime()) / 86_400_000,
  );

  return {
    username: user.login,
    bio: user.bio,
    public_repos: user.public_repos,
    account_created_at: user.created_at,
    account_age_days: accountAgeDays,
    languages_detected: languages,
    recent_own_repos: nonForkRepos.map((r) => ({
      name: r.name,
      language: r.language,
      description: r.description,
      stars: r.stargazers_count,
      updated_at: r.updated_at,
    })),
    forked_repos_excluded_from_analysis: repos.length - nonForkRepos.length,
  };
}

const SYSTEM_PROMPT = `You are assessing how plausible a set of self-claimed technical skills are, given someone's real public GitHub activity.

Be CONSERVATIVE and FAIR:
- Lack of public evidence is NOT proof a claim is fake. Private repos, work done at a job, on other platforms, or before creating this GitHub account are all common and legitimate reasons a skill might not show up publicly.
- This is a soft signal meant to prompt a conversation, not a verdict on someone's honesty or competence.
- Never claim certainty. A skill can be "unclear" — that is a valid and often correct answer, not a cop-out.
- A small or sparse account is weak evidence either way, not automatic grounds for suspicion. Say so explicitly if that's the situation, and keep the trust_score from being punished heavily just for a thin public footprint.
- Only mark a skill "false" if the evidence actively contradicts it (e.g. claims deep systems-language expertise but every visible repo is in an unrelated stack for years) — not merely "no direct evidence found."

Respond with ONLY valid JSON, no markdown code fences, no commentary before or after, matching exactly this shape:
{
  "trust_score": <integer 0-100>,
  "per_skill": [
    { "skill": "<string, copied from the claimed list>", "supported": "true" | "false" | "unclear", "reason": "<one sentence, specific to the evidence>" }
  ],
  "flags": ["<short factual observations about the account itself, e.g. \\"account created 2 days ago\\", \\"zero public repositories\\">"]
}`;

function buildUserPrompt(summary: GitHubSummary, claimedSkills: string[]): string {
  return `GitHub activity summary (public data only):\n${JSON.stringify(summary, null, 2)}\n\nClaimed skills: ${claimedSkills.join(", ")}\n\nAssess plausibility per skill given the evidence above.`;
}

function parseGroqJson(rawContent: string): Omit<TrustScoreResult, "checked_at"> {
  let text = rawContent.trim();
  const fenced = text.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fenced) text = fenced[1].trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new UserFacingError("Groq did not return valid JSON.");
  }

  const candidate = parsed as Partial<TrustScoreResult>;
  if (
    typeof candidate.trust_score !== "number" ||
    !Array.isArray(candidate.per_skill) ||
    !Array.isArray(candidate.flags)
  ) {
    throw new UserFacingError("Groq's JSON response was missing expected fields.");
  }

  return {
    trust_score: candidate.trust_score,
    per_skill: candidate.per_skill,
    flags: candidate.flags,
  };
}

async function scoreWithGroq(
  summary: GitHubSummary,
  claimedSkills: string[],
): Promise<Omit<TrustScoreResult, "checked_at">> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new UserFacingError("GROQ_API_KEY is not configured on the server.");
  }

  let res: Response;
  try {
    res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: buildUserPrompt(summary, claimedSkills) },
        ],
        temperature: 0.2,
        response_format: { type: "json_object" },
      }),
      cache: "no-store",
    });
  } catch (err) {
    throw new UserFacingError(
      `Could not reach Groq API: ${err instanceof Error ? err.message : String(err)}`,
    );
  }

  if (!res.ok) {
    throw new UserFacingError(`Groq API error ${res.status}.`);
  }

  const data = await res.json();
  const content: string | undefined = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new UserFacingError("Groq response had no message content to parse.");
  }

  return parseGroqJson(content);
}

/**
 * Fetches a GitHub user's public activity and asks Groq how plausible the
 * given claimed skills look against it. Throws UserFacingError for expected
 * failure modes (bad username, rate limit, missing key, bad model output) —
 * callers should catch that specifically and treat everything else as a
 * genuine 500.
 */
export async function getTrustScore(
  username: string,
  claimedSkills: string[],
): Promise<TrustScoreResult> {
  const [user, repos] = await Promise.all([
    githubGet<GitHubUser>(`/users/${encodeURIComponent(username)}`),
    githubGet<GitHubRepo[]>(`/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=10`),
  ]);
  const summary = summarizeGitHubData(user, repos);
  const scored = await scoreWithGroq(summary, claimedSkills);

  return {
    ...scored,
    checked_at: new Date().toISOString(),
  };
}
