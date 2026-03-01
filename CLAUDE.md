# CLAUDE.md

## Who is the user

Roman — GP at Serokell, a VC fund focused on cyber/crypto investments. Uses SerokellSalesAgent as his personal AI operating system for research, content, messaging, and deal flow.

## What is SerokellSalesAgent

Serokell Sales Agent — an AI-powered VC operations assistant built as a set of Claude Code skills, agents, and workflows. It handles company DD, content creation, Telegram, email, investment memos, and more. All interaction happens via `/serokell-*` slash commands.

## Current Setup Status (as of 2026-03-01)

### Done
- Claude Code CLI installed on Roman's Mac (via `npm install -g @anthropic-ai/claude-code`)
- This repo exists on GitHub at `alterroman/cybos` (private)
- Web-based Claude Code sessions work

### Not Done — Monday's Plan
1. **Install GitHub CLI** — needed to clone the private repo locally
   ```bash
   brew install gh
   gh auth login
   ```
2. **Clone the repo** to local machine
   ```bash
   git clone https://github.com/alterroman/cybos.git ~/serokell-sales-agent
   ```
3. **Set up SerokellSalesVault** — create `~/SerokellSalesVault/` with private/shared structure
   - See `docs/SETUP.md` for the setup wizard or manual steps
   - The setup wizard runs at `http://localhost:3847/setup`
4. **Configure environment** — API keys for MCP servers (Perplexity, Exa, Gemini, etc.)
   - Copy `.env.example` to `.env` and fill in keys
5. **Install dependencies**
   ```bash
   curl -fsSL https://bun.sh/install | bash
   cd ~/serokell-sales-agent && bun install
   ```
6. **Run `claude`** from `~/serokell-sales-agent` directory — this loads all skills, agents, and hooks automatically
7. **Test with a simple command** like `/serokell-brief` or `/serokell-research-topic "test"`

## Key Architecture Notes

- **Code** lives in `~/serokell-sales-agent/` (this repo)
- **Data** lives in `~/SerokellSalesVault/` (private vault, never committed)
- All workflows are in `.claude/skills/` and `.claude/commands/`
- Agents run in parallel via the Task tool
- MCP servers: exa, perplexity, parallel-task, nano-banana, gmail, playwright, notion
- Read `AGENTS.md` for full workflow mapping and slash command reference
- Read `docs/ARCHITECTURE.md` only when modifying the application

## BD Pipeline (Serokell)

Roman also runs a BD pipeline for Serokell (Rust/Haskell consulting). Commands:
- `/serokell-bd-find-leads` — find Rust companies
- `/serokell-bd-research-lead "Company"` — deep-dive on a lead
