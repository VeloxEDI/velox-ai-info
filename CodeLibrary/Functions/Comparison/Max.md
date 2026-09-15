---
title: "Max"
description: "Returns the greater of two Extended values using Delphi's floating-point maximum routine."
sidebar_position: 21
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - numeric
  - maximum
  - floating-point
---

```Delphi
Function Max( const A, B : Extended): Extended
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Max(12.5, 19.75);
end;
```

### Usage

Returns the greater of two Extended values using Velox's floating-point maximum routine.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `A` | `Extended`, `const` | First value. |
| `B` | `Extended`, `const` | Second value. |

**Returns**

The selected input value. For ordinary unequal finite values, this is the numerically greater operand.

**Behaviour**

There is no tolerance or rounding step. Equal finite values remain equal, and infinities order normally. Because the function returns one input rather than calculating a new arithmetic result, the selected value's floating-point representation is preserved.

**Errors**

Finite, infinite and `NaN` operands have no expected exception path. A caller value that cannot be converted to `Extended` can fail before entry.

**Usage notes**

Use explicit finite-value validation when `NaN` must be rejected. Use [`CompareValue`](CompareValue.md) when the flow needs a three-way, tolerance-aware relationship rather than one selected operand.

### Additional Technical Info
`Max` returns the greater of two `Extended` values. Velox exposes only the `Extended` wrapper, even though Delphi provides several overloads.

The example returns `19.75`. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

`vxCommonNumber.Max` delegates directly to the `Extended` overload of `System.Math.Max`. Current Delphi source compares the two operands, propagates a `NaN` operand and handles equal signed zeros specially so that positive zero wins.

**Edge cases and quirks**

- If either operand is `NaN`, the current Delphi implementation returns that `NaN`. This differs from a simple `if A > B then A else B` expression when `A` is `NaN`.
- `Max(-0.0, +0.0)` and `Max(+0.0, -0.0)` return positive zero.
- `Extended` precision is platform-dependent. It is commonly 80-bit on Win32 and aliases `Double` on Win64, so conversion into the parameters can already have rounded a value.
- This is a binary floating-point maximum, not a decimal/business rounding rule and not validation that either input is finite.

**Side effects**

None.

**Performance and concurrency**

The operation is constant-time, allocates no managed data and uses no shared mutable state.

**Related entries**

- [`Min`](Min.md) selects the lesser operand.
- [`CompareValue`](CompareValue.md) returns an approximate ordering.
- [`MoreThanValue`](MoreThanValue.md) returns a Boolean greater-than relationship after tolerance handling.

**External references**

- [Embarcadero `System.Math.Max`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Math.Max)
- [Free Pascal `Max`](https://www.freepascal.org/docs-html/rtl/math/max.html) - overload compatibility context; current Delphi source defines Velox's `NaN` and signed-zero results.

<small>Created 2026-07-15</small>
