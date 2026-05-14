# Audit Report - QLUB

**Date:** 2026-05-13
**Mode:** AUDIT
**Environment:** Codex desktop, PowerShell, Next.js 16.2.6, React 19.2.4

## Executive Summary

QLUB esta en una base sana para continuar: `npm run lint`, `npm run build`, and `npm audit --audit-level=moderate` pass. The main risk is not current breakage, but that the next features touch auth, persistence, scoring, and billing while the repo still has no server-side authorization pattern, no lazy SDK/client wrappers, and no test harness.

## Scan Results

- **Structure:** Clear early Next.js App Router structure: `src/app`, `src/lib`, `project/*`.
- **Dependencies:** No audit vulnerabilities found. Some packages have newer latest versions, but no urgent upgrade is required.
- **Coupling and cohesion:** Current code is small. Product copy/data is centralized in `src/lib/qlub.ts`.
- **Security:** No real secrets found. Only `.env.example` and documentation placeholders reference keys.
- **Technical debt:** No TODO/FIXME/HACK markers found in source.
- **Testing:** No test framework, test files, or test script exist.
- **API and contracts:** README documents planned API responsibilities, but no Server Actions or Route Handlers exist yet.
- **Consistency:** ESLint and TypeScript are configured and passing.

## Findings

### CRITICAL

No critical issues found in the current codebase.

### HIGH

- **Quality filter is still static, not an application flow**
  - Location: `src/app/page.tsx:63`, `src/lib/qlub.ts:77`
  - Problem: The landing shows application questions, but users cannot answer them, receive a qualification state, or submit an application. This is the first pending roadmap item and the core product loop.
  - Fix:

```ts
// Create src/lib/application.ts
import { z } from "zod";

export const applicationSchema = z.object({
  builderName: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  building: z.string().trim().min(40).max(1200),
  evidence: z.string().trim().min(20).max(1200),
  feedbackNeed: z.string().trim().min(20).max(800),
  feedbackCapacity: z.string().trim().min(20).max(800),
  whyNow: z.string().trim().min(20).max(800),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

export type ApplicationDecision =
  | "rejected"
  | "waitlist"
  | "approved_observer"
  | "approved_builder";

export function scoreApplication(input: ApplicationInput): {
  score: number;
  decision: ApplicationDecision;
} {
  const evidenceScore = input.evidence.length >= 80 ? 30 : 15;
  const buildingScore = input.building.length >= 100 ? 25 : 10;
  const feedbackScore = input.feedbackCapacity.length >= 80 ? 25 : 10;
  const clarityScore = input.feedbackNeed.length >= 60 && input.whyNow.length >= 60 ? 20 : 8;
  const score = evidenceScore + buildingScore + feedbackScore + clarityScore;

  if (score >= 85) return { score, decision: "approved_builder" };
  if (score >= 65) return { score, decision: "approved_observer" };
  if (score >= 45) return { score, decision: "waitlist" };
  return { score, decision: "rejected" };
}
```

Then add a Server Action for submission and persistence before replacing the static question cards with a form:

```ts
// Create src/app/actions/apply-to-qlub.ts
"use server";

import { applicationSchema, scoreApplication } from "@/lib/application";

export type ApplyToQlubState = {
  ok: boolean;
  message: string;
  decision?: string;
  score?: number;
};

export async function applyToQlub(
  _prevState: ApplyToQlubState,
  formData: FormData,
): Promise<ApplyToQlubState> {
  const parsed = applicationSchema.safeParse({
    builderName: formData.get("builderName"),
    email: formData.get("email"),
    building: formData.get("building"),
    evidence: formData.get("evidence"),
    feedbackNeed: formData.get("feedbackNeed"),
    feedbackCapacity: formData.get("feedbackCapacity"),
    whyNow: formData.get("whyNow"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Completa la aplicacion con evidencia concreta antes de enviarla.",
    };
  }

  const result = scoreApplication(parsed.data);

  // Next step: persist parsed.data + result in Supabase.
  return {
    ok: true,
    message: "Aplicacion recibida.",
    decision: result.decision,
    score: result.score,
  };
}
```

- **No server-side authorization boundary exists yet**
  - Location: no `middleware.ts`, no `proxy.ts`, no protected Server Actions, no Route Handlers under `src/app`
  - Problem: The project has Clerk installed, but there is no reusable server-side guard for member-only actions. When private areas are added, relying only on middleware/proxy would violate the project rule and create authorization gaps.
  - Fix:

```ts
// Create src/lib/auth/require-user.ts
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function requireUser() {
  const session = await auth();

  if (!session.userId) {
    redirect("/sign-in");
  }

  return {
    userId: session.userId,
    sessionId: session.sessionId,
  };
}
```

Use it inside every protected Server Component, Server Action, and Route Handler:

```ts
import { requireUser } from "@/lib/auth/require-user";

export async function createProject() {
  "use server";

  const user = await requireUser();
  // Re-check role/status from Supabase here before writing.
  return user.userId;
}
```

- **External SDK clients are not isolated behind lazy wrappers**
  - Location: `package.json:15`, `package.json:16`, `package.json:17`, `.env.example:1`
  - Problem: Clerk, Supabase, and Lemon Squeezy are installed, but the repo does not yet define safe env parsing or lazy client factories. The project rule explicitly says SDK clients must not be initialized at module scope when env vars may be missing during `next build`.
  - Fix:

