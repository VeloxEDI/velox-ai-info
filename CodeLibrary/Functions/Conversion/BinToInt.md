---
title: "BinToInt"
description: "Converts binary-text positions to a signed 32-bit integer using Velox's permissive bit scan."
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - binary
  - integer
  - parsing
---

```Delphi
function BinToInt(v: String): LongInt;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := BinToInt('101101');  // 45
end;
```

### Usage

`BinToInt` converts binary-text positions to a signed 32-bit integer using Velox's permissive bit scan.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `v` | `String` | Positional binary-like text. Only ASCII `1` sets a bit; leading ASCII zeroes are removed first. |

**Returns**

The signed 32-bit bit pattern formed by the positions containing an exact `1`, where the rightmost remaining character is bit zero. For input of up to 32 positions, bit 31 is the sign bit: `10000000000000000000000000000000` returns the minimum `LongInt`, and 32 `1` characters return `-1`. Empty text, text containing only zeroes and text with no `1` characters return zero when no unsupported-width arithmetic is reached.

**Errors**

Arithmetic overflow, range and allocation failures can propagate. Unexpected characters do not themselves raise an invalid-binary exception.

**Usage notes**

Validate with an explicit rule such as `^[01]{1,32}$` before calling when invalid input must be rejected. Limit a non-negative contract to at most 31 significant positions; allow 32 only when the leftmost position is intentionally the signed two's-complement bit. Do not pass a wider or unbounded binary integer.

### Additional Technical Info
`BinToInt` interprets character positions as bits of a signed 32-bit `LongInt`. An exact `1` contributes a set bit. Every other character silently contributes a zero bit while still occupying its position.

The example is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The Velox-owned implementation repeatedly removes a leading `0` with `Copy`. It then scans the remaining string from right to left. For each `1`, it calculates `1 shl (Length - Index)` and adds it to a `LongInt` result. No standard binary parser is called.

**Edge cases and quirks**

- This function is permissive, not a syntax validator. `BinToInt('10X1')` treats `X` as a zero bit and returns the same value as `BinToInt('1001')`.
- Whitespace, a sign, a `0b` prefix and separators are not recognised specially; they occupy zero-valued bit positions.
- Leading exact zeroes are discarded, but other leading characters remain and increase the later shift positions.
- The result is a signed 32-bit `LongInt`. A 32-position value is interpreted as a two's-complement bit pattern, not rejected as an unsigned overflow.
- More than 32 remaining positions requires shifts beyond the result width. The outcome is platform/compiler dependent and later additions can raise under the current checked-arithmetic configurations. This is not an arbitrary-precision parser.
- Repeatedly copying away leading zeroes adds avoidable work for a long zero-padded input.

**Side effects**

None outside local string and integer values.

**Performance and concurrency**

The main scan is linear in the remaining text, but repeated leading-zero `Copy` operations can make heavily padded input more expensive. The function has no shared mutable state.

**Related entries**

- [`IntToBin`](IntToBin.md) formats positive values into a caller-selected width.
- [`IntToBin2`](IntToBin2.md) emits 8, 16, 24 or 32 bits from a `LongInt`.
- [`HexToInt`](HexToInt.md) is a strict hexadecimal conversion that raises on unsupported text.

<small>Created 2026-07-15</small>
