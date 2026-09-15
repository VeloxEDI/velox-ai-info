---
title: "HourOfTheYear"
description: "Returns the zero-based encoded hour index since 1 January at the start of the containing calendar year."
sidebar_position: 55
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - hour
  - year
  - calendar-index
  - leap-year
---

```Delphi
Function HourOfTheYear(const AValue: TDateTime): Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := HourOfTheYear(EncodeDateTime(2026, 1, 2, 5, 0, 0, 0)); // 29
end;
```

### Usage

`HourOfTheYear` returns the zero-based encoded hour index since 1 January at the start of the containing calendar year.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded date/time whose day-of-year and hour fields are used. |

**Returns**

`HourOf(AValue) + (DayOfTheYear(AValue) - 1) * 24`. A common year ranges from `0..8759`; a leap year ranges from `0..8783`.

**Important usage notes**

- The index uses the calendar year, not the ISO week-numbering year.
- Leap years contain 24 additional indexed hours after 29 February.
- Minutes, seconds and milliseconds are discarded.
- The value advances by 24 for every calendar day regardless of daylight-saving transitions, so it is not a timezone-aware elapsed-hour count.
- The `Word` return type safely contains the maximum supported result.

**Errors**

Unsupported raw values can fail during date/time decoding. No function catches the exception.

### Additional Technical Info
`HourOfTheYear` returns a zero-based calendar index based on complete prior calendar days in the year and the current hour-of-day field.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.HourOfTheYear`. `DayOfTheYear` supplies the one-based calendar ordinal and `HourOf` supplies the current clock hour.

**Side effects**

None.

**Performance and concurrency**

Constant-time calendar extraction and arithmetic with no shared state.

**Related entries**

- [`DayOfTheYear`](DayOfTheYear.md) supplies the calendar ordinal.
- [`HourOfTheMonth`](HourOfTheMonth.md) restarts the same style of index each month.

**External references**

- [Embarcadero `System.DateUtils.HourOfTheYear`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.HourOfTheYear)
- [Free Pascal `HourOfTheYear`](https://www.freepascal.org/docs-html/rtl/dateutils/houroftheyear.html)

<small>Created 2026-07-15</small>
