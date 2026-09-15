---
title: "GetInvoiceStatusCode"
description: "Converts a Velox invoice status number to its canonical code."
sidebar_position: 15
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - mapping
  - variant
  - invoice-status
---

```Delphi
Function GetInvoiceStatusCode(const aInvoiceStatus : Variant) : Variant;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := GetInvoiceStatusCode(1); // 'Invoiced'
end;
```

### Usage

`GetInvoiceStatusCode` converts a Velox invoice status number to its canonical code.

**Parameters and result**

| Item | Type | Description |
|---|---|---|
| `aInvoiceStatus` | `Variant`, `const` | Numeric invoice status value. Velox expects one of the listed integral values in a compatible `Variant`. |
| Result | `Variant` | Canonical code string in a `Variant`, or `Null` when the value is null or unrecognized. |

**Mapping**

| Number | Code |
|---:|---|
| `1` | `Invoiced` |
| `2` | `Updated` |
| `3` | `Cancelled` |

### Additional Technical Info
`GetInvoiceStatusCode` converts the numeric representation of a invoice status to the canonical code used by Velox. The mapping is hard-coded in product source, so it is deterministic and does not read customer configuration.

**Implementation**

The implementation first evaluates `aInvoiceStatus = Null`, then uses a `case` statement for the listed integral constants. A recognized value assigns the literal code; the `else` branch assigns `Null`. No database, configuration table or locale-dependent lookup is involved.

**Behaviour and edge cases**

- With Delphi's default loose `NullEqualityRule`, a `Null` input follows the explicit null branch and returns `Null`. That rule is process-global; changing it to strict or error semantics can alter or break the comparison before the `case` statement.
- The intended inputs are the integral values in the table. Numeric-looking strings, floating-point values, booleans and other coercible `Variant` types should not be used as substitutes even where Delphi happens to convert them.
- Unknown values return `Null`; they do not raise a domain-specific "unknown invoice status" exception.
- Incompatible `Variant` values, such as arrays or interface values, can fail during comparison or ordinal conversion and propagate a Delphi conversion/operator exception.
- The numeric values belong to this mapping family. A number used by another Velox type or status is not semantically interchangeable.

**Side effects, errors and performance**

The function is pure for normal supported values: it performs no I/O, changes no Velox state and allocates no persistent resource. It runs in constant time over a small fixed mapping. Delphi Variant comparison or conversion errors propagate; the function does not catch them.

**Related entries**

- [`GetInvoiceStatusNum`](GetInvoiceStatusNum.md) performs the reverse conversion.
- [Embarcadero: `System.Variants.NullEqualityRule`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Variants.NullEqualityRule)
- [Free Pascal: `NullEqualityRule`](https://www.freepascal.org/docs-html/rtl/variants/nullequalityrule.html)

<small>Created 2026-07-15</small>
