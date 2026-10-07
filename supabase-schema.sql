-- ByMagiq Shop — prompts table
-- Run this in Supabase SQL Editor before the Shop page will show real data.

create table if not exists prompts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  price_cents integer not null,
  stripe_price_id text,
  is_active boolean not null default true,
  delivery_type text not null default 'text' check (delivery_type in ('text', 'file')),
  delivery_content text,
  created_at timestamptz not null default now()
);

-- Row Level Security: anyone can read active prompts, nobody can write via the public API
alter table prompts enable row level security;

create policy "Public can read active prompts"
  on prompts for select
  using (is_active = true);

-- Example seed rows — replace with real prompts, or delete and add your own via the Table Editor
insert into prompts (slug, title, description, price_cents) values
  ('research-deep-dive', 'Research Deep Dive', 'A structured prompt for turning a vague research question into a thorough, well-sourced brief.', 900),
  ('weekly-review', 'Weekly Systems Review', 'Walks Claude through reviewing everything you shipped and stalled on this week, and what to prioritise next.', 700)
on conflict (slug) do nothing;

-- Added 2026-10-06 — real catalogue, not placeholders. Full delivery_content for
-- each lives in Supabase directly (too long to duplicate here); see ByMagiq-Website/log.md.
insert into prompts (slug, title, description, price_cents) values
  ('decision-journal', 'Decision Journal', 'A structured prompt for thinking through a hard decision — surfaces your real reasoning instead of just telling you what to pick, and leaves a dated record to check back on later.', 800),
  ('inbox-backlog-triage', 'Inbox/Backlog Triage', 'A conversational prompt for getting an overwhelming pile of pending tasks down to something sane — sorted by what actually matters, not what feels urgent.', 700),
  ('goal-decomposition', 'Goal Decomposition', 'A structured prompt for turning a big, vague goal into a concrete plan — works backward from the finish line to a specific action you can take this week.', 800),
  ('second-brain-capture', 'Second Brain Capture', 'A structured prompt for turning messy notes or a stream-of-consciousness dump into something worth keeping in your notes system — properly filed, not just cleaned-up prose.', 900),
  ('content-repurposing', 'Content Repurposing', 'A structured prompt for turning one piece of writing into multiple formats — rebuilt for how each format is actually consumed, not just cut down thinner each time.', 800),
  ('meeting-notes-to-actions', 'Meeting Notes → Actions', 'A structured prompt for turning messy meeting notes into clear follow-ups — decisions, owners, and deadlines, not just a summary of what was discussed.', 700)
on conflict (slug) do nothing;
