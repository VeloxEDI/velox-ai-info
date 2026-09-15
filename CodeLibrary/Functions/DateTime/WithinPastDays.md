---
title: WithinPastDays
description: "Reports whether two date/time values are no more than a supplied number of complete days apart."
sidebar_position: 168
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date-time
  - elapsed-time
---

```Delphi
Function WithinPastDays( const ANow, AThen : TDateTime; const ADays : Integer) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  FirstValue, SecondValue: TDateTime;
begin
  FirstValue := EncodeDateTime(2026, 4, 1, 0, 0, 0, 0);
  SecondValue := EncodeDateTime(2026, 4, 3, 23, 59, 59, 999);
  Value := WithinPastDays(FirstValue, SecondValue, 2);
  // Value is True: the complete-day distance is 2.
end;
```

### Usage

`WithinPastDays` reports whether two date/time values are no more than a supplied number of complete days apart.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ANow` | `TDateTime` | One encoded date/time endpoint; parameter order is immaterial. |
| `AThen` | `TDateTime` | The other encoded date/time endpoint. |
| `ADays` | `Integer` | Inclusive maximum number of complete days. A negative limit cannot match a non-negative distance. |

**Returns**

`True` when `DaysBetween(ANow, AThen) <= ADays`; otherwise `False`.

**Behaviour**

Fractional days are discarded before comparison. Consequently, a distance of 2 days 23:59:59.999 is considered within 2 days, while exactly 3 days is not. The inputs are rounded to encoded millisecond resolution by `DateTimeToTimeStamp`.

**Important usage notes**

- The predicate is symmetric: future and past directions are treated identically.
- It measures fixed 24-hour encoded days, not changes of calendar date and not timezone-aware civil days.
- A negative `ADays` returns `False`, including when both endpoints are equal, because the computed distance is never negative.
- Valid pre-1899 dates are timestamp-normalised and retain chronological ordering.

**Errors**

Velox adds no exception handling. Arithmetic or conversion failures for values outside the representable `TDateTime` range propagate.

### Additional Technical Info
Reports whether the absolute distance between `ANow` and `AThen`, measured in complete encoded days, is less than or equal to `ADays`. Despite its name, it does not require either value to be in the past or compare them with the current clock.

**Implementation**

Velox binds directly to `System.DateUtils.WithinPastDays`. The terminal is a single inclusive comparison against `DaysBetween`. That helper converts both values to millisecond timestamps, takes the absolute difference and performs integer division by 86,400,000.

**Performance and concurrency**

The routine is constant-time integer arithmetic and reads no host clock or shared Velox state.

**Related entries**

- [`DaysBetween`](DaysBetween.md) — returns the complete-day value compared by this predicate.
- [`WithinPastHours`](WithinPastHours.md) — applies the same rule in complete hours.
- [`DaySpan`](DaySpan.md) — returns a fractional raw day span with different pre-epoch behaviour.

**External references**

- [Free Pascal: `WithinPastDays`](https://www.freepascal.org/docs-html/rtl/dateutils/withinpastdays.html)
- [Embarcadero DocWiki: `System.DateUtils.WithinPastDays`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.WithinPastDays)

<small>Created 2026-07-15</small>
