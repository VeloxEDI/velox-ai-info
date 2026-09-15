---
title: "Power"
description: "Raises an Extended base to a signed Integer exponent through Delphi System.Math.Power."
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - mathematics
  - exponentiation
  - floating-point
---

```Delphi
function Power(const aValue: Extended; const aPower: Integer): Extended;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Power(2, 10); // 1024
end;
```

### Usage

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aValue` | `Extended`, `const` | Base value. Negative bases are supported for ordinary integer exponents. |
| `aPower` | `Integer`, `const` | Signed exponent. Fractional powers cannot be supplied through this Velox entry. |

**Returns**

`aValue` raised to `aPower` as an `Extended` value.

| Call | Result or rule |
|---|---|
| `Power(2, 10)` | `1024` |
| `Power(2, -3)` | `0.125` |
| `Power(-2, 3)` | `-8` |
| `Power(-2, 4)` | `16` |
| `Power(X, 0)` | `1`, including `X = 0` |

### Additional Technical Info
`Power` raises an `Extended` base to a signed `Integer` exponent. Positive exponents multiply powers of the base, zero returns 1, and negative exponents return the reciprocal of the corresponding positive power.

The Velox declaration deliberately exposes only an integer exponent even though its terminal Delphi routine accepts a real exponent. Use [`NthRoot`](NthRoot.md) for supported positive-value roots. The example is fictional and source-reviewed only.

**Implementation**

1. `uPSI_vxCommonNumber` declares `Power` in the Math group and registers `vxCommonNumber.Power` directly.
2. The wrapper calls `System.Math.Power(aValue, aPower)`. Overload resolution selects the real-exponent `Extended` routine and converts `aPower` to `Extended`.
3. For an integral exponent whose magnitude is no greater than `MaxInt`, Delphi uses exponentiation by squaring, then takes the reciprocal when the exponent is negative.
4. On Win64, this is the Pascal `IntPower` branch after explicit exponent-zero and zero/positive shortcuts. On Win32, equivalent logic is in the x87 assembly body and the integer/magnitude test occurs first.

No Velox validation or rounding is applied.

**Edge cases and quirks**

- Both target paths return `1` for exponent zero. Consequently `Power(0, 0)` returns `1`; do not use it as a domain validation test.
- On the default Win64 target, zero with a positive exponent returns positive zero before the integer-power branch, so a negative-zero sign is not retained. Win32 reaches its integer x87 path: an odd positive exponent can retain negative zero, while an even exponent produces positive zero.
- Zero with a negative exponent requires division by zero after the integer calculation and is outside the supported finite domain.
- Negative bases work because the public exponent is integral, except for the single `Low(Integer)` value. Its magnitude is `MaxInt + 1`, so Delphi does not take the integer branch: a negative base is then rejected by the general real-power path.
- With `aPower = Low(Integer)` and a positive base, Delphi uses its general logarithm/exponentiation path instead of exponentiation by squaring. This can be slower and has different rounding/overflow-underflow characteristics.
- `Power(0, Low(Integer))` is target-dependent and unsupported: Win32's general x87 branch takes its zero shortcut and returns zero, while Win64 evaluates the logarithm/exponential path and can raise or tend toward positive infinity with masked conditions. Validate zero before every negative exponent rather than relying on either result.
- Large positive powers can overflow; large negative powers can underflow toward zero. Intermediate squaring can encounter the limit before an intuitively simplified expression would.
- NaN and infinity follow Delphi floating-point rules. The early exponent-zero rule can return 1 even when the base is NaN or infinity.

**Errors and side effects**

The function is pure. It does not catch invalid-operation, divide-by-zero, overflow or underflow conditions. Depending on the active floating-point exception mask, such a condition can raise into the script or produce NaN, infinity or zero. Validate known exceptional domains before calling.

**Performance**

Ordinary integer exponents on both product targets use exponentiation by squaring, so multiplication count grows logarithmically with the exponent magnitude rather than linearly. `Low(Integer)` is the exceptional general-logarithm path described above.

**Related entries**

- [`NthRoot`](NthRoot.md) calculates positive-value roots using logarithm and real exponentiation.
- [`Sqrt`](Sqrt.md) is the direct square-root operation.

**External references**

- [Free Pascal: `Math.Power`](https://www.freepascal.org/docs-html/rtl/math/power.html)
- [Embarcadero DocWiki: `System.Math.Power`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Math.Power)

<small>Created 2026-07-15</small>
