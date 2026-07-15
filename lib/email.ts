import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends the post-purchase fulfillment email.
 *
 * PLACEHOLDER PAYLOAD: this does not yet deliver real prompt content.
 * The `prompts` table has no field to hold what a buyer actually
 * receives (full text, or a Storage file link) — that's a follow-up
 * task, not this one. See ByMagiq-Website/tasks.md.
 */
export async function sendFulfillmentEmail({
  to,
  promptTitle,
}: {
  to: string;
  promptTitle: string;
}) {
  await resend.emails.send({
    // resend.dev sandbox sender — works with no domain verification.
    // Replace with a verified ByMagiq sending domain before going live.
    from: "ByMagiq <onboarding@resend.dev>",
    to,
    subject: `Your ByMagiq purchase: ${promptTitle}`,
    text: `Thanks for buying "${promptTitle}".\n\nThis is a placeholder fulfillment email — real prompt delivery isn't wired up yet.`,
  });
}
