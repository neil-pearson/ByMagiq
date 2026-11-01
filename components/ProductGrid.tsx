import Link from "next/link";
import type { Product } from "@/lib/supabase";
import { availabilityLabel, priceLabel } from "@/lib/catalogue";

export function ProductCard({ p }: { p: Product }) {
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

export function ProductGrid({ items }: { items: Product[] }) {
  return (
    <div className="mt-6 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
      {items.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  );
}
