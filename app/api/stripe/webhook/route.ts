import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { fulfilCheckoutSession } from "@/lib/fulfilment";
import { getFulfilmentDeps } from "@/lib/fulfilment-deps";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  try {
    const result = await fulfilCheckoutSession(session, getFulfilmentDeps());

    if (result === "retry") {
      // Delivery did not complete. The order is recorded as failed; an error
      // status makes Stripe send this event again (safe: a delivered order is
      // never delivered twice).
      return NextResponse.json(
        { error: "Delivery not completed" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Fulfilment threw", session.id, err);
    return NextResponse.json({ error: "Fulfilment error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
