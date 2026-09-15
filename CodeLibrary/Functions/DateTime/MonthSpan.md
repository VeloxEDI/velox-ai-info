---
title: "MonthSpan"
description: "Returns an approximate fractional month span by dividing the raw day span by 30.4375."
sidebar_position: 107
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - months
  - span
---

```Delphi
Function MonthSpan(const ANow, AThen: TDateTime): Double
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  FirstValue, SecondValue: TDateTime;
begin
  FirstValue := EncodeDate(2026, 1, 1);
  SecondValue := EncodeDate(2026, 1, 16);
  Value := MonthSpan(FirstValue, SecondValue); // approximately 0.4928
end;
```

### Usage

`MonthSpan` returns an approximate fractional month span by dividing the raw day span by 30.4375.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ANow` | `TDateTime`, `const` | First raw encoded value. It need not be current or later. |
| `AThen` | `TDateTime`, `const` | Second raw encoded value. Argument order does not affect the result. |

**Returns**

The non-negative absolute raw day span divided by 30.4375, as a `Double`. Fractional average months are retained.

**Behaviour**

- Argument order does not affect the result.
- The calculation uses a fixed average month rather than the actual lengths of the months crossed.
- Fractional results are retained subject to binary floating-point precision.
- No timezone or daylight-saving conversion is performed.

**Errors**

There is no explicit validation. Non-finite input can produce non-useful floating-point output.

**Usage notes**

Prefer calendar arithmetic for recurrence, month-end or billing rules. Prefer `MonthsBetween` when complete average-month periods and timestamp-normalised pre-epoch behaviour are required.

### Additional Technical Info
`MonthSpan` returns an approximate, fractional number of average-length months between two raw `TDateTime` values. It divides the absolute raw day difference by 30.4375; it does not count calendar month boundaries.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.MonthSpan`. `DaySpan` first obtains the absolute difference by comparing and subtracting the raw floating-point `TDateTime` values; `MonthSpan` then divides by the DateUtils average-month global `30.4375`.

**Edge cases and quirks**

- Timed values before 30 December 1899 use Delphi's negative fractional encoding. Raw subtraction can therefore return the wrong chronological span when a pre-epoch time is involved, especially across the epoch.
- A change from one calendar month to the next does not imply a result of one. Fifteen days is approximately 0.4928 months; 31 days is approximately 1.0185 months.
- The approximation is a mutable DateUtils unit global. The installed value is 30.4375, the four-year average, rather than the Gregorian 400-year average.
- Floating-point results should be compared with a tolerance.

**Side effects**

None. The terminal reads the DateUtils average-month global but does not modify it.

**Performance and concurrency**

Constant-time floating-point arithmetic. Normal Velox code does not mutate the average-month global, but unsynchronised host mutation would affect concurrent calls.

**Related entries**

- [`MonthsBetween`](MonthsBetween.md) truncates a timestamp-normalised distance to complete average months.
- [`MinuteSpan`](MinuteSpan.md) demonstrates the same raw span family at a fixed-unit scale.

**External references**

- [Embarcadero `System.DateUtils.MonthSpan`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.MonthSpan)
- [Free Pascal `MonthSpan`](https://www.freepascal.org/docs-html/rtl/dateutils/monthspan.html)

<small>Created 2026-07-15</small>
