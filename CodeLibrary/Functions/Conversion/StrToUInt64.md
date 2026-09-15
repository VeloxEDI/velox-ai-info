---
title: "StrToUInt64"
description: "Parses text as an unsigned 64-bit integer and raises when conversion fails."
sidebar_position: 38
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - integer
  - uint64
  - delphi
---

```Delphi
function StrToUInt64(S: string): UInt64;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := StrToUInt64('4294967296');
end;
```

### Usage

`StrToUInt64` parses text as an unsigned 64-bit integer and raises when conversion fails.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string` | Unsigned decimal or `$`/`0x` hexadecimal integer text. Decimal/grouping separators and currency syntax are invalid. |

**Returns**

A `UInt64` in the range `0..18446744073709551615`.

**Errors**

Malformed, negative, partial or out-of-range input raises `EConvertError` and stops the script unless handled. [`StrToUInt64Def`](StrToUInt64Def.md) provides a fallback form.

**Usage notes**

Use this routine only when the receiving field and subsequent calculations preserve `UInt64`. Casting the result into a signed type or a variant path without unsigned support can lose the upper half of the range.

### Additional Technical Info
`StrToUInt64` converts decimal or Delphi-style hexadecimal text into an unsigned 64-bit value. It supports values above signed `Int64` maximum and raises when the input is invalid, negative or greater than `18446744073709551615`.

The example is source-reviewed and is not executed by the documentation workflow.

**Implementation**

With PascalScript 64-bit support enabled, runtime dispatch case 45 reads the script ANSI string, converts it to a Delphi string and calls installed `System.SysUtils.StrToUInt64`. The Delphi terminal invokes intrinsic `Val` with a `UInt64` destination and raises `EConvertError` whenever `Val` reports an error.

**Edge cases and quirks**

- Negative decimal values do not fit the unsigned destination and fail rather than wrapping.
- The maximum `UInt64` decimal value succeeds; adding one exceeds the destination and fails.
- A hexadecimal input can represent all 64 bits without becoming negative because the destination itself is unsigned.
- The full token must convert. Fractional text, grouping characters and trailing junk are invalid.
- Free Pascal documents additional radix-prefix and whitespace details. Those are not proof of the installed Delphi terminal's accepted grammar; Velox follows Delphi `Val` through `System.SysUtils.StrToUInt64`.
- The function is conditionally registered only when PascalScript has 64-bit integer support. That support is enabled in the reviewed Velox build.

**Side effects**

None.

**Performance and concurrency**

Linear in input length with no locale lookup, shared state or I/O.

**Related entries**

- [`StrToUInt64Def`](StrToUInt64Def.md) returns a supplied fallback on conversion failure.
- [`StrToInt64`](StrToInt64.md) parses signed 64-bit values.
- [`UInt64ToStr`](UInt64ToStr.md) formats an unsigned value back to decimal text.

**External references**

- [Free Pascal `StrToUInt64`](https://www.freepascal.org/daily/doc/rtl/sysutils/strtouint64.html) - compatible unsigned 64-bit reference with dialect-specific prefix details.
- [Embarcadero `System.SysUtils.StrToUInt64`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StrToUInt64) - the Delphi terminal called by PascalScript.

<small>Created 2026-07-15</small>
