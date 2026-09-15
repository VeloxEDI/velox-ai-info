---
title: "DayOfTheMonth"
description: "Returns the ordinal day within the calendar month for a TDateTime value."
sidebar_position: 12
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - calendar
  - day-of-month
  - delphi
---

```Delphi
Function DayOfTheMonth(const AValue: TDateTime): Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := DayOfTheMonth(EncodeDate(2026, 7, 18)); // 18
end;
```

### Usage

`DayOfTheMonth` returns the ordinal day within the calendar month for a TDateTime value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Date/time value from which the day number is decoded. |

**Returns**

`1` for the first day of a month through `28`, `29`, `30` or `31` for its last day, according to the supplied date.

**Behaviour**

The time component is ignored. This value is a calendar component, not the count of complete 24-hour periods since the month's first timestamp.

**Errors**

No ordinary exception for valid dates. The function adds no validation or error handling.

### Additional Technical Info
`DayOfTheMonth` returns the one-based day number within the value's calendar month. In Velox's installed Delphi runtime it is an exact alias for [`DayOf`](DayOf.md), not a week-based calculation.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils scripting import binds directly to Delphi 37.0 `System.DateUtils.DayOfTheMonth`. Its implementation is `Result := DayOf(AValue)`, which in turn calls `DecodeDate` and returns its day output.

**Edge cases and quirks**

- Because this is an exact wrapper, every `DayOf` boundary applies, including a possible `0` from unsupported dates before year 1.
- The result is not `WeekOfTheMonth` and says nothing about ISO week boundaries.
- Free Pascal describes the same one-based value but its implementation is not the terminal used by Velox.

**Side effects**

None.

**Performance and concurrency**

Constant-time wrapper and calendar decode, with no shared state.

**Related entries**

- [`DayOf`](DayOf.md) is the exact underlying operation.
- [`DayOfTheYear`](DayOfTheYear.md) counts from 1 January.
- [`DecodeDayOfWeekInMonth`](DecodeDayOfWeekInMonth.md) returns which occurrence of a weekday this date is.

**External references**

- [Embarcadero `System.DateUtils.DayOfTheMonth`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DayOfTheMonth) - confirms the exact `DayOf` equivalence.
- [Free Pascal `DayOfTheMonth`](https://www.freepascal.org/docs-html/rtl/dateutils/dayofthemonth.html) - documents the compatible one-based component.

<small>Created 2026-07-15</small>
