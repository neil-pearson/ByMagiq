-- 003 — Real prompt catalogue (2026-10-06)
-- Already run on production. Real catalogue, not placeholders. The full
-- delivery_content for each lives in Supabase directly (too long to duplicate
-- here); see the ByMagiq-Website project log in the Latticaxon vault.

insert into prompts (slug, title, description, price_cents) values
  ('decision-journal', 'Decision Journal', 'A structured prompt for thinking through a hard decision — surfaces your real reasoning instead of just telling you what to pick, and leaves a dated record to check back on later.', 800),
  ('inbox-backlog-triage', 'Inbox/Backlog Triage', 'A conversational prompt for getting an overwhelming pile of pending tasks down to something sane — sorted by what actually matters, not what feels urgent.', 700),
  ('goal-decomposition', 'Goal Decomposition', 'A structured prompt for turning a big, vague goal into a concrete plan — works backward from the finish line to a specific action you can take this week.', 800),
  ('second-brain-capture', 'Second Brain Capture', 'A structured prompt for turning messy notes or a stream-of-consciousness dump into something worth keeping in your notes system — properly filed, not just cleaned-up prose.', 900),
  ('content-repurposing', 'Content Repurposing', 'A structured prompt for turning one piece of writing into multiple formats — rebuilt for how each format is actually consumed, not just cut down thinner each time.', 800),
  ('meeting-notes-to-actions', 'Meeting Notes → Actions', 'A structured prompt for turning messy meeting notes into clear follow-ups — decisions, owners, and deadlines, not just a summary of what was discussed.', 700)
on conflict (slug) do nothing;
