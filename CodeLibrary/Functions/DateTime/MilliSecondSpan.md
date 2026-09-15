---
title: "MilliSecondSpan"
description: "Returns the absolute fractional-millisecond span from Delphi's raw numeric `TDateTime` difference."
sidebar_position: 92
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - milliseconds
  - span
---

```Delphi
Function MilliSecondSpan(const ANow, AThen: TDateTime): Double
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  FirstValue, SecondValue: TDateTime;
begin
  FirstValue := EncodeDateTime(2026, 7, 18, 9, 0, 0, 0);
  SecondValue := EncodeDateTime(2026, 7, 18, 9, 0, 1, 250);
  Value := MilliSecondSpan(FirstValue, SecondValue); // approximately 1250.0
end;
```

### Usage

`MilliSecondSpan` returns the absolute fractional-millisecond span from Velox's raw numeric `TDateTime` difference.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ANow` | `TDateTime`, `const` | First raw encoded value. It need not be the current or later value. |
| `AThen` | `TDateTime`, `const` | Second raw encoded value. Argument order does not affect the result. |

**Returns**

The non-negative absolute raw span multiplied by 86,400,000 milliseconds per day, as a `Double`.

**Behaviour**

- Reversing the arguments produces the same value; direction is discarded.
- The result may contain a fractional millisecond when the inputs contain finer binary fractions.
- No timezone or daylight-saving conversion is applied.
- For ordinary post-epoch values, the raw day fraction provides the expected elapsed span subject to floating-point precision.

**Errors**

There is no explicit validation. Non-finite or unsupported raw values can propagate non-useful floating-point results or later conversion failures in the caller.

**Usage notes**

Prefer `MilliSecondsBetween` when chronological correctness or pre-epoch support matters. Use this span only when a fractional raw result is required and the inputs are known to be in a safe range.

### Additional Technical Info
`MilliSecondSpan` returns the absolute raw numeric difference between two `TDateTime` values scaled to milliseconds. Its `Double` result can contain a fraction of a millisecond, but the raw arithmetic has a material defect for timed values before Delphi's epoch.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.MilliSecondSpan`. Its shared span helper compares the two raw floating-point values, subtracts the smaller numeric value from the larger, and multiplies the difference by the number of milliseconds per day. It does not use timestamp normalisation.

**Edge cases and quirks**

- Delphi represents the time portion of a pre-epoch `TDateTime` using a negative fractional encoding. Raw subtraction is therefore not chronological when either timed input is before 30 December 1899, particularly across the epoch. The result can be materially wrong even though it is non-negative.
- Binary floating-point arithmetic can produce a value slightly above or below an expected decimal millisecond count. Use a tolerance when comparing results.
- The function does not quantise inputs to Delphi timestamp milliseconds. This preserves fractions but differs deliberately from `MilliSecondsBetween`.
- The absolute result does not reveal which argument is later.

**Side effects**

None.

**Performance and concurrency**

Constant-time floating-point comparison, subtraction and multiplication with no external I/O or shared mutable state.

**Related entries**

- [`MilliSecondsBetween`](MilliSecondsBetween.md) uses timestamp-normalised millisecond arithmetic.
- [`MinuteSpan`](MinuteSpan.md) applies the same raw span model at minute scale.

**External references**

- [Embarcadero `System.DateUtils.MilliSecondSpan`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.MilliSecondSpan)
- [Free Pascal `MilliSecondSpan`](https://www.freepascal.org/docs-html/rtl/dateutils/millisecondspan.html)

<small>Created 2026-07-15</small>
