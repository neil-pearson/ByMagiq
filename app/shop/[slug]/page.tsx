import { cache } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase, type Product } from "@/lib/supabase";
import {
  INSTALL_NOTE,
  availabilityLabel,
  categoryFor,
  priceLabel,
} from "@/lib/catalogue";

const getProduct = cache(async (slug: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    console.error("Could not load shop item", slug, error);
    return null;
  }
  return (data as Product | null) ?? null;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Shop — ByMagiq" };
  return {
    title: `${product.title} — ByMagiq`,
    description: product.description,
    alternates: { canonical: `/shop/${product.slug}` },
  };
}

export default async function ShopItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const category = categoryFor(product.category);
  const isAvailable = product.availability === "available";
  // Open free download for the moment (decision 2026-10-30, task
  // bm-free-downloads). Paid checkout is not shown here; it comes back with
  // the "Re-enable the Shop Buy buttons" task.
  const content = product.delivery_content;
  const downloadUrl =
    isAvailable &&
    product.price_cents === 0 &&
    product.delivery_type === "file" &&
    typeof content === "string" &&
    content.startsWith("https://")
      ? content
      : null;

  const facts: { label: string; value: string }[] = [
    { label: "Category", value: category?.name ?? "Prompt" },
    { label: "Price", value: priceLabel(product.price_cents) },
    { label: "Status", value: availabilityLabel(product.availability) },
  ];
  if (product.requires_vault) {
    facts.push({ label: "Needs", value: "Latticaxon (the vault)" });
  }
  if (product.requirements) {
    facts.push({ label: "Also needs", value: product.requirements });
  }
  if (product.delivery_format) {
    facts.push({ label: "Delivery", value: product.delivery_format });
  }

  return (
    <section className="mx-auto max-w-5xl px-6 pb-16 pt-12 sm:pb-24 sm:pt-16">
      <p className="font-mono text-[15px] uppercase tracking-wide text-signal">
        <Link
          href={category ? `/shop#${category.slug}` : "/shop"}
          className="transition-colors hover:text-ink"
        >
          Shop{category ? ` / ${category.name}` : ""}
        </Link>
      </p>
      <h1 className="mt-4 max-w-2xl font-display text-3xl font-medium leading-[1.15] tracking-tight text-ink sm:text-4xl">
        {product.title}
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/70">
        {product.description}
      </p>

      <dl className="mt-10 grid max-w-xl gap-px overflow-hidden border border-line bg-line">
        {facts.map((f) => (
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
      </dl>

      {product.what_you_get && (
        <div className="mt-10 max-w-xl">
          <h2 className="font-display text-xl font-medium text-ink">
            What you get
          </h2>
          <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-ink/75">
            {product.what_you_get}
          </p>
        </div>
      )}

      <div className="mt-10">
        {downloadUrl ? (
          <>
            <a
              href={downloadUrl}
              className="inline-flex items-center bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-signal"
            >
              Download
            </a>
            {product.requires_vault && (
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/70">
                {INSTALL_NOTE}
              </p>
            )}
          </>
        ) : (
          <p className="font-mono text-[13px] uppercase tracking-wide text-ink/70">
            {availabilityLabel(product.availability)}
          </p>
        )}
      </div>

      <Link
        href="/shop"
        className="mt-10 inline-flex items-center border border-line px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-ink"
      >
        Back to the Shop
      </Link>
    </section>
  );
}
