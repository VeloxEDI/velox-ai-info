---
title: POD_Delivered_String
description: Provides the canonical Delivered text paired with POD_Delivered for the Velox proof-of-delivery state.
sidebar_position: 428
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
POD_Delivered_String = 'Delivered'
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetPODStatusNum(POD_Delivered_String); // 1
end;
```

### Usage

`POD_Delivered_String` provides the canonical Delivered text paired with POD_Delivered for the Velox proof-of-delivery state.

**Value**

| Property | Value |
|---|---|
| Script type | `String` |
| Text value | `Delivered` |
| Paired number | [`POD_Delivered`](./POD_Delivered.md) = `1` |
| Database domain | `Shipment_POD_Status.Num` |
| Data fields | `Shipment_POD.StatusNum` and `Shipment_POD_Event.StatusNum` |

### Additional Technical Info
`POD_Delivered_String` is the canonical script-visible `String` for the **Delivered** proof-of-delivery state. Its exact value is `Delivered`, paired with [`POD_Delivered`](./POD_Delivered.md) value `1`.

It identifies a shipment POD record and its event history. It does not load a row, validate a transition, persist a value or trigger delivery processing.

**Implementation**

Velox declares and registers the exact text `Delivered`. [`GetPODStatusNum`](../../Functions/Velox/GetPODStatusNum.md) compares text with Delphi `SameText` and returns `1` for this token; [`GetPODStatusCode`](../../Functions/Velox/GetPODStatusCode.md) performs the reverse mapping. The String name is not added to the Velox tag map.

Fresh-build SQL seeds only row `1=Delivered` in `Shipment_POD_Status`, although product source exposes `Updated=2` and `Cancelled=3`. `Shipment_POD.StatusNum` and `Shipment_POD_Event.StatusNum` reference that table.

**Behaviour**

Use the token when a Velox API expects the POD status code rather than its number. Text-to-number conversion is case-insensitive, so variants such as `DELIVERED` are recognised, but the converter does not trim leading or trailing whitespace. Unsupported text returns `Null`.

POD lifecycle `StatusNum` is separate from the general issue/presentation `Status` column on POD and event rows.

**Edge cases and quirks**

- POD and tracking use the same three numbers and text, but have separate constants, converters and database tables.
- PascalScript integers and strings retain no lifecycle-domain type information after evaluation; using a value with the wrong converter or field can silently express another meaning.
- The text-to-number converter is case-insensitive but non-trimming. An empty string, surrounding whitespace or unsupported text returns `Null`.
- The number-to-text converter returns `Null` for a `Null` or unsupported number rather than selecting a default.
- `POD_Delivered_String` is not a tag-map entry. Use the numeric identifier's tag only when an integer expansion is required.
- Before persisting `POD_Updated` or `POD_Cancelled`, verify that the target deployment has corresponding status rows. On an unextended fresh schema, the foreign key can reject values `2` and `3` even though the script converters recognise them.

**Side effects**

Reading `POD_Delivered_String`, comparing it or using the fixed converter has no I/O or state-changing side effect. Database writes, event creation and workflow transitions come from the caller.

**Errors**

Reading the constant does not raise an error. Converter misses return `Null`. A database write can still fail validation or a foreign-key constraint, particularly where the deployed Shipment_POD_Status rows do not include the script-visible value.

**Performance and concurrency**

This is an immutable compiled value. Access and the short fixed-case conversions are constant-time for practical purposes and carry no shared mutable lifecycle state.

**Remarks**

The example is source-reviewed and non-destructive. It performs only fixed in-process conversion; it does not test or change a live shipment.

**Related entries**

- [`POD_Delivered`](./POD_Delivered.md) is the paired numeric identifier.
- [`GetPODStatusCode`](../../Functions/Velox/GetPODStatusCode.md) converts a supported number to text.
- [`GetPODStatusNum`](../../Functions/Velox/GetPODStatusNum.md) converts recognised text to a number.

<small>Created 2026-07-15</small>
