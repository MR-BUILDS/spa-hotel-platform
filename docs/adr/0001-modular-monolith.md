# ADR 0001: Modular Monolith

- **Status:** Accepted
- **Date:** 2026-11-15

## Context

The product needs several related domains (catalog, two inventory models, booking, payment, identity, reviews, admin) but begins with a focused destination and a small initial delivery team. Microservices would add deployment, observability, and data-consistency costs before there is evidence they are needed.

## Decision

Use one NestJS API application with explicit domain modules, deployed separately from the Next.js web application. Keep PostgreSQL as the system of record.

## Consequences

- Lower operational complexity for v1.
- Strong module boundaries are required to avoid a monolith becoming a tightly coupled codebase.
- A module can be extracted later only when scale, team ownership, or isolation requirements justify it.
