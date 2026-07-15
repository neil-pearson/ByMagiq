import type { Metadata } from "next";
import { supabase, type Prompt } from "@/lib/supabase";
import { createCheckoutSession } from "./actions";

export const metadata: Metadata = {
  title: "Shop — ByMagiq",
  description:
    "Tested prompts for the workflows that actually compound — research, writing, and systems work.",
  alternates: { canonical: "/shop" },
};

function formatPrice(cents: number) {
  return `£${(cents / 100).toFixed(2)}`;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const { checkout } = await searchParams;

  const { data: prompts, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  return (
    <section className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <p className="font-mono text-[13px] uppercase tracking-wide text-signal">
        Shop
      </p>
      <h1 className="mt-4 max-w-xl font-display text-3xl font-medium leading-[1.15] tracking-tight text-ink sm:text-4xl">
        Prompts for the workflows that actually compound.
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/70">
        Tested, not templated — research, writing, and systems prompts built
        for real use, not demos.
      </p>

      {checkout === "success" && (
        <p className="mt-8 border border-line bg-signal-dim px-4 py-3 font-mono text-[13px] text-ink">
          Payment received — check your email for the download.
        </p>
      )}
      {checkout === "cancelled" && (
        <p className="mt-8 border border-line px-4 py-3 font-mono text-[13px] text-ink/60">
          Checkout cancelled — nothing was charged.
        </p>
      )}

      {error && (
        <p className="mt-10 font-mono text-[13px] text-ink/50">
          Couldn&apos;t load the shop right now — the prompts table may not
          be set up yet.
        </p>
      )}

      {!error && (!prompts || prompts.length === 0) && (
        <p className="mt-10 font-mono text-[13px] text-ink/50">
          Nothing listed yet.
        </p>
      )}

      {prompts && prompts.length > 0 && (
        <div className="mt-10 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
          {(prompts as Prompt[]).map((p) => (
            <div
              key={p.id}
              className="flex flex-col justify-between gap-6 bg-paper p-7"
            >
              <div>
                <h2 className="font-display text-xl font-medium text-ink">
                  {p.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">
                  {p.description}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-ink/70">
                  {formatPrice(p.price_cents)}
                </span>
                <form action={createCheckoutSession}>
                  <input type="hidden" name="promptId" value={p.id} />
                  <button
                    type="submit"
                    className="inline-flex items-center bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-signal"
                  >
                    Buy
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
