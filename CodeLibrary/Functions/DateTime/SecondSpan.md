---
title: "SecondSpan"
description: "Returns the absolute fractional-second span from Delphi's raw numeric `TDateTime` difference."
sidebar_position: 132
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - seconds
  - span
---

```Delphi
Function SecondSpan( const ANow, AThen : TDateTime) : Double
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  EarlierValue, LaterValue: TDateTime;
begin
  EarlierValue := EncodeDateTime(2026, 7, 16, 9, 0, 0, 0);
  LaterValue := EncodeDateTime(2026, 7, 16, 9, 1, 30, 500);
  Value := SecondSpan(LaterValue, EarlierValue); // approximately 90.5
end;
```

### Usage

`SecondSpan` returns the absolute fractional-second span from Velox's raw numeric `TDateTime` difference.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ANow` | `TDateTime`, `const` | One endpoint; it need not be later. |
| `AThen` | `TDateTime`, `const` | Other endpoint. |

**Returns**

A non-negative `Double` containing whole and fractional seconds.

**Behaviour**

- Argument order is discarded through the absolute raw difference.
- Fractional seconds are retained subject to floating-point precision.
- No current-clock, timezone or daylight-saving operation occurs.
- For ordinary post-epoch values, the result represents their numeric day difference in seconds.

**Errors**

No validation is performed. Non-finite or extreme raw values can produce undefined/exceptional floating behaviour.

### Additional Technical Info
`SecondSpan` returns an absolute fractional number of seconds by subtracting the underlying floating `TDateTime` numbers and multiplying the raw day span by 86,400.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds to `System.DateUtils.SecondSpan`. The installed routine calls `SpanOfNowAndThen`, which orders the raw floating values and subtracts the smaller from the larger, then multiplies by `SecsPerDay` (86,400). It does not convert either endpoint to a timestamp.

**Edge cases and quirks**

- Delphi encodes the time portion of a pre-epoch `TDateTime` with a negative fractional sign. Raw subtraction therefore does not preserve calendar chronology for timed pre-epoch pairs or many cross-epoch pairs. `SecondSpan` can return the wrong span for those valid values.
- Use `SecondsBetween` for timestamp-normalised complete seconds. It avoids this pre-epoch defect but truncates the fractional remainder.
- Binary floating-point calculation can produce a result slightly above or below an expected decimal; use an appropriate tolerance.
- Free Pascal's same-name API is useful compatibility context but does not override the installed Delphi implementation.

**Side effects**

None.

**Performance and concurrency**

Constant-time floating comparison, subtraction and multiplication with no shared state.

**Remarks**

This routine is suitable when fractional precision is more important than complete-unit truncation and all values are in a safe post-epoch range.

**Related entries**

- [`SecondsBetween`](SecondsBetween.md) uses millisecond timestamps and returns complete seconds.
- [`MilliSecondSpan`](MilliSecondSpan.md) scales the same raw span to milliseconds.

**External references**

- [Embarcadero `System.DateUtils.SecondSpan`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.SecondSpan)
- [Free Pascal `SecondSpan`](https://www.freepascal.org/docs-html/rtl/dateutils/secondspan.html)

<small>Created 2026-07-15</small>
