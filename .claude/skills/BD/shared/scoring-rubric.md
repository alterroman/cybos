# Lead Scoring Rubric

Scores leads 0-100 for Serokell BD pipeline.
Threshold: **≥60** = qualify for research, **≥75** = high priority outreach.

---

## Scoring Dimensions

### 1. Geography (0-15 pts)

| Scenario | Score |
|----------|-------|
| US-based (HQ or primary market) | 15 |
| EU-based (Western Europe: UK, DE, NL, FR, CH, SE, etc.) | 13 |
| Eastern Europe or Israel | 8 |
| Canada or Australia | 8 |
| Other / Unknown | 0 |

### 2. Company Size (0-15 pts)

| Employees | Score |
|-----------|-------|
| 30-150 (sweet spot) | 15 |
| 15-30 or 150-250 | 10 |
| 250-500 | 6 |
| <15 or >500 | 2 |
| Unknown | 5 |

### 3. Funding Stage (0-15 pts)

| Stage | Score |
|-------|-------|
| Series A or B | 15 |
| Seed ($3M+) | 11 |
| Series C+ (lean eng team) | 9 |
| Bootstrapped with revenue | 6 |
| Pre-seed or Unknown | 3 |

### 4. Rust Usage Depth (0-25 pts) — most important

| Evidence | Score |
|----------|-------|
| Rust is primary language (GitHub shows >50% Rust) | 25 |
| Significant Rust codebase + active development | 20 |
| Rust in production (blog post, job posts mention Rust stack) | 15 |
| Hiring Rust engineers (job postings) | 12 |
| Mentioned Rust in tech blog or conference | 8 |
| C++ / Go stack with performance needs (Rust-adjacent) | 5 |
| No Rust signal | 0 |

### 5. Domain Fit (0-15 pts)

| Domain | Score |
|--------|-------|
| Blockchain / protocol infrastructure | 15 |
| Systems infrastructure (DB, storage, networking, runtime) | 15 |
| Developer tools (compilers, CLIs, runtimes) | 13 |
| Fintech / high-perf trading or payments | 13 |
| Embedded / IoT / firmware | 12 |
| AI/ML infrastructure | 10 |
| SaaS with systems components | 7 |
| Pure SaaS / no systems layer | 2 |

### 6. Outsourcing Readiness (0-15 pts)

| Signal | Score |
|--------|-------|
| Known to work with outsourced/contract engineering | 15 |
| Remote-first culture + distributed team | 10 |
| Fast-growing and actively hiring (needs capacity) | 8 |
| Engineering blog shows openness to external contributors | 5 |
| No signal | 0 |

---

## Score Interpretation

| Score | Tier | Action |
|-------|------|--------|
| 80-100 | 🔥 Hot lead | Immediate deep research + personalized outreach |
| 65-79 | ✅ Qualified | Research + add to outreach pipeline |
| 50-64 | 🟡 Warm | Save to watch list, revisit in 3 months |
| <50 | ❌ Not a fit | Discard or archive |

---

## Notes for Qualifier Agent

- When evidence is ambiguous, score conservatively (lower)
- Always cite the evidence for each score dimension
- If a company scores 0 on Rust usage, cap total at 55 regardless of other scores
- A company in an ideal domain (blockchain/systems) with no Rust signal is still interesting — flag as "Rust-adjacent"
- Missing data should be flagged, not assumed as 0
