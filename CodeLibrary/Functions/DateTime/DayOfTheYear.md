---
title: "DayOfTheYear"
description: "Returns the one-based ordinal day within the calendar year for a TDateTime value."
sidebar_position: 14
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - day-of-year
  - leap-year
  - calendar
  - delphi
---

```Delphi
Function DayOfTheYear(const AValue: TDateTime): Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := DayOfTheYear(EncodeDate(2024, 12, 31)); // 366
end;
```

### Usage

`DayOfTheYear` returns the one-based ordinal day within the calendar year for a TDateTime value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Value whose calendar date supplies the year and day. Time is ignored by truncation. |

**Returns**

`1` through `365`, or `366` in a leap year after 28 February.

**Behaviour**

The result follows Gregorian leap-year rules. It is a calendar ordinal, not a count of elapsed 24-hour periods from the exact time at the start of the year.

**Errors**

Valid encoded dates do not raise. Invalid decoded years can propagate an `EConvertError` from `EncodeDate` in the start-of-year helper.

### Additional Technical Info
`DayOfTheYear` returns the one-based ordinal position of a date within its calendar year. January 1 is `1`; the last day is `365` or `366` according to leap-year rules.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds to Delphi 37.0 `System.DateUtils.DayOfTheYear`. It computes `Trunc(AValue) - Trunc(StartOfTheYear(AValue)) + 1`. `StartOfTheYear` decodes the year and encodes 1 January.

**Edge cases and quirks**

- The time of day is removed with `Trunc`, including Delphi's special negative-date convention.
- Unsupported dates before year 1 can cause the delegated year decode/`EncodeDate` path to fail rather than return an ordinal.
- A timezone is not attached or applied. Convert the value first if the day must be determined in a different timezone.
- Free Pascal exposes the same one-based concept; Velox uses Delphi's exact start-of-year arithmetic.

**Side effects**

None.

**Performance and concurrency**

Constant-time calendar decode/encode and subtraction with no allocation or shared state.

**Related entries**

- [`DecodeDateDay`](DecodeDateDay.md) returns this ordinal together with its year.
- [`DaysInYear`](DaysInYear.md) returns the maximum ordinal for the value's year.
- [`DayOfTheMonth`](DayOfTheMonth.md) returns the day within the month.

**External references**

- [Embarcadero `System.DateUtils.DayOfTheYear`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DayOfTheYear) - documents the exact Delphi ordinal convention.
- [Free Pascal `DayOfTheYear`](https://www.freepascal.org/docs-html/rtl/dateutils/dayoftheyear.html) - documents the compatible Free Pascal routine.

<small>Created 2026-07-15</small>
