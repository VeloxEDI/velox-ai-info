---
title: "Format"
description: "Formats an open argument array with Delphi placeholders using a fresh Windows system-locale snapshot."
sidebar_position: 1
slug: /Functions/Format/Format
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
Function Format(const aFormat: string; const Args: array of const): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := Format('Line %0:d: %-12s x %2:.2f (%%)', [7, 'Widget', 3.5]);
  // Line 7: Widget       x 3.50 (%)
end;
```

### Usage

Formats an open argument array with Velox placeholders using a fresh Windows system-locale snapshot.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aFormat` | `string`, `const` | Literal text and Velox `%` format specifiers. |
| `Args` | `array of const`, `const` | Zero-based open array supplying values and any `*` width/precision arguments. Use square brackets at the call site. |

**Returns**

A newly allocated string containing the literals and converted arguments. Numeric punctuation and currency presentation can depend on the Windows system-default locale of the Velox host.

**Placeholder syntax**

```text
%[index:][-][width][.precision]type
```

| Element | Meaning |
|---|---|
| `%%` | Emits one literal percent sign and consumes no argument. |
| `index:` | Selects an argument by zero-based index. The selection also resets where the following implicit placeholder reads. |
| `-` | Left-aligns inside a field whose minimum `width` is larger than the converted value. The default is right alignment. |
| `width` | Minimum field width; shorter text is padded with spaces and longer text is not truncated. |
| `.precision` | Controls minimum integer digits, fractional/significant digits, or maximum string length depending on `type`. |
| `*` | May supply index, width or precision from the next array element; the supplied value must have the required integer type. |

Common case-insensitive conversion types are `d` signed decimal, `u` unsigned decimal, `x` hexadecimal, `e` scientific, `f` fixed, `g` general, `n` grouped number, `m` money, `p` pointer and `s` string/character text.

**Usage notes**

Prefer explicit indices when a translated or generated message may reorder values. For machine-to-machine output, do not assume `Format` is culture-neutral merely because the placeholder contains a period.

### Additional Technical Info
`Format` assembles a string from literal text, `%` placeholders and an open array of values. In Velox it is an exact alias of [`vxFormat`](vxFormat.md), not the global-settings overload of Delphi `System.SysUtils.Format`.

The example is fictional and source-reviewed. Its decimal point is locale-sensitive even though `.` appears in the placeholder; the shown output assumes a system locale whose decimal separator is a period. It was not executed by the documentation workflow.

**Implementation**

The formats import registers both `Format` and `vxFormat` with the same runtime pointer, `vxFormats.vxFormat`. That wrapper constructs `TFormatSettings.Create(LOCALE_SYSTEM_DEFAULT)` on every call and passes the resulting local record to the explicit-settings overload of `System.SysUtils.Format`. It therefore avoids Delphi's mutable global `FormatSettings`, but it is not invariant formatting.

Delphi's formatter first tries a fixed buffer and grows the result when required. Velox adds no validation, conversion, fallback or exception handling around that terminal.

**Argument consumption and types**

- Without an explicit index, placeholders consume arguments in sequence.
- An explicit index changes the current argument position for subsequent implicit placeholders. For example, after `%0:d`, the next unindexed placeholder reads argument 1.
- Width and precision supplied by `*` also consume array elements before the value being formatted.
- A placeholder must be compatible with the actual open-array value. Numeric-looking text is not automatically a valid integer or floating argument for every conversion type.
- `%s` precision is a maximum character count, whereas numeric precision has type-specific meaning.

**PascalScript open-array adapter constraints**

Before the Delphi terminal runs, the modified PascalScript runtime builds a temporary `TVarRec` for each script array element. It explicitly maps 8/16/32-bit ordinal values to Delphi `vtInteger`, `Single`/`Double`/`Extended` to `vtExtended`, both 64-bit integer kinds to `vtInt64`, strings/characters/PChar to their text kinds, and `Variant` to `vtVariant`.

