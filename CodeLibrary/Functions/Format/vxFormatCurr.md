---
title: "vxFormatCurr"
description: "Formats a fixed-point Currency value with a Delphi numeric mask and explicit system-locale settings."
sidebar_position: 7
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - format
  - currency
  - numeric-mask
  - locale
  - delphi
---

```Delphi
Function vxFormatCurr(const Format: string; Value: Currency): string
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Amount: Currency;
begin
  Amount := 1234.5678;
  Value := vxFormatCurr('#,##0.00;(#,##0.00);Zero', Amount);
end;
```

### Usage

`vxFormatCurr` formats a fixed-point Currency value with a Velox numeric mask and explicit system-locale settings.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `Format` | `string`, `const` | Velox numeric mask, limited by Velox to 224 characters. |
| `Value` | `Currency` | Signed 64-bit fixed-point amount scaled by 10,000. The type range is approximately +/-922 trillion with four stored decimal places. |

**Returns**

The formatted amount. Display rounding, separators, grouping and literal text are controlled by the mask and captured locale; the value is unchanged.

**Sections and fallback**

- One section applies to all signs.
- Two sections use the first for positive/zero and the second for negative.
- Three sections select positive, negative and zero independently.
- An empty negative or zero section falls back to the positive section.
- An empty mask or positive section uses the RTL general numeric representation.

**Errors**

A mask longer than 224 characters raises Velox's format-too-long conversion error. Other Velox runtime/allocation failures propagate; Velox supplies no default result.

**Usage notes**

Keep the monetary unit separate from the numeric value. Choose an explicit mask and know the server locale when the result leaves Velox as text.

### Additional Technical Info
`vxFormatCurr` formats Delphi `Currency`, a signed fixed-point value stored with exactly four decimal places, using the same numeric-mask family as `FormatFloat`. It captures the Windows system-default locale on every call.

The example is fictional and source-reviewed. Its result is rounded to two displayed places and its punctuation depends on the Velox host locale. It was not executed by the documentation workflow.

**Implementation**

The script import points to `vxFormats.vxFormatCurr`. It builds `TFormatSettings.Create(LOCALE_SYSTEM_DEFAULT)` and invokes `System.SysUtils.FormatCurr(Format, Value, lFormatSettings)`. Installed Delphi uses the same `FloatToTextFmt` mask engine as `FormatFloat`, but passes a `Currency` input rather than binary floating point.

**Mask behavior**

| Token | Meaning |
|---|---|
| `0` / `#` | Required / optional digit positions. |
| `.` | Decimal marker; output uses the locale's decimal separator. |
| `,` | Requests locale grouping to the left of the decimal. |
| `E+` / `E-` | Scientific-notation forms supported by the shared formatter, though unusual for money. |
| Quoted text | Literal prefix, suffix or other text. |
| `;` | Separates positive, negative and zero sections. |

The value is rounded for display to the number of digit positions after the decimal marker. A mask with no decimal marker rounds the displayed result to a whole number. The fixed-point input itself is not altered.

**Edge cases and quirks**

- `Currency` already has only four fractional decimal places. A mask requesting more can show trailing zeroes but cannot recover finer input precision.
- Values assigned from floating-point expressions may already have been rounded into the four-decimal `Currency` representation before this function runs.
- A custom negative section controls its own sign/literals; parentheses or a minus sign appear only if the selected rules produce them.
- The mask is a presentation language, not a currency-code or accounting-standard selector. It does not know whether the value represents NZD, AUD or another unit.
- Locale grouping and decimal characters can make the output unsuitable for a database or interchange format.
- The function does not add the locale currency symbol unless the mask contains literal text that emits one; `FormatCurr` masks are not the same as the `%m` placeholder in general `Format`.

**Side effects**

Reads Windows locale data and allocates a string. It does not mutate `Value` or global settings.

**Performance and concurrency**

One locale snapshot, mask parse and fixed-point conversion per call. The local settings record avoids mutable-global-format races.

**Related entries**

- [`vxFormatFloat`](vxFormatFloat.md) uses the same mask family for binary floating-point input.
- [`FormatFloat`](FormatFloat.md) is the unprefixed floating wrapper.
- [`vxFormat`](vxFormat.md) offers the distinct `%m` general-format placeholder.

**External references**

- [Embarcadero `System.SysUtils.FormatCurr`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.FormatCurr)
- [Free Pascal `FormatCurr`](https://www.freepascal.org/docs-html/rtl/sysutils/formatcurr.html) - compatibility context, not the installed Velox terminal.

<small>Created 2026-07-15</small>
