---
title: Type_CustomerInvoice_String
description: Provides the exact CustomerInvoice text paired with Type_CustomerInvoice for the Velox invoice-type domain.
sidebar_position: 500
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, transaction-type, invoice, string-constant]
---

```Delphi
Type_CustomerInvoice_String = 'CustomerInvoice'
```

### Example

```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetInvoiceTypeNum(Type_CustomerInvoice_String); // 1
end;
```

### Usage

`Type_CustomerInvoice_String` provides the exact CustomerInvoice text paired with Type_CustomerInvoice for the Velox invoice-type domain.

**Value**

| Property | Value |
|---|---|
| Script type | `String` |
| Text value | `'CustomerInvoice'` |
| Paired number | [`Type_CustomerInvoice`](./Type_CustomerInvoice.md) = `1` |
| Deprecated numeric alias | [`Invoice_Type_CustomerInvoice`](./Invoice_Type_CustomerInvoice.md) = `1` |
| Database domain | `Invoice_Type.Num; Invoice_Hdr.TypeNum` |
| Tag-map entry | No |

### Additional Technical Info
`Type_CustomerInvoice_String` is the canonical text for the **CustomerInvoice** member of the Velox invoice-type vocabulary. Its fixed `String` value is `'CustomerInvoice'`, paired with [`Type_CustomerInvoice`](./Type_CustomerInvoice.md).

It selects a domain value; it does not create, load, validate, send, receive, post or change the status of a transaction.

**Implementation**

Velox declares and registers exact text `CustomerInvoice`. [`GetInvoiceTypeNum`](../../Functions/Velox/GetInvoiceTypeNum.md) compares it with Delphi `SameText` and returns `1`; [`GetInvoiceTypeCode`](../../Functions/Velox/GetInvoiceTypeCode.md) performs the reverse mapping. The String identifier is not in the Velox tag map.

For this exact token, `GetOrderTypeNumForInvoiceType` returns `Type_SalesOrder` and `GetOrderTypeForInvoiceType` returns `SalesOrder`. Invoice and credit tokens in the same direction intentionally converge on the same order type; the bridge does not preserve whether the source document was an invoice or a credit.

**Database alignment**

Fresh-build VxData seeds this exact row in `Invoice_Type`. `Invoice_Hdr.TypeNum` is a nullable foreign key to that table; `Invoice_Event_Type.TypeNum` is a required foreign key used with invoice status to select event behaviour.

The seed-table code is `CustomerInvoice` and its display description is human-spaced. The code, number and description are separate representations; persist the numeric key in `TypeNum` and use the exact code only where a code contract calls for it.

**Behaviour**

Text-to-number conversion is case-insensitive because it uses `SameText`, but it does not trim: `customerinvoice` is recognised and ` CustomerInvoice ` is not. Unsupported text returns `Null`. Number-to-text conversion returns `Null` for `Null` or an unsupported number.

The paired numeric value has meaning only inside its invoice-type domain. Identical integers in party, source, status, shipment or other vocabularies are not interchangeable.

**Edge cases and quirks**

- `CustomerInvoice` identifies the Velox customer-direction invoice type. It does not determine debit/credit sign, positive/negative totals, tax treatment or ledger posting.
- The invoice-to-order bridge is directional: customer invoice and credit tokens both collapse to the same sales order type.
- Numeric PascalScript constants do not retain a domain type after evaluation; validate the target field/table contract before assignment.
- The preferred name is numerically indistinguishable from its deprecated alias after evaluation.
- A nullable header `TypeNum` may contain `Null` even though the seed vocabulary defines this value.
- The constant does not enforce event configuration, party relationships, lifecycle transitions or business-document validity.

**Side effects**

Reading or comparing `Type_CustomerInvoice_String` has no database, file, network or shared-state side effect. Converter and bridge helpers, where present, are fixed in-memory mappings.

**Errors**

Reading the constant does not raise an error. Converter misses return `Null`; inputs outside the documented String/number contract can still encounter normal PascalScript Variant conversion behaviour. Persisting a value absent from the target type table can fail a database foreign key.

**Performance and concurrency**

This is immutable compiled metadata. Constant access, fixed converters and fixed bridge lookups are constant-time for practical purposes and do not carry mutable transaction state.

**Remarks**

Customer/supplier and sales/purchase naming expresses Velox's transaction vocabulary, not a universal accounting or EDI interpretation. Confirm the mapping contract, parties, signs and downstream process independently. The example is source-reviewed and non-destructive.

**Related entries**

- [`Type_CustomerInvoice`](./Type_CustomerInvoice.md) is the paired numeric identifier.
- [`Invoice_Type_CustomerInvoice`](./Invoice_Type_CustomerInvoice.md) is the deprecated numeric alias; prefer `Type_CustomerInvoice` in new work.
- [`GetInvoiceTypeNum`](../../Functions/Velox/GetInvoiceTypeNum.md) converts supported invoice text to a number.
- [`GetInvoiceTypeCode`](../../Functions/Velox/GetInvoiceTypeCode.md) converts a supported invoice number to text.
- [`GetOrderTypeNumForInvoiceType`](../../Functions/Velox/GetOrderTypeNumForInvoiceType.md) returns the corresponding sales/purchase order number.
- [`GetOrderTypeForInvoiceType`](../../Functions/Velox/GetOrderTypeForInvoiceType.md) returns the corresponding sales/purchase order text.

<small>Created 2026-07-15</small>
