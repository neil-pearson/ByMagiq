import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { supabase } from "@/lib/supabase";
import { CATEGORIES } from "@/lib/catalogue";

// Category pages are added from the database, so refresh hourly instead of
// freezing the list at build time.
export const revalidate = 3600;

const routes = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/latticaxon", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/shop", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/newsletter", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/scrhoz", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/articles", priority: 0.4, changeFrequency: "monthly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: new URL(route.path, SITE_URL).toString(),
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Category pages with at least one active item, and every active item
  // page, come from the same Supabase list the Shop renders. An empty
  // category page is noindex, so it stays out.
  const { data, error } = await supabase
    .from("prompts")
    .select("slug, category")
    .eq("is_active", true);

  if (error) {
    console.error("Sitemap: could not load shop items", error);
    return entries;
  }

  const rows = (data ?? []) as { slug: string; category: string | null }[];
  const used = new Set(rows.map((r) => r.category));
  for (const c of CATEGORIES) {
    if (used.has(c.slug)) {
      entries.push({
        url: new URL(`/shop/${c.slug}`, SITE_URL).toString(),
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }
  for (const r of rows) {
    entries.push({
      url: new URL(`/shop/${r.slug}`, SITE_URL).toString(),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    });
  }
  return entries;
}
