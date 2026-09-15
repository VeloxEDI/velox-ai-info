---
title: WeeksBetween
description: "Returns the absolute number of complete seven-day periods between two millisecond-normalised date/time values."
sidebar_position: 164
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
Function WeeksBetween( const ANow, AThen : TDateTime) : Integer
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := WeeksBetween(EncodeDate(2026, 1, 1), EncodeDate(2026, 1, 20));
  // Value is 2. The remaining five days are discarded.
end;
```

### Usage

`WeeksBetween` returns the absolute number of complete seven-day periods between two millisecond-normalised date/time values.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ANow` | `TDateTime` | One encoded date/time endpoint. The name does not require it to be later than `AThen`. |
| `AThen` | `TDateTime` | The other encoded date/time endpoint. |

**Returns**

A non-negative `Integer` containing the number of complete 604,800,000-millisecond periods. Any fractional week is discarded.

**Behaviour**

Parameter order is interchangeable because the difference is made absolute. Timestamp conversion rounds the encoded floating-point value to millisecond resolution before subtraction. A gap one millisecond short of seven days returns 0; exactly seven days returns 1.

**Errors**

There is no validation or exception handling in the Velox binding. Arithmetic or conversion failures for values outside the representable `TDateTime` range propagate.

### Additional Technical Info
Returns the absolute number of complete seven-day periods between `ANow` and `AThen`. It measures encoded timestamp distance; it does not count crossed ISO week numbers or Monday boundaries.

**Implementation**

Velox binds directly to `System.DateUtils.WeeksBetween`. The installed routine converts each endpoint with `System.SysUtils.DateTimeToTimeStamp`, combines the timestamp date and time into an `Int64` millisecond count, takes the absolute difference and performs integer division by seven days.

**Edge cases and quirks**

- This routine is duration-based. Two values in different ISO weeks can still return 0, and a seven-day interval returns 1 regardless of weekday.
- The millisecond timestamp path preserves valid pre-1899 chronology, unlike the raw subtraction used by `WeekSpan`.
- `TDateTime` carries no timezone. Daylight-saving transitions are not consulted; values are compared as encoded wall-clock timestamps.
- Free Pascal documents the same two-argument concept. Velox follows the installed Delphi conversion and rounding implementation.

**Performance and concurrency**

The calculation is constant-time integer arithmetic after two timestamp conversions. It allocates no objects and reads no shared Velox state.

**Related entries**

- [`WeekSpan`](WeekSpan.md) — returns fractional weeks but uses raw `TDateTime` subtraction.
- [`WithinPastWeeks`](WithinPastWeeks.md) — compares this complete-week result with an inclusive limit.
- [`DaysBetween`](DaysBetween.md) — returns the equivalent complete-day distance.

**External references**

- [Free Pascal: `WeeksBetween`](https://www.freepascal.org/docs-html/rtl/dateutils/weeksbetween.html)
- [Embarcadero DocWiki: `System.DateUtils.WeeksBetween`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.WeeksBetween)

<small>Created 2026-07-15</small>
