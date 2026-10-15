---
title: Actions authoring entry point
description: Routes agents to instructions and documentation for actions.
classification: public
status: review-required
owner: Kevin Tobias
last_updated_by: Kevin Tobias
last_updated: "2026-10-15T01:47:56Z"
---

# Actions authoring entry point

Applies to: Flow actions and steps, including sub-actions.

Before creating, editing or reviewing this type, read [shared rules](../common.md) and the [instruction catalogue](../README.md). Inspect [the product documentation](../../Velox/docs/design-and-build/flows/steps/index.md) and existing configuration for supported settings and behaviour.

No additional type-specific authoring convention has been recorded here yet. Follow shared rules and product documentation; do not infer unsupported behaviour from this scaffold. Add future conventions as separate files in this folder and require them here.

Also read [Flows](../flows/AGENTS.md) for the containing Flow and each referenced module type. A Map action requires [Maps](../maps/AGENTS.md).

For Custom Script actions and File Router formulas, read [Scripts](../scripts/AGENTS.md), especially [event Value context](../scripts/event-value-context.md). A routing predicate and an ordinary Custom Script do not share a universal `Value := True` convention.

Read the entry points for other object types this configuration depends on. Report documentation gaps and conflicts instead of inventing conventions. When maintaining these instructions, update the metadata and validate local links.

