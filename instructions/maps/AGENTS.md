---
title: Maps authoring entry point
description: Routes agents to instructions and documentation for maps.
classification: public
status: review-required
owner: Kevin Tobias
last_updated_by: Kevin Tobias
last_updated: "2026-10-15T01:47:56Z"
---

# Maps authoring entry point

Applies to: Map modules, field events and generated Map CFGs.

Before creating, editing or reviewing this type, read [shared rules](../common.md) and the [instruction catalogue](../README.md). Inspect [the product documentation](../../Velox/docs/design-and-build/transformations-output/maps/sources-targets-and-mappings.md) and existing configuration for supported settings and behaviour.

Read and follow [field-authoring.md](field-authoring.md) before generating, editing or reviewing Map field objects. This is the canonical standard for empty unmapped events and field `CompiledStatus`. Preserve its exceptions and separate CFG inspection from actual compilation/runtime testing.

For Map event scripts, also follow [Scripts](../scripts/AGENTS.md): use managed helpers and verify each event's `Value` contract. Preserve meaningful field assignments and record-control logic.

Read the entry points for other object types this configuration depends on. Report documentation gaps and conflicts instead of inventing conventions. When maintaining these instructions, update the metadata and validate local links.

