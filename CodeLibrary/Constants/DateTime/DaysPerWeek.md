---
title: DaysPerWeek
description: "Defines the exact seven-day size of a week for DateUtils arithmetic and ordinal calculations."
sidebar_position: 2
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, days, week, dateutils]
---

```Delphi
DaysPerWeek = 7
```

### Example

```Delphi
procedure AddWholeWeeks(const StartDate: TDateTime; Weeks: Integer;
  var FinishDate: TDateTime);
begin
  FinishDate := IncDay(StartDate, Weeks * DaysPerWeek);
end;
```

### Usage

`DaysPerWeek` defines the exact seven-day size of a week for DateUtils arithmetic and ordinal calculations.

### Additional Technical Info
`DaysPerWeek` is registered as a signed `LongInt` from Delphi DateUtils. It is the exact count of calendar days in one week. Current DateUtils uses it in week spans, week increments and ordinal-week calculations.

The constant does not choose the first day of the week or a week-numbering system. The separate Velox weekday constants use Monday=1 through Sunday=7, while SysUtils `DayOfWeek` uses Sunday=1. It also does not tell you whether a date belongs to ISO week 52 or 53.

Adding seven to a timezone-free `TDateTime` moves its civil serial date by seven days. It does not guarantee exactly 604,800 elapsed UTC seconds if the values are interpreted as local time across a daylight-saving transition. Use an explicit timezone-aware integration boundary when elapsed instants matter.

Multiplication occurs in the surrounding expression type. Validate large/untrusted week counts and use calendar helpers so range and invalid-date failures remain visible. The example is source-reviewed only; no date arithmetic was executed.

**Related Code Library entries**

- [WeeksPerFortnight](WeeksPerFortnight.md) - two weeks per fortnight.
- [IncWeek](../../Functions/DateTime/IncWeek.md) - direct week calendar increment.
- [WeekSpan](../../Functions/DateTime/WeekSpan.md) - span measured in seven-day units.

**External references**

- [Embarcadero System.DateUtils](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils) - Delphi calendar-unit context.
- [Free Pascal DaysPerWeek](https://www.freepascal.org/docs-html/rtl/dateutils/daysperweek.html) - compatible constant.

<small>Created 2026-07-15</small>
