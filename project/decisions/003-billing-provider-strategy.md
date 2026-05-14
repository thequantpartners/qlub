# ADR-003 - Billing Provider Strategy

**Date:** 2026-05-13
**Status:** Accepted

## Context

The founder is in Peru, where Stripe is not the default practical choice. QLUB still needs to charge for memberships, ideally in USD.

## Options Considered

1. **Stripe** - Strong SaaS billing platform, but not suitable as the default for this founder's location.
2. **Mercado Pago** - Strong local/LATAM payment method support, useful for Peru and regional buyers.
3. **PayPal** - Useful fallback for international payments, but less ideal as the primary SaaS subscription system.
4. **Lemon Squeezy/Paddle** - Merchant of Record style platforms that simplify global SaaS payments and subscriptions.

## Decision

Use Lemon Squeezy first and isolate billing behind an internal provider adapter. Add Mercado Pago or PayPal later if the buyer base requires it.

## Justification

This gives QLUB the fastest path to USD subscription billing while keeping future payment options open.

## Consequences

**Positive:** faster subscription MVP, simpler tax/payment handling, easier global payments.

**Negative:** dependency on a third-party Merchant of Record platform.

**Neutral:** local payment methods may require a second provider later.
