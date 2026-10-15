---
title: Map and CFG field authoring instructions
description: Field-event and CompiledStatus rules for agents generating, editing or reviewing Velox Maps.
classification: public
status: review-required
owner: Kevin Tobias
last_updated_by: Kevin Tobias
last_updated: "2026-10-12T03:04:12Z"
---

# Map and CFG field authoring instructions

Read and follow these instructions before generating, editing or reviewing a Map or Map configuration (CFG) file. This file owns the repository's mapping authoring convention; use the [product mapping guidance](../../Velox/docs/design-and-build/transformations-output/maps/sources-targets-and-mappings.md) for Definition setup and general mapping concepts.

This file is maintained under `velox-ai-info/instructions/maps/`, outside the folders replaced by the current documentation sync. Read [shared rules](../common.md) alongside these rules. The [Map entry point](AGENTS.md) requires this standard; the [root agent instructions](../../AGENTS.md) route configuration tasks to the type entry points.

## Field authoring rules

Apply this convention only to the relevant `TvxFieldMap` objects. Preserve field identity, names, type metadata, meaningful scripts and record/view controls.

| Field intent | Field events in the generated CFG | Field `CompiledStatus` |
| --- | --- | --- |
| Actual mapping, transformation, validation or explicitly required override | Create or retain the meaningful event | `1` |
| Intentionally unmapped | Leave all field-level event editors empty and omit their `*Formula.Strings` properties | `0` |

Do not create placeholder `OnMapEvent` handlers solely to set `Field.Required := False` and `Value := Null`, hold `DISABLED` comments or obtain a green indicator. Record unresolved mappings and decision notes in the mapping documentation. An unresolved mapping requires a decision before it can be treated as intentionally unmapped.

When adding or removing a field event, update that field's status to match its intent. Do not rewrite status values on unrelated CFG objects or replace existing compilation/error statuses across a configuration.

## Check before removing an event

Preserve a recoverable configuration copy. Check the destination Definition, required-field rules, defaults, automatic values, keys, links and all scripts that can affect the field, including field, record and view events. An intentional reset, requirement override or value override is meaningful logic; preserve it unless the requirement is explicitly changed. A field with meaningful validation or override logic is not intentionally unmapped merely because it has no direct source assignment.

Remove only redundant placeholders. Retain the field object and metadata, omit its field-level formula properties and set its status to `0` when intentionally unmapped. Record the decision and dependencies in the mapping documentation.

## Generic CFG examples

These fragments illustrate the convention, not complete importable or tested configurations. Retain the actual field identity and type metadata when applying them. Use generic examples in shared knowledge; do not copy customer data or configuration identifiers into this repository.

```text
object OptionalText: TvxFieldMap
  FieldName = 'OptionalText'
  CompiledStatus = 0
end
```

```text
object CategoryText: TvxFieldMap
  FieldName = 'CategoryText'
  OnMapFormula.Strings = (
    'procedure OnMapEvent(var Value: Variant);'
    'begin'
    '  Value := ''Example'';'
    'end;')
  CompiledStatus = 1
end
```

## Validate the generated fields

1. Check every generated field against its documented intent: meaningful events use status `1`; intentionally unmapped fields use status `0` with no field-event formula.
2. Compare the CFG before and after editing. Confirm that identity/type metadata, meaningful scripts and record/view controls remain intact and unrelated object statuses were not changed.
3. Inspect the Designer indicators in the target Velox build. User-confirmed Designer behaviour associates status `1` with a green mapping-event indicator and status `0` with the default blank/unmapped appearance. This observation is not a complete definition of compilation status values; the observed build was not specified.
4. Compile the actual scripts and run isolated representative mapping and persistence tests when a target Velox environment is available. Check required fields, defaults, automatic/key/link behaviour and saved destination values. Restore the preserved configuration if behaviour changes unexpectedly.
5. Report CFG inspection, actual Velox compilation and runtime/persistence testing separately, including checks that could not be performed. Setting `CompiledStatus = 1` in a file does not prove successful compilation or testing.

An empty event guarantees neither SQL `NULL` output nor preservation of stored values. Confirm the destination Definition, defaults, automatic/key/link behaviour, other scripts and destination save behaviour for the particular configuration. Treat these field rules as an authoring convention, not a source-verified runtime guarantee.

## Evidence and verification scope

The empty-event and status rules are supplied authoring standards. The green/blank indicator behaviour is user-confirmed, with no observed build specified. Direct product-source review of field script execution, event compilation, DataView field setup and destination SQL generation was not available for this change. No actual Velox compilation or runtime/persistence test was performed. Those checks remain necessary before claiming configuration-specific runtime results; this file remains `review-required`.

