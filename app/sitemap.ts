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

  // Only categories with at least one active item get a page in the sitemap
  // (an empty category page is noindex).
  const { data, error } = await supabase
    .from("prompts")
    .select("category")
    .eq("is_active", true);

  if (error) {
    console.error("Sitemap: could not load shop categories", error);
    return entries;
  }

  const used = new Set((data ?? []).map((r) => r.category as string | null));
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
  return entries;
}
