# BD Lead Finding Workflow

Orchestrator for finding, qualifying, and storing Serokell BD leads.

---

## CRITICAL RULES

1. **ONE workspace per session**: Create it once, pass path to every agent
2. **Agents do all searching**: Main session orchestrates, agents execute MCP calls
3. **Parallel execution**: Run finder and qualifier sequentially (qualifier depends on finder)
4. **Always sync to Google Sheets**: Final step is always the Sheets export

---

## Overview

This workflow:
1. Parses search parameters from user input
2. Creates workspace directory
3. Runs bd-lead-finder to discover candidates
4. Runs bd-lead-qualifier to score and rank
5. Syncs qualified leads to Google Sheets
6. Reports summary

---

## Phase 1: INITIALIZE

### 1.1 Parse Parameters

Extract from user arguments:
- **Geography** (default: `US,EU`): `--geo US` or `--geo EU` or `--geo US,EU`
- **Domain** (default: `all`): `--domain blockchain` or `--domain fintech` etc.
  - Valid: `blockchain`, `fintech`, `embedded`, `systems`, `devtools`, `ai-infra`, `all`
- **Funding** (default: `seed,series-a,series-b`): `--funding series-a,series-b`
- **Size** (default: `20-200`): `--size 50-150`
- **Min score** (default: `65`): `--min-score 70` (threshold for Google Sheets)
- **Limit** (default: `30`): `--limit 20` (max candidates to find)

### 1.2 Create Workspace

```
~/SerokellSalesVault/private/projects/serokell-bd/leads/MMDD-<domain>-YY/
├── raw/                  # Agent outputs
└── report.md            # Final summary
```

**Naming**: `MMDD-<domain>-YY` — e.g., `0227-blockchain-26`

**Actions:**
1. Ensure `~/SerokellSalesVault/private/projects/serokell-bd/leads/` exists (create if not)
2. Create timestamped workspace with `/raw/` subdirectory
3. Record workspace path for all subsequent steps

### 1.3 Confirm Parameters

Print to user:
```
🔍 Starting BD lead search
   Geography: [geo]
   Domain: [domain]
   Funding: [funding]
   Min score: [min-score]
   Workspace: [path]
```

---

## Phase 2: FIND CANDIDATES

### 2.1 Launch bd-lead-finder

```
Task: bd-lead-finder
Prompt: "Find Rust companies for Serokell BD pipeline.

**Workspace**: [workspace-path]
**Output to**: [workspace-path]/raw/agent-bd-lead-finder.md

⚠️ CRITICAL: Write ALL output to the workspace path above. Your ONLY output file is [workspace-path]/raw/agent-bd-lead-finder.md.

**Search parameters**:
- Geography: [geo]
- Domain focus: [domain] (if 'all', search all Serokell domains)
- Funding stages: [funding]
- Company size: [size]
- Target count: [limit] candidates minimum

**Context**: Serokell is a Rust/Haskell dev shop. Sweet spot deal: $100k / 3-4 months / 3 engineers.
Companies should have genuine Rust usage or near-term Rust need.

Read the ICP context from @.claude/skills/BD/shared/serokell-icp.md before searching.

Search using: GitHub orgs, job boards (Wellfound, Ashby, Greenhouse), Perplexity web search, Exa company search, HackerNews, tech press. Be creative and exhaustive."
```

### 2.2 Wait for Finder

Wait for bd-lead-finder to complete.

**If finder finds fewer than 15 companies**: Log warning but continue — qualifier will note coverage gap.

---

## Phase 3: QUALIFY AND SCORE

### 3.1 Launch bd-lead-qualifier

```
Task: bd-lead-qualifier
Prompt: "Score Rust company candidates for Serokell BD pipeline.

**Workspace**: [workspace-path]
**Input**: [workspace-path]/raw/agent-bd-lead-finder.md
**Output to**: [workspace-path]/raw/agent-bd-lead-qualifier.md

⚠️ CRITICAL: Write ALL output to the workspace path above. Your ONLY output file is [workspace-path]/raw/agent-bd-lead-qualifier.md.

**Scoring rubric**: @.claude/skills/BD/shared/scoring-rubric.md
**Serokell ICP**: @.claude/skills/BD/shared/serokell-icp.md

1. Read all candidates from the finder output
2. Research each company briefly to fill missing data (size, funding, Rust depth)
3. Score each company using the rubric (0-100)
4. Output ranked list: Hot (80+), Qualified (65-79), Watch (50-64), Discard (<50)
5. For each qualified lead: find the decision maker (CTO, VP Eng, Head of Engineering)

Qualify leads that score ≥ [min-score] as Serokell pipeline candidates."
```