```ts
// Create src/lib/env.ts
import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

const serverEnvSchema = publicEnvSchema.extend({
  CLERK_SECRET_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  LEMONSQUEEZY_API_KEY: z.string().min(1),
  LEMONSQUEEZY_STORE_ID: z.string().min(1),
  LEMONSQUEEZY_WEBHOOK_SECRET: z.string().min(1),
});

export function getPublicEnv() {
  return publicEnvSchema.parse(process.env);
}

export function getServerEnv() {
  return serverEnvSchema.parse(process.env);
}
```

```ts
// Create src/lib/supabase/admin.ts
import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getServerEnv } from "@/lib/env";

export function createSupabaseAdminClient() {
  const env = getServerEnv();

  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
```

### MEDIUM

- **No test harness exists**
  - Location: `package.json:5`
  - Problem: Core behavior will include scoring, membership status, feedback credits, auth checks, and billing webhook mapping. Those rules need fast regression tests before implementation grows.
  - Fix:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

Start with unit tests for `scoreApplication`, feedback credit ledger math, and billing event mapping.

- **API responsibilities are documented but not implemented**
  - Location: `README.md:82`
  - Problem: README lists `applyToQlub`, `scoreApplication`, `publishProject`, `requestFeedback`, `submitFeedback`, and `syncBillingWebhook`, but no code contracts exist. This makes it easier for implementation to drift from the documented architecture.
  - Fix:
    1. Add `src/lib/application.ts` for `scoreApplication`.
    2. Add `src/app/actions/apply-to-qlub.ts` for application submission.
    3. Add route/webhook stubs only when the external service credentials exist.
    4. Update README after the first real Server Action lands.

- **Dependency drift should be controlled before adding integrations**
  - Location: `package.json:15`
  - Problem: `npm outdated` reports newer latest versions for React, React DOM, ESLint, TypeScript, and `@types/node`. This is not currently a failure, but broad caret ranges on integration libraries can allow non-reviewed minor changes.
  - Fix:
    1. Keep `next` and `eslint-config-next` pinned together at `16.2.6`.
    2. Do not jump to major versions of TypeScript, ESLint, or Node types during feature work.
    3. Before implementing auth/billing, pin integration SDKs if stability matters:

```json
{
  "dependencies": {
    "@clerk/nextjs": "7.3.3",
    "@lemonsqueezy/lemonsqueezy.js": "4.0.0",
    "@supabase/supabase-js": "2.105.4"
  }
}
```

- **Pricing and entitlement copy still contains placeholders**
  - Location: `src/lib/qlub.ts:41`, `src/lib/qlub.ts:44`, `src/lib/qlub.ts:47`
  - Problem: `TBD / mes` and `Hasta N proyectos` are visible product promises. That is acceptable for foundation, but should not ship once Billing MVP begins.
  - Fix:
    1. Define initial plan IDs, prices, and limits in a typed plan config.
    2. Keep display copy and entitlement logic sourced from the same config.
    3. Add Lemon Squeezy variant IDs only through env/server config, not client code.

### LOW

- **No CI workflow is present**
  - Location: no `.github/workflows/*`
  - Problem: Local lint/build pass, but future changes can merge without automated checks.
  - Fix:

```yaml
# Create .github/workflows/ci.yml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run build
```

- **`CLAUDE.md` is only an alias file**
  - Location: `CLAUDE.md:1`
  - Problem: It points to `@AGENTS.md`, which may be fine for compatible tools, but it is not self-explanatory in tools that do not resolve that syntax.
  - Fix: Either keep it intentionally as a tool alias or replace it with a one-line Markdown link: `See AGENTS.md`.

## Recommended Action Order

1. Implement `QSS Landing + Quality Filter` as the next feature, starting with `src/lib/application.ts` and a Server Action.
2. Add `requireUser()` and use it from the first protected Server Component/Action instead of relying only on middleware/proxy.
3. Add lazy env and SDK client wrappers before Supabase or Lemon Squeezy are used.
4. Add Vitest and cover application scoring before adding feedback credits or billing webhooks.
5. Add CI once the first feature branch workflow exists.

## Verification Run

```txt
npm.cmd run lint                  PASS
npm.cmd run build                 PASS
npm.cmd audit --audit-level=moderate  PASS, 0 vulnerabilities
npm.cmd outdated                  Informational: newer latest versions exist
rg TODO/FIXME/HACK                No source debt markers found
rg secrets                        No real secrets found
```

## Next Step

Switch back to CONTINUATION mode and build **QSS Landing + Quality Filter** first. That task should include validation, scoring, application submission, and a minimal persistence boundary ready for Supabase.

## Post-Audit Implementation Update

**Date:** 2026-05-13
**Mode:** CONTINUATION

The **QSS Landing + Quality Filter** finding is now partially implemented and pushed to `main`, but it is intentionally still in process.

Implemented:

- Mobile-native no-scroll QSS flow.
- Three commercial context screens before the application.
- Fourth screen with swipe CTA to apply.
- Dynamic application filter after the CTA.
- Server Action submission flow.
- Explainable application scoring.
- Client-side heuristic validation before enabling the filter swipe.
- Form-only progress counter and progress bar.

Latest pushed commits:

- `4977aab` - `Implement QSS application funnel`
- `6b922e1` - `Refine QSS mobile application flow`

Remaining before closure:

- Continue product/design review of landing clarity.
- Keep `QSS Landing + Quality Filter` in `project/roadmap.md` under `In Process`.
- Do not update `project/changelog.md` or move the task to `Do Its` until the user explicitly answers `SI` to the closure question.
