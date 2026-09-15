---
title: "TaxExclusive"
description: "Removes a percentage tax factor from a tax-inclusive value without rounding."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - accounting
  - tax
  - exclusive-value
---

```Delphi
Function TaxExclusive( aValue, aTaxRate : Extended) : Extended
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := TaxExclusive(115, 15); // 100
end;
```

### Usage

`TaxExclusive` removes a percentage tax factor from a tax-inclusive value without rounding.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aValue` | `Extended` | Tax-inclusive value to convert. |
| `aTaxRate` | `Extended` | Included tax rate expressed as a percentage; for example, `15` means 15%. |

**Returns**

An `Extended` result equal to `aValue / ((aTaxRate + 100) / 100)`. The result is not rounded.

**Behaviour**

A zero rate returns the supplied value. The function does not inspect tax codes, jurisdiction, effective dates or configuration; the script must supply the applicable rate.

**Errors**

There is no local validation or exception handler. Any arithmetic exception raised by the active floating-point environment propagates to the script runtime. The function does not test for or replace non-finite results when floating-point exceptions are masked.

### Additional Technical Info
`TaxExclusive` removes a percentage tax factor from an inclusive value and returns the corresponding tax-exclusive base.

**Implementation**

The Velox scripting import registers the numeric function directly. The terminal implementation adds 100 to the percentage, divides that sum by 100 to form the inclusive factor, then divides `aValue` by that factor.

**Edge cases and quirks**

- `aTaxRate = -100` makes the factor zero and attempts floating-point division by zero. Depending on the active floating-point exception mask, this can raise an exception or produce a non-finite value.
- Rates below `-100`, negative values and rates above 100% are accepted and processed literally; the function does not decide whether they are commercially meaningful.
- This is not equivalent to subtracting `TaxAmount(aValue, aTaxRate)` from an inclusive value, because the percentage base is different.
- Binary floating-point `Extended` arithmetic can produce a result slightly above or below the decimal value expected. No currency rounding occurs, and the type's representation varies by platform.

**Performance and concurrency**

The calculation is constant time, allocation-free and has no shared-state side effects.

**Remarks**

Subtract the returned exclusive value from the original inclusive value if the mapping needs the embedded tax component. Apply the destination's approved currency rounding rule after the calculation.

**Related entries**

- [`TaxInclusive`](TaxInclusive.md) — applies the inverse percentage factor to an exclusive value.
- [`TaxAmount`](TaxAmount.md) — calculates a percentage of an explicitly supplied base.

**External references**

- [Free Pascal: Real types](https://www.freepascal.org/docs-html/ref/refsu5.html)
- [Embarcadero DocWiki: Internal data formats](https://docwiki.embarcadero.com/RADStudio/en/Internal_Data_Formats)

<small>Created 2026-07-15</small>
