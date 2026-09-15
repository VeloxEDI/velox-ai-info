---
title: "StrToIntDef"
description: "Parses a signed LongInt through PascalScript, returning a supplied value when parsing fails."
sidebar_position: 37
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - integer
  - pascalscript
  - default
---

```Delphi
function StrToIntDef(S: string; def: LongInt): LongInt;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := StrToIntDef('not-an-integer', 0);  // 0
end;
```

### Usage

`StrToIntDef` parses a signed LongInt through Velox scripting, returning a supplied value when parsing fails.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string` | Signed integer text for a `LongInt` destination. The Velox `Val` Velox accepts decimal and `$`/`0x` hexadecimal forms. |
| `def` | `LongInt` | Value returned whenever `Val` reports invalid syntax, a partial token or a value outside the 32-bit destination. |

**Returns**

The parsed value in `-2147483648..2147483647`, or `def` on conversion failure.

**Errors**

Ordinary conversion errors return `def`. Unexpected script stack, string-conversion or allocation failures can still propagate.

**Usage notes**

This is the safer 32-bit choice when a fallback is acceptable and is the conversion used in existing Velox scripting guidance. Use [`StrToInt64Def`](StrToInt64Def.md) when values can exceed the `LongInt` range.

### Additional Technical Info
`StrToIntDef` parses a signed 32-bit `LongInt` and returns the caller's `def` value for invalid or out-of-range input. It uses the modified PascalScript utility implementation rather than Delphi `System.SysUtils.StrToIntDef` directly.

The example is source-reviewed and is not executed by the documentation workflow.

**Implementation**

PascalScript installs this as a standard function. Runtime dispatch case 2 passes both arguments to modified `uPSUtils.StrToIntDef`. That utility converts the script ANSI string to a Delphi string and calls intrinsic `System.Val` with a `LongInt` result. It returns `def` whenever `Val` reports a non-zero error position.

The public function is therefore behaviourally similar to Delphi `SysUtils.StrToIntDef`, but its actual terminal and adapter path are PascalScript's modified utility plus `System.Val`.

**Edge cases and quirks**

- `def` is returned for syntax errors and 32-bit range errors alike; the `Val` error position is discarded.
- A valid input equal to `def` is indistinguishable from failed conversion.
- Integer parsing is locale-independent and rejects decimal/grouping separators and currency symbols.
- Parsing does not accept a valid prefix and ignore trailing junk; the complete token must convert.
- Delphi documents decimal, `$` hexadecimal and `0x` hexadecimal forms. Free Pascal `Val` documents extra binary/octal forms that must not be assumed for Velox.
- The declaration uses `LongInt`, which is explicitly 32-bit in the reviewed runtime even on a 64-bit host.

**Side effects**

None.

**Performance and concurrency**

Linear in input length and independent of locale or mutable shared state.

**Related entries**

- [`StrToInt`](StrToInt.md) hard-codes `-1` as its failure sentinel.
- [`StrToInt64Def`](StrToInt64Def.md) provides the signed 64-bit equivalent.
- [`StrToUInt64Def`](StrToUInt64Def.md) parses unsigned 64-bit values.

**External references**

- [Free Pascal `System.Val`](https://www.freepascal.org/daily/doc/rtl/system/val.html) - compatibility reference for the underlying intrinsic model; its additional radix forms are not evidence for Delphi.
- [Embarcadero `System.Val`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.Val) - the Delphi intrinsic reached by PascalScript's modified utility.

<small>Created 2026-07-15</small>
