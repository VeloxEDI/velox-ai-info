---
title: "Int64ToStr"
description: "Formats a signed 64-bit integer as decimal text through PascalScript's standard runtime dispatch."
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - int64
  - decimal
  - pascalscript
---

```Delphi
function Int64ToStr(I: Int64): String;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Int64ToStr(-1234567890);  // '-1234567890'
end;
```

### Usage

**Parameters**

| Name | Type | Description |
|---|---|---|
| `I` | `Int64` | Any value in the signed 64-bit range. |

**Returns**

Only the decimal digits required to represent the magnitude, with a leading ASCII minus sign for negative values. No plus sign, padding, thousands separator or locale-specific digit grouping is added.

**Errors**

String-allocation and script/value type-conversion failures can propagate. Every valid `Int64` itself has a representation.

**Usage notes**

Use this name when the 64-bit intent is useful to a reader. Use [`IntToStr`](IntToStr.md) where existing script conventions prefer it; current Velox accepts an `Int64` there as well.

### Additional Technical Info
`Int64ToStr` returns the base-10 text for a signed 64-bit integer. It is a standard function implemented by the shipped PascalScript runtime and terminates in Delphi `System.SysUtils.IntToStr(Int64)`.

The example is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The modified PascalScript compiler registers this standard declaration when `Int64` support is enabled. Its runtime dispatcher handles `Int64ToStr` separately from the shorter-named `IntToStr`, but both current branches call Delphi `System.SysUtils.IntToStr(Int64)`.

The current Velox build includes `Int64` support. Delphi's selected overload handles the full signed range, including `-9223372036854775808`, without first requiring that value to be represented as a positive `Int64`.

**Edge cases and quirks**

- Zero returns `0`; positive values have no leading plus sign.
- The result is locale-independent and has no grouping separators.
- `Int64ToStr` and [`IntToStr`](IntToStr.md) currently produce identical text for the same script value. They remain distinct PascalScript standard names and runtime dispatch cases.
- The symbol would be unavailable in a PascalScript build compiled with `PS_NOINT64`; that option is not enabled in the reviewed Velox build.

**Side effects**

None outside result-string allocation.

**Performance and concurrency**

Constant bounded numeric conversion with no shared mutable state or locale dependency.

**External references**

- [Embarcadero `System.SysUtils.IntToStr`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.IntToStr) - documents the exact Delphi `Int64` terminal overload.
- [Free Pascal `IntToStr`](https://www.freepascal.org/docs-html/rtl/sysutils/inttostr.html) - compatible signed-decimal reference; Velox's dispatch is the shipped PascalScript/Delphi implementation.

<small>Created 2026-07-15</small>
