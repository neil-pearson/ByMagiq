-- 010 — Orders table and delivery claim (2026-11-01)
-- STATUS: not yet run. ByMagiq Supabase project only (the one whose prompts
-- table has price_cents and delivery_content).
--
-- Why: the Stripe webhook needs a record of each paid checkout session so that
--   * a duplicate or replayed event never sends a second delivery email,
--   * a failed delivery email leaves a record (status 'failed') and Stripe
--     retries the event until it works,
--   * you can see what was bought and delivered.
-- Run this BEFORE deploying the webhook code that uses it (the webhook reads
-- and writes `orders` and calls claim_order_delivery).
--
-- The table holds buyer emails, so it is locked down: row level security on,
-- no policies, nothing granted to the public or signed-in roles. Only the
-- server-side service-role key (lib/supabase-admin.ts) can read or write it.

create table if not exists orders (
  stripe_session_id text primary key,
  prompt_id         text,
  email             text,
  amount_total      integer,
  currency          text,
  status            text not null default 'received'
                    check (status in ('received', 'sending', 'delivered', 'failed')),
  attempts          integer not null default 0,
  last_error        text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  delivered_at      timestamptz
);

alter table orders enable row level security;
revoke all on orders from anon, authenticated;

-- Atomically claims an order for delivery. Returns true for exactly one
-- caller: an order that is 'received' or 'failed', or one stuck in 'sending'
-- for over 5 minutes (a crashed attempt). A delivered order, or one another
-- request is sending right now, returns false.
create or replace function claim_order_delivery(p_session_id text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  n integer;
begin
  update orders
     set status = 'sending',
         attempts = attempts + 1,
         updated_at = now()
   where stripe_session_id = p_session_id
     and (
       status in ('received', 'failed')
       or (status = 'sending' and updated_at < now() - interval '5 minutes')
     );
  get diagnostics n = row_count;
  return n = 1;
end;
$$;

revoke all on function claim_order_delivery(text) from public, anon, authenticated;
grant execute on function claim_order_delivery(text) to service_role;

-- To see what needs attention (failed deliveries):
-- select stripe_session_id, email, prompt_id, last_error, attempts, updated_at
-- from orders where status <> 'delivered' order by created_at desc;
