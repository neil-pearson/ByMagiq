/**
 * Details the Terms and Privacy pages need from the business owner.
 *
 * Fill these in (bm-legal-pages). While any of tradingName, contactEmail or
 * governingState is still null, the pages are a draft: they show a notice,
 * are marked noindex, are left out of the sitemap and are not linked from the
 * footer. Once all three are set they go live by themselves.
 *
 * Update LEGAL_UPDATED to the publishing date, and re-check every sentence on
 * both pages against how the business actually works first.
 */
export const LEGAL = {
  /** The seller's name as it should appear, e.g. "ByMagiq Pty Ltd" or "Jane Citizen trading as ByMagiq". */
  tradingName: null as string | null,
  /** Optional. */
  abn: null as string | null,
  /** The public contact address, shown on both pages and in the footer. */
  contactEmail: null as string | null,
  /** The state or territory whose law governs the terms, e.g. "New South Wales". */
  governingState: null as string | null,
};

export const LEGAL_UPDATED = "1 November 2026";

export const LEGAL_READY = Boolean(
  LEGAL.tradingName && LEGAL.contactEmail && LEGAL.governingState
);

export const PLACEHOLDER = {
  tradingName: "[trading name to be confirmed]",
  contactEmail: "[contact email to be confirmed]",
  governingState: "[state or territory to be confirmed]",
} as const;
