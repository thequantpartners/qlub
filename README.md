# QLUB

QLUB is a private community for builders and entrepreneurs who are building a real system, product, or business. The product is designed around density of quality members, not raw member count.

The central rule is: give useful feedback to receive useful feedback.

## Problem

Builders often work alone, without early adopters, useful feedback, or a trusted group that understands what it means to build before things look polished. Public communities usually optimize for volume, visibility, and noise. QLUB optimizes for seriousness, evidence, and reciprocal progress.

## Audience

- Builders with a shipped product, prototype, internal system, or active build process.
- Entrepreneurs validating or operating a real business.
- People able to show evidence of progress and give concrete feedback to others.

QLUB is not for spectators, idea collectors, or low-signal applicants.

## Core Workflow

1. Visitor lands on a QSS-style landing page.
2. Visitor answers the quality filter.
3. The system scores evidence, seriousness, reciprocity, and clarity.
4. A qualified applicant applies to QLUB.
5. Approved members enter the private product.
6. Members give feedback before requesting feedback.
7. Members publish projects, progress updates, and feedback requests.

## Stack

- Framework: Next.js `16.2.6` with App Router.
- Runtime: React `19.2.4`.
- Styling: Tailwind CSS `4`.
- Auth: Clerk with Google OAuth.
- Database: Supabase Postgres.
- Billing: Lemon Squeezy first. Mercado Pago or PayPal can be added through a billing provider adapter later.
- Validation: Zod.
- Icons: lucide-react.
- Deployment: Vercel.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Create `.env.local` from `.env.example`.

| Name | Purpose | Example |
| --- | --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk browser key | `pk_test_...` |
| `CLERK_SECRET_KEY` | Clerk server key | `sk_test_...` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://example.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | `eyJ...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only admin access | `eyJ...` |
| `LEMONSQUEEZY_API_KEY` | Billing API key | `...` |
| `LEMONSQUEEZY_STORE_ID` | Store identifier | `12345` |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Webhook signature secret | `whsec_...` |

Never expose service-role or billing secrets in client components.

## Architecture By Layer

### Presentation

Next.js App Router pages and components. The landing follows the Quant Sales System direction: one clear idea per step, mobile-first, and conversion toward application.

### Business Logic

Domain rules live outside UI components:

- Application quality filter.
- Member status transitions.
- Feedback credit ledger.
- Plan entitlement checks.
- Project and progress publishing rules.

### Data

Supabase Postgres stores users, applications, projects, progress updates, feedback, memberships, and moderation events.

### Infrastructure

- Vercel hosts the Next.js app.
- Clerk handles authentication and Google OAuth.
- Supabase stores product data.
- Lemon Squeezy handles subscriptions and billing webhooks.

## Main API Responsibilities

Implemented surfaces:

- `scoreApplication`: calculates an explainable quality score from project evidence, feedback need, reciprocity, and timing.
- `applyToQlub`: validates application answers, runs scoring, returns a qualification status, and creates a server-side submission ID.

Planned API/Server Action surfaces:

- Supabase-backed application persistence for `applyToQlub`.
- `publishProject`: creates a member project.
- `requestFeedback`: requires enough feedback credits before requesting.
- `submitFeedback`: records useful feedback and updates feedback credit.
- `syncBillingWebhook`: maps Lemon Squeezy subscription events to local membership state.

## Data Model Overview

Initial entities:

- `users`: Clerk identity mirror and public member profile.
- `applications`: application answers, score, status, reviewer notes.
- `projects`: member projects/systems/businesses.
- `progress_updates`: dated updates attached to projects.
- `feedback`: structured feedback given by members.
- `feedback_credits`: ledger for give-to-receive mechanics.
- `memberships`: plan, billing provider, subscription status.
- `moderation_events`: quality and trust interventions.

## Deployment

Vercel is the deployment target. Use Git integration for previews and production deploys. Vercel should own environment variables for production and preview.

Recommended flow:

1. Connect the GitHub repo to Vercel.
2. Set production and preview env vars in Vercel.
3. Let every branch create a preview deployment.
4. Promote only after `npm run build` and critical user flows pass.

## Project Docs

- `AGENTS.md`
- `project/roadmap.md`
- `project/changelog.md`
- `project/prd/001-qlub-mvp.md`
- `project/decisions/001-nextjs-vercel-stack.md`
- `project/decisions/002-quality-first-membership.md`
- `project/decisions/003-billing-provider-strategy.md`
