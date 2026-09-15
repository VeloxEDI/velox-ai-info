---
title: WeekSpan
description: "Returns an absolute fractional-week span from Delphi's raw numeric TDateTime difference."
sidebar_position: 167
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
Function WeekSpan( const ANow, AThen : TDateTime) : Double
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  FirstValue, SecondValue: TDateTime;
begin
  FirstValue := EncodeDateTime(2026, 1, 1, 0, 0, 0, 0);
  SecondValue := EncodeDateTime(2026, 1, 11, 12, 0, 0, 0);
  Value := WeekSpan(FirstValue, SecondValue);
  // Value is 1.5.
end;
```

### Usage

`WeekSpan` returns an absolute fractional-week span from Velox's raw numeric TDateTime difference.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ANow` | `TDateTime` | One encoded endpoint. It need not be later than `AThen`. |
| `AThen` | `TDateTime` | The other encoded endpoint. |

**Returns**

A non-negative `Double`: the raw absolute day difference divided by 7.

**Behaviour**

For ordinary non-negative `TDateTime` values, the integer portion is days since the Velox epoch and the fractional portion is time of day, so raw subtraction provides the expected fractional duration. Reversing the parameters leaves the result unchanged.

**Errors**

The binding performs no range or finite-value validation. Floating-point or conversion errors from invalid inputs are not caught by Velox.

### Additional Technical Info
Returns an absolute, fractional number of seven-day periods between `ANow` and `AThen`. Unlike `WeeksBetween`, it preserves the fractional portion and operates directly on the floating-point representation of `TDateTime`.

**Implementation**

Velox binds directly to `System.DateUtils.WeekSpan`. The installed function calls `DaySpan`, which calls `SpanOfNowAndThen`. That helper compares the two raw `Double` values, subtracts the smaller numeric value from the larger, and then `WeekSpan` divides the result by `DaysPerWeek` (`7`). It does not convert either endpoint to a chronological timestamp.

**Edge cases and quirks**

- Delphi represents times on dates before 30 December 1899 with a negative value whose fractional part is also negative. Raw subtraction can therefore mismeasure intervals wholly before, or crossing, that epoch. Use `WeeksBetween`/`DaysBetween` or a timestamp-normalised calculation when pre-epoch chronology matters.
- The result is floating-point. Exact comparisons at a boundary can be affected by binary rounding; compare with an appropriate tolerance when necessary.
- The function measures seven encoded days, not ISO week-number or calendar boundaries.
- No timezone or daylight-saving adjustment occurs.

**Performance and concurrency**

The operation is constant-time floating-point arithmetic with no allocation or shared Velox state.

**Related entries**

- [`WeeksBetween`](WeeksBetween.md) — returns complete weeks after millisecond timestamp normalisation.
- [`DaySpan`](DaySpan.md) — supplies the raw day span used here.
- [`YearSpan`](YearSpan.md) — applies the same raw subtraction with a 365.25-day divisor.

**External references**

- [Free Pascal: `WeekSpan`](https://www.freepascal.org/docs-html/rtl/dateutils/weekspan.html)
- [Embarcadero DocWiki: `System.DateUtils.WeekSpan`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.WeekSpan)

<small>Created 2026-07-15</small>
