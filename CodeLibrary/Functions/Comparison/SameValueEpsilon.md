---
title: "SameValueEpsilon"
description: "Tests whether two Extended values differ by no more than an explicit tolerance."
sidebar_position: 29
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - comparison
  - floating-point
  - epsilon
  - equality
---

```Delphi
Function SameValueEpsilon( const A, B : Extended; Epsilon : Extended): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := SameValueEpsilon(10.0, 10.04, 0.05);
end;
```

### Usage

`SameValueEpsilon` tests whether two Extended values differ by no more than an explicit tolerance.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `A` | `Extended`, `const` | First value. |
| `B` | `Extended`, `const` | Second value. |
| `Epsilon` | `Extended` | Maximum absolute difference accepted as same. Zero selects Velox's calculated default. |

**Returns**

For finite operands and a positive finite epsilon, `True` when the absolute difference is less than or equal to `Epsilon`; otherwise `False`.

**Behaviour**

The boundary is inclusive. Epsilon is expressed in the same numeric units as the operands and is not automatically converted to an absolute value. A zero epsilon means default approximate equality, not exact equality.

**Errors**

The Velox function does not reject negative, infinite or `NaN` epsilon values with an exception. Validate the tolerance before calling. Values that cannot convert to `Extended` can fail before entry.

**Usage notes**

For conventional approximate equality, require a positive finite epsilon derived from the data domain and finite operands. For monetary values, prefer explicit decimal rounding or minor-unit comparison.

### Additional Technical Info
`SameValueEpsilon` performs approximate equality for two `Extended` values using the supplied absolute tolerance.

The example returns `True`. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

`vxCommonNumber.SameValueEpsilon` delegates directly to the `Extended` overload of `System.Math.SameValue(A, B, Epsilon)`. Current source compares the non-negative directional difference with the supplied epsilon. Only an epsilon equal to zero is replaced by Delphi's magnitude-scaled default.

**Edge cases and quirks**

- A negative epsilon returns `False` even for equal finite values because `0 <= negative` is false.
- A `NaN` epsilon returns `False` for all operands.
- With positive-infinite epsilon, every finite pair returns `True`.
- A `NaN` operand returns `False` regardless of ordinary epsilon.
- Equal same-signed infinities return `False` because their difference is `NaN`, even when epsilon is infinite.
- Opposite infinities return `True` when epsilon is positive infinity, because their directional difference is infinity.
- Passing zero reintroduces the platform-dependent `ExtendedResolution` and magnitude scaling documented by [`SameValue`](SameValue.md).
- Parameter conversion remains platform-dependent because `Extended` can be 80-bit or an alias of `Double`.

**Side effects**

None.

**Performance and concurrency**

The operation is constant-time, allocates no managed data and uses no shared mutable state.

**Related entries**

- [`SameValue`](SameValue.md) calculates a default tolerance.
- [`CompareValueEpsilon`](CompareValueEpsilon.md) returns a three-way result using this same equality test.
- [`IsZeroEpsilon`](IsZeroEpsilon.md) compares one value with zero using an explicit tolerance.

**External references**

- [Embarcadero `System.Math.SameValue`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Math.SameValue)
- [Free Pascal `SameValue`](https://www.freepascal.org/docs-html/rtl/math/samevalue.html) - compatibility context; current Delphi source defines invalid-epsilon and exceptional-value results.

<small>Created 2026-07-15</small>
