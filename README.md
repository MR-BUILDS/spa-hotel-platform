# SPA & HOTEL — Sarein

A multilingual discovery, comparison, and direct-booking platform for hotels and thermal wellness venues in Sarein, Iran.

> Product codename: **MINERAL FLOW** (working design direction; not the final public brand name).

## Product decisions

- Initial destination: Sarein. The domain model supports additional destinations later.
- Product: discovery + comparison + direct online booking.
- Languages: Persian (`fa`, default, RTL), English (`en`, LTR), Turkish (`tr`, LTR). The language set is configurable.
- Booking: direct booking with online payment; hotel inventory and spa session inventory are separate domain workflows.
- Architecture: modular monolith, split into a web app and an API app in one TypeScript monorepo.

## Technology baseline

- Web: Next.js 16, React, TypeScript.
- API: NestJS 12, TypeScript, REST API under `/api/v1`.
- Data: PostgreSQL, Prisma ORM 7 (stable line).
- Workspace: pnpm workspaces.
- Local infrastructure: Docker Compose.
- Redis: deferred until a measured need for distributed caching, queues, or short-lived coordination exists. PostgreSQL remains the source of truth.

Versions are a proposed baseline as of 2026-11-15. Pin exact patch versions in the lockfile during bootstrap; do not use floating `latest` tags in production.

## Repository layout

```text
apps/
  web/                 Next.js public website and customer account experience
  api/                 NestJS REST API and domain modules
packages/
  ui/                  Shared design-system components
  contracts/           Shared API DTOs and validation contracts
  i18n/                Locale metadata, message conventions, formatting helpers
infra/
  docker/              Container-related configuration
  database/            SQL notes, seeds, and database operations
legacy/
  original-upload/     Untouched snapshot of the supplied HTML/CSS/JS prototype
docs/
  adr/                 Architecture Decision Records
```

## Getting started

This commit is the architecture and repository foundation. App bootstrapping is the next implementation step.

Prerequisites planned for local development:

- Node.js 22.12+ (use a supported LTS release)
- pnpm 10+
- Docker Desktop / Docker Engine with Compose

Once app manifests and the first runnable apps are added:

```bash
pnpm install
docker compose up -d postgres
pnpm dev
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Domain model and database](docs/DATABASE.md)
- [Booking and payment lifecycle](docs/BOOKING-FLOW.md)
- [Internationalization](docs/I18N.md)
- [Design system](docs/DESIGN-SYSTEM.md)
- [Security baseline](docs/SECURITY.md)
- [Deployment and environments](docs/DEPLOYMENT.md)
- [Roadmap](docs/ROADMAP.md)
- [Architecture decisions](docs/adr/)

## Important scope boundary

No real venue, room, price, availability, payment provider, or legal policy is assumed by this repository. Those require verified business input before production configuration. Payment integration must use a provider legally and operationally available to the project in Iran.
