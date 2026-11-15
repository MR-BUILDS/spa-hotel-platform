# Booking & Payment Lifecycle

## Shared checkout, separate inventory logic

Hotel and spa bookings share customer, checkout, payment, notification, and audit infrastructure. Their inventory allocation logic remains separate.

## Proposed booking states

`DRAFT → PENDING_PAYMENT → CONFIRMED`

Alternative terminal or exception states:

- `EXPIRED`
- `CANCELLED`
- `PAYMENT_FAILED`
- `REFUND_PENDING`
- `PARTIALLY_REFUNDED`
- `REFUNDED`
- `REQUIRES_REVIEW`

Transitions must be explicit and validated server-side. Do not allow arbitrary status updates from the client or admin UI.

## Direct booking sequence

1. Customer selects dates/room or a spa service/session.
2. API rechecks current availability and calculates the authoritative quote.
3. Customer details and policy acknowledgements are collected.
4. API creates a pending booking and a short-lived inventory hold in a database transaction.
5. API creates a payment attempt and redirects/opens the selected payment provider flow.
6. Provider returns the customer to the site. This return URL is not proof of payment.
7. API verifies payment server-to-server and/or processes a cryptographically verified webhook.
8. In an idempotent transaction, payment is marked verified, the hold is converted to booked inventory, and booking becomes confirmed.
9. Customer and venue receive appropriate confirmation notifications.
10. If payment is not verified before hold expiry, the hold is released and the booking expires. Late successful payments enter a reconciliation path; never silently oversell inventory.

## Concurrency requirements

- Lock the relevant inventory row(s) or use a conditional atomic update within a transaction.
- Check remaining capacity at the moment of allocation, not only at search time.
- Expire/release holds through a reliable scheduled worker or database-backed job process.
- Use idempotency keys for booking creation and payment initiation.
- Process provider webhooks exactly-once in effect, even if delivery is at-least-once.
- Add reconciliation tooling for payment success with booking/hold inconsistency.

## Hotel-specific allocation

For each night in the stay, verify inventory for the selected rate plan. A stay is available only if every required night can be allocated. Support minimum stay, closed-to-arrival/departure, occupancy, and cancellation policy rules when the business confirms them.

## Spa-specific allocation

Verify session state, start/end times, participant quantity, and remaining session capacity. A spa booking may include add-ons only after add-on capacity and pricing rules are defined.

## Payment provider boundary

Implement a provider adapter interface. The actual provider is not selected in this architecture document. Before implementation, verify merchant onboarding availability, API documentation, settlement currency, webhook signatures, refund support, sandbox access, and operational constraints for the project.
