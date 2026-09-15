---
title: "EncodeDayOfWeekInMonth"
description: "Encodes the nth occurrence of a Monday-based weekday within a calendar month as a midnight TDateTime."
sidebar_position: 35
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - weekday
  - occurrence
  - calendar
---

```Delphi
Function EncodeDayOfWeekInMonth(const AYear, AMonth, ANthDayOfWeek,
  ADayOfWeek: Word): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := EncodeDayOfWeekInMonth(2026, 7, 3, 5); // Third Friday: 17 July
end;
```

### Usage

`EncodeDayOfWeekInMonth` encodes the nth occurrence of a Monday-based weekday within a calendar month as a midnight TDateTime.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word`, `const` | Gregorian year `1..9999`. |
| `AMonth` | `Word`, `const` | Month `1..12`. |
| `ANthDayOfWeek` | `Word`, `const` | Occurrence `1..5`; occurrence 5 is valid only when that weekday occurs five times in the month. |
| `ADayOfWeek` | `Word`, `const` | Monday `1` through Sunday `7`. |

**Errors**

An invalid year/month or a supported occurrence that does not exist raises `EConvertError`; the exception propagates. An out-of-range occurrence or weekday is not reliably rejected: it can return a calculated date or fail, depending on the resulting day calculation. Do not use the exception as input validation.

### Additional Technical Info
`EncodeDayOfWeekInMonth` returns the literal nth occurrence of a weekday inside a named calendar month. This differs from ISO month-week ownership: the first occurrence is simply the first matching weekday on or after the first of the month.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.EncodeDayOfWeekInMonth`. The implementation finds the ISO weekday of the month's first day, calculates a day number from `ANthDayOfWeek` and `ADayOfWeek`, and passes that calculated day to `TryEncodeDate`. It does not first call a range validator for the occurrence or weekday.

**Edge cases and quirks**

- A fifth occurrence is not guaranteed. Requesting the fifth Monday in a month with only four Mondays fails rather than returning a date in the next month.
- The documented supported ranges remain occurrence `1..5` and weekday `1..7`, but the installed Delphi implementation does not enforce those ranges before its arithmetic. Some out-of-range combinations can still calculate a valid day in the named month and return it instead of raising. Validate both arguments before calling; Free Pascal's general out-of-range error statement does not describe this Delphi quirk.
- `ANthDayOfWeek` is not an ISO week-of-month number. Use `EncodeDateMonthWeek` for the ISO four-day ownership model.
- Weekday numbering is Monday `1` through Sunday `7`, not the Sunday-based numbering of `DayOfWeek`.
- The implementation's final date validation is what rejects an occurrence that falls beyond the month.
- The output is a timezone-neutral midnight value.

**Side effects**

None.

**Performance and concurrency**

Constant bounded arithmetic with no allocation or shared state.

**Related entries**

- [`DecodeDayOfWeekInMonth`](DecodeDayOfWeekInMonth.md) returns the literal ordinal occurrence and weekday.
- [`EncodeDateMonthWeek`](EncodeDateMonthWeek.md) uses ISO month-week ownership instead.

**External references**

- [Embarcadero `System.DateUtils.EncodeDayOfWeekInMonth`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.EncodeDayOfWeekInMonth)
- [Free Pascal `EncodeDayOfWeekInMonth`](https://www.freepascal.org/docs-html/rtl/dateutils/encodedayofweekinmonth.html)

<small>Created 2026-07-15</small>
