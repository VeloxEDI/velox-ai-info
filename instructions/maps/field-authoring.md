---
title: Map and CFG field authoring instructions
description: Field-event, procedure-header context-comment and CompiledStatus rules for generated or edited Velox Maps.
classification: public
status: review-required
owner: Kevin Tobias
last_updated_by: Kevin Tobias
last_updated: "2026-11-19T21:20:24Z"
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

For meaningful field-event code, follow [concise native field-helper usage](../scripts/field-helpers.md): prefer `IsNullEmpty`/`NotNullEmpty` for matching NULL/trimmed-empty requirements, retain exact-NULL and zero checks when intended, and preserve nonblank output with `AsString` unless trimming is required. Do not create handlers or change business behaviour solely to shorten checks.

## Procedure-header context comments

For meaningful Map event scripts, put the owning destination context in a trailing comment on the native procedure-header line. Dataset/view events identify the actual destination dataset; field events identify the actual destination dataset and field.

Generic header fragments:

```pascal
procedure BeforeMapEvent(var Value: Variant);  //OUTPUT
```

```pascal
procedure OnMapEvent(var Value: Variant);  //OUTPUT.ADVISER_NAME
```

```pascal
procedure AfterMapEvent(var Value: Variant);  //OUTPUT.ADVISER_NAME
```

`OUTPUT` and `ADVISER_NAME` are illustrative destination names. Derive the real context from the owning destination Definition/view and field mapping. Do not use the friendly Map module name, source dataset/field name or source expression instead. The same AfterMap procedure shape is used in field and dataset contexts; its owning event determines whether the comment is dataset-only or dataset-plus-field.

### Other meaningful dataset/view events

Apply the dataset-level comment to other meaningful destination dataset/view events using their verified native signatures. The following header forms were checked against the existing [event contracts](../../CodeLibrary/ScriptingGuide/Events.md) and event reference pages; they were not independently reverified against product source for this update.

| Owning dataset/view event | Header fragment with destination context |
| --- | --- |
| BeforeMap | `procedure BeforeMapEvent(var Value: Variant);  //OUTPUT` |
| AfterMap (record/dataset) | `procedure AfterMapEvent(var Value: Variant);  //OUTPUT` |
| OnStartMap | `procedure OnStartMapEvent;  //OUTPUT` |
| LinkedData | `procedure LinkedDataEvent(var LinkedData: TdaQueryDataView);  //OUTPUT` |
| AfterDetailMap | `procedure AfterDetailMapEvent(var Value: Variant);  //OUTPUT` |
| OnEndMap | `procedure OnEndMapEvent;  //OUTPUT` |

These are header fragments, not instructions to create new handlers. A LinkedData script can select source data, but its header context still identifies its owning destination dataset. Verify the particular native event contract before documenting any additional event; do not copy a `var Value` parameter onto parameterless or differently parameterised events.

### Preserve comments and event behaviour

- Preserve existing comments and explanatory notes. When adapting a mapping or renaming a destination dataset/field, update its context comment to match the actual destination without discarding meaningful notes or retaining a misleading old context.
- Keep native procedure names, parameter names/types/modes, event bindings and meaningful event code unchanged. The comment identifies context; it does not choose or rebind an event.
- Do not create empty or dummy handlers solely to carry a context comment. Intentionally unmapped field events remain empty, their formula properties remain omitted and their field status remains `0`.
- When serialising a meaningful event in a CFG string list, include the context comment in its quoted procedure-header string, preserving the native string-list syntax.

### Why the context matters

1. It identifies the destination mapping being edited, including when the event is copied or inspected separately from the Map designer.
2. Velox error messages often include event source/header information, making an accurate context comment useful for diagnosis. Do not guarantee that every error identifies the exact failing event. The existing [field AfterMap reference](../../CodeLibrary/ScriptingGuide/Events/AfterMap_Field.md) records a case where an AfterMap failure can include OnMap source text instead.
3. Kevin Tobias confirmed that manual field mapping automatically populates these comments for field OnMap and AfterMap events. This is **user-confirmed native behaviour**, not independent product-source verification. The observed build was not specified; the convention for other dataset events is an authoring requirement, not a claim that their comments were all observed being generated automatically.

## Check before removing an event

Preserve a recoverable configuration copy. Check the destination Definition, required-field rules, defaults, automatic values, keys, links and all scripts that can affect the field, including field, record and view events. An intentional reset, requirement override or value override is meaningful logic; preserve it unless the requirement is explicitly changed. A field with meaningful validation or override logic is not intentionally unmapped merely because it has no direct source assignment.

Remove only redundant placeholders. Retain the field object and metadata, omit its field-level formula properties and set its status to `0` when intentionally unmapped. Record the decision and dependencies in the mapping documentation.

## Generic CFG examples

These fragments illustrate the convention, not complete importable or tested configurations. Retain the actual field identity and type metadata when applying them. Use generic examples in shared knowledge; do not copy customer data or configuration identifiers into this repository.

For the meaningful field example below, assume `CategoryText` belongs to destination dataset `OUTPUT`. Its header comment uses that destination context. The intentionally unmapped example has no handler/comment-bearing formula.

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
    'procedure OnMapEvent(var Value: Variant);  //OUTPUT.CategoryText'
    'begin'
    '  Value := ''Example'';'
    'end;')
  CompiledStatus = 1
end
```

## Validate the generated fields

1. Check every generated field against its documented intent: meaningful events use status `1`; intentionally unmapped fields use status `0` with no field-event formula.
2. Compare the CFG before and after editing. Confirm that identity/type metadata, meaningful scripts and record/view controls remain intact and unrelated object statuses were not changed.
   Check each meaningful event header against its actual destination dataset/field, preserve explanatory comments, and confirm that no event signature/binding changed or empty handler was introduced solely for a comment.
3. Inspect the Designer indicators in the target Velox build. User-confirmed Designer behaviour associates status `1` with a green mapping-event indicator and status `0` with the default blank/unmapped appearance. This observation is not a complete definition of compilation status values; the observed build was not specified.
4. Compile the actual scripts and run isolated representative mapping and persistence tests when a target Velox environment is available. Check required fields, defaults, automatic/key/link behaviour and saved destination values. Restore the preserved configuration if behaviour changes unexpectedly.
5. Report CFG inspection, actual Velox compilation and runtime/persistence testing separately, including checks that could not be performed. Setting `CompiledStatus = 1` in a file does not prove successful compilation or testing.

An empty event guarantees neither SQL `NULL` output nor preservation of stored values. Confirm the destination Definition, defaults, automatic/key/link behaviour, other scripts and destination save behaviour for the particular configuration. Treat these field rules as an authoring convention, not a source-verified runtime guarantee.

## Evidence and verification scope

The empty-event and status rules are supplied authoring standards. The green/blank indicator behaviour is user-confirmed, with no observed build specified. Direct product-source review of field script execution, event compilation, DataView field setup and destination SQL generation was not available for this change. No actual Velox compilation or runtime/persistence test was performed. Those checks remain necessary before claiming configuration-specific runtime results; this file remains `review-required`.

The procedure-header context convention and Kevin's confirmation of automatic field OnMap/AfterMap comments are user-supplied evidence. Other dataset-event signatures and the diagnostic caveat were checked against existing repository references. This update did not independently inspect product source, reproduce comment generation in Designer, compile the examples or modify a customer configuration.

