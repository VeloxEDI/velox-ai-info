---
title: "CompareValue"
description: "Returns the ordering of two Extended values using Delphi's calculated default tolerance."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - floating-point
  - epsilon
  - ordering
---

```Delphi
Function CompareValue( const A, B : Extended): Integer
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := CompareValue(10.0, 10.0);
end;
```

### Usage

`CompareValue` returns the ordering of two Extended values using Velox's calculated default tolerance.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `A` | `Extended`, `const` | Left-hand numeric value. |
| `B` | `Extended`, `const` | Right-hand numeric value. |

**Returns**

| Value | Meaning |
|---|---|
| `-1` | `A` is less than `B` after applying the tolerance. |
| `0` | `A` and `B` are within the calculated tolerance. |
| `1` | `A` is neither within tolerance nor less than `B`. For ordinary finite values this means greater than. |

**Behaviour**

The comparison is symmetric for normal finite values. Values whose absolute difference is exactly the calculated epsilon compare as equal because the boundary is inclusive. The tolerance scales from the smaller operand magnitude and never falls below the platform resolution.

This is an approximate numeric comparison, not a bitwise identity test and not a decimal/business rounding rule.

**Errors**

There is no normal data-dependent exception for finite, infinity or `NaN` operands. A nonnumeric Variant supplied by a caller must first be converted to `Extended` and can raise before this function is entered.

**Usage notes**

Use [`CompareValueEpsilon`](CompareValueEpsilon.md) when the integration rule defines an allowed absolute difference. Neither form should replace currency minor-unit rules, decimal rounding or explicit finite-value validation.

### Additional Technical Info
`CompareValue` returns `-1`, `0` or `1` after comparing two `Extended` values with Delphi's calculated default tolerance. It is a Velox wrapper around the `Extended` overload of `System.Math.CompareValue`.

The example returns `0`. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The wrapper calls `System.Math.CompareValue(A, B)`. Delphi first calls `SameValue`. For the `Extended` overload and default `Epsilon = 0`, current source calculates approximately:

```text
Epsilon = max(min(abs(A), abs(B)) * ExtendedResolution,
              ExtendedResolution)
same    = abs(A - B) <= Epsilon
```

If the values are not the same, the implementation returns `-1` when `A < B`; otherwise it returns `1`.

`ExtendedResolution` is `1E-16` where Delphi uses a true 80-bit `Extended` and `1E-12` where `Extended` aliases `Double`. Current Win32 and Win64 builds can therefore have different calculated tolerances.

**Edge cases and quirks**

- The default tolerance depends on the deployed platform's representation of `Extended`. Re-test boundary-sensitive flows when changing architecture.
- Near zero, the minimum tolerance is the platform's `ExtendedResolution`; two distinct small values can therefore compare equal.
- `NaN` is never same and `NaN < B` is false, so a `NaN` left operand produces `1`. A finite left operand compared with a `NaN` right operand also normally produces `1`. This is not a total mathematical ordering.
- Equal same-signed infinities subtract to `NaN`, do not compare as same and then produce `1` because `<` is false.
- Opposite or finite/infinite operands follow floating-point subtraction and `<` rules; do not use this routine to validate whether a value is finite.
- The result constants are exact, but callers should still use the semantic tests `= 0`, `< 0` or `> 0` when only relationship matters.

**Side effects**

None. The wrapper and Delphi comparison do not mutate either input.

**Performance and concurrency**

The operation is constant-time, allocates no managed data and uses no mutable shared state. Floating-point results still depend on operand values and platform precision.

**Related entries**

- [`CompareValueEpsilon`](CompareValueEpsilon.md) supplies an explicit tolerance.
- [`IsZero`](IsZero.md) compares one value with zero using the same default-resolution family.
- [`LessThanValue`](LessThanValue.md) returns a Boolean from this ordering operation.

**External references**

- [Embarcadero `System.Math.CompareValue`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Math.CompareValue)
- [Free Pascal `CompareValue`](https://www.freepascal.org/docs-html/rtl/math/comparevalue.html) — compatibility reference; current Delphi `Extended` source and platform constants define Velox's exact result.

<small>Created 2026-07-15</small>
