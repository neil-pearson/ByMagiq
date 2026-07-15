import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const routes = [
  { path: "/", priority: 1, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/latticaxon", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/shop", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/newsletter", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/scripting-horizons", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/exchange", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/articles", priority: 0.4, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: new URL(route.path, SITE_URL).toString(),
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
