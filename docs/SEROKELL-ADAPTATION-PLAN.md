# Cybos → Serokell BD OS: Adaptation Plan

> One-week implementation plan to transform Cybos from a VC personal assistant (cyber.Fund/Stepan)
> into a Serokell-specific Sales & BD Operating System, with a design stub for Phase 2
> (commercial proposal engine).

---

## Who Is Serokell (Research Summary)

**What they are**: Boutique software engineering consultancy (Serokell OÜ, Estonia, est. 2015).
Globally distributed, 20–50 people. Bootstrapped. Revenue entirely from project fees.

**Technical moat**: One of ~5 firms globally capable of production-grade Haskell at blockchain
protocol scale. Unique combination of Haskell + Nix/NixOS + formal verification + blockchain.
Key open-source assets: `deploy-rs` (2K GitHub stars), `universum` (185 stars).

**Confirmed clients**: IOHK/Cardano, TQ Tezos, Globacap, Runtime Verification, Telegram/TON.

**ICP (Ideal Customer Profile)**:
- Engineering-led orgs (CTO or VP Eng as decision maker)
- Industries: blockchain/crypto protocols, formal verification, high-correctness fintech,
  language/compiler companies, systems software
- Stage: Series A or later (real budget for premium engineering)
- Problem: "We can't hire Haskell engineers" or "we need a custom smart contract language"
  or "our Haskell codebase is too slow" or "we need a Nix-based infra"
- Geography: UK and US historically; open to global
- Engagement: $100K–$2M+, 3–18 months, 2–6 engineers

**Current BD situation**: 100% inbound. No outbound capability. No dedicated BD role.
Tezos client relationship winding down (tezos-packaging deprecated May 2025). Active signals:
deploy-rs still has high GitHub traffic; Haskell job market remains thin globally.

**BD gaps this system must fill**:
1. Proactively surface companies about to need Serokell
2. Monitor timing signals (Haskell job postings, new blockchain protocols, Nix adoption)
3. Score and prioritize leads by ICP fit
4. Generate high-quality cold email drafts (technical credibility tone)
5. Prepare company research memos for sales conversations
6. Track BD pipeline and follow-up cadence

---

## Target State (Phase 1 Complete)

A Serokell BD operator (you) starts each day and runs:

```
/serokell-brief           → Daily BD brief: new signals, follow-ups due, pipeline summary
/serokell-scan            → Scan GitHub/job boards for new Haskell/Nix/blockchain companies
/serokell-research "Acme" → Deep company research: ICP fit score, decision makers, angle
/serokell-email "Acme"    → Draft cold outreach email for this company
/serokell-pipeline        → Show BD pipeline board with all stages
/serokell-gtd             → Execute BD tasks from GTD.md
/serokell-telegram        → Process Telegram messages, draft replies
```

Everything logs, sessions resume, and the vault accumulates institutional memory about
every company, contact, and interaction.

---

## Phase 2 Target State (Commercial Proposal Engine)

When a prospect becomes a lead and shares a project request:

```
/serokell-proposal "Acme" → Full proposal workflow:
  1. Ingest client request (document, email, or description)
  2. Research: similar GitHub projects, academic papers, existing approaches
  3. Technical design: recommended architecture, team composition
  4. Effort estimation: function points or analogy-based hour estimates
  5. Output: proposal draft (PDF-ready markdown) + internal estimate sheet
```

---

## Architecture Changes Overview

### Remove (cyber.Fund/Stepan-specific)
| File | Action |
|------|--------|
| Context files referencing cyber.Fund | Delete / replace |
| `context/investment-philosophy.md` | Delete |
| `context/MEMO_template.md` | Replace with proposal template |
| `config/leverage-rules.yaml` | Replace with BD-specific scoring |
| `.claude/agents/memo-analyst.md` | Repurpose → proposal analyst |
| `.claude/agents/memo-writer.md` | Repurpose → proposal writer |
| `.claude/agents/synthesizer.md` | Keep, update output format |
| `AGENTS.md` references to cyber.Fund/Stepan | Replace with Serokell context |

