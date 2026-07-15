import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { sendFulfillmentEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email;
    const promptTitle = session.metadata?.promptTitle ?? "your purchase";

    if (!email) {
      console.error(
        "checkout.session.completed had no customer email — skipping fulfillment",
        session.id
      );
    } else {
      try {
        await sendFulfillmentEmail({ to: email, promptTitle });
      } catch (err) {
        // Payment already succeeded — don't fail the webhook response over
        // an email error, or Stripe will keep retrying a delivery that
        // will keep failing for the same reason.
        console.error("Fulfillment email failed to send", session.id, err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
