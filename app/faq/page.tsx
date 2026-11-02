import type { Metadata } from "next";
import Link from "next/link";
import { FAQ } from "@/lib/faq";
import { faqJsonLd, jsonLdString } from "@/lib/schema";

export const metadata: Metadata = {
  title: "FAQ — ByMagiq",
  description:
    "Answers about ByMagiq, Latticaxon, playbooks and add-ons, how products are delivered, and how ByMagiq differs from Scrhoz.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-16 pt-12 sm:pb-24 sm:pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(faqJsonLd(FAQ)) }}
      />
      <p className="font-mono text-[15px] uppercase tracking-wide text-signal">
        FAQ
      </p>
      <h1 className="mt-4 font-display text-3xl font-medium leading-[1.15] tracking-tight text-ink sm:text-4xl">
        Frequently asked questions
      </h1>
      <p className="mt-5 text-lg leading-relaxed text-ink/75">
        Short answers about ByMagiq and what it makes.
      </p>

      {FAQ.map((item) => (
        <div key={item.question} className="mt-10">
          <h2 className="font-display text-xl font-medium text-ink">
            {item.question}
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ink/75">
            {item.answer}
          </p>
          {item.link && (
            <p className="mt-3 text-sm">
              <Link
                href={item.link.href}
                className="font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
              >
                {item.link.label} →
              </Link>
            </p>
          )}
        </div>
      ))}
    </section>
  );
}
