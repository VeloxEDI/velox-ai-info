---
title: "MinuteSpan"
description: "Returns the absolute fractional-minute span from Delphi's raw numeric `TDateTime` difference."
sidebar_position: 100
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - minutes
  - span
---

```Delphi
Function MinuteSpan(const ANow, AThen: TDateTime): Double
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  FirstValue, SecondValue: TDateTime;
begin
  FirstValue := EncodeDateTime(2026, 7, 18, 9, 0, 0, 0);
  SecondValue := EncodeDateTime(2026, 7, 18, 9, 1, 30, 0);
  Value := MinuteSpan(FirstValue, SecondValue); // approximately 1.5
end;
```

### Usage

`MinuteSpan` returns the absolute fractional-minute span from Velox's raw numeric `TDateTime` difference.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ANow` | `TDateTime`, `const` | First raw encoded value. It need not be current or later. |
| `AThen` | `TDateTime`, `const` | Second raw encoded value. Argument order does not affect the result. |

**Returns**

The non-negative absolute raw day difference multiplied by 1,440 minutes per day, as a `Double`.

**Behaviour**

- Reversing the arguments produces the same result.
- Partial minutes are retained subject to binary floating-point precision.
- No timezone or daylight-saving conversion occurs.
- Ordinary post-epoch encoded values produce the expected raw span.

**Important usage notes**

- Timed values before 30 December 1899 use Velox's negative fractional encoding. Raw subtraction can therefore return a materially incorrect chronological interval when a pre-epoch time is involved, especially across the epoch.
- A mathematically exact decimal such as 1.5 minutes may be represented with a small floating-point error.
- The absolute result discards direction.
- Unlike `MinutesBetween`, this routine does not normalise or round inputs to timestamp milliseconds.

**Usage notes**

Prefer `MinutesBetween` for chronological complete-minute calculations and whenever pre-epoch dates may occur.

### Additional Technical Info
`MinuteSpan` returns the absolute raw numeric difference between two `TDateTime` values scaled to minutes. The `Double` result can retain fractional minutes, but the raw subtraction is not chronologically correct for timed values before Delphi's epoch.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.MinuteSpan`. Its shared helper compares and subtracts the raw floating-point values; the result is then multiplied by the fixed number of minutes per day. No timestamp conversion is performed.

**Side effects**

None.

**Errors**

There is no explicit validation. Non-finite raw values can propagate non-useful floating-point output.

**Performance and concurrency**

Constant-time floating-point arithmetic with no external I/O or shared mutable state.

**Related entries**

- [`MinutesBetween`](MinutesBetween.md) uses timestamp-normalised integer arithmetic.
- [`MilliSecondSpan`](MilliSecondSpan.md) applies the same raw-span model at millisecond scale.

**External references**

- [Embarcadero `System.DateUtils.MinuteSpan`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.MinuteSpan)
- [Free Pascal `MinuteSpan`](https://www.freepascal.org/docs-html/rtl/dateutils/minutespan.html)

<small>Created 2026-07-15</small>