That adapter has important limits:

- A `Variant` element is accepted by Delphi `Format` only for `%s`; the terminal converts the contained variant to text. Numeric placeholders do not coerce a numeric variant and raise a type error.
- Script `Currency` (`btCurrency`) is not handled by the adapter. Its zero-filled temporary record remains `vtInteger(0)`: `%d`, `%u` or `%x` can misleadingly render zero, while floating/money placeholders reject it. Use [`vxFormatCurr`](vxFormatCurr.md) or convert to a supported floating type before building `Args`.
- Records, sets, nested arrays and non-nil general pointers are likewise not mapped. Because the temporary buffer starts as zeroes, an unsupported non-nil element can be seen as integer zero rather than producing an adapter-specific error.
- Both signed and unsigned 64-bit script integers arrive as `vtInt64`. `%u` reinterprets those bits as unsigned, but `%d` treats a value above `MaxInt64` as its signed representation.
- Class/interface values are mapped, but the installed Delphi formatter explicitly rejects those `TVarRec` kinds. A nil element is the one adapter path that becomes a real nil `vtPointer` and can be formatted with `%p`.

These are product-runtime rules, not generic Delphi `Format` rules. Prefer scalar literals/variables with known mapped types and avoid using the formatter as an object/record serializer.

**Locale behavior**

`f`, `g`, `n` and `m` conversions use the captured decimal, grouping and currency settings. The mask's `.` introduces precision syntax; it does not force a period into the result. The same script can therefore produce different punctuation or currency text on hosts with different Windows system-default locales.

**Edge cases and quirks**

- `Args` may be empty only when the format text contains no consuming placeholder.
- Literal `%` must be written as `%%`; a lone or malformed specifier is an error.
- Explicit argument indices are zero-based and are not isolated references: they alter subsequent implicit consumption.
- Minimum width never limits a longer result. Only the relevant precision rule, such as `%s`, can truncate converted content.
- Unsupported open-array element types can be silently represented as integer zero before Delphi validates the placeholder; validate or convert values before constructing `Args`.
- `Format` does not quote SQL, JSON, XML, CSV or shell text. A correctly formatted value is not automatically safe in another grammar.
- Locale is sampled per call from `LOCALE_SYSTEM_DEFAULT`, not from the current Windows user, map configuration, input data or a caller-selectable culture.
- Free Pascal aims for Delphi compatibility but is not the installed terminal; differences in supported open-array value kinds or exceptional cases must not be inferred as Velox behavior.

**Side effects**

The function reads Windows locale data and allocates a result. It does not modify the arguments or Delphi's global format settings.

**Errors**

Velox does not catch errors. A malformed specifier, missing argument, out-of-range index, incompatible argument type or invalid `*` value can propagate an `EConvertError`; allocation/runtime failures can also propagate. Treat a dynamic format string as executable formatting instructions and validate it before use.

**Performance and concurrency**

Work is proportional to format length plus converted output, with additional numeric conversion and allocation cost. Each call constructs its own settings record, so concurrent calls do not race on the mutable global `FormatSettings`; outputs can still change if the host's system-default locale changes.

**Related entries**

- [`vxFormat`](vxFormat.md) is the same implementation under the Velox-prefixed name.
- [`vxFormatFloat`](vxFormatFloat.md) uses Delphi numeric-mask syntax rather than `%` placeholders.
- [`vxFormatDateTime`](vxFormatDateTime.md) uses Delphi date/time tokens.

**External references**

- [Embarcadero `System.SysUtils.Format`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.Format) - documents the Delphi placeholder grammar used by the Velox wrapper.
- [Free Pascal `Format`](https://www.freepascal.org/docs-html/rtl/sysutils/format.html) - compatibility reference for a similar open-array formatter; installed Delphi and Velox source remain authoritative.

<small>Created 2026-07-15</small>
