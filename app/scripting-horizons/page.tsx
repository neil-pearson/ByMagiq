import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Scripting Horizons — ByMagiq",
  description:
    "Scripting Horizons is ByMagiq's publishing imprint — books and long-form writing from a small cast of author personas.",
  alternates: { canonical: "/scripting-horizons" },
};

export default function ScriptingHorizonsPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <p className="font-mono text-[13px] uppercase tracking-wide text-signal">
        Read — Scripting Horizons
      </p>
      <h1 className="mt-4 font-display text-3xl font-medium leading-[1.15] tracking-tight text-ink sm:text-4xl">
        ByMagiq&apos;s publishing imprint.
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/70">
        Scripting Horizons is where the books live — practical guides and
        long-form writing from a small cast of author personas, each with
        their own focus, from money management to systems thinking. It has
        its own site and its own catalogue, kept separate from the ByMagiq
        product line.
      </p>
      <Link
        href="https://scrhoz.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-signal"
      >
        Visit Scripting Horizons →
      </Link>
    </section>
  );
}
