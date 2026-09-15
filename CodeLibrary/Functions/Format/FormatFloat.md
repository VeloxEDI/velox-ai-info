---
title: "FormatFloat"
description: "Formats an Extended value with a Delphi numeric mask and a fresh Windows system-locale snapshot."
sidebar_position: 3
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
Function FormatFloat(const Format: string; Value: Extended): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := FormatFloat('#,##0.00;(#,##0.00);Zero', -1234.5);
  // For an en-NZ-style system locale: (1,234.50)
end;
```

### Usage

`FormatFloat` formats an Extended value with a Velox numeric mask and a fresh Windows system-locale snapshot.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Format` | `string`, `const` | Velox numeric mask containing digit placeholders, optional sections, literals and scientific notation. |
| `Value` | `Extended` | Floating-point value to round and render. Available precision follows the compiled Velox target's `Extended` representation. |

**Returns**

The formatted number. Decimal/group separators and some fallback output depend on the Windows system-default locale.

**Sections and fallback**

- One section formats every value.
- Two sections use the first for positive/zero and the second for negative values.
- Three sections use positive, negative and zero sections respectively.
- An empty negative or zero section falls back to the positive section.
- An empty positive section or entirely empty mask uses Velox general floating formatting with 15 significant digits.
- General formatting is also used for more than 18 digits to the left of the decimal when the mask does not request scientific notation.

**Errors**

A mask longer than 224 characters raises Velox's format-too-long conversion error. Other invalid mask/runtime conditions and allocation failures propagate; Velox does not return a default string.

**Usage notes**

Use quoted literals for fixed labels and test the exact mask/locale combination expected in deployment. For protocol numbers that require `.` and no grouping, do not assume this system-locale function is invariant.

### Additional Technical Info
`FormatFloat` formats one `Extended` value with Delphi's numeric-mask language. This is not the `%` placeholder language used by [`Format`](Format.md). In Velox it is a thin alias wrapper over [`vxFormatFloat`](vxFormatFloat.md) and uses a fresh Windows system-default locale snapshot.

The example is fictional and source-reviewed. Its punctuation is intentionally described as locale-dependent, and it was not executed by the documentation workflow.

**Implementation**

The runtime registration points to `vxFormats.FormatFloat`, which immediately calls `vxFormatFloat`. That wrapper creates `TFormatSettings.Create(LOCALE_SYSTEM_DEFAULT)` and invokes the explicit-settings overload of `System.SysUtils.FormatFloat`.

Installed Delphi source rejects masks longer than 224 characters (`256 - 32`) before calling `FloatToTextFmt`. Velox does not add validation or catch terminal exceptions.

**Mask characters**

| Token | Behavior |
|---|---|
| `0` | Required digit position; emits zero when no value digit occupies the position. |
| `#` | Optional digit position; emits nothing when no digit occupies the position. |
| `.` | The first decimal-marker token; the output character comes from the captured `DecimalSeparator`. |
| `,` | Enables grouping to the left of the decimal; placement/count in the mask does not define custom group sizes. |
| `E+`, `E-`, `e+`, `e-` | Enables scientific notation; following zeroes set the minimum exponent width, up to the RTL limit. |
| `'text'`, `"text"` | Emits quoted characters literally. |
| `;` | Separates positive, negative and zero sections. |

The number is rounded to the count of digit placeholders to the right of the decimal token. With no decimal token it is rounded to a whole number.

**Edge cases and quirks**

- `.` and `,` are syntax, not guaranteed output characters. The actual separators come from the host locale.
- Grouping is a Boolean request for RTL locale grouping; multiple commas do not define Indian-style or arbitrary grouping.
- Additional decimal-point tokens after the first do not create additional decimal separators.
- Extra integer digits are emitted before the leftmost placeholder; the mask does not truncate them.
- Rounding is presentation behavior and does not modify `Value`.
- A negative section can add parentheses or other literals, but the script author is responsible for including the desired sign/literals.
- Floating-point binary representation can affect the last displayed digit near rounding boundaries.
- `FormatFloat` and `vxFormatFloat` are behaviorally identical despite their separate runtime pointers: the former delegates directly to the latter.

**Side effects**

Reads Windows locale data and allocates a string. It does not modify `Value` or global format settings.

**Performance and concurrency**

Each call captures locale settings, parses the mask and formats one value. Local settings avoid races on global `FormatSettings`; output can still differ across hosts or after a system-locale change.

**Related entries**

- [`vxFormatFloat`](vxFormatFloat.md) is the implementation used by this alias wrapper.
- [`vxFormatCurr`](vxFormatCurr.md) applies the same mask family to fixed-point `Currency` input.
- [`Format`](Format.md) supports `%f`, `%g` and `%n` inside a general placeholder string.

**External references**

- [Embarcadero `System.SysUtils.FormatFloat`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FormatFloat)
- [Free Pascal `FormatFloat`](https://www.freepascal.org/docs-html/rtl/sysutils/formatfloat.html) - compatible concepts; installed Delphi governs Velox limits and edge behavior.

<small>Created 2026-07-15</small>
