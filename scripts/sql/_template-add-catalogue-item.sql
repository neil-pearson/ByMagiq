-- TEMPLATE (not to be run as is) — add one catalogue item to the Shop
-- Copy to a new numbered file, for example 005-add-<item-name>-YYYY-MM-DD.sql,
-- fill in the values, then run that copy in the Supabase SQL Editor.
--
-- category:     playbooks | vault-modules | starter-kits | skills | asset-packs
--               | automation-recipes | methodology-guides
-- price_cents:  0 = free. Paid items show "Paid" until prices are switched on.
-- availability: keep 'coming-soon' until the item exists and can be delivered.
-- requires_vault: true if it only works with Latticaxon.
-- delivery_type / delivery_content: for a free open download, 'file' and an
--               https:// link. Leave both out until the item is available.

insert into prompts (slug, title, description, price_cents, category, availability, requires_vault, requirements, what_you_get, delivery_format)
values (
  'example-slug',
  'Example title',
  'One plain-language line on what it does.',
  0,
  'skills',
  'coming-soon',
  true,
  null,
  'What the buyer receives, in plain language.',
  'For example: one markdown file'
)
on conflict (slug) do nothing;
