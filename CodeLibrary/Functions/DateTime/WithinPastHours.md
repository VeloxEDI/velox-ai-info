---
title: WithinPastHours
description: "Reports whether two date/time values are no more than a supplied number of complete hours apart."
sidebar_position: 169
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
Function WithinPastHours( const ANow, AThen : TDateTime; const AHours : Int64) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  FirstValue, SecondValue: TDateTime;
begin
  FirstValue := EncodeDateTime(2026, 4, 1, 9, 0, 0, 0);
  SecondValue := EncodeDateTime(2026, 4, 1, 11, 59, 59, 999);
  Value := WithinPastHours(FirstValue, SecondValue, 2);
  // Value is True: the complete-hour distance is 2.
end;
```

### Usage

`WithinPastHours` reports whether two date/time values are no more than a supplied number of complete hours apart.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ANow` | `TDateTime` | One endpoint; it need not represent the later value or the actual current time. |
| `AThen` | `TDateTime` | The other encoded endpoint. |
| `AHours` | `Int64` | Inclusive complete-hour limit. Negative limits produce `False`. |

**Returns**

`True` when `HoursBetween(ANow, AThen) <= AHours`; otherwise `False`.

**Behaviour**

The fractional part of an hour is discarded before the inclusive comparison. A distance of 2 hours 59 minutes therefore passes a limit of 2; exactly 3 hours does not.

**Important usage notes**

- Parameter order and temporal direction are ignored because the distance is absolute.
- Hours are fixed 60-minute encoded durations. No timezone or daylight-saving rules are applied.
- Timestamp conversion rounds the original `Double` values to milliseconds.
- A negative limit returns `False` even for identical endpoints.

**Errors**

No Velox function catches failures. Invalid or non-representable encoded inputs can propagate RTL arithmetic or conversion errors.

### Additional Technical Info
Reports whether two encoded date/time values are no more than `AHours` complete hours apart. The calculation is an absolute duration test, not a directional "past" test.

**Implementation**

Velox binds directly to `System.DateUtils.WithinPastHours`. The installed function calls `HoursBetween`, whose terminal converts both inputs to millisecond timestamps, takes their absolute difference and divides it by 3,600,000 using integer division.

**Performance and concurrency**

The routine performs fixed integer arithmetic, allocates no objects and reads no host or Velox shared state.

**Related entries**

- [`HoursBetween`](HoursBetween.md) — returns the complete-hour distance used here.
- [`WithinPastMinutes`](WithinPastMinutes.md) — applies the same comparison in complete minutes.
- [`HourSpan`](HourSpan.md) — returns a fractional raw span rather than a floored timestamp distance.

**External references**

- [Free Pascal: `WithinPastHours`](https://www.freepascal.org/docs-html/rtl/dateutils/withinpasthours.html)
- [Embarcadero DocWiki: `System.DateUtils.WithinPastHours`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.WithinPastHours)

<small>Created 2026-07-15</small>
