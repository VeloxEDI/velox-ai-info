---
title: "GetUpcomingDay"
description: "Moves strictly forward to the next requested ISO weekday for valid weekday inputs while preserving the encoded time."
sidebar_position: 50
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - weekday
  - iso-8601
  - scheduling
  - pre-epoch
---

```Delphi
Function GetUpcomingDay(const aNow: TDateTime;
  aUpcomingDay: Integer): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 18, 14, 30, 0, 0); // Saturday
  Value := GetUpcomingDay(InputValue, 1); // Monday 20 July, 14:30
end;
```

### Usage

`GetUpcomingDay` moves strictly forward to the next requested ISO weekday for valid weekday inputs while preserving the encoded time.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `aNow` | `TDateTime`, `const` | Starting date/time. Its encoded time-of-day is intended to be retained. |
| `aUpcomingDay` | `Integer` | Intended ISO weekday Monday `1` through Sunday `7`. Velox does not validate this range. |

**Returns**

For `aUpcomingDay` in `1..7`, `aNow` plus `1..7` whole encoded days. A same-weekday request produces `aNow + 7`.

**Errors**

There is no explicit error handling. Unsupported/non-finite raw date values can fail in weekday extraction; invalid `aUpcomingDay` values usually produce a numeric result rather than an exception.

**Usage notes**

Validate `aUpcomingDay` before calling. If “today when it already matches” is required, compare `DayOfTheWeek(aNow)` first rather than using this helper directly.

### Additional Technical Info
`GetUpcomingDay` advances a date/time to the next occurrence of a requested ISO weekday, where Monday is `1` and Sunday is `7`. For a valid weekday input it is strictly forward: requesting the same weekday moves seven days, not zero days.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The Velox date-tools terminal calculates `aUpcomingDay - DayOfTheWeek(aNow)`. If that delta is zero or negative it adds 7 once, then returns `aNow + delta`. It does not loop, normalise with modulo arithmetic or validate the requested weekday.

**Edge cases and quirks**

- Only inputs `1..7` have the documented next-weekday contract. Values outside the range can produce a zero, negative or unexpectedly large positive delta because the code adjusts by seven only once.
- Requesting the current valid weekday always moves seven days.
- Raw addition of an integer normally retains the encoded time. However, timed values that cross Delphi's 30 December 1899 epoch can be chronologically wrong because the sign of the fractional time representation changes across zero.
- The function applies no holiday, working-day, locale or timezone rules.
- Weekday numbering is Monday `1`, unlike `DayOfWeek`'s Sunday-based numbering.
- A daylight-saving transition does not change the encoded clock fields; the elapsed real-world hours can therefore differ from `delta * 24`.

**Side effects**

None.

**Performance and concurrency**

Constant-time arithmetic with no allocation or shared state.

**Related entries**

- [`DayOfTheWeek`](DayOfTheWeek.md) returns the weekday number used by the algorithm.

**External references**

- [Embarcadero `System.DateUtils.DayOfTheWeek`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DayOfTheWeek)
- [Free Pascal `DayOfTheWeek`](https://www.freepascal.org/docs-html/rtl/dateutils/dayoftheweek.html)

<small>Created 2026-07-15</small>
