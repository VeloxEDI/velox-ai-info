---
title: "NthDayOfWeek"
description: "Returns the one-based occurrence band of a date's day-of-month, from first through fifth."
sidebar_position: 110
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - weekday
  - month
  - occurrence
---

```Delphi
Function NthDayOfWeek(const AValue: TDateTime): Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDate(2026, 7, 18);
  Value := NthDayOfWeek(InputValue); // 3: the third occurrence band
end;
```

### Usage

`NthDayOfWeek` returns the one-based occurrence band of a date's day-of-month, from first through fifth.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded date whose day-of-month determines the occurrence band. Its time component is ignored. |

**Returns**

A `Word` from 1 through 5.

**Behaviour**

- The actual weekday number is not separately calculated because the day-of-month band is sufficient for the supplied date.
- The result resets to 1 on the first day of every calendar month.
- Days 29, 30 and 31 return 5 when those dates exist.
- Time-of-day and timezone interpretation do not affect the result.

**Important usage notes**

- The name can suggest that the function accepts a weekday to search for, but it has only one argument. It classifies the weekday occurrence of the date already supplied.
- A result of 5 does not prove that every weekday has a fifth occurrence in that month. It proves only that this valid date is in the fifth seven-day band.
- Invalid or non-finite encoded input can raise while extracting the day-of-month.

**Usage notes**

Use the matching encode/decode day-of-week-in-month routines when a year, month, weekday and occurrence must be converted as separate fields.

### Additional Technical Info
`NthDayOfWeek` returns which occurrence band within a month contains the supplied date: days 1-7 return 1, days 8-14 return 2, days 15-21 return 3, days 22-28 return 4, and days 29-31 return 5. Because a date's weekday repeats every seven days, that band is also the occurrence number of its particular weekday in the month.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.NthDayOfWeek`. It extracts `DayOfTheMonth(AValue)` and calculates `(day - 1) div 7 + 1` using integer division.

**Side effects**

None.

**Errors**

Velox does not catch or translate date decode exceptions.

**Performance and concurrency**

Constant-time date extraction and integer arithmetic with no shared mutable state.

**Related entries**

- [`EncodeDayOfWeekInMonth`](EncodeDayOfWeekInMonth.md) constructs a date from occurrence and weekday fields.
- [`DecodeDayOfWeekInMonth`](DecodeDayOfWeekInMonth.md) returns the occurrence and weekday as separate outputs.

**External references**

- [Embarcadero `System.DateUtils.NthDayOfWeek`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.NthDayOfWeek)
- [Free Pascal `NthDayOfWeek`](https://www.freepascal.org/docs-html/rtl/dateutils/nthdayofweek.html)

<small>Created 2026-07-15</small>
