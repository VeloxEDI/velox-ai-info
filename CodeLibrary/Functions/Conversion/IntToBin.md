---
title: "IntToBin"
description: "Writes positive LongInt bits into a caller-sized zero-filled binary string."
sidebar_position: 10
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - binary
  - longint
  - bit width
---

```Delphi
function IntToBin(v: LongInt; d: Integer): string;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := IntToBin(13, 8);  // '00001101'
end;
```

### Usage

`IntToBin` writes positive LongInt bits into a caller-sized zero-filled binary string.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `v` | `LongInt` | Value to format. Reliable intended use is zero or a positive signed 32-bit value. |
| `d` | `Integer` | Exact result length and minimum storage width. Use a positive value at least as large as the value's bit length. |

**Returns**

A string of exactly `d` ASCII `0`/`1` characters on valid input. Positive values are left-padded with zeroes. Zero returns `d` zeroes.

**Errors**

Too-short widths can raise a range-check exception. Invalid/very large lengths and normal string allocation failures propagate. The function does not return a required-width indicator.

**Usage notes**

For non-negative `v`, calculate or enforce an adequate width before calling. Use [`IntToBin2`](IntToBin2.md) when a whole-byte, fixed signed 32-bit representation is needed. Do not use `IntToBin` for negative values.

### Additional Technical Info
`IntToBin` creates a string of exactly `d` zero characters, then writes the low-to-high bits of a **positive** `LongInt` from the rightmost position towards the left. The width must be large enough for every set and intervening bit.

The example is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The Velox-owned function calls Delphi `StringOfChar('0', d)`. While `v > 0`, it tests the low bit, writes `1` at result index `d` when set, decrements `d`, and shifts `v` right by one. The same local `d` variable is used as the write index; no bounds or width validation is performed before the loop.

**Edge cases and quirks**

- A negative `v` skips the loop and therefore returns only zeroes. It does **not** return a signed two's-complement representation.
- A width smaller than the positive value's bit length is not a truncation request. The write index reaches zero or below and current range-checked Velox builds raise.
- `d = 0` returns an empty string only when the loop does not run, such as for zero. With a positive value it leads to an out-of-range write.
- Negative widths are not a supported contract; behaviour depends on the underlying string allocation path. Reject them before calling.
- Widths greater than 32 are accepted for a non-negative allocation and add leading zeroes, subject to memory limits.

**Side effects**

None outside local/result string allocation.

**Performance and concurrency**

Initialisation is proportional to `d`; the bit loop runs at most 31 times for positive `LongInt` input. State is local to the call.

**External references**

- [Embarcadero `System.StringOfChar`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.StringOfChar) - the exact Delphi string-initialisation helper called by Velox.
- [Free Pascal `StringOfChar`](https://www.freepascal.org/docs-html/rtl/system/stringofchar.html) - compatible repeated-character reference; the indexing and bit loop are Velox-owned.

<small>Created 2026-07-15</small>
