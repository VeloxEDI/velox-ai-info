---
title: Flows authoring entry point
description: Routes agents to instructions and documentation for flows.
classification: public
status: review-required
owner: Kevin Tobias
last_updated_by: Kevin Tobias
last_updated: "2026-11-17T23:28:09Z"
---

# Flows authoring entry point

Applies to: Flow modules, triggers, execution policy and data items.

Before creating, editing or reviewing this type, read [shared rules](../common.md) and the [instruction catalogue](../README.md). Inspect [the product documentation](../../Velox/docs/design-and-build/flows/index.md) and existing configuration for supported settings and behaviour.

Follow the linked authoring standards and product documentation. Add future conventions as separate files in this folder and require them here; do not infer unsupported behaviour from a folder or class name alone.

Read and follow [CFG child-data bindings](child-data-bindings.md) for native-style naming/ownership and action Source/Dest links to actual Flow data components. Keep module FIDS and display labels distinct, check expected classes, and confirm native links persist after reopening the imported Flow. The successful correction was combined, not isolated proof that arbitrary names are unsupported.

For Process-led CFG packages, follow [CFG import packaging](../cfg-packaging.md). Preserve native `TvxActionMan` naming, put the primary Process first, keep requested Processes disabled and distinguish their state from the active wrapper and supporting modules. Follow the verified native layout and report import separately from native Test Compile.

Read [actions](../actions/AGENTS.md) for each action/step and all relevant module entry points required by that Flow.

Read the entry points for other object types this configuration depends on. Report documentation gaps and conflicts instead of inventing conventions. When maintaining these instructions, update the metadata and validate local links.

