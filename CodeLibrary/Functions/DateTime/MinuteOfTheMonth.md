---
title: "MinuteOfTheMonth"
description: "Returns the zero-based minute index within the encoded calendar month."
sidebar_position: 96
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - minutes
  - month
---

```Delphi
Function MinuteOfTheMonth(const AValue: TDateTime): Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 2, 1, 2, 30, 0);
  Value := MinuteOfTheMonth(InputValue); // 1502
end;
```

### Usage

`MinuteOfTheMonth` returns the zero-based minute index within the encoded calendar month.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded date/time whose whole-minute position within its month is required. |

**Returns**

A `Word` from zero through 40,319 for a 28-day month, 41,759 for 29 days, 43,199 for 30 days or 44,639 for 31 days.

**Behaviour**

- Midnight on the first day returns zero.
- Seconds and milliseconds do not contribute and are not rounded.
- The index resets at the next calendar month.
- Leap-year rules determine February's maximum.

**Important usage notes**

- This is a calendar-field index, not a timezone-aware elapsed duration since the real-world month boundary.
- The `Word` result is sufficient even for the maximum 31-day index.
- Invalid or non-finite input can raise during date/time decoding.

**Usage notes**

Use `MinutesBetween` when two independent values define the interval. This entry always uses the first day of `AValue`'s encoded month.

### Additional Technical Info
`MinuteOfTheMonth` returns the zero-based whole-minute position within the encoded calendar month, measured from midnight on the first day.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.MinuteOfTheMonth`. It calculates the zero-based hour position from the day-of-month, multiplies by 60 and adds the minute-within-hour field.

**Side effects**

None.

**Errors**

Decode exceptions propagate unchanged.

**Performance and concurrency**

Constant-time component decoding and integer arithmetic with no shared mutable state.

**Related entries**

- [`MilliSecondOfTheMonth`](MilliSecondOfTheMonth.md) includes seconds and milliseconds.
- [`MinuteOfTheYear`](MinuteOfTheYear.md) uses the start of the calendar year.

**External references**

- [Embarcadero `System.DateUtils.MinuteOfTheMonth`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.MinuteOfTheMonth)
- [Free Pascal `MinuteOfTheMonth`](https://www.freepascal.org/docs-html/rtl/dateutils/minuteofthemonth.html)

<small>Created 2026-07-15</small>
