import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { sendFulfillmentEmail } from "@/lib/email";
import { supabase } from "@/lib/supabase";

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
    const promptId = session.metadata?.promptId;
    const promptTitle = session.metadata?.promptTitle ?? "your purchase";

    if (!email) {
      console.error(
        "checkout.session.completed had no customer email — skipping fulfillment",
        session.id
      );
    } else {
      let deliveryType: "text" | "file" | null = null;
      let deliveryContent: string | null = null;

      if (promptId) {
        const { data: prompt, error } = await supabase
          .from("prompts")
          .select("delivery_type, delivery_content")
          .eq("id", promptId)
          .single();

        if (error) {
          console.error("Could not look up delivery content for prompt", promptId, error);
        } else {
          deliveryType = prompt?.delivery_type ?? null;
          deliveryContent = prompt?.delivery_content ?? null;
        }
      }

      try {
        await sendFulfillmentEmail({ to: email, promptTitle, deliveryType, deliveryContent });
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
