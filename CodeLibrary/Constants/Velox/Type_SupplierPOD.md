---
title: Type_SupplierPOD
description: Identifies Velox SupplierPOD proof-of-delivery type 2 for scripts, tags and VxData records.
sidebar_position: 543
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, proof-of-delivery, supplier]
---

```Delphi
Type_SupplierPOD = 2
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetPODTypeCode(Type_SupplierPOD); // 'SupplierPOD'
end;
```

### Usage

`Type_SupplierPOD` identifies Velox SupplierPOD proof-of-delivery type 2 for scripts, tags and VxData records.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `2` |
| Paired text | [`Type_SupplierPOD_String`](./Type_SupplierPOD_String.md) = `SupplierPOD` |
| Direction label | `Supplier` |
| Database type table | `Shipment_POD_Type` |
| Record field | `Shipment_POD.TypeNum` |
| Tag-map entry | Yes: `<!Type_SupplierPOD!>` expands to `2` |

### Additional Technical Info
`Type_SupplierPOD` is the canonical numeric identifier for the **SupplierPOD** member of the Velox POD-type vocabulary. Its fixed `LongInt` value is `2`, paired with [`Type_SupplierPOD_String`](./Type_SupplierPOD_String.md).

It selects an artifact-direction type. It does not create, load, validate, send, receive or change the state of a shipment, POD or tracking record.

**Implementation**

Velox declares and registers fixed value `2`. [`GetPODTypeCode`](../../Functions/Velox/GetPODTypeCode.md) maps it to `SupplierPOD`; [`GetPODTypeNum`](../../Functions/Velox/GetPODTypeNum.md) performs the reverse mapping. The numeric name is in the Velox tag map, so `<!Type_SupplierPOD!>` expands to `2`.

The POD converter is independent from the other two artifact-type converters even though all three families use customer value 1 and supplier value 2. Use [`GetPODTypeNum`](../../Functions/Velox/GetPODTypeNum.md) and [`GetPODTypeCode`](../../Functions/Velox/GetPODTypeCode.md) only for this family.

**Database alignment**

Fresh-build VxData seeds row `2` as `SupplierPOD` in `Shipment_POD_Type`, and nullable `Shipment_POD.TypeNum` references that table. Required `Shipment_POD_Event_Type.TypeNum` references the POD-type table and combines the type with `Shipment_POD_Status` for event behaviour.

The type-table code is exact `SupplierPOD` and the description is human-spaced. Code, number and display description are separate representations; persist the numeric key where `TypeNum` is expected.

**Behaviour**

Text-to-number conversion uses `SameText`, so case differences are accepted, but whitespace is not trimmed: `supplierpod` is recognised and ` SupplierPOD ` is not. Unsupported text returns `Null`. Number-to-text conversion returns `Null` for `Null` or an unsupported number.

The value has meaning only in its POD-type domain. The same integer in the other shipment artifact families, party roles, lifecycle statuses or transaction types is not a typed substitute.

**Edge cases and quirks**

- POD means proof of delivery in this vocabulary, but selecting `SupplierPOD` does not prove delivery, validate a signature/image/PDF or establish evidential authenticity.
- POD lifecycle `StatusNum` is a separate domain from this artifact `TypeNum` and from the general processing `Status` field.
- Customer/supplier is a Velox artifact-direction label, not proof of sender, recipient, bill-from/bill-to roles, ownership or transport direction.
- Numeric PascalScript constants do not retain a domain type after evaluation; validate the target field/table contract before assignment.
- Text conversion is case-insensitive and non-trimming; String constants themselves remain exact compiled text.
- A nullable record `TypeNum` may contain `Null` even though the seed vocabulary defines this value.
- Selecting a type does not select a lifecycle status or trigger an event-routing row.

**Side effects**

Reading, comparing or tag-expanding `Type_SupplierPOD` has no database, file, network or shared-state side effect. Its converters are fixed in-memory mappings.

**Errors**

Reading the constant does not raise an error. Converter misses return `Null`; inputs outside the documented String/number contract can still encounter normal PascalScript Variant conversion behaviour. Persisting a value absent from the target type table can fail a database foreign key.

**Performance and concurrency**

This is immutable compiled metadata. Constant access and its two-branch converters are constant-time for practical purposes and do not carry mutable shipment state.

**Remarks**

Use the constant to make configuration intent explicit, then validate the surrounding dataset, direction, parties, lifecycle status and event configuration independently. The example is source-reviewed and non-destructive.

**Related entries**

- [`Type_SupplierPOD_String`](./Type_SupplierPOD_String.md) is the paired canonical text.
- [`GetPODTypeNum`](../../Functions/Velox/GetPODTypeNum.md) converts supported POD text to a number.
- [`GetPODTypeCode`](../../Functions/Velox/GetPODTypeCode.md) converts a supported POD number to text.
- [`POD_Delivered`](./POD_Delivered.md), [`POD_Updated`](./POD_Updated.md) and [`POD_Cancelled`](./POD_Cancelled.md) are separate POD lifecycle values.

<small>Created 2026-07-15</small>
