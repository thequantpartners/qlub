# Roadmap

## In Process

- **QSS Landing + Quality Filter**
  - Objective: build a mobile-first application funnel that filters serious builders from low-signal applicants.
  - Acceptance criteria: visitor can complete filter questions, receive a qualification state, and submit an application.
  - Dependency: Foundation.
  - Current state: implemented and pushed to `main`, but still under product/design review.
  - Implemented:
    - Mobile-native no-scroll QSS flow.
    - Three commercial context screens before the application.
    - Fourth screen with swipe CTA to apply.
    - Dynamic application filter after the CTA.
    - Server Action submission flow.
    - Explainable application scoring.
    - Client-side heuristic validation to reject repeated or low-signal text before enabling swipe.
    - Form-only progress counter and progress bar.
  - Latest pushed commits:
    - `4977aab` - `Implement QSS application funnel`
    - `6b922e1` - `Refine QSS mobile application flow`
  - Verification:
    - `npm.cmd run lint` passed.
    - `npm.cmd run build` passed.
    - Browser mobile checks passed for the swipe flow and form transition.
  - Open review notes:
    - Landing is not approved yet.
    - Keep refining commercial clarity and mobile-native UX before closure.
    - Do not move to `Do Its` or update `project/changelog.md` until explicit `SI`.

## Pendent

- **Clerk + Supabase Identity Sync**
  - Objective: connect Google auth and persist member identity in Supabase.
  - Acceptance criteria: authenticated user has a local profile and role/status.
  - Dependency: Supabase project and Clerk app.

- **Feedback Credit Loop**
  - Objective: enforce give-feedback-to-receive-feedback behavior.
  - Acceptance criteria: members need credits to request feedback and earn credits by giving useful feedback.
  - Dependency: approved member flow.

- **Billing MVP**
  - Objective: add paid membership plans through Lemon Squeezy.
  - Acceptance criteria: subscription webhook updates local membership status.
  - Dependency: billing account and plan IDs.

## Do Its

- **Audit Report**
  - Objective: inspect the current QLUB repo and document risks, findings, fixes, and recommended action order.
  - Acceptance criteria: `project/audit-report.md` exists, includes severity-ranked findings, and records verification checks.
  - Dependency: Foundation.
  - Completed: 2026-05-13.

- **Foundation**
  - Objective: establish the QLUB project base with Next.js, Vercel deployment direction, architecture docs, and first product rules.
  - Acceptance criteria: app builds, core docs exist, first PRD/ADRs exist, and the initial landing direction is present.
  - Dependency: none.
  - Completed: 2026-05-13.
