---
title: "StrToInt64Def"
description: "Parses text as a signed 64-bit integer, returning a supplied value on failure."
sidebar_position: 36
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - integer
  - int64
  - default
---

```Delphi
function StrToInt64Def(S: string; def: Int64): Int64;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := StrToInt64Def('missing', 0);  // 0
end;
```

### Usage

`StrToInt64Def` parses text as a signed 64-bit integer, returning a supplied value on failure.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string` | Signed decimal or `$`/`0x` hexadecimal integer text for an `Int64` destination. |
| `def` | `Int64` | Value returned when `S` is syntactically invalid, partially valid or out of range. |

**Returns**

The parsed signed 64-bit value, or `def` after a conversion failure. A return equal to `def` does not indicate which path was taken.

**Errors**

Normal `Val` conversion failures return `def`. Unexpected allocation or runtime failures are not part of the fallback contract and can still propagate.

**Usage notes**

Choose `def` outside the valid business domain where possible, even though every `Int64` remains syntactically convertible. If the application must distinguish invalid text from that sentinel, validate separately rather than comparing only the return.

### Additional Technical Info
`StrToInt64Def` parses signed decimal or Delphi-style hexadecimal text into `Int64`, returning `def` when conversion fails. It shares [`StrToInt64`](StrToInt64.md)'s parser and range but suppresses its ordinary conversion exception.

The example is source-reviewed and is not executed by the documentation workflow.

**Implementation**

With PascalScript `Int64` support enabled, runtime dispatch case 41 passes the script string and stack `Int64` fallback to Delphi `System.SysUtils.StrToInt64Def`. The terminal calls `Val` with an `Int64` destination and substitutes `def` whenever the returned error position is non-zero.

**Edge cases and quirks**

- The fallback covers both malformed input and signed 64-bit overflow/underflow.
- Decimal points, grouping characters and partially valid tokens fail as a whole.
- Delphi's hexadecimal form is bit-pattern oriented for the signed destination. High-bit-set 16-digit values can produce negative results rather than the fallback; more than 16 hexadecimal digits fail.
- `def` can equal a legitimately parsed value. This API deliberately provides no success flag.
- Free Pascal exposes the same high-level fallback shape, but its accepted prefixes and whitespace rules are dialect-specific.
- The function is present in the current Velox build because PascalScript 64-bit integer support is enabled.

**Side effects**

None.

**Performance and concurrency**

Linear in input length with no locale lookup or shared state.

**Related entries**

- [`StrToInt64`](StrToInt64.md) raises on the same conversion failures.
- [`StrToIntDef`](StrToIntDef.md) provides a 32-bit fallback conversion.
- [`StrToUInt64Def`](StrToUInt64Def.md) covers the unsigned 64-bit range.

**External references**

- [Free Pascal `StrToInt64Def`](https://www.freepascal.org/daily/doc/rtl/sysutils/strtoint64def.html) - compatible fallback reference with dialect-specific parser details.
- [Embarcadero `System.SysUtils.StrToInt64Def`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StrToInt64Def) - the exact Delphi terminal called by PascalScript.

<small>Created 2026-07-15</small>
