---
title: "vxStringtoDateTime"
description: "Parses date/time text against a supplied Velox format mask using system-locale names and settings."
sidebar_position: 46
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - conversion
  - date
  - time
  - format mask
  - locale
---

```Delphi
function vxStringtoDateTime(
  const DateTimeFormat: string;
  const DateTimeStr: string): TDateTime;
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := vxStringtoDateTime(
    'YYYY-MM-DD HH:NN:SS',
    '2026-07-16 14:30:00');
end;
```

### Usage

`vxStringtoDateTime` parses date/time text against a supplied Velox format mask using system-locale names and settings.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `DateTimeFormat` | `string`, `const` | Velox parsing mask. The parser trims it and converts it to uppercase. |
| `DateTimeStr` | `string`, `const` | Text to consume. The parser trims it and converts it to uppercase before matching numeric or locale-name fields. |

**Returns**

The assembled Velox `TDateTime`. Ordinary parsing or range failure returns `0.0`, which is also the valid value for 30 December 1899 midnight. A time-only parse is anchored to the current local date rather than returned as a fraction between zero and one.

**Behaviour**

Single `D`, `M` and `H` tokens first try two input characters and fall back to one when that candidate is invalid or out of the token's preliminary range. Parsed fields start at zero. If no date field was supplied and the most recently processed time field was valid, the parser fills year, month and day from `Now`. AM maps hour 12 to zero; PM adds 12 to hours below 12.

The final date/time range check accepts hours `0` through `23`. Velox rejects hour `24`, despite wording on the current public DocWiki page.

**Usage notes**

Prefer `YYYY`, explicit numeric fields, prevalidated separators and a separate success signal. Never use `O`/`OO` for timezone conversion in Velox, and never infer failure solely from a zero return when 30 December 1899 is permitted data.

### Additional Technical Info
`vxStringtoDateTime` is Velox's custom format-mask parser. It extracts date and time fields from text, validates the assembled fields through the installed Delphi date/time encoder, and returns a `TDateTime`. It is not Delphi `StrToDateTime`, and its masks are not a fully symmetric inverse of Delphi `FormatDateTime` masks.

The example uses a fictional fixed timestamp. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The date-tools scripting import registers this exact function. `vxDateTools.vxStringtoDateTime` creates `TFormatSettings.Create(LOCALE_SYSTEM_DEFAULT)`, destructively consumes working copies of mask and input, and passes the resulting fields to the installed Studio 37.0 `System.DateUtils.TryEncodeDateTime` terminal.

The effective mask tokens are:

| Token | Processing |
|---|---|
| `D`, `DD` | Greedy one-or-two digit day, or exactly two consumed characters. |
| `DDD`, `DDDD` | Discard three input characters, or match a system long weekday name by its first three letters and delete that full name. Neither form verifies the weekday against the date. |
| `M`, `MM` | Greedy one-or-two digit month, or exactly two consumed characters. |
| `MMM`, `MMMM` | Match the first three letters of a system **long** month name; delete three characters for `MMM` or the full long name for `MMMM`. |
| `YY`, `YYYY` | Consume two or four characters as a year. Only these two year widths assign a value. |
| `H`, `HH` | Greedy one-or-two digit hour, or exactly two consumed characters. |
| `NN`, `SS` | Consume two characters as minutes or seconds. Single `N` and single `S` have no evaluation branch. |
| `ZZ`, `ZZZ` | Consume two or three characters as milliseconds. |
| `AP` | Consume one character; `A` selects AM and every other character selects PM. |
| `AM`, `PM`, `AMP`, `AMPM` | Consume two characters; exact `AM` selects AM and every other pair selects PM. |
| `+` | Recognised as a token start but has no processing branch and consumes no input. |
| `O`, `OO` | Consume one or two characters as an integer hour offset. The parsed offset is not applied because the returned value from `IncHour` is discarded. |

