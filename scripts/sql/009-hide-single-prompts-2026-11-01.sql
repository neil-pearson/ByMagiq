-- 009 — Hide the 8 single prompts from the ByMagiq Shop (2026-11-01)
-- STATUS: run by Neil on the ByMagiq project, 2026-11-01 (row count not itemised).
-- ByMagiq Supabase project only (its prompts table has price_cents and
-- delivery_content).
--
-- Why: single paste-and-fill prompts belong on Scrhoz, not ByMagiq (decided
-- 2026-11-01, following the 2026-10-14 rule). Their text is kept for the new
-- Scrhoz prompt packs, so nothing is deleted: the rows are only hidden.
-- The public pages read only is_active = true rows, so the "Prompts" section
-- on /shop disappears by itself once none are left. No code change needed.
--
-- 1. Check first: this should list exactly these 8 slugs and nothing else.
select slug, title, is_active, category
from prompts
where slug in (
  'decision-journal', 'inbox-backlog-triage', 'goal-decomposition',
  'second-brain-capture', 'content-repurposing', 'meeting-notes-to-actions',
  'research-deep-dive', 'weekly-review'
)
order by slug;
-- If a title is missing, its slug was changed after the seed scripts (002,
-- 003): find it with  select slug, title from prompts where category is null;
-- and add its real slug below before running step 2.

-- 2. Hide them. Expect 8 rows back, all with is_active = false.
update prompts
set is_active = false
where slug in (
  'decision-journal', 'inbox-backlog-triage', 'goal-decomposition',
  'second-brain-capture', 'content-repurposing', 'meeting-notes-to-actions',
  'research-deep-dive', 'weekly-review'
)
returning slug, title, is_active;

-- To undo (restores them to the Shop):
-- update prompts set is_active = true where slug in (...same list...);
