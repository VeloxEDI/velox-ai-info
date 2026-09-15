---
title: "Round2"
description: "Rounds at a decimal position with a non-standard six-tenths threshold using scaled truncation."
sidebar_position: 17
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - numeric
  - rounding
  - threshold
---

```Delphi
function Round2(aValue: Extended; aDP: Integer): Extended;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Round2(1.265625, 1); // 1.3; the first discarded digit is 6
end;
```

### Usage

`Round2` rounds at a decimal position with a non-standard six-tenths threshold using scaled truncation.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aValue` | `Extended` | Value to round. |
| `aDP` | `Integer` | Decimal-place scale. Positive values address fractional places; zero addresses units; negative values can address tens/hundreds while the scale remains finite. |

**Returns**

The rescaled `Extended` result. Examples:

| Call | Result/reason |
|---|---|
| `Round2(1.25, 1)` | `1.2`; discarded digit 5 does not increment |
| `Round2(1.265625, 1)` | `1.3`; first discarded digit 6 increments |
| `Round2(-1.25, 1)` | `-1.2`; 5 remains toward zero |
| `Round2(-1.265625, 1)` | `-1.3`; first discarded digit 6 moves away from zero |
| `Round2(155, -1)` | `150` |
| `Round2(156, -1)` | `160` |

### Additional Technical Info
`Round2` scales a value to a requested decimal position, truncates it, and increments/decrements the retained integer only when the first discarded digit is 6 through 9.

Despite its name, this is not conventional half-up or nearest rounding: a discarded 5 does not round away from zero. The threshold is effectively six-tenths at the scaled position. The example is fictional and source-reviewed only.

**Implementation**

```Delphi
Nominator := Power(10, aDP);
x := aValue * Nominator;
Result := (Trunc(x) + (Trunc(Frac(x) * 10) div 6)) / Nominator;
```

The two `Trunc` calls here are native Delphi `Int64` operations inside `vxCommonNumber`, not the PascalScript [`Trunc`](Trunc.md) wrapper with 32-bit narrowing.

**Edge cases and quirks**

- Only the first discarded decimal digit affects the increment. For example, a scaled fraction near `0.5999` still truncates its first digit to 5 and does not round.
- Binary floating representation can place an intended decimal boundary just below/above 5 or 6.
- Scaling uses the custom [`Power`](../Math/Power.md) implementation and inherits its overflow, underflow, target and extreme-exponent behavior.
- If `x` cannot be converted by Delphi `Trunc` to `Int64`, a floating invalid-operation error propagates.
- If `Nominator` underflows to zero, final division can raise or produce a special value according to the floating exception mask.
- The operation is locale-independent but not decimal-exact; it uses binary `Extended` arithmetic.

**Performance and side effects**

The function is pure and constant-time. It performs exponentiation/scaling plus two integer conversions, so cache a repeated invariant scale/result if used in a high-volume loop.

**Related entries**

- [`Round2BR`](Round2BR.md) uses Double plus Delphi nearest/even rounding.
- [`Round2Up`](Round2Up.md) uses textual midpoint-away-from-zero logic.
- [`RoundAs`](RoundAs.md) selects among these named algorithms.

**External references**

- [Embarcadero DocWiki: `System.Trunc`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Trunc)
- [Free Pascal: `System.Trunc`](https://www.freepascal.org/docs-html/rtl/system/trunc.html)

<small>Created 2026-07-15</small>
