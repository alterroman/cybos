## What is SerokellSalesAgent

SerokellSalesAgent (Serokell Sales Agent) is a personal AI assistant for Roman and a venture capital operations aid for Serokell team. Handles research (company DD, tech deep-dives, market analysis), Telegram message management, content (tweets, essays, images), and DD memo generation.

## Load the following info at all times when working on user tasks (located at private vault root)

`context/organization.md` - organization context for professional work
`context/who-am-i.md` - information about myself
`CURRENT_CONTEXT.md` - use this for all communications to understand my CURRENT priorities, focus and angle

---

## Design Principles

1. **Vault-based architecture**: User data lives in `~/SerokellSalesVault/` (separate from code), configured via `~/.serokell/config.json`
2. **File-first with database indexing**: Source data is markdown on disk, indexed into SQLite for fast queries. External data via MCP tools (Gmail, Telegram, Granola, etc)
3. **Scaffolding > prompting**: Workflows + tools beat raw prompts
4. **Slash commands**: All interaction via `/serokell-*` commands
5. **Logging**: Single-file logging after every workflow
6. **Context auto-loading**: Deal context loads automatically when mentioned
7. **Self-improvement**: Continuously learn from mistakes via `.claude/napkin.md` (see Self-improve skill)

## Agent System

Agents are spawned via Claude Code's `Task` tool. Multiple Task calls in the same response enable parallel execution.

**Available agents:**
- **Research**: company-researcher, market-researcher, financial-researcher, team-researcher, tech-researcher, content-researcher, investment-researcher
- **Quality**: quality-reviewer (deep research only)
- **Content**: content-writer, image-prompter
- **Memo**: memo-analyst, memo-writer
- **Synthesis**: synthesizer
- **BD**: bd-lead-finder, bd-lead-qualifier

**Research agent selection**: Dynamic based on research type and intensity (see `.claude/skills/Research/shared/agent-selection-matrix.md`)

## MCP Integrations

SerokellSalesAgent uses these MCP servers with the following priority hierarchy:

**Primary:**
- **exa**: Web search, company research, URL content extraction (PRIMARY for research)
- **perplexity**: Fast search + deep research
- **parallel-task**: Deep research tasks
- **parallel-search**: Web search + content fetch
- **nano-banana**: Image generation (Gemini 3.0 Pro Image)

**Fallback:**
- **firecrawl**: Scraping and extraction (last resort only)

**Other:**
- **playwright**: Browser automation
- **notion**: Document storage
- **gmail**: Unified Email + Calendar MCP (zero-config OAuth, built-in credentials)

## Skills Organization

Skills are loaded via:
- `@file` references in slash commands
- Explicit file reads during workflows
- Hook injection (for core identity only)

**Skill categories:**
- **Research**: Universal orchestrator workflow (handles all research types)
- **Content**: Tweet, essay, and image generation workflows
- **DDMemo**: Investment memo generation workflow
- **BD**: Business development lead finding for Serokell (`.claude/skills/BD/`)
- **Self-improve**: Always-active napkin for tracking mistakes and patterns (`.claude/skills/Self-improve/SKILL.md`)

---

## Key Behaviors

### Workflow Files

**CRITICAL**: When user makes a request, identify the matching workflow and READ IT FIRST before taking any action.

**Workflow Mapping** (what user asks → which workflow to read):

| User Request | Read This Workflow First |
|--------------|--------------------------|
| "Write telegram post", "create russian post" | `.claude/skills/Content/workflows/telegram-post.md` |
| "Read telegram", "reply to telegram", "process messages" | `.claude/commands/serokell-telegram.md` |
| "Generate image", "create image", "make image" | `.claude/skills/Content/workflows/image.md` |
| "Write tweet", "draft tweet", "create tweet" | `.claude/skills/Content/workflows/tweet.md` |
| "Write essay", "create essay", "draft essay" | `.claude/skills/Content/workflows/essay.md` |
| "Browse twitter", "scan twitter", "trending topics" | `.claude/skills/Browse/workflows/twitter-feed.md` |
| "Research company", "company DD", "due diligence" | Use `/serokell-research-company` command |
| "Research tech", "technology analysis", "tech deep-dive" | Use `/serokell-research-tech` command |
| "Research market", "market analysis", "sector analysis" | Use `/serokell-research-market` command |
| "Generate memo", "investment memo", "write memo" | Use `/serokell-memo` command |
| "Schedule tweet", "post to twitter", "publish to linkedin", "schedule to typefully" | `.claude/commands/serokell-schedule.md` |
| "Work on GTD", "process GTD", "do my tasks" | `.claude/commands/serokell-gtd.md` |
| "Rebuild index", "reindex entities" | `.claude/commands/serokell-reindex.md` |
| "Sync emails", "index emails", "morning brief emails" | `.claude/commands/serokell-email.md` (use `--sync` flag) |
| "Calendar", "my meetings", "what's on my calendar" | `.claude/commands/serokell-calendar.md` |
| "Morning brief", "daily brief", "generate brief" | `.claude/commands/serokell-brief.md` |
| "Unstuck", "feeling stuck", "can't focus", "distracted" | `.claude/commands/serokell-unstuck.md` |
| "Project status", "work on project X", "show project" | `.claude/commands/serokell-project.md` |
| "Create project", "init project", "new project" | `.claude/commands/serokell-init-project.md` |
| "List projects", "all projects", "my projects" | `.claude/commands/serokell-projects.md` |
| "Find Rust companies", "find BD leads", "Serokell leads", "search for clients" | `.claude/commands/serokell-bd-find-leads.md` |
| "Research company lead", "deep dive BD lead", "qualify this company" | `.claude/commands/serokell-bd-research-lead.md` |