### Repurpose (keep mechanics, swap context)
| File | What changes |
|------|-------------|
| `BD/shared/serokell-icp.md` | Update with precise ICP from research |
| `BD/shared/scoring-rubric.md` | Add Haskell/Nix-specific signals |
| `BD/workflows/find-leads.md` | Add GitHub signal scanning |
| `bd-lead-finder.md` agent | Add new search strategies |
| `bd-lead-qualifier.md` agent | Update scoring criteria |
| `cyber-memo.md` → `serokell-research.md` | BD company research, not investment memo |
| `cyber-brief.md` → `serokell-brief.md` | BD brief, not VC brief |
| `cyber-gtd.md` → `serokell-gtd.md` | BD task types |

### Create New
| File | Purpose |
|------|---------|
| `context/serokell-identity.md` | Company identity (replaces who-am-i.md) |
| `context/serokell-pitch.md` | Value props, differentiators, key messages |
| `context/serokell-services.md` | Service catalog with engagement templates |
| `config/bd-scoring-rules.yaml` | BD priority scoring (replaces leverage-rules.yaml) |
| `skills/BD/workflows/daily-scan.md` | GitHub/job board signal scanning |
| `skills/BD/workflows/email-draft.md` | Cold email generation |
| `skills/BD/workflows/pipeline.md` | Pipeline view and management |
| `skills/Proposal/` | Phase 2 skill tree |
| `.claude/agents/requirements-analyst.md` | Phase 2: parse client requests |
| `.claude/agents/solution-researcher.md` | Phase 2: research approaches |
| `.claude/agents/effort-estimator.md` | Phase 2: hour estimation |
| `.claude/agents/proposal-writer.md` | Phase 2: write the proposal |
| `commands/serokell-*.md` | All new command files |

---

## Day-by-Day Plan

### Day 1 — Identity Strip & Serokell Context

**Goal**: The system knows it is working for Serokell. No cyber.Fund references remain.

**Tasks**:

1. **Update `AGENTS.md`** (the master system prompt)
   - Replace all references to Stepan / cyber.Fund / VC / investment with Serokell context
   - Replace workflow mapping table with BD-appropriate mappings
   - Update agent roster descriptions to reflect BD purpose
   - Update logging references to use Serokell paths

2. **Create `context/serokell-identity.md`** (replaces `who-am-i.md`)
   ```markdown
   # Serokell BD Identity
   Company: Serokell OÜ (Estonia)
   Role: Business Development
   Operator: [your name]
   Focus: Outbound BD for Haskell/Nix/blockchain engineering services
   ICP: Engineering-led orgs needing elite functional programming
   Primary markets: UK, US, EU
   ```

3. **Create `context/serokell-company.md`** (replaces `what-is-cyber.md`)
   - Full Serokell overview: services, differentiators, client types, case studies
   - Key technical signals to watch for
   - Competitive positioning vs Well-Typed, Tweag, FP Complete, MLabs

4. **Create `context/serokell-pitch.md`**
   - Core value props (correctness, Haskell scarcity, blockchain track record, Nix infra)
   - Objection handling: "why not hire in-house?" "why Haskell?" "why Estonia?"
   - Key proof points: Cardano, Tezos, Runtime Verification, TON contest win
   - Reference projects by type (blockchain protocol, smart contract audit, performance optimization)

5. **Create `context/serokell-services.md`**
   - Service catalog: Custom Haskell Development, Haskell Team Augmentation,
     Smart Contract Development & Audit, Nix/NixOS Infrastructure, Formal Verification Consulting
   - Typical engagement: team size, duration, delivery model
   - What's out of scope (no mobile, no generic web, no AI/ML without Haskell angle)

6. **Update `.claude/hooks/load-context.ts`**
   - Replace `who-am-i.md` and `what-is-cyber.md` references with Serokell equivalents
   - Update deal auto-loading to look at `companies/` (BD pipeline) not `deals/` (investments)
   - Update session persistence path names

7. **Update `config/leverage-rules.yaml` → `config/bd-scoring-rules.yaml`**
   - Replace VC-oriented scoring (term sheets, fund automation, SF move) with BD-oriented scoring:
     - Hot signal (9pts): Haskell job posting, blockchain protocol launch, smart contract audit RFQ
     - High leverage (8pts): Company from ICP industry, decision maker reply, intro from network
     - Follow-up urgency (8pts): >72h since last touch, proposal request pending
     - Strategic (7pts): deploy-rs user, IOHK/Cardano ecosystem company, Tezos-adjacent

**Output**: System boots with Serokell context. No cyber.Fund references in any injected files.

