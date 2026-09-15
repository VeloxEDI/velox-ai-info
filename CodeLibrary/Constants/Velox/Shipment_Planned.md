---
title: Shipment_Planned
description: Identifies the Planned shipment lifecycle state as Shipment_Status.Num value 3 for Velox scripts and mappings.
sidebar_position: 441
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - shipment
  - lifecycle-status
  - constant
---

```Delphi
Shipment_Planned = 3
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetShipmentStatusCode(Shipment_Planned); // 'Planned'
end;
```

### Usage

`Shipment_Planned` identifies the Planned shipment lifecycle state as Shipment_Status.Num value 3 for Velox scripts and mappings.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `3` |
| Paired text | [`Shipment_Planned_String`](./Shipment_Planned_String.md) = `Planned` |
| Database domain | `Shipment_Status.Num` |
| Data fields | `Shipment_Manifest.StatusNum`, `Shipment_Hdr.StatusNum` and `Shipment_Event.StatusNum` |

### Additional Technical Info
`Shipment_Planned` is the script-visible `LongInt` identifier for the **Planned** shipment lifecycle state. Its fixed value is `3`, paired with [`Shipment_Planned_String`](./Shipment_Planned_String.md).

It identifies shipment manifests, shipment headers and their event history. It does not load a row, validate a transition, persist a value or trigger delivery processing.

**Implementation**

Velox declares and registers the fixed `LongInt` value `3`. [`GetShipmentStatusCode`](../../Functions/Velox/GetShipmentStatusCode.md) maps it to `Planned`; [`GetShipmentStatusNum`](../../Functions/Velox/GetShipmentStatusNum.md) performs the reverse mapping. The numeric name is registered in the Velox tag map, so `<!Shipment_Planned!>` expands to `3`.

Fresh-build SQL seeds all seven `Shipment_Status` rows with the same values and text as these constants. Manifest, header and shipment-event `StatusNum` fields reference that table.

**Behaviour**

Use the value only in the Shipment status domain. The fixed converters do not query VxData. Reading, comparing or expanding the constant does not assign a `StatusNum` field, change a lifecycle state or perform the action suggested by its name.

Shipment lifecycle `StatusNum` is separate from the general issue/presentation `Status` column used on shipment records and events.

**Edge cases and quirks**

- Shipment values overlap other lifecycle families; for example `1` means Draft here but Delivered for POD and tracking.
- PascalScript integers and strings retain no lifecycle-domain type information after evaluation; using a value with the wrong converter or field can silently express another meaning.
- The text-to-number converter is case-insensitive but non-trimming. An empty string, surrounding whitespace or unsupported text returns `Null`.
- The number-to-text converter returns `Null` for a `Null` or unsupported number rather than selecting a default.
- The tag expansion produces the number `3`, not the text `Planned`.
- `Shipment_Event_Type` separately configures event behaviour by manifest type and lifecycle status. Reading or assigning this constant does not select an event row or guarantee that any send or notification event is configured.

**Side effects**

Reading `Shipment_Planned`, comparing it, expanding its tag or using the fixed converter has no I/O or state-changing side effect. Database writes, event creation and workflow transitions come from the caller.

**Errors**

Reading the constant does not raise an error. Converter misses return `Null`. A database write can still fail validation or a foreign-key constraint, particularly where the deployed Shipment_Status rows do not include the script-visible value.

**Performance and concurrency**

This is an immutable compiled value. Access and the short fixed-case conversions are constant-time for practical purposes and carry no shared mutable lifecycle state.

**Remarks**

The example is source-reviewed and non-destructive. It performs only fixed in-process conversion; it does not test or change a live shipment.

**Related entries**

- [`Shipment_Planned_String`](./Shipment_Planned_String.md) is the paired canonical text.
- [`GetShipmentStatusCode`](../../Functions/Velox/GetShipmentStatusCode.md) converts a supported number to text.
- [`GetShipmentStatusNum`](../../Functions/Velox/GetShipmentStatusNum.md) converts recognised text to a number.

<small>Created 2026-07-15</small>
