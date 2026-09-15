---
title: "StrToInt"
description: "Parses a signed LongInt through PascalScript, returning -1 when the text is invalid."
sidebar_position: 34
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - integer
  - pascalscript
  - sentinel
---

```Delphi
function StrToInt(S: string): LongInt;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := StrToInt('2048');  // 2048
end;
```

### Usage

`StrToInt` parses a signed LongInt through Velox scripting, returning -1 when the text is invalid.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string` | Text for a signed 32-bit integer. Velox `Val` accepts signed decimal and the `$` or `0x` hexadecimal prefixes; decimal and thousands separators are not valid for an integer destination. |

**Returns**

The parsed value in the `LongInt` range `-2147483648..2147483647`. It returns the sentinel `-1` whenever `Val` reports an error.

**Errors**

Conversion errors are swallowed and represented as `-1`. Other failures, such as allocation/runtime faults while moving the script string, are not part of that sentinel contract.

**Usage notes**

Prefer [`StrToIntDef`](StrToIntDef.md) with a domain-impossible fallback when validation is required. Even then, the fallback can collide with valid data if chosen from the accepted range. Use [`StrToInt64`](StrToInt64.md) when 64-bit range and exception-based failure are required.

### Additional Technical Info
`StrToInt` parses a signed 32-bit `LongInt` with Pascal's intrinsic `Val` conversion. The Velox PascalScript runtime has a material compatibility quirk: malformed or out-of-range input returns `-1` instead of raising the `EConvertError` documented for Delphi and Free Pascal `SysUtils.StrToInt`.

The example is source-reviewed and is not executed by the documentation workflow.

**Implementation**

PascalScript installs `StrToInt` as a standard compiler function. Runtime dispatch case 1 passes the script's ANSI string to the modified PascalScript `uPSUtils.StrToInt`, which converts it to a Delphi string and calls intrinsic `System.Val` with a `LongInt` destination. A zero error position returns the parsed value; any non-zero error position is discarded and replaced by `-1`.

This path does not call Delphi `System.SysUtils.StrToInt` despite sharing its public name.

**Edge cases and quirks**

- `-1` is both a valid parsed value and the failure sentinel. The caller cannot distinguish `StrToInt('-1')` from `StrToInt('invalid')` by examining the result.
- Overflow and underflow are treated like syntax errors and also return `-1`.
- Parsing is whole-value: a valid numeric prefix followed by an invalid character does not return the prefix.
- Integer parsing is locale-independent. Decimal points, grouping characters and currency symbols are errors.
- The Delphi `Val` terminal documents decimal plus `$` and `0x` hexadecimal forms. Free Pascal `Val` additionally documents binary and octal prefixes; those are dialect features and are not evidence that the current Delphi terminal accepts them.
- Hexadecimal input is converted into the 32-bit destination's representation. Use explicit range-aware logic when a text protocol defines unsigned values.

**Side effects**

None.

**Performance and concurrency**

Linear in the short input string with no locale lookup, I/O or shared mutable state.

**Related entries**

- [`StrToIntDef`](StrToIntDef.md) lets the caller choose the failure value.
- [`StrToInt64`](StrToInt64.md) uses Delphi's 64-bit exception-raising routine rather than this modified 32-bit terminal.
- [`StrToUInt64`](StrToUInt64.md) parses the unsigned 64-bit range.

**External references**

- [Free Pascal `System.Val`](https://www.freepascal.org/daily/doc/rtl/system/val.html) - compatibility reference for the intrinsic conversion model; its extra radix forms are not the Delphi contract.
- [Embarcadero `System.Val`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Val) - the Delphi intrinsic reached by the modified PascalScript terminal.

<small>Created 2026-07-15</small>