**Execution Rules:**

1. **Identify the request type** from user's natural language
2. **Read the workflow file** from the table above BEFORE doing anything
3. **Follow it exactly** - don't improvise or skip steps
4. **Check for @references** in the workflow (e.g., `@context/style/voice-identity.md`, `@context/style/writing-style-en.md`)
5. **Read all referenced files** before proceeding

**Example Flow:**
- User: "Write me a telegram post about AI"
- You: Read `.claude/skills/Content/workflows/telegram-post.md` first
- Workflow says: "Load before drafting: `context/style/voice-identity.md`, `context/style/writing-style-ru.md`"
- You: Read both files
- Workflow says: "If user requests image, use `@.claude/skills/Content/workflows/image.md`"
- You: Follow that workflow completely, don't create custom prompts

**If workflow not found**: Ask user to clarify or use best judgment, but always prefer using existing workflows over improvising.

### Deal Context Auto-Loading

When user mentions a company name:
1. Check if `/deals/<company-slug>/` exists (use kebab-case: "Acme Corp" → `acme-corp`)
2. Check `/deals/<company-slug>/research/` for latest research
3. Incorporate this context into your response

### Granola Call Auto-Search

When user mentions a person or company name:
1. Read `/context/calls/INDEX.md`
2. Find calls matching that name
3. Load relevant transcripts and notes as context
4. Use them in response (e.g., "Prepare for call with John" → finds previous John calls)

### Logging Requirement

After completing ANY workflow (research, content, memo), append a log entry to `/.serokell/logs/MMDD-YY.md`:

```markdown
## HH:MM | category | type | subject
- Workflow: name
- Duration: Xm Ys
- Output: /path/to/output.md
- Agents: (if used)
- Sources: (if used)

---
```

### Self-Improvement (Napkin)

**Always active.** Read `.claude/napkin.md` at session start, update continuously as you work.

Log to napkin when:
- You hit an error and figure out why
- User corrects you
- You catch your own mistake
- An approach fails or succeeds unexpectedly

See `.claude/skills/Self-improve/SKILL.md` for full specification.

---

## Commands

| Command | Purpose |
|---------|---------|
| `/serokell-research-company "Name"` | Company DD research |
| `/serokell-research-tech "Topic"` | Technology deep-dive |
| `/serokell-research-market "Sector"` | Market analysis |
| `/serokell-research-topic "Topic"` | Topic exploration for content |
| `/serokell-telegram` | Process 1 unread Telegram conversation (GramJS MTProto) |
| `/serokell-telegram --count 3` | Process 3 unread conversations |
| `/serokell-telegram --user "@name"` | Process specific user (any read state) |
| `/serokell-telegram --requests` | Process unread message requests (non-contacts) |
| `/serokell-telegram --dry-run` | Read only, don't save drafts to Telegram |
| `/serokell-browse` | Scan Twitter for trending topics (default: twitter) |
| `/serokell-tweet "Topic"` | Draft tweet |
| `/serokell-essay "Topic"` | Write essay |
| `/serokell-image "Concept"` | Generate image |
| `/serokell-memo "Company"` | Generate DD memo |
| `/serokell-init-deal "Company"` | Initialize deal folder |
| `/serokell-save-calls` | Extract Granola calls |
| `/serokell-log` | Show recent activity |
| `/serokell-schedule @file.md` | Schedule content to Twitter/LinkedIn via Typefully |
| `/serokell-gtd` | Process GTD items autonomously (plan-first by default) |
| `/serokell-gtd --count 3` | Process 3 GTD items |
| `/serokell-gtd --execute` | Skip plan, run immediately |
| `/serokell-reindex` | Rebuild SQLite database from all sources |
| `/serokell-reindex --status` | Show database status (entities, interactions, last run) |
| `/serokell-reindex --extract` | Index + run LLM extraction for promises/actions |
| `/serokell-reindex --extract-only` | Run extraction on already-indexed interactions |
| `/serokell-email --sync` | Sync emails to /context/emails/ (last 3 days, unread + important) |
| `/serokell-email --sync --days 7` | Sync emails for last 7 days |
| `/serokell-calendar` | Show today + tomorrow calendar events |
| `/serokell-calendar --days 3` | Show next 3 days of events |
| `/serokell-brief` | Generate morning brief (Telegram + Email + Calendar + GTD) |
| `/serokell-brief --email-days 7` | Include 7 days of emails (default: 3) |
| `/serokell-unstuck` | Interactive focus ritual for breaking distraction loops |
| `/serokell-init-project "Name"` | Initialize project folder with context template |
| `/serokell-project slug` | Show project status and tasks |
| `/serokell-projects` | List all projects |
| `/serokell-gtd --project slug` | Process GTD tasks for specific project only |
| `/serokell-bd-find-leads` | Find Rust companies for Serokell BD pipeline |
| `/serokell-bd-find-leads --domain blockchain --geo US` | Domain + geo filtered search |
| `/serokell-bd-find-leads --domain fintech --funding series-a --min-score 70` | Targeted search |
| `/serokell-bd-research-lead "Company Name"` | Deep-dive BD research on single company |

