# System Architecture

**Status:** Baseline approved for v1  
**Date:** 2026-11-15

## 1. Product boundary

SPA & HOTEL v1 is a Sarein-focused multilingual platform for discovering and comparing hotels and thermal/spa venues, then completing direct bookings online. The system is designed so that additional destinations can be added without redesigning the core domain model.

The product has two inventory domains:

1. **Hotel inventory:** property → room type → rate plan → date-based availability.
2. **Spa inventory:** venue → service/product → session/time slot → capacity-based availability.

They may share checkout, payment, customer, notification, and booking infrastructure, but their availability rules must not be forced into one generic inventory table.

## 2. Architecture style

Use a **Modular Monolith** initially. Deploy the web application and API as separate applications, while keeping the API domain in one deployable NestJS service. Do not introduce microservices, Kafka, Kubernetes, or Redis before measurable requirements justify them.

```text
Browser / Mobile Web
        |
        v
Next.js Web (SSR / RSC / localized routes)
        |
        | HTTPS JSON REST /api/v1
        v
NestJS API
  ├── Identity & Access
  ├── Destinations
  ├── Properties (hotels / spa venues)
  ├── Catalog & Media
  ├── Hotel Inventory
  ├── Spa Sessions & Capacity
  ├── Pricing & Promotions
  ├── Booking & Checkout
  ├── Payments
  ├── Reviews
  ├── Notifications
  └── Admin & Audit
        |
        v
PostgreSQL (system of record)
        |
        +---- Object Storage (media; provider to be selected)
        +---- Payment Gateway (provider to be selected)
```

## 3. Application responsibilities

### `apps/web`

- Public, indexable destination and venue pages.
- Search, filters, sorting, comparison.
- Localized pages and metadata.
- Customer registration, sign-in, profile, booking history.
- Booking selection and checkout UX.
- Admin UI may be a protected route group initially; business logic remains in the API.

### `apps/api`

- Authentication, authorization, validation, rate limits.
- All authoritative pricing, availability, booking, and payment decisions.
- REST API versioning (`/api/v1`).
- Transactional persistence and audit events.
- Provider adapters for payment, email/SMS, and media storage.

### Shared packages

- `packages/ui`: visual primitives and components, not page-specific business logic.
- `packages/contracts`: API request/response contracts and shared validation schemas.
- `packages/i18n`: supported locale metadata and shared formatting conventions.

Avoid importing server-only code into the web bundle. Shared packages must declare explicit exports and keep dependency direction one-way.

## 4. Domain module boundaries

Each NestJS module owns its application services, domain rules, persistence access, and API surface. Modules communicate through exported application services or domain events, not by reaching into another module's private repositories.

| Module | Owns |
|---|---|
| Identity | users, sessions, credentials, roles |
| Destinations | city/area metadata; Sarein is the initial destination |
| Properties | hotels, spa venues, facilities, policies, translations |
| Hotel Inventory | room types, rate plans, date inventory |
| Spa Scheduling | services, sessions, slot capacity |
| Pricing | price rules, taxes/fees, promotions, currency representation |
| Booking | booking state machine, holds, cancellation rules |
| Payments | payment attempts, provider references, verified webhooks, refunds |
| Reviews | verified-stay/visit reviews and moderation |
| Notifications | transactional email/SMS messages and delivery state |
| Admin & Audit | back-office operations and immutable audit records |

## 5. Core engineering rules

- PostgreSQL is the source of truth for bookings, payment state, and inventory.
- The browser never calculates an authoritative final price or confirms availability.
- All money values use integer minor units (e.g. rial/toman policy must be decided explicitly) plus an ISO currency code; never use floating-point arithmetic.
- Store timestamps in UTC; store venue timezone explicitly (initially `Asia/Tehran`) and render in the venue's local timezone.
- Use database transactions and concurrency controls for inventory holds and booking confirmation.
- Payment status changes only after server-side provider verification or a verified webhook.
- Make webhook handling idempotent.
- Keep audit records for administrative changes, booking state changes, and payment events.
- All public list endpoints are paginated and have bounded page sizes.
- API errors use a consistent, documented envelope and stable machine-readable codes.

## 6. Search and SEO

For v1, start with PostgreSQL indexes and full-text/trigram search where appropriate. Do not add Elasticsearch/OpenSearch until search relevance, volume, or latency demonstrates the need.

Public pages should use server rendering, canonical URLs, localized metadata, sitemap generation, robots directives, structured data only where the underlying facts are verified, and stable slugs. Never publish fabricated ratings, prices, availability, or reviews for SEO.

## 7. Non-functional targets (initial engineering objectives)

These are targets to validate, not claims of achieved performance:

- Mobile-first responsive UI.
- Core public pages should remain usable on constrained mobile networks.
- Avoid shipping the water simulation to devices that cannot sustain it; provide a static fallback.
- No unbounded animation loops; pause off-screen and when the document is hidden.
- Accessibility target: WCAG 2.2 AA as a project objective.
- Availability, RPO, RTO, and load targets must be set before production launch based on hosting and business requirements.
