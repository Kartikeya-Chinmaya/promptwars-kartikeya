# ProjectMatch

A team-formation platform for the moment right before a deadline: you have a
project idea and most of a team, but you're missing one or two specific
skills and don't have time to sift through a general "find a teammate" board.

**Live demo:** https://promptwarsbykartikeya.vercel.app

## Chosen vertical

**Team Formation / Project Matching.** The target persona is a student with a
hackathon or class project idea who is missing 1–2 specific skills on their
team and needs to find the right teammate fast — or, symmetrically, someone
with free time and a skill set looking for a project that actually fits them.

## Approach and logic

The core idea is that a matching score is only useful if it's *inspectable*.
Most "find a teammate" tools reduce a match to a single opaque percentage.
ProjectMatch instead computes and displays a **transparent, per-skill
coverage breakdown**: for a project that needs `[React] [UI Design] [Backend]
[Machine Learning]`, a candidate's card shows exactly which of those four are
covered (✓) and which are missing (✗), with a segmented bar as the visual
summary — not just "75% match."

Matching logic (`lib/match.ts`) is pure and deterministic, no ML/LLM call
involved — this is a rules-based decision system, which is the right choice
here because the "decision" (does this profile cover these skills, on a
compatible schedule) is fully specified by the data, and an opaque model
would only make the result *less* inspectable, working against the whole
point of the feature:

- **Skill coverage** — each required skill is checked against a candidate's
  skill list, case- and whitespace-insensitively (`"react"` and `" React "`
  both match `"React"`), without any fuzzy/semantic matching beyond that.
- **Availability compatibility** — an exact string match, with a
  `"Flexible / Anytime"` value on either side always counting as compatible.
- **Ranking** — candidates are sorted by coverage ratio (descending), ties
  broken by availability compatibility, then alphabetically for a stable,
  predictable order.

The same engine runs in both directions: ranking *profiles* against a posted
*need*, and ranking *needs* against a posted *profile* — one function,
`computeSkillCoverage`, shared by both, rather than two parallel
implementations that could drift apart.

## How the solution works

**Hero flow:** post a Need (a project + the skills you're missing) or a
Profile (your skills/interests/availability) → see ranked matches, each with
the skill-coverage breakdown front and center on the card → click a match to
open the full profile → **Connect**, which opens a modal with the contact's
email, a pre-filled message, and two actions (copy the email, or open your
mail client) so something always happens on click regardless of whether the
browser has a default mail app configured.

**Data model** (`lib/types.ts`):
- `Profile` — name, skills[], interests[], availability, bio, email
- `Need` — title, description, skills_required[], availability_required
- A **Match** is never persisted — it's computed on the fly from a `Need`
  and the current `Profile[]` (or vice versa), so it can't go stale.

**State:** no backend or auth. App state lives in a small external store
(`lib/dataStore.ts`) synced to `localStorage` via `useSyncExternalStore`, so
posting a Need/Profile persists across a refresh but is local to that
browser — good enough for a demo, explicitly not a substitute for a real
backend (see Assumptions).

**Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind
CSS v4. Seeded with 3 demo profiles and 3 demo needs so matching is visible
immediately without any signup flow.

**Design system:** a deliberately non-generic "dev-tool" visual language —
near-black background, one signal-green accent, condensed display type +
monospace UI type, bracket-style `[tag]` chips — applied through shared
tokens (`app/globals.css`) and primitives (`components/ui/`) rather than
hardcoded per component. A few motion details (a glitch flicker on the hero
headline, a hover-triggered underline sweep, a scramble/decrypt text reveal)
are driven by a shared `setInterval`-based timer hook
(`lib/useIntervalTimer.ts`) with clamped delta-time, rather than CSS
`@keyframes` or `requestAnimationFrame` — both throttle unpredictably in some
browsers, and a `setInterval` loop degrades more gracefully.

## Testing

```bash
npm run lint   # ESLint (react-hooks correctness rules included)
npm test       # Vitest — unit tests for the matching engine
npm run build  # production build + type check
```

`lib/match.test.ts` covers the matching engine directly: coverage counting,
case/whitespace-insensitive matching, the zero-required-skills edge case,
availability matching (including the `"Flexible / Anytime"` special case),
and ranking/tie-break order for both `matchProfilesToNeed` and
`matchNeedsToProfile`. This is the part of the app where a silent bug would
be worst — a wrong ranking or a skill incorrectly marked "covered" undermines
the entire premise of transparent matching — so it's covered first.

## Accessibility

- Every form field's `<label>` is programmatically associated with its input
  (`htmlFor`/`id`); grouped controls (skill/interest toggle chips) use
  `<fieldset>`/`<legend>` instead, since a single `<label>` can't describe a
  group of independent buttons.
- Color tokens are checked against WCAG AA (4.5:1) for text use — the
  `--muted-2` token was previously below 3:1 rather than the ~4.5–5.6:1 it is
  now, both on the page background and on the "missing skill" chip
  background.
- All interactive elements (buttons, tag toggles, links) have a visible
  `:focus-visible` outline, not just a hover state — a mouse-only affordance
  would fail keyboard users.
- The Connect modal is a real dialog: `role="dialog"`, `aria-modal="true"`,
  `aria-labelledby` pointing at its heading, focus moves into it on open and
  back to the trigger on close, and `Escape` closes it.

## Assumptions

1. **Skills/interests are fixed pick-lists** (with a "+ Add custom" escape
   hatch), not free text — this keeps matching exact and avoids needing
   fuzzy/semantic matching to reconcile e.g. `"React"` vs `"React.js"`, which
   the brief explicitly asked to keep simple.
2. **Profile gained `email` and `bio` fields** beyond the minimal spec
   (name/skills/interests/availability), since the "Connect" action needed
   something real to connect *to*.
3. **No auth, no backend, no cross-device sync** — state is seeded demo data
   plus whatever the current browser has added, in `localStorage`. This was
   a deliberate scope cut for a demo, not an oversight: a real deployment
   would need a backend to make posted Needs/Profiles visible to other
   users at all.
4. **A Match is a computation, not a stored entity** — by design, per the
   brief, so there's no "match" table to keep in sync or go stale.
