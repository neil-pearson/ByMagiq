-- 002 — Example seed rows
-- Placeholder rows from the first Shop build. Already run on production.
-- Replace or delete these via the Supabase Table Editor if they are still there.

insert into prompts (slug, title, description, price_cents) values
  ('research-deep-dive', 'Research Deep Dive', 'A structured prompt for turning a vague research question into a thorough, well-sourced brief.', 900),
  ('weekly-review', 'Weekly Systems Review', 'Walks Claude through reviewing everything you shipped and stalled on this week, and what to prioritise next.', 700)
on conflict (slug) do nothing;