---

### Day 2 — ICP, Agent Updates, BD Vault Structure

**Goal**: Agents know what a good Serokell lead looks like. Vault organized for BD.

**Tasks**:

1. **Update `BD/shared/serokell-icp.md`** (already exists, update with research)
   ```
   Technical signals (MUST have at least one):
   - Uses or evaluates Haskell
   - Building blockchain protocol / L1 / L2
   - Formal verification requirements
   - Using Nix/NixOS (especially deploy-rs users)
   - Smart contract development
   - Custom DSL or compiler work
   - High-correctness fintech (banking ledger, trading systems)

   Company profile:
   - 20-500 employees (too small = no budget, too large = in-house team)
   - Series A or later (need $100K+ engineering budget)
   - Engineering-led (CTO or VP Eng is decision maker, not business side)
   - Geography: US, UK, EU preferred (German speaking is bonus)
   - NOT a fit: AI/ML only, mobile, general web agencies, crypto exchanges without protocol work

   Exclusions (discard immediately):
   - Python/Go-only shops with no Haskell interest
   - Pre-seed startups without funding
   - B2C consumer products
   - Non-technical founders with no CTO
   ```

2. **Update `BD/shared/scoring-rubric.md`**
   - Add specific Haskell/Nix/blockchain signal scoring:
     - +20 pts: Active Haskell repo or hiring Haskell engineers
     - +15 pts: Blockchain protocol / smart contract platform
     - +15 pts: Uses deploy-rs or Nix in production
     - +10 pts: Had previous engagement with Serokell (warm)
     - +10 pts: Formal verification requirements mentioned
     - +10 pts: Budget signals ($5M+ Series A funding)
     - -20 pts: Pure Python/Go/Java shop
     - -20 pts: B2C consumer product
     - -15 pts: Pre-seed or unfunded

3. **Update `bd-lead-finder.md` agent**
   - Add GitHub search strategies specific to Serokell's niche:
     - Companies with Haskell repos and >5 engineers: `org:* language:Haskell stars:>10`
     - Companies using deploy-rs: Search GitHub for `deploy-rs` in config files
     - Job boards: search for "Haskell developer" on Wellfound, Greenhouse, Lever, Remotive
     - DeFi/blockchain: new L1s on CoinGecko, new Cosmos chains, new Substrate networks
     - Runtime Verification / Tezos / Cardano ecosystem companies
   - Add search for "smart contract audit" RFQs and security firms

4. **Update `bd-lead-qualifier.md` agent**
   - Use updated ICP and scoring rubric
   - Add: find CTO/VP Eng name and LinkedIn/GitHub profile for each qualified lead
   - Add: note any connection to Serokell network (IOHK ecosystem, Haskell community)

5. **Set up BD vault structure**
   ```
   ~/SerokellVault/
   ├── companies/               # One dir per prospect/client
   │   └── <company-slug>/
   │       ├── index.md         # Company overview + pipeline stage
   │       ├── research/        # Company research
   │       └── emails/          # Drafted outreach emails
   ├── pipeline/
   │   ├── leads/               # Raw leads from scanning
   │   ├── qualified/           # Scored leads
   │   ├── outreach/            # Active outreach
   │   ├── conversations/       # Active conversations
   │   └── won-lost/            # Closed deals
   ├── content/
   │   ├── emails/              # Email templates and drafts
   │   ├── briefs/              # Daily BD briefs
   │   └── work/                # Working files
   ├── context/
   │   ├── serokell-identity.md
   │   ├── serokell-company.md
   │   ├── serokell-pitch.md
   │   ├── serokell-services.md
   │   ├── entities/            # Contact cards
   │   ├── telegram/
   │   └── emails/
   ├── GTD.md
   └── .cybos/
       ├── db/
       └── logs/
   ```

6. **Update `scripts/paths.ts`**
   - Add `getPipelinePath()`, `getCompaniesPath()`, `getLeadsPath(stage)`
   - Rename vault to SerokellVault (or make configurable)

**Output**: Agents find and score leads correctly. Vault is organized for BD workflows.

---

### Day 3 — Signal Scanning & Daily BD Brief

**Goal**: Daily scan surfaces new Haskell/Nix/blockchain companies automatically.

**Tasks**:

