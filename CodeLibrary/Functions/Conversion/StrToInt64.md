---
title: "StrToInt64"
description: "Parses text as a signed 64-bit integer and raises when conversion fails."
sidebar_position: 35
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - integer
  - int64
  - delphi
---

```Delphi
function StrToInt64(S: string): Int64;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := StrToInt64('9000000000');
end;
```

### Usage

`StrToInt64` parses text as a signed 64-bit integer and raises when conversion fails.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string` | Signed decimal or hexadecimal integer text. Velox supports `$` and `0x` hexadecimal prefixes; decimal points and thousands separators are invalid. |

**Returns**

An `Int64` in the range `-9223372036854775808..9223372036854775807`.

**Errors**

Invalid syntax, a partial token or an out-of-range value raises Velox `EConvertError`, which propagates as a script runtime exception. [`StrToInt64Def`](StrToInt64Def.md) replaces these conversion failures with a fallback.

**Usage notes**

Use decimal text for signed business identifiers unless a hexadecimal bit-pattern contract is explicit. Hexadecimal high-bit behaviour can surprise readers expecting only non-negative magnitude.

### Additional Technical Info
`StrToInt64` converts signed decimal or Delphi-style hexadecimal text to `Int64`. Unlike the script-visible 32-bit [`StrToInt`](StrToInt.md), malformed or out-of-range input raises a conversion exception instead of returning a sentinel.

The example is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The modified PascalScript compiler adds `StrToInt64` only when `PS_NOINT64` is not defined. In the reviewed Velox build, runtime dispatch case 39 reads the script ANSI string, converts it to a Delphi string and calls installed `System.SysUtils.StrToInt64`. That routine calls intrinsic `Val` with an `Int64` destination and raises `EConvertError` when `Val` returns a non-zero error position.

**Edge cases and quirks**

- Decimal input is range-checked as a signed 64-bit number. A value immediately outside either bound fails; it is not clamped or wrapped.
- Delphi hexadecimal notation can represent the complete 64-bit bit pattern. A high-bit-set 16-digit pattern is interpreted in the signed destination, so `$FFFFFFFFFFFFFFFF` represents `-1`; a seventeenth hexadecimal digit fails.
- The whole token must be valid. Fractional notation, grouping characters and trailing non-space text are rejected.
- Leading sign handling and whitespace follow Delphi `Val`. Normalise external input explicitly when a protocol forbids whitespace rather than relying on parser tolerance.
- Free Pascal's similarly named function documents some different prefix and whitespace rules. It is a compatibility reference, not the implementation used by Velox.
- This function is conditionally available in PascalScript source builds without `PS_NOINT64`; the current Velox build has 64-bit integer support enabled.

**Side effects**

None.

**Performance and concurrency**

Linear in input length, with no locale dependency, I/O or shared mutable state.

**Related entries**

- [`StrToInt64Def`](StrToInt64Def.md) returns a caller-supplied value on conversion failure.
- [`StrToInt`](StrToInt.md) is limited to `LongInt` and returns `-1` on failure.
- [`StrToUInt64`](StrToUInt64.md) parses the full unsigned 64-bit range.

**External references**

- [Free Pascal `StrToInt64`](https://www.freepascal.org/daily/doc/rtl/sysutils/strtoint64.html) - compatible signed 64-bit reference with dialect-specific whitespace/prefix details.
- [Embarcadero `System.SysUtils.StrToInt64`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StrToInt64) - the Delphi terminal called by PascalScript.

<small>Created 2026-07-15</small>
