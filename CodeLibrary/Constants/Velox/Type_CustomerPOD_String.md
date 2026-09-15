---
title: Type_CustomerPOD_String
description: Provides the exact CustomerPOD text paired with Type_CustomerPOD for the Velox proof-of-delivery type domain.
sidebar_position: 502
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, proof-of-delivery, customer, string-constant]
---

```Delphi
Type_CustomerPOD_String = 'CustomerPOD'
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetPODTypeNum(Type_CustomerPOD_String); // 1
end;
```

### Usage

`Type_CustomerPOD_String` provides the exact CustomerPOD text paired with Type_CustomerPOD for the Velox proof-of-delivery type domain.

**Value**

| Property | Value |
|---|---|
| Script type | `String` |
| Text value | `'CustomerPOD'` |
| Paired number | [`Type_CustomerPOD`](./Type_CustomerPOD.md) = `1` |
| Direction label | `Customer` |
| Database type table | `Shipment_POD_Type` |
| Record field | `Shipment_POD.TypeNum` |
| Tag-map entry | No |

### Additional Technical Info
`Type_CustomerPOD_String` is the canonical text for the **CustomerPOD** member of the Velox POD-type vocabulary. Its fixed `String` value is `'CustomerPOD'`, paired with [`Type_CustomerPOD`](./Type_CustomerPOD.md).

It selects an artifact-direction type. It does not create, load, validate, send, receive or change the state of a shipment, POD or tracking record.

**Implementation**

Velox declares and registers exact text `CustomerPOD`. [`GetPODTypeNum`](../../Functions/Velox/GetPODTypeNum.md) compares it with Delphi `SameText` and returns `1`; [`GetPODTypeCode`](../../Functions/Velox/GetPODTypeCode.md) performs the reverse mapping. The String identifier is not in the Velox tag map.

The POD converter is independent from the other two artifact-type converters even though all three families use customer value 1 and supplier value 2. Use [`GetPODTypeNum`](../../Functions/Velox/GetPODTypeNum.md) and [`GetPODTypeCode`](../../Functions/Velox/GetPODTypeCode.md) only for this family.

**Database alignment**

Fresh-build VxData seeds row `1` as `CustomerPOD` in `Shipment_POD_Type`, and nullable `Shipment_POD.TypeNum` references that table. Required `Shipment_POD_Event_Type.TypeNum` references the POD-type table and combines the type with `Shipment_POD_Status` for event behaviour.

The type-table code is exact `CustomerPOD` and the description is human-spaced. Code, number and display description are separate representations; persist the numeric key where `TypeNum` is expected.

**Behaviour**

Text-to-number conversion uses `SameText`, so case differences are accepted, but whitespace is not trimmed: `customerpod` is recognised and ` CustomerPOD ` is not. Unsupported text returns `Null`. Number-to-text conversion returns `Null` for `Null` or an unsupported number.

The value has meaning only in its POD-type domain. The same integer in the other shipment artifact families, party roles, lifecycle statuses or transaction types is not a typed substitute.

**Edge cases and quirks**

- POD means proof of delivery in this vocabulary, but selecting `CustomerPOD` does not prove delivery, validate a signature/image/PDF or establish evidential authenticity.
- POD lifecycle `StatusNum` is a separate domain from this artifact `TypeNum` and from the general processing `Status` field.
- Customer/supplier is a Velox artifact-direction label, not proof of sender, recipient, bill-from/bill-to roles, ownership or transport direction.
- Numeric PascalScript constants do not retain a domain type after evaluation; validate the target field/table contract before assignment.
- Text conversion is case-insensitive and non-trimming; String constants themselves remain exact compiled text.
- A nullable record `TypeNum` may contain `Null` even though the seed vocabulary defines this value.
- Selecting a type does not select a lifecycle status or trigger an event-routing row.

**Side effects**

Reading or comparing `Type_CustomerPOD_String` has no database, file, network or shared-state side effect. Its converters are fixed in-memory mappings.

**Errors**

Reading the constant does not raise an error. Converter misses return `Null`; inputs outside the documented String/number contract can still encounter normal PascalScript Variant conversion behaviour. Persisting a value absent from the target type table can fail a database foreign key.

**Performance and concurrency**

This is immutable compiled metadata. Constant access and its two-branch converters are constant-time for practical purposes and do not carry mutable shipment state.

**Remarks**

Use the constant to make configuration intent explicit, then validate the surrounding dataset, direction, parties, lifecycle status and event configuration independently. The example is source-reviewed and non-destructive.

**Related entries**

- [`Type_CustomerPOD`](./Type_CustomerPOD.md) is the paired numeric identifier.
- [`GetPODTypeNum`](../../Functions/Velox/GetPODTypeNum.md) converts supported POD text to a number.
- [`GetPODTypeCode`](../../Functions/Velox/GetPODTypeCode.md) converts a supported POD number to text.
- [`POD_Delivered`](./POD_Delivered.md), [`POD_Updated`](./POD_Updated.md) and [`POD_Cancelled`](./POD_Cancelled.md) are separate POD lifecycle values.

<small>Created 2026-07-15</small>
