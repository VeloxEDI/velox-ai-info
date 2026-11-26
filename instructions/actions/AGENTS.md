---
title: Actions authoring entry point
description: Routes agents to instructions and documentation for actions.
classification: public
status: review-required
owner: Kevin Tobias
last_updated_by: Kevin Tobias
last_updated: "2026-11-17T23:28:09Z"
---

# Actions authoring entry point

Applies to: Flow actions and steps, including sub-actions.

Before creating, editing or reviewing this type, read [shared rules](../common.md) and the [instruction catalogue](../README.md). Inspect [the product documentation](../../Velox/docs/design-and-build/flows/steps/index.md) and existing configuration for supported settings and behaviour.

Follow the linked authoring standards and product documentation. Add future conventions as separate files in this folder and require them here; do not infer unsupported behaviour from a folder or class name alone.

Also read [Flows](../flows/AGENTS.md) for the containing Flow and each referenced module type. A Map action requires [Maps](../maps/AGENTS.md).

Before generating Map, Transport or Custom Script CFG bindings, follow [Flow child-data binding guidance](../flows/child-data-bindings.md). Action Source/Dest must resolve to the intended Flow-local data component and compatible class. They are not module-name/GUID selections; static checks do not prove native binding or persistence after import.

For Custom Script actions and File Router formulas, read [Scripts](../scripts/AGENTS.md), especially [event Value context](../scripts/event-value-context.md). A routing predicate and an ordinary Custom Script do not share a universal `Value := True` convention.

Read the entry points for other object types this configuration depends on. Report documentation gaps and conflicts instead of inventing conventions. When maintaining these instructions, update the metadata and validate local links.

