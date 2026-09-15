---
title: "IsZero"
description: "Tests whether an Extended value is within Delphi's calculated default tolerance of zero."
sidebar_position: 15
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
Function IsZero( const A : Extended): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := IsZero(0.0);
end;
```

### Usage

`IsZero` tests whether an Extended value is within Velox's calculated default tolerance of zero.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `A` | `Extended`, `const` | Value to compare with zero. |

**Returns**

`True` when `Abs(A)` is less than or equal to the calculated tolerance; otherwise `False`.

**Behaviour**

The test is tolerant and inclusive. A small nonzero value can therefore return `True`. It does not inspect the value's bit pattern and it is not equivalent to `A = 0`.

**Important usage notes**

- Win32 and Win64 can classify the same small value differently because their `Extended` resolutions differ.
- Positive and negative values are treated symmetrically through `Abs`.
- `NaN` returns `False` because its absolute value cannot satisfy the comparison.
- Positive or negative infinity returns `False` with the finite default tolerance.
- A value produced by earlier arithmetic may already have rounded differently before it reaches this call.

**Usage notes**

Use this function for machine-level near-zero checks where Velox's resolution is suitable. Use [`IsZeroEpsilon`](IsZeroEpsilon.md) when the accepted magnitude is a business or interface rule, and use explicit decimal/minor-unit logic for currency.

### Additional Technical Info
`IsZero` reports whether an `Extended` value is within Delphi's calculated default tolerance of zero. Velox calls the `Extended` overload of `System.Math.IsZero` through a thin wrapper.

The example returns `True`. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The Velox wrapper calls `System.Math.IsZero(A)`. With the default epsilon sentinel, the `Extended` implementation uses `ExtendedResolution` as the tolerance. Current Delphi defines this as `1E-16` for a true 80-bit `Extended` and `1E-12` where `Extended` aliases `Double`.

**Side effects**

None.

**Errors**

There is no normal data-dependent exception. Converting a nonnumeric script value to `Extended` can raise before the function is called.

**Performance and concurrency**

The operation is constant-time, allocation-free and re-entrant.

**Related entries**

- [`IsZeroEpsilon`](IsZeroEpsilon.md) supplies the allowed absolute magnitude.
- [`CompareValue`](CompareValue.md) compares two values using the same default-tolerance family.
- [`IsNullorZero`](IsNullorZero.md) performs a different Variant equality operation and must not be treated as equivalent.

**External references**

- [Embarcadero `System.Math.IsZero`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Math.IsZero)
- [Free Pascal `IsZero`](https://www.freepascal.org/docs-html/rtl/math/iszero.html) — compatibility context; current Delphi source uses an inclusive boundary.

<small>Created 2026-07-15</small>
