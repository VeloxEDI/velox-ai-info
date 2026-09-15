---
title: "Sin"
description: "Returns the sine of an Extended angle expressed in radians."
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - mathematics
  - sine
  - radians
---

```Delphi
function Sin(E: Extended): Extended;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Sin(Pi / 2); // approximately 1
end;
```

### Usage

Returns the sine of an Extended angle expressed in radians.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `E` | `Extended` | Angle in radians. Convert degrees with `Degrees * Pi / 180` before calling. |

**Returns**

An `Extended` approximation of the sine. Results near zero should normally be compared with a tolerance rather than exact equality; for example, `Sin(Pi)` need not be stored as exact zero.

### Additional Technical Info
`Sin` returns the sine of an angle expressed in radians. For finite input, the mathematical result is in the interval -1 through 1, subject to floating-point approximation.

This is the PascalScript standard function and delegates directly to Delphi's `System.Sin`. It does not interpret degrees. The example is fictional and source-reviewed only.

**Implementation**

1. The modified PascalScript compiler declares `Sin` in its standard Math group.
2. Runtime selector 15 obtains the argument through `Stack.GetReal`.
3. Delphi `System.Sin` performs the target-specific trigonometric calculation.
4. PascalScript stores the real result without a Velox transformation.

The product project targets both Win32 and Win64 and currently defaults to Win64. The Win32 RTL path ultimately uses the x87 sine instruction; the Win64 path treats `Extended` as `Double` and uses the RTL's double-precision range-reduction implementation.

**Edge cases and quirks**

- Input is in radians, not degrees. One complete revolution is `2 * Pi`.
- Sine is odd: within rounding error, `Sin(-E)` equals `-Sin(E)`.
- Very large finite angles lose useful low-order phase information and require range reduction, so accuracy can be materially worse than for a small equivalent angle.
- On Win32, x87 `FSIN` has a finite argument-reduction limit. Outside its supported approximately +/-2^63-radian range it sets its C2 status flag and leaves the operand unchanged; this wrapper does not inspect C2, so it can return the original huge value rather than a result in -1 through 1. Reduce large angles before calling.
- Positive infinity, negative infinity and NaN do not have a finite sine. They can produce NaN and an invalid floating-point condition.
- `Extended` has target-dependent precision; a 64-bit Delphi target commonly treats it as `Double`.

**Errors and side effects**

The function is pure. For ordinary finite input it has no external side effects and no Velox-specific error path. Whether an invalid floating-point condition returns a special IEEE value or raises depends on the active process exception mask; the PascalScript dispatch does not catch it.

**Performance**

Each call performs a real trigonometric operation. Calculate an invariant angle once rather than repeatedly inside a high-volume mapping loop.

**Related entries**

- [`Cos`](Cos.md) returns the cosine of a radian angle.
- [`Pi`](Pi.md) supplies the circle constant used for angle conversion.

**External references**

- [Free Pascal: `System.Sin`](https://www.freepascal.org/docs-html/rtl/system/sin.html)
- [Embarcadero DocWiki: `System.Sin`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Sin)

<small>Created 2026-07-15</small>
