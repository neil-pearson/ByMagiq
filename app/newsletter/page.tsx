import type { Metadata } from "next";
import ConversionForm from "@/components/ConversionForm";

export const metadata: Metadata = {
  title: "The ByMagiq Letter — ByMagiq",
  description:
    "One newsletter on building AI that remembers, with occasional dispatches from Scripting Horizons.",
  alternates: { canonical: "/newsletter" },
};

export default function NewsletterPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <p className="font-mono text-[13px] uppercase tracking-wide text-signal">
        The ByMagiq Letter
      </p>
      <h1 className="mt-4 max-w-xl font-display text-3xl font-medium leading-[1.15] tracking-tight text-ink sm:text-4xl">
        One newsletter on building AI that remembers.
      </h1>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/70">
        Notes from building ByMagiq and Latticaxon in the open, plus
        occasional dispatches from the Scripting Horizons back catalogue.
        No spam, unsubscribe any time.
      </p>

      <ConversionForm
        event="newsletter_signup"
        group="newsletter"
        className="mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="you@email.com"
          className="w-full border border-line bg-transparent px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center whitespace-nowrap bg-ink px-5 py-3 text-sm font-medium text-paper transition-colors hover:bg-signal"
        >
          Subscribe
        </button>
      </ConversionForm>
    </section>
  );
}
