/**
 * Resolves the canonical site URL for metadata, sitemap, and OG images.
 *
 * Priority: an explicit NEXT_PUBLIC_SITE_URL (set this once a real domain
 * is connected — see "Connect domain to Vercel" in tasks.md) → Vercel's
 * auto-injected deployment URL → localhost for local dev.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}
