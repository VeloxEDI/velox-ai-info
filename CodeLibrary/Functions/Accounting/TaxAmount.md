---
title: "TaxAmount"
description: "Calculates a percentage tax amount from the supplied base value."
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - accounting
  - tax
  - percentage
---

```Delphi
Function TaxAmount( aValue, aTaxRate : Extended) : Extended
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := TaxAmount(200, 15); // 30
end;
```

### Usage

`TaxAmount` calculates a percentage tax amount from the supplied base value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aValue` | `Extended` | Base value on which the percentage is calculated. |
| `aTaxRate` | `Extended` | Tax rate expressed as a percentage; for example, `15` means 15%. |

**Returns**

An `Extended` result equal to `aValue * (aTaxRate / 100)`. The result is not rounded.

**Behaviour**

The function performs no tax-code lookup and does not know whether the input includes tax. It calculates only a percentage of that input. A zero rate returns zero.

**Important usage notes**

- Do not use this formula to extract the embedded tax from an inclusive total. For example, 15% of an inclusive total is not the 15% tax component originally added to its exclusive base.
- Negative rates and values are accepted and affect the result's sign. Rates above 100% are also calculated literally.
- The `Extended` calculation is binary floating-point and is not rounded to a currency scale. Its precision and storage are platform dependent.

**Usage notes**

Use `TaxInclusive` for the total after adding tax. If starting from an inclusive total, use `TaxExclusive` to obtain the base and subtract that base when the separate tax component is needed.

### Additional Technical Info
`TaxAmount` calculates a tax percentage of the value supplied by the script. Pass a tax-exclusive base when the required result is the tax that would be added to that base.

**Implementation**

Velox exposes the implementation directly through its number-functions scripting import. The terminal function converts the rate to a fractional multiplier, multiplies it by `aValue`, and returns the result unchanged.

**Errors**

No rate validation or exception translation occurs. Arithmetic failures raised by the runtime propagate to the script.

**Performance and concurrency**

The function is constant time, allocation-free and independent of shared Velox state.

**Related entries**

- [`TaxInclusive`](TaxInclusive.md) — adds the percentage factor to an exclusive base.
- [`TaxExclusive`](TaxExclusive.md) — removes the percentage factor from an inclusive value.

**External references**

- [Free Pascal: Real types](https://www.freepascal.org/docs-html/ref/refsu5.html)
- [Embarcadero DocWiki: Internal data formats](https://docwiki.embarcadero.com/RADStudio/en/Internal_Data_Formats)

<small>Created 2026-07-15</small>
