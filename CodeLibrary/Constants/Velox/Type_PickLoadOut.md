---
title: Type_PickLoadOut
description: Identifies Velox PickLoadOut order type 3 for scripts, tags and VxData transaction records.
sidebar_position: 523
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, transaction-type, order]
---

```Delphi
Type_PickLoadOut = 3
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetOrderTypeCode(Type_PickLoadOut); // 'PickLoadOut'
end;
```

### Usage

`Type_PickLoadOut` identifies Velox PickLoadOut order type 3 for scripts, tags and VxData transaction records.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `3` |
| Paired text | [`Type_PickLoadOut_String`](./Type_PickLoadOut_String.md) = `PickLoadOut` |
| Deprecated numeric alias | [`Order_Type_PickLoadOut`](./Order_Type_PickLoadOut.md) = `3` |
| Database domain | `Order_Type.Num; Order_Hdr.TypeNum` |
| Tag-map entry | Yes: `<!Type_PickLoadOut!>` expands to `3` |

### Additional Technical Info
`Type_PickLoadOut` is the canonical numeric identifier for the **PickLoadOut** member of the Velox order-type vocabulary. Its fixed `LongInt` value is `3`, paired with [`Type_PickLoadOut_String`](./Type_PickLoadOut_String.md).

It selects a domain value; it does not create, load, validate, send, receive, post or change the status of a transaction.

**Implementation**

Velox declares and registers fixed value `3`. [`GetOrderTypeCode`](../../Functions/Velox/GetOrderTypeCode.md) maps it to `PickLoadOut`; [`GetOrderTypeNum`](../../Functions/Velox/GetOrderTypeNum.md) performs the reverse mapping. The numeric name is in the Velox tag map, so `<!Type_PickLoadOut!>` expands to `3`.

No reviewed invoice-to-order or ASN-to-order bridge helper returns `PickLoadOut`. Those helpers cover only the sales/purchase direction pair; scripts must select this warehouse-operation type explicitly when the flow contract requires it.

**Database alignment**

Fresh-build VxData seeds this exact row in `Order_Type`. `Order_Hdr.TypeNum` is a nullable foreign key to that table; `Order_Event_Type.TypeNum` is a required foreign key used with order status to select event behaviour.

The seed-table code is `PickLoadOut` and its display description is human-spaced. The code, number and description are separate representations; persist the numeric key in `TypeNum` and use the exact code only where a code contract calls for it.

**Behaviour**

Text-to-number conversion is case-insensitive because it uses `SameText`, but it does not trim: `pickloadout` is recognised and ` PickLoadOut ` is not. Unsupported text returns `Null`. Number-to-text conversion returns `Null` for `Null` or an unsupported number.

The numeric value has meaning only inside its order-type domain. Identical integers in party, source, status, shipment or other vocabularies are not interchangeable.

**Edge cases and quirks**

- The database description is `Pick / Load Out`, while the canonical code has no spaces or slash: `PickLoadOut`.
- This is an order-type identity, not proof that stock was allocated, picked, loaded, dispatched or decremented.
- Numeric PascalScript constants do not retain a domain type after evaluation; validate the target field/table contract before assignment.
- The preferred name is numerically indistinguishable from its deprecated alias after evaluation.
- A nullable header `TypeNum` may contain `Null` even though the seed vocabulary defines this value.
- The constant does not enforce event configuration, party relationships, lifecycle transitions or business-document validity.

**Side effects**

Reading, comparing or tag-expanding `Type_PickLoadOut` has no database, file, network or shared-state side effect. Converter and bridge helpers, where present, are fixed in-memory mappings.

**Errors**

Reading the constant does not raise an error. Converter misses return `Null`; inputs outside the documented String/number contract can still encounter normal PascalScript Variant conversion behaviour. Persisting a value absent from the target type table can fail a database foreign key.

**Performance and concurrency**

This is immutable compiled metadata. Constant access, fixed converters and fixed bridge lookups are constant-time for practical purposes and do not carry mutable transaction state.

**Remarks**

Customer/supplier and sales/purchase naming expresses Velox's transaction vocabulary, not a universal accounting or EDI interpretation. Confirm the mapping contract, parties, signs and downstream process independently. The example is source-reviewed and non-destructive.

**Related entries**

- [`Type_PickLoadOut_String`](./Type_PickLoadOut_String.md) is the paired canonical text.
- [`Order_Type_PickLoadOut`](./Order_Type_PickLoadOut.md) is the deprecated numeric alias; prefer `Type_PickLoadOut` in new work.
- [`GetOrderTypeNum`](../../Functions/Velox/GetOrderTypeNum.md) converts supported order text to a number.
- [`GetOrderTypeCode`](../../Functions/Velox/GetOrderTypeCode.md) converts a supported order number to text.
- [`GetOrderTypeNumForInvoiceType`](../../Functions/Velox/GetOrderTypeNumForInvoiceType.md) and [`GetOrderTypeForInvoiceType`](../../Functions/Velox/GetOrderTypeForInvoiceType.md) bridge supported invoice tokens.
- [`GetOrderTypeNumForASNType`](../../Functions/Velox/GetOrderTypeNumForASNType.md) and [`GetOrderTypeForASNType`](../../Functions/Velox/GetOrderTypeForASNType.md) bridge supported ASN tokens.

<small>Created 2026-07-15</small>
