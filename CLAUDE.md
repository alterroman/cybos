# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Cybos

Cybernetic Operating System — an AI-powered VC operations assistant for cyber·Fund built as Claude Code skills, agents, and workflows. Handles company DD, content creation, Telegram/email, investment memos, and GTD. All interaction via `/cyber-*` slash commands.

## Commands

Runtime is **Bun** (not Node). No test framework or linter is configured.

```bash
bun install                          # Install dependencies
bun scripts/health-check.ts          # Validate setup and dependencies
bun scripts/brief-server.ts          # Start HTTP server (port 3847, serves web UI + API)
bun scripts/db/init.ts               # Initialize SQLite database
bun scripts/db/index.ts              # Index entities/interactions into SQLite
bun scripts/db/index.ts --extract    # Index with LLM extraction (promises, actions)
bun scripts/extract-granola.ts       # Extract Granola call transcripts
bun scripts/telegram-gramjs.ts       # Telegram MTProto client
./scripts/vault-sync.sh              # Git sync vault (private/shared)
./scripts/reindex.sh                 # Full reindex orchestrator
```

Web UI (separate package in `scripts/web-brief/`):
```bash
cd scripts/web-brief && bun install && bun run dev    # Dev server
cd scripts/web-brief && bun run build                  # Production build (Vite + React + Tailwind)
```

## Architecture

### Code vs Data Separation

- **Code**: `~/cybos/` (this repo)
- **Data**: `~/CybosVault/` (private vault, never committed) — configured via `~/.cybos/config.json`
- **Private** vault (`~/CybosVault/private/`): local only — identity, calls, telegram, emails, deals, content, GTD, logs, SQLite DB
- **Shared** vault (`~/CybosVault/shared/`): Git-synced for team — deals, research, projects

### Core Design: File-First + SQLite Indexing

All state is markdown on disk. SQLite with FTS5 indexes entities, interactions, and extracted items for fast queries. Database at `~/CybosVault/private/.cybos/db/cybos.sqlite`, schema in `scripts/db/schema-sqlite.sql` (tables: entities, entity_aliases, interactions, extracted_items, batch_runs).

### System Components

- **`.claude/skills/`** — Workflow definitions (Research, Content, DDMemo, GTD, Telegram, Email, Browse, Summarize, BD, Self-improve). Each skill has orchestrator + sub-workflows in markdown.
- **`.claude/agents/`** — 15 agent profiles spawned via Claude Code's `Task` tool for parallel execution. Research agents (Haiku), quality/synthesis (Sonnet), memo-analyst (Opus).
- **`.claude/commands/`** — 35+ slash commands routing to skills/workflows.
- **`.claude/hooks/`** — `load-context.ts` (SessionStart: loads identity, checks DB freshness, auto-extracts Granola) and `session-end.ts` (saves session summary).
- **`scripts/`** — TypeScript/shell utilities: config management (`config.ts`, `paths.ts`), database layer (`db/`), Telegram GramJS integration, brief server (Hono), extraction scripts.
- **`config/`** — `leverage-rules.yaml` (brief scoring rules), vault templates, macOS LaunchAgent plists.

### Research Orchestrator Pattern

All research flows through `.claude/skills/Research/workflows/orchestrator.md` with three intensity tiers:
- **Quick** (10-30s): 1 agent, no review
- **Standard** (2-5m): 2-3 parallel agents (default)
- **Deep** (5-15m): 3-5 agents + quality-reviewer, max 1 feedback iteration

### MCP Server Hierarchy

Search priority: **exa** (primary) → **perplexity** → **parallel-task** (deep research) → **parallel-search** → **firecrawl** (last resort). Image generation via **nano-banana**. Messaging via **gmail** and **typefully** servers. All configured in `.mcp.json`.

### Self-Improvement

`.claude/napkin.md` is an always-active learning log where the system records mistakes, corrections, and patterns across sessions.

## Critical Workflow Rule

**ALWAYS read the matching workflow file BEFORE taking any action on a user request.** See the full workflow mapping table in `AGENTS.md`. Key routing:

- Content requests (tweet, essay, image, telegram post) → read the workflow in `.claude/skills/Content/workflows/`
- Research requests → use the `/cyber-research-*` command
- Telegram processing → `.claude/commands/cyber-telegram.md`
- GTD/tasks → `.claude/commands/cyber-gtd.md`

**Execution order**: Identify request type → read workflow file → read all `@referenced` files → follow workflow exactly.

## Context Loading

Load these from the private vault root when working on user tasks:
- `context/organization.md` — organization context
- `context/who-am-i.md` — user identity
- `CURRENT_CONTEXT.md` — current priorities and focus

**Deal context auto-loading**: When user mentions a company, check `/deals/<company-slug>/research/` for existing context.

## Conventions

- **Folder naming**: kebab-case (`"Acme Corp"` → `acme-corp`)
- **Research workspaces**: `MMDD-<slug>-YY/` (e.g., `0228-acme-corp-26/`)
- **Daily logs**: `MMDD-YY.md` at `~/CybosVault/private/.cybos/logs/`
- **Logging**: Every workflow appends to daily log: `## HH:MM | category | type | subject` with duration, output path, agents, sources
- **Agent output format**: Standardized sections with emoji headers (🔍 Starting, 📊 Data, 💡 Insights, ✅ Strengths, ⚠️ Concerns, 🔗 Sources)

## Changing the Application

- Save plans in `/docs` directory
- After important changes, update `docs/ARCHITECTURE.md`, `AGENTS.md`, and `README.md`
- Skip doc updates for minor fixes or when running workflows

## Key References

- `AGENTS.md` — Detailed agent system, full workflow mapping table, command routing, execution rules
- `docs/ARCHITECTURE.md` — Full 73KB technical reference (read only when modifying the system, not for normal use)
- `docs/SETUP.md` — Installation and configuration
- `docs/USAGE.md` — Workflow details and best practices
