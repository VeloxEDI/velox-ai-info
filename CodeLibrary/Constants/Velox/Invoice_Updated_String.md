---
title: Invoice_Updated_String
description: Provides the exact Updated text paired with invoice lifecycle-status value 2 and recognised by Velox invoice-status conversion.
sidebar_position: 383
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - invoice
  - lifecycle-status
  - string-constant
---

```Delphi
Invoice_Updated_String = 'Updated'
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetInvoiceStatusNum(Invoice_Updated_String); // 2
end;
```

### Usage

`Invoice_Updated_String` provides the exact Updated text paired with invoice lifecycle-status value 2 and recognised by Velox invoice-status conversion.

**Value**

| Property | Value |
|---|---|
| Script type | `String` |
| Exact literal | `Updated` |
| Numeric partner | `2` through [`Invoice_Updated`](./Invoice_Updated.md) |
| Database representation | `Invoice_Status.Description` for row `2` |

### Additional Technical Info
`Invoice_Updated_String` is the canonical script-visible text `Updated` paired with invoice lifecycle-status value [`Invoice_Updated`](./Invoice_Updated.md) = 2. Use it when a script needs the Velox name for this lifecycle state or an input to invoice-status conversion.

The string names a lifecycle state. It does not change an invoice, validate a record or send an event.

**Implementation**

Velox declares and registers the exact `String` literal `Updated`. [`GetInvoiceStatusNum`](../../Functions/Velox/GetInvoiceStatusNum.md) compares input with this literal by Delphi `SameText`, making the conversion case-insensitive for this ASCII token. [`GetInvoiceStatusCode`](../../Functions/Velox/GetInvoiceStatusCode.md) returns this exact casing for numeric value `2`.

The fresh-build `Invoice_Status` table stores `Updated` in its `Description` column. The table does not have a separate `Code` column.

**Behaviour**

Pass `Invoice_Updated_String` to `GetInvoiceStatusNum` when converting the canonical name. An external value such as `UPDATED` is also recognised by that converter, but the constant itself retains the exact `Updated` spelling and casing.

Unlike the numeric `Invoice_Updated` name, `Invoice_Updated_String` is not registered in the Velox constant tag map. Use the numeric name in `<!...!>` configuration tags; do not expect `<!Invoice_Updated_String!>` to expand.

**Edge cases and quirks**

- `GetInvoiceStatusNum` ignores letter case but does not trim whitespace. `' Updated'` and `Updated ` therefore return `Null`.
- A direct script string comparison is not a substitute for the converter unless the calling context defines the required case behaviour.
- `Invoice_Hdr.StatusNum` stores the numeric lifecycle key. The separate `Invoice_Hdr.Status` column uses the general issue/presentation status domain and does not store this text.
- The same word may appear as presentation text elsewhere; use this constant only for the invoice lifecycle-status family.

**Side effects**

Reading or comparing `Invoice_Updated_String` has no I/O or state-changing side effect. Conversion uses a fixed in-process mapping and does not query `Invoice_Status`.

**Errors**

Reading the constant does not raise an error. The converter returns `Null` for unknown or whitespace-padded text rather than raising an invoice-specific exception.

**Performance and concurrency**

This is an immutable compiled string. Normal access and the fixed three-value converter are constant-time for practical purposes and carry no shared mutable Velox state.

**Remarks**

The example is source-reviewed and non-destructive. Use the exact constant when constructing canonical output even though the reverse converter accepts different letter casing.

**Related entries**

- [`Invoice_Updated`](./Invoice_Updated.md) is the paired numeric lifecycle value.
- [`GetInvoiceStatusNum`](../../Functions/Velox/GetInvoiceStatusNum.md) performs case-insensitive text-to-number conversion.
- [`GetInvoiceStatusCode`](../../Functions/Velox/GetInvoiceStatusCode.md) returns the canonical text for a supported number.

<small>Created 2026-07-15</small>
