---
title: "HourSpan"
description: "Returns the absolute fractional-hour span from Delphi's raw numeric TDateTime difference."
sidebar_position: 57
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - hours
  - span
  - pre-epoch
---

```Delphi
Function HourSpan(const ANow, AThen: TDateTime): Double
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  FirstValue, SecondValue: TDateTime;
begin
  FirstValue := EncodeDateTime(2026, 7, 18, 9, 0, 0, 0);
  SecondValue := EncodeDateTime(2026, 7, 18, 11, 30, 0, 0);
  Value := HourSpan(FirstValue, SecondValue); // 2.5
end;
```

### Usage

`HourSpan` returns the absolute fractional-hour span from Velox's raw numeric TDateTime difference.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ANow` | `TDateTime`, `const` | First encoded value. Argument order does not affect the intended result. |
| `AThen` | `TDateTime`, `const` | Second encoded value. |

**Returns**

`24 * absolute raw numeric difference`, as a `Double`. A 90-minute raw span returns approximately `1.5`.

**Errors**

There is no function validation. Non-finite values can produce non-useful floating results or propagate floating-point exceptions according to the runtime environment.

**Usage notes**

For modern, timezone-neutral values this is the convenient fractional counterpart to `HoursBetween`. Do not use it as a historical chronological duration without first normalising the inputs.

### Additional Technical Info
`HourSpan` returns an absolute hour difference including the fractional part. Its terminal uses raw `TDateTime` subtraction rather than the chronological millisecond conversion used by `HoursBetween`.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.HourSpan`. The terminal calls `SpanOfNowAndThen`, which compares the two `Double` values and subtracts the smaller numeric value from the larger, then multiplies that day span by 24.

**Edge cases and quirks**

- Direction is discarded; the result is non-negative for ordinary finite values.
- Timed values on different dates before 30 December 1899, or timed values spanning that epoch, expose a Delphi representation defect in this algorithm. Before the epoch the fractional time is stored as the magnitude of a negative fraction, so raw subtraction is not chronological. Use `HoursBetween` or an explicit timestamp conversion for historical values.
- The value is not rounded to a convenient decimal and can contain normal binary floating-point approximation.
- The operation is timezone/DST-naive. It measures encoded numeric distance, not necessarily elapsed UTC hours between local wall-clock values.
- Unlike `HoursBetween`, partial hours are retained rather than truncated and millisecond timestamp quantisation is not deliberately applied by the span itself.

**Side effects**

None.

**Performance and concurrency**

Constant-time floating-point arithmetic with no allocation or shared state.

**Related entries**

- [`HoursBetween`](HoursBetween.md) returns complete hours using chronological millisecond timestamps.
- [`DaySpan`](DaySpan.md) is the raw day-span terminal multiplied by 24 here.

**External references**

- [Embarcadero `System.DateUtils.HourSpan`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.HourSpan)
- [Free Pascal `HourSpan`](https://www.freepascal.org/docs-html/rtl/dateutils/hourspan.html)

<small>Created 2026-07-15</small>
