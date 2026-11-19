---
title: Scripts and SQL scripts authoring entry point
description: Routes agents to instructions and documentation for scripts and sql scripts.
classification: public
status: review-required
owner: Kevin Tobias
last_updated_by: Kevin Tobias
last_updated: "2026-11-19T21:20:24Z"
---

# Scripts and SQL scripts authoring entry point

Applies to: SQL Script modules and embedded Velox event scripts.

Before creating, editing or reviewing this type, read [shared rules](../common.md) and the [instruction catalogue](../README.md). Inspect [the product documentation](../../Velox/docs/design-and-build/scripting-code-library/index.md) and existing configuration for supported settings and behaviour.

Before authoring or reviewing Velox script code, read and follow [managed helper rules](helpers.md) and [event Value context](event-value-context.md). Use documented helpers such as `Json`, `JsonArray` and `List` instead of manual construction/freeing of their corresponding workspaces. Do not add a blanket `Value := True` footer; determine its meaning from the owning event, especially for File Router predicates.

For field checks, follow [concise native field-helper usage](field-helpers.md). Prefer `IsNullEmpty`/`NotNullEmpty` when their NULL/trimmed-empty semantics match; preserve exact-NULL and numeric/date-zero tests and copy nonblank output with `AsString` unless trimming is explicitly required. Do not add checks or change business behaviour merely to shorten code, or claim a measured runtime improvement.

Read and follow [scripting compatibility](compatibility.md). Do not generate inline character-set/range membership such as `lTag[k] in ['A'..'Z', '/']`; use explicit comparisons. Prefer explicit comparisons for other small inline alternatives/ranges without claiming that all sets or every `in` expression is unsupported. Valid Delphi syntax is not proof of Velox support. Distinguish extraction/static checks from actual compilation in Velox.

Read and follow [mandatory failure handling](failure-handling.md) for every script. Use `LogError` plus explicit Exit/checked helper propagation, never raise/Exception.Create or a substitute status. Preserve cleanup and try..except for unexpected failures. Run the regression checker before delivery; distinguish static checks from native compilation.

For SQL Script modules inspect [SQL script guidance](../../Velox/docs/design-and-build/transformations-output/sql-scripts.md). For event scripts, also read the entry point of the owning object; Map field scripts require [Maps](../maps/AGENTS.md).

For meaningful Map dataset/view and field event scripts, follow [native procedure-header context comments](../maps/field-authoring.md#procedure-header-context-comments). Use the actual destination dataset or dataset.field context, preserve existing notes and native signatures/bindings, and leave intentionally unmapped events empty. Do not apply a Map-specific header/signature to another host or promise exact error attribution from every comment.

Read the entry points for other object types this configuration depends on. Report documentation gaps and conflicts instead of inventing conventions. When maintaining these instructions, update the metadata and validate local links.

