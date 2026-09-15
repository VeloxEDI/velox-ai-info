---
title: "DaySpan"
description: "Returns the absolute raw numeric difference between two TDateTime values as fractional days."
sidebar_position: 21
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - duration
  - days
  - floating-point
  - delphi
---

```Delphi
Function DaySpan(const ANow, AThen: TDateTime): Double
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  FirstValue, SecondValue: TDateTime;
begin
  FirstValue := EncodeDate(2026, 7, 18) + EncodeTime(12, 0, 0, 0);
  SecondValue := EncodeDate(2026, 7, 20);
  Value := DaySpan(FirstValue, SecondValue); // 1.5
end;
```

### Usage

`DaySpan` returns the absolute raw numeric difference between two TDateTime values as fractional days.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ANow` | `TDateTime`, `const` | First encoded timestamp; it need not be the actual current time. |
| `AThen` | `TDateTime`, `const` | Second encoded timestamp. Argument order does not affect the magnitude. |

**Returns**

The non-negative absolute difference between the two `Double` values. For non-negative dates, multiply by `24` for encoded hours or by `86400` for encoded seconds, subject to floating precision. Do not interpret a result involving timed pre-epoch values as a chronological duration without normalising the values first.

**Behaviour**

The result is symmetric. A separation of 36 hours is `1.5`; values less than one day remain visible as a fraction.

**Errors**

Valid finite values do not raise. The binding has no validation/error handler for non-finite values.

### Additional Technical Info
`DaySpan` returns the absolute raw numeric separation between two `TDateTime` values in days, preserving the fractional part. For ordinary non-negative values it is the fractional counterpart to [`DaysBetween`](DaysBetween.md); its direct subtraction has an important pre-epoch limitation described below.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds to Delphi 37.0 `System.DateUtils.DaySpan`. It delegates to `SpanOfNowAndThen`, which compares the arguments and subtracts the smaller from the larger. Unlike `DaysBetween`, it does not convert to integer milliseconds or discard a remainder.

**Edge cases and quirks**

- The calculation is raw `TDateTime` arithmetic. It does not consult timezones, UTC offsets or daylight-saving transitions.
- Delphi represents time before 30 December 1899 as the magnitude of a negative fraction. Raw subtraction therefore misstates elapsed time when timed values fall on different pre-epoch dates, or when a timed pre-epoch value is compared with a non-negative date. This is an implementation quirk of `SpanOfNowAndThen`, which does not convert through `TTimeStamp`. [`DaysBetween`](DaysBetween.md) does use timestamp milliseconds and does not share this particular discontinuity.
- Floating subtraction can contain small binary representation error, especially after multiple prior calculations. Use a tolerance when comparing the result.
- The installed implementation is more direct than the word "approximate" used in some upstream descriptions: it subtracts the two encoded values exactly as `Double`s, but the representation itself is finite precision.
- Sub-millisecond differences can remain in this result even when comparison/decode functions round through a millisecond timestamp.
- NaN or infinity is unsupported; comparison/subtraction behaviour is not normalised by the wrapper.

**Side effects**

None.

**Performance and concurrency**

Constant-time floating comparison/subtraction with no allocation or shared state.

**Remarks**

Convert local wall-clock values to a common absolute timescale first when the intended duration crosses timezone or daylight-saving changes. Also normalise pre-epoch date/time values to a linear representation before using this function for duration calculations.

**Related entries**

- [`DaysBetween`](DaysBetween.md) returns complete millisecond-based 24-hour units.
- [`CompareDateTime`](CompareDateTime.md) returns ordering instead of magnitude.

**External references**

- [Embarcadero `System.DateUtils.DaySpan`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DaySpan) - documents the exact Delphi routine.
- [Free Pascal `DaySpan`](https://www.freepascal.org/docs-html/rtl/dateutils/dayspan.html) - documents the compatible fractional-day concept.

<small>Created 2026-07-15</small>
