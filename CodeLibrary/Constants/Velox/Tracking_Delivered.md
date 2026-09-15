---
title: Tracking_Delivered
description: Identifies the Delivered shipment-tracking state as Shipment_Tracking_Status.Num value 1 for Velox scripts and mappings.
sidebar_position: 479
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - tracking
  - lifecycle-status
  - constant
---

```Delphi
Tracking_Delivered = 1
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetTrackingStatusCode(Tracking_Delivered); // 'Delivered'
end;
```

### Usage

`Tracking_Delivered` identifies the Delivered shipment-tracking state as Shipment_Tracking_Status.Num value 1 for Velox scripts and mappings.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `1` |
| Paired text | [`Tracking_Delivered_String`](./Tracking_Delivered_String.md) = `Delivered` |
| Database domain | `Shipment_Tracking_Status.Num` |
| Data fields | `Shipment_Tracking.StatusNum` and `Shipment_Tracking_Event.StatusNum` |

### Additional Technical Info
`Tracking_Delivered` is the script-visible `LongInt` identifier for the **Delivered** shipment-tracking state. Its fixed value is `1`, paired with [`Tracking_Delivered_String`](./Tracking_Delivered_String.md).

It identifies a shipment tracking record and its event history. It does not load a row, validate a transition, persist a value or trigger delivery processing.

**Implementation**

Velox declares and registers the fixed `LongInt` value `1`. [`GetTrackingStatusCode`](../../Functions/Velox/GetTrackingStatusCode.md) maps it to `Delivered`; [`GetTrackingStatusNum`](../../Functions/Velox/GetTrackingStatusNum.md) performs the reverse mapping. The numeric name is registered in the Velox tag map, so `<!Tracking_Delivered!>` expands to `1`.

Fresh-build SQL seeds only row `1=Delivered` in `Shipment_Tracking_Status`, although product source exposes `Updated=2` and `Cancelled=3`. Tracking and tracking-event `StatusNum` fields reference the tracking status table.

**Behaviour**

Use the value only in the Tracking status domain. The fixed converters do not query VxData. Reading, comparing or expanding the constant does not assign a `StatusNum` field, change a lifecycle state or perform the action suggested by its name.

Tracking lifecycle `StatusNum` is separate from the general issue/presentation `Status` column on tracking and event rows.

**Edge cases and quirks**

- Tracking and POD use the same three numbers and text, but have separate constants, converters and database tables.
- PascalScript integers and strings retain no lifecycle-domain type information after evaluation; using a value with the wrong converter or field can silently express another meaning.
- The text-to-number converter is case-insensitive but non-trimming. An empty string, surrounding whitespace or unsupported text returns `Null`.
- The number-to-text converter returns `Null` for a `Null` or unsupported number rather than selecting a default.
- The tag expansion produces the number `1`, not the text `Delivered`.
- Before persisting `Tracking_Updated` or `Tracking_Cancelled`, verify that the target deployment has corresponding status rows. Also note that the current `Shipment_Tracking_Event_Type` definition points its type/status foreign keys at the POD tables, not the tracking tables; these constants do not repair that schema mismatch.

**Side effects**

Reading `Tracking_Delivered`, comparing it, expanding its tag or using the fixed converter has no I/O or state-changing side effect. Database writes, event creation and workflow transitions come from the caller.

**Errors**

Reading the constant does not raise an error. Converter misses return `Null`. A database write can still fail validation or a foreign-key constraint, particularly where the deployed Shipment_Tracking_Status rows do not include the script-visible value.

**Performance and concurrency**

This is an immutable compiled value. Access and the short fixed-case conversions are constant-time for practical purposes and carry no shared mutable lifecycle state.

**Remarks**

The example is source-reviewed and non-destructive. It performs only fixed in-process conversion; it does not test or change a live shipment.

**Related entries**

- [`Tracking_Delivered_String`](./Tracking_Delivered_String.md) is the paired canonical text.
- [`GetTrackingStatusCode`](../../Functions/Velox/GetTrackingStatusCode.md) converts a supported number to text.
- [`GetTrackingStatusNum`](../../Functions/Velox/GetTrackingStatusNum.md) converts recognised text to a number.

<small>Created 2026-07-15</small>
