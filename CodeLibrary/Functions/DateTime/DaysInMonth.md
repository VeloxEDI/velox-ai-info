---
title: "DaysInMonth"
description: "Returns the number of days in the calendar month containing a TDateTime value."
sidebar_position: 19
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - month
  - leap-year
  - calendar
  - delphi
---

```Delphi
Function DaysInMonth(const AValue: TDateTime): Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := DaysInMonth(EncodeDate(2024, 2, 15)); // 29
end;
```

### Usage

`DaysInMonth` returns the number of days in the calendar month containing a TDateTime value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Date/time whose year and month select the month-length table. Time is ignored. |

**Returns**

`28`, `29`, `30` or `31` for a valid encoded date.

**Behaviour**

February reflects the decoded year's leap status. Every valid date in the same month produces the same result.

**Errors**

Valid dates do not raise. Invalid raw date values can propagate a failure from decoding/table access; Velox does not catch or normalise it.

### Additional Technical Info
`DaysInMonth` decodes the year and month containing a `TDateTime` value and returns that month's Gregorian length.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds to Delphi 37.0 `System.DateUtils.DaysInMonth`. It calls `DecodeDate` into local year/month/day variables, discards the day, then calls `DaysInAMonth(Year, Month)`.

**Edge cases and quirks**

- The delegated `DaysInAMonth` performs no month validation. If an unsupported raw value makes `DecodeDate` return month `0`, that zero becomes an invalid table index and can cause a range/access failure depending on RTL build checks.
- A valid `0.0` date decodes as December 1899 and returns `31`; zero is not an error sentinel.
- Timezone conversion is not performed before decoding.
- Free Pascal documents the same valid-date result but not the exact Delphi invalid-index boundary.

**Side effects**

None.

**Performance and concurrency**

Constant-time decode and lookup with no allocation or shared state.

**Related entries**

- [`DaysInAMonth`](DaysInAMonth.md) accepts explicit year and month fields.
- [`DaysInYear`](DaysInYear.md) returns the containing year length.
- [`DayOfTheMonth`](DayOfTheMonth.md) returns the current day number rather than the month maximum.

**External references**

- [Embarcadero `System.DateUtils.DaysInMonth`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DaysInMonth) - documents the exact Delphi function for valid dates.
- [Free Pascal `DaysInMonth`](https://www.freepascal.org/docs-html/rtl/dateutils/daysinmonth.html) - documents the compatible Free Pascal operation.

<small>Created 2026-07-15</small>
