Generate image(s) based on concept or source material.

Load workflow: @.claude/skills/Content/workflows/image.md

Input: $ARGUMENTS

## Usage

Single image:
```
/serokell-image "concept or description"
/serokell-image @content/essays/file.md "visualize key insight"
```

Multiple images:
```
/serokell-image "3 info diagrams and 1 mural based on this research" @research/topic/report.md
```

## Style Inference

Style is automatically inferred from your request:
- **info**: infographic, diagram, process, flow, comparison, steps
- **mural**: transformation, sacred, dissolution, empire, monument
- **cyberpunk**: future, corporate, liminal, atmospheric, contemplative

Override with explicit style: "mural style image of..."

## Output

Images saved to: `~/SerokellSalesVault/private/content/images/MMDD-<slug>-YY.png`
