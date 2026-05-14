# ADR-001 - Next.js And Vercel Stack

**Date:** 2026-05-13
**Status:** Accepted

## Context

QLUB needs a fast solo-builder stack for landing, application flow, private product, API handlers, auth integration, billing webhooks, and deployment previews.

## Options Considered

1. **Next.js on Vercel** - Full-stack React framework with App Router, route handlers, server actions, previews, and zero-config deployment.
2. **Separate frontend and backend** - More explicit service boundaries, but slower for a solo founder.
3. **No-code/community platform first** - Faster to fake community, but weaker for custom filter, feedback credits, and future product logic.

## Decision

Use Next.js App Router deployed on Vercel.

## Justification

This gives QLUB a single codebase, quick iteration, production previews, integrated webhooks, and a clear path from landing to private app without creating backend complexity too early.

## Consequences

**Positive:** fast MVP delivery, easy previews, one deployment target.

**Negative:** strong coupling to the Next.js/Vercel model.

**Neutral:** future heavy real-time features may need separate services or Supabase realtime patterns.
