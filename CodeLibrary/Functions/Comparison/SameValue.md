---
title: "SameValue"
description: "Tests whether two Extended values differ by no more than Delphi's calculated default tolerance."
sidebar_position: 28
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
Function SameValue( const A, B : Extended): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := SameValue(10.0, 10.0);
end;
```

### Usage

`SameValue` tests whether two Extended values differ by no more than Velox's calculated default tolerance.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `A` | `Extended`, `const` | First value. |
| `B` | `Extended`, `const` | Second value. |

**Returns**

For ordinary finite operands, `True` when their absolute difference is less than or equal to Velox's calculated tolerance; otherwise `False`.

**Behaviour**

The tolerance scales from the smaller operand magnitude and has a platform-resolution floor. Equal finite values and positive/negative zero are same. A finite difference exactly on the tolerance boundary is also same.

**Errors**

The function does not raise merely because an operand is infinite or `NaN`; it returns the source-defined Boolean. A caller value that cannot convert to `Extended` can fail before entry.

**Usage notes**

Validate operands as finite when exceptional IEEE values are possible. Use [`SameValueEpsilon`](SameValueEpsilon.md) when the domain supplies an explicit allowed difference, and use decimal rounding/minor-unit rules for monetary equality.

### Additional Technical Info
`SameValue` performs approximate equality for two `Extended` values using Delphi's calculated default tolerance. It is not bitwise equality and does not apply decimal rounding.

The example returns `True`. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

`vxCommonNumber.SameValue` calls the `Extended` overload of `System.Math.SameValue(A, B)`. With its omitted/default `Epsilon = 0`, current Delphi source calculates:

```text
Epsilon = max(min(abs(A), abs(B)) * ExtendedResolution,
              ExtendedResolution)
```

It then subtracts the smaller value from the larger and uses an inclusive `<= Epsilon` comparison. `ExtendedResolution` is `1E-16` when `Extended` is a true 80-bit type and `1E-12` when it aliases `Double`.

**Edge cases and quirks**

- Win32 and Win64 can calculate different tolerances for the same source literals because `Extended` precision and `ExtendedResolution` differ.
- Near zero, the resolution floor can treat distinct small values as same.
- Any `NaN` operand returns `False`; subtraction/comparison with `NaN` never satisfies the inclusive boundary.
- Equal same-signed infinities return `False` because infinity minus itself is `NaN`.
- Opposite infinities are a surprising default-tolerance case: both absolute magnitudes are infinite, so the calculated epsilon becomes positive infinity and the infinite difference satisfies `<= Epsilon`. They can therefore return `True`.
- A finite value and an infinity return `False` because the calculated tolerance is based on the finite magnitude.
- Signed zero is not distinguished. Use a representation-level test if the sign bit matters.

**Side effects**

None.

**Performance and concurrency**

The operation is constant-time, allocates no managed data and uses no shared mutable state.

**Related entries**

- [`SameValueEpsilon`](SameValueEpsilon.md) accepts an explicit tolerance.
- [`CompareValue`](CompareValue.md) uses this same test before returning an ordering.
- [`IsZero`](IsZero.md) compares one value against zero with the resolution floor.

**External references**

- [Embarcadero `System.Math.SameValue`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Math.SameValue)
- [Free Pascal `SameValue`](https://www.freepascal.org/docs-html/rtl/math/samevalue.html) - compatibility context; current Delphi constants and `Extended` representation define Velox's exact tolerance.

<small>Created 2026-07-15</small>
