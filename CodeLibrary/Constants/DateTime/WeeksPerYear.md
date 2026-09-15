---
title: WeeksPerYear
description: "Defines a legacy 52-week approximation for a year and must not be used as the exact ISO week count."
sidebar_position: 18
classification: public
status: review-required
owner: Cam Hart
keywords: [velox, scripting, constant, weeks, year, iso, approximation]
---

```Delphi
WeeksPerYear = 52
```

### Example

```Delphi
function IsOrdinaryWeekNumber(const WeekNumber: Integer): Boolean;
begin
  Result := (WeekNumber >= 1) and (WeekNumber <= WeeksPerYear);
end;
```

### Usage

`WeeksPerYear` defines a legacy 52-week approximation for a year and must not be used as the exact ISO week count.

### Additional Technical Info
The Velox DateUtils importer registers `WeeksPerYear` as a signed `LongInt` literal. It represents the 52 complete seven-day blocks contained in every civil year. It is not the exact length of that year: 52 weeks contain 364 days, leaving one day in a common year and two in a leap year.

It is also not the maximum ISO week number. ISO week-numbering years can have week 53, according to the position of year boundaries. Use [`WeeksInAYear`](../../Functions/DateTime/WeeksInAYear.md) or the DecodeDateWeek family when ISO validity matters.

The current installed Delphi DateUtils source no longer declares this `WeeksPerYear` constant, although Velox deliberately continues to register the literal. Do not assume current RTL algorithms cap a week number at 52.

The example deliberately calls values 1..52 "ordinary" rather than universally valid; it would reject a legitimate ISO week 53. It is source-reviewed only and was not executed.

**Related Code Library entries**

- [DaysPerWeek](DaysPerWeek.md) - exact week size.
- [FortnightPerYear](FortnightPerYear.md) - corresponding 26-fortnight approximation.

**External references**

- [Embarcadero WeeksInAYear](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.WeeksInAYear) - computes 52 or 53 for an actual year.
- [Free Pascal WeeksInAYear](https://www.freepascal.org/docs-html/rtl/dateutils/weeksinayear.html) - compatible ISO week-count function.

<small>Created 2026-07-15</small>
