# Security Baseline

## Identity and access

- Prefer verified phone/email authentication; exact method is a product decision.
- Hash passwords with a modern password hashing algorithm if passwords are supported.
- Use secure, HttpOnly, SameSite cookies for browser sessions; avoid storing long-lived bearer tokens in localStorage.
- Enforce authorization in the API, not only by hiding UI controls.
- Separate customer, venue-operator, support, and platform-admin permissions.
- Require stronger authentication for privileged staff and sensitive operations.

## Application security

- Validate and normalize all input at the API boundary.
- Use parameterized database access; never concatenate user input into SQL.
- Apply rate limits to authentication, search, booking, and payment initiation.
- Protect state-changing cookie-authenticated endpoints against CSRF.
- Set secure headers and a restrictive Content Security Policy after auditing required third-party scripts.
- Keep secrets out of source control and logs.
- Restrict CORS to known web origins.
- Uploads require MIME/type validation, size limits, randomized storage keys, and malware scanning where supported.

## Payments

- Never store PAN, CVV, or raw card credentials.
- Verify provider callbacks server-side; verify webhook signatures and timestamps.
- Enforce idempotency and replay protection.
- Log provider references and safe metadata, not secrets or full payment payloads.

## Operations

- Keep development, staging, and production credentials and databases separate.
- Encrypt backups and test restoration.
- Patch dependencies and scan container images.
- Keep append-only audit events for staff actions, inventory changes, booking transitions, and payment events.
- Define incident response, access revocation, backup RPO/RTO, and retention policy before launch.
