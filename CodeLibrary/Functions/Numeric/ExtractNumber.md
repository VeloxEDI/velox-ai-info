---
title: "ExtractNumber"
description: "Filters selected ASCII numeric characters from text and parses the result as a system-locale Double."
sidebar_position: 3
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - numeric
  - parsing
  - locale
---

```Delphi
function ExtractNumber(const S: string): Double;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := ExtractNumber('Weight: -12.50 kg'); // -12.5 with a dot-decimal system locale
end;
```

### Usage

`ExtractNumber` filters selected ASCII numeric characters from text and parses the result as a system-locale Double.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `S` | `string`, `const` | Source text. Only ASCII `0`..`9`, the first dot, and a leading `+`/`-` according to the collector rules can reach the parser. |

**Returns**

The parsed `Double`. If the source contains none of the accepted characters, it returns `0`. A non-empty but syntactically incomplete collected string such as `'-'`, `'+'`, `'.'` or `'-.'` reaches `StrToFloat` and raises rather than returning zero.

**Selection guidance**

Use this helper only for deliberately permissive text whose expected punctuation and locale are controlled. For business amounts, validate one complete token and use an explicit known format/locale rather than relying on character extraction.

### Additional Technical Info
`ExtractNumber` scans arbitrary text, keeps a small subset of ASCII numeric characters, then parses the synthesized text as a `Double` using the Windows system-default locale.

It is a permissive character collector, not a tokenizer and not a robust localized-number parser. Characters between digits are discarded, so unrelated numeric fragments can be joined. The example is fictional and source-reviewed only.

**Implementation**

1. `ExtractNumberString` scans `S` from left to right.
2. Every ASCII digit is appended, wherever it occurs.
3. The first `.` is appended; later dots are discarded.
4. `+` or `-` is appended only while the output count is still zero.
5. All other characters are discarded.
6. Empty collected text returns zero. Otherwise `vxStrToFloat` creates `TFormatSettings` for `LOCALE_SYSTEM_DEFAULT` and calls Delphi `StrToFloat`.
7. The parsed `Extended` helper result is narrowed to this function's `Double` return.

**Examples of the collector**

| Source | Collected text | Consequence |
|---|---|---|
| `'abc1def2'` | `'12'` | Numeric fragments are concatenated. |
| `'1e3'` | `'13'` | Exponent notation is not recognized. |
| `'1,234.56'` | `'1234.56'` | Comma is discarded. |
| `'1.234,56'` | `'1.23456'` | European grouping/decimal meaning is not preserved. |
| `'abc-12'` | `'-12'` | A sign is accepted before the first retained character, even after discarded prefix text. |
| `'.-5'` | `'.5'` | The dot consumes the initial position, so the later sign is discarded. |

**Locale and format quirks**

- The collector always emits a literal dot, but parsing uses system-default decimal and thousands separators. On a comma-decimal system, a dot can be rejected or interpreted differently.
- Parenthesized negatives, currency semantics, grouping validation, hexadecimal, exponent notation, NaN and infinity are not supported as structured forms.
- Unicode digits outside ASCII `0`..`9` are discarded.
- No trim or single-token boundary exists. IDs, dates, units and multiple amounts can collapse into one misleading number.
- Overflow, malformed collected text and system-locale ambiguity propagate as Delphi conversion errors.

**Related entries**

- [`ConvertHtmlHexToTColor`](ConvertHtmlHexToTColor.md) parses a fixed hexadecimal shape rather than filtering decimal text.

**External references**

- [Free Pascal: `SysUtils.StrToFloat`](https://www.freepascal.org/docs-html/rtl/sysutils/strtofloat.html)
- [Embarcadero DocWiki: `System.SysUtils.StrToFloat`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils.StrToFloat)

<small>Created 2026-07-15</small>
