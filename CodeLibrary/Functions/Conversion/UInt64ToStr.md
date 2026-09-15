---
title: "UInt64ToStr"
description: "Formats an unsigned 64-bit integer as locale-independent decimal text."
sidebar_position: 41
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - integer
  - uint64
  - formatting
---

```Delphi
function UInt64ToStr(I: UInt64): string;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Number: UInt64;
begin
  Number := StrToUInt64('4294967296');
  Value := UInt64ToStr(Number);  // '4294967296'
end;
```

### Usage

`UInt64ToStr` formats an unsigned 64-bit integer as locale-independent decimal text.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `I` | `UInt64` | Value in `0..18446744073709551615` to format. |

**Returns**

Only the ASCII decimal digits required to represent `I`. The result has no sign, leading padding, grouping separator or locale-specific character.

**Errors**

Every `UInt64` has a decimal representation. String allocation or invalid script argument-conversion failures can still propagate.

**Usage notes**

Use this explicit name when the 64-bit width is important to the reader. The result is suitable for stable numeric interchange, provided the receiving system also supports the full unsigned range.

### Additional Technical Info
`UInt64ToStr` returns the base-10 text for an unsigned 64-bit integer. It is an explicit PascalScript 64-bit alias and produces the same output as [`UIntToStr`](UIntToStr.md) in the current Velox build.

The example is source-reviewed and is not executed by the documentation workflow.

**Implementation**

PascalScript declares this function only when 64-bit integer support is enabled. Runtime dispatch case 46 reads a `UInt64`, calls Delphi `System.SysUtils.UIntToStr(UInt64)`, converts the digit-only result to the script string representation and writes it back to the stack. The Delphi terminal delegates to its unsigned 64-bit decimal formatter.

**Edge cases and quirks**

- Zero returns `0`.
- The maximum `UInt64` returns `18446744073709551615`; it is not reinterpreted as signed `-1`.
- Output is decimal only. There is no overload for width, base, grouping or a positive sign.
- The current [`UIntToStr`](UIntToStr.md) dispatch case also reads `UInt64` and calls the same Delphi overload, making the two functions output-equivalent. They remain separate script identifiers.
- A PascalScript build without 64-bit support would omit `UInt64ToStr`; that is not the reviewed Velox configuration.
- Free Pascal names the corresponding 64-bit type `QWord` in its overload. That dialect name does not change the current Delphi `UInt64` terminal.

**Side effects**

None outside result-string allocation.

**Performance and concurrency**

Constant bounded conversion (at most 20 digits), with no locale lookup or mutable shared state.

**Related entries**

- [`UIntToStr`](UIntToStr.md) is output-equivalent in the current build.
- [`StrToUInt64`](StrToUInt64.md) parses unsigned decimal or hexadecimal text.
- [`Int64ToStr`](Int64ToStr.md) formats signed 64-bit values.

**External references**

- [Free Pascal `UIntToStr`](https://www.freepascal.org/daily/doc/rtl/sysutils/uinttostr.html) - compatible unsigned decimal formatter using Free Pascal's `QWord` type name.
- [Embarcadero `System.SysUtils.UIntToStr`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.UIntToStr) - documents the exact Delphi `UInt64` overload used by PascalScript.

<small>Created 2026-07-15</small>
