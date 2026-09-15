---
title: "Pi"
description: "Returns Delphi's Extended floating-point approximation of the mathematical constant pi."
sidebar_position: 5
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - mathematics
  - pi
  - radians
---

```Delphi
function Pi: Extended;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := 2 * Pi * 10; // circumference for radius 10
end;
```

### Usage

Returns Velox's Extended floating-point approximation of the mathematical constant pi.

**Parameters**

`Pi` has no parameters. In Pascal syntax it can be called without parentheses.

**Returns**

An `Extended` approximation beginning `3.1415926535897932385`. The mathematical value is irrational, so every finite binary floating-point representation is necessarily approximate.

### Additional Technical Info
`Pi` returns Delphi's floating-point approximation of the mathematical constant pi, the ratio of a circle's circumference to its diameter. It is also useful when converting between degrees and radians.

This is a zero-argument PascalScript standard function. The example is fictional and source-reviewed only.

**Implementation**

1. The modified PascalScript compiler declares `Pi` in its standard Math group.
2. Runtime selector 21 evaluates Delphi's intrinsic `System.Pi`.
3. PascalScript writes that value to its real return slot.

There is no lookup, configuration read or recalculation from another constant.

**Usage**

```Delphi
Radians := Degrees * Pi / 180;
Degrees := Radians * 180 / Pi;
```

Keep units explicit in variable names because [`Sin`](Sin.md) and [`Cos`](Cos.md) accept radians only.

**Edge cases and precision**

- The returned value is approximate; do not compare a derived floating-point calculation with an expected value using exact equality.
- `Extended` precision depends on the Delphi compilation target. It is an 80-bit extended type on the Win32 target, but aliases `Double` on common 64-bit Delphi targets.
- Repeated calls have no accumulating state. Store it only for readability or to avoid repeating a larger derived expression.

**Errors and side effects**

`Pi` is pure, deterministic for a given build target and has no expected error path or side effect.

**Related entries**

- [`Sin`](Sin.md) accepts an angle in radians.
- [`Cos`](Cos.md) accepts an angle in radians.

**External references**

- [Free Pascal: `System.Pi`](https://www.freepascal.org/docs-html/rtl/system/pi.html)
- [Embarcadero DocWiki: `System.Pi`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Pi)

<small>Created 2026-07-15</small>
