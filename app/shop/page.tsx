import type { Metadata } from "next";
import Link from "next/link";
import {
  PUBLIC_PRODUCT_COLUMNS,
  supabase,
  type Product,
} from "@/lib/supabase";
import { CATEGORIES, availabilityLabel, priceLabel } from "@/lib/catalogue";

export const metadata: Metadata = {
  title: "Shop — ByMagiq",
  description:
    "Playbooks, modules, starter kits, skills and other add-ons for working with AI and the Latticaxon vault. Free and paid, coming with the vault.",
  alternates: { canonical: "/shop" },
};

function ProductCard({ p }: { p: Product }) {
  return (
    <Link
      href={`/shop/${p.slug}`}
      className="flex flex-col justify-between gap-6 bg-paper p-7 transition-colors hover:bg-signal-dim"
    >
      <div>
        <h3 className="font-display text-xl font-medium text-ink">{p.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink/65">
          {p.description}
        </p>
      </div>
      <div className="flex items-center justify-between font-mono text-[13px] uppercase tracking-wide text-ink/70">
        <span>{priceLabel(p.price_cents)}</span>
        <span>{availabilityLabel(p.availability)}</span>
      </div>
    </Link>
  );
}

function ProductGrid({ items }: { items: Product[] }) {
  return (
    <div className="mt-6 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
      {items.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  );
}

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

      <nav
        aria-label="Shop categories"
        className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[13px] uppercase tracking-wide text-ink/70"
      >
        {CATEGORIES.map((c) => (
          <a
            key={c.slug}
            href={`#${c.slug}`}
            className="transition-colors hover:text-ink"
          >
            {c.name}
          </a>
        ))}
      </nav>

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

      {!error &&
        CATEGORIES.map((c) => {
          const items = products
            .filter((p) => p.category === c.slug)
            .sort(bySort);
          return (
            <div key={c.slug} id={c.slug} className="mt-14 scroll-mt-8">
              <h2 className="font-display text-2xl font-medium text-ink">
                {c.name}
              </h2>
              <p className="mt-2 max-w-xl text-base leading-relaxed text-ink/70">
                {c.blurb}
              </p>
              {items.length > 0 ? (
                <ProductGrid items={items} />
              ) : (
                <p className="mt-6 font-mono text-[13px] uppercase tracking-wide text-ink/70">
                  Nothing listed yet — coming with the vault.
                </p>
              )}
            </div>
          );
        })}

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
