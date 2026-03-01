Deep-dive research on a single Serokell BD lead.

**Company**: $ARGUMENTS

**Steps**:

1. Parse company name from arguments
   - Strip flags, extract company name

2. Check for existing research
   - Look in `~/SerokellSalesVault/private/projects/serokell-bd/leads/*/raw/` for prior research on this company
   - If found: load as context, note date, ask if user wants fresh research

3. Create workspace
   ```
   ~/SerokellSalesVault/private/projects/serokell-bd/leads/research/MMDD-<company-slug>-YY/
   ├── raw/
   └── report.md
   ```

4. Read Serokell ICP context
   - Load `@.claude/skills/BD/shared/serokell-icp.md`
   - Load `@.claude/skills/BD/shared/scoring-rubric.md`

5. Spawn research agents in parallel:

   **Agent 1 — company-researcher** (standard DD):
   Focus on: business model, product, team, traction, tech stack depth
   Extra Serokell context: Is their Rust usage strategic or incidental? What's their engineering culture?

   **Agent 2 — financial-researcher** (funding + budget signals):
   Focus on: funding rounds, investors, burn rate, growth signals
   Extra Serokell context: Do they have budget for $100k engagement? Are they in growth mode?

   **Agent 3 — bd-lead-qualifier** (Serokell-specific scoring):
   Focus on: full 100-point score, outsource readiness, decision maker research
   Find: CTO / VP Engineering / Head of Engineering name and LinkedIn
   Find: Any signals of working with external vendors or contractors

6. Synthesize findings into BD brief:

   ```markdown
   # BD Research: [Company Name]
   **Date**: [date]
   **Score**: [X/100] — [Hot/Qualified/Watch]

   ## Company Overview
   [2-3 paragraph summary]

   ## Why Serokell
   [Specific pitch angle: what pain do they have that Serokell solves?]

   ## Score Breakdown
   | Dimension | Score | Evidence |
   ...

   ## Decision Maker
   - Name: [CTO/VP Eng name]
   - LinkedIn: [URL]
   - Background: [brief bio]
   - Warm intro path: [any mutual connections to check]

   ## Rust Usage
   [Deep dive: what they've built, GitHub repos, job posts, tech blog]

   ## Outsource Readiness
   [Evidence of contractor usage, remote culture, hiring pace]

   ## Suggested Outreach Angle
   [1-2 sentences: what problem to reference, what Serokell brings]

   ## Open Questions
   [What we still don't know]
   ```

7. Save report to workspace

8. Update Google Sheets row (if company already exists in sheet):
   - Add "Researched" status
   - Add link to report

9. Log to `~/SerokellSalesVault/private/.serokell/logs/MMDD-YY.md`:
   ```
   ## HH:MM | bd | research-lead | [Company]
   - Score: [X/100]
   - Output: [workspace]/report.md
   ---
   ```

10. Display to user:
    - Score and tier
    - Decision maker info
    - Suggested outreach angle
    - Path to report

**Usage examples**:
```bash
/serokell-bd-research-lead "TigerBeetle"
/serokell-bd-research-lead "Rivet"
/serokell-bd-research-lead "Turso"
/serokell-bd-research-lead "Zed Industries"
```
