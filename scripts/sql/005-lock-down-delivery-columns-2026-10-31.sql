-- 005 — Stop the public key reading delivery_type and delivery_content (2026-10-31)
-- STATUS: run on the ByMagiq project (reported by Neil 2026-10-31).
-- Run it on the ByMagiq Supabase project only (the one whose
-- prompts table has price_cents and delivery_content), and only AFTER:
--   1. 004 has been run on that project,
--   2. SUPABASE_SERVICE_ROLE_KEY is set in Vercel (Production), and
--   3. the code that reads delivery details through the server-only client
--      (lib/supabase-admin.ts) is deployed.
-- Why: the public (anon) key could read the full text of every paid prompt
-- straight from the Supabase API. This limits it to the public columns, which
-- must match PUBLIC_PRODUCT_COLUMNS in lib/supabase.ts.
-- After this, `select=*` with the public key fails; select columns by name.
-- Any column added to prompts later is hidden from the public key until it is
-- granted here in a new numbered file.

revoke select on prompts from anon, authenticated;

grant select (
  id, slug, title, description, price_cents, stripe_price_id, is_active,
  created_at, category, availability, requires_vault, sort_order,
  requirements, what_you_get, delivery_format
) on prompts to anon, authenticated;
