# PRD - QLUB MVP

**ID:** 001
**Date:** 2026-05-13
**Status:** Draft

## Context

QLUB exists because builders often create systems, products, and businesses without early adopters, useful feedback, or a dense group of serious peers. The product must avoid becoming a broad social network. Its value depends on member quality.

## Problem Statement

If QLUB accepts low-signal members, the community will lose trust quickly. Members of quality create quality interactions. Therefore the MVP must prove the quality filter and feedback loop before building broad social features.

## Proposed Solution

Build a focused MVP:

1. QSS-style landing page.
2. Quality filter and application flow.
3. Approval states for applicants.
4. Private member area.
5. Project/progress publishing.
6. Feedback credit system.
7. Basic paid plans once interaction quality is proven.

## Acceptance Criteria

- [x] Visitor understands that QLUB is for serious builders within the first viewport.
- [x] Visitor can complete an application filter.
- [x] Application captures evidence of real building, feedback needs, and feedback capacity.
- [x] Applicant receives a filter status: rejected, waitlist, approved observer, or approved builder.
- [ ] Approved member can create a project.
- [ ] Member can publish progress updates.
- [ ] Member must give feedback before requesting feedback.
- [ ] Admin can review applications and moderation events.
- [ ] Paid plan status can be synced from the billing provider.
- [ ] Trusted member status can be granted after sustained high-signal member activity.

## Architecture Notes

- Use Next.js App Router on Vercel.
- Use Clerk for Google OAuth.
- Use Supabase Postgres for product data.
- Use Lemon Squeezy as the first billing provider.
- Keep billing behind an internal adapter to allow Mercado Pago or PayPal later.
- Keep application scoring explainable. Do not use opaque AI scoring as the only approval mechanism.

## Dependencies

- Clerk application and Google OAuth configuration.
- Supabase project.
- Lemon Squeezy store and webhook secret.
- Vercel project and environment variables.

## Risks

- **Low-quality applicants pass the filter:** mitigate with evidence-based questions, staged access, and admin review.
- **Members ask more than they give:** mitigate with feedback credits and visibility rules.
- **Billing provider constraints in Peru:** mitigate with Lemon Squeezy first and Mercado Pago/PayPal adapter later.
- **Overbuilding social features:** mitigate by delaying likes, follows, DMs, and broad feeds until the feedback loop works.

## Related ADRs

- `project/decisions/001-nextjs-vercel-stack.md`
- `project/decisions/002-quality-first-membership.md`
- `project/decisions/003-billing-provider-strategy.md`
