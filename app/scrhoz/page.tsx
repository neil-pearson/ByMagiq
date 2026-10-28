import type { Metadata } from "next";
import Link from "next/link";
import { SCRHOZ_URL } from "@/lib/links";

export const metadata: Metadata = {
  title: "Scrhoz — ByMagiq",
  description:
    "Scrhoz is a companion site to ByMagiq: simple prompts, sheets, systems and books. The books are published under the Scripting Horizons imprint.",
  alternates: { canonical: "/scrhoz" },
};

export default function ScrhozPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <p className="font-mono text-[15px] uppercase tracking-wide text-signal">
        Read — Scrhoz
      </p>
      <h1 className="mt-4 font-display text-3xl font-medium leading-[1.15] tracking-tight text-ink sm:text-4xl">
        Prompts, sheets, systems and books.
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/70">
        Scrhoz is a companion site, separate from ByMagiq. It&apos;s home to
        simple, ready-to-use prompts, spreadsheet templates and systems, plus
        the books published under the Scripting Horizons imprint — practical
        guides and long-form writing from a small cast of authors, from money
        management to systems thinking. ByMagiq goes further: playbooks, vaults
        and Latticaxon, for working with AI on your own material. Scrhoz is
        still coming together, so expect a few rough edges.
      </p>
      <Link
        href={SCRHOZ_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-signal"
      >
        Visit Scrhoz →
      </Link>
    </section>
  );
}
