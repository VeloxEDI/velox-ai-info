---
title: "Sqrt"
description: "Returns the principal square root of an Extended floating-point value."
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - mathematics
  - square-root
  - floating-point
---

```Delphi
function Sqrt(E: Extended): Extended;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Sqrt(144); // 12
end;
```

### Usage

`Sqrt` returns the principal square root of an Extended floating-point value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `E` | `Extended` | Radicand. Use a finite value greater than or equal to zero for an ordinary real result. |

**Returns**

The `Extended` principal square root. The result is approximate unless the value is exactly representable in binary floating point.

### Additional Technical Info
`Sqrt` returns the principal square root of an `Extended` floating-point value. For a positive finite input, it returns the non-negative value which, when squared, approximates the input.

This is the PascalScript standard function and delegates directly to Delphi's `System.Sqrt`. The example is fictional and source-reviewed only.

**Implementation**

1. The modified PascalScript compiler declares `Sqrt` in its standard Math group.
2. Runtime selector 17 reads the argument through `Stack.GetReal`.
3. Delphi `System.Sqrt` performs the platform operation and returns an `Extended`.
4. PascalScript stores the result through `Stack.SetReal`.

The product project targets both Win32 and Win64 and currently defaults to Win64. Win32 terminates at x87 `FSQRT`; Win64 uses the RTL's SSE/double-precision square-root path because `Extended` aliases `Double`. There is no Velox domain check or exception wrapper.

**Edge cases and quirks**

- `Sqrt(0)` is zero. IEEE square root can retain the sign of negative zero even though positive and negative zero compare equal.
- A negative finite value has no real square root. It causes an invalid floating-point condition rather than returning a complex number.
- Positive infinity returns positive infinity under normal IEEE behaviour.
- NaN remains non-numeric and can propagate or signal according to its form and the active floating-point environment.
- Results that feed equality or threshold logic should be compared with an appropriate tolerance because input and output can both be rounded.
- `Extended` precision depends on the Delphi target; common 64-bit targets alias it to `Double`.

**Errors and side effects**

The function is pure. With floating-point invalid exceptions unmasked, a negative radicand can raise into the script; with the condition masked, the hardware can return NaN. Velox does not normalize these alternatives, so scripts should validate `E >= 0` when invalid input is possible.

**Performance**

`Sqrt` is a direct square-root operation and is preferable to [`NthRoot(2, E)`](NthRoot.md) for clarity, zero-domain support and avoiding logarithm/exponentiation error.

**Related entries**

- [`NthRoot`](NthRoot.md) calculates other roots for strictly positive values.
- [`Power`](Power.md) raises a value to an integer exponent.
- [`Abs`](Abs.md) removes a sign but does not calculate a root.

**External references**

- [Free Pascal: `System.Sqrt`](https://www.freepascal.org/docs-html/rtl/system/sqrt.html)
- [Embarcadero DocWiki: `System.Sqrt`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Sqrt)

<small>Created 2026-07-15</small>
