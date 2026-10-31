-- 006 — First Shop entries: two playbooks and three vault modules (2026-10-31)
-- STATUS: run on the ByMagiq project (reported by Neil 2026-10-31)
-- Run on the BYMAGIQ Supabase project only. On the Scrhoz project it fails with
-- "column price_cents does not exist" and changes nothing. Safe to run twice
-- (existing slugs are skipped).
-- All five are paid at $9 (price_cents = 900), shown as "coming with the vault".
-- Text approved by Neil on 2026-10-31. No delivery content yet: add it, and set
-- availability to 'available', only once the item exists and can be delivered.
-- Not included yet: Book Writing (its spec needs reading and amending first).
-- Delivery format wording is a plan for packaging and may change when each item
-- is packaged; if it does, add a new numbered file rather than editing this one.

insert into prompts (slug, title, description, price_cents, category, availability, requires_vault, sort_order, requirements, what_you_get, delivery_format)
values
(
  'goal-to-12-week-plan',
  'Goal to 12-Week Plan',
  'Turn one goal into a 12-week plan with milestones, a week-by-week table that fits your weekly hours, and your first three actions.',
  900,
  'playbooks',
  'coming-soon',
  false,
  1,
  'Any AI chat app. Have ready your goal in a few sentences, a start date and the hours you can spare each week.',
  'Six prompts (a setup message and five steps) to paste into one chat, one after another, each with a short check for you before the next. It ends in a plan you can start from on day one: goal and success measure, start and end dates, three to four milestones with target weeks, 12 weeks that stay inside your weekly hours, the top risks with fallbacks, and the first three actions.',
  'PDF and Markdown'
),
(
  'decision-to-documented-decision',
  'Decision to Documented Decision',
  'Turn a decision you''re weighing into a written decision record: options compared, the choice and why, a Yes-or-No expected outcome with a confidence figure, the risks, and a review date.',
  900,
  'playbooks',
  'coming-soon',
  false,
  2,
  'Any AI chat app. Have ready the decision, at least two options, today''s date, your deadline, and roughly when you''ll know how it turned out. Leave out names and private details. This helps you structure a decision and is not financial, legal or medical advice.',
  'Six prompts (setup plus five steps) for one chat. It ends in a decision record, plus a one-row summary you can paste into a spreadsheet or journal.',
  'PDF and Markdown'
),
(
  'non-fiction-writing',
  'Non-Fiction Writing',
  'Take a non-fiction book from idea to compiled manuscript, with each book kept as its own project in your vault.',
  900,
  'vault-modules',
  'coming-soon',
  true,
  1,
  'The ByMagiq vault and an author profile to write in.',
  'Commands to define your book (purpose, audience, structure, tone, evidence), brief every chapter, then outline and draft chapter by chapter in any order. It checks chapters for repeated devices and word-count drift, and compiles the manuscript. It doesn''t cover marketing or launching the book.',
  'Markdown files'
),
(
  'trip',
  'Trip',
  'Plan a trip as a project: a short setup interview, then flights, accommodation, itinerary, travellers and a running budget.',
  900,
  'vault-modules',
  'coming-soon',
  true,
  2,
  'The ByMagiq vault.',
  'Tasks generated from your answers, such as passport and visa checks for international trips, race-day logistics, and transport between stops on multi-stop trips. It tracks estimated against actual spend, and logs what''s already booked instead of making tasks for it.',
  'Markdown files'
),
(
  'connections',
  'Connections',
  'Scan your projects each week for ways to earn from them, alone or combined, then act on, dismiss or leave open each finding.',
  900,
  'vault-modules',
  'coming-soon',
  true,
  3,
  'The ByMagiq vault with a few projects in it. It reads each project''s description and decisions.',
  'A running list of opportunities, a count in your daily brief, and a flag on any project too thin to assess. Findings stay qualitative, with no income projections.',
  'Markdown files'
)
on conflict (slug) do nothing;

-- Check: expect 5 rows, all paid at 900, coming-soon
select slug, category, price_cents, availability, requires_vault, sort_order
from prompts
where slug in ('goal-to-12-week-plan','decision-to-documented-decision','non-fiction-writing','trip','connections')
order by category, sort_order;
