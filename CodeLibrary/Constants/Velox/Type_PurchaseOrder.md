---
title: Type_PurchaseOrder
description: Identifies Velox PurchaseOrder order type 2 for scripts, tags and VxData transaction records.
sidebar_position: 525
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, transaction-type, order]
---

```Delphi
Type_PurchaseOrder = 2
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetOrderTypeCode(Type_PurchaseOrder); // 'PurchaseOrder'
end;
```

### Usage

`Type_PurchaseOrder` identifies Velox PurchaseOrder order type 2 for scripts, tags and VxData transaction records.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `2` |
| Paired text | [`Type_PurchaseOrder_String`](./Type_PurchaseOrder_String.md) = `PurchaseOrder` |
| Deprecated numeric alias | [`Order_Type_PurchaseOrder`](./Order_Type_PurchaseOrder.md) = `2` |
| Database domain | `Order_Type.Num; Order_Hdr.TypeNum` |
| Tag-map entry | Yes: `<!Type_PurchaseOrder!>` expands to `2` |

### Additional Technical Info
`Type_PurchaseOrder` is the canonical numeric identifier for the **PurchaseOrder** member of the Velox order-type vocabulary. Its fixed `LongInt` value is `2`, paired with [`Type_PurchaseOrder_String`](./Type_PurchaseOrder_String.md).

It selects a domain value; it does not create, load, validate, send, receive, post or change the status of a transaction.

**Implementation**

Velox declares and registers fixed value `2`. [`GetOrderTypeCode`](../../Functions/Velox/GetOrderTypeCode.md) maps it to `PurchaseOrder`; [`GetOrderTypeNum`](../../Functions/Velox/GetOrderTypeNum.md) performs the reverse mapping. The numeric name is in the Velox tag map, so `<!Type_PurchaseOrder!>` expands to `2`.

`GetOrderTypeNumForInvoiceType` maps both supplier invoice tokens to this value, and `GetOrderTypeNumForASNType` maps `SupplierASN` to this value. Their String-returning partners return `PurchaseOrder`.

**Database alignment**

Fresh-build VxData seeds this exact row in `Order_Type`. `Order_Hdr.TypeNum` is a nullable foreign key to that table; `Order_Event_Type.TypeNum` is a required foreign key used with order status to select event behaviour.

The seed-table code is `PurchaseOrder` and its display description is human-spaced. The code, number and description are separate representations; persist the numeric key in `TypeNum` and use the exact code only where a code contract calls for it.

**Behaviour**

Text-to-number conversion is case-insensitive because it uses `SameText`, but it does not trim: `purchaseorder` is recognised and ` PurchaseOrder ` is not. Unsupported text returns `Null`. Number-to-text conversion returns `Null` for `Null` or an unsupported number.

The numeric value has meaning only inside its order-type domain. Identical integers in party, source, status, shipment or other vocabularies are not interchangeable.

**Edge cases and quirks**

- `PurchaseOrder` is a Velox transaction direction/type, not proof of party roles, commercial ownership, message standard or completion state.
- A sales/purchase bridge result loses the source invoice-versus-credit or ASN distinction; retain that source domain separately if it matters.
- Numeric PascalScript constants do not retain a domain type after evaluation; validate the target field/table contract before assignment.
- The preferred name is numerically indistinguishable from its deprecated alias after evaluation.
- A nullable header `TypeNum` may contain `Null` even though the seed vocabulary defines this value.
- The constant does not enforce event configuration, party relationships, lifecycle transitions or business-document validity.

**Side effects**

Reading, comparing or tag-expanding `Type_PurchaseOrder` has no database, file, network or shared-state side effect. Converter and bridge helpers, where present, are fixed in-memory mappings.

**Errors**

Reading the constant does not raise an error. Converter misses return `Null`; inputs outside the documented String/number contract can still encounter normal PascalScript Variant conversion behaviour. Persisting a value absent from the target type table can fail a database foreign key.

**Performance and concurrency**

This is immutable compiled metadata. Constant access, fixed converters and fixed bridge lookups are constant-time for practical purposes and do not carry mutable transaction state.

**Remarks**

Customer/supplier and sales/purchase naming expresses Velox's transaction vocabulary, not a universal accounting or EDI interpretation. Confirm the mapping contract, parties, signs and downstream process independently. The example is source-reviewed and non-destructive.

**Related entries**

- [`Type_PurchaseOrder_String`](./Type_PurchaseOrder_String.md) is the paired canonical text.
- [`Order_Type_PurchaseOrder`](./Order_Type_PurchaseOrder.md) is the deprecated numeric alias; prefer `Type_PurchaseOrder` in new work.
- [`GetOrderTypeNum`](../../Functions/Velox/GetOrderTypeNum.md) converts supported order text to a number.
- [`GetOrderTypeCode`](../../Functions/Velox/GetOrderTypeCode.md) converts a supported order number to text.
- [`GetOrderTypeNumForInvoiceType`](../../Functions/Velox/GetOrderTypeNumForInvoiceType.md) and [`GetOrderTypeForInvoiceType`](../../Functions/Velox/GetOrderTypeForInvoiceType.md) bridge supported invoice tokens.
- [`GetOrderTypeNumForASNType`](../../Functions/Velox/GetOrderTypeNumForASNType.md) and [`GetOrderTypeForASNType`](../../Functions/Velox/GetOrderTypeForASNType.md) bridge supported ASN tokens.

<small>Created 2026-07-15</small>
