---
title: "Cos"
description: "Returns the cosine of an Extended angle expressed in radians."
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - mathematics
  - cosine
  - radians
---

```Delphi
function Cos(E: Extended): Extended;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Cos(Pi); // approximately -1
end;
```

### Usage

Returns the cosine of an Extended angle expressed in radians.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `E` | `Extended` | Angle in radians. Convert degrees with `Degrees * Pi / 180` before calling. |

**Returns**

An `Extended` approximation of the cosine. Do not normally test the result for exact equality: even values such as `Cos(Pi / 2)` can be a very small non-zero number after range reduction and rounding.

### Additional Technical Info
`Cos` returns the cosine of an angle expressed in radians. For finite input, the mathematical result is in the interval -1 through 1, subject to floating-point approximation.

This is the PascalScript standard function and delegates directly to Delphi's `System.Cos`. It does not interpret degrees. The example is fictional and source-reviewed only.

**Implementation**

1. The modified PascalScript compiler declares `Cos` in its standard Math group.
2. Runtime selector 16 obtains an `Extended` through `Stack.GetReal`.
3. Delphi `System.Cos` performs the platform-specific trigonometric calculation and PascalScript stores the returned real value.

The product project targets both Win32 and Win64 and currently defaults to Win64. The Win32 RTL path ultimately uses the x87 cosine instruction; the Win64 path treats `Extended` as `Double` and uses the RTL's double-precision range-reduction implementation. No Velox wrapper alters the argument or result.

**Edge cases and quirks**

- Input is in radians, not degrees. One complete revolution is `2 * Pi`.
- Cosine is even: within rounding error, `Cos(-E)` equals `Cos(E)`.
- Very large finite angles require range reduction. Their low-order angle information may already have been lost in the input, so accuracy can be much worse than for a small equivalent angle.
- On Win32, x87 `FCOS` has a finite argument-reduction limit. Outside its supported approximately +/-2^63-radian range it sets its C2 status flag and leaves the operand unchanged; this wrapper does not inspect C2, so it can return the original huge value rather than a result in -1 through 1. Reduce large angles before calling.
- Positive infinity, negative infinity and NaN do not have a finite cosine. They can produce NaN and an invalid floating-point condition.
- `Extended` has target-dependent precision; a 64-bit Delphi target commonly treats it as `Double`.

**Errors and side effects**

The function is pure. For ordinary finite input it has no external side effects and no Velox-specific error path. Whether an invalid or other floating-point condition returns a special IEEE value or raises depends on the process's active floating-point exception mask; the PascalScript dispatch does not catch it.

**Performance**

Each call performs a real trigonometric operation. Avoid recomputing the same invariant angle inside a high-volume record loop when the value can be calculated once and reused.

**Related entries**

- [`Sin`](Sin.md) returns the sine of a radian angle.
- [`Pi`](Pi.md) supplies the circle constant used for angle conversion.

**External references**

- [Free Pascal: `System.Cos`](https://www.freepascal.org/docs-html/rtl/system/cos.html)
- [Embarcadero DocWiki: `System.Cos`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Cos)

<small>Created 2026-07-15</small>
