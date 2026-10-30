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
 * A Shop catalogue item. Same `prompts` table, with the catalogue columns
 * added 2026-10-30 (see supabase-schema.sql). The new fields are null until
 * that migration has been run. `delivery_content` is only used on the
 * server, for an open free download; never pass it to a client component.
 */
export type Product = Prompt & {
  category: string | null;
  availability: "coming-soon" | "available" | null;
  requires_vault: boolean | null;
  sort_order: number | null;
  requirements: string | null;
  what_you_get: string | null;
  delivery_format: string | null;
  delivery_type: "text" | "file" | null;
  delivery_content: string | null;
};
