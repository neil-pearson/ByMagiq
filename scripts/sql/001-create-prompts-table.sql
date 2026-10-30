-- 001 — Create the prompts table and its security rules
-- First Shop build. Already run on production.
-- Run in the Supabase SQL Editor.

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
