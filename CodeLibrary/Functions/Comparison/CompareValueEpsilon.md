---
title: "CompareValueEpsilon"
description: "Returns the ordering of two Extended values using an explicit comparison tolerance."
sidebar_position: 5
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
Function CompareValueEpsilon( const A, B : Extended; Epsilon : Extended): Integer
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := CompareValueEpsilon(1.0, 1.0005, 0.001);
end;
```

### Usage

`CompareValueEpsilon` returns the ordering of two Extended values using an explicit comparison tolerance.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `A` | `Extended`, `const` | Left-hand numeric value. |
| `B` | `Extended`, `const` | Right-hand numeric value. |
| `Epsilon` | `Extended` | Allowed absolute difference. Use a finite positive value for predictable explicit-tolerance behaviour. |

**Returns**

`-1` for less than, `0` for within tolerance and `1` for the remaining greater/unordered path. The zero boundary is inclusive: `Abs(A - B) = Epsilon` returns `0` for ordinary finite values.

**Behaviour**

A finite positive epsilon creates an absolute comparison band around either operand. Any finite pair whose absolute difference is less than or equal to that band returns `0`. Values outside the band order through the ordinary floating-point `<` operator.

The comparison does not scale a positive explicit epsilon with the operand magnitude. Choose units that match the values—for example, seconds, kilograms or a currency base unit—and record that rule in the configuration or map design.

**Errors**

The function does not reject negative, infinite or `NaN` tolerances. Validate configuration values before calling it. Conversion of script values to `Extended` can raise before entry when the inputs are not numeric.

### Additional Technical Info
`CompareValueEpsilon` returns `-1`, `0` or `1` after comparing two `Extended` values with the supplied absolute tolerance. The example returns `0` because the difference is within `0.001`. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The Velox wrapper calls `System.Math.CompareValue(A, B, Epsilon)` using the Delphi `Extended` overload. Delphi tests `SameValue(A, B, Epsilon)` first, then returns less than when `A < B`, otherwise greater than.

Despite the explicit parameter, `Epsilon = 0` is a sentinel. Delphi replaces it with the calculated default based on the smaller operand magnitude and `ExtendedResolution`; it does not request exact equality.

**Edge cases and quirks**

- `Epsilon = 0` uses Delphi's platform-dependent default tolerance. It cannot be used to request exact, bit-for-bit equality.
- A negative epsilon makes the inclusive difference test false even when two finite values are exactly equal. Equal values then return `1` because `A < B` is false. Treat negative epsilon as invalid input.
- Positive infinity as epsilon causes all finite differences, and some infinite differences, to classify as equal. It is not a sensible business tolerance.
- A `NaN` epsilon disables the same-value branch because no difference is less than or equal to `NaN`; ordinary finite operands then order only through `<`.
- `NaN` never satisfies the equality test and `<` is false, so the function returns `1`; this is an unordered-value artefact, not proof that `A` is greater.
- Same-signed infinities normally produce `NaN` from subtraction and return `1` unless unusual epsilon behaviour changes the first test.
- The explicit finite epsilon reduces architecture dependence, but the operands are still evaluated in the platform's `Extended` representation before comparison.

**Side effects**

None.

**Performance and concurrency**

The calculation is constant-time, allocation-free and re-entrant.

**Remarks**

An epsilon should express a real domain allowance, not merely hide floating-point uncertainty. For asymmetric thresholds or relative percentage tolerances, calculate that rule explicitly instead of treating this absolute band as equivalent.

**Related entries**

- [`CompareValue`](CompareValue.md) uses Delphi's calculated default tolerance.
- [`IsZeroEpsilon`](IsZeroEpsilon.md) applies an explicit tolerance around zero.
- [`LessThanValueEpsilon`](LessThanValueEpsilon.md) reduces this result to a Boolean less-than test.

**External references**

- [Embarcadero `System.Math.CompareValue`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Math.CompareValue)
- [Free Pascal `CompareValue`](https://www.freepascal.org/docs-html/rtl/math/comparevalue.html) — compatible context only; Delphi's shipped implementation is authoritative for Velox.

<small>Created 2026-07-15</small>
