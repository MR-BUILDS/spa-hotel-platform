# Environments & Deployment

## Environments

| Environment | Purpose | Data |
|---|---|---|
| Local | Feature development | Synthetic seed data |
| Test/CI | Automated tests and migrations | Ephemeral isolated database |
| Staging | Production-like acceptance tests | Synthetic or masked data only |
| Production | Real customers and bookings | Protected live data |

Never point local or staging applications at the production database.

## Container plan

Docker Compose is for local development and controlled single-host deployments where appropriate. Production topology must be selected after hosting, traffic, backup, and operational constraints are confirmed.

PostgreSQL is required. Redis is optional and deferred. Use managed or separately operated object storage for media; do not store uploaded media inside ephemeral application containers.

## Production requirements

- TLS for all public and internal service traffic.
- Automated database backups with tested restore procedures.
- Database migrations run as a controlled release step, not concurrently from every application replica.
- Health/readiness endpoints and structured logs.
- Error tracking and uptime monitoring.
- Separate secret management per environment.
- Rollback strategy for web and API deployments.
- Payment webhook endpoint must be publicly reachable and monitored.

## Hosting decision gate

Before selecting a production provider, verify:

- Node.js runtime or container support.
- Persistent PostgreSQL storage and reliable backups.
- TLS, domain, DNS, and outbound connectivity.
- Payment provider reachability and webhook delivery.
- Media storage and CDN options.
- Data residency, legal, and operational requirements.
- Whether the platform must remain operational during international connectivity disruption.

The supplied legacy prototype does not establish any of these hosting capabilities.
