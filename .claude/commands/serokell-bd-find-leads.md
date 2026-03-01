Find Rust companies for Serokell BD pipeline.

**Arguments**: $ARGUMENTS

Load workflow:
@.claude/skills/BD/workflows/find-leads.md

---

**Usage examples**:

```bash
# Default search: all domains, US+EU, Series A/B
/serokell-bd-find-leads

# Focus on blockchain companies in the US
/serokell-bd-find-leads --domain blockchain --geo US

# EU fintech companies, Series A only, stricter scoring
/serokell-bd-find-leads --domain fintech --geo EU --funding series-a --min-score 70

# Systems/embedded with custom Sheets destination
/serokell-bd-find-leads --domain systems --sheet-id 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms

# Broad search with higher candidate count
/serokell-bd-find-leads --limit 50
```

**Flags**:
- `--geo US|EU|US,EU` — Geography filter (default: US,EU)
- `--domain blockchain|fintech|embedded|systems|devtools|ai-infra|all` — Domain focus (default: all)
- `--funding seed|series-a|series-b|series-c` — Funding stage filter (default: seed,series-a,series-b)
- `--size MIN-MAX` — Employee count range (default: 20-200)
- `--min-score N` — Minimum score for Google Sheets inclusion (default: 65)
- `--limit N` — Max candidate companies to find (default: 30)
- `--sheet-id ID` — Google Sheets ID (overrides config)
