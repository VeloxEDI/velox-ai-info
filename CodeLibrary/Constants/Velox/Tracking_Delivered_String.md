---
title: Tracking_Delivered_String
description: Provides the canonical Delivered text paired with Tracking_Delivered for the Velox shipment-tracking state.
sidebar_position: 480
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - tracking
  - lifecycle-status
  - string-constant
---

```Delphi
Tracking_Delivered_String = 'Delivered'
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetTrackingStatusNum(Tracking_Delivered_String); // 1
end;
```

### Usage

`Tracking_Delivered_String` provides the canonical Delivered text paired with Tracking_Delivered for the Velox shipment-tracking state.

**Value**

| Property | Value |
|---|---|
| Script type | `String` |
| Text value | `Delivered` |
| Paired number | [`Tracking_Delivered`](./Tracking_Delivered.md) = `1` |
| Database domain | `Shipment_Tracking_Status.Num` |
| Data fields | `Shipment_Tracking.StatusNum` and `Shipment_Tracking_Event.StatusNum` |

### Additional Technical Info
`Tracking_Delivered_String` is the canonical script-visible `String` for the **Delivered** shipment-tracking state. Its exact value is `Delivered`, paired with [`Tracking_Delivered`](./Tracking_Delivered.md) value `1`.

It identifies a shipment tracking record and its event history. It does not load a row, validate a transition, persist a value or trigger delivery processing.

**Implementation**

Velox declares and registers the exact text `Delivered`. [`GetTrackingStatusNum`](../../Functions/Velox/GetTrackingStatusNum.md) compares text with Delphi `SameText` and returns `1` for this token; [`GetTrackingStatusCode`](../../Functions/Velox/GetTrackingStatusCode.md) performs the reverse mapping. The String name is not added to the Velox tag map.

Fresh-build SQL seeds only row `1=Delivered` in `Shipment_Tracking_Status`, although product source exposes `Updated=2` and `Cancelled=3`. Tracking and tracking-event `StatusNum` fields reference the tracking status table.

**Behaviour**

Use the token when a Velox API expects the Tracking status code rather than its number. Text-to-number conversion is case-insensitive, so variants such as `DELIVERED` are recognised, but the converter does not trim leading or trailing whitespace. Unsupported text returns `Null`.

Tracking lifecycle `StatusNum` is separate from the general issue/presentation `Status` column on tracking and event rows.

**Edge cases and quirks**

- Tracking and POD use the same three numbers and text, but have separate constants, converters and database tables.
- PascalScript integers and strings retain no lifecycle-domain type information after evaluation; using a value with the wrong converter or field can silently express another meaning.
- The text-to-number converter is case-insensitive but non-trimming. An empty string, surrounding whitespace or unsupported text returns `Null`.
- The number-to-text converter returns `Null` for a `Null` or unsupported number rather than selecting a default.
- `Tracking_Delivered_String` is not a tag-map entry. Use the numeric identifier's tag only when an integer expansion is required.
- Before persisting `Tracking_Updated` or `Tracking_Cancelled`, verify that the target deployment has corresponding status rows. Also note that the current `Shipment_Tracking_Event_Type` definition points its type/status foreign keys at the POD tables, not the tracking tables; these constants do not repair that schema mismatch.

**Side effects**

Reading `Tracking_Delivered_String`, comparing it or using the fixed converter has no I/O or state-changing side effect. Database writes, event creation and workflow transitions come from the caller.

**Errors**

Reading the constant does not raise an error. Converter misses return `Null`. A database write can still fail validation or a foreign-key constraint, particularly where the deployed Shipment_Tracking_Status rows do not include the script-visible value.

**Performance and concurrency**

This is an immutable compiled value. Access and the short fixed-case conversions are constant-time for practical purposes and carry no shared mutable lifecycle state.

**Remarks**

The example is source-reviewed and non-destructive. It performs only fixed in-process conversion; it does not test or change a live shipment.

**Related entries**

- [`Tracking_Delivered`](./Tracking_Delivered.md) is the paired numeric identifier.
- [`GetTrackingStatusCode`](../../Functions/Velox/GetTrackingStatusCode.md) converts a supported number to text.
- [`GetTrackingStatusNum`](../../Functions/Velox/GetTrackingStatusNum.md) converts recognised text to a number.

<small>Created 2026-07-15</small>
