---
title: WithinPastMilliSeconds
description: "Reports whether two date/time values are within an inclusive millisecond-distance limit."
sidebar_position: 170
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date-time
  - milliseconds
---

```Delphi
Function WithinPastMilliSeconds( const ANow, AThen : TDateTime; const AMilliSeconds : Int64) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  FirstValue, SecondValue: TDateTime;
begin
  FirstValue := EncodeDateTime(2026, 4, 1, 9, 0, 0, 0);
  SecondValue := EncodeDateTime(2026, 4, 1, 9, 0, 1, 500);
  Value := WithinPastMilliSeconds(FirstValue, SecondValue, 1500);
  // Value is True because the encoded distance is exactly 1,500 ms.
end;
```

### Usage

`WithinPastMilliSeconds` reports whether two date/time values are within an inclusive millisecond-distance limit.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ANow` | `TDateTime` | One encoded date/time endpoint; it need not be the later endpoint. |
| `AThen` | `TDateTime` | The other encoded date/time endpoint. |
| `AMilliSeconds` | `Int64` | Inclusive distance limit in milliseconds. Negative values produce `False`. |

**Returns**

`True` when `MilliSecondsBetween(ANow, AThen) <= AMilliSeconds`; otherwise `False`.

**Behaviour**

`DateTimeToTimeStamp` rounds each binary floating-point input to the nearest encoded millisecond. There is no sub-millisecond result: two values that normalise to the same millisecond have distance 0.

**Errors**

Velox adds no validation or exception handler. Invalid, non-finite or non-representable inputs can propagate RTL arithmetic/conversion failures.

### Additional Technical Info
Reports whether the absolute millisecond-normalised distance between two encoded date/time values is less than or equal to `AMilliSeconds`. It is the finest-grained member of the `WithinPast*` family exposed by Velox.

**Implementation**

Velox binds directly to `System.DateUtils.WithinPastMilliSeconds`. `MilliSecondsBetween` converts each `TDateTime` to a `TTimeStamp`, combines its date and time into an `Int64` millisecond count, subtracts the values and takes the absolute result. The predicate compares that value directly with the supplied limit.

**Edge cases and quirks**

- The test is symmetric and does not establish which value is earlier.
- `AMilliSeconds = 0` tests millisecond-normalised equality, not bit-for-bit equality of the original `Double` values.
- Negative limits return `False`, even when the normalised endpoints are equal.
- No timezone or daylight-saving conversion occurs; the inputs are untagged encoded timestamps.
- Free Pascal describes fractional milliseconds as discarded. In installed Delphi 37.0 the explicit terminal operation is nearest-millisecond timestamp rounding.

**Performance and concurrency**

The operation is constant-time and allocation-free, with no clock or shared-state access.

**Related entries**

- [`MilliSecondsBetween`](MilliSecondsBetween.md) — returns the exact normalised distance used here.
- [`WithinPastSeconds`](WithinPastSeconds.md) — floors the same millisecond distance to complete seconds.
- [`SameDateTime`](SameDateTime.md) — tests millisecond-normalised date/time equality directly.

**External references**

- [Free Pascal: `WithinPastMilliSeconds`](https://www.freepascal.org/docs-html/rtl/dateutils/withinpastmilliseconds.html)
- [Embarcadero DocWiki: `System.DateUtils.WithinPastMilliSeconds`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.WithinPastMilliSeconds)

<small>Created 2026-07-15</small>
