---
title: "IntToHex"
description: "Formats an Int64 as uppercase hexadecimal text with a requested minimum digit count."
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - hexadecimal
  - int64
  - formatting
---

```Delphi
function IntToHex(v: Int64; d: Integer): string;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := IntToHex(4660, 8);  // '00001234'
end;
```

### Usage

`IntToHex` formats an Int64 as uppercase hexadecimal text with a requested minimum digit count.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `v` | `Int64` | Signed 64-bit value to format. |
| `d` | `Integer` | Minimum number of hexadecimal characters. It is not an exact-width or truncation argument. |

**Returns**

Uppercase hexadecimal digits with at least `d` characters when the requested width exceeds the natural representation. No `$` or `0x` prefix is included.

**Errors**

String length/range and allocation failures can propagate for invalid or excessive requested widths. Every valid `Int64` has a hexadecimal representation.

**Usage notes**

For a fixed-width integration field, validate that the natural output length does not exceed the field. This function will not signal truncation because it never truncates. When converting the result back with [`HexToInt`](HexToInt.md), remember that a 16-digit high-bit-set pattern returns a negative signed value.

### Additional Technical Info
`IntToHex` formats a signed 64-bit integer as uppercase hexadecimal text. `Digits` specifies the minimum output width: smaller magnitudes are left-padded with zeroes, but larger representations are never truncated.

The example is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The Velox wrapper calls the installed `System.SysUtils.IntToHex(Int64, Integer)` overload. Delphi treats the signed value as its 64-bit ordinal bit pattern and formats it using uppercase digits.

**Edge cases and quirks**

- `Digits` is a minimum. `IntToHex($1234, 2)` returns `1234`, not `34`.
- A negative `Int64` returns all 16 hexadecimal digits of its two's-complement representation, even when `Digits` is smaller. For example, `IntToHex(-1, 2)` returns `FFFFFFFFFFFFFFFF`.
- Zero has a natural representation of `0`; a larger positive width adds leading zeroes.
- A non-positive requested width does not remove required digits. It should not be used to request an empty result.
- Very large widths allocate and fill a correspondingly large string. Apply a width limit to external values.

**Side effects**

None outside result-string allocation.

**Performance and concurrency**

Numeric conversion is bounded by 16 natural digits, plus work proportional to any requested zero padding. The routine has no shared mutable state or locale dependency.

**Related entries**

- [`HexToInt`](HexToInt.md) parses unprefixed hexadecimal digits into a signed `Int64`.
- [`BinToHex`](BinToHex.md) invokes this formatting rule for each Variant-array element with a minimum width of two.
- [`IntToStr`](IntToStr.md) returns decimal rather than hexadecimal text.

**External references**

- [Embarcadero `System.SysUtils.IntToHex`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.IntToHex) - documents the exact overload, minimum width and negative-value expansion.
- [Free Pascal `IntToHex`](https://www.freepascal.org/docs-html/rtl/sysutils/inttohex.html) - compatible minimum-width and non-truncation reference; Velox executes Delphi's implementation.

<small>Created 2026-07-15</small>
