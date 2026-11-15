# Delivery Roadmap

## Milestone 0 — Architecture foundation (current)

- [x] Confirm Sarein as v1 destination.
- [x] Confirm direct online booking as product direction.
- [x] Confirm new brand direction.
- [x] Select modular monolith and TypeScript stack.
- [x] Establish repository layout and architecture documents.
- [ ] Approve remaining business rules listed in `DATABASE.md`.

## Milestone 1 — Runnable foundation

- [ ] Bootstrap Next.js 16 web app and NestJS 12 API.
- [ ] Add pnpm workspace and lockfile.
- [ ] Add Docker Compose PostgreSQL service and health check.
- [ ] Add environment validation and `/health` endpoints.
- [ ] Add lint, format, typecheck, and test commands.
- [ ] Add CI workflow.

## Milestone 2 — Design system and brand

- [ ] Choose final brand name and domain strategy.
- [ ] Create logo and visual identity.
- [ ] Validate palette contrast and typography.
- [ ] Build responsive shell, navigation, footer, and core primitives.
- [ ] Prototype signature water interaction and measure performance.

## Milestone 3 — Catalog and discovery

- [ ] Destination and property data model/migrations.
- [ ] Admin content management for venues.
- [ ] Localized hotel and spa detail pages.
- [ ] Search, filters, sorting, comparison.
- [ ] Media storage and image optimization.

## Milestone 4 — Booking foundation

- [ ] Confirm pricing, cancellation, inventory, and acceptance rules.
- [ ] Hotel room/rate/inventory workflows.
- [ ] Spa service/session/capacity workflows.
- [ ] Booking state machine and inventory holds.
- [ ] Payment provider selection and sandbox integration.
- [ ] Webhook verification, idempotency, and reconciliation.

## Milestone 5 — Customer and operations

- [ ] Authentication and customer profile.
- [ ] Booking history and cancellation flows.
- [ ] Notifications.
- [ ] Reviews and moderation.
- [ ] Staff/admin roles and audit log.

## Milestone 6 — Launch readiness

- [ ] Automated unit, integration, and end-to-end tests.
- [ ] Load and concurrency tests for booking inventory.
- [ ] Security review and dependency/container scans.
- [ ] SEO and structured-data validation.
- [ ] Accessibility review (WCAG 2.2 AA target).
- [ ] Backup restoration drill and incident runbook.
- [ ] Production deployment and monitoring.
