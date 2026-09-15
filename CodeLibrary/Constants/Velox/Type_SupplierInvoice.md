---
title: Type_SupplierInvoice
description: Identifies Velox SupplierInvoice invoice type 3 for scripts, tags and VxData transaction records.
sidebar_position: 541
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, transaction-type, invoice]
---

```Delphi
Type_SupplierInvoice = 3
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetInvoiceTypeCode(Type_SupplierInvoice); // 'SupplierInvoice'
end;
```

### Usage

`Type_SupplierInvoice` identifies Velox SupplierInvoice invoice type 3 for scripts, tags and VxData transaction records.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `3` |
| Paired text | [`Type_SupplierInvoice_String`](./Type_SupplierInvoice_String.md) = `SupplierInvoice` |
| Deprecated numeric alias | [`Invoice_Type_SupplierInvoice`](./Invoice_Type_SupplierInvoice.md) = `3` |
| Database domain | `Invoice_Type.Num; Invoice_Hdr.TypeNum` |
| Tag-map entry | Yes: `<!Type_SupplierInvoice!>` expands to `3` |

### Additional Technical Info
`Type_SupplierInvoice` is the canonical numeric identifier for the **SupplierInvoice** member of the Velox invoice-type vocabulary. Its fixed `LongInt` value is `3`, paired with [`Type_SupplierInvoice_String`](./Type_SupplierInvoice_String.md).

It selects a domain value; it does not create, load, validate, send, receive, post or change the status of a transaction.

**Implementation**

Velox declares and registers fixed value `3`. [`GetInvoiceTypeCode`](../../Functions/Velox/GetInvoiceTypeCode.md) maps it to `SupplierInvoice`; [`GetInvoiceTypeNum`](../../Functions/Velox/GetInvoiceTypeNum.md) performs the reverse mapping. The numeric name is in the Velox tag map, so `<!Type_SupplierInvoice!>` expands to `3`.

For this exact token, `GetOrderTypeNumForInvoiceType` returns `Type_PurchaseOrder` and `GetOrderTypeForInvoiceType` returns `PurchaseOrder`. Invoice and credit tokens in the same direction intentionally converge on the same order type; the bridge does not preserve whether the source document was an invoice or a credit.

**Database alignment**

Fresh-build VxData seeds this exact row in `Invoice_Type`. `Invoice_Hdr.TypeNum` is a nullable foreign key to that table; `Invoice_Event_Type.TypeNum` is a required foreign key used with invoice status to select event behaviour.

The seed-table code is `SupplierInvoice` and its display description is human-spaced. The code, number and description are separate representations; persist the numeric key in `TypeNum` and use the exact code only where a code contract calls for it.

**Behaviour**

Text-to-number conversion is case-insensitive because it uses `SameText`, but it does not trim: `supplierinvoice` is recognised and ` SupplierInvoice ` is not. Unsupported text returns `Null`. Number-to-text conversion returns `Null` for `Null` or an unsupported number.

The numeric value has meaning only inside its invoice-type domain. Identical integers in party, source, status, shipment or other vocabularies are not interchangeable.

**Edge cases and quirks**

- `SupplierInvoice` identifies the Velox supplier-direction invoice type. It does not determine debit/credit sign, positive/negative totals, tax treatment or ledger posting.
- The invoice-to-order bridge is directional: supplier invoice and credit tokens both collapse to the same purchase order type.
- Numeric PascalScript constants do not retain a domain type after evaluation; validate the target field/table contract before assignment.
- The preferred name is numerically indistinguishable from its deprecated alias after evaluation.
- A nullable header `TypeNum` may contain `Null` even though the seed vocabulary defines this value.
- The constant does not enforce event configuration, party relationships, lifecycle transitions or business-document validity.

**Side effects**

Reading, comparing or tag-expanding `Type_SupplierInvoice` has no database, file, network or shared-state side effect. Converter and bridge helpers, where present, are fixed in-memory mappings.

**Errors**

Reading the constant does not raise an error. Converter misses return `Null`; inputs outside the documented String/number contract can still encounter normal PascalScript Variant conversion behaviour. Persisting a value absent from the target type table can fail a database foreign key.

**Performance and concurrency**

This is immutable compiled metadata. Constant access, fixed converters and fixed bridge lookups are constant-time for practical purposes and do not carry mutable transaction state.

**Remarks**

Customer/supplier and sales/purchase naming expresses Velox's transaction vocabulary, not a universal accounting or EDI interpretation. Confirm the mapping contract, parties, signs and downstream process independently. The example is source-reviewed and non-destructive.

**Related entries**

- [`Type_SupplierInvoice_String`](./Type_SupplierInvoice_String.md) is the paired canonical text.
- [`Invoice_Type_SupplierInvoice`](./Invoice_Type_SupplierInvoice.md) is the deprecated numeric alias; prefer `Type_SupplierInvoice` in new work.
- [`GetInvoiceTypeNum`](../../Functions/Velox/GetInvoiceTypeNum.md) converts supported invoice text to a number.
- [`GetInvoiceTypeCode`](../../Functions/Velox/GetInvoiceTypeCode.md) converts a supported invoice number to text.
- [`GetOrderTypeNumForInvoiceType`](../../Functions/Velox/GetOrderTypeNumForInvoiceType.md) returns the corresponding sales/purchase order number.
- [`GetOrderTypeForInvoiceType`](../../Functions/Velox/GetOrderTypeForInvoiceType.md) returns the corresponding sales/purchase order text.

<small>Created 2026-07-15</small>
