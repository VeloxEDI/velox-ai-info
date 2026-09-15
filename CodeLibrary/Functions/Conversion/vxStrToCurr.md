---
title: "vxStrToCurr"
description: "Converts Windows system-locale currency text to Currency and raises when parsing fails."
sidebar_position: 49
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - currency
  - locale
  - validation
  - delphi
---

```Delphi
function vxStrToCurr(const S: string): Currency;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  Amount: Currency;
begin
  Amount := vxStrToCurr('125');
  Value := Amount;
end;
```

### Usage

`vxStrToCurr` converts Windows system-locale currency text to Currency and raises when parsing fails.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string`, `const` | Optional sign, decimal digits, optional system decimal separator/fraction, and optional `E`/`e` exponent with a signed integer exponent. Leading/trailing ASCII spaces are allowed. |

**Returns**

The parsed `Currency`, in the range `-922337203685477.5808` through `922337203685477.5807`, stored to four fractional decimal places.

**Behaviour**

The decimal character must equal the Windows system locale's `DecimalSeparator`. The entire remaining string must be consumed. `125`, a locale-correct `125.5`, and a locale-correct exponent such as `1.25E2` describe the same amount.

**Errors**

Malformed syntax, a disallowed separator, currency decoration or an out-of-range result raises `EConvertError` into the script. Use [`vxStrToCurrDef`](vxStrToCurrDef.md) for an intentional fallback or [`vxTryStrToCurr`](vxTryStrToCurr.md) for an explicit success test.

**Usage notes**

Validate the upstream money format separately. If a source includes codes, symbols or grouping, remove or interpret those components according to a declared source contract before calling this strict numeric parser.

### Additional Technical Info
`vxStrToCurr` parses locale-sensitive numeric text into Delphi's four-decimal fixed-point `Currency` type. It raises when the complete string is not a valid in-range numeric token. Currency symbols and grouping separators are not accepted.

The example deliberately uses an integer token so its separator is portable. It is fictional, source-reviewed and not executed by the documentation workflow.

**Implementation**

The formats scripting import binds `vxStrToCurr` to `vxFormats.vxStrToCurr`. The wrapper creates `TFormatSettings.Create(LOCALE_SYSTEM_DEFAULT)` and calls `System.SysUtils.StrToCurr(S, AFormatSettings)`. The installed Delphi 37.0 overload delegates to `TextToFloat` with a Currency destination and raises `EConvertError` when that terminal returns `False`.

The parser consumes an optional sign, decimal/scientific digits and surrounding ASCII spaces, scales to Currency's four decimal places, checks the signed 64-bit scaled range and rounds excess fractional precision to the nearest representable value with ties to even.

**Edge cases and quirks**

- `Curr` refers to the destination type, not decorated money syntax. Currency symbols, accounting parentheses and thousands separators fail.
- A dot is valid only when it is the system decimal separator. On a comma-decimal host, use the comma form and do not include a dot grouping character.
- More than four fractional digits are rounded, not truncated. Exact half-way cases use ties-to-even rounding at the fourth decimal place.
- `NAN`, `INF` and `-INF` are not valid Currency values and fail even though Delphi floating parsing accepts them for `Extended`.
- Overflow and underflow beyond Currency's scaled 64-bit range fail rather than saturating.
- Leading and trailing U+0020 spaces are skipped by the installed terminal; arbitrary internal whitespace and other trailing characters are invalid.
- Locale is `LOCALE_SYSTEM_DEFAULT`, not the service account's user locale or Delphi's mutable global format record. The same text can parse differently across hosts.

**Side effects**

The call only constructs local settings and parser state. The `vxFormats` unit separately sets the initialising thread locale and refreshes Delphi globals when the unit is loaded; this call does not mutate those globals.

**Performance and concurrency**

Parsing is linear in input length and uses bounded numeric state. A local settings record avoids races on Delphi global `FormatSettings`; later calls can observe a changed host system locale.

**Related entries**

- [`vxStrToCurrDef`](vxStrToCurrDef.md) returns a supplied Currency on conversion failure.
- [`vxTryStrToCurr`](vxTryStrToCurr.md) reports success and writes the result through an output parameter.
- [`vxCurrStrToFloat`](vxCurrStrToFloat.md) discards many non-numeric characters and returns floating `Extended`, so its acceptance and precision contracts differ.
- [`vxCurrToStr`](vxCurrToStr.md) formats Currency with the same system-locale policy.

**External references**

- [Embarcadero `System.SysUtils.StrToCurr`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StrToCurr) - documents the exact Delphi overload family, grammar and raising contract.
- [Free Pascal `StrToCurr`](https://www.freepascal.org/daily/doc/rtl/sysutils/strtocurr.html) - compatible no-symbol Currency conversion reference; Delphi source defines Velox rounding and range behaviour.

<small>Created 2026-07-15</small>