1. **Create `skills/BD/workflows/daily-scan.md`** (new — the core BD intelligence loop)

   Phase 1: GitHub Signals
   - Search GitHub for new Haskell repos created in last 7 days with >3 stars
   - Search for `deploy-rs` mentions in new repos
   - Search for new job postings: "Haskell engineer" OR "functional programming" on GitHub Jobs
   - Find new organizations with Haskell as primary language

   Phase 2: Job Board Signals
   - Search Wellfound, RemoteOK, Greenhouse, Lever for:
     "Haskell" OR "Nix" OR "functional programming" OR "smart contract" (past 7 days)
   - Extract: company name, role level, team size signals, tech stack

   Phase 3: Blockchain Signals
   - New Cosmos chains launched (via Mintscan or GitHub cosmos-registry)
   - New Cardano/Tezos ecosystem projects
   - New DeFi protocol launches on EVM (potential smart contract audit need)
   - CoinList, Messari new project listings

   Phase 4: News Signals
   - Perplexity search: "Haskell blockchain" OR "formal verification software" OR
     "Nix deployment" news from last 7 days
   - Serokell competitor activity (Tweag, Well-Typed blog posts → their client signals)

   Output: Structured list of signals with company names → queue for qualification

2. **Create `commands/serokell-scan.md`** (`/serokell-scan`)
   - Runs daily-scan workflow
   - Filters by minimum signal strength
   - Adds new companies to `pipeline/leads/`
   - Produces scan report

3. **Create `commands/serokell-brief.md`** (`/serokell-brief`) — replaces cyber-brief
   - 6-step BD morning brief:
     1. New signals since last scan (from pipeline/leads/)
     2. Follow-ups due today (companies with last touch >72h)
     3. Active conversations (companies in outreach/conversations/)
     4. Today's calendar (discovery calls, demos scheduled)
     5. GTD BD tasks from GTD.md
     6. Score everything with bd-scoring-rules.yaml → surface top 5 actions
   - Output: `content/briefs/MMDD-YY.md`

4. **Update `scripts/db/extractors/`**
   - Add `extractors/companies.ts` — indexes `companies/*/index.md` (pipeline stage, last touch, score)
   - Update `extractors/entities.ts` — handle contact cards for BD (CTO name, LinkedIn, GitHub)

5. **Update `scripts/db/query.ts`**
   - Add: `pipeline-status` — show all companies by stage
   - Add: `follow-ups-due` — companies with last touch > N days
   - Add: `find-contact "Name"` — find decision maker info

**Output**: `/serokell-brief` gives you a scored daily action list. `/serokell-scan` finds new leads automatically.

---

### Day 4 — Company Research & Email Drafting

**Goal**: Deep company research with ICP scoring + high-quality cold email generation.

**Tasks**:

1. **Create `commands/serokell-research.md`** (`/serokell-research "Company"`)
   - Wrapper for research orchestrator with BD output format (not investment format)
   - Output: BD research memo with:
     - ICP fit score (0-100) and breakdown
     - Technical signals found (Haskell repos, Nix usage, blockchain work)
     - Decision makers (CTO name, LinkedIn, GitHub, Twitter)
     - Best Serokell services to pitch (specific to their tech stack and problem)
     - Recommended outreach angle
     - Red flags or disqualifiers
   - Save to `companies/<slug>/research/`

2. **Update research agents for BD context**
   - `company-researcher.md` — add BD output section: pipeline stage recommendation, decision maker info, key hooks for outreach
   - `tech-researcher.md` — add: "Serokell relevance: which services fit this company's tech?"
   - `bd-lead-qualifier.md` — integrate with research output to produce final score

3. **Create `skills/BD/workflows/email-draft.md`** (new — core sales tool)

   A Serokell cold email has specific constraints:
   - Audience is technical (CTO / VP Eng) — no buzzwords, no "AI-powered" fluff
   - Lead with a specific technical observation (not a generic pitch)
   - Reference Serokell's relevant work (Cardano, Tezos, Runtime Verification)
   - Short: 5-8 sentences max, no attachments in cold outreach
   - Call to action: 30-min call, not "schedule a demo"

   Workflow:
   1. Load company research (from `companies/<slug>/research/`)
   2. Load `context/serokell-pitch.md` (value props, proof points)
   3. Load `context/serokell-services.md` (relevant service for this company)
   4. Generate 2-3 email variants:
      - Variant A: Technical hook (reference their GitHub work)
      - Variant B: Problem hook (reference their job posting pain)
      - Variant C: Warm intro hook (if network connection found)
   5. Present all variants for approval
   6. Save approved email to `companies/<slug>/emails/draft-cold-MMDD.md`

