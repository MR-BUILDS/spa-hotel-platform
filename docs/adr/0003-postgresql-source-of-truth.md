# ADR 0003: PostgreSQL as System of Record

- **Status:** Accepted
- **Date:** 2026-11-15

## Context

Bookings, inventory, and payments require relational integrity, transactions, and concurrency controls.

## Decision

Use PostgreSQL as the authoritative store. Search indexes and caches, if added later, are derived and rebuildable.

## Consequences

- Inventory allocation and booking transitions can be coordinated transactionally.
- Search begins with PostgreSQL capabilities; a dedicated search service is deferred until justified.
