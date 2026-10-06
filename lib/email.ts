import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends the post-purchase fulfillment email.
 *
 * Delivery content comes from the `prompts` table (`delivery_type` +
 * `delivery_content`): either the full prompt text, or a link to a
 * Storage file.
 */
export async function sendFulfillmentEmail({
  to,
  promptTitle,
  deliveryType,
  deliveryContent,
}: {
  to: string;
  promptTitle: string;
  deliveryType: "text" | "file" | null;
  deliveryContent: string | null;
}) {
  const body =
    deliveryContent && deliveryType === "file"
      ? `Thanks for buying "${promptTitle}".\n\nHere's your download link:\n${deliveryContent}\n\nIf the link doesn't work, just reply to this email and we'll sort it out.`
      : deliveryContent && deliveryType === "text"
      ? `Thanks for buying "${promptTitle}".\n\nHere's your prompt:\n\n${deliveryContent}`
      : `Thanks for buying "${promptTitle}".\n\nSomething went wrong generating your delivery content — reply to this email and we'll get it sorted right away.`;

  await resend.emails.send({
    // resend.dev sandbox sender — works with no domain verification.
    // Replace with a verified ByMagiq sending domain before going live.
    from: "ByMagiq <onboarding@resend.dev>",
    to,
    subject: `Your ByMagiq purchase: ${promptTitle}`,
    text: body,
  });
}
