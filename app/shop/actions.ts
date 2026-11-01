"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { PUBLIC_PRODUCT_COLUMNS, supabase, type Product } from "@/lib/supabase";

/**
 * Starts a Stripe Checkout for one paid Shop item. Prices are in AUD, to
 * match what the Shop shows (A$) and the Product markup.
 *
 * Reads the item with the public key and only the public columns (the
 * delivery columns are not readable with it, scripts/sql/005), and only
 * sells an item that is active, marked available and has a price.
 */
export async function createCheckoutSession(formData: FormData) {
  const promptId = formData.get("promptId");
  if (typeof promptId !== "string" || promptId === "") {
    throw new Error("Missing item");
  }

  const { data, error } = await supabase
    .from("prompts")
    .select(PUBLIC_PRODUCT_COLUMNS)
    .eq("id", promptId)
    .eq("is_active", true)
    .maybeSingle();

  const prompt = data as unknown as Product | null;
  if (error || !prompt) {
    throw new Error("Item not found");
  }
  if (prompt.availability !== "available") {
    throw new Error("This item is not available yet");
  }
  if (!(prompt.price_cents > 0)) {
    throw new Error("This item is not for sale");
  }

  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "aud",
          product_data: {
            name: prompt.title,
            description: prompt.description,
          },
          unit_amount: prompt.price_cents,
        },
        quantity: 1,
      },
    ],
    metadata: {
      promptId: prompt.id,
      promptTitle: prompt.title,
    },
    success_url: `${origin}/shop?checkout=success`,
    cancel_url: `${origin}/shop?checkout=cancelled`,
  });

  if (session.url) {
    redirect(session.url);
  }
}
