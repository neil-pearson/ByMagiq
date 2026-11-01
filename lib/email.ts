import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * The "from" address. Set FULFILMENT_FROM_EMAIL in production to an address
 * on a sending domain verified in Resend, e.g. "ByMagiq <orders@yourdomain>".
 * Without it this falls back to the Resend sandbox sender, which can only
 * deliver to the Resend account owner's own address, so a real buyer's email
 * fails, the webhook answers with an error and Stripe retries until it is set.
 */
const FROM = process.env.FULFILMENT_FROM_EMAIL ?? "ByMagiq <onboarding@resend.dev>";

/**
 * Sends the post-purchase fulfillment email.
 *
 * Delivery content comes from the `prompts` table (`delivery_type` +
 * `delivery_content`): either the full prompt text, or a link to a
 * Storage file. The caller (lib/fulfilment.ts) never calls this without
 * delivery content, so a buyer never gets an empty "something went wrong"
 * email; a missing item is recorded and retried instead.
 *
 * Throws if Resend reports an error, so the caller can record the failure.
 */
export async function sendFulfillmentEmail({
  to,
  promptTitle,
  deliveryType,
  deliveryContent,
}: {
  to: string;
  promptTitle: string;
  deliveryType: "text" | "file";
  deliveryContent: string;
}) {
  const body =
    deliveryType === "file"
      ? `Thanks for buying "${promptTitle}".\n\nHere's your download link:\n${deliveryContent}\n\nIf the link doesn't work, just reply to this email and we'll sort it out.`
      : `Thanks for buying "${promptTitle}".\n\nHere's your prompt:\n\n${deliveryContent}`;

  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: `Your ByMagiq purchase: ${promptTitle}`,
    text: body,
  });

  // Resend's SDK returns { error } instead of throwing on API errors, so
  // without this an unsent email would look like a success.
  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}
