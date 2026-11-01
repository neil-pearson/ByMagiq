/**
 * Fulfilment of a paid Stripe Checkout session (bm: Stripe webhook).
 *
 * Kept free of Stripe, Supabase and Resend imports: everything external comes
 * in through `FulfilmentDeps`, so the rules below can be unit tested with
 * plain fakes. The real dependencies are in lib/fulfilment-deps.ts.
 *
 * Rules:
 *  - Only a session with payment_status "paid" is fulfilled.
 *  - The order is recorded once per Stripe session id, and claimed for
 *    delivery atomically, so a duplicate or concurrent event never sends a
 *    second email.
 *  - If delivery cannot be completed (lookup fails, the item has no delivery
 *    content yet, or the email fails) the order is marked failed and the
 *    result is "retry": the webhook then answers with an error so Stripe
 *    sends the event again.
 *  - A paid session that can never be fulfilled (no email, no item id) is
 *    recorded as failed and answered with success, because retrying cannot
 *    fix it. It stays visible in the orders table.
 */

export type DeliveryType = "text" | "file";

export type CheckoutSessionLike = {
  id: string;
  payment_status: string;
  amount_total?: number | null;
  currency?: string | null;
  customer_details?: { email?: string | null } | null;
  metadata?: Record<string, string> | null;
};

export type Delivery = {
  deliveryType: DeliveryType;
  deliveryContent: string;
};

export interface FulfilmentDeps {
  /** Insert the order if this session id is new; do nothing if it exists. */
  recordOrder(session: CheckoutSessionLike): Promise<void>;
  /** True for exactly one caller per delivery attempt. */
  claimDelivery(sessionId: string): Promise<boolean>;
  /** Null when the item or its delivery content is missing. Throws on error. */
  getDelivery(promptId: string): Promise<Delivery | null>;
  sendEmail(args: {
    to: string;
    promptTitle: string;
    deliveryType: DeliveryType;
    deliveryContent: string;
  }): Promise<void>;
  markDelivered(sessionId: string): Promise<void>;
  markFailed(sessionId: string, reason: string): Promise<void>;
}

export type FulfilmentResult =
  | "delivered" // email sent
  | "duplicate" // already delivered or being delivered by another request
  | "ignored" // not paid, or can never be fulfilled; answer success
  | "retry"; // delivery did not complete; answer with an error

function message(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export async function fulfilCheckoutSession(
  session: CheckoutSessionLike,
  deps: FulfilmentDeps
): Promise<FulfilmentResult> {
  if (session.payment_status !== "paid") {
    console.warn(
      "Checkout session completed but not paid — not fulfilling",
      session.id,
      session.payment_status
    );
    return "ignored";
  }

  const email = session.customer_details?.email ?? null;
  const promptId = session.metadata?.promptId ?? null;
  const promptTitle = session.metadata?.promptTitle ?? "your purchase";

  await deps.recordOrder(session);

  if (!email || !promptId) {
    const reason = !email ? "no customer email" : "no promptId in metadata";
    console.error("Paid session cannot be fulfilled:", reason, session.id);
    await deps.markFailed(session.id, reason);
    return "ignored";
  }

  const claimed = await deps.claimDelivery(session.id);
  if (!claimed) return "duplicate";

  let delivery: Delivery | null;
  try {
    delivery = await deps.getDelivery(promptId);
  } catch (err) {
    console.error("Delivery lookup failed", session.id, promptId, err);
    await deps.markFailed(session.id, `delivery lookup failed: ${message(err)}`);
    return "retry";
  }

  if (!delivery) {
    console.error("Item has no delivery content", session.id, promptId);
    await deps.markFailed(session.id, "item has no delivery content");
    return "retry";
  }

  try {
    await deps.sendEmail({
      to: email,
      promptTitle,
      deliveryType: delivery.deliveryType,
      deliveryContent: delivery.deliveryContent,
    });
  } catch (err) {
    console.error("Fulfilment email failed to send", session.id, err);
    await deps.markFailed(session.id, `email failed: ${message(err)}`);
    return "retry";
  }

  try {
    await deps.markDelivered(session.id);
  } catch (err) {
    // The email is already sent. Do not retry the event over a bookkeeping
    // error, or the buyer could get a second email.
    console.error("Could not mark order delivered", session.id, err);
  }
  return "delivered";
}
