---
title: Invoice_Updated
description: Identifies the Updated invoice lifecycle state as Invoice_Status.Num value 2 for Velox scripts and status-event configuration.
sidebar_position: 382
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - invoice
  - lifecycle-status
  - constant
---

```Delphi
Invoice_Updated = 2
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InvoiceStatusNum: Integer;
begin
  InvoiceStatusNum := Invoice_Updated;
  Value := GetInvoiceStatusCode(InvoiceStatusNum); // 'Updated'
end;
```

### Usage

`Invoice_Updated` identifies the Updated invoice lifecycle state as Invoice_Status.Num value 2 for Velox scripts and status-event configuration.

**Value**

| Property | Value |
|---|---|
| Script type | `LongInt` |
| Numeric value | `2` |
| Canonical text | `Updated` through [`Invoice_Updated_String`](./Invoice_Updated_String.md) |
| Database domain | `Invoice_Status.Num` and `Invoice_Hdr.StatusNum` |

### Additional Technical Info
`Invoice_Updated` is the script-visible `LongInt` identifier for the **Updated** invoice lifecycle state. Its fixed value is `2`. Use it with invoice `StatusNum` values, the invoice-status conversion functions and invoice status-event configuration.

The constant identifies a state; reading it does not change an invoice, write a database value or dispatch an event.

**Implementation**

Velox declares the native constant as `2` and registers the same `LongInt` value with PascalScript. `GetInvoiceStatusCode` maps it to `Updated`; `GetInvoiceStatusNum` performs the reverse mapping. The numeric name is also registered in the Velox constant tag map, so a configuration tag such as `<!Invoice_Updated!>` expands to `2`.

A fresh VxData database seeds `Invoice_Status` row `2` with description `Updated`. `Invoice_Hdr.StatusNum` has a foreign key to that table, and `Invoice_Event_Type.StatusNum` uses the same lifecycle domain when selecting event configuration.

**Behaviour**

Use `Invoice_Updated` for equality checks and assignments in fields that explicitly use the invoice lifecycle-status domain. [`GetInvoiceStatusCode`](../../Functions/Velox/GetInvoiceStatusCode.md) returns `Updated` for this value. [`GetInvoiceStatusNum`](../../Functions/Velox/GetInvoiceStatusNum.md) recognises that token case-insensitively; it does not trim surrounding whitespace.

The state may participate in configured send and notification event selection through `Invoice_Event_Type`, but the constant neither proves that an event configuration exists nor causes any transition or event by itself.

**Edge cases and quirks**

- Do not confuse `Invoice_Hdr.StatusNum` with `Invoice_Hdr.Status`. `StatusNum` uses the three-value invoice lifecycle domain; `Status` uses the separate general issue/presentation status scale.
- Numeric values are not type-safe in PascalScript. The same integer can appear in other status or type families, so use the identifier belonging to the field's documented domain.
- `Invoice_Status` stores the text in `Description`; unlike `Invoice_Type`, it has no separate `Code` column.
- The reverse converter returns `Null` for an unknown number. It does not coerce an out-of-range value into a lifecycle state.

**Side effects**

Reading `Invoice_Updated`, expanding its numeric tag or comparing it has no I/O or state-changing side effect. Persisting a value or running an invoice flow is behaviour of the calling script or module, not the constant.

**Errors**

Reading the constant does not raise an error. A wrong numeric domain can select incorrect business or event logic, and database persistence outside the valid `Invoice_Status` keys can fail the relevant foreign-key constraint.

**Performance and concurrency**

This is an immutable compiled value. Access and comparison are constant-time, allocate no persistent resource and carry no shared mutable state.

**Remarks**

The example is source-reviewed and non-destructive. It demonstrates the supported numeric-to-code mapping without reading or updating a live invoice.

**Related entries**

- [`Invoice_Updated_String`](./Invoice_Updated_String.md) is the paired canonical text.
- [`GetInvoiceStatusCode`](../../Functions/Velox/GetInvoiceStatusCode.md) maps supported numbers to text.
- [`GetInvoiceStatusNum`](../../Functions/Velox/GetInvoiceStatusNum.md) maps recognised text to a number.

<small>Created 2026-07-15</small>
