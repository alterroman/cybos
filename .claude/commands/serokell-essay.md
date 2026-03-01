---
name: serokell-essay
description: Write an essay following brand guidelines.
---

Write an essay using the essay workflow.

**Workflow:** `.claude/skills/Content/workflows/essay.md`

**Usage:**
- `/serokell-essay "topic"`
- `/serokell-essay "topic" @path/to/source.md`
- `/serokell-essay @path/to/source.md "expand this into full essay"`
- `/serokell-essay "topic" @folder/` (reads all .md files in folder)

**Arguments:**
- Topic: Main essay topic or thesis (required)
- Source files: Optional @-prefixed file paths or folders
  - Ideas, research notes, previous drafts, tweets
  - Multiple sources supported
  - Sources provide foundation. Agent expands and synthesizes.

**Example usage:**
```
/serokell-essay "The convergence of AI and crypto" @content/ideas/agent-economy.md
/serokell-essay @~/SerokellSalesVault/private/research/ai-infrastructure/ "Write market analysis essay"
/serokell-essay "TEE compute thesis" @content/ideas/tee-notes.md @~/SerokellSalesVault/private/deals/acme-corp/research/2025-12-20.md
```

**Process:**

1. **LOAD WORKFLOW**: Read `.claude/skills/Content/workflows/essay.md`
2. **LOAD SOURCES** (if @ references): Parse and read all referenced files
3. **EXECUTE WORKFLOW**: Follow essay.md steps exactly
   - Workflow loads: `~/SerokellSalesVault/private/context/style/voice-identity.md`, `~/SerokellSalesVault/private/context/style/writing-style-en.md`
   - Workflow handles: drafting, review, polish, output, logging

**Output:** `~/SerokellSalesVault/private/content/essays/MMDD-<slug>-YY.md`
