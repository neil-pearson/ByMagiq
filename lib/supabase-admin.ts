import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client with the service-role key. It bypasses the
 * public read rules, so use it only in server code (the Stripe webhook, and
 * the free-download lookup on the Shop item page) and never import it from a
 * client component.
 *
 * Needs SUPABASE_SERVICE_ROLE_KEY (no NEXT_PUBLIC_ prefix) set in Vercel for
 * Production. Created on demand so a missing key cannot break the build.
 */
export function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_URL) is not set"
    );
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
