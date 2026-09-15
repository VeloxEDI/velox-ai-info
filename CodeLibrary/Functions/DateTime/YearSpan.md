---
title: YearSpan
description: "Returns an absolute fractional-year span using a 365.25-day divisor and Delphi's raw numeric date/time difference."
sidebar_position: 178
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
Function YearSpan( const ANow, AThen : TDateTime) : Double
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := YearSpan(EncodeDate(2020, 1, 1), EncodeDate(2021, 1, 1));
  // Value is approximately 1.002 because the interval is 366 days.
end;
```

### Usage

`YearSpan` returns an absolute fractional-year span using a 365.25-day divisor and Velox's raw numeric date/time difference.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ANow` | `TDateTime` | One encoded date/time endpoint; it need not be later than `AThen`. |
| `AThen` | `TDateTime` | The other encoded endpoint. |

**Returns**

A non-negative `Double`: the raw absolute day difference divided by 365.25.

**Behaviour**

For normal non-negative dates, the result is a fractional duration expressed in average four-year Gregorian years. Reversing the inputs does not change it.

**Errors**

The binding has no finite/range validation or exception handler. Invalid floating-point inputs and any resulting arithmetic failures are not normalised by Velox.

### Additional Technical Info
Returns an absolute fractional number of approximate years between `ANow` and `AThen`. One approximate year is 365.25 days. The function preserves fractions but uses Delphi's raw numeric `TDateTime` subtraction.

**Implementation**

Velox binds directly to `System.DateUtils.YearSpan`. The installed routine calls `DaySpan`, which compares and subtracts the raw `Double` values through `SpanOfNowAndThen`, then divides the result by the Delphi 37.0 `ApproxDaysPerYear` constant of 365.25. No timestamp conversion or calendar-field comparison occurs.

**Edge cases and quirks**

- The value is approximate and does not describe completed anniversaries or exact calendar years.
- Delphi's negative `TDateTime` representation stores the pre-30-December-1899 time fraction with a negative sign. Raw subtraction can therefore mismeasure intervals wholly before, or crossing, that epoch. `YearsBetween` uses timestamp-normalised chronology but discards fractions.
- Binary floating-point rounding can put a result slightly above or below a mathematical boundary; avoid exact equality comparisons.
- No timezone or daylight-saving adjustment occurs.

**Performance and concurrency**

The routine is constant-time floating-point arithmetic, allocation-free and independent of Velox shared state.

**Related entries**

- [`YearsBetween`](YearsBetween.md) — returns complete timestamp-normalised approximate years.
- [`WithinPastYears`](WithinPastYears.md) — applies an inclusive limit to the complete-year result.
- [`DaySpan`](DaySpan.md) — supplies the raw day span divided here.

**External references**

- [Free Pascal: `YearSpan`](https://www.freepascal.org/docs-html/rtl/dateutils/yearspan.html)
- [Embarcadero DocWiki: `System.DateUtils.YearSpan`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.YearSpan)

<small>Created 2026-07-15</small>
