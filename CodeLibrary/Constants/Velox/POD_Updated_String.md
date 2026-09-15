---
title: POD_Updated_String
description: Provides the canonical Updated text paired with POD_Updated for the Velox proof-of-delivery state.
sidebar_position: 430
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - pod
  - lifecycle-status
  - string-constant
---

```Delphi
POD_Updated_String = 'Updated'
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetPODStatusNum(POD_Updated_String); // 2
end;
```

### Usage

`POD_Updated_String` provides the canonical Updated text paired with POD_Updated for the Velox proof-of-delivery state.

**Value**

| Property | Value |
|---|---|
| Script type | `String` |
| Text value | `Updated` |
| Paired number | [`POD_Updated`](./POD_Updated.md) = `2` |
| Database domain | `Shipment_POD_Status.Num` |
| Data fields | `Shipment_POD.StatusNum` and `Shipment_POD_Event.StatusNum` |

### Additional Technical Info
`POD_Updated_String` is the canonical script-visible `String` for the **Updated** proof-of-delivery state. Its exact value is `Updated`, paired with [`POD_Updated`](./POD_Updated.md) value `2`.

It identifies a shipment POD record and its event history. It does not load a row, validate a transition, persist a value or trigger delivery processing.

**Implementation**

Velox declares and registers the exact text `Updated`. [`GetPODStatusNum`](../../Functions/Velox/GetPODStatusNum.md) compares text with Delphi `SameText` and returns `2` for this token; [`GetPODStatusCode`](../../Functions/Velox/GetPODStatusCode.md) performs the reverse mapping. The String name is not added to the Velox tag map.

Fresh-build SQL seeds only row `1=Delivered` in `Shipment_POD_Status`, although product source exposes `Updated=2` and `Cancelled=3`. `Shipment_POD.StatusNum` and `Shipment_POD_Event.StatusNum` reference that table. This page's value `2` is therefore recognised by product code but is not seeded by that fresh-build script.

**Behaviour**

Use the token when a Velox API expects the POD status code rather than its number. Text-to-number conversion is case-insensitive, so variants such as `UPDATED` are recognised, but the converter does not trim leading or trailing whitespace. Unsupported text returns `Null`.

POD lifecycle `StatusNum` is separate from the general issue/presentation `Status` column on POD and event rows.

**Edge cases and quirks**

- POD and tracking use the same three numbers and text, but have separate constants, converters and database tables.
- PascalScript integers and strings retain no lifecycle-domain type information after evaluation; using a value with the wrong converter or field can silently express another meaning.
- The text-to-number converter is case-insensitive but non-trimming. An empty string, surrounding whitespace or unsupported text returns `Null`.
- The number-to-text converter returns `Null` for a `Null` or unsupported number rather than selecting a default.
- `POD_Updated_String` is not a tag-map entry. Use the numeric identifier's tag only when an integer expansion is required.
- Before persisting `POD_Updated` or `POD_Cancelled`, verify that the target deployment has corresponding status rows. On an unextended fresh schema, the foreign key can reject values `2` and `3` even though the script converters recognise them.

**Side effects**

Reading `POD_Updated_String`, comparing it or using the fixed converter has no I/O or state-changing side effect. Database writes, event creation and workflow transitions come from the caller.

**Errors**

Reading the constant does not raise an error. Converter misses return `Null`. A database write can still fail validation or a foreign-key constraint, particularly where the deployed Shipment_POD_Status rows do not include the script-visible value.

**Performance and concurrency**

This is an immutable compiled value. Access and the short fixed-case conversions are constant-time for practical purposes and carry no shared mutable lifecycle state.

**Remarks**

The example is source-reviewed and non-destructive. It performs only fixed in-process conversion; it does not test or change a live shipment.

**Related entries**

- [`POD_Updated`](./POD_Updated.md) is the paired numeric identifier.
- [`GetPODStatusCode`](../../Functions/Velox/GetPODStatusCode.md) converts a supported number to text.
- [`GetPODStatusNum`](../../Functions/Velox/GetPODStatusNum.md) converts recognised text to a number.

<small>Created 2026-07-15</small>
