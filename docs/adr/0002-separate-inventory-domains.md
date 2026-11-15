# ADR 0002: Separate Hotel and Spa Inventory Domains

- **Status:** Accepted
- **Date:** 2026-11-15

## Context

Hotel inventory is consumed across consecutive nights and usually depends on room type and rate plan. Spa inventory is consumed from a time-bounded session capacity. Their allocation constraints are materially different.

## Decision

Model hotel date inventory and spa session capacity separately. Share checkout, customer, payment, notification, and audit infrastructure only where semantics genuinely match.

## Consequences

- Domain rules remain explicit and testable.
- Search and checkout can present a unified customer experience without flattening inventory semantics.
- Additional work is needed to support a multi-property cart; this is not assumed for v1.
