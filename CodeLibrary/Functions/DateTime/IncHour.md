---
title: "IncHour"
description: "Adds a signed count of whole hours to a `TDateTime` through DateUtils timestamp arithmetic."
sidebar_position: 59
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - hours
  - increment
---

```Delphi
Function IncHour(const AValue: TDateTime; const ANumberOfHours: Int64): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 18, 21, 30, 0, 0);
  Value := IncHour(InputValue, 5); // 19 July 2026 at 02:30
end;
```

### Usage

`IncHour` adds a signed count of whole hours to a `TDateTime` through DateUtils timestamp arithmetic.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded date/time to adjust. The original variable is not modified. |
| `ANumberOfHours` | `Int64`, `const` | Signed number of whole hours to add. Pass a negative value to subtract. |

**Returns**

A newly encoded `TDateTime` after the requested adjustment.

**Behaviour**

- The adjustment can cross minute, hour, date, month and year boundaries.
- A zero count returns the same logical date/time, subject to the millisecond normalisation described below.
- The operation treats `TDateTime` as an untagged numeric value. It does not discover or apply a timezone, daylight-saving transition or calendar-zone rule.
- Velox exposes the exact two-argument declaration shown above. The count argument is required even if an upstream library documents a default or one-argument overload.

**Errors**

There is no function validation. Velox conversion, arithmetic or range exceptions propagate to the script if the input is not a valid finite encoded date/time or the result cannot be represented.

**Usage notes**

Use this routine when the required rule is an encoded fixed hour offset. For a business rule expressed in local civil time, establish the timezone and daylight-saving policy outside this routine.

### Additional Technical Info
`IncHour` returns a new encoded date/time after adding a signed number of hours. Positive counts move forward and negative counts move backward.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.IncHour`. That routine scales the requested hour count to minutes by 60 and ultimately delegates to `IncMilliSecond`, whose terminal converts through an integer millisecond timestamp.

**Edge cases and quirks**

- This is fixed-duration arithmetic: each hour represents a fixed encoded hour. It is not a timezone-aware local-calendar adjustment.
- Because the terminal converts through a millisecond timestamp, the incoming value is rounded to the nearest millisecond. Even a zero increment can therefore normalise sub-millisecond precision.
- Intermediate scaling is performed before the timestamp terminal. An extreme `ANumberOfHours` can overflow during multiplication even when its declared type accepted the original argument.
- Negative/pre-epoch `TDateTime` values use Delphi's sign-sensitive encoding. The timestamp conversion is designed to preserve chronological arithmetic, but direct numeric comparisons with the result need the normal pre-epoch precautions.
- Floating-point `TDateTime` representation means the returned `Double` should not be tested for exact binary equality when a tolerance or component comparison is more appropriate.

**Side effects**

None.

**Performance and concurrency**

Constant-time arithmetic and conversion with no external I/O or shared mutable state.

**Related entries**

- [`IncMinute`](IncMinute.md) is the next routine in the implementation chain.
- [`IncDay`](IncDay.md) provides a related date/time operation.

**External references**

- [Embarcadero `System.DateUtils.IncHour`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.IncHour)
- [Free Pascal `IncHour`](https://www.freepascal.org/docs-html/rtl/dateutils/inchour.html)

<small>Created 2026-07-15</small>
