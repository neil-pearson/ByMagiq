import { SITE_URL, absoluteUrl } from "@/lib/site";

/**
 * Site-wide structured data (GEO work, bm-geo-a). Same pattern as the
 * ForgeDrive site: stable `@id`s built from SITE_URL so entities can
 * reference each other, and "<" escaped so text can never close the
 * script tag.
 *
 * Deliberately minimal: no contact point (the site has no public contact
 * route yet), no founder or business details (brand-only rule), no
 * areaServed or logo. Add them only when they are true and visible on
 * the site. Product/Offer and FAQPage markup belong to bm-geo-b and must
 * be built from the same data the pages render.
 */

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export function siteJsonLd(description: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: "ByMagiq",
        url: SITE_URL,
        description,
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: "ByMagiq",
        description,
        inLanguage: "en",
        publisher: { "@id": ORGANIZATION_ID },
      },
    ],
  };
}

/** Serialises JSON-LD for a <script> tag, escaping "<". */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export type ShopProductSchemaInput = {
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  categoryName: string | null;
};

/**
 * Product and Offer markup for one Shop item (bm-geo-b), in AUD.
 *
 * The caller must pass only an item that is marked available and whose price
 * is visible on the page (free items always show "Free"; paid prices only
 * while SHOW_PRICES is true). Markup must match what the page shows, and an
 * Offer claims the item can be had today, so a coming-soon item gets no
 * Product markup at all. Built from the same Supabase row the page renders.
 */
export function productJsonLd(p: ShopProductSchemaInput) {
  const url = absoluteUrl(`/shop/${p.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: p.title,
    description: p.description,
    url,
    brand: { "@type": "Brand", name: "ByMagiq" },
    ...(p.categoryName ? { category: p.categoryName } : {}),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "AUD",
      price: (p.priceCents / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      seller: { "@id": ORGANIZATION_ID },
    },
  };
}
