---
title: "MoreThanValueEpsilon"
description: "Tests whether one Extended value orders above another after an explicit-tolerance comparison."
sidebar_position: 24
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
Function MoreThanValueEpsilon( const A, B : Extended; Epsilon : Extended): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := MoreThanValueEpsilon(10.25, 10.0, 0.1);
end;
```

### Usage

`MoreThanValueEpsilon` tests whether one Extended value orders above another after an explicit-tolerance comparison.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `A` | `Extended`, `const` | Left-hand value. |
| `B` | `Extended`, `const` | Right-hand value. |
| `Epsilon` | `Extended` | Maximum absolute difference treated as equal. Zero requests Velox's calculated default; a negative or `NaN` tolerance is not useful. |

**Returns**

For ordinary finite values and a positive epsilon, `True` when `A` is greater than `B` by more than `Epsilon`; otherwise `False`.

**Behaviour**

A positive epsilon represents an absolute numeric tolerance in the same units as the inputs. Values whose difference is exactly epsilon are same and return `False` here. Use a domain-derived tolerance rather than an arbitrary small number.

**Errors**

The Velox routine does not reject negative, infinite or `NaN` tolerances. Treat them as invalid at the configuration boundary. Values that cannot convert to `Extended` can fail before entry.

**Usage notes**

Validate `Epsilon > 0` and all three values as finite when the business rule requires conventional approximate ordering. For decimal amounts, define minor-unit or rounding rules instead of relying on binary epsilon alone.

### Additional Technical Info
`MoreThanValueEpsilon` returns the greater-than branch of Delphi's `Extended` comparison after applying the supplied absolute tolerance.

The example returns `True` because the difference is greater than `0.1`. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

`vxCommonNumber.MoreThanValueEpsilon` calls `System.Math.CompareValue(A, B, Epsilon)` using the `Extended` overload and tests for `GreaterThanValue`. `CompareValue` calls `SameValue`; if the values are not same, it returns less when `A < B` and greater otherwise.

The equality boundary is inclusive. Passing `0` does not request exact comparison: Delphi replaces zero with its magnitude-scaled default tolerance.

**Edge cases and quirks**

- A negative epsilon makes `SameValue` false even for equal finite values because a non-negative difference cannot be less than or equal to a negative tolerance. Equal operands then reach the greater branch, so this function returns `True`.
- A `NaN` epsilon also disables the same test and causes equal finite operands to reach the greater branch.
- A zero epsilon selects Delphi's platform-dependent default rather than exact equality.
- With `NaN` in either operand, same and `<` are false, so the wrapper returns `True`.
- Equal same-signed infinities also reach the greater branch because infinity minus itself is `NaN`.
- An infinite positive epsilon makes every finite difference same. Infinite operands can still produce `NaN` differences and escape that result.
- `Extended` conversion and precision vary by platform even when the explicit epsilon value is the same.

**Side effects**

None.

**Performance and concurrency**

The operation is constant-time, allocates no managed data and uses no shared mutable state.

**Related entries**

- [`MoreThanValue`](MoreThanValue.md) uses Delphi's calculated tolerance.
- [`CompareValueEpsilon`](CompareValueEpsilon.md) exposes all three explicit-tolerance results.
- [`SameValueEpsilon`](SameValueEpsilon.md) tests the inclusive same branch.
- [`LessThanValueEpsilon`](LessThanValueEpsilon.md) tests the opposite branch.

**External references**

- [Embarcadero `System.Math.CompareValue`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Math.CompareValue)
- [Free Pascal `CompareValue`](https://www.freepascal.org/docs-html/rtl/math/comparevalue.html) - compatibility context; current Delphi source defines the zero, invalid-epsilon and exceptional-value behaviour used by Velox.

<small>Created 2026-07-15</small>
