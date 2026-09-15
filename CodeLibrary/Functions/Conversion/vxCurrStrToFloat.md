---
title: "vxCurrStrToFloat"
description: "Filters currency-like text and parses the retained characters as a system-locale Extended value."
sidebar_position: 43
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - currency
  - floating-point
  - locale
  - delphi
---

```Delphi
function vxCurrStrToFloat(const S: string): Extended;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // On a host whose system decimal separator is a dot:
  Value := vxCurrStrToFloat('NZD 1,234.50');  // 1234.5
end;
```

### Usage

`vxCurrStrToFloat` filters currency-like text and parses the retained characters as a system-locale Extended value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string`, `const` | Source text to filter. Digits, `-`, `+`, `.`, and the system decimal separator are retained; every other character is discarded. |

**Returns**

The Velox `Extended` value parsed from the filtered text. Precision and range depend on the target on which Velox was built; `Extended` is 80-bit on targets that define it that way and aliases a smaller floating type on others.

**Behaviour**

Filtering is character-based and does not preserve token boundaries. Currency codes, symbols, grouping characters and letters disappear rather than being interpreted. On a dot-decimal system, `NZD 1,234.50` becomes `1234.50`; on a comma-decimal system, both the comma and the always-retained dot survive, so the same source becomes `1,234.50` and fails Velox parsing.

**Errors**

After filtering, an empty, malformed or out-of-range token raises Velox `EConvertError`. The exception propagates to the script. A lone retained sign or decimal character is the special case that returns zero instead.

**Usage notes**

Use this helper only when discarding currency decoration is intentional and the accepted source forms are controlled. For strict interchange data, normalise the agreed decimal and grouping syntax explicitly and use [`vxTryStrToFloat`](vxTryStrToFloat.md) or a raising conversion on the resulting token.

### Additional Technical Info
`vxCurrStrToFloat` removes most non-numeric characters from currency-like text, then parses the remaining characters as an `Extended` value using the Windows system locale. It is a permissive cleaning helper, not a locale-aware currency-format parser.

The example is explicitly for a dot-decimal host. It is fictional, source-reviewed and not executed by the documentation workflow.

**Implementation**

The scripting import binds the public name directly to `vxFormats.vxCurrStrToFloat`. For every call, the function creates `TFormatSettings` with `LOCALE_SYSTEM_DEFAULT`, builds a character set containing `0`-`9`, both signs, a literal dot and that settings record's `DecimalSeparator`, and copies matching characters into a temporary string in their original order.

If the temporary string consists of exactly one sign or decimal character, the function returns zero. Every other temporary string, including an empty string, is passed to `System.SysUtils.StrToFloat(Filtered, AFormatSettings)`. The Delphi terminal requires a complete ordinary decimal/scientific token apart from surrounding ASCII spaces, although this Velox filter has already removed all spaces and all exponent letters.

**Edge cases and quirks**

- A literal dot is always retained, even when the system decimal separator is a comma. It is not treated as a grouping separator in that locale.
- A grouping character is discarded only when it is neither `.` nor the current decimal separator. This can conveniently collapse `1,234` to `1234` on a dot-decimal host, but it is not a general grouping algorithm.
- Letters and spaces between digits are removed, so `1 2`, `1ABC2` and similar inputs collapse to `12` instead of failing at the removed character.
- Parentheses are discarded. `(125)` therefore becomes positive `125`; accounting parentheses are not converted to a negative sign.
- Exponent markers are discarded. `1E3` becomes `13`, not `1000`. `NAN` and `INF` become empty and fail.
- A lone `-`, `+`, `.`, or locale decimal separator returns `0`. Empty input or input containing only other discarded characters produces an empty temporary string and raises during `StrToFloat`.
- Multiple signs or decimal characters are preserved and normally make the final token invalid. A sign embedded between digits is not normalised.
- Because filtering can turn materially different inputs into the same number, this function should not be used as validation that a source field conforms to an agreed currency format.

**Side effects**

The call allocates a filtered string and a local format-settings record but changes no application data. When the `vxFormats` unit itself is initialised, it sets the initialising thread locale to `LOCALE_SYSTEM_DEFAULT` and refreshes Delphi's global format settings; that unit-level action is not repeated by this function.

**Performance and concurrency**

Filtering and parsing are linear in the input length and allocate a temporary string sized initially to the source. A fresh explicit settings record avoids Delphi's mutable global `FormatSettings`; later calls can still reflect a host system-locale change.

**Related entries**

- [`vxStrToFloat`](vxStrToFloat.md) parses without discarding characters.
- [`vxTryStrToFloat`](vxTryStrToFloat.md) reports conversion failure without raising.
- [`vxStrToCurr`](vxStrToCurr.md) returns fixed-point `Currency` but does not accept currency symbols or grouping separators.

**External references**

- [Embarcadero `System.SysUtils.StrToFloat`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.SysUtils.StrToFloat) - documents the exact Delphi terminal used after Velox filtering.
- [Free Pascal `StrToFloat`](https://www.freepascal.org/daily/doc/rtl/sysutils/strtofloat.html) - compatible decimal/scientific reference; it does not define Velox's character filter or Delphi runtime behaviour.

<small>Created 2026-07-15</small>
