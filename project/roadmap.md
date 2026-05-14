# Roadmap

## In Process

- **Foundation**
  - Objective: establish the QLUB project base with Next.js, Vercel deployment direction, architecture docs, and first product rules.
  - Acceptance criteria: app builds, core docs exist, first PRD/ADRs exist, and the initial landing direction is present.
  - Dependency: none.

## Pendent

- **QSS Landing + Quality Filter**
  - Objective: build a mobile-first application funnel that filters serious builders from low-signal applicants.
  - Acceptance criteria: visitor can complete filter questions, receive a qualification state, and submit an application.
  - Dependency: Foundation.

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

No completed tasks yet. Move items here only after explicit closure confirmation.
