---
name: document-skills
description: "Read/write Office and PDF files. Triggers: docx, pdf, pptx, xlsx, Word, PowerPoint, Excel, spreadsheet, document, Office file."
metadata:
  verified_date: 2026-08-09
  stability: stable
---

# Document Skills Index — cross-sns-audience-flow-analyzer

Source: https://github.com/anthropics/skills

Official bundled scripts are large (python-docx, pypdf, openpyxl, python-pptx vendored). Do NOT copy them into cross-sns-audience-flow-analyzer. Fetch on demand from the URLs below.

## When to use which

| Format | Skill | Use when | URL |
| ------ | ----- | -------- | --- |
| `.docx` | docx | Read/write Word docs, track changes, headings, tables, styles | https://github.com/anthropics/skills/tree/main/document-skills/docx |
| `.pdf`  | pdf  | Extract text/tables, fill forms, merge/split, OCR fallback | https://github.com/anthropics/skills/tree/main/document-skills/pdf |
| `.pptx` | pptx | Generate slide decks, edit shapes/charts, batch theme apply | https://github.com/anthropics/skills/tree/main/document-skills/pptx |
| `.xlsx` | xlsx | Read/write spreadsheets, formulas, named ranges, charts | https://github.com/anthropics/skills/tree/main/document-skills/xlsx |

## Fetch protocol
1. Identify the exact format from the user's file extension or intent — never guess.
2. `git sparse-checkout` or `curl` the single skill folder (e.g. `document-skills/pdf/`) into a temp dir.
3. Read the skill's own `SKILL.md` for the canonical workflow; do not re-derive.
4. Run bundled scripts with the project's Python (version `3.11+`); do not vendor them into `src`.

## Selection rules
- Mixed formats in one task -> load each skill in parallel sub-agents; never sequentially chain reads.
- Read-only extraction prefers `pdf` text mode over OCR (10x cheaper); fall back only on scan-only PDFs.
- Generation from a template (brand-locked) -> copy template -> edit; never regenerate from scratch.
- Refuse silently-corrupting operations (e.g. `.doc` legacy binary) — convert first via LibreOffice headless.

## Reference
- Skills repo: https://github.com/anthropics/skills
- Skill author guide (Boris Cherny): https://www.anthropic.com/news/skills
