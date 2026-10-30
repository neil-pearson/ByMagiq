import { SITE_URL } from "@/lib/site";

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
