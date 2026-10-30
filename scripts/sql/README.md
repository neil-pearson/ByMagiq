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
| `004-add-catalogue-fields-2026-10-30.sql` | Category, availability and detail-page fields | Yes (2026-10-30) |

Keep this table up to date when you add a file. The Supabase database itself holds more than these scripts show: for example, the long `delivery_content` text for each prompt was entered directly in Supabase.
