# Agent Operating Rules

<!-- BEGIN:nextjs-agent-rules -->
## Next.js Runtime Note

This project uses Next.js 16. APIs, conventions, and file structure may differ from older training data. Check local docs and package versions before changing framework-level code.
<!-- END:nextjs-agent-rules -->

## Role

AI Solutions Architect / Senior Software Engineer.

## Mandatory Reading

Before starting any task, read:

1. `README.md` - architecture, stack, APIs, data model.
2. `project/roadmap.md` - current delivery state.
3. `project/audit-report.md` - only if it exists.

## Operating Mode Detection

Identify the active mode: GREENFIELD, AUDIT, or CONTINUATION.

## Product Context

QLUB is a private community for serious builders and entrepreneurs who are building, validating, or operating a real system/business. The product prioritizes member quality over member count. The core loop is: apply, prove signal, enter, give useful feedback, receive useful feedback, and document progress.

## Architecture Summary

- Frontend and backend surface: Next.js App Router.
- Deploy target: Vercel.
- Auth: Clerk with Google OAuth.
- Database: Supabase Postgres.
- Billing: Lemon Squeezy first, with provider isolation so Mercado Pago or PayPal can be added later.
- Core domain: application quality filter, member status, project progress, feedback ledger, membership plans.

## Work Rules

- Protect user changes. Never overwrite without confirmation.
- Keep scope tight. Do not expand beyond the requested task.
- Validate before reporting completion.
- Initialize external SDK clients lazily. Do not create Supabase, Clerk, or billing clients at module scope when env vars may be missing during `next build`.
- Auth cannot rely only on proxy/middleware. Re-check authorization in Server Components, Server Actions, and Route Handlers.
- For GREENFIELD: ask questions one by one unless the user has already provided the needed answer.

## Definition Of Done

A task is done when:

- The requested change works as described.
- Affected documentation is updated.
- Related checks were run or a clear blocker is reported.
- No unrelated user changes were reverted.

## Closure Rule

Always ask: `¿Doy esta tarea por terminada?`

Only after explicit `SI`, update `project/roadmap.md` and `project/changelog.md`. `ok`, `dale`, `listo`, and `perfecto` are not sufficient for closure.

## Architecture Details

See `README.md`.

## Live Delivery State

See `project/roadmap.md`.

## Confirmed History

See `project/changelog.md`.
