---
title: Scripts and SQL scripts authoring entry point
description: Routes agents to instructions and documentation for scripts and sql scripts.
classification: public
status: review-required
owner: Kevin Tobias
last_updated_by: Kevin Tobias
last_updated: "2026-10-15T01:47:56Z"
---

# Scripts and SQL scripts authoring entry point

Applies to: SQL Script modules and embedded Velox event scripts.

Before creating, editing or reviewing this type, read [shared rules](../common.md) and the [instruction catalogue](../README.md). Inspect [the product documentation](../../Velox/docs/design-and-build/scripting-code-library/index.md) and existing configuration for supported settings and behaviour.

Before authoring or reviewing Velox script code, read and follow [managed helper rules](helpers.md) and [event Value context](event-value-context.md). Use documented helpers such as `Json`, `JsonArray` and `List` instead of manual construction/freeing of their corresponding workspaces. Do not add a blanket `Value := True` footer; determine its meaning from the owning event, especially for File Router predicates.

For SQL Script modules inspect [SQL script guidance](../../Velox/docs/design-and-build/transformations-output/sql-scripts.md). For event scripts, also read the entry point of the owning object; Map field scripts require [Maps](../maps/AGENTS.md).

Read the entry points for other object types this configuration depends on. Report documentation gaps and conflicts instead of inventing conventions. When maintaining these instructions, update the metadata and validate local links.

