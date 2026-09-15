---
title: "IncSecond"
description: "Adds a signed count of whole seconds to a `TDateTime` through DateUtils timestamp arithmetic."
sidebar_position: 63
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - seconds
  - increment
---

```Delphi
Function IncSecond(const AValue: TDateTime; const ANumberOfSeconds: Int64): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 18, 23, 59, 30, 250);
  Value := IncSecond(InputValue, 90); // 19 July 2026 at 00:01:00.250
end;
```

### Usage

`IncSecond` adds a signed count of whole seconds to a `TDateTime` through DateUtils timestamp arithmetic.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded date/time to adjust. The original variable is not modified. |
| `ANumberOfSeconds` | `Int64`, `const` | Signed number of whole seconds to add. Pass a negative value to subtract. |

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

Use this routine when the required rule is an encoded fixed second offset. For a business rule expressed in local civil time, establish the timezone and daylight-saving policy outside this routine.

### Additional Technical Info
`IncSecond` returns a new encoded date/time after adding a signed number of seconds. Positive counts move forward and negative counts move backward.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.IncSecond`. That routine scales the requested second count to milliseconds by 1,000 and ultimately delegates to `IncMilliSecond`, whose terminal converts through an integer millisecond timestamp.

**Edge cases and quirks**

- This is fixed-duration arithmetic: each second represents a fixed encoded second. It is not a timezone-aware local-calendar adjustment.
- Because the terminal converts through a millisecond timestamp, the incoming value is rounded to the nearest millisecond. Even a zero increment can therefore normalise sub-millisecond precision.
- Intermediate scaling is performed before the timestamp terminal. An extreme `ANumberOfSeconds` can overflow during multiplication even when its declared type accepted the original argument.
- Negative/pre-epoch `TDateTime` values use Delphi's sign-sensitive encoding. The timestamp conversion is designed to preserve chronological arithmetic, but direct numeric comparisons with the result need the normal pre-epoch precautions.
- Floating-point `TDateTime` representation means the returned `Double` should not be tested for exact binary equality when a tolerance or component comparison is more appropriate.

**Side effects**

None.

**Performance and concurrency**

Constant-time arithmetic and conversion with no external I/O or shared mutable state.

**Related entries**

- [`IncMilliSecond`](IncMilliSecond.md) is the next routine in the implementation chain.
- [`IncMinute`](IncMinute.md) provides a related date/time operation.

**External references**

- [Embarcadero `System.DateUtils.IncSecond`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.IncSecond)
- [Free Pascal `IncSecond`](https://www.freepascal.org/docs-html/rtl/dateutils/incsecond.html)

<small>Created 2026-07-15</small>
