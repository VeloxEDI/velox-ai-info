---
title: "Int"
description: "Returns the integer part of an Extended value by rounding toward zero while retaining a floating-point result."
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - mathematics
  - truncation
  - floating-point
---

```Delphi
function Int(E: Extended): Extended;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Int(-12.875); // -12.0
end;
```

### Usage

Returns the integer part of an Extended value by rounding toward zero while retaining a floating-point result.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `E` | `Extended` | Value whose fractional component is to be discarded. |

**Returns**

The integer-valued `Extended` nearest to `E` in the direction of zero.

| Input | Result |
|---|---|
| `12.875` | `12.0` |
| `-12.875` | `-12.0` |
| `0.75` | `0.0` |
| `-0.75` | zero, with signed-zero representation dependent on the RTL path |

This is truncation, not floor: `Int(-12.875)` is `-12`, not `-13`.

### Additional Technical Info
`Int` removes the fractional part of a real value by rounding toward zero. Unlike [`Trunc`](../Numeric/Trunc.md), it returns an `Extended` floating-point result rather than an integer result.

This is the PascalScript standard function and delegates directly to Delphi's `System.Int`. The example is fictional and source-reviewed only.

**Implementation**

1. The modified PascalScript compiler declares `Int` in its standard Math group.
2. Runtime selector 20 reads the argument through `Stack.GetReal`.
3. Delphi `System.Int` rounds toward zero while retaining a floating-point return type.
4. The result is written back with `Stack.SetReal`.

The product project targets Win32 and Win64 and currently defaults to Win64. The Win32 RTL temporarily selects x87 round-toward-zero mode for this operation and restores the original control word. The Win64 path uses its SSE/double-precision implementation.

**Edge cases and quirks**

- A value already having no representable fractional part is returned unchanged.
- Sufficiently large floating-point values have no stored fractional bits even when their source decimal text appeared to contain a fraction.
- The result remains floating point. Use it when subsequent calculations need `Extended`; use `Trunc` when an integer return and its range rules are required.
- Infinity and NaN are floating-point special values rather than ordinary integers. Their propagation or exception behaviour depends on the RTL target and active exception mask.
- Signed zero is numerically equal to zero. Do not use this function when preservation of a negative-zero sign bit is a business requirement.

**Errors and side effects**

The operation is pure. The wrapper performs no range check or exception translation. Exceptional floating-point input can signal through Delphi according to the process floating-point environment.

**Related entries**

- [`Abs`](Abs.md) removes a sign without removing a fraction.
- [`Trunc`](../Numeric/Trunc.md) also rounds toward zero but returns an integer.

**External references**

- [Free Pascal: `System.Int`](https://www.freepascal.org/docs-html/rtl/system/int.html)
- [Embarcadero DocWiki: `System.Int`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.Int)

<small>Created 2026-07-15</small>
