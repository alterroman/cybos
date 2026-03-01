# SerokellSalesAgent → Serokell BD OS: Adaptation Plan (v2)

> Updated 2026-02-28. Corrects v1 by: accurately mapping reusable components,
> adding funding/market/academic scoring dimensions, and recentering ICP on
> Rust + Solana + Blockchain as primary competence.

---

## What Already Exists (Do Not Rebuild)

Before listing new work, this is what SerokellSalesAgent already has that is **production-quality and
directly relevant to the BD use case**:

### BD Infrastructure — Already Rust/Serokell-Focused
| File | What it does | Status |
|------|-------------|--------|
| `.claude/agents/bd-lead-finder.md` | Finds Rust companies on GitHub, job boards, web | ✅ Use as-is, minor ICP update |
| `.claude/agents/bd-lead-qualifier.md` | Scores companies 0-100 against ICP, finds decision makers | ✅ Use as-is, add new dimensions |
| `.claude/skills/BD/shared/serokell-icp.md` | ICP definition (already Rust-first) | 🔧 Update: add Solana, blockchain depth |
| `.claude/skills/BD/shared/scoring-rubric.md` | 6-dimension 100-pt rubric | 🔧 Update: add funding timing, market presence, academic |
| `.claude/skills/BD/workflows/find-leads.md` | Full orchestration: find → score → Google Sheets | ✅ Use as-is |
| `.claude/commands/serokell-bd-find-leads.md` | `/serokell-bd-find-leads` command | ✅ Use as-is |
| `.claude/commands/serokell-bd-research-lead.md` | `/serokell-bd-research-lead` command with 3-agent research | 🔧 Add academic paper agent |

### Research Infrastructure — Fully Reusable for BD
| Agent | What it does | BD reuse |
|-------|-------------|----------|
| `company-researcher` | Business model, product, team, traction | Direct reuse — BD company research |
| `financial-researcher` | **Funding rounds, investors, burn rate, runway** | Direct reuse — lead scoring input |
| `market-researcher` | TAM, competitive landscape, market position | Direct reuse — market presence scoring |
| `team-researcher` | Founder backgrounds, LinkedIn, GitHub | Direct reuse — decision maker finding |
| `tech-researcher` | Technical deep-dives on stack and architecture | Direct reuse — Rust depth assessment |
| `content-researcher` | Academic papers, social media, first-principles | 🔧 Add to bd-research-lead for papers |
| `synthesizer` | Consolidates parallel agent outputs | Direct reuse — BD synthesis |
| `quality-reviewer` | Gap analysis on research | Direct reuse |

**Key insight**: The research orchestrator (`Research/workflows/orchestrator.md`) with
3-tier intensity (Quick/Standard/Deep) and parallel agent execution is already exactly
what the BD research workflow needs. **Do not rebuild it.**

### Other Reusable Infrastructure
| Component | Reuse |
|-----------|-------|
| `serokell-brief.md` | Morning brief (Telegram + email + calendar + GTD) — adapt for BD |
| `GTD/SKILL.md` with `call-prep.md`, `outreach.md` | BD task routing — extend |
| `Telegram/workflows/` | Telegram processing — direct reuse |
| `DDMemo/SKILL.md` + `generate.md` | **Adapt as BD Memo** — Opus analysis + template writing mechanics are perfect |
| `config/leverage-rules.yaml` | Update rules for BD priorities |
| `scripts/db/` + SQLite indexing | Extend for pipeline stage tracking |
| `scripts/telegram-gramjs.ts` | Direct reuse |
| `scripts/health-check.ts` | Direct reuse |

---

## ICP Correction: Rust + Solana + Blockchain Primary

