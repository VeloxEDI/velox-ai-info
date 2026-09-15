---
title: "SecondOfTheDay"
description: "Returns the zero-based second index within the encoded day."
sidebar_position: 125
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - seconds
  - day
---

```Delphi
Function SecondOfTheDay( const AValue : TDateTime) : LongWord
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 16, 13, 5, 7, 900);
  Value := SecondOfTheDay(InputValue); // 47107
end;
```

### Usage

`SecondOfTheDay` returns the zero-based second index within the encoded day.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Value whose hour, minute and second fields are indexed. |

**Returns**

A `LongWord` from 0 at midnight through 86,399 at 23:59:59.

**Behaviour**

- The index resets to zero at each encoded midnight.
- Milliseconds are discarded, not rounded.
- The calendar date does not affect the result.
- The value represents encoded clock fields, not timezone-aware elapsed seconds through a daylight-saving day.

**Errors**

Decode exceptions propagate unchanged.

**Usage notes**

Use `SecondsBetween` for an interval between two complete date/time values.

### Additional Technical Info
`SecondOfTheDay` returns the zero-based whole-second position of the encoded clock time within its day.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds to `System.DateUtils.SecondOfTheDay`. Delphi decodes hour, minute, second and millisecond, then calculates `second + (minute + hour * 60) * 60`. The millisecond field is intentionally unused.

**Edge cases and quirks**

- Every encoded day is treated as exactly 86,400 field seconds even when a real local day has a daylight-saving transition.
- Invalid raw input can fail while decoding.
- The exposed `LongWord` corresponds to Delphi's unsigned `Cardinal`.
- Free Pascal's same-name page describes the compatible zero-based day index.

**Side effects**

None.

**Performance and concurrency**

Constant-time decoding and arithmetic with no external state.

**Related entries**

- [`SecondOfTheHour`](SecondOfTheHour.md) resets at each hour.
- [`MilliSecondOfTheDay`](MilliSecondOfTheDay.md) includes millisecond precision.

**External references**

- [Embarcadero `System.DateUtils.SecondOfTheDay`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.SecondOfTheDay)
- [Free Pascal `SecondOfTheDay`](https://www.freepascal.org/docs-html/rtl/dateutils/secondoftheday.html)

<small>Created 2026-07-15</small>
