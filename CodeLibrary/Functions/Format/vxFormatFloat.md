---
title: "vxFormatFloat"
description: "Formats an Extended value with a Delphi numeric mask using explicit system-locale settings."
sidebar_position: 9
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - format
  - float
  - numeric-mask
  - locale
  - delphi
---

```Delphi
Function vxFormatFloat(const Format: string; Value: Extended): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := vxFormatFloat('0.000E+00', 12345.0);
end;
```

### Usage

`vxFormatFloat` formats an Extended value with a Velox numeric mask using explicit system-locale settings.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Format` | `string`, `const` | Numeric mask. It is limited to 224 characters by the Velox. |
| `Value` | `Extended` | Floating-point input; it can carry the normal binary floating-point rounding limitations. |

**Returns**

Text produced by Velox's explicit-settings `FormatFloat` overload.

**Errors**

Masks longer than 224 characters raise a format-too-long conversion error. Velox does not catch RTL conversion, allocation or runtime exceptions.

**Usage notes**

Use `vxFormatFloat` when server-locale presentation is intended. For stable interchange decimals, explicitly control the required culture elsewhere in the flow.

### Additional Technical Info
`vxFormatFloat` is Velox's direct wrapper for formatting an `Extended` value with a Delphi numeric mask and an explicit snapshot of the Windows system-default locale. [`FormatFloat`](FormatFloat.md) delegates to this same implementation.

The example is fictional, deterministic apart from locale punctuation and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The import binds directly to `vxFormats.vxFormatFloat`. It constructs `TFormatSettings.Create(LOCALE_SYSTEM_DEFAULT)` and calls `System.SysUtils.FormatFloat(Format, Value, lFormatSettings)`. The unprefixed `FormatFloat` wrapper calls this function, so both names use identical masks, locale data, rounding and errors.

**Numeric-mask language**

- `0` requires a digit; `#` makes a digit optional.
- The first `.` marks the decimal position, but Delphi emits the captured locale's decimal separator.
- One or more `,` tokens enable locale grouping; their number and positions do not define arbitrary group sizes.
- `E+`, `E-`, `e+` or `e-` enables scientific notation, with following zeroes controlling minimum exponent digits.
- Text inside single or double quotes is emitted literally.
- Up to three semicolon-separated sections define positive, negative and zero output.

Values are rounded to the number of placeholders to the right of the decimal token. Extra digits to the left are retained rather than clipped.

**Fallback behavior**

An empty mask or empty positive section uses general formatting with 15 significant digits. The same general path is used when a non-scientific mask encounters more than 18 integer digits. Empty negative or zero sections reuse the positive section rather than producing an empty result.

**Edge cases and quirks**

- Locale separators can make output unsuitable for a fixed external numeric grammar.
- A mask can deliberately emit arbitrary quoted text, including output with no visible digits.
- Negative and zero appearance comes from section selection; it is not automatically a leading minus in a custom negative section.
- Formatting rounds only the text. Reparse operations may not reproduce the exact original binary value.
- `Extended` precision depends on the compiled Windows target; do not rely on excess precision for portable script behavior.
- The mask-length check is by UTF-16 character count, not result length.

**Side effects**

Reads the machine's system-default locale and allocates a result string. No input or global setting is changed.

**Performance and concurrency**

Mask parsing and numeric conversion happen per call. The local settings record avoids global-format-settings races, while operating-system locale remains shared process context.

**Related entries**

- [`FormatFloat`](FormatFloat.md) is the unprefixed wrapper alias.
- [`vxFormatCurr`](vxFormatCurr.md) formats four-decimal fixed-point currency values.
- [`vxFormat`](vxFormat.md) formats several open-array arguments with `%` specifiers.

**External references**

- [Embarcadero `System.SysUtils.FormatFloat`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FormatFloat)
- [Free Pascal `FormatFloat`](https://www.freepascal.org/docs-html/rtl/sysutils/formatfloat.html) - compatibility reference only.

<small>Created 2026-07-15</small>