The existing ICP (`serokell-icp.md`) is already Rust-first — this is correct.
The v1 plan over-emphasized Haskell (Serokell's *historical* strength).
Current primary competence is Rust.

### Updated ICP Signal Hierarchy

**Tier 1 — Strongest signals (prioritize immediately)**:
- Company uses Rust as primary language (GitHub shows >50% Rust)
- Solana ecosystem: protocol, DApp, validator, tooling, or infrastructure company
- Building a Rust-based blockchain node, L1, or L2
- Hiring senior Rust engineers (job postings = capacity need)
- Substrate/Polkadot ecosystem (Rust-based)
- NEAR Protocol ecosystem (Rust-based)

**Tier 2 — Strong signals (qualify and research)**:
- Significant Rust codebase alongside other languages
- Blockchain/DeFi protocol needing systems-level engineering
- Smart contract platform with Rust (Solana, NEAR, Cosmos SDK)
- High-performance fintech (trading, risk, ledger) looking for Rust capacity
- Systems infrastructure companies (DB, networking, runtime, storage)
- Developer tooling in Rust (compilers, CLIs, build systems)

**Tier 3 — Weaker but relevant**:
- Haskell users (Serokell has historical depth, but fewer engagements now)
- C++/Go shops evaluating Rust migration
- Formal verification requirements
- Embedded/IoT Rust
- AI/ML infrastructure in Rust

**Disqualifiers (remove from pipeline)**:
- Pure Python/JS shops with no systems component
- Mobile-only or frontend-only
- Pre-seed without funding (can't afford engagement)
- APAC/LATAM (timezone + legal friction)
- B2C consumer products

---

## New Scoring Dimensions (3 additions)

The existing 6-dimension rubric (Geography 15 + Size 15 + Funding 15 + Rust 25 + Domain 15 + Outsource 15 = 100) needs 3 new signals that the user explicitly requested.

Since adding points would break the 100-point scale, these become **sub-dimensions** within existing categories or **bonus flags** that influence the tier placement:

### Addition 1: Funding Round Timing (within Funding dimension)

Add to `funding-stage` scoring:
```
Funding stage with timing modifier:
- Series A/B raised in last 6 months: 15 (base) + timing flag "🟢 Fresh capital"
- Series A/B raised 6-18 months ago: 15
- Series A/B raised >18 months ago: 11 (may be extending runway)
- Seed $3M+ raised in last 3 months: 13 + timing flag "🟢 Fresh capital"
- Seed $3M+ raised 3-12 months ago: 11
```

Timing flag matters because: fresh raise = active hiring/expansion phase = most likely
to engage contractors. `financial-researcher` already pulls this; just needs to be
explicitly requested.

### Addition 2: Market Presence Score (new sub-dimension of Domain Fit)

Measures how established the company is in their niche — helps predict deal size and
strategic importance:

```
Market presence (0-5 bonus pts added to Domain score, max domain still 15):
- GitHub org with >500 stars on primary repos: +3
- Listed on DeFiLlama / CoinGecko / known blockchain directory: +2 (blockchain)
- Active developer community (Discord, Telegram, Forum): +2
- Conference talks or keynotes in their domain: +2
- Published technical blog with >5 technical posts: +1
```

`market-researcher` already finds most of these signals — just needs the output format
to include a market presence summary.

### Addition 3: Academic Publications (new bonus signal)

Signals correctness culture and deep technical requirements — Serokell's sweet spot:

```
Academic/research signals (bonus flag, not points — but elevates tier):
- Company published peer-reviewed papers on their tech: "🎓 Research"
- CTO/founders have academic publications: "🎓 Academic founders"
- Uses formal verification or model checking: "🎓 Formal methods"
- References academic work in their blog/docs: "🎓 Research-adjacent"
```

`content-researcher` can find these via Semantic Scholar, arXiv, and Google Scholar.
Add it to the `bd-research-lead` research chain at **standard** intensity (not just deep).

---

## What Actually Needs to Be Built

Now that existing infrastructure is mapped accurately, here is the **real work list** —
much smaller than v1 suggested.

### Category A: Configuration & Context (Day 1) — High impact, fast

These files don't exist yet and are needed for the system to know it works for Serokell:

1. **`context/serokell-identity.md`** (new — replaces `who-am-i.md`)
   - Who the operator is, their role, focus areas
   - Active BD priorities and current pipeline status
   - Communication style preferences

2. **`context/serokell-company.md`** (new — replaces `what-is-cyber.md`)
   - What Serokell does, core services, differentiators
   - Confirmed clients (Cardano/IOHK, Tezos/TQ, Runtime Verification)
   - Deploy-rs as OSS flagship, Haskell + Rust + Nix as stack
   - Key proof points for cold outreach

3. **`context/serokell-pitch.md`** (new)
   - 3-5 value props with evidence (correctness culture, Rust scarcity, blockchain track record)
   - Objection handling: "why not hire in-house?", "why Rust consultancy vs full-time?"
   - Reference projects by type (blockchain node, smart contract infra, Nix deploy)

4. **`context/serokell-services.md`** (new)
   - Service catalog: Rust Development, Haskell Development, Nix/NixOS Infrastructure,
     Smart Contract Development, Blockchain Protocol Engineering
   - Typical engagement: team size (2-4), duration (3-6 months), $80K-$200K
   - Out-of-scope: mobile, general web, pure frontend, AI/ML without Rust angle

5. **`config/leverage-rules.yaml`** (update existing)
   - Replace VC-oriented scoring (term sheets, SF moves, fund automation) with BD priorities:
     - Hot signal (9): Haskell/Rust job posting, Solana ecosystem company, proposal request inbound
     - Decision maker engaged (9): CTO or VP Eng replied to outreach
     - Follow-up urgency (8): >72h since last touch, prospect is in active conversations stage
     - Fresh capital (8): Raised in last 6 months, expansion mode
     - Warm intro available (8): Network connection identified
     - Strategic account (7): Previous client re-engage opportunity

### Category B: ICP and Scoring Updates (Day 2) — Fixes existing files

6. **`BD/shared/serokell-icp.md`** (update)
   - Add Solana ecosystem explicitly to Tier 1
   - Add Substrate/NEAR/Cosmos SDK as Tier 1 blockchain signals
   - Add Haskell to Tier 3 (not primary, but still relevant)
   - Keep Rust as primary signal throughout

7. **`BD/shared/scoring-rubric.md`** (update — add 3 new dimensions from above)
   - Add funding round timing flag to Funding dimension
   - Add market presence sub-score to Domain Fit
   - Add academic publications bonus flag
   - Update score interpretation thresholds

8. **`.claude/agents/bd-lead-qualifier.md`** (update)
   - Add market presence signals to research checklist
   - Add academic publication search step
   - Add funding timing flag to funding research
   - Update output format to include these new signals

### Category C: Research Flow Enhancement (Day 3)

9. **`serokell-bd-research-lead.md`** (update — add content-researcher to the agent mix)
   The existing command spawns 3 agents. Add a 4th:

   **Agent 4 — content-researcher** (academic papers):
   - Search arXiv for papers authored by company researchers
   - Search Semantic Scholar for company + technology combinations
   - Search Google Scholar for CTO/founder publications
   - Search conference proceedings (SOSP, OSDI, EuroSys, CCS, etc.)
   - Output: list of publications, research areas, key contributions

   This integrates the academic signal into standard BD research (not just deep mode).

10. **`BD/shared/serokell-icp.md`** + agent prompts (update financial-researcher guidance)
    - Ensure `financial-researcher` always checks: days since last raise, investor names
      (tier 1 VCs signal budget confidence), total raised to date
    - Add explicit output section: "Funding Timing Assessment" with a fresh/aging flag

### Category D: New Workflows (Days 4-5) — Core new capabilities

These genuinely don't exist yet and need to be built:

11. **`BD/workflows/email-draft.md`** (new skill workflow)

    Serokell cold email constraints:
    - Audience is technical (CTO, VP Eng) — no buzzwords, no "AI-powered" fluff
    - Lead with a specific technical observation (their GitHub repo, their job posting, their blog post)
    - Reference Serokell's relevant work (Cardano, deploy-rs, IOHK, TQ Tezos)
    - Length: 5-8 sentences, no attachments in cold outreach
    - CTA: "30-min call", not "schedule a demo"
    - Tone: peer-to-peer engineer, not vendor

    Workflow:
    1. Load `companies/<slug>/research/report.md` (from bd-research-lead output)
    2. Load `context/serokell-pitch.md` and `context/serokell-services.md`
    3. Generate 3 variants:
       - **Technical hook**: references their specific GitHub repo or tech decision
       - **Problem hook**: references their job posting or stated engineering challenge
       - **Warm hook**: references mutual connection or conference appearance (if found)
    4. Present variants, save approved to `companies/<slug>/emails/cold-MMDD.md`

12. **`commands/serokell-email.md`** (new command — `/serokell-email "Company"`)
    - Runs email-draft workflow
    - Flags: `--followup` (generate follow-up email), `--proposal` (proposal cover email)

13. **`BD/workflows/daily-scan.md`** (new skill workflow — weekly signal scanning)

    4-channel signal scan:
    1. **GitHub**: New Rust repos >10 stars created in last 7 days; new orgs with Rust
       primary language; `deploy-rs` in new config files; Solana ecosystem new repos
    2. **Job boards**: "Rust engineer" OR "Rust developer" new postings on Wellfound,
       Ashby, Greenhouse, Lever, RemoteOK (last 7 days)
    3. **Blockchain**: New Solana ecosystem projects (via Solana developer hub, DeFiLlama
       new protocols); new Substrate chains; new Cosmos SDK chains
    4. **News**: Perplexity search for "Rust" + "blockchain" OR "fintech" OR "systems"
       news last 7 days; competitor activity (Tweag, Well-Typed blog posts)

    Output: structured list of signals → queue for qualification → add to `pipeline/leads/`

14. **`commands/serokell-scan.md`** (new — `/serokell-scan`)
    - Runs daily-scan workflow
    - Filters by minimum signal strength
    - Produces scan report and adds companies to lead queue

15. **`BD/workflows/pipeline.md`** (new — pipeline view and management)
    - Kanban view of all companies by stage: leads → qualified → outreach → conversations → won/lost
    - Stage transitions with timestamps
    - Follow-up due tracking (last touch + days elapsed)
    - Score display alongside each company

16. **`commands/serokell-pipeline.md`** (new — `/serokell-pipeline`)
    - Shows pipeline kanban
    - Options: `--stage qualified`, `--company "Acme"` for detail

### Category E: Identity Strip in AGENTS.md (Day 1, alongside context)

17. **`AGENTS.md`** (update — strip Serokell/Roman references)
    - Replace all "Serokell" with "Serokell"
    - Replace all "Roman" with operator identity
    - Replace "investment decisions" with "BD pipeline"
    - Replace "deals/" vault path with "companies/" or "leads/"
    - Update the skill/command mapping table
    - Update context injection to load serokell-identity.md and serokell-company.md

18. **`.claude/hooks/load-context.ts`** (update — if it references who-am-i.md / what-is-cyber.md)
    - Point to new serokell-identity.md and serokell-company.md

### Category F: Phase 2 — Commercial Proposal Engine (Weeks 2-3)

The DDMemo skill (`DDMemo/SKILL.md` → `generate.md`) is the perfect mechanical template
for this — Opus analysis agent + structured template writer agent. **Adapt it, don't rebuild.**

19. **`skills/BD/BDMemo/SKILL.md`** (adapt from DDMemo)
    - Replace investment rubric scoring with BD fit scoring
    - Replace IC recommendation with proposal recommendation
    - Keep the Opus analysis + Sonnet template writer pattern

20. **`skills/Proposal/SKILL.md`** (new — full proposal generation)

    6-phase workflow:
    1. **INGEST**: Parse client request (doc, email, free text) → extract requirements
    2. **RESEARCH** (parallel):
       - `tech-researcher`: technical requirements, architecture options
       - `content-researcher`: similar GitHub projects, arXiv papers on approaches
       - `company-researcher`: client company context (existing relationship info)
    3. **DESIGN**: Architecture recommendation, team composition, dependencies
    4. **ESTIMATE**: Analogy-based estimation using reference project library
    5. **WRITE**: `proposal-writer` agent fills template (Sonnet)
    6. **OUTPUT**: `proposal.md` (client-facing) + `estimate-internal.md`

21. **New agents for Phase 2**:
    - `requirements-analyst.md`: Parses client request → functional/non-functional/constraints/ambiguities
    - `effort-estimator.md`: Breaks work into components, applies hour estimates,
      generates 3 scenarios (optimistic -20%, realistic, pessimistic +40%)
    - `proposal-writer.md`: Fills proposal template with Serokell voice (technical, direct)

22. **`context/PROPOSAL_template.md`** (new):
    ```
    # [Client]: [Project Title]
    ## Executive Summary
    ## Our Understanding of the Problem
    ## Proposed Technical Approach
    ## Team Composition
    ## Delivery Plan & Timeline
    ## Investment
    ## Why Serokell
    ## Next Steps
    ```

23. **`context/serokell-reference-projects.md`** (new — for effort estimation):
    Reference library for analogy-based estimation:
    - Rust library (medium complexity): 4-6 weeks, 1-2 engineers
    - Blockchain node component: 2-4 months, 2-3 engineers
    - Smart contract implementation: 2-4 weeks per contract
    - Nix infrastructure setup: 2-3 weeks, 1 engineer
    - Performance optimization engagement: 4-8 weeks, 2 engineers
    - Protocol client (full): 3-6 months, 3-4 engineers

---

## What Is NOT Changing (Keep As-Is)

These are working and don't need changes:

- `Research/SKILL.md` and `Research/workflows/orchestrator.md` — fully reusable
- `Research/shared/agent-selection-matrix.md` — reusable, just add BD research type
- `Research/shared/intensity-tiers.md` — direct reuse
- `Research/shared/mcp-strategy.md` — direct reuse
- `Content/SKILL.md` and all content workflows — reuse for Serokell blog content
- `Telegram/SKILL.md` and workflows — direct reuse for BD Telegram
- `Summarize/SKILL.md` — reuse for call transcripts
- `GTD/SKILL.md` base — extend for BD tasks, don't replace
- `GTD/workflows/call-prep.md` — add BD call prep variant
- `GTD/workflows/outreach.md` — extend for BD email outreach
- `scripts/telegram-gramjs.ts`, `health-check.ts`, `extract-granola.ts` — direct reuse
- `scripts/db/` (SQLite indexing) — extend for pipeline, don't replace
- All `remotion-best-practices/`, `design-taste-frontend/`, `excalidraw-diagram/` — keep untouched

---

## Revised File Change Summary

### New files (12 — down from v1's 24)
```
context/serokell-identity.md
context/serokell-company.md
context/serokell-pitch.md
context/serokell-services.md
context/PROPOSAL_template.md
context/serokell-reference-projects.md
skills/BD/workflows/email-draft.md
skills/BD/workflows/daily-scan.md
skills/BD/workflows/pipeline.md
commands/serokell-email.md
commands/serokell-scan.md
commands/serokell-pipeline.md
```

### Updated files (12 — down from v1's 18, more accurate)
```
AGENTS.md                                # Strip Serokell/Roman, add Serokell
.claude/hooks/load-context.ts            # Update context file references
config/leverage-rules.yaml              # BD-tuned scoring rules
.claude/skills/BD/shared/serokell-icp.md       # Add Solana, Substrate, NEAR; Haskell to Tier 3
.claude/skills/BD/shared/scoring-rubric.md     # Add funding timing, market presence, academic
.claude/agents/bd-lead-qualifier.md            # Add 3 new signal dimensions
.claude/commands/serokell-bd-research-lead.md     # Add content-researcher (academic papers)
.claude/agents/financial-researcher.md         # Add funding timing output section
.claude/agents/market-researcher.md            # Add market presence output section
.claude/skills/Research/shared/agent-selection-matrix.md  # Add BD research type
.claude/skills/GTD/SKILL.md                    # Add BD task patterns
.claude/skills/GTD/workflows/outreach.md       # Extend for BD email outreach
```

### Phase 2 only (new — don't build in Phase 1)
```
skills/BD/BDMemo/SKILL.md               # Adapted from DDMemo
skills/Proposal/SKILL.md
skills/Proposal/workflows/generate.md
agents/requirements-analyst.md
agents/effort-estimator.md
agents/proposal-writer.md
commands/serokell-proposal.md
```

### Archived (5 — reduced from v1's 6)
```
context/investment-philosophy.md        # → archive/cyber-fund/
context/MEMO_template.md                # → archive/cyber-fund/ (replaced by PROPOSAL_template)
commands/serokell-memo.md                  # → archive/cyber-fund/
```
Note: **Don't archive DDMemo** — adapt it for BD Memo in Phase 2.

---

## Day-by-Day Plan (Revised)

### Day 1 — Identity Strip & Context (3-4 hours)

**Goal**: System knows it's working for Serokell BD. No Serokell references.

1. Create `context/serokell-identity.md`, `serokell-company.md`, `serokell-pitch.md`, `serokell-services.md`
2. Update `AGENTS.md`: replace all Serokell/Roman/investment refs
3. Update `config/leverage-rules.yaml`: BD-tuned scoring rules
4. Update `.claude/hooks/load-context.ts` if it references old context files
5. Archive `context/investment-philosophy.md` and `context/MEMO_template.md`

**Test**: Boot a session, verify system prompt reflects Serokell context.

---

### Day 2 — ICP & Scoring Update (2-3 hours)

**Goal**: Leads scored correctly for Rust + Solana + Blockchain pipeline.

1. Update `BD/shared/serokell-icp.md`:
   - Add Solana ecosystem to Tier 1
   - Add Substrate, NEAR, Cosmos SDK to Tier 1
   - Demote Haskell to Tier 3
   - Keep Rust as primary signal throughout

2. Update `BD/shared/scoring-rubric.md`:
   - Add funding round timing flag (modifier on existing Funding dimension)
   - Add market presence sub-score (modifier on existing Domain dimension)
   - Add academic publications bonus flag
   - Update domain scoring: Solana ecosystem = 15, Substrate/NEAR = 15

3. Update `bd-lead-qualifier.md`:
   - Add funding timing check to research steps
   - Add market presence signals to research checklist
   - Add academic/publication signal lookup

4. Update `financial-researcher.md`:
   - Add "Funding Timing Assessment" section to output format
   - Request: days since last raise, investor tier, total raised

5. Update `market-researcher.md`:
   - Add "Market Presence Summary" to output format
   - Request: GitHub stars, community size, conference appearances, blog activity

**Test**: Run `/serokell-bd-find-leads --domain blockchain` on a test session, verify
new dimensions appear in output.

---

### Day 3 — Enhanced Research Flow (2-3 hours)

**Goal**: Lead research includes funding, market presence, and academic papers.

1. Update `serokell-bd-research-lead.md`:
   - Add `content-researcher` as 4th parallel agent (academic papers)
   - Update synthesis template to include:
     - Funding Timing: [fresh/aging/unknown]
     - Market Presence: [score] — [signals found]
     - Academic/Research: [papers found or "none"]
   - Update BD brief format with these new fields

2. Update `Research/shared/agent-selection-matrix.md`:
   - Add BD research type: company + financial + team + content (academic focus)

3. Add `content-researcher` prompt for BD academic search:
   ```
   When used in BD research context:
   - Search arXiv for company name or CTO/founder names
   - Search Semantic Scholar for relevant papers on their technology
   - Search Google Scholar for "[Company] + [technology]"
   - Search conference proceedings: SOSP, OSDI, EuroSys, EuroCrypt, CCS, Usenix Security
   - Output: list of papers with title, authors, year, venue, relevance to Serokell
   ```

**Test**: Run `/serokell-bd-research-lead "TigerBeetle"` and verify it finds
their GitHub, funding data, market presence (stars, HN mentions), and
any academic publications.

---

### Day 4 — Email Drafting (2-3 hours)

**Goal**: `/serokell-email "Company"` produces 3 usable cold email drafts.

1. Create `BD/workflows/email-draft.md`
2. Create `commands/serokell-email.md`
3. Add BD writing style guide to content context:
   - No buzzwords, no "synergy", no "leverage", no corporate speak
   - Lead with a specific technical observation
   - Short sentences, 5-8 total, one clear CTA
   - Peer-to-peer tone: engineer to engineer

**Test**: Run `/serokell-email "TigerBeetle"` after running research on it.
Verify emails reference their specific Rust work, not generic "we love Rust".

---

### Day 5 — Signal Scanning & Pipeline View (3-4 hours)

**Goal**: `/serokell-scan` finds new leads. Pipeline state is visible.

1. Create `BD/workflows/daily-scan.md`
2. Create `commands/serokell-scan.md`
3. Create `BD/workflows/pipeline.md`
4. Create `commands/serokell-pipeline.md`
5. Update `scripts/db/` to index pipeline stage from `companies/*/index.md`
6. Update GTD skill to route BD task types to correct workflows

**Test**: Run `/serokell-scan`, verify it finds Solana-adjacent companies.
Run `/serokell-pipeline`, verify kanban output.

---

### Day 6 — Brief & GTD Integration (2 hours)

**Goal**: Morning BD brief. GTD tasks route to BD workflows.

1. Update `leverage-rules.yaml` (if not done on Day 1)
2. Update `serokell-brief.md`:
   - BD-specific synthesis prompt
   - Include pipeline follow-ups due
   - Include any recent company signals
3. Update GTD outreach workflow for BD email outreach
4. Test end-to-end: GTD task "Research TigerBeetle for BD" → bd-research-lead

---

### Day 7 — Cleanup & Phase 2 Design (2-3 hours)

1. Reference audit: `grep -r "Serokell\|investment philosophy\|term sheet\|VC fund" .claude/`
2. Update AGENTS.md command table if any new commands need to be listed
3. Design Phase 2 (proposal engine) — write `skills/Proposal/SKILL.md` and `generate.md` stubs
4. Update README.md for Serokell BD context
5. Commit and push

---

## Enhanced Scoring Rubric (Updated)

Complete revised rubric for `BD/shared/scoring-rubric.md`:

| Dimension | Max | Notes |
|-----------|-----|-------|
| Geography | 15 | US:15, W.EU:13, E.EU/IL:8, CAN/AU:8 |
| Company size | 15 | 30-150:15, 15-30 or 150-250:10, 250-500:6 |
| **Funding stage + timing** | 15 | Series A/B:15, fresh (<6mo): +flag. Seed $3M+:11 |
| Rust + Solana usage depth | 25 | Rust primary:25, Solana ecosystem:25, Significant Rust:20 |
| **Domain fit + market presence** | 15 | Blockchain/systems:15, +presence bonus up to +5 |
| Outsourcing readiness | 15 | Contractors:15, Remote-first:10, Fast-hiring:8 |

**Academic/research**: Bonus flag (no pts change) that upgrades Watch→Qualified or Qualified→Hot when present. Signals correctness culture = perfect Serokell customer.

**Solana clarification**: A Solana protocol/infra company with Rust primary language scores 25 (Rust) + 15 (blockchain domain) = 40/55 on those two dimensions alone. Will almost certainly qualify.

---

## APIs Needed

| API | Purpose | Priority |
|-----|---------|----------|
| EXA_API_KEY | Primary web/company research | Required |
| PERPLEXITY_API_KEY | Fast research + job board search | Required |
| TELEGRAM_API_ID/HASH | BD Telegram communication | High |
| GOOGLE_OAUTH | Gmail for managing inbound leads | High |
| HUNTER_API_KEY | Email finding for cold outreach | Medium |
| GOOGLE_SHEETS_API | Lead pipeline export (already used by find-leads) | Configured? |
| SEMANTIC_SCHOLAR_API | Academic paper search (free API) | Medium |

---

## Phase 2 Summary (For Reference — Implement After Phase 1)

Adapt DDMemo mechanics (Opus analysis + Sonnet template writer) into:

1. **BDMemo**: Given a qualified lead, generate a BD brief with:
   - Fit score breakdown with evidence
   - Recommended services to pitch
   - Key risks (legal, timezone, language, scope)
   - Decision maker strategy
   - Outreach plan (email → call → proposal sequence)

2. **Proposal Engine**: Given a client request, generate:
   - Requirements analysis (functional/non-functional/ambiguities)
   - Technical architecture recommendation
   - Effort estimate: 3 scenarios (analogy-based, from reference-projects.md)
   - Proposal document (client-facing)
   - Internal estimate sheet

The Opus analysis agent for Phase 2 should apply Serokell's engineering judgment:
"Would we bet our reputation on this architecture? Can we staff the right team?"

---

*v2 — 2026-02-28. Primary correction: Rust + Solana + Blockchain is the ICP focus.
Most research infrastructure is reusable — the real work is context files, ICP updates,
scoring enhancements, email drafting, and signal scanning.*