4. **Create `commands/serokell-email.md`** (`/serokell-email "Company"`)
   - Runs email-draft workflow
   - Options: `--followup` for follow-up emails, `--proposal` for proposal cover

5. **Update `skills/Content/workflows/` (writing style)**
   - Create `writing-style-bd.md` — Serokell BD tone:
     - Technical precision (no vague claims)
     - Direct, no-fluff: no "synergy", no "leverage", no "AI-powered"
     - Evidence-based: cite specific Serokell work (repos, papers, clients)
     - Peer-to-peer tone: CTO to CTO, not vendor to buyer
     - Short sentences, no corporate speak

**Output**: `/serokell-research "Company"` → ICP score + decision makers + angle.
`/serokell-email "Company"` → 3 ready-to-use cold email drafts.

---

### Day 5 — Pipeline Management & GTD Integration

**Goal**: Full pipeline visibility and BD task execution from GTD.md.

**Tasks**:

1. **Create `commands/serokell-pipeline.md`** (`/serokell-pipeline`)
   - Shows kanban-style pipeline summary:
     ```
     LEADS (12)          QUALIFIED (5)       OUTREACH (3)        CONVERSATIONS (2)
     ─────────────────   ─────────────────   ─────────────────   ─────────────────
     - Acme Corp [85]    - Beta Inc [72]     - Gamma Ltd         - Delta Co (call Thu)
     - ...               - ...               - Epsilon            - Zeta (proposal pending)
     ```
   - Options: `--stage qualified` to filter, `--company "Acme"` for detail

2. **Create `commands/serokell-pipeline-update.md`** (`/serokell-pipeline-update "Company" --stage`)
   - Move company between pipeline stages
   - Log the stage change with date and notes
   - Trigger follow-up task if needed

3. **Update `skills/GTD/SKILL.md`** for BD task types
   - BD task patterns to recognize:
     - `Research [Company] for BD` → `/serokell-research`
     - `Draft email to [Name] at [Company]` → `/serokell-email`
     - `Follow up with [Company]` → load email history + draft follow-up
     - `Prep for call with [Company]` → company research + talking points
     - `Qualify [Company]` → run lead qualifier agent
     - `Scan for new Haskell leads` → `/serokell-scan`
   - Route each type to the correct workflow

4. **Update `GTD/workflows/call-prep.md`** for BD calls
   - BD discovery call prep: company background, their tech stack, pain point hypotheses,
     Serokell services to pitch, specific questions to ask, Serokell proof points to mention

5. **Update `GTD/workflows/outreach.md`** for BD outreach
   - Draft personalized email based on research
   - Find contact info (email via Hunter.io or manual research)
   - Schedule follow-up task in GTD.md

6. **Hunter.io integration** (new tool for email finding)
   - Add `HUNTER_API_KEY` to `.env.example` and config
   - Create `scripts/hunter.ts` — finds professional emails by name + domain
   - Integrate into email-draft workflow: auto-populate To: field

7. **Implement pipeline stage tracking in SQLite**
   - Add `pipeline_companies` table: slug, name, stage, score, last_touch, decision_maker, notes
   - Update `db/index.ts` to populate from `companies/*/index.md`
   - Add `db/query.ts` commands: `pipeline-status`, `follow-ups-due`

**Output**: Full pipeline visibility. BD tasks in GTD.md execute correctly.

---

### Day 6 — Phase 2 Design: Commercial Proposal Engine

**Goal**: Architecture and scaffold for proposal generation (no full implementation yet).

**Background**: When a prospect shares a project request (document, email thread, conversation
notes), the system should:
1. Parse and structure the requirements
2. Research existing approaches (GitHub, papers, open-source solutions)
3. Design a technical solution (architecture, team composition, technology choices)
4. Estimate effort (hours per role, duration, risk buffer)
5. Generate a polished proposal document

**Tasks**:

