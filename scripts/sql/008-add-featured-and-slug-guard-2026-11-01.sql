-- 008 — Featured flag and category-name slug guard (2026-11-01)
-- STATUS: not yet run. Run on the ByMagiq Supabase project only (the one whose
-- prompts table has price_cents and delivery_content).
-- Run it BEFORE deploying the Shop category pages code: the public pages select
-- `featured` by name (PUBLIC_PRODUCT_COLUMNS in lib/supabase.ts), so the Shop
-- fails to load if the code is live and this column does not exist yet.
--
-- 1. featured: lets you pick which items show on the /shop overview.
--    Nothing is featured by default; the overview hides the section until
--    at least one item is.
-- 2. The public key may read it (005 limits the public key to named columns).
-- 3. A category page lives at /shop/<category slug>, and the route checks
--    categories before items, so an item slug that equals a category slug
--    would be unreachable. This check stops that. If it fails, an existing
--    item already uses one of those slugs: rename that item's slug first.
--    Keep the list in step with CATEGORIES in lib/catalogue.ts.

alter table prompts
  add column if not exists featured boolean not null default false;

grant select (featured) on prompts to anon, authenticated;

alter table prompts
  drop constraint if exists prompts_slug_not_category;

alter table prompts
  add constraint prompts_slug_not_category
  check (slug not in (
    'playbooks', 'vault-modules', 'starter-kits', 'skills',
    'asset-packs', 'automation-recipes', 'methodology-guides'
  ));

-- To feature items on /shop (run separately, after you choose; replace slugs):
-- update prompts set featured = true where slug in ('slug-one', 'slug-two');
