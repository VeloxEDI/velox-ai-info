---
title: WeeksInAYear
description: "Returns whether a supplied ISO week-year contains 52 or 53 weeks."
sidebar_position: 165
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date-time
  - iso-week
---

```Delphi
Function WeeksInAYear( const AYear : Word) : Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := WeeksInAYear(2020);
  // Value is 53.
end;
```

### Usage

`WeeksInAYear` returns whether a supplied ISO week-year contains 52 or 53 weeks.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word` | Gregorian year from 1 through 9999 whose ISO week count is required. |

**Behaviour**

A 53-week year is one whose calendar layout leaves 53 Thursdays in the ISO week-year: a common year beginning on Thursday, or a leap year beginning on Wednesday or Thursday. Locale first-day-of-week settings do not alter the calculation.

**Errors**

An invalid year causes the installed `EncodeDate` Velox to raise a date conversion error. Velox does not catch it.

### Additional Technical Info
Returns the number of ISO 8601 weeks in `AYear`. A valid year has either 52 or 53 ISO weeks.

**Implementation**

Velox binds directly to `System.DateUtils.WeeksInAYear`. The installed routine starts with 52, encodes 1 January of `AYear`, obtains its ISO weekday and adds one week when 1 January is Thursday, or when it is Wednesday in a leap year. This is the standard consequence of assigning the first ISO week to the week containing the year's first Thursday.

**Edge cases and quirks**

- `AYear` is a `Word`, so the scripting declaration accepts numeric values beyond the supported Gregorian year. The implementation does not pre-check the range; its `EncodeDate(AYear, 1, 1)` call raises for 0 or a value above 9999.
- The result describes an ISO week-year, not the count of arbitrary seven-day periods in 365 or 366 days.
- Free Pascal documents the equivalent 52/53 rule. Installed Delphi 37.0 source remains authoritative for the exposed Velox routine.

**Performance and concurrency**

The routine performs one date encoding plus fixed arithmetic and allocates no objects.

**Related entries**

- [`WeeksInYear`](WeeksInYear.md) — obtains the calendar year from a `TDateTime` before applying this function.
- [`WeekOfTheYear`](WeekOfTheYear.md) — returns the ISO week containing a date.
- [`IsInLeapYear`](IsInLeapYear.md) — tests whether an encoded date falls in a leap year.

**External references**

- [Free Pascal: `WeeksInAYear`](https://www.freepascal.org/docs-html/rtl/dateutils/weeksinayear.html)
- [Embarcadero DocWiki: `System.DateUtils.WeeksInAYear`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.WeeksInAYear)

<small>Created 2026-07-15</small>
