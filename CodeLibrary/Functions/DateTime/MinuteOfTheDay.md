---
title: "MinuteOfTheDay"
description: "Returns the zero-based minute index within the encoded day."
sidebar_position: 94
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - minutes
  - day
---

```Delphi
Function MinuteOfTheDay(const AValue: TDateTime): Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 18, 9, 42, 30, 0);
  Value := MinuteOfTheDay(InputValue); // 582
end;
```

### Usage

`MinuteOfTheDay` returns the zero-based minute index within the encoded day.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded date/time whose whole-minute position within the day is required. |

**Returns**

A `Word` from 0 through 1,439.

**Behaviour**

- All dates with the same encoded hour and minute return the same result.
- Seconds and milliseconds are truncated by omission rather than rounded.
- The result resets at encoded midnight.
- No timezone or daylight-saving rule is consulted.

**Important usage notes**

- The value is a wall-clock field index. A daylight-saving day with 23 or 25 real hours still uses the encoded range 0 through 1,439.
- `23:59:59.999` returns 1,439, not 1,440.
- Invalid or non-finite input can raise during decoding.

**Errors**

Decode exceptions propagate unchanged from Velox.

### Additional Technical Info
`MinuteOfTheDay` returns the zero-based whole-minute position within the encoded day. Midnight is minute zero and 23:59 is minute 1,439.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.MinuteOfTheDay`. It decodes the time and calculates `minute + hour * 60`; seconds and milliseconds are decoded but do not contribute.

**Side effects**

None.

**Performance and concurrency**

Constant-time decoding and integer arithmetic with no shared mutable state.

**Remarks**

This function is useful for daily bucketing or comparisons after the caller has already established the required timezone convention.

**Related entries**

- [`MinuteOf`](MinuteOf.md) returns only the minute-within-hour field.
- [`MinutesBetween`](MinutesBetween.md) calculates an interval between two values.

**External references**

- [Embarcadero `System.DateUtils.MinuteOfTheDay`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.MinuteOfTheDay)
- [Free Pascal `MinuteOfTheDay`](https://www.freepascal.org/docs-html/rtl/dateutils/minuteoftheday.html)

<small>Created 2026-07-15</small>
