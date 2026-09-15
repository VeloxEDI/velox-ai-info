---
title: YearsBetween
description: "Returns the absolute number of complete approximate 365.25-day periods between two date/time values."
sidebar_position: 177
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date-time
  - approximate-duration
---

```Delphi
Function YearsBetween( const ANow, AThen : TDateTime) : Integer
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := YearsBetween(EncodeDate(2020, 1, 1), EncodeDate(2021, 1, 1));
  // Value is 1: the 366-day interval contains one complete 365.25-day period.
end;
```

### Usage

`YearsBetween` returns the absolute number of complete approximate 365.25-day periods between two date/time values.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ANow` | `TDateTime` | One encoded date/time endpoint; it need not be the later endpoint. |
| `AThen` | `TDateTime` | The other encoded endpoint. |

**Returns**

A non-negative `Integer` containing the number of complete 31,557,600,000-millisecond periods. The fractional remainder is discarded.

**Behaviour**

The result is symmetric and timestamp-normalised to millisecond resolution. A distance of 365 days returns 0; 365 days 6 hours returns 1. Month/day matching and leap-day anniversaries are not inspected.

**Errors**

Velox performs no validation or exception handling. Invalid/non-representable values can propagate RTL conversion or arithmetic failures.

### Additional Technical Info
Returns the absolute number of complete approximate years between `ANow` and `AThen`, using a fixed year length of 365.25 days. It measures duration rather than calendar anniversaries.

**Implementation**

Velox binds directly to the two-argument `System.DateUtils.YearsBetween`. The installed routine converts each endpoint to an `Int64` millisecond timestamp, takes the absolute difference and divides it by `Round(CMillisPerDay * ApproxDaysPerYear)`. In Delphi 37.0, `ApproxDaysPerYear` is 365.25, making the divisor 31,557,600,000 milliseconds.

**Edge cases and quirks**

- This routine is unsuitable for exact age, contract anniversary or calendar-year calculations. Use calendar field comparison or `IncYear` when those rules matter.
- Integer division floors the result. A distance of 1.99 approximate years returns 1.
- Valid pre-1899 dates retain chronology because the implementation uses timestamps rather than raw `TDateTime` subtraction.
- No timezone/daylight-saving conversion occurs.
- The linked Free Pascal declaration includes an optional `AExact` parameter in the referenced version. Velox exposes Delphi's two-argument routine only; scripts cannot request that Free Pascal-specific mode.

**Performance and concurrency**

The calculation is constant-time integer arithmetic with no allocation or shared Velox state.

**Related entries**

- [`WithinPastYears`](WithinPastYears.md) — compares this complete-year result with an inclusive limit.
- [`YearSpan`](YearSpan.md) — returns fractional approximate years using raw subtraction.
- [`DaysBetween`](DaysBetween.md) — exposes the complete-day timestamp distance.

**External references**

- [Free Pascal: `YearsBetween`](https://www.freepascal.org/docs-html/rtl/dateutils/yearsbetween.html)
- [Embarcadero DocWiki: `System.DateUtils.YearsBetween`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.YearsBetween)

<small>Created 2026-07-15</small>
