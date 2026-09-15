---
title: "HexToInt"
description: "Parses hexadecimal text as an Int64 after Velox prepends Delphi's dollar-sign base prefix."
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - hexadecimal
  - int64
  - parsing
---

```Delphi
function HexToInt(HexNum: String): Int64;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := HexToInt('2A');  // 42
end;
```

### Usage

`HexToInt` parses hexadecimal text as an Int64 after Velox prepends Velox's dollar-sign base prefix.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `HexNum` | `String` | One to sixteen hexadecimal digits with no prefix, sign, whitespace or separator. Both letter cases are accepted. |

**Returns**

The signed 64-bit interpretation of the hexadecimal bit pattern. Values through `7FFFFFFFFFFFFFFF` are positive. A full 16-digit pattern with its high bit set is interpreted as two's complement; for example, `FFFFFFFFFFFFFFFF` returns `-1` and `8000000000000000` returns the minimum `Int64`.

**Errors**

Velox raises `EConvertError` when the prefixed text is not a valid 64-bit integer representation. Allocation failures can also propagate. No default value or partial parse is returned.

**Usage notes**

Validate an explicit `1..16` hexadecimal-digit contract at an external boundary. If the destination expects an unsigned magnitude, handle values above `7FFFFFFFFFFFFFFF` with an appropriate unsigned representation rather than interpreting this signed result as positive.

### Additional Technical Info
`HexToInt` strictly parses hexadecimal digits into a signed 64-bit `Int64`. Velox prepends Delphi's `$` base marker and passes the resulting string to `System.SysUtils.StrToInt64`.

The example is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The Velox wrapper evaluates `StrToInt64('$' + HexNum)`. The selected Delphi parser recognises `$` as hexadecimal and accumulates up to 64 bits before returning an `Int64`. No locale-dependent punctuation is involved.

**Edge cases and quirks**

- The caller must omit the prefix. Passing `$2A` produces `$$2A`; passing `0x2A` produces `$0x2A`. Both are invalid.
- A leading plus or minus sign is invalid because Velox places `$` before the original text.
- Empty input, whitespace and embedded/trailing separators are invalid.
- Up to 16 hexadecimal digits can represent a complete 64-bit bit pattern. A 17th digit or another out-of-range form raises rather than truncating.
- This is a signed-bit-pattern conversion, not an unsigned 64-bit return. Values with bit 63 set appear negative.

**Side effects**

None outside temporary/result string allocation.

**Performance and concurrency**

Linear in the short input length with no shared mutable state or locale dependency.

**Related entries**

- [`IntToHex`](IntToHex.md) provides the signed `Int64` hexadecimal formatter.
- [`HexToBin`](HexToBin.md) decodes pairs into a stream but has a different, permissive failure contract.
- [`BinToInt`](BinToInt.md) performs Velox's permissive 32-bit positional binary scan.

**External references**

- [Embarcadero `System.SysUtils.StrToInt64`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.StrToInt64) - the exact Delphi parser called after Velox adds `$`.
- [Free Pascal `StrToInt64`](https://www.freepascal.org/docs-html/current/rtl/sysutils/strtoint64.html) - compatible strict conversion and `$`-hexadecimal reference; Velox executes Delphi's implementation.

<small>Created 2026-07-15</small>
