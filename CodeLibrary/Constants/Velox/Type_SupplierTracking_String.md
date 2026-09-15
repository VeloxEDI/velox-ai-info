---
title: Type_SupplierTracking_String
description: Provides the exact SupplierTracking text paired with Type_SupplierTracking for the Velox tracking type domain.
sidebar_position: 550
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, tracking, supplier, string-constant]
---

```Delphi
Type_SupplierTracking_String = 'SupplierTracking'
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetTrackingTypeNum(Type_SupplierTracking_String); // 2
end;
```

### Usage

`Type_SupplierTracking_String` provides the exact SupplierTracking text paired with Type_SupplierTracking for the Velox tracking type domain.

**Value**

| Property | Value |
|---|---|
| Script type | `String` |
| Text value | `'SupplierTracking'` |
| Paired number | [`Type_SupplierTracking`](./Type_SupplierTracking.md) = `2` |
| Direction label | `Supplier` |
| Database type table | `Shipment_Tracking_Type` |
| Record field | `Shipment_Tracking.TypeNum` |
| Tag-map entry | No |

### Additional Technical Info
`Type_SupplierTracking_String` is the canonical text for the **SupplierTracking** member of the Velox tracking-type vocabulary. Its fixed `String` value is `'SupplierTracking'`, paired with [`Type_SupplierTracking`](./Type_SupplierTracking.md).

It selects an artifact-direction type. It does not create, load, validate, send, receive or change the state of a shipment, POD or tracking record.

**Implementation**

Velox declares and registers exact text `SupplierTracking`. [`GetTrackingTypeNum`](../../Functions/Velox/GetTrackingTypeNum.md) compares it with Delphi `SameText` and returns `2`; [`GetTrackingTypeCode`](../../Functions/Velox/GetTrackingTypeCode.md) performs the reverse mapping. The String identifier is not in the Velox tag map.

The tracking converter is independent from the other two artifact-type converters even though all three families use customer value 1 and supplier value 2. Use [`GetTrackingTypeNum`](../../Functions/Velox/GetTrackingTypeNum.md) and [`GetTrackingTypeCode`](../../Functions/Velox/GetTrackingTypeCode.md) only for this family.

**Database alignment**

Fresh-build VxData seeds row `2` as `SupplierTracking` in `Shipment_Tracking_Type`, and nullable `Shipment_Tracking.TypeNum` references that table. Required `Shipment_Tracking_Event_Type.TypeNum` is intended to select type/status event behaviour, but its current foreign key points to `Shipment_POD_Type`; its status foreign key likewise points to `Shipment_POD_Status`.

The type-table code is exact `SupplierTracking` and the description is human-spaced. Code, number and display description are separate representations; persist the numeric key where `TypeNum` is expected.

**Behaviour**

Text-to-number conversion uses `SameText`, so case differences are accepted, but whitespace is not trimmed: `suppliertracking` is recognised and ` SupplierTracking ` is not. Unsupported text returns `Null`. Number-to-text conversion returns `Null` for `Null` or an unsupported number.

The value has meaning only in its tracking-type domain. The same integer in the other shipment artifact families, party roles, lifecycle statuses or transaction types is not a typed substitute.

**Edge cases and quirks**

- `SupplierTracking` classifies a tracking artifact; it does not prove an event occurred, derive a location/ETA or emit a tracking notification.
- Tracking lifecycle `StatusNum` is separate from artifact `TypeNum` and from the general processing `Status` field.
- Current fresh-build tracking event routing has wrong-domain type/status foreign keys to POD tables. Seeded type values align, but callers must not treat that as schema correctness.
- Customer/supplier is a Velox artifact-direction label, not proof of sender, recipient, bill-from/bill-to roles, ownership or transport direction.
- Numeric PascalScript constants do not retain a domain type after evaluation; validate the target field/table contract before assignment.
- Text conversion is case-insensitive and non-trimming; String constants themselves remain exact compiled text.
- A nullable record `TypeNum` may contain `Null` even though the seed vocabulary defines this value.
- Selecting a type does not select a lifecycle status or trigger an event-routing row.

**Side effects**

Reading or comparing `Type_SupplierTracking_String` has no database, file, network or shared-state side effect. Its converters are fixed in-memory mappings.

**Errors**

Reading the constant does not raise an error. Converter misses return `Null`; inputs outside the documented String/number contract can still encounter normal PascalScript Variant conversion behaviour. Persisting a value absent from the target type table can fail a database foreign key.

**Performance and concurrency**

This is immutable compiled metadata. Constant access and its two-branch converters are constant-time for practical purposes and do not carry mutable shipment state.

**Remarks**

Use the constant to make configuration intent explicit, then validate the surrounding dataset, direction, parties, lifecycle status and event configuration independently. The example is source-reviewed and non-destructive.

**Related entries**

- [`Type_SupplierTracking`](./Type_SupplierTracking.md) is the paired numeric identifier.
- [`GetTrackingTypeNum`](../../Functions/Velox/GetTrackingTypeNum.md) converts supported tracking text to a number.
- [`GetTrackingTypeCode`](../../Functions/Velox/GetTrackingTypeCode.md) converts a supported tracking number to text.
- [`Tracking_Delivered`](./Tracking_Delivered.md), [`Tracking_Updated`](./Tracking_Updated.md) and [`Tracking_Cancelled`](./Tracking_Cancelled.md) are separate tracking lifecycle values.

<small>Created 2026-07-15</small>
