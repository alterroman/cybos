---
name: serokell-telegram
description: Process Telegram messages - read, draft replies, save drafts via GramJS
---

Process Telegram messages via GramJS MTProto client. Read messages, generate AI drafts, and save drafts to Telegram without sending.

**CRITICAL: NEVER SEND MESSAGES. Only save drafts to Telegram.**

## Usage

```bash
# Unread mode (default) - process unread conversations
/serokell-telegram                    # 1 unread dialog
/serokell-telegram --count 3          # 3 unread dialogs

# User mode - find specific person (any read state)
/serokell-telegram --user "@username" # By Telegram username
/serokell-telegram --user "Name"      # By name

# Requests mode - message requests folder
/serokell-telegram --requests         # Non-contacts who messaged you

# Modifiers (work with all modes)
/serokell-telegram --dry-run          # Read only, don't save drafts
/serokell-telegram --no-mark-unread   # Don't preserve unread state
```

## Workflow

**Full workflow documentation:** `.claude/skills/Telegram/workflows/process-messages.md`

**Quick summary:**
1. Run GramJS script to fetch messages
2. Read generated work file
3. Generate AI draft replies
4. Present drafts for approval
5. Save approved drafts to Telegram
6. Report summary and log

## Scripts

| Script | Command |
|--------|---------|
| Fetch messages | `bun scripts/telegram-gramjs.ts [flags]` |
| Save drafts | `bun scripts/telegram-save-drafts.ts <work-file>` |
| Quick draft | `bun scripts/save-telegram-draft.ts @username "message"` (instant via API) |

## Output

| Output | Location |
|--------|----------|
| Per-person history | `~/SerokellSalesVault/private/context/telegram/<person-slug>.md` |
| Work file | `~/SerokellSalesVault/private/content/work/MMDD-telegram-replies-YY.md` |
| Logs | `~/SerokellSalesVault/private/.serokell/logs/MMDD-YY.md` |
