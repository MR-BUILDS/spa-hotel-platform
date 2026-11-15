# Domain Model & Database Plan

**Status:** Conceptual v1 model; schema migrations are not yet generated.

## Design principles

- PostgreSQL is authoritative.
- Use UUID primary keys for externally referenced records.
- Use `created_at`, `updated_at`, and where appropriate `deleted_at` / `status`.
- Prefer explicit status enums and append-only event/audit records for critical workflows.
- Do not store localized copies in ad-hoc JSON blobs; use translation tables for editorial content.
- Use integer minor currency units and an explicit currency code.
- Store UTC instants as `timestamptz`; venue timezone is an IANA timezone string.

## Core entities

### Destination and property catalog

- `Destination`: id, slug, timezone, country_code, status.
- `DestinationTranslation`: destination_id, locale, name, description.
- `Property`: id, destination_id, type (`HOTEL` | `SPA`), slug, status, address, geo coordinates, timezone, contact details, publication state.
- `PropertyTranslation`: property_id, locale, name, summary, description, policies.
- `Amenity`: id, code, category.
- `AmenityTranslation`: amenity_id, locale, label.
- `PropertyAmenity`: property_id, amenity_id.
- `MediaAsset`: id, storage_key, media_type, dimensions, alt text by locale, sort order.
- `PropertyMedia`: property_id, media_asset_id, role, sort_order.

A property has exactly one primary type in v1. Hotel-specific and spa-specific details live in type-specific tables rather than a large table full of nullable columns.

### Hotel catalog and inventory

- `RoomType`: id, property_id, occupancy limits, bed configuration, status.
- `RoomTypeTranslation`: room_type_id, locale, name, description.
- `RatePlan`: id, room_type_id, cancellation policy reference, meal plan, status.
- `HotelInventoryDay`: id, rate_plan_id, service_date, total_units, held_units, booked_units, closed_to_arrival, closed_to_departure, minimum_nights.
- `HotelRateDay`: id, rate_plan_id, service_date, amount_minor, currency_code.

Enforce uniqueness on `(rate_plan_id, service_date)` for inventory and rate rows. Inventory counters must never become negative and must satisfy `held + booked <= total`.

### Spa catalog and inventory

- `SpaService`: id, property_id, duration_minutes, status.
- `SpaServiceTranslation`: spa_service_id, locale, name, description, preparation_notes.
- `SpaSession`: id, spa_service_id, starts_at, ends_at, capacity, status.
- `SpaSessionPrice`: id, spa_session_id or service/price scope, amount_minor, currency_code, valid period.

A spa session is a time-bounded capacity unit. A booking may contain one or more participants according to the service rules. Capacity changes and holds must be transactional.

### Identity, booking, and payment

- `User`: id, normalized phone/email, status, verification timestamps.
- `Role` / `UserRole`: customer and staff/admin permissions; least privilege.
- `Booking`: id, public reference, user_id, property_id, booking_type, status, currency_code, subtotal_minor, discount_minor, total_minor, expires_at, confirmed_at, cancelled_at.
- `BookingItem`: id, booking_id, item_type, source reference, service dates/session, quantity, unit_amount_minor, line_total_minor, immutable item snapshot.
- `InventoryHold`: id, booking_id, inventory reference, quantity, expires_at, released_at.
- `PaymentAttempt`: id, booking_id, provider, provider_reference, amount_minor, currency_code, status, idempotency_key, verified_at.
- `PaymentEvent`: id, payment_attempt_id, provider_event_id, event_type, received_at, payload_digest, processing_status.
- `Refund`: id, payment_attempt_id, amount_minor, status, provider_reference.
- `BookingStatusEvent`: id, booking_id, from_status, to_status, actor, reason, occurred_at.

### Trust and operations

- `Review`: id, booking_id, user_id, property_id, rating, body, moderation_status.
- `Promotion`: id, code, validity, usage limits, discount rules, status.
- `AuditLog`: id, actor_id, action, target_type, target_id, metadata, occurred_at. Treat as append-only at the application level.
- `OutboxEvent`: id, event_type, aggregate_id, payload, created_at, published_at, attempts.

## Important constraints and indexes

- Unique property slug within a destination and property type policy.
- Unique locale row per translation parent: `(parent_id, locale)`.
- Unique provider event id per provider to make webhooks idempotent.
- Unique idempotency key per payment provider/account scope.
- Index public properties by `(destination_id, type, publication_status)`.
- Index sessions by `(spa_service_id, starts_at, status)`.
- Index booking by `(user_id, created_at DESC)` and `(public_reference)`.
- Index inventory by `(rate_plan_id, service_date)`.
- Add database-level checks for non-negative amounts and capacity counters.

## Decisions still requiring business confirmation

1. Whether displayed prices and settlement are in IRR or IRT (rial or toman), and the exact conversion/display policy.
2. Whether a hotel booking is instantly confirmed or requires property-side acceptance.
3. Cancellation, no-show, refund, tax, and service-fee rules.
4. Whether one checkout may contain multiple properties or must be one property per booking.
5. Required customer identity fields and whether phone OTP is mandatory.
6. Whether hotel inventory is managed per physical room or pooled room-type allotment.
7. Whether spa sessions have participant-specific pricing or group/family packages.

Do not implement these assumptions silently. Record each confirmed business rule in an ADR or product decision log before coding it.