### 3.2 Wait for Qualifier

Wait for bd-lead-qualifier to complete.

---

## Phase 4: SYNC TO GOOGLE SHEETS

### 4.1 Parse Qualified Leads

Read `[workspace]/raw/agent-bd-lead-qualifier.md`.
Extract all leads with score ≥ min-score.

Build structured data array:
```json
[
  {
    "company": "...",
    "website": "...",
    "hq": "...",
    "size": "...",
    "funding": "...",
    "stage": "...",
    "rust_evidence": "...",
    "domain": "...",
    "score": 0,
    "tier": "hot|qualified|watch",
    "decision_maker": "...",
    "linkedin": "...",
    "github": "...",
    "outsource_signal": "...",
    "pitch_angle": "...",
    "research_date": "YYYY-MM-DD",
    "workspace": "[workspace-path]"
  }
]
```

### 4.2 Run Sheets Sync

Execute the sheets sync script:

```bash
node /home/user/serokell-sales-agent/scripts/sheets-sync.js \
  --sheet-id "[SEROKELL_LEADS_SHEET_ID]" \
  --tab "Leads" \
  --data '[JSON array of leads]'
```

**If sheet ID not configured**: Prompt user:
```
⚠️ Google Sheets ID not set.
Please set SEROKELL_LEADS_SHEET_ID in ~/.serokell/config.json
Or provide it with: /serokell-bd-find-leads --sheet-id YOUR_ID

Leads saved locally to: [workspace]/report.md
```

**If script succeeds**: Print Google Sheets URL.

---

## Phase 5: OUTPUT

### 5.1 Create Report

Write `[workspace]/report.md`:

```markdown
# Serokell BD Lead Search — [Date]

**Parameters**: [geo] | [domain] | [funding] | Min score: [min]
**Workspace**: [path]

## Summary
- Candidates found: [N]
- Qualified leads: [N] (score ≥ [min])
  - 🔥 Hot (80+): [N]
  - ✅ Qualified (65-79): [N]
  - 🟡 Watch (50-64): [N]

## Top Leads

### 🔥 [Score] — [Company]
- [one-line summary]
- **Pitch angle**: [why Serokell, why now]

[... top 10 leads ...]

## Full Lead List

See: [workspace]/raw/agent-bd-lead-qualifier.md

## Google Sheets

[Link to sheet or "Not synced — see above for setup instructions"]

---
*Generated: [timestamp]*
```

### 5.2 Log Completion

Append to `~/SerokellSalesVault/private/.serokell/logs/MMDD-YY.md`:

```markdown
## HH:MM | bd | find-leads | [domain] [geo]
- Workflow: bd-find-leads
- Duration: [Xm Ys]
- Candidates found: [N]
- Qualified: [N]
- Output: [workspace-path]/report.md
- Sheets: [synced/not-synced]

---
```

### 5.3 Display to User

Print summary:
```
✅ BD Lead Search Complete

📊 Results:
   Candidates found: [N]
   Hot leads (80+): [N]
   Qualified (65-79): [N]
   Watch list (50-64): [N]

🏆 Top 3 leads:
   1. [Company] ([Score]) — [one-line]
   2. [Company] ([Score]) — [one-line]
   3. [Company] ([Score]) — [one-line]

📁 Full report: [workspace]/report.md
📊 Google Sheets: [URL or setup instructions]
```

---

## Error Handling

**Agent fails**: Continue with available data, flag incomplete in report.
**Sheets sync fails**: Save leads to report.md, show setup instructions.
**No candidates found**: Suggest broadening search parameters.
**All score below threshold**: Lower --min-score or broaden --domain.

---

## Duration Estimates

| Phase | Expected Duration |
|-------|------------------|
| Find candidates | 2-4 minutes |
| Qualify and score | 3-6 minutes |
| Sheets sync | 10-30 seconds |
| **Total** | **5-12 minutes** |
