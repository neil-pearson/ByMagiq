import type { ReactNode } from "react";
import { LEGAL, LEGAL_READY, LEGAL_UPDATED, PLACEHOLDER } from "@/lib/legal";

/** The seller's name, or a visible placeholder while it is unconfirmed. */
export function SellerName() {
  return <>{LEGAL.tradingName ?? PLACEHOLDER.tradingName}</>;
}

/** The contact email as a mailto link, or a visible placeholder. */
export function ContactEmail() {
  if (!LEGAL.contactEmail) return <>{PLACEHOLDER.contactEmail}</>;
  return (
    <a href={`mailto:${LEGAL.contactEmail}`} className="underline hover:text-ink">
      {LEGAL.contactEmail}
    </a>
  );
}

export type LegalSection = {
  heading: string;
  paragraphs: ReactNode[];
};

/** Shared layout for the Terms and Privacy pages. */
export function LegalDoc({
  title,
  intro,
  sections,
}: {
  title: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <section className="mx-auto max-w-3xl px-6 pb-16 pt-12 sm:pb-24 sm:pt-16">
      {!LEGAL_READY && (
        <p className="mb-8 border border-line bg-signal-dim px-4 py-3 font-mono text-[13px] text-ink">
          Draft, not published: the seller details and contact email are still
          to be confirmed, so this page is hidden from search and the footer.
        </p>
      )}
      <p className="font-mono text-[15px] uppercase tracking-wide text-signal">
        Legal
      </p>
      <h1 className="mt-4 font-display text-3xl font-medium leading-[1.15] tracking-tight text-ink sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 font-mono text-[13px] uppercase tracking-wide text-ink/70">
        Last updated {LEGAL_UPDATED}
      </p>
      <p className="mt-6 text-lg leading-relaxed text-ink/75">{intro}</p>

      {sections.map((s) => (
        <div key={s.heading} className="mt-10">
          <h2 className="font-display text-xl font-medium text-ink">
            {s.heading}
          </h2>
          {s.paragraphs.map((p, i) => (
            <p key={i} className="mt-3 text-base leading-relaxed text-ink/75">
              {p}
            </p>
          ))}
        </div>
      ))}
    </section>
  );
}
