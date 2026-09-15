---
title: "NthRoot"
description: "Computes an nth root of a positive Extended value through base-10 logarithm and exponentiation."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - mathematics
  - root
  - logarithm
---

```Delphi
function NthRoot(const aN: Integer; const aValue: Extended): Extended;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := NthRoot(3, 125); // approximately 5
end;
```

### Usage

`NthRoot` computes an nth root of a positive Extended value through base-10 logarithm and exponentiation.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aN` | `Integer`, `const` | Root degree. Must be non-zero. Positive values produce a root and negative values produce its reciprocal. The degree is the first argument. |
| `aValue` | `Extended`, `const` | Radicand. Velox requires a strictly positive value because it calls `Log10` first. |

**Returns**

A positive `Extended` approximation of `aValue` raised to `1 / aN` when `aValue > 0` and `aN <> 0`.

| Call | Intended result |
|---|---|
| `NthRoot(2, 81)` | approximately `9` |
| `NthRoot(3, 125)` | approximately `5` |
| `NthRoot(-2, 81)` | approximately `1 / 9` |
| `NthRoot(1, X)` | approximately `X`, potentially with avoidable rounding |

### Additional Technical Info
`NthRoot` calculates an nth root for a positive `Extended` value. A positive `aN` requests a root; a negative `aN` requests the reciprocal of that root.

The implementation is logarithmic rather than a dedicated root algorithm. It evaluates `Power(10, Log10(aValue) / aN)`, which creates important domain and precision constraints. The example is fictional and source-reviewed only.

**Implementation**

1. `uPSI_vxCommonNumber` declares the function in the Math group and registers the native `vxCommonNumber.NthRoot` address directly.
2. `NthRoot` calls Delphi `System.Math.Log10(aValue)`.
3. It divides that logarithm by the integer `aN` using floating-point division.
4. It calls Delphi `System.Math.Power(10, quotient)` and returns the result unchanged.

There is no explicit argument validation and no alternative path for zero or negative radicands.

**Domain and selection guidance**

- Use only when `aValue > 0` and `aN <> 0`.
- Prefer [`Sqrt`](Sqrt.md) for square roots. `Sqrt` directly supports zero and avoids the extra logarithm/exponentiation round trips.
- This implementation cannot calculate an odd root of a negative number. For example, `NthRoot(3, -125)` reaches `Log10(-125)` and is invalid even though the real mathematical cube root is `-5`.
- If a negative odd-root result is required, validate the input and explicitly apply the sign around `NthRoot(aN, Abs(aValue))`.

**Edge cases and quirks**

- `aN = 0` divides a floating-point logarithm by zero. For `aValue = 1`, the intermediate operation is `0 / 0`; for other valid values it is a non-zero value divided by zero. Either is outside the supported domain.
- `aValue = 0` calls `Log10(0)` before exponentiation and can signal divide-by-zero or produce negative infinity under a masked floating-point environment. Do not rely on a downstream apparent zero result.
- `aValue < 0` calls `Log10` outside its real domain and can signal invalid operation or produce NaN.
- `aValue = 1` returns 1 for supported non-zero degrees, subject to floating-point processing.
- Even `aN = 1` takes the logarithm and power path, so the returned bits need not equal the input bits.
- Very large or very small values can accumulate logarithm, division and exponentiation error, and can overflow or underflow.

**Errors and side effects**

The function is pure and allocates no Velox objects. Floating-point domain, division, overflow and underflow conditions are not caught. Depending on the active Delphi floating-point exception mask, a condition can raise into the script or produce an infinity/NaN/zero special result. Scripts should validate the domain rather than depend on a particular mask.

**Related entries**

- [`Sqrt`](Sqrt.md) is the preferred direct square-root operation.
- [`Power`](Power.md) accepts only an integer exponent and therefore cannot directly express `1 / aN`.
- [`Abs`](Abs.md) can support an explicitly sign-managed odd-root calculation.

**External references**

- [Free Pascal: `Math.Log10`](https://www.freepascal.org/docs-html/rtl/math/log10.html)
- [Free Pascal: `Math.Power`](https://www.freepascal.org/docs-html/rtl/math/power.html)
- [Embarcadero DocWiki: `System.Math.Log10`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Math.Log10)
- [Embarcadero DocWiki: `System.Math.Power`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Math.Power)

<small>Created 2026-07-15</small>