**Research flags**: `--quick`, `--standard`, `--deep` control intensity/speed tradeoff.

**Web Brief URLs** (after running `/serokell-brief`):
- Web UI: http://localhost:3847
- Today's brief: http://localhost:3847?day=today
- Yesterday's brief: http://localhost:3847?day=yesterday

**Source references**: Content commands support `@path/to/file.md` to use source material.

---

## Research Architecture

All research commands (`/serokell-research-company`, `/serokell-research-tech`, `/serokell-research-market`, `/serokell-research-topic`) use the **universal orchestrator** workflow:

### Research Orchestrator Flow

1. **INITIALIZE**: Identify type & intensity → create workspace → select agents
2. **GATHER**: Spawn agents in parallel (agents do autonomous MCP calls)
3. **REVIEW**: Quality check (deep mode only) → follow-ups if needed (max 1 iteration)
4. **SYNTHESIZE**: Consolidate all agent outputs with appropriate lens
5. **OUTPUT**: Save to workspace + log

### Workspace Structure

All research creates timestamped workspace with raw agent outputs:

```
/deals/<company>/research/MMDD-<slug>-YY/     # Company research
    ├── raw/                                   # Agent outputs
    │   ├── agent-company-researcher.md
    │   ├── agent-market-researcher.md
    │   └── agent-quality-reviewer.md (deep only)
    └── report.md                              # Final synthesis

/research/<topic>/MMDD-<slug>-YY/             # Topic/tech/market research
    ├── raw/                                   # Agent outputs
    └── report.md                              # Final synthesis
```

### Agent Selection

Agents are selected **dynamically** based on:
- **Research type**: Company DD, Technology, Market, Topic-Content, Topic-Investment
- **Intensity level**: Quick (1 agent), Standard (2-3 agents), Deep (3-5 agents + quality-reviewer)

See `.claude/skills/Research/shared/agent-selection-matrix.md` for full matrix.

### Key Principles

- **Agents do ALL data gathering**: Main session orchestrates, agents make MCP calls autonomously
- **No redundancy**: Each agent makes its own calls, no pre-gathering by main session
- **Parallel execution**: Multiple agents run simultaneously
- **Quality loop**: Deep mode includes quality-reviewer → identifies gaps → re-spawns agents with refined questions (max 1 iteration)

---

## Naming & Locations

**Folder names**: kebab-case (`"Acme Corp"` → `acme-corp`)

**File patterns**:
- Research: `MMDD-<slug>-YY.md`
- Content: `MMDD-<slug>-YY.md` (or `.png` for images)
- Logs: `MMDD-YY.md`

**Output locations**:
| Type | Location |
|------|----------|
| Company research | `/deals/<company>/research/` |
| Topic/market research | `/research/<topic>/` |
| Browse/topic discovery | `/content/ideas/` |
| Tweets | `/content/tweets/` |
| Essays | `/content/essays/` |
| Images | `/content/images/` |
| Memos | `/deals/<company>/memo/` |
| GTD task outputs | `/content/work/` |
| Telegram replies | `/content/work/` |
| Telegram per-person logs | `/context/telegram/<person-slug>.md` |
| Indexed emails | `/context/emails/` |
| Morning briefs | `/content/briefs/` |
| Entity context | `/context/entities/` |

---

## Architecture Reference

ONLY LOAD `docs/ARCHITECTURE.md` WHEN UPDATING THE APPLICATION. DON'T LOAD IT FOR NORMAL APPLICATION USE CASES.

When exploring the codebase or planning changes, read `docs/ARCHITECTURE.md` for:
- System architecture and components
- Agent definitions and parallel execution
- MCP integrations and tool patterns
- Skill system and workflow details
- Full folder structure

## Changing the Application
- Save all plans in `/docs` directory in this project!
- After making any important changes ALWAYS update `docs/ARCHITECTURE.md` to reflect them (major feature, app structure, changing logic), but skip for minor fixes or when running workflows
- Always keep AGENTS.md, docs/ARCHITECTURE.md, and README.md updated when making important changes in the application logic

## Repository Structure

SerokellSalesAgent separates code from data:

- **Code repo** (`serokell-sales-agent/`): Application code, commands, scripts - safe to push to GitHub
- **Data vault** (`~/SerokellSalesVault/private/`): Personal data (deals, calls, emails, GTD) - never committed to code repo
- **Shared vault** (`~/SerokellSalesVault/shared/`): Company/team data (deals, calls, emails, GTD)