-- 004 — Catalogue fields for the add-on Shop (2026-10-30)
-- NOT YET RUN on the ByMagiq database. On 2026-10-30 it was run by mistake on the
-- Scrhoz Supabase project (project ref starting rjuifb). Safe to run twice.
-- Adds categories, availability and the detail-page text fields.
-- Free means price_cents = 0. Existing rows keep category = null and show under
-- "Prompts" on the Shop until they are categorised, moved or deactivated.
-- Category slugs must match lib/catalogue.ts.

alter table prompts
  add column if not exists category text
    check (category in ('playbooks','vault-modules','starter-kits','skills','asset-packs','automation-recipes','methodology-guides')),
  add column if not exists availability text not null default 'coming-soon'
    check (availability in ('coming-soon','available')),
  add column if not exists requires_vault boolean not null default false,
  add column if not exists sort_order integer not null default 0,
  add column if not exists requirements text,
  add column if not exists what_you_get text,
  add column if not exists delivery_format text;
