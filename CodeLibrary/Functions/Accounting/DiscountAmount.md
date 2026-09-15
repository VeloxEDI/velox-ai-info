---
title: "DiscountAmount"
description: "Calculates the unrounded discount amount for a value and percentage."
sidebar_position: 1
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - accounting
  - discount
  - percentage
---

```Delphi
Function DiscountAmount( aValue, aDiscPC : Extended) : Extended
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := DiscountAmount(250, 12.5); // 31.25
end;
```

### Usage

`DiscountAmount` calculates the unrounded discount amount for a value and percentage.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aValue` | `Extended` | Base value from which to calculate the discount. |
| `aDiscPC` | `Extended` | Discount rate expressed as a percentage; for example, `12.5` means 12.5%. |

**Returns**

An `Extended` result equal to `aValue * (aDiscPC / 100)`. The result is not rounded.

**Behaviour**

The function is pure: its result depends only on its two arguments. A rate of zero returns zero. A rate of 100 returns the supplied value.

**Errors**

The function has no explicit validation or exception handling. Floating-point or arithmetic failures raised by the runtime propagate to the script.

**Usage notes**

Use `Discounted` when the required result is the value after subtracting this amount. Apply an explicit output rounding rule when the result represents money.

### Additional Technical Info
`DiscountAmount` returns the discount component represented by a percentage of a supplied value. It is useful when the discount must be recorded separately from the resulting net value.

**Implementation**

Velox registers the function directly with the script runtime. The terminal Velox implementation divides the percentage by 100, multiplies it by `aValue`, and returns the arithmetic result without another wrapper or conversion.

**Edge cases and quirks**

- The rate is a percentage, not a fractional multiplier. Passing `0.1` means 0.1%, not 10%.
- Negative rates return a negative discount amount. Rates above 100% return an amount greater than the base value.
- A negative base value reverses the sign expected from a positive base. The function does not impose accounting sign conventions.
- The calculation uses binary floating-point `Extended` arithmetic and does not apply currency, banker's or commercial rounding. Delphi's `Extended` representation is platform dependent.

**Performance and concurrency**

The calculation is constant time, performs no allocation and accesses no shared Velox state. It is re-entrant subject to the host thread's floating-point environment.

**Related entries**

- [`Discounted`](Discounted.md) — returns the base value after the percentage discount.

**External references**

- [Free Pascal: Real types](https://www.freepascal.org/docs-html/ref/refsu5.html)
- [Embarcadero DocWiki: Internal data formats](https://docwiki.embarcadero.com/RADStudio/en/Internal_Data_Formats)

<small>Created 2026-07-15</small>
