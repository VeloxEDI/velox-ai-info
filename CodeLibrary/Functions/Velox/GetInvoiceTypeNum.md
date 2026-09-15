---
title: "GetInvoiceTypeNum"
description: "Converts a Velox invoice type code to its canonical number."
sidebar_position: 18
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - mapping
  - variant
  - invoice-type
---

```Delphi
Function GetInvoiceTypeNum(const aInvoiceTypeCode : string) : Variant;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetInvoiceTypeNum('CustomerInvoice'); // 1
end;
```

### Usage

`GetInvoiceTypeNum` converts a Velox invoice type code to its canonical number.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aInvoiceTypeCode` | `string`, `const` | Invoice type code. Comparison is case-insensitive but otherwise exact. |
| Result | `Variant` | Mapped integer in a `Variant`, or `Null` when the code is unrecognized. |

**Mapping**

| Number | Code |
|---:|---|
| `1` | `CustomerInvoice` |
| `2` | `CustomerCredit` |
| `3` | `SupplierInvoice` |
| `4` | `SupplierCredit` |

**Behaviour and edge cases**

- Comparison is ordinal and case-insensitive. For these ASCII identifiers, letter case is ignored: for example, `customerinvoice` matches `CustomerInvoice`.
- `SameText` compares the entire string and this function performs no trimming. Leading or trailing whitespace, punctuation changes and embedded whitespace prevent a match.
- Empty text and unknown codes return `Null`. Numeric text is not parsed as the corresponding number.
- The result is a numeric `Variant`, not text. Test `VarIsNull` before assigning an unrecognized result to a non-nullable numeric destination.
- Only the documented names are accepted; changing database labels or configuration cannot add aliases.

### Additional Technical Info
`GetInvoiceTypeNum` converts a invoice type code to the corresponding numeric value used by Velox. The mapping is hard-coded in product source, so it is deterministic and does not read customer configuration.

**Implementation**

The implementation tests the input against each literal code with Delphi `SameText`, in the order shown. The first match assigns the corresponding integer; if none match, the function assigns `Null`. No database or configurable lookup table is involved.

**Side effects, errors and performance**

The function is pure for normal supported values: it performs no I/O, changes no Velox state and allocates no persistent resource. It runs in constant time over a small fixed mapping. Ordinary string inputs do not raise a domain-specific error; an unmatched value simply returns `Null`.

**Related entries**

- [`GetInvoiceTypeCode`](GetInvoiceTypeCode.md) performs the reverse conversion.
- [Embarcadero: `System.SysUtils.SameText`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.SameText)
- [Free Pascal: `SameText`](https://www.freepascal.org/docs-html/rtl/sysutils/sametext.html)

<small>Created 2026-07-15</small>
