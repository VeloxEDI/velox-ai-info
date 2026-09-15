---
title: "HourOfTheMonth"
description: "Returns the zero-based encoded hour index within the containing calendar month."
sidebar_position: 53
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - hour
  - month
  - calendar-index
---

```Delphi
Function HourOfTheMonth(const AValue: TDateTime): Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := HourOfTheMonth(EncodeDateTime(2026, 7, 3, 5, 30, 0, 0));
  // 2 complete days * 24 + hour 5 = 53
end;
```

### Usage

`HourOfTheMonth` returns the zero-based encoded hour index within the containing calendar month.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded date/time whose calendar day and hour fields are used. |

**Returns**

`HourOf(AValue) + (DayOfTheMonth(AValue) - 1) * 24`. The range is `0..743` for a 31-day month.

**Important usage notes**

- This is a field-derived calendar index, not a timezone-aware elapsed duration. It still advances by exactly 24 per calendar day across daylight-saving changes.
- Minutes, seconds and milliseconds are discarded. The first day at `00:59:59.999` returns `0`.
- The index restarts at zero on the first of each calendar month.
- The result type `Word` easily contains the maximum value.
- No locale or timezone is read.

**Errors**

Unsupported raw values can fail during date/time decoding. No function catches the exception.

### Additional Technical Info
`HourOfTheMonth` returns a zero-based calendar index formed from the number of complete prior days in the month plus the current hour-of-day field.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.HourOfTheMonth`. The terminal extracts the hour and one-based calendar day, converts preceding days to groups of 24 hours and adds the current hour.

**Side effects**

None.

**Performance and concurrency**

Constant-time field extraction and integer arithmetic with no shared state.

**Related entries**

- [`HourOfTheDay`](HourOfTheDay.md) returns only the current hour field.
- [`HourOfTheYear`](HourOfTheYear.md) uses the same model across the calendar year.

**External references**

- [Embarcadero `System.DateUtils.HourOfTheMonth`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.HourOfTheMonth)
- [Free Pascal `HourOfTheMonth`](https://www.freepascal.org/docs-html/rtl/dateutils/hourofthemonth.html)

<small>Created 2026-07-15</small>
