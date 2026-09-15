---
title: Type_CustomerShipment
description: Identifies Velox CustomerShipment shipment-manifest type 1 for scripts, tags and VxData records.
sidebar_position: 505
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, shipment-manifest, customer]
---

```Delphi
Type_CustomerShipment = 1
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetShipmentManifestTypeCode(Type_CustomerShipment); // 'CustomerShipment'
end;
```

### Usage

`Type_CustomerShipment` identifies Velox CustomerShipment shipment-manifest type 1 for scripts, tags and VxData records.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `1` |
| Paired text | [`Type_CustomerShipment_String`](./Type_CustomerShipment_String.md) = `CustomerShipment` |
| Direction label | `Customer` |
| Database type table | `Shipment_Manifest_Type` |
| Record field | `Shipment_Manifest.TypeNum` |
| Tag-map entry | Yes: `<!Type_CustomerShipment!>` expands to `1` |

### Additional Technical Info
`Type_CustomerShipment` is the canonical numeric identifier for the **CustomerShipment** member of the Velox shipment manifest-type vocabulary. Its fixed `LongInt` value is `1`, paired with [`Type_CustomerShipment_String`](./Type_CustomerShipment_String.md).

It selects an artifact-direction type. It does not create, load, validate, send, receive or change the state of a shipment, POD or tracking record.

**Implementation**

Velox declares and registers fixed value `1`. [`GetShipmentManifestTypeCode`](../../Functions/Velox/GetShipmentManifestTypeCode.md) maps it to `CustomerShipment`; [`GetShipmentManifestTypeNum`](../../Functions/Velox/GetShipmentManifestTypeNum.md) performs the reverse mapping. The numeric name is in the Velox tag map, so `<!Type_CustomerShipment!>` expands to `1`.

The shipment manifest converter is independent from the other two artifact-type converters even though all three families use customer value 1 and supplier value 2. Use [`GetShipmentManifestTypeNum`](../../Functions/Velox/GetShipmentManifestTypeNum.md) and [`GetShipmentManifestTypeCode`](../../Functions/Velox/GetShipmentManifestTypeCode.md) only for this family.

**Database alignment**

Fresh-build VxData seeds row `1` as `CustomerShipment` in `Shipment_Manifest_Type`, and nullable `Shipment_Manifest.TypeNum` references that table. Required `Shipment_Event_Type.TypeNum` references the manifest-type table and combines the type with `Shipment_Status` for event behaviour.

The type-table code is exact `CustomerShipment` and the description is human-spaced. Code, number and display description are separate representations; persist the numeric key where `TypeNum` is expected.

**Behaviour**

Text-to-number conversion uses `SameText`, so case differences are accepted, but whitespace is not trimmed: `customershipment` is recognised and ` CustomerShipment ` is not. Unsupported text returns `Null`. Number-to-text conversion returns `Null` for `Null` or an unsupported number.

The value has meaning only in its shipment manifest-type domain. The same integer in the other shipment artifact families, party roles, lifecycle statuses or transaction types is not a typed substitute.

**Edge cases and quirks**

- The converter names this the shipment-*manifest* type. It is not `Shipment_Hdr.TypeNum`, which references the separate application-defined `Shipment_Type` table.
- `CustomerShipment` classifies the manifest/artifact direction; it does not book, plan, collect, deliver or cancel a shipment.
- Customer/supplier is a Velox artifact-direction label, not proof of sender, recipient, bill-from/bill-to roles, ownership or transport direction.
- Numeric PascalScript constants do not retain a domain type after evaluation; validate the target field/table contract before assignment.
- Text conversion is case-insensitive and non-trimming; String constants themselves remain exact compiled text.
- A nullable record `TypeNum` may contain `Null` even though the seed vocabulary defines this value.
- Selecting a type does not select a lifecycle status or trigger an event-routing row.

**Side effects**

Reading, comparing or tag-expanding `Type_CustomerShipment` has no database, file, network or shared-state side effect. Its converters are fixed in-memory mappings.

**Errors**

Reading the constant does not raise an error. Converter misses return `Null`; inputs outside the documented String/number contract can still encounter normal PascalScript Variant conversion behaviour. Persisting a value absent from the target type table can fail a database foreign key.

**Performance and concurrency**

This is immutable compiled metadata. Constant access and its two-branch converters are constant-time for practical purposes and do not carry mutable shipment state.

**Remarks**

Use the constant to make configuration intent explicit, then validate the surrounding dataset, direction, parties, lifecycle status and event configuration independently. The example is source-reviewed and non-destructive.

**Related entries**

- [`Type_CustomerShipment_String`](./Type_CustomerShipment_String.md) is the paired canonical text.
- [`GetShipmentManifestTypeNum`](../../Functions/Velox/GetShipmentManifestTypeNum.md) converts supported shipment manifest text to a number.
- [`GetShipmentManifestTypeCode`](../../Functions/Velox/GetShipmentManifestTypeCode.md) converts a supported shipment manifest number to text.
- [`Shipment_Draft`](./Shipment_Draft.md) through [`Shipment_Cancelled`](./Shipment_Cancelled.md) are separate shipment lifecycle values.

<small>Created 2026-07-15</small>
