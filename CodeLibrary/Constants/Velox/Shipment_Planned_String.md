---
title: Shipment_Planned_String
description: Provides the canonical Planned text paired with Shipment_Planned for the Velox shipment lifecycle state.
sidebar_position: 442
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - shipment
  - lifecycle-status
  - string-constant
---

```Delphi
Shipment_Planned_String = 'Planned'
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetShipmentStatusNum(Shipment_Planned_String); // 3
end;
```

### Usage

`Shipment_Planned_String` provides the canonical Planned text paired with Shipment_Planned for the Velox shipment lifecycle state.

**Value**

| Property | Value |
|---|---|
| Script type | `String` |
| Text value | `Planned` |
| Paired number | [`Shipment_Planned`](./Shipment_Planned.md) = `3` |
| Database domain | `Shipment_Status.Num` |
| Data fields | `Shipment_Manifest.StatusNum`, `Shipment_Hdr.StatusNum` and `Shipment_Event.StatusNum` |

### Additional Technical Info
`Shipment_Planned_String` is the canonical script-visible `String` for the **Planned** shipment lifecycle state. Its exact value is `Planned`, paired with [`Shipment_Planned`](./Shipment_Planned.md) value `3`.

It identifies shipment manifests, shipment headers and their event history. It does not load a row, validate a transition, persist a value or trigger delivery processing.

**Implementation**

Velox declares and registers the exact text `Planned`. [`GetShipmentStatusNum`](../../Functions/Velox/GetShipmentStatusNum.md) compares text with Delphi `SameText` and returns `3` for this token; [`GetShipmentStatusCode`](../../Functions/Velox/GetShipmentStatusCode.md) performs the reverse mapping. The String name is not added to the Velox tag map.

Fresh-build SQL seeds all seven `Shipment_Status` rows with the same values and text as these constants. Manifest, header and shipment-event `StatusNum` fields reference that table.

**Behaviour**

Use the token when a Velox API expects the Shipment status code rather than its number. Text-to-number conversion is case-insensitive, so variants such as `PLANNED` are recognised, but the converter does not trim leading or trailing whitespace. Unsupported text returns `Null`.

Shipment lifecycle `StatusNum` is separate from the general issue/presentation `Status` column used on shipment records and events.

**Edge cases and quirks**

- Shipment values overlap other lifecycle families; for example `1` means Draft here but Delivered for POD and tracking.
- PascalScript integers and strings retain no lifecycle-domain type information after evaluation; using a value with the wrong converter or field can silently express another meaning.
- The text-to-number converter is case-insensitive but non-trimming. An empty string, surrounding whitespace or unsupported text returns `Null`.
- The number-to-text converter returns `Null` for a `Null` or unsupported number rather than selecting a default.
- `Shipment_Planned_String` is not a tag-map entry. Use the numeric identifier's tag only when an integer expansion is required.
- `Shipment_Event_Type` separately configures event behaviour by manifest type and lifecycle status. Reading or assigning this constant does not select an event row or guarantee that any send or notification event is configured.

**Side effects**

Reading `Shipment_Planned_String`, comparing it or using the fixed converter has no I/O or state-changing side effect. Database writes, event creation and workflow transitions come from the caller.

**Errors**

Reading the constant does not raise an error. Converter misses return `Null`. A database write can still fail validation or a foreign-key constraint, particularly where the deployed Shipment_Status rows do not include the script-visible value.

**Performance and concurrency**

This is an immutable compiled value. Access and the short fixed-case conversions are constant-time for practical purposes and carry no shared mutable lifecycle state.

**Remarks**

The example is source-reviewed and non-destructive. It performs only fixed in-process conversion; it does not test or change a live shipment.

**Related entries**

- [`Shipment_Planned`](./Shipment_Planned.md) is the paired numeric identifier.
- [`GetShipmentStatusCode`](../../Functions/Velox/GetShipmentStatusCode.md) converts a supported number to text.
- [`GetShipmentStatusNum`](../../Functions/Velox/GetShipmentStatusNum.md) converts recognised text to a number.

<small>Created 2026-07-15</small>
