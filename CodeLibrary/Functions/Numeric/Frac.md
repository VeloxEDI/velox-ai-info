---
title: "Frac"
description: "Returns the signed fractional part of an Extended value as X minus Int(X)."
sidebar_position: 4
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - numeric
  - fraction
  - floating-point
---

```Delphi
function Frac(X: Extended): Extended;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Frac(-12.75); // approximately -0.75
end;
```

### Usage

Returns the signed fractional part of an Extended value as X minus Int(X).

**Parameters**

| Name | Type | Description |
|---|---|---|
| `X` | `Extended` | Floating-point value to split. |

**Returns**

The signed fractional component in the interval `(-1, 1)` for ordinary finite input.

| Input | Approximate result |
|---|---|
| `12.75` | `0.75` |
| `-12.75` | `-0.75` |
| `12.0` | `0.0` |

It is not a modulo-one operation that always returns a positive value.

### Additional Technical Info
`Frac` returns the fractional part of an `Extended` value using Delphi's definition `X - Int(X)`. Because [`Int`](../Math/Int.md) rounds toward zero, a negative input has a negative fractional result.

This is a one-line Velox wrapper over `System.Frac`. The example is fictional and source-reviewed only.

**Implementation**

`uPSI_vxCommonNumber` registers `vxCommonNumber.Frac` directly. That wrapper returns `System.Frac(X)` without validation or transformation. The installed Delphi RTL defines this in terms of `X - Int(X)` and uses target-specific floating-point code.

**Edge cases and quirks**

- An already integral finite value returns zero; signed-zero details depend on the target operation.
- Floating-point representation means an input written as a decimal may not have the intuitively exact decimal fraction in binary.
- Very large values can have no representable fractional bits and therefore return zero.
- Infinity and NaN do not have an ordinary fractional component and can propagate NaN or signal according to the active floating-point exception mask.
- `Extended` aliases `Double` on the default Win64 target and has wider x87 precision on Win32.

**Errors and side effects**

The function is pure. Velox does not catch or normalize floating-point exceptions.

**Related entries**

- [`Int`](../Math/Int.md) returns the complementary integer-valued floating part.
- [`Trunc`](Trunc.md) returns a narrowed integer rather than a fractional value.

**External references**

- [Free Pascal: `System.Frac`](https://www.freepascal.org/docs-html/rtl/system/frac.html)
- [Embarcadero DocWiki: `System.Frac`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Frac)

<small>Created 2026-07-15</small>
