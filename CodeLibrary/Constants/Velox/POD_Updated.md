---
title: POD_Updated
description: Identifies the Updated proof-of-delivery state as Shipment_POD_Status.Num value 2 for Velox scripts and mappings.
sidebar_position: 429
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - pod
  - lifecycle-status
  - constant
---

```Delphi
POD_Updated = 2
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetPODStatusCode(POD_Updated); // 'Updated'
end;
```

### Usage

`POD_Updated` identifies the Updated proof-of-delivery state as Shipment_POD_Status.Num value 2 for Velox scripts and mappings.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `2` |
| Paired text | [`POD_Updated_String`](./POD_Updated_String.md) = `Updated` |
| Database domain | `Shipment_POD_Status.Num` |
| Data fields | `Shipment_POD.StatusNum` and `Shipment_POD_Event.StatusNum` |

### Additional Technical Info
`POD_Updated` is the script-visible `LongInt` identifier for the **Updated** proof-of-delivery state. Its fixed value is `2`, paired with [`POD_Updated_String`](./POD_Updated_String.md).

It identifies a shipment POD record and its event history. It does not load a row, validate a transition, persist a value or trigger delivery processing.

**Implementation**

Velox declares and registers the fixed `LongInt` value `2`. [`GetPODStatusCode`](../../Functions/Velox/GetPODStatusCode.md) maps it to `Updated`; [`GetPODStatusNum`](../../Functions/Velox/GetPODStatusNum.md) performs the reverse mapping. The numeric name is registered in the Velox tag map, so `<!POD_Updated!>` expands to `2`.

Fresh-build SQL seeds only row `1=Delivered` in `Shipment_POD_Status`, although product source exposes `Updated=2` and `Cancelled=3`. `Shipment_POD.StatusNum` and `Shipment_POD_Event.StatusNum` reference that table. This page's value `2` is therefore recognised by product code but is not seeded by that fresh-build script.

**Behaviour**

Use the value only in the POD status domain. The fixed converters do not query VxData. Reading, comparing or expanding the constant does not assign a `StatusNum` field, change a lifecycle state or perform the action suggested by its name.

POD lifecycle `StatusNum` is separate from the general issue/presentation `Status` column on POD and event rows.

**Edge cases and quirks**

- POD and tracking use the same three numbers and text, but have separate constants, converters and database tables.
- PascalScript integers and strings retain no lifecycle-domain type information after evaluation; using a value with the wrong converter or field can silently express another meaning.
- The text-to-number converter is case-insensitive but non-trimming. An empty string, surrounding whitespace or unsupported text returns `Null`.
- The number-to-text converter returns `Null` for a `Null` or unsupported number rather than selecting a default.
- The tag expansion produces the number `2`, not the text `Updated`.
- Before persisting `POD_Updated` or `POD_Cancelled`, verify that the target deployment has corresponding status rows. On an unextended fresh schema, the foreign key can reject values `2` and `3` even though the script converters recognise them.

**Side effects**

Reading `POD_Updated`, comparing it, expanding its tag or using the fixed converter has no I/O or state-changing side effect. Database writes, event creation and workflow transitions come from the caller.

**Errors**

Reading the constant does not raise an error. Converter misses return `Null`. A database write can still fail validation or a foreign-key constraint, particularly where the deployed Shipment_POD_Status rows do not include the script-visible value.

**Performance and concurrency**

This is an immutable compiled value. Access and the short fixed-case conversions are constant-time for practical purposes and carry no shared mutable lifecycle state.

**Remarks**

The example is source-reviewed and non-destructive. It performs only fixed in-process conversion; it does not test or change a live shipment.

**Related entries**

- [`POD_Updated_String`](./POD_Updated_String.md) is the paired canonical text.
- [`GetPODStatusCode`](../../Functions/Velox/GetPODStatusCode.md) converts a supported number to text.
- [`GetPODStatusNum`](../../Functions/Velox/GetPODStatusNum.md) converts recognised text to a number.

<small>Created 2026-07-15</small>
