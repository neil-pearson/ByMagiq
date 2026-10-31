-- SCRHOZ PROJECT CLEAN-UP (2026-10-31) — run on the SCRHOZ Supabase project ONLY (ref starts rjuifb)
-- Not part of the numbered ByMagiq sequence: it undoes script 004, which was run on the Scrhoz
-- project by mistake on 2026-10-30. 004 added six columns to Scrhoz's `prompts` table:
--   availability, requires_vault, sort_order, requirements, what_you_get, delivery_format
-- (004 also tried to add `category`, but Scrhoz already had that column, so nothing was added or
-- changed there. This script does NOT touch `category`.)
--
-- STATUS: NOT NEEDED. On 2026-10-31 Neil ran Check 1 on the Scrhoz project and none of the six
-- columns exist (Check 2 failed with "column availability does not exist"), so there is nothing
-- to drop. Do not run the drop. Kept as a record.
--
-- How to use: run the three checks one at a time (the SQL Editor shows only the last result),
-- read the "Expect" line under each, then run the drop. The drop stops with an error, and
-- changes nothing, if it is on the wrong project or any of the six columns holds real data.
-- Scrhoz's site code reads `prompts` with select('*') and does not name these six columns
-- (checked in pages/prompts, lib/schema.js and pages/sitemap.xml.js on 2026-10-31).

-- ============ CHECK 1 — is this the Scrhoz project, and where do the six columns sit? ============
-- Expect: gumroad_link, file_url and price_free present; price_cents and delivery_content absent;
-- the six columns above are the LAST six rows (highest ordinal_position).
select ordinal_position, column_name, data_type, column_default
from information_schema.columns
where table_schema = 'public' and table_name = 'prompts'
order by ordinal_position;

-- ============ CHECK 2 — do the six columns hold anything other than their defaults? ============
-- Expect: total_rows 9 (or however many Scrhoz prompts you have) and every other number 0.
select
  count(*)                                              as total_rows,
  count(*) filter (where availability <> 'coming-soon') as availability_not_default,
  count(*) filter (where requires_vault)                as requires_vault_true,
  count(*) filter (where sort_order <> 0)               as sort_order_not_default,
  count(requirements)                                   as requirements_filled,
  count(what_you_get)                                   as what_you_get_filled,
  count(delivery_format)                                as delivery_format_filled
from public.prompts;

-- ============ CHECK 3 — does anything in the database depend on the six columns? ============
-- Expect: no rows.
select 'view' as kind, view_name as name
from information_schema.view_column_usage
where table_schema = 'public' and table_name = 'prompts'
  and column_name in ('availability','requires_vault','sort_order','requirements','what_you_get','delivery_format')
union all
select 'index', indexname
from pg_indexes
where schemaname = 'public' and tablename = 'prompts'
  and indexdef ~ '(availability|requires_vault|sort_order|requirements|what_you_get|delivery_format)'
union all
select 'policy', policyname
from pg_policies
where schemaname = 'public' and tablename = 'prompts'
  and (coalesce(qual, '') || coalesce(with_check, '')) ~ '(availability|requires_vault|sort_order|requirements|what_you_get|delivery_format)';

-- ============ DROP — only after all three checks look right ============
do $$
declare
  n bigint := 0;
  have int;
begin
  -- Guard 1: wrong project (the ByMagiq prompts table has these columns; Scrhoz's does not)
  if exists (
       select 1 from information_schema.columns
       where table_schema = 'public' and table_name = 'prompts'
         and column_name in ('price_cents', 'delivery_content'))
     or not exists (
       select 1 from information_schema.columns
       where table_schema = 'public' and table_name = 'prompts' and column_name = 'gumroad_link')
  then
    raise exception 'Stopped: this does not look like the Scrhoz project. Nothing was changed.';
  end if;

  -- Guard 2: any real data in the six columns
  select count(*) into have
  from information_schema.columns
  where table_schema = 'public' and table_name = 'prompts'
    and column_name in ('availability','requires_vault','sort_order','requirements','what_you_get','delivery_format');

  if have = 6 then
    execute $q$
      select count(*) from public.prompts
      where availability <> 'coming-soon' or requires_vault or sort_order <> 0
         or requirements is not null or what_you_get is not null or delivery_format is not null
    $q$ into n;
    if n > 0 then
      raise exception 'Stopped: % row(s) hold real data in these columns. Nothing was changed.', n;
    end if;
  end if;

  alter table public.prompts
    drop column if exists availability,
    drop column if exists requires_vault,
    drop column if exists sort_order,
    drop column if exists requirements,
    drop column if exists what_you_get,
    drop column if exists delivery_format;
end $$;

-- ============ VERIFY ============
-- Expect: no rows from the first query; the second returns the same row count as Check 2.
select column_name
from information_schema.columns
where table_schema = 'public' and table_name = 'prompts'
  and column_name in ('availability','requires_vault','sort_order','requirements','what_you_get','delivery_format');

select count(*) as total_rows from public.prompts;
