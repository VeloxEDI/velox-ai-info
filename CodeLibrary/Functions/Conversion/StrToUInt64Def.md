---
title: "StrToUInt64Def"
description: "Parses text as an unsigned 64-bit integer, returning a supplied value on failure."
sidebar_position: 39
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - integer
  - uint64
  - default
---

```Delphi
function StrToUInt64Def(S: string; def: UInt64): UInt64;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := StrToUInt64Def('-1', 0);  // 0
end;
```

### Usage

`StrToUInt64Def` parses text as an unsigned 64-bit integer, returning a supplied value on failure.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string` | Unsigned decimal or `$`/`0x` hexadecimal text for a `UInt64` destination. |
| `def` | `UInt64` | Value returned for malformed, negative, partial or out-of-range input. |

**Returns**

The parsed value in `0..18446744073709551615`, or `def` when conversion fails.

**Errors**

Ordinary conversion failures return `def`. Allocation or unexpected runtime failures can still propagate.

**Usage notes**

Use a fallback outside the valid business domain where possible. The type itself has no spare sentinel, so retain a separate validity flag when every `UInt64` value is meaningful.

### Additional Technical Info
`StrToUInt64Def` parses decimal or Delphi-style hexadecimal text into `UInt64` and returns `def` when conversion fails. It accepts the complete unsigned 64-bit range and suppresses the ordinary conversion exception raised by [`StrToUInt64`](StrToUInt64.md).

The example is source-reviewed and is not executed by the documentation workflow.

**Implementation**

With PascalScript 64-bit integer support enabled, runtime dispatch case 47 reads both stack arguments and calls Delphi `System.SysUtils.StrToUInt64Def`. That routine calls intrinsic `Val` with a `UInt64` destination and substitutes `def` whenever `Val` returns a non-zero error position.

**Edge cases and quirks**

- Negative decimal input is outside the destination range and returns `def`; it is not wrapped modulo 2^64.
- The maximum `UInt64` value is a valid result. A decimal value one greater than the maximum returns `def`.
- Hexadecimal input can use all 64 bits without becoming negative because the destination is unsigned.
- Syntax failure and numeric overflow share the same fallback path, and the original `Val` error position is not exposed.
- A valid value equal to `def` is indistinguishable from failure.
- Free Pascal's direct routine has the same broad fallback purpose but documents dialect-specific prefix rules. The installed Delphi terminal remains authoritative.
- The function is present because the current PascalScript build enables `Int64`/`UInt64` support.

**Side effects**

None.

**Performance and concurrency**

Linear in input length and independent of locale, I/O and shared mutable state.

**Related entries**

- [`StrToUInt64`](StrToUInt64.md) raises on the same conversion failures.
- [`StrToInt64Def`](StrToInt64Def.md) parses the signed 64-bit range.
- [`UIntToStr`](UIntToStr.md) formats the current script `UInt64` as decimal text.

**External references**

- [Free Pascal `StrToUInt64Def`](https://www.freepascal.org/daily/doc/rtl/sysutils/strtouint64def.html) - compatible unsigned fallback reference with dialect-specific parser details.
- [Embarcadero `System.SysUtils.StrToUInt64Def`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StrToUInt64Def) - the exact Delphi terminal called by PascalScript.

<small>Created 2026-07-15</small>
