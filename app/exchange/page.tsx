import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Exchange — ByMagiq",
  description:
    "The Latticaxon item exchange — templates, modules, and system extensions. Coming soon.",
  alternates: { canonical: "/exchange" },
};

export default function ExchangePage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <p className="font-mono text-[13px] uppercase tracking-wide text-signal">
        Exchange
      </p>
      <h1 className="mt-4 font-display text-3xl font-medium leading-[1.15] tracking-tight text-ink sm:text-4xl">
        Coming soon.
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/70">
        A place to trade Latticaxon items — templates, modules, and system
        extensions built by people using Latticaxon. Not live yet; it
        launches once Latticaxon itself is further along.
      </p>
      <Link
        href="/latticaxon"
        className="mt-8 inline-flex items-center border border-line px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-ink"
      >
        Learn about Latticaxon
      </Link>
    </section>
  );
}
