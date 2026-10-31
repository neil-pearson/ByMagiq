# SQL scripts (Supabase)

One file per change to the database. Run each in the Supabase SQL Editor, in number order.

## Rules

- **One new file per change.** Name it `NNN-what-it-does-YYYY-MM-DD.sql` with the next number.
- **Never edit a file after it has been run.** If something needs fixing, add a new file.
- **Put the status in the file's header comment**, for example "Run on production 2026-10-30".
- Files starting with `_` are templates. Copy one to a new numbered file; don't run it as is.

## What has been run

| File | What it does | Run on production |
|------|--------------|-------------------|
| `001-create-prompts-table.sql` | The `prompts` table and its read rule | Yes |
| `002-seed-example-prompts.sql` | Two placeholder rows | Yes |
| `003-seed-real-prompts-2026-10-06.sql` | The six real prompts | Yes |
| `004-add-catalogue-fields-2026-10-30.sql` | Category, availability and detail-page fields | Yes (reported by Neil 2026-10-31). It was also run on the Scrhoz project by mistake on 2026-10-30; see the clean-up file below |
| `005-lock-down-delivery-columns-2026-10-31.sql` | Stops the public key reading `delivery_type` and `delivery_content` | Yes (reported by Neil 2026-10-31) |
| `006-add-first-shop-entries-2026-10-31.sql` | Two playbooks and three vault modules, paid at $9, shown as coming with the vault | Yes (reported by Neil 2026-10-31); ByMagiq project only |
| `scrhoz-cleanup-drop-004-columns-2026-10-31.sql` | Drops the six columns 004 added to the Scrhoz `prompts` table. Runs on the **Scrhoz** project, not ByMagiq | **Not needed.** Check 1 on the Scrhoz project on 2026-10-31 showed none of the six columns exist; nothing to drop |

Keep this table up to date when you add a file. Each script must be run on the right Supabase project: the ByMagiq project's `prompts` table has `price_cents` and `delivery_content`; the Scrhoz project has a different `prompts` table. Check the project name before running anything. The long `delivery_content` text for each prompt was entered directly in Supabase, so it is not in these scripts.
