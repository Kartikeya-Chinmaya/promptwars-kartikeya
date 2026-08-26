import { getTrustScore, UserFacingError } from "@/lib/trustScore";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { username, skills } = (body ?? {}) as { username?: unknown; skills?: unknown };
  const trimmedUsername = typeof username === "string" ? username.trim() : "";
  const cleanSkills = Array.isArray(skills)
    ? skills.filter((s): s is string => typeof s === "string" && s.trim().length > 0)
    : [];

  if (!trimmedUsername) {
    return Response.json({ error: "GitHub username is required." }, { status: 400 });
  }
  if (cleanSkills.length === 0) {
    return Response.json({ error: "At least one skill is required." }, { status: 400 });
  }

  try {
    const result = await getTrustScore(trimmedUsername, cleanSkills);
    return Response.json(result);
  } catch (err) {
    if (err instanceof UserFacingError) {
      return Response.json({ error: err.message }, { status: 502 });
    }
    console.error("trust-score route error:", err);
    return Response.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
