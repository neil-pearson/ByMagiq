import type { Metadata } from "next";
import ConversionForm from "@/components/ConversionForm";

export const metadata: Metadata = {
  title: "Latticaxon — ByMagiq",
  description:
    "A personal knowledge and project system built on Obsidian, with Claude as the intelligence layer. Capture, process, and stay connected across everything you're working on.",
  alternates: { canonical: "/latticaxon" },
};

const steps = [
  {
    n: "01",
    title: "Capture",
    description:
      "Everything lands in one inbox first — a note, a decision, a half-formed idea. Nothing gets filed until it's been thought through.",
  },
  {
    n: "02",
    title: "Process",
    description:
      "Claude reads what you've written and structures it into the right project, note, or decision log — so the system stays organised without you managing the management system.",
  },
  {
    n: "03",
    title: "Connect",
    description:
      "Projects, notes, and decisions stay linked. Come back weeks later and Claude already has the context — you're not re-explaining where things stand.",
  },
];

export default function LatticaxonPage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-16 pt-16 sm:pt-24">
        <p className="font-mono text-[13px] uppercase tracking-wide text-signal">
          Latticaxon
        </p>
        <h1 className="mt-4 max-w-2xl font-display text-4xl font-medium leading-[1.1] tracking-tight text-ink sm:text-5xl">
          A second brain that actually remembers what you're building.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/70">
          Latticaxon is a personal knowledge and project system built on
          Obsidian, with Claude as the intelligence layer — designed to
          capture, process, and connect everything a solo builder is working
          on, across as many projects as you're juggling at once.
        </p>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/55">
          The base vault is free. Modules and playbooks that extend it —
          writing systems, research workflows, and more — are sold
          individually, with a few included free to show what the system can
          do.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#waitlist"
            className="inline-flex items-center bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-signal"
          >
            Join the waitlist
          </a>
          <span className="font-mono text-[12px] uppercase tracking-wide text-ink/45">
            Currently in testing — not yet publicly released
          </span>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="font-mono text-[13px] uppercase tracking-wide text-ink/50">
            How it works
          </p>
          <div className="mt-6 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="flex flex-col gap-4 bg-paper p-7">
                <span className="font-display text-2xl text-ink/25">
                  {s.n}
                </span>
                <h2 className="font-display text-xl font-medium text-ink">
                  {s.title}
                </h2>
                <p className="text-sm leading-relaxed text-ink/65">
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built for */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="grid gap-10 sm:grid-cols-[0.9fr_1.1fr]">
            <p className="font-mono text-[13px] uppercase tracking-wide text-ink/50">
              Built for
            </p>
            <div className="max-w-xl">
              <p className="text-lg leading-relaxed text-ink/75">
                Solo builders running more than one thing at once — a
                business, a publishing project, a trading system, a side
                brand — who are tired of re-explaining context to an AI that
                forgets everything the moment the conversation ends.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-ink/75">
                Your data stays yours: Latticaxon runs on Obsidian, a local,
                plain-text vault with no vendor lock-in. Claude connects to it
                as the intelligence layer — it doesn&apos;t own your data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist */}
      <section id="waitlist" className="border-t border-line bg-ink">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <p className="font-mono text-[13px] uppercase tracking-wide text-signal-dim">
            Early access
          </p>
          <h2 className="mt-3 max-w-md font-display text-2xl font-medium text-paper sm:text-3xl">
            Latticaxon is in testing now. Join the waitlist for early access.
          </h2>
          <ConversionForm
            event="waitlist_signup"
            group="latticaxon-waitlist"
            className="mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@email.com"
              className="w-full border border-paper/20 bg-transparent px-4 py-3 text-sm text-paper placeholder:text-paper/40 focus:border-paper focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center whitespace-nowrap bg-paper px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-signal-dim"
            >
              Join waitlist
            </button>
          </ConversionForm>
        </div>
      </section>
    </>
  );
}
