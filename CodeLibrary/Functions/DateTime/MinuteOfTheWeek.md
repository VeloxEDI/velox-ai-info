---
title: "MinuteOfTheWeek"
description: "Returns the zero-based minute index within the Monday-based ISO week."
sidebar_position: 97
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - minutes
  - iso-week
---

```Delphi
Function MinuteOfTheWeek(const AValue: TDateTime): Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 21, 1, 2, 30, 0); // Tuesday
  Value := MinuteOfTheWeek(InputValue); // 1502
end;
```

### Usage

`MinuteOfTheWeek` returns the zero-based minute index within the Monday-based ISO week.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded date/time whose whole-minute position within its ISO week is required. |

**Returns**

A `Word` from 0 for Monday 00:00 through 10,079 for Sunday 23:59.

**Behaviour**

- Monday is the first ISO weekday and has the zero-day offset.
- Seconds and milliseconds are omitted rather than rounded.
- The value resets at each Monday midnight, including across month or year boundaries.
- Host locale settings do not change the first day of the week.

**Important usage notes**

- The result is not an ISO week number or week-year.
- It is an encoded wall-clock index; timezone and daylight-saving transitions do not change the fixed 10,080-position model.
- Invalid or non-finite input can raise during decoding.

**Errors**

Velox does not catch or translate date/time decode exceptions.

### Additional Technical Info
`MinuteOfTheWeek` returns the zero-based whole-minute position within the Monday-to-Sunday ISO week, measured from Monday at midnight.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.MinuteOfTheWeek`. It derives the ISO Monday-based hour position, multiplies by 60 and adds the minute-within-hour component.

**Side effects**

None.

**Performance and concurrency**

Constant-time field decoding and integer arithmetic with no shared mutable state.

**Remarks**

This function deliberately follows ISO Monday ordering even if a user's regional calendar displays Sunday first.

**Related entries**

- [`MilliSecondOfTheWeek`](MilliSecondOfTheWeek.md) provides millisecond resolution.
- [`MinuteOfTheDay`](MinuteOfTheDay.md) resets at every encoded midnight.

**External references**

- [Embarcadero `System.DateUtils.MinuteOfTheWeek`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.MinuteOfTheWeek)
- [Free Pascal `MinuteOfTheWeek`](https://www.freepascal.org/docs-html/rtl/dateutils/minuteoftheweek.html)

<small>Created 2026-07-15</small>
