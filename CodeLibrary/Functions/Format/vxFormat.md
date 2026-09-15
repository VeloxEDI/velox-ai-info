---
title: "vxFormat"
description: "Formats an open argument array with Delphi placeholders and Velox's explicit system-locale settings."
sidebar_position: 6
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - format
  - placeholders
  - strings
  - locale
  - delphi
---

```Delphi
Function vxFormat(const aFormat: string; const Args: array of const): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := vxFormat('%0:s has %1:d item(s) at %2:.2f each',
    ['Example order', 3, 12.5]);
end;
```

### Usage

`vxFormat` formats an open argument array with Velox placeholders and Velox's explicit system-locale settings.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFormat` | `string`, `const` | Literal text plus Velox `%[index:][-][width][.precision]type` specifiers. |
| `Args` | `array of const`, `const` | Zero-based values referenced by the specifiers; call syntax uses `[value1, value2, ...]`. |

**Returns**

The assembled string. The conversion is culture-sensitive for floating-point, grouped-number and money specifiers.

**Errors**

Malformed placeholders, too few arguments, invalid indices, incompatible argument types and invalid indirect width/precision values can raise `EConvertError`. Velox does not catch or replace these errors.

**Usage notes**

Use `vxFormat` for human-readable or host-locale output and for carefully controlled structural assembly. For protocols and persistence formats, explicitly account for locale and escaping rather than treating it as an invariant serializer.

### Additional Technical Info
`vxFormat` is Velox's locale-explicit wrapper around Delphi's general-purpose open-array formatter. It substitutes values into `%` placeholders, using a fresh snapshot of the Windows system-default number and currency settings for each call.

The example is fictional and source-reviewed. Its decimal punctuation depends on the host locale, and it was not executed by the documentation workflow.

**Implementation**

PascalScript registers `vxFormat` directly to `vxFormats.vxFormat`. The function creates `TFormatSettings` with `LOCALE_SYSTEM_DEFAULT` and invokes `System.SysUtils.Format(aFormat, Args, lFormatSettings)`. [`Format`](Format.md) is registered to this exact same pointer, so the two public names have identical behavior and exceptions.

The explicit settings overload avoids reading Delphi's mutable global `FormatSettings`. It does not make output invariant: Windows system-default decimal, thousand and currency settings are deliberately captured on each call.

**Specifier summary**

| Type | Conversion |
|---|---|
| `d`, `u`, `x` | Signed decimal, unsigned decimal or hexadecimal integer. |
| `e`, `f`, `g` | Scientific, fixed or general floating-point text. |
| `n`, `m` | Grouped number or money using captured locale settings. |
| `p` | Native pointer in hexadecimal; PascalScript's adapter does not preserve a non-nil script pointer for this terminal. |
| `s` | String, character or compatible text; precision limits maximum characters. |

`%%` emits a literal percent sign. Width is a minimum padded field width; `-` requests left alignment. Precision has conversion-specific meaning. Index, width and precision may be supplied directly, and supported positions may use `*` to consume an integer from the argument array.

**Argument indexing quirks**

- Indices are zero-based.
- Unindexed placeholders consume values in order.
- An explicit index also changes the next implicit position. `%d %d %0:d %d` with `[1,2,3,4]` uses `1 2 1 2`, not `1 2 1 4`.
- A `*` width or precision consumes its own argument before the value argument.
- The actual open-array value type must match the conversion. The formatter is not a general `Variant` coercion API.

**PascalScript adapter quirks**

The call adapter materialises script elements as temporary Delphi `TVarRec` records. Integer-sized ordinal values, floating values, 64-bit integers, text/character values, PChar, variants and class/interfaces have explicit mappings. The terminal then imposes another restriction: `Variant` works only with `%s`, and class/interface kinds are rejected.

Several script types have no adapter case. In particular, script `Currency`, records, sets, nested arrays and non-nil general pointers leave their zero-initialised temporary record as `vtInteger(0)`. An integer placeholder can consequently output a false zero, while a floating, money, string or pointer placeholder raises a type error. Use [`vxFormatCurr`](vxFormatCurr.md) for a `Currency` value, and convert or serialize composite values explicitly before formatting.

Signed and unsigned 64-bit values both become `vtInt64`; `%u` reinterprets the bits as unsigned, while `%d` uses signed interpretation. A nil element becomes `vtPointer(nil)`, but non-nil script pointers are not reliably available to `%p`.

**Edge cases and quirks**

- An empty format returns an empty string even when unused arguments are supplied.
- An empty argument array works only when no consuming specifier is present.
- Padding does not truncate values that exceed the requested width.
- `%s` precision may truncate text; numeric precision controls digits according to the conversion type.
- `n` and `m` can differ between Velox hosts. `f` and `g` also use the captured decimal separator.
- Formatting does not escape the converted value for SQL or another target language. Use the target-specific encoder or parameters where available.
- `LOCALE_SYSTEM_DEFAULT` is a machine-level choice, not necessarily the interactive user's regional settings.
- Unsupported array-element types can look like integer zero because of the current PascalScript adapter, so a normal return does not prove every original element type was preserved.

**Side effects**

Reads locale data and allocates the result only. The input array and global settings are not modified.

**Performance and concurrency**

The function parses the format and converts each referenced value on every call. Settings are local to the invocation, making ordinary concurrent formatting independent of global `FormatSettings`, subject to the shared operating-system locale.

**Related entries**

- [`Format`](Format.md) is an exact script alias.
- [`vxFormatFloat`](vxFormatFloat.md) formats one number with numeric-mask syntax.
- [`SQLDateTimeString`](SQLDateTimeString.md) provides Velox's legacy quoted Microsoft SQL date/time text.

**External references**

- [Embarcadero `System.SysUtils.Format`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.Format)
- [Free Pascal `Format`](https://www.freepascal.org/docs-html/rtl/sysutils/format.html) - compatibility context, not proof of installed Delphi edge behavior.

<small>Created 2026-07-15</small>
