import { cache } from "react";
import Link from "next/link";
import {
  PUBLIC_PRODUCT_COLUMNS,
  supabase,
  type Product,
} from "@/lib/supabase";
import type { CATEGORIES } from "@/lib/catalogue";
import { ProductGrid } from "@/components/ProductGrid";

type Category = (typeof CATEGORIES)[number];

/**
 * Active items in one category. Returns null if the query fails, so the page
 * can say so instead of claiming the category is empty.
 */
export const getCategoryItems = cache(
  async (slug: string): Promise<Product[] | null> => {
    const { data, error } = await supabase
      .from("prompts")
      .select(PUBLIC_PRODUCT_COLUMNS)
      .eq("is_active", true)
      .eq("category", slug)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Could not load shop category", slug, error);
      return null;
    }
    return (data ?? []) as unknown as Product[];
  }
);

export function CategoryView({
  category,
  items,
}: {
  category: Category;
  items: Product[] | null;
}) {
  return (
    <section className="mx-auto max-w-5xl px-6 pb-16 pt-12 sm:pb-24 sm:pt-16">
      <p className="font-mono text-[15px] uppercase tracking-wide text-signal">
        <Link href="/shop" className="transition-colors hover:text-ink">
          Shop
        </Link>{" "}
        / {category.name}
      </p>
      <h1 className="mt-4 max-w-2xl font-display text-3xl font-medium leading-[1.15] tracking-tight text-ink sm:text-4xl">
        {category.name}
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/70">
        {category.blurb}
      </p>

      {items === null ? (
        <p className="mt-10 font-mono text-[13px] text-ink/70">
          Couldn&apos;t load this category right now.
        </p>
      ) : items.length > 0 ? (
        <ProductGrid items={items} />
      ) : (
        <p className="mt-10 font-mono text-[13px] uppercase tracking-wide text-ink/70">
          Nothing listed yet — coming with the vault.
        </p>
      )}

      <Link
        href="/shop"
        className="mt-10 inline-flex items-center border border-line px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-ink"
      >
        Back to the Shop
      </Link>
    </section>
  );
}
