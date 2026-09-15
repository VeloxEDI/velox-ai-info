---
title: MonthsPerYear
description: "Defines the twelve calendar-month components in a year without treating a month or year as a fixed duration."
sidebar_position: 8
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, months, year, calendar]
---

```Delphi
MonthsPerYear = 12
```

### Example

```Delphi
procedure AddYears(const StartDate: TDateTime; Years: Integer;
  var FinishDate: TDateTime);
begin
  FinishDate := IncMonth(StartDate, Years * MonthsPerYear);
end;
```

### Usage

`MonthsPerYear` defines the twelve calendar-month components in a year without treating a month or year as a fixed duration.

### Additional Technical Info
`MonthsPerYear` is registered from Delphi DateUtils as a signed `LongInt`. It is the exact count of named calendar months in one year and is used by current DateUtils year-increment logic.

It is not a fixed-duration conversion. Months contain 28 through 31 civil days, years contain 365 or 366 days, and month-end rules determine how dates such as 29 February or the 31st are adjusted. Use `IncMonth`, `IncYear` or a Recode/TryRecode function so those rules and invalid results are explicit.

Multiplying by 12 can overflow for an unbounded Integer year count before the calendar function sees it. Validate business ranges first. The constant does not define fiscal calendars, 4-4-5 periods, ISO weeks or partner accounting periods.

The example uses the same month-based model as Delphi's year increment and was source-reviewed only; no calendar calculation was executed.

**Related Code Library entries**

- [IncMonth](../../Functions/DateTime/IncMonth.md) - month-based calendar increment.
- [IncYear](../../Functions/DateTime/IncYear.md) - direct year increment.

**External references**

- [Embarcadero System.DateUtils](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils) - declaring unit and calendar operations.
- [Free Pascal MonthsPerYear](https://www.freepascal.org/docs-html/rtl/dateutils/monthsperyear.html) - compatible constant.

<small>Created 2026-07-15</small>
