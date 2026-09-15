---
title: "TaxInclusive"
description: "Adds a percentage tax factor to a tax-exclusive value without rounding."
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - accounting
  - tax
  - inclusive-value
---

```Delphi
Function TaxInclusive( aValue, aTaxRate : Extended) : Extended
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := TaxInclusive(100, 15); // 115
end;
```

### Usage

`TaxInclusive` adds a percentage tax factor to a tax-exclusive value without rounding.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aValue` | `Extended` | Tax-exclusive base value. |
| `aTaxRate` | `Extended` | Tax rate expressed as a percentage; for example, `15` means 15%. |

**Returns**

An `Extended` result equal to `aValue * ((aTaxRate + 100) / 100)`. The result is not rounded.

**Behaviour**

A zero rate returns the input. A rate of 100 doubles a positive base. The function does not resolve a tax code or read tax configuration.

**Important usage notes**

- Supply the rate in percentage points: `15`, not `0.15`, represents 15%.
- Negative rates reduce the value. A rate of `-100` returns zero, while a rate below `-100` reverses the result's sign.
- Negative bases and rates above 100% are calculated without validation.
- `Extended` is binary floating-point, so some decimal results cannot be represented exactly. Velox performs no monetary rounding, and Velox's `Extended` precision is platform dependent.

**Usage notes**

Use `TaxExclusive` to reverse the same percentage factor. Apply an explicit currency rounding policy before assigning the result to a destination that requires fixed decimal precision.

### Additional Technical Info
`TaxInclusive` applies a percentage tax factor to a tax-exclusive value and returns the inclusive total.

**Implementation**

Velox registers this function directly with the script runtime. Its terminal implementation adds 100 to the supplied rate, divides by 100 to obtain the inclusive factor, multiplies that factor by `aValue`, and returns the arithmetic result.

**Errors**

The implementation has no explicit validation or exception handling. Arithmetic failures raised by the runtime propagate to the script.

**Performance and concurrency**

The calculation is constant time, performs no allocation and accesses no shared Velox state.

**Related entries**

- [`TaxExclusive`](TaxExclusive.md) — removes the percentage factor from an inclusive value.
- [`TaxAmount`](TaxAmount.md) — returns only a percentage calculated from a supplied base.

**External references**

- [Free Pascal: Real types](https://www.freepascal.org/docs-html/ref/refsu5.html)
- [Embarcadero DocWiki: Internal data formats](https://docwiki.embarcadero.com/RADStudio/en/Internal_Data_Formats)

<small>Created 2026-07-15</small>
