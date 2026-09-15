---
title: "DayOfTheWeek"
description: "Returns the ISO weekday number for a TDateTime value, with Monday 1 and Sunday 7."
sidebar_position: 13
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - weekday
  - iso-8601
  - calendar
  - delphi
---

```Delphi
Function DayOfTheWeek(const AValue: TDateTime): Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := DayOfTheWeek(EncodeDate(2026, 7, 20)); // 1: Monday
end;
```

### Usage

`DayOfTheWeek` returns the ISO weekday number for a TDateTime value, with Monday 1 and Sunday 7.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Date/time whose encoded calendar date supplies the weekday. |

**Returns**

`1` Monday, `2` Tuesday, `3` Wednesday, `4` Thursday, `5` Friday, `6` Saturday or `7` Sunday.

**Behaviour**

Weekday numbering is fixed and independent of the process locale's preferred first day of week. It matches the numbering returned by `DecodeDateWeek`, `DecodeDateMonthWeek` and `DecodeDayOfWeekInMonth`.

**Errors**

Valid dates do not raise. Timestamp conversion failures from invalid numeric values propagate.

### Additional Technical Info
`DayOfTheWeek` returns an ISO-8601-style weekday number: Monday is `1` and Sunday is `7`. This numbering is used by Delphi's ISO week and month-week functions.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.DayOfTheWeek`. It converts the value to a Delphi timestamp, then calculates `(TimeStamp.Date - 1) mod 7 + 1`. The time-of-day field is not used.

**Edge cases and quirks**

- Do not confuse this with [`DayOfWeek`](DayOfWeek.md), where Sunday is `1`. The two functions return different numbers for every weekday; never infer the numbering convention from the similar names alone.
- The date is interpreted exactly as encoded; no timezone conversion is performed before finding the weekday.
- Unsupported raw values outside Delphi's timestamp domain are not validated and modulo behaviour for them is not a supported contract.
- Free Pascal's DateUtils function follows the same Monday-first concept.

**Side effects**

None.

**Performance and concurrency**

Constant-time timestamp conversion and modulo arithmetic with no shared state.

**Related entries**

- [`DayOfWeek`](DayOfWeek.md) uses Sunday-first Delphi/SysUtils numbering.
- [`DecodeDateWeek`](DecodeDateWeek.md) returns ISO week-year, week and this weekday convention together.
- [`DecodeDayOfWeekInMonth`](DecodeDayOfWeekInMonth.md) returns the weekday occurrence within a calendar month.

**External references**

- [Embarcadero `System.DateUtils.DayOfTheWeek`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DayOfTheWeek) - documents the exact ISO numbering used by Delphi.
- [Free Pascal `DayOfTheWeek`](https://www.freepascal.org/docs-html/rtl/dateutils/dayoftheweek.html) - documents the compatible Free Pascal routine.

<small>Created 2026-07-15</small>