All other unquoted format characters act as one-character positional placeholders. Their value is never compared with the input. Quote characters themselves consume nothing; characters inside the quotes still behave as unchecked placeholders.

**Edge cases and quirks**

- The loop condition is `i < Length(DateTimeFormat)`. A one-character mask and a token beginning only at the final mask character are never processed.
- `Y` and `YYY` can be accumulated as candidate tokens but have no evaluation branch. Only `YY` and `YYYY` set the year.
- `YY` converts invalid text to zero before applying the century rule. With a century window of 50, for example, invalid text and `00` both become the current century's year 00, while `50` becomes the previous century's year 50.
- A single `H` greedily accepts two digits only through `23`. Input beginning `24` falls back to hour `2` and can leave `4` unvalidated. `HH` consumes `24` and the installed terminal rejects the final time.
- `DDD` does no name check. `DDDD` and the month-name tokens compare only three-character prefixes, use long-name arrays and do not detect every possible prefix ambiguity.
- Literal separators are wildcards. A `YYYY-MM-DD` mask accepts any one character in each separator position.
- When exactly one input character remains at a literal mask position, the parser does not delete it. It can survive to the unchecked suffix described below.
- Scanning stops when either the format loop ends or the working input becomes empty. Unconsumed input and unprocessed trailing mask content are not rejected. A complete date can therefore succeed even when required trailing time fields are absent.
- `timePartSpecified` is assigned by each time token rather than accumulated. Final invalid components are still rejected, but the current-date decision depends on the last processed time field.
- AM/PM validation is permissive: most non-`AM` input is classified as PM.
- `+` is a no-op. `O`/`OO` consume exactly one/two characters and parse with `-1` as the local fallback; the subsequent `IncHour(Result, -Offset)` return is ignored. Offset text never changes the returned timestamp.
- Invalid numeric fields, incomplete dates and final range failures collapse to `0.0` without identifying which field failed.
- Locale-name matching and two-digit-year/time-only results depend on the host system locale and current local date at call time.

**Side effects**

No persistent product data is changed. The result can depend on the system locale and current date/time. Temporary strings are repeatedly shortened during parsing.

**Errors**

Ordinary syntax and range failures return `0.0` rather than raising. Locale acquisition, string allocation and unexpected runtime exceptions can still propagate. Use [`vxStringtoDateTimeValid`](vxStringtoDateTimeValid.md) when a separate success value is required.

**Performance and concurrency**

For normal short values the work is small, but repeated managed-string copies/deletions and locale-name scans add allocation overhead. Per-call parser state is local. Concurrent calls do not share the parser variables, though a system-locale change or midnight rollover can change later results.

**Related entries**

- [`StringtoDateTime`](StringtoDateTime.md) is a scripting alias that calls this implementation.
- [`vxStringtoDateTimeValid`](vxStringtoDateTimeValid.md) duplicates the parser and exposes its final validation state.
- [`vxStringtoTime`](vxStringtoTime.md) derives a mask from the system short-time format and calls this parser.
- [`vxStrToDateTime`](vxStrToDateTime.md) uses Delphi's locale parser instead of a caller-supplied Velox mask.

**External references**

- [Embarcadero `System.DateUtils.TryEncodeDateTime`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.DateUtils.TryEncodeDateTime) - describes the Delphi field-encoding terminal; the installed source remains authoritative where its hour range differs from the page.
- [Free Pascal `TryEncodeDateTime`](https://www.freepascal.org/docs-html/rtl/dateutils/tryencodedatetime.html) - compatible field-encoding context, not a definition of Velox's mask scanner.
- [Embarcadero `System.DateUtils.IncHour`](https://docwiki.embarcadero.com/Libraries/Florence/en/System.DateUtils.IncHour) - confirms that offset adjustment returns a new value, explaining why discarding it has no effect.
- [Free Pascal `IncHour`](https://www.freepascal.org/docs-html/rtl/dateutils/inchour.html) - compatible functional-return comparison; it does not define the Velox offset token.

<small>Created 2026-07-15</small>
