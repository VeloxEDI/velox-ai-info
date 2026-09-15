---
title: "Round2BR"
description: "Rounds at a decimal position by scaling through Double and applying Delphi nearest-even Round."
sidebar_position: 18
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - numeric
  - rounding
  - bankers-rounding
---

```Delphi
function Round2BR(aValue: Extended; aDP: Integer): Extended;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Round2BR(12.25, 1); // normally 12.2: scaled 122.5 ties to even 122
end;
```

### Usage

`Round2BR` rounds at a decimal position by scaling through Double and applying Velox nearest-even Round.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aValue` | `Extended` | Value to round. |
| `aDP` | `Integer` | Decimal-place scale: positive for fractional digits, zero for units and negative for tens/hundreds while scaling remains valid. |

**Returns**

An `Extended` rescaled result. Under default nearest/even rounding:

| Call | Typical result |
|---|---|
| `Round2BR(12.25, 1)` | `12.2` because `122.5 -> 122` |
| `Round2BR(12.35, 1)` | potentially `12.4`, subject to binary representation of the scaled midpoint |
| `Round2BR(155, -1)` | `160` because `15.5 -> 16` |
| `Round2BR(145, -1)` | `140` because `14.5 -> 14` |

### Additional Technical Info
`Round2BR` scales an `Extended` value by a power of ten, deliberately assigns the scaled value to Delphi `Real` (the modern `Double` alias), rounds that Double to `Int64` with `System.Round`, then divides by the scale.

Under the default rounding mode it uses banker's/nearest-even rounding. The intentional Double conversion changes precision before rounding and was added to address a particular decimal-boundary case in product code; it does not make binary floating point decimal-exact. The example is fictional and source-reviewed only.

**Implementation**

```Delphi
Nominator := Power(10, aDP);
x := aValue * Nominator; // x: Real (Double)
Result := Round(x) / Nominator;
```

`Power` is the native Velox wrapper over `System.Math.Power`. `Round` here is Delphi `System.Round` returning `Int64`, not the PascalScript [`Round`](Round.md) wrapper with unchecked 32-bit narrowing.

**Edge cases and quirks**

- Midpoint behavior follows the active floating-point rounding mode. Nearest/even is the normal default but is not forced here.
- On Win32, assigning scaled `Extended` to `Real` loses 80-bit precision before rounding. On Win64, `Extended` already aliases Double.
- Decimal literals and their scaled values may fall just above or below the mathematical midpoint in binary; the apparent last decimal digit alone is not a guarantee.
- Extreme positive `aDP` can overflow during scaling or push `Round(x)` outside `Int64`. Extreme negative `aDP` can underflow the scale and make final division invalid.
- The [`Power`](../Math/Power.md) target-specific extreme-exponent behavior is inherited.
- NaN/infinity and invalid conversions propagate according to Delphi's floating-point exception handling.

**Performance and side effects**

The function is pure and constant-time. It performs power/scaling, a precision conversion and an integer conversion on every call.

**Related entries**

- [`Round2`](Round2.md) uses a non-standard six-tenths threshold.
- [`Round2Up`](Round2Up.md) uses text and midpoint-away-from-zero semantics for supported input.
- [`RoundAs`](RoundAs.md) dispatches to this function with token `ROUND2BR`.

**External references**

- [Free Pascal: `System.Round`](https://www.freepascal.org/docs-html/rtl/system/round.html)
- [Embarcadero DocWiki: `System.Round`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Round)

<small>Created 2026-07-15</small>