1. **Design `skills/Proposal/SKILL.md`** — skill overview and principles:
   - Serokell proposals are technical documents, not sales decks
   - Lead with architecture and approach, not cost
   - Estimation methodology: analogy-based (similar past projects) + function point decomposition
   - Risk categories: requirements clarity, third-party dependencies, talent availability,
     novel algorithm development
   - Output format: proposal.md (client-facing) + estimate.md (internal)

2. **Design `skills/Proposal/workflows/generate.md`** — 6-phase workflow:

   **Phase 1: INGEST**
   - Load client request (file, email, or free-text description)
   - Extract: problem statement, constraints, deliverables, timeline ask, budget signals

   **Phase 2: RESEARCH** (parallel agents)
   - `requirements-analyst.md` → parses request, identifies ambiguities, categorizes work types
   - `solution-researcher.md` → finds similar GitHub projects, papers, Serokell past work
   - `market-researcher.md` → competitive tools/solutions client could use instead

   **Phase 3: DESIGN**
   - Technical architecture recommendation (Haskell vs Rust vs mixed, which frameworks)
   - Team composition (# senior Haskell devs, # Nix devs, QA, PM)
   - Dependencies and risks

   **Phase 4: ESTIMATE**
   - `effort-estimator.md` → decomposes into tasks, estimates hours per role
   - Apply Serokell-specific multipliers: Haskell code density, testing requirements,
     documentation level, client collaboration overhead
   - Generate: optimistic / realistic / pessimistic scenario

   **Phase 5: WRITE**
   - `proposal-writer.md` → fills proposal template
   - Sections: Executive Summary, Understanding of Requirements, Proposed Approach,
     Team & Credentials, Timeline, Investment (cost), Why Serokell, Next Steps

   **Phase 6: OUTPUT**
   - Save `companies/<slug>/proposals/proposal-MMDD.md`
   - Save `companies/<slug>/proposals/estimate-internal-MMDD.md` (not shared with client)

3. **Design new agents** (stubs — full prompts on Day 7+):
   - `requirements-analyst.md` — extracts functional/non-functional requirements,
     flags ambiguities, categorizes: new development / integration / audit / optimization
   - `solution-researcher.md` — searches GitHub for similar open-source projects,
     searches arXiv/Semantic Scholar for relevant papers, checks Serokell's past work
   - `effort-estimator.md` — breaks work into function points, applies hour estimates
     per point based on complexity, generates 3-scenario estimate
   - `proposal-writer.md` — writes polished proposal following Serokell voice

4. **Create proposal template** `context/PROPOSAL_template.md`:
   ```markdown
   # [Client Company]: [Project Title]
   ## Proposed by Serokell | [Date]

   ### Executive Summary
   ### Our Understanding of the Problem
   ### Proposed Technical Approach
   ### Team Composition
   ### Delivery Plan & Timeline
   ### Investment
   ### Why Serokell
   ### Next Steps
   ```

5. **Create `commands/serokell-proposal.md`** (stub — active in Phase 2):
   - Entry point for proposal generation
   - Args: company slug, request file path or description
   - Options: `--quick` (skip research, draft from description only)

**Output**: Full Phase 2 design documented and ready to implement.

---

### Day 7 — Integration, Testing & Cleanup

**Goal**: Everything works end-to-end. No dead references. System is clean.

**Tasks**:

1. **Full reference audit**
   - `grep -r "cyber.Fund\|Stepan\|investment philosophy\|VC fund\|term sheet" .claude/`
   - Remove or replace every hit
   - Verify AGENTS.md, all commands, all skills, all agents are Serokell-clean

2. **End-to-end test: BD workflow**
   - Run `/serokell-scan` → verify it finds leads
   - Pick a test company → run `/serokell-research "TestCo"` → verify ICP score output
   - Run `/serokell-email "TestCo"` → verify email drafts look right
   - Run `/serokell-brief` → verify brief is populated

3. **End-to-end test: GTD workflow**
   - Add a test task to GTD.md: `Research Haskell company XYZ for BD`
   - Run `/serokell-gtd` → verify it routes to research workflow

4. **Update README.md** — full rewrite for Serokell BD context:
   - What the system does
   - Setup instructions (updated for SerokellVault)
   - Command reference
   - Phase 2 roadmap note

5. **Update docs/SETUP.md** — adjust all vault paths, config keys

6. **Update docs/ARCHITECTURE.md** — document all new components

7. **Update `.mcp.json`** — remove any Gmail MCP hardcoded path issue
   - Make gmail MCP path configurable via env var

8. **Write `docs/SEROKELL-RUNBOOK.md`** — daily BD playbook:
   - Morning: run `/serokell-brief`
   - Weekly: run `/serokell-scan`
   - On new inbound lead: run `/serokell-research`, then `/serokell-email`
   - On discovery call: run `/serokell-gtd` with call-prep task
   - On proposal request: run `/serokell-proposal` (Phase 2)

---

## Files Change Summary

### Modified (18 files)
```
AGENTS.md                                   # Strip cyber.Fund, add Serokell context
.claude/hooks/load-context.ts               # Update injected context files
.claude/hooks/session-end.ts                # Update vault paths
.claude/agents/bd-lead-finder.md            # Add Haskell/Nix-specific search
.claude/agents/bd-lead-qualifier.md         # Update scoring criteria
.claude/agents/company-researcher.md        # Add BD output section
.claude/agents/tech-researcher.md           # Add Serokell relevance section
.claude/agents/synthesizer.md               # Update output format for BD
.claude/agents/memo-analyst.md              # Repurpose as proposal analyst
.claude/agents/memo-writer.md               # Repurpose as proposal writer
BD/shared/serokell-icp.md                   # Update with precise ICP
BD/shared/scoring-rubric.md                 # Add Haskell/Nix signals
BD/workflows/find-leads.md                  # Add GitHub signal scanning
GTD/SKILL.md                                # BD task patterns
GTD/workflows/call-prep.md                  # BD discovery call prep
GTD/workflows/outreach.md                   # BD email outreach
scripts/paths.ts                            # Add pipeline paths
scripts/db/query.ts                         # Add pipeline queries
```

### Created (24 files)
```
context/serokell-identity.md                # Replaces who-am-i.md
context/serokell-company.md                 # Replaces what-is-cyber.md
context/serokell-pitch.md                   # Value props and proof points
context/serokell-services.md                # Service catalog
context/PROPOSAL_template.md               # Proposal document template
config/bd-scoring-rules.yaml               # Replaces leverage-rules.yaml
commands/serokell-scan.md                   # /serokell-scan
commands/serokell-brief.md                  # /serokell-brief
commands/serokell-research.md               # /serokell-research
commands/serokell-email.md                  # /serokell-email
commands/serokell-pipeline.md               # /serokell-pipeline
commands/serokell-pipeline-update.md        # /serokell-pipeline-update
commands/serokell-proposal.md               # /serokell-proposal (Phase 2 stub)
skills/BD/workflows/daily-scan.md           # GitHub/job board scanning
skills/BD/workflows/email-draft.md          # Cold email generation
skills/BD/workflows/pipeline.md             # Pipeline view
skills/Content/writing-style-bd.md          # BD writing tone
skills/Proposal/SKILL.md                    # Phase 2 proposal skill
skills/Proposal/workflows/generate.md       # Phase 2 proposal workflow
agents/requirements-analyst.md              # Phase 2: parse requirements
agents/solution-researcher.md               # Phase 2: research approaches
agents/effort-estimator.md                  # Phase 2: hour estimation
agents/proposal-writer.md                   # Phase 2: write proposal
scripts/hunter.ts                           # Hunter.io email finder
```

### Archived (6 files — moved to `archive/cyber-fund/`)
```
context/investment-philosophy.md
context/MEMO_template.md
commands/cyber-memo.md                      # Investment memo
commands/cyber-browse.md                    # VC-oriented Twitter scanning
config/leverage-rules.yaml
docs/SEROKELL-ADAPTATION-PLAN.md            # This file (move to archive when done)
```

### Kept Unchanged (major reuse)
```
Research/workflows/orchestrator.md          # Generic enough, keep
Research/shared/                            # All shared research utilities, keep
Telegram/workflows/                         # Keep, useful for BD Telegram
Content/workflows/tweet.md                  # Keep for Serokell content
Content/workflows/essay.md                  # Keep
scripts/telegram-gramjs.ts                  # Keep
scripts/db/                                 # Keep all DB scripts
scripts/extract-granola.ts                  # Keep for call transcripts
scripts/health-check.ts                     # Keep
scripts/brief-server.ts                     # Keep for web brief UI
.claude/settings.json                       # Keep
```

---

## Implementation Notes

### Vault Config
Update `~/.cybos/config.json`:
```json
{
  "vault_path": "~/SerokellVault",
  "user": {
    "name": "[your name]",
    "owner_name": "[your name]",
    "slug": "[your-slug]",
    "aliases": ["serokell"]
  },
  "company": "Serokell",
  "setup_completed": true
}
```

### Key APIs Needed
| API | Purpose | Priority |
|-----|---------|----------|
| EXA_API_KEY | Primary research | Required |
| PERPLEXITY_API_KEY | Fast research | Required |
| HUNTER_API_KEY | Email finding for cold outreach | High |
| TELEGRAM_API_ID/HASH | Telegram BD communication | High |
| GOOGLE_OAUTH | Gmail for managing leads | Medium |
| GEMINI_API_KEY | Image generation (Serokell blog content) | Low |
| TYPEFULLY_API_KEY | Social media scheduling | Low |
| NOTION_TOKEN | Optional pipeline backup | Optional |

### GitHub Search Queries for daily-scan
Pre-built queries to embed in `daily-scan.md`:
```
# New Haskell repos
https://github.com/search?q=language:Haskell+created:>DATE&type=repositories

# Companies hiring Haskell
https://github.com/search?q=haskell+engineer+OR+developer+in:readme+created:>DATE&type=repositories

# deploy-rs users (warm leads)
https://github.com/search?q=deploy-rs+in:file&type=code

# New blockchain protocols
https://github.com/search?q=blockchain+protocol+language:Haskell+OR+language:Rust&type=repositories
```

---

## Phase 2 Detailed Notes (for implementation after Phase 1)

### Effort Estimation Approach

The `effort-estimator.md` agent will use **analogy-based estimation** (most reliable for
boutique consultancies):

```
For each component of the request:
1. Find the closest Serokell past project or open-source equivalent
2. Estimate relative complexity: 0.5x / 1x / 2x / 3x of the reference
3. Apply base hours for reference
4. Sum components, add integration complexity (15-25% of total)
5. Add testing (20-30%), documentation (10-15%), project management (10-15%)
6. Produce 3 scenarios: optimistic (-20%), realistic, pessimistic (+40%)
```

Reference library to build in `context/serokell-past-projects.md`:
- Haskell library: ~2-4 weeks for medium library
- Smart contract implementation: ~4-8 weeks per contract
- Smart contract audit: ~1-3 weeks per contract depending on complexity
- Blockchain node component: ~2-6 months
- Nix infra setup: ~2-4 weeks
- Performance optimization engagement: ~4-8 weeks

### Requirements Parsing Approach

The `requirements-analyst.md` agent will classify each requirement into:
- **Functional**: concrete feature or behavior
- **Non-functional**: performance, reliability, correctness, compliance
- **Constraint**: technology mandate, timeline, existing codebase
- **Ambiguity**: unclear or conflicting — outputs as question list for client

### Proposal Voice

Serokell proposals must sound like they were written by a senior engineer, not a salesperson:
- Start with the problem, not the company
- Show that we understand their specific technical situation
- Propose a concrete architecture, not vague "we'll figure it out"
- Reference specific tools, libraries, approaches
- Be honest about uncertainty: "this depends on X, which we'd clarify in discovery"

---

## Success Metrics

### Phase 1 Success Criteria
- [ ] System boots with zero cyber.Fund references
- [ ] `/serokell-scan` finds 5+ new qualified leads per week
- [ ] `/serokell-research "Company"` produces ICP score + decision maker in <5 minutes
- [ ] `/serokell-email "Company"` produces 3 usable cold email variants
- [ ] `/serokell-brief` runs in <30 seconds, surfaces ≤5 prioritized actions
- [ ] `/serokell-pipeline` shows accurate pipeline state from SQLite
- [ ] GTD.md BD tasks route to correct workflows

### Phase 2 Success Criteria
- [ ] `/serokell-proposal "Company"` produces a complete proposal draft from a client request
- [ ] Effort estimate has three scenarios with itemized breakdown
- [ ] Proposal document is client-ready after one human review pass
- [ ] Research covers: GitHub similar projects + arXiv relevant papers + Serokell past work

---

*Plan generated: 2026-02-28*
*Based on: Serokell GitHub analysis (258 repos), Clutch.co reviews (32, all 5-star),*
*GoodFirms reviews, Cybos v2.1 architecture analysis*
