---
title: "StringtoDateTime"
description: "Parses date/time text against a supplied Velox format mask using system-locale settings."
sidebar_position: 22
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
---

```Delphi
Function StringtoDateTime( const DateTimeFormat : string; const DateTimeStr : string) : TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := StringtoDateTime(
    'YYYY-MM-DD HH:NN:SS',
    '2026-07-16 14:30:00');
end;
```

### Usage

`StringtoDateTime` parses date/time text against a supplied Velox format mask using system-locale settings.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `DateTimeFormat` | `string`, `const` | Velox parsing mask. Leading/trailing spaces are removed and letters are made uppercase before parsing. |
| `DateTimeStr` | `string`, `const` | Text to parse. Leading/trailing spaces are removed and letters are made uppercase. |

**Returns**

The parsed local `TDateTime`. Failure normally returns `0.0` (Velox's 30 December 1899 value), so zero is both a valid value and the parser's failure sentinel.

**Behaviour**

Single `D`, `M` and `H` tokens greedily try two characters and fall back to one when the value is out of range or not numeric. Separators and other literal format characters consume one input character without comparing its value. Quotation marks themselves consume no input; characters between quotes still act as unchecked one-character placeholders.

A time-only parse, with all date parts still zero and at least one valid time part, supplies the current local date from `Now`. A partial date does not receive missing defaults. AM converts hour 12 to zero; PM adds 12 when the hour is below 12.

**Errors**

Ordinary syntax/range failures collapse to `0.0`. Allocation or locale-initialisation exceptions can still propagate. The function provides no separate success flag; use [`vxStringtoDateTimeValid`](vxStringtoDateTimeValid.md) when its distinct contract has been reviewed for the flow.

**Usage notes**

Prefer four-digit years, explicit numeric fields and checked separators upstream. Treat zero as ambiguous and validate the result against the integration's permitted date range.

### Additional Technical Info
`StringtoDateTime` is Velox's custom mask-driven date/time parser. It extracts numeric or system-locale name fields from the supplied text and returns a Delphi `TDateTime`. It is not Delphi `StrToDateTime` or the inverse of every `FormatDateTime` mask.

The example parses a deterministic fictional timestamp. It is source-reviewed and is not executed by the documentation workflow.

**Implementation**

The date-tools import binds to `vxDateTools.StringtoDateTime`, a one-line wrapper over the Velox-owned `vxStringtoDateTime` parser. It captures `TFormatSettings.Create(LOCALE_SYSTEM_DEFAULT)`, scans the mask and destructively consumes a working copy of the input, then calls `System.DateUtils.TryEncodeDateTime`.

Supported effective tokens are:

| Token | Meaning |
|---|---|
| `D`, `DD` | One/two-digit or fixed two-digit day of month. |
| `DDD`, `DDDD` | Three characters discarded as a weekday, or a system long weekday name selected by its first three letters. The weekday is not checked against the date. |
| `M`, `MM`, `MMM`, `MMMM` | Numeric month or system long-month name selected by its first three letters. |
| `YY`, `YYYY` | Two- or four-digit year. Two-digit years use the current year and system `TwoDigitYearCenturyWindow`; see the non-numeric `YY` quirk below. |
| `H`, `HH`, `NN`, `SS` | Hour, minute and second. `N` is not a supported single-minute token. |
| `ZZ`, `ZZZ` | Two- or three-digit milliseconds. |
| `AP`, `AM`, `PM`, `AMP`, `AMPM` | `AP` consumes one input character; every other listed mask consumes two, even when the mask itself is longer. |
| `+` | Recognised as a format-specifier start but has no evaluation branch and consumes no input. It can leave a sign for a following offset token. |
| `O`, `OO` | One or two input characters are parsed as an integer hour offset. `OO` can therefore consume a sign plus one digit; the current implementation does not apply the parsed value. |

**Edge cases and quirks**

- The main loop uses `i < Length(Format)`. A one-character format and a token that begins only at the final character are not processed.
- `Y` and `YYY` can be recognised while building a token but have no evaluation branch. Only `YY` and `YYYY` assign a year.
- `YY` first converts two characters with a default of zero and then applies the century window. Consequently, non-numeric text and `00` can both become the first year of the current century instead of failing at the year parse.
- A single `H` greedily reads two digits only when they form `0`-`23`. For input beginning `24`, it accepts the leading `2` as the hour and can leave `4` unvalidated; `HH` reads `24` and the final Delphi range check rejects it.
- `DDD` discards three input characters without validating a weekday. `DDDD` compares only the first three letters to system long names, deletes the matched full name and never checks it against the resulting date.
- Literal separators are positional wildcards: `YYYY-MM-DD` also accepts different separator characters in those positions.
- Parsing stops when either the scan condition or input is exhausted. Remaining format or input is not rejected.
- Any two-letter AM/PM token treats text other than `AM` as PM; `AP` treats anything other than leading `A` as P.
- The `+` format token is a no-op. The offset branch reads exactly the `O`/`OO` mask length, uses `-1` for conversion failure, and calls `IncHour(Retvar, -Off)` but discards the function result. Offset text therefore never changes the returned value. Do not use these masks for UTC conversion.
- Invalid numeric fields, incomplete dates and failed `TryEncodeDateTime` normally return `0.0` rather than raising.
- Locale-name matching and the two-digit-year result depend on the system locale and current local date at call time.

**Side effects**

No persistent state is changed. The result can depend on system locale, current date/time and process environment.

**Performance and concurrency**

The parser repeatedly copies and deletes managed strings and scans locale name arrays. Cost is roughly linear for normal short masks but includes allocation overhead. Calls use local state; time and locale changes can make identical two-digit-year or time-only inputs produce different dates.

**Related entries**

- [`vxStringtoDateTimeValid`](vxStringtoDateTimeValid.md) exposes a related parser with a success output.
- [`vxStringtoDateTime`](vxStringtoDateTime.md) exposes the underlying parser directly.
- [`vxStringtoTime`](vxStringtoTime.md) parses a time using Velox's configured format handling.

**External references**

- [Embarcadero `TryEncodeDateTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.TryEncodeDateTime) - the Delphi range-validation terminal used after Velox parses the fields.
- [Free Pascal `TryEncodeDateTime`](https://www.freepascal.org/docs-html/rtl/dateutils/tryencodedatetime.html) - compatible field-encoding context; it does not define Velox's mask parser or its quirks.

<small>Created 2026-07-15</small>
