import { getAdminClient } from "@/lib/supabase-admin";
import { sendFulfillmentEmail } from "@/lib/email";
import type {
  CheckoutSessionLike,
  Delivery,
  FulfilmentDeps,
} from "@/lib/fulfilment";

/**
 * Real dependencies for lib/fulfilment.ts. Server only: uses the service-role
 * Supabase client and the Resend key. Needs scripts/sql/010 to have been run
 * (the `orders` table and the claim_order_delivery function).
 */
export function getFulfilmentDeps(): FulfilmentDeps {
  return {
    async recordOrder(session: CheckoutSessionLike) {
      const { error } = await getAdminClient()
        .from("orders")
        .upsert(
          {
            stripe_session_id: session.id,
            prompt_id: session.metadata?.promptId ?? null,
            email: session.customer_details?.email ?? null,
            amount_total: session.amount_total ?? null,
            currency: session.currency ?? null,
          },
          { onConflict: "stripe_session_id", ignoreDuplicates: true }
        );
      if (error) throw new Error(`Could not record order: ${error.message}`);
    },

    async claimDelivery(sessionId: string) {
      const { data, error } = await getAdminClient().rpc(
        "claim_order_delivery",
        { p_session_id: sessionId }
      );
      if (error) throw new Error(`Could not claim order: ${error.message}`);
      return data === true;
    },

    async getDelivery(promptId: string): Promise<Delivery | null> {
      // Delivery details are not readable with the public key (scripts/sql/005).
      const { data, error } = await getAdminClient()
        .from("prompts")
        .select("delivery_type, delivery_content")
        .eq("id", promptId)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) return null;
      const type = data.delivery_type;
      const content = data.delivery_content;
      if (
        (type !== "text" && type !== "file") ||
        typeof content !== "string" ||
        content.trim() === ""
      ) {
        return null;
      }
      return { deliveryType: type, deliveryContent: content };
    },

    sendEmail: sendFulfillmentEmail,

    async markDelivered(sessionId: string) {
      const now = new Date().toISOString();
      const { error } = await getAdminClient()
        .from("orders")
        .update({
          status: "delivered",
          delivered_at: now,
          updated_at: now,
          last_error: null,
        })
        .eq("stripe_session_id", sessionId);
      if (error) throw new Error(error.message);
    },

    async markFailed(sessionId: string, reason: string) {
      const { error } = await getAdminClient()
        .from("orders")
        .update({
          status: "failed",
          last_error: reason.slice(0, 500),
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_session_id", sessionId);
      if (error) throw new Error(error.message);
    },
  };
}
