"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export async function createCheckoutSession(formData: FormData) {
  const promptId = formData.get("promptId") as string;

  const { data: prompt, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("id", promptId)
    .single();

  if (error || !prompt) {
    throw new Error("Prompt not found");
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
          currency: "gbp",
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
