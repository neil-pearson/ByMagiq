import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * AI crawler stance (same as ForgeDrive and the six client templates):
 * allow the bots that fetch a page to answer a question or cite a source,
 * block the bots that only collect training data. robots.txt is advisory,
 * not enforcement. Google-Extended is a control token, not a crawler:
 * blocking it opts out of Gemini training and does not affect Google
 * Search or AI Overviews.
 */
const AI_SEARCH_BOTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "Claude-SearchBot",
  "Claude-User",
];
const AI_TRAINING_BOTS = ["GPTBot", "Google-Extended", "ClaudeBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_SEARCH_BOTS, allow: "/" },
      { userAgent: AI_TRAINING_BOTS, disallow: "/" },
    ],
    sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
  };
}
