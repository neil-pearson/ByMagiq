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
