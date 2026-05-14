# ADR-002 - Quality-First Membership

**Date:** 2026-05-13
**Status:** Accepted

## Context

QLUB's main risk is not traffic or feature count. The main risk is accepting low-signal members and burning community trust.

## Options Considered

1. **Open signup** - Maximizes growth but invites low signal.
2. **Manual invite-only** - Strong quality control but slow and hard to scale.
3. **Application filter with staged access** - Balances quality control with scalable intake.

## Decision

Use an application filter with staged access states: rejected, waitlist, approved observer, approved builder, and trusted member.

## Justification

The product value depends on density of serious builders. Staged access allows QLUB to admit promising members without giving everyone full publishing power immediately.

## Consequences

**Positive:** protects the community and lets quality improve over time.

**Negative:** adds admin/review complexity.

**Neutral:** growth may be slower, intentionally.
