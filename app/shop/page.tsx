import type { Metadata } from "next";
import Link from "next/link";
import {
  PUBLIC_PRODUCT_COLUMNS,
  supabase,
  type Product,
} from "@/lib/supabase";
import { CATEGORIES } from "@/lib/catalogue";
import { LEGAL_READY } from "@/lib/legal";
import { ProductGrid } from "@/components/ProductGrid";

export const metadata: Metadata = {
  title: "Shop — ByMagiq",
  description:
    "Playbooks, modules, starter kits, skills and other add-ons for working with AI and the Latticaxon vault. Free and paid, coming with the vault.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const { checkout } = await searchParams;

  const { data, error } = await supabase
    .from("prompts")
    .select(PUBLIC_PRODUCT_COLUMNS)
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) {
    // Shown in the Vercel runtime logs only; the page keeps its plain message.
    console.error("Shop query failed:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
  }

  const products = (data ?? []) as unknown as Product[];
  const known = new Set<string>(CATEGORIES.map((c) => c.slug));
  const bySort = (a: Product, b: Product) =>
    (a.sort_order ?? 0) - (b.sort_order ?? 0);
  const featured = products.filter((p) => p.featured).sort(bySort);
  // Rows without a recognised category (the original single prompts, or any
  // row added before the catalogue columns exist) keep their own section so
  // nothing disappears from the live Shop until it is decided what to do
  // with them.
  const uncategorised = products
    .filter((p) => !p.category || !known.has(p.category))
    .sort(bySort);

  return (
    <section className="mx-auto max-w-5xl px-6 pb-16 pt-12 sm:pb-24 sm:pt-16">
      <p className="font-mono text-[15px] uppercase tracking-wide text-signal">
        Shop
      </p>
      <h1 className="mt-4 max-w-xl font-display text-3xl font-medium leading-[1.15] tracking-tight text-ink sm:text-4xl">
        Add-ons for your vault, and playbooks that work anywhere.
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/70">
        Playbooks you can run in any AI, plus modules, starter kits, skills and
        more for Latticaxon. Some are free and some are paid. Everything here
        is coming with the vault.
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
        <p className="mt-10 font-mono text-[13px] text-ink/70">
          Couldn&apos;t load the shop right now — the prompts table may not
          be set up yet.
        </p>
      )}

      {/* How the Shop works (GEO C): plain facts that stay true as items are added */}
      <dl className="mt-10 grid max-w-xl gap-px overflow-hidden border border-line bg-line">
        {[
          {
            label: "Prices",
            value: "In Australian dollars. Some items are free.",
          },
          {
            label: "Delivery",
            value:
              "Digital, by email: text in the email or a download link. Each item page says what you receive.",
          },
          {
            label: "Availability",
            value:
              "Each item shows whether it is available or coming with the vault.",
          },
        ].map((f) => (
          <div
            key={f.label}
            className="grid gap-1 bg-paper px-5 py-4 sm:grid-cols-[8rem_1fr] sm:gap-4"
          >
            <dt className="font-mono text-[13px] uppercase tracking-wide text-ink/70">
              {f.label}
            </dt>
            <dd className="text-sm leading-relaxed text-ink">{f.value}</dd>
          </div>
        ))}
        {LEGAL_READY && (
          <div className="grid gap-1 bg-paper px-5 py-4 sm:grid-cols-[8rem_1fr] sm:gap-4">
            <dt className="font-mono text-[13px] uppercase tracking-wide text-ink/70">
              Refunds
            </dt>
            <dd className="text-sm leading-relaxed text-ink">
              A 14-day change-of-mind refund, plus your rights under Australian
              Consumer Law. See the{" "}
              <Link href="/terms" className="underline hover:text-ink">
                terms of sale
              </Link>
              .
            </dd>
          </div>
        )}
      </dl>

      {!error && featured.length > 0 && (
        <div className="mt-14">
          <h2 className="font-display text-2xl font-medium text-ink">
            Featured
          </h2>
          <ProductGrid items={featured} />
        </div>
      )}

      {!error && (
        <div className="mt-14">
          <h2 className="font-display text-2xl font-medium text-ink">
            Browse by category
          </h2>
          <div className="mt-6 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
            {CATEGORIES.map((c) => {
              const count = products.filter(
                (p) => p.category === c.slug
              ).length;
              const body = (
                <>
                  <div>
                    <h3 className="font-display text-xl font-medium text-ink">
                      {c.name}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink/65">
                      {c.blurb}
                    </p>
                  </div>
                  <p className="font-mono text-[13px] uppercase tracking-wide text-ink/70">
                    {count > 0
                      ? `${count} ${count === 1 ? "item" : "items"}`
                      : "Nothing listed yet"}
                  </p>
                </>
              );
              return count > 0 ? (
                <Link
                  key={c.slug}
                  href={`/shop/${c.slug}`}
                  className="flex flex-col justify-between gap-6 bg-paper p-7 transition-colors hover:bg-signal-dim"
                >
                  {body}
                </Link>
              ) : (
                <div
                  key={c.slug}
                  className="flex flex-col justify-between gap-6 bg-paper p-7"
                >
                  {body}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!error && uncategorised.length > 0 && (
        <div id="prompts" className="mt-14 scroll-mt-8">
          <h2 className="font-display text-2xl font-medium text-ink">
            Prompts
          </h2>
          <ProductGrid items={uncategorised} />
        </div>
      )}
    </section>
  );
}
