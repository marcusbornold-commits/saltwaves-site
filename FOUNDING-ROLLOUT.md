# Fixed 20-place Founding offer

Prepared locally on 2026-09-15; database migration and production rollout are not performed by this patch.

- Fixed $129 offer. T2 is removed from new checkout allowlists; old webhook recognition is preserved.
- Exactly 20 database slot rows, with a database constraint preventing slot 21.
- A transaction locks the inventory before assigning a place. A concurrent attempt cannot claim the same slot; an existing owner's reservation is reused.
- Open Stripe Checkouts occupy places. Only confirmed expired sessions release a place. Complete-but-unpaid sessions stay held. Paid places are never recycled automatically, including refunds.
- Stripe creation uses a reservation-specific idempotency key, persisted expiry/customer and common main-domain return URLs.
- A network failure or uninitialized/missing inventory closes Founding checkout. Other subscription checkout remains available.

## Deployment order

1. Apply scripts/20260915_founding_inventory.sql to the shared Supabase project. It starts closed. Do not manually set initialized=true yet.
2. Deploy the guarded checkout plus its dependencies to BOTH saltwaves-site and saltwaves-services. The latter still has a public legacy checkout endpoint. Only the checkout/inventory modules need changing there; preserve Earselect, cron, auth and its existing webhook.
3. Confirm neither domain can create a new Founding checkout while the inventory is closed. Existing Stripe sessions may still complete: import them, do not ignore them.
4. Run scripts/initialize-founding-inventory.cjs with the existing production environment, first without --apply. It imports historical current/archived Founding prices, paid and pending sessions, and checks current lifetime members. It prints counts only. Any unmatched or duplicate records require reconciliation; do not skip them.
5. Run with --apply only once the dry run reconciles. This enables admission after import. No purchase is made by the script.
6. Verify availability and closed/held/sold responses, original memberships, other subscriptions and Earselect. Do not make a real charge as a test.

## Recovery

A reservation with no session_id can result from an ambiguous Stripe response. It stays held. Locate the Stripe session by metadata.founding_reservation and bind it. Release only after proving that no payable session exists; if a session exists, it must be confirmed expired before release. A local clock timeout is not sufficient.

The previous webhook still grants access; inventory state is reconciled from Stripe before future admission and page counts. Delayed payment settlement continues holding capacity.

## Validation boundary

Build/type checking and local tests cover the frontend logic. Production database migration, legacy-session reconciliation and dual-domain rollout are required before the 20-place guarantee is live. Do not publish only the main-domain patch and claim the offer is globally capped.

## Confirmed membership baseline

Marcus explicitly confirmed that the two existing Supabase lifetime members
are the Founding baseline and requested 18 places open for purchase. Use
scripts/20260915_open_founding_from_members.sql for this one-time initialization.
It refuses to run unless exactly two members exist, all 20 slots are empty,
and the inventory is still closed. It preserves both memberships and enables
admission atomically. The Stripe-import procedure above is superseded for this
baseline by Marcus's explicit instruction.
