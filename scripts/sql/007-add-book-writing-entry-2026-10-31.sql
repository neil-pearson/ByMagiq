-- 007 — Shop entry for the Book Writing vault module (2026-10-31)
-- STATUS: run on the ByMagiq project (Neil saw Book Writing in the Shop 2026-10-31)
-- Run on the BYMAGIQ Supabase project only. On the Scrhoz project it fails with
-- "column price_cents does not exist" and changes nothing. Safe to run twice
-- (an existing slug is skipped).
-- Paid at $9 (price_cents = 900), shown as "coming with the vault". Text approved by
-- Neil on 2026-10-31 and checked against System/Modules/Book-Writing/Book-Writing-Guide.md.
-- This is the Shop listing only. No delivery content: add it, and set availability to
-- 'available', only once the module is packaged and can be delivered.

insert into prompts (slug, title, description, price_cents, category, availability, requires_vault, sort_order, requirements, what_you_get, delivery_format)
values
(
  'book-writing',
  'Book Writing',
  'Take a fiction book from idea to finished draft, with each book kept as its own project in your vault.',
  900,
  'vault-modules',
  'coming-soon',
  true,
  4,
  'The ByMagiq vault and an author profile to write in.',
  'Commands to set up a book (title, genre, premise, word-count target, one storyline or several, and the author voice), then plan it step by step: premise, outline, acts, chapter breakdown, characters, locations and chapter summaries. It drafts chapters from beat sheets and saves a backup of a live chapter before changing it. A devices ledger tracks repeated openings, closings and imagery. Review prompts check plot holes, consistency and each act, and log every issue to a fix list you work through one file at a time.',
  'Markdown files'
)
on conflict (slug) do nothing;

-- Check: expect 6 rows (the five from 006 plus this one), all paid at 900 and coming-soon
select slug, category, price_cents, availability, requires_vault, sort_order
from prompts
where slug in ('goal-to-12-week-plan','decision-to-documented-decision','non-fiction-writing','trip','connections','book-writing')
order by category, sort_order;
