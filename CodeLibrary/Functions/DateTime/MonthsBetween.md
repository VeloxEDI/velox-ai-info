---
title: "MonthsBetween"
description: "Returns an approximate number of complete 30.4375-day months between two timestamp-normalised values."
sidebar_position: 106
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - months
  - interval
---

```Delphi
Function MonthsBetween(const ANow, AThen: TDateTime): Integer
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  FirstValue, SecondValue: TDateTime;
begin
  FirstValue := EncodeDate(2026, 1, 1);
  SecondValue := EncodeDate(2026, 2, 1);
  Value := MonthsBetween(FirstValue, SecondValue); // 1
end;
```

### Usage

`MonthsBetween` returns an approximate number of complete 30.4375-day months between two timestamp-normalised values.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ANow` | `TDateTime`, `const` | First encoded date/time. It need not be current or later. |
| `AThen` | `TDateTime`, `const` | Second encoded date/time. Argument order does not affect the result. |

**Returns**

The non-negative number of complete 2,629,800,000-millisecond periods, returned as an `Integer`. A shorter remainder is discarded.

**Behaviour**

- Results are symmetric because direction is discarded.
- Fractional average months are truncated, not rounded.
- A pair of dates in adjacent calendar months can return zero when fewer than 30.4375 days apart; a 31-day interval returns one.
- Timestamp normalisation supports valid pre-epoch chronology at millisecond resolution.

**Errors**

Invalid or non-finite input can raise during timestamp conversion. Velox does not translate the exception.

**Usage notes**

Use `IncMonth` or field-based comparison for calendar billing or recurrence rules. Use this entry only when an average-length complete-month interval is the intended model.

### Additional Technical Info
`MonthsBetween` returns the absolute number of complete average-length months between two values. A month is fixed at 30.4375 days for this calculation; calendar month boundaries and month-end rules are not counted.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.MonthsBetween`. Both values are converted to chronological `Int64` milliseconds, their absolute difference is taken, and integer division is performed using the rounded product of 86,400,000 milliseconds and the mutable DateUtils approximation `30.4375` days per month.

**Edge cases and quirks**

- This is not calendar-month arithmetic. It does not compare year/month fields, preserve a day-of-month or apply month-end clamping.
- The 30.4375-day approximation is the four-year average used by the installed Delphi DateUtils unit, not the Gregorian 400-year average.
- Sub-millisecond input precision is rounded during timestamp conversion.
- The Free Pascal compatibility reference publishes an additional optional `AExact` parameter. Velox exposes only the two-argument Delphi overload shown above, so scripts cannot request that Free Pascal-specific mode.
- No timezone or daylight-saving rules are applied to the untagged values.

**Side effects**

None. The terminal reads the DateUtils average-month global but does not modify it.

**Performance and concurrency**

Constant-time timestamp and integer arithmetic. The installed approximation is a writable unit global in Delphi; normal Velox code does not change it, but unsynchronised host mutation would affect concurrent results.

**Related entries**

- [`MonthSpan`](MonthSpan.md) returns fractional approximate months using raw span arithmetic.
- [`IncMonth`](IncMonth.md) performs calendar-month adjustment with end-of-month clamping.

**External references**

- [Embarcadero `System.DateUtils.MonthsBetween`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.MonthsBetween)
- [Free Pascal `MonthsBetween`](https://www.freepascal.org/docs-html/rtl/dateutils/monthsbetween.html)

<small>Created 2026-07-15</small>
