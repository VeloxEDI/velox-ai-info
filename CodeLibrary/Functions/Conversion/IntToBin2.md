---
title: "IntToBin2"
description: "Formats a LongInt as 8, 16, 24 or 32 binary digits by trimming only complete leading zero bytes."
sidebar_position: 11
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - binary
  - longint
  - byte groups
---

```Delphi
function IntToBin2(d: LongInt): string;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := IntToBin2(513);  // '0000001000000001'
end;
```

### Usage

`IntToBin2` formats a LongInt as 8, 16, 24 or 32 binary digits by trimming only complete leading zero bytes.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `d` | `LongInt` | Signed 32-bit value to represent. |

**Returns**

ASCII `0`/`1` text with one of these lengths:

| Input | Result length | Example |
|---|---:|---|
| Positive value through 255 | 8 | `1` -> `00000001` |
| Positive value through 65,535 | 8 or 16 as required | `513` -> `0000001000000001` |
| Larger positive value | 24 or 32 as required | Whole leading zero bytes only are removed. |
| Zero | 32 | Thirty-two `0` characters. |
| Negative value | 32 | Signed two's-complement bit pattern. |

**Errors**

Only normal string allocation/runtime failures are expected for a valid `LongInt`; the loop and final result size are fixed.

**Usage notes**

Use this function for display or byte-grouped bit inspection. For an external binary protocol, define signedness and byte order separately and use actual byte operations rather than treating this display string as serialised data.

### Additional Technical Info
`IntToBin2` creates a 32-character binary representation of a signed `LongInt`, then removes only complete eight-character groups that precede the first `1`. A non-zero positive value therefore returns 8, 16, 24 or 32 bits. Negative values return all 32 two's-complement bits.

The example returns two byte groups because 513 requires nine significant bits. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The Velox-owned function performs exactly 32 iterations. Each iteration prepends `1` if the current value is odd, otherwise `0`, then shifts the signed `LongInt` right by one. It finds the first `1` in the completed string and deletes a multiple of eight leading characters calculated from that position.

The zero case is a quirk of this trim calculation: no `1` is found, so the computed delete count is zero and all 32 zeroes remain.

**Edge cases and quirks**

- Despite its name, the function does not produce two bits or accept a width argument. The `2` distinguishes it from [`IntToBin`](IntToBin.md).
- Leading zeroes are removed only in complete byte groups. The returned text is byte-aligned rather than a minimal binary representation.
- Zero returns 32 bits instead of the otherwise plausible `00000000`.
- Negative values retain 32 bits and represent the signed `LongInt` bit pattern. [`BinToInt`](BinToInt.md) reconstructs a valid 32-character result as the same signed bit pattern, but its permissive handling of non-`1` characters means external text still requires syntax validation.
- The returned character groups express bit order from most significant on the left to least significant on the right; they do not define byte order for serialising a multi-byte integer.

**Side effects**

None outside result-string allocation.

**Performance and concurrency**

Always performs 32 small prepend operations and a short delete. Work and output are bounded, and no shared mutable state is used.

**Related entries**

- [`IntToBin`](IntToBin.md) produces an exact caller-selected width for non-negative values.
- [`BinToInt`](BinToInt.md) performs a permissive signed 32-bit positional scan and is not a general inverse for every result here.

<small>Created 2026-07-15</small>
