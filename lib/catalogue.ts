/**
 * Shop catalogue: the fixed list of add-on categories and the small
 * helpers the Shop pages share. The category slugs must match the check
 * constraint on `prompts.category` in scripts/sql/004-add-catalogue-fields-2026-10-30.sql.
 *
 * Wording rule (GEO scope, bm-geo.md): every line here must be true when
 * the vault is released. No "best" or "leading", no promise of results.
 */

export const CATEGORIES = [
  {
    slug: "playbooks",
    name: "Playbooks",
    blurb:
      "Chains of prompts that run in any AI and end in one finished deliverable. Each step builds on the one before.",
  },
  {
    slug: "vault-modules",
    name: "Vault modules",
    blurb:
      "Larger add-ons for Latticaxon that run a whole workflow and keep track of the work across sessions.",
  },
  {
    slug: "starter-kits",
    name: "Starter kits",
    blurb:
      "Ready-made vault setups for one kind of work: folders, templates and the instructions that go with them.",
  },
  {
    slug: "skills",
    name: "Skills and instruction files",
    blurb:
      "Single-purpose instruction files that teach your vault to do one job the same way every time.",
  },
  {
    slug: "asset-packs",
    name: "Asset packs",
    blurb:
      "Style guides, frameworks, checklists and templates that modules and skills can draw on.",
  },
  {
    slug: "automation-recipes",
    name: "Automation recipes",
    blurb: "Ready-made routines that run parts of your vault on a schedule.",
  },
  {
    slug: "methodology-guides",
    name: "Methodology guides",
    blurb:
      "Longer written guides to building and running an AI-assisted second brain.",
  },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export function categoryFor(slug: string | null | undefined) {
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}

/**
 * Prices stay hidden until production Stripe is verified and the Buy
 * buttons come back (see the "Re-enable the Shop Buy buttons and prices"
 * task). Flip to true then. Free items always say "Free".
 */
export const SHOW_PRICES = false;

export function priceLabel(priceCents: number): string {
  if (priceCents === 0) return "Free";
  if (!SHOW_PRICES) return "Paid";
  const dollars = priceCents / 100;
  return Number.isInteger(dollars)
    ? `A$${dollars}`
    : `A$${dollars.toFixed(2)}`;
}

export function availabilityLabel(
  availability: string | null | undefined
): string {
  return availability === "available" ? "Available" : "Coming with the vault";
}

/**
 * Shown on a vault add-on's page only once it is marked "available".
 * The install flow is being designed (Latticaxon-ByMagiq, "Simple vault"
 * tasks), so check this line is true before marking any add-on available.
 */
export const INSTALL_NOTE =
  "To add this to your vault, ask the vault to add the file you download.";
