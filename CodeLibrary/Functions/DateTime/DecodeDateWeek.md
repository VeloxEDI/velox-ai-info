---
title: "DecodeDateWeek"
description: "Writes the ISO week-numbering year, week number and Monday-based weekday for a TDateTime value."
sidebar_position: 26
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - decoding
  - week-of-year
  - iso-8601
  - var-parameters
  - delphi
---

```Delphi
Procedure DecodeDateWeek(const AValue: TDateTime;
  var AYear, AWeekOfYear, ADayOfWeek: Word)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  WeekYear, WeekNumber, WeekdayNumber: Word;
begin
  DecodeDateWeek(EncodeDate(2021, 1, 1),
    WeekYear, WeekNumber, WeekdayNumber);
  // Outputs: 2020, 53, 5 (Friday)
  Value := WeekNumber;
end;
```

### Usage

`DecodeDateWeek` writes the ISO week-numbering year, week number and Monday-based weekday for a TDateTime value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Date/time to express as ISO week fields. Time is ignored. |
| `AYear` | `Word`, `var` | Overwritten with the ISO week-numbering year, which can differ from the calendar year. |
| `AWeekOfYear` | `Word`, `var` | Overwritten with week `1..52` or `1..53`. |
| `ADayOfWeek` | `Word`, `var` | Overwritten with Monday `1` through Sunday `7`. |

**Behaviour**

Dates near New Year can belong to the adjacent ISO year. For example, Friday 1 January 2021 is ISO year 2020, week 53, day 5.

**Errors**

Valid dates do not raise. Invalid decoded dates can propagate Velox encode/conversion errors.

### Additional Technical Info
`DecodeDateWeek` expresses a date using ISO 8601 week-numbering fields. Weeks start on Monday, and week `1` is the week containing the year's first Thursday (equivalently, at least four days of the new year).

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.DecodeDateWeek`. The routine fully decodes the calendar date and remaps its Sunday-first day number to ISO order. It measures from 1 January, shifts the count according to that date's weekday, recursively attributes an initial partial week to the prior ISO year, and moves a final partial week to week `1` of the next ISO year when required.

**Edge cases and quirks**

- `AYear` is the **week-numbering year**, not necessarily the calendar year returned by `DecodeDate`.
- Week `53` occurs only for years whose weekday/leap pattern supplies it; do not assume every year has 53 weeks.
- `ADayOfWeek` uses Monday-first ISO numbering and differs from `DayOfWeek`.
- The script declaration exposes Delphi outputs as `var`; all are overwritten.
- Invalid raw values can fail in the recursive/start-of-year helper path. No success flag is returned.
- Free Pascal offers the same field set; the installed Delphi algorithm defines Velox's exact boundary result.

**Side effects**

Only the three output variables are changed.

**Performance and concurrency**

Constant bounded arithmetic. Valid boundary recursion crosses at most to an adjacent year. No allocation or shared state.

**Related entries**

- [`DecodeDate`](DecodeDate.md) returns the literal calendar year/month/day.
- [`DecodeDateMonthWeek`](DecodeDateMonthWeek.md) applies the four-day rule to months.
- [`DayOfTheWeek`](DayOfTheWeek.md) returns the same ISO weekday numbering.

**External references**

- [Embarcadero `System.DateUtils.DecodeDateWeek`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DecodeDateWeek) - documents the exact ISO week contract.
- [Free Pascal `DecodeDateWeek`](https://www.freepascal.org/docs-html/rtl/dateutils/decodedateweek.html) - documents the compatible Free Pascal fields.

<small>Created 2026-07-15</small>
