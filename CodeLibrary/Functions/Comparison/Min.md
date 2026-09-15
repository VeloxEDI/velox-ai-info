---
title: "Min"
description: "Returns the lesser of two Extended values using Delphi's floating-point minimum routine."
sidebar_position: 22
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - numeric
  - minimum
  - floating-point
---

```Delphi
Function Min( const A, B : Extended): Extended
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Min(12.5, 19.75);
end;
```

### Usage

Returns the lesser of two Extended values using Velox's floating-point minimum routine.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `A` | `Extended`, `const` | First value. |
| `B` | `Extended`, `const` | Second value. |

**Returns**

The selected input value. For ordinary unequal finite values, this is the numerically lesser operand.

**Behaviour**

There is no tolerance or rounding step. Equal finite values remain equal, and infinities order normally. Because the function returns one input rather than calculating a new arithmetic result, the selected value's floating-point representation is preserved.

**Important usage notes**

- If either operand is `NaN`, the Velox returns that `NaN`.
- `Min(-0.0, +0.0)` and `Min(+0.0, -0.0)` return negative zero.
- `Extended` precision is platform-dependent. It is commonly 80-bit on Win32 and aliases `Double` on Win64, so conversion into the parameters can already have rounded a value.
- This is a binary floating-point minimum, not a decimal/business rounding rule and not validation that either input is finite.

**Usage notes**

Use explicit finite-value validation when `NaN` must be rejected. Use [`CompareValue`](CompareValue.md) when the flow needs a three-way, tolerance-aware relationship rather than one selected operand.

### Additional Technical Info
`Min` returns the lesser of two `Extended` values. Velox exposes only the `Extended` wrapper, even though Delphi provides several overloads.

The example returns `12.5`. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

`vxCommonNumber.Min` delegates directly to the `Extended` overload of `System.Math.Min`. Current Delphi source compares the two operands, propagates a `NaN` operand and handles equal signed zeros specially so that negative zero wins.

**Side effects**

None.

**Errors**

Finite, infinite and `NaN` operands have no expected exception path. A caller value that cannot be converted to `Extended` can fail before entry.

**Performance and concurrency**

The operation is constant-time, allocates no managed data and uses no shared mutable state.

**Related entries**

- [`Max`](Max.md) selects the greater operand.
- [`CompareValue`](CompareValue.md) returns an approximate ordering.
- [`LessThanValue`](LessThanValue.md) returns a Boolean less-than relationship after tolerance handling.

**External references**

- [Embarcadero `System.Math.Min`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Math.Min)
- [Free Pascal `Min`](https://www.freepascal.org/docs-html/rtl/math/min.html) - overload compatibility context; current Delphi source defines Velox's `NaN` and signed-zero results.

<small>Created 2026-07-15</small>
