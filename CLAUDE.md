# CLAUDE.md — Session Context for Claude Code

## Who is the user

Stepan (alterroman) — GP at cyber-Fund, a VC fund focused on cyber/crypto investments. Uses Cybos as his personal AI operating system for research, content, messaging, and deal flow.

## What is Cybos

Cybernetic Operating System — an AI-powered VC operations assistant built as a set of Claude Code skills, agents, and workflows. It handles company DD, content creation, Telegram, email, investment memos, and more. All interaction happens via `/cyber-*` slash commands.

## Current Setup Status (as of 2026-03-01)

### Done
- Claude Code CLI installed on Stepan's Mac (via `npm install -g @anthropic-ai/claude-code`)
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
   git clone https://github.com/alterroman/cybos.git ~/cybos
   ```
3. **Set up CybosVault** — create `~/CybosVault/` with private/shared structure
   - See `docs/SETUP.md` for the setup wizard or manual steps
   - The setup wizard runs at `http://localhost:3847/setup`
4. **Configure environment** — API keys for MCP servers (Perplexity, Exa, Gemini, etc.)
   - Copy `.env.example` to `.env` and fill in keys
5. **Install dependencies**
   ```bash
   curl -fsSL https://bun.sh/install | bash
   cd ~/cybos && bun install
   ```
6. **Run `claude`** from `~/cybos` directory — this loads all skills, agents, and hooks automatically
7. **Test with a simple command** like `/cyber-brief` or `/cyber-research-topic "test"`

## Key Architecture Notes

- **Code** lives in `~/cybos/` (this repo)
- **Data** lives in `~/CybosVault/` (private vault, never committed)
- All workflows are in `.claude/skills/` and `.claude/commands/`
- Agents run in parallel via the Task tool
- MCP servers: exa, perplexity, parallel-task, nano-banana, gmail, playwright, notion
- Read `AGENTS.md` for full workflow mapping and slash command reference
- Read `docs/ARCHITECTURE.md` only when modifying the application

## BD Pipeline (Serokell)

Stepan also runs a BD pipeline for Serokell (Rust/Haskell consulting). Commands:
- `/cyber-bd-find-leads` — find Rust companies
- `/cyber-bd-research-lead "Company"` — deep-dive on a lead
