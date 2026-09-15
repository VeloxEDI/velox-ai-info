---
title: "Discounted"
description: "Calculates the unrounded value remaining after applying a percentage discount."
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - accounting
  - discount
  - net-value
---

```Delphi
Function Discounted( aValue, aDiscPC : Extended) : Extended
```

### Example
```Delphi
procedure ScriptEvent(var Value: Variant);
begin
  Value := Discounted(250, 12.5); // 218.75
end;
```

### Usage

`Discounted` calculates the unrounded value remaining after applying a percentage discount.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aValue` | `Extended` | Base value to discount. |
| `aDiscPC` | `Extended` | Discount rate expressed as a percentage; for example, `12.5` means 12.5%. |

**Returns**

An `Extended` result equal to `aValue - (aValue * (aDiscPC / 100))`. The result is not rounded.

**Behaviour**

A zero rate returns the original value. A 100% rate returns zero. The function does not change either input or any map state.

**Errors**

There is no explicit range validation or local exception handler. Arithmetic failures raised by the runtime propagate to the calling script.

**Usage notes**

Use `DiscountAmount` if the mapping needs the amount removed rather than the remaining value. Round only according to the destination system's documented monetary rule.

### Additional Technical Info
`Discounted` returns the value remaining after subtracting a percentage discount from the supplied base value.

**Implementation**

The scripting import registers the Velox function directly. Its terminal implementation calculates the percentage amount and subtracts that amount from `aValue`; it does not delegate to `DiscountAmount` or a currency library.

**Edge cases and quirks**

- The rate is supplied in percentage points, so `10` means 10%.
- A negative rate increases the value. A rate above 100% produces a result with the opposite sign to a positive base.
- Negative base values are processed by the same formula; the function does not interpret debit, credit or reversal semantics.
- The use of binary floating-point `Extended` arithmetic can leave small representation differences. No currency rounding is performed, and Delphi's `Extended` representation varies by platform.

**Performance and concurrency**

The function takes constant time, allocates no memory and reads no shared state. It is re-entrant subject to the runtime floating-point environment.

**Related entries**

- [`DiscountAmount`](DiscountAmount.md) — returns only the percentage discount component.

**External references**

- [Free Pascal: Real types](https://www.freepascal.org/docs-html/ref/refsu5.html)
- [Embarcadero DocWiki: Internal data formats](https://docwiki.embarcadero.com/RADStudio/en/Internal_Data_Formats)

<small>Created 2026-07-15</small>
