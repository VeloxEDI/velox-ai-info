---
title: "DecodeDateMonthWeek"
description: "Writes the ISO week-year month, week-of-month and Monday-based weekday for a TDateTime value."
sidebar_position: 24
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - decoding
  - week-of-month
  - iso-8601
  - var-parameters
  - delphi
---

```Delphi
Procedure DecodeDateMonthWeek(const AValue: TDateTime;
  var AYear, AMonth, AWeekOfMonth, ADayOfWeek: Word)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  YearValue, MonthValue, WeekValue, WeekdayValue: Word;
begin
  DecodeDateMonthWeek(EncodeDate(2026, 7, 18),
    YearValue, MonthValue, WeekValue, WeekdayValue);
  // 2026, 7, 3, 6: the third ISO week of July, Saturday
  Value := WeekValue;
end;
```

### Usage

`DecodeDateMonthWeek` writes the ISO week-year month, week-of-month and Monday-based weekday for a TDateTime value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Date/time to express in ISO month-week fields. Time is ignored. |
| `AYear` | `Word`, `var` | Overwritten with the year to which the ISO month-week belongs. This can differ from the input's calendar year at a boundary. |
| `AMonth` | `Word`, `var` | Overwritten with the ISO owning month (`1..12`), which can be adjacent to the input's calendar month. |
| `AWeekOfMonth` | `Word`, `var` | Overwritten with the one-based week number in the owning month. |
| `ADayOfWeek` | `Word`, `var` | Overwritten with Monday `1` through Sunday `7`. |

**Behaviour**

The outputs describe the **week's owning month**, not necessarily the literal calendar month of `AValue`. This is intentional ISO week attribution, not a decoding error.

**Errors**

Valid dates do not raise. Invalid decoded fields can propagate Velox conversion/range failures; Velox adds no handler.

### Additional Technical Info
`DecodeDateMonthWeek` expresses a date in Delphi's ISO-8601-style month-week system: the week belongs to the month containing at least four of that week's days, and weekdays run Monday `1` through Sunday `7`.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds to Delphi 37.0 `System.DateUtils.DecodeDateMonthWeek`. It first decodes the calendar fields and maps Delphi's Sunday-first decode result to ISO Monday-first numbering. It locates the month's first day, adjusts the input day according to the weekday on which the month starts, and recursively attributes an initial partial week with fewer than four in-month days to the previous month. A final partial week with only Monday-through-Wednesday in the current month is attributed to the next month and becomes week `1` there.

**Edge cases and quirks**

- Dates near the start or end of a month can return the previous/next `AMonth`; crossing January/December can also change `AYear`.
- `AWeekOfMonth` is not the same as the simple occurrence number returned by [`DecodeDayOfWeekInMonth`](DecodeDayOfWeekInMonth.md). A Saturday on the first of a month can belong to the prior ISO month-week while still being the first Saturday of its calendar month.
- Weekdays are Monday `1` through Sunday `7`, not `DayOfWeek` numbering.
- The script declaration uses `var` for Delphi outputs. Every output is overwritten on a valid call.
- Invalid raw dates are not guarded and can cause recursive/encoding failures.
- Free Pascal exposes the same named decomposition, but its documentation does not replace the installed Delphi boundary algorithm.

**Side effects**

Only the four output variables are changed.

**Performance and concurrency**

Constant bounded calendar arithmetic. Boundary handling recurses at most into an adjacent month for a valid value. No allocation or shared state.

**Related entries**

- [`DecodeDateWeek`](DecodeDateWeek.md) uses ISO week-of-year ownership.
- [`DecodeDayOfWeekInMonth`](DecodeDayOfWeekInMonth.md) returns the simple nth weekday in the literal calendar month.
- [`DayOfTheWeek`](DayOfTheWeek.md) returns the same weekday numbering alone.

**External references**

- [Embarcadero `System.DateUtils.DecodeDateMonthWeek`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DecodeDateMonthWeek) - documents the exact Delphi ISO month-week contract.
- [Free Pascal `DecodeDateMonthWeek`](https://www.freepascal.org/docs-html/rtl/dateutils/decodedatemonthweek.html) - documents the compatible field set.

<small>Created 2026-07-15</small>
