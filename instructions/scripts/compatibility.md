---
title: Velox scripting compatibility
description: Avoid unsupported inline character-set membership and use explicit comparisons in generated scripts.
classification: public
status: review-required
owner: Kevin Tobias
last_updated_by: Kevin Tobias
last_updated: "2026-10-20T23:50:34Z"
---

# Velox scripting compatibility

Read this standard before generating, editing or reviewing Velox script code, including Map events, Custom Script actions, File Router formulas and Scriptlets. Follow [shared rules](../common.md), [managed helpers](helpers.md) and the [owning event's Value contract](event-value-context.md).

## Unsupported inline character-set/range membership

The user reports that Velox scripting does not support this inline character-set/range membership expression. Do not generate it:

```text
if not (lTag[k] in ['A'..'Z', '/']) then
  break;
```

Use the explicit-comparison replacement:

```pascal
if (lTag[k] <> '/') and
   ((lTag[k] < 'A') or (lTag[k] > 'Z')) then
  break;
```

This rejects a character unless it is `/` or in the inclusive uppercase `A` through `Z` range. Keep `break` inside its intended loop and keep indexing within valid string bounds. Preserve case sensitivity, boundaries and the original loop behaviour when rewriting an example.

## Rules for generation and review

- Do not assume that valid Delphi syntax compiles in Velox. Use the APIs and syntax supported by the target Velox scripting engine and event context.
- Before delivering a script, inspect every emitted script block for inline character-set/range membership and replace the reported unsupported form. Do not copy a prohibited example from this guidance into generated output. State any compilation checks that could not be performed.
- Replace inline character-set/range membership with explicit equality or range comparisons. For the negative condition above, use the exact Boolean grouping shown; changing `and` to `or` changes the acceptance rule.
- Prefer explicit comparisons in new examples for small enumerated alternatives and numeric ranges too. This is a conservative authoring convention, not evidence that these other forms are unsupported.
- Do not claim that all sets, named/registered set types, enumeration membership, integer ranges, array membership or every use of `in` is unsupported. Those are distinct constructs whose support must be checked against the actual Velox engine and operand types.
- References describing a native method's internal set operation do not prove that the equivalent inline expression is accepted in a Velox script.
- Preserve meaningful existing uses of other set/membership forms until the target engine and their actual role are checked. Report uncertainty; do not blindly replace every occurrence of `in` in code, SQL, prose or configuration.

## Validation and evidence

The exact rejected character expression and its replacement are user-supplied. The observed Velox build and compiler diagnostic were not supplied. Existing [comparison documentation](../../CodeLibrary/ScriptingGuide/Operators/Relational.md) describes set/membership machinery in the Velox-modified PascalScript engine, but those historical implementation notes do not establish support for every inline constructor/operand combination.

Direct engine verification was not available for this update: no product-source checkout was found, and the connected repository access could not retrieve the engine source. The precise boundary beyond the reported character expression remains unverified. Before making broader claims, inspect the shipped compiler's expression parsing/type checking, relevant runtime membership handling and Velox host options/registrations, and compile focused cases in the target Velox build. An upstream PascalScript version or a Delphi compiler is not a substitute for that check.

Report validation in separate categories:

1. **Extraction checks:** finding/extracting fenced script examples proves only that examples were located and processed.
2. **Static checks:** Markdown/MDX parsing, link checks, pattern scans and logical/boundary comparisons do not invoke the Velox compiler.
3. **Velox compilation:** claim success only after the exact script was compiled by the actual target Velox engine; record the build, context and result. A successful Markdown build or extraction script is not successful Velox compilation.
4. **Runtime checks:** record executed cases and observed behaviour separately from compilation.

No actual Velox compilation or runtime test was performed for this documentation update. Keep the guidance `review-required` while the engine-specific scope remains unresolved.
