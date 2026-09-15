---
title: "AfterMap (Field)"
description: The field-level AfterMap event that receives the earlier OnMap result for final transformation.
sidebar_position: 8
classification: public
status: approved
owner: Cam Hart
keywords:
  - velox
  - scripting
  - events
  - aftermap
  - fields
---

The field-level `AfterMapEvent` performs the final scripted transformation for one destination field. Its `Value` starts from the field value produced by normal mapping and the field's OnMap event; assigning it writes the final value back to that field.

## Syntax

```Delphi
procedure AfterMapEvent(var Value: Variant);
begin
  if not (VarIsNull(Value) or VarIsEmpty(Value) or VarIsClear(Value)) then
    Value := Trim(VarToStr(Value));
end;
```

The source-reviewed example safely trims a non-null, assigned value. Whether text conversion is appropriate depends on the destination field type.

## How it works

The view map first runs the OnMap pass across all fields. It then makes a separate AfterMap pass across all fields. For an eligible field, `RunFieldScripts(False)` reads `Field.Value` into a local Variant, calls the field map's AfterMap delegate and assigns the resulting Variant back to `Field.Value`.

The delegate is compiled lazily using the field map's Source, Dest and Global Script context. It has the same `procedure AfterMapEvent(var Value: Variant)` shape as record-level AfterMap, but it is owned by a `TvxFieldMap` and receives a field value rather than the record-control Boolean.

## Value and side effects

The input is the current destination field value after its OnMap logic. A change to `Value` is written to the field after the script returns. The field setter can perform type conversion, validation and dataset modification. A value unsuitable for the field type can fail during the assignment back even when the script itself completed.

## Errors

The entire read–execute–write sequence is inside a field-mapping exception handler. An exception is logged as an inability to map the named field and includes the field's OnMap script in the log context. This is a current diagnostic quirk: an AfterMap failure can be accompanied by the OnMap script text rather than the AfterMap source. The function returns the current log status, which can stop later fields.

## Performance and ordering

Each eligible field invokes its own event synchronously. All field OnMap scripts run before any field AfterMap scripts; this lets a field-level AfterMap read other destination fields after their initial mapping. Field AfterMap completes before the record-level AfterMap event and before detail views.

## Edge cases and quirks

- Do not use `Value` as a record-control Boolean here; it is the field's actual Variant value.
- Some key/linked field types use specialised mapping paths and may not execute the same scripted phases as ordinary fields.
- Assigning `Null`, an empty string or zero has different consequences based on field type, required state and downstream posting rules.
- The sidebar places field AfterMap last to distinguish it from record-level AfterMap, but its runtime call occurs earlier.
- Cancellation stops remaining field scripts.

## Related reference

- **AfterMap (Record)** — record-control event that follows the field pass.
- **Testing values** — Variant state checks before conversion.
- **Datasets** — field assignment and posting behaviour.
