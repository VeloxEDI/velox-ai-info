---
title: "IsZeroEpsilon"
description: "Tests whether an Extended value is within an explicit tolerance of zero."
sidebar_position: 16
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - floating-point
  - zero
  - epsilon
---

```Delphi
Function IsZeroEpsilon( const A : Extended; Epsilon : Extended): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := IsZeroEpsilon(0.0004, 0.001);
end;
```

### Usage

`IsZeroEpsilon` tests whether an Extended value is within an explicit tolerance of zero.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `A` | `Extended`, `const` | Value whose magnitude is tested. |
| `Epsilon` | `Extended` | Allowed absolute magnitude. Use a finite positive value for predictable explicit behaviour. |

**Returns**

`True` when `Abs(A) <= Epsilon` after Velox has resolved the epsilon sentinel; otherwise `False`.

**Behaviour**

For a finite positive epsilon, positive and negative values at or inside the boundary return `True`. Values outside it return `False`. The supplied tolerance uses the same units as `A` and is absolute rather than percentage-based.

**Errors**

The function does not validate the epsilon. Conversion of nonnumeric arguments to `Extended` can raise before it is entered.

**Usage notes**

Store a domain epsilon with its unit and rationale. If the rule is relative to the value's size, calculate the relative threshold explicitly before calling or use a comparison designed for that rule.

### Additional Technical Info
`IsZeroEpsilon` tests whether an `Extended` value lies within an explicit absolute tolerance of zero. The example returns `True`. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The Velox wrapper calls `System.Math.IsZero(A, Epsilon)` using the `Extended` overload. A supplied `Epsilon` of zero is not an exact-zero request: Delphi replaces it with the platform's `ExtendedResolution` before performing the inclusive comparison.

**Edge cases and quirks**

- `Epsilon = 0` selects the platform default (`1E-16` for true 80-bit `Extended`, otherwise `1E-12` in current Delphi), so a small nonzero value can still return `True`.
- A negative epsilon returns `False` even for zero. Validate the tolerance instead of using a negative number to mean "disabled".
- `NaN` returns `False` for any ordinary epsilon.
- An infinite positive epsilon makes every finite value pass and can also make infinity pass under the floating-point comparison. Reject it as a configuration tolerance.
- An epsilon supplied as `NaN` makes the comparison false.
- A finite explicit epsilon makes the rule clearer across architectures, although input evaluation still uses the platform's `Extended` representation.

**Side effects**

None.

**Performance and concurrency**

The operation is constant-time, allocation-free and re-entrant.

**Related entries**

- [`IsZero`](IsZero.md) uses the calculated platform default.
- [`CompareValueEpsilon`](CompareValueEpsilon.md) compares two values with an explicit tolerance.
- [`LessThanValueEpsilon`](LessThanValueEpsilon.md) applies the same comparison family to ordering.

**External references**

- [Embarcadero `System.Math.IsZero`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Math.IsZero)
- [Free Pascal `IsZero`](https://www.freepascal.org/docs-html/rtl/math/iszero.html) — general compatibility reference; Delphi's inclusive implementation is authoritative here.

<small>Created 2026-07-15</small>
