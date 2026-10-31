import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Prompt = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price_cents: number;
  stripe_price_id: string | null;
  is_active: boolean;
};

/**
 * The columns of `prompts` the public (anon) key may read. Always select
 * these by name. `delivery_type` and `delivery_content` are deliberately NOT
 * in this list: they hold what a buyer receives, and
 * scripts/sql/005-lock-down-delivery-columns-2026-10-31.sql stops the public
 * key reading them. Read them only through getAdminClient()
 * (lib/supabase-admin.ts), on the server. If you add a public column, add it
 * here and grant it to anon in a new SQL file.
 */
export const PUBLIC_PRODUCT_COLUMNS =
  "id, slug, title, description, price_cents, stripe_price_id, is_active, created_at, category, availability, requires_vault, sort_order, requirements, what_you_get, delivery_format";

/**
 * A Shop catalogue item as the public pages see it: the `prompts` table with
 * the catalogue columns added by scripts/sql/004-add-catalogue-fields-2026-10-30.sql.
 */
export type Product = Prompt & {
  created_at: string;
  category: string | null;
  availability: "coming-soon" | "available" | null;
  requires_vault: boolean | null;
  sort_order: number | null;
  requirements: string | null;
  what_you_get: string | null;
  delivery_format: string | null;
};
