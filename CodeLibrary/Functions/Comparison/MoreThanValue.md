---
title: "MoreThanValue"
description: "Tests whether one Extended value orders above another after Delphi's default-tolerance comparison."
sidebar_position: 23
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - floating-point
  - epsilon
  - greater-than
---

```Delphi
Function MoreThanValue( const A, B : Extended): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := MoreThanValue(10.25, 10.0);
end;
```

### Usage

`MoreThanValue` tests whether one Extended value orders above another after Velox's default-tolerance comparison.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `A` | `Extended`, `const` | Left-hand value. |
| `B` | `Extended`, `const` | Right-hand value. |

**Returns**

For ordinary finite values, `True` when `A` is greater than `B` by more than the calculated default tolerance; otherwise `False`.

**Behaviour**

Values exactly on the calculated boundary are treated as equal, so this function returns `False`. The resolution is approximately `1E-16` when Velox uses a true 80-bit `Extended` and `1E-12` where `Extended` aliases `Double`.

**Errors**

Finite, infinite and `NaN` operands have no expected exception path. A caller value that cannot be converted to `Extended` can fail before entry.

**Usage notes**

Use this function when approximate numeric ordering is intentional. Use a finite-value check plus a direct comparison when IEEE exceptional values or exact ordering must be handled explicitly.

### Additional Technical Info
`MoreThanValue` returns the greater-than branch of Delphi's tolerance-aware `Extended` comparison. It is not the same as the raw Pascal `A > B` operator near the calculated tolerance boundary.

The example returns `True`. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

`vxCommonNumber.MoreThanValue` calls the `Extended` overload of `System.Math.CompareValue(A, B)` and tests whether the result is Delphi's `GreaterThanValue` relationship (named `MoreThan` by the wrapper's imported constants).

`CompareValue` first calls `SameValue`. With the default `Epsilon = 0`, current Delphi source calculates:

```text
Epsilon = max(min(abs(A), abs(B)) * ExtendedResolution,
              ExtendedResolution)
```

It returns equal when the absolute difference is within that inclusive boundary, less when `A < B`, and greater otherwise.

**Edge cases and quirks**

- The default tolerance and therefore a boundary result can differ between Win32 and Win64.
- `NaN` is not same and `<` is false. Current `CompareValue` therefore selects its greater branch for `NaN` in either operand, so this wrapper returns `True`. Validate finiteness before comparing untrusted numeric data.
- Equal same-signed infinities subtract to `NaN`, are not same and also reach the greater branch; `MoreThanValue(+Infinity, +Infinity)` is `True` in the current implementation.
- Opposite infinities with default epsilon can calculate an infinite tolerance and compare as same, so neither direction is reliably a mathematical greater-than test.
- Near-zero values can compare as same because the tolerance never falls below `ExtendedResolution`.

**Side effects**

None.

**Performance and concurrency**

The operation is constant-time, allocates no managed data and uses no shared mutable state.

**Related entries**

- [`MoreThanValueEpsilon`](MoreThanValueEpsilon.md) supplies an explicit tolerance.
- [`CompareValue`](CompareValue.md) exposes the three relationship results.
- [`LessThanValue`](LessThanValue.md) tests the opposite default-tolerance relationship.
- [`SameValue`](SameValue.md) tests the equal branch directly.

**External references**

- [Embarcadero `System.Math.CompareValue`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Math.CompareValue)
- [Free Pascal `CompareValue`](https://www.freepascal.org/docs-html/rtl/math/comparevalue.html) - compatibility context; current Delphi `Extended` source and constants define Velox's exact exceptional-value results.

<small>Created 2026-07-15</small>
