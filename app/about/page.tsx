import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — ByMagiq",
  description:
    "ByMagiq builds tools for AI that keeps its memory — starting with Latticaxon, a personal knowledge system, and expanding into prompts and a Latticaxon item exchange.",
  alternates: { canonical: "/about" },
};

const makes = [
  {
    href: "/latticaxon",
    title: "Latticaxon",
    description:
      "The flagship product — a personal knowledge and project system that keeps context across sessions instead of starting from zero each time.",
  },
  {
    href: "/shop",
    title: "Shop",
    description:
      "Tested prompts for the workflows that actually compound, sold directly.",
  },
  {
    href: "/scripting-horizons",
    title: "Scripting Horizons",
    description:
      "ByMagiq's publishing imprint — books and long-form writing, kept as its own site, linked from here.",
  },
  {
    href: "/exchange",
    title: "Exchange",
    description:
      "Coming soon — a place to trade Latticaxon items: templates, modules, and system extensions.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-16 sm:pt-24">
        <p className="font-mono text-[13px] uppercase tracking-wide text-signal">
          About
        </p>
        <h1 className="mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.1] tracking-tight text-ink sm:text-5xl">
          Most AI tools forget you on purpose. We think that&apos;s backwards.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/70">
          Every new conversation with most AI starts from nothing — you
          re-explain your projects, your context, your decisions, every
          time. ByMagiq exists to build the opposite: tools where the AI
          keeps what it learns, and gets more useful the longer you use it.
        </p>
      </section>

      {/* What we're building */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="font-mono text-[13px] uppercase tracking-wide text-ink/50">
            What we&apos;re building
          </p>
          <div className="mt-6 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
            {makes.map((m) => (
              <Link
                key={m.href}
                href={m.href}
                className="flex flex-col gap-3 bg-paper p-7 transition-colors hover:bg-signal-dim"
              >
                <h2 className="font-display text-xl font-medium text-ink">
                  {m.title}
                </h2>
                <p className="text-sm leading-relaxed text-ink/65">
                  {m.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="grid gap-10 sm:grid-cols-[0.9fr_1.1fr]">
            <p className="font-mono text-[13px] uppercase tracking-wide text-ink/50">
              How we build
            </p>
            <div className="max-w-xl">
              <p className="text-lg leading-relaxed text-ink/75">
                Everything ByMagiq ships is used first, in production, on
                real work — not built speculatively and hoped into
                usefulness. Latticaxon started as an internal system before
                it became a product.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-ink/75">
                No vendor lock-in, no black boxes: your data stays in plain
                text, in a system you can read without us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="border-t border-line bg-ink">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-14 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[13px] uppercase tracking-wide text-signal-dim">
              The ByMagiq Letter
            </p>
            <p className="mt-2 max-w-md text-lg text-paper/90">
              Follow along as it&apos;s built — one newsletter, occasional
              dispatches from Scripting Horizons included.
            </p>
          </div>
          <Link
            href="/newsletter"
            className="inline-flex items-center justify-center bg-paper px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-signal-dim"
          >
            Subscribe
          </Link>
        </div>
      </section>
    </>
  );
}
