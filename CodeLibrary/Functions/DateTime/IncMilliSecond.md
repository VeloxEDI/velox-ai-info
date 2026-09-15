---
title: "IncMilliSecond"
description: "Adds a signed count of milliseconds to a `TDateTime` through timestamp conversion."
sidebar_position: 60
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - milliseconds
  - increment
---

```Delphi
Function IncMilliSecond(const AValue: TDateTime; const ANumberOfMilliSeconds: Int64): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 18, 9, 0, 0, 500);
  Value := IncMilliSecond(InputValue, 1750); // 18 July 2026 at 09:00:02.250
end;
```

### Usage

`IncMilliSecond` adds a signed count of milliseconds to a `TDateTime` through timestamp conversion.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded date/time to adjust. The original variable is not modified. |
| `ANumberOfMilliSeconds` | `Int64`, `const` | Signed number of whole milliseconds to add. Pass a negative value to subtract. |

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

Use this routine when the required rule is an encoded fixed millisecond offset. For a business rule expressed in local civil time, establish the timezone and daylight-saving policy outside this routine.

### Additional Technical Info
`IncMilliSecond` returns a new encoded date/time after adding a signed number of milliseconds. Positive counts move forward and negative counts move backward.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.IncMilliSecond`. It converts `AValue` to a `TTimeStamp`, converts that timestamp to a millisecond count, adds the signed `Int64` amount, converts the count back to a timestamp and finally reconstructs a `TDateTime`.

**Edge cases and quirks**

- This is fixed-duration arithmetic: each millisecond represents a fixed encoded millisecond. It is not a timezone-aware local-calendar adjustment.
- The conversion rounds the incoming encoded value to the nearest millisecond before adding. Consequently, even an increment of zero can normalise a value that contains sub-millisecond precision.
- The timestamp millisecond addition or the timestamp-to-date conversion can overflow or reject a result outside Delphi's supported encoded date range.
- Negative/pre-epoch `TDateTime` values use Delphi's sign-sensitive encoding. The timestamp conversion is designed to preserve chronological arithmetic, but direct numeric comparisons with the result need the normal pre-epoch precautions.
- Floating-point `TDateTime` representation means the returned `Double` should not be tested for exact binary equality when a tolerance or component comparison is more appropriate.

**Side effects**

None.

**Performance and concurrency**

Constant-time arithmetic and conversion with no external I/O or shared mutable state.

**Related entries**

- [`MilliSecondOf`](MilliSecondOf.md) extracts the millisecond field from a value.
- [`MilliSecondOf`](MilliSecondOf.md) provides a related date/time operation.

**External references**

- [Embarcadero `System.DateUtils.IncMilliSecond`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.IncMilliSecond)
- [Free Pascal `IncMilliSecond`](https://www.freepascal.org/docs-html/rtl/dateutils/incmillisecond.html)

<small>Created 2026-07-15</small>
