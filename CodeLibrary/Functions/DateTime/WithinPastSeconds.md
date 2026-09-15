---
title: WithinPastSeconds
description: "Reports whether two date/time values are no more than a supplied number of complete seconds apart."
sidebar_position: 173
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date-time
  - elapsed-time
---

```Delphi
Function WithinPastSeconds( const ANow, AThen : TDateTime; const ASeconds : Int64) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  FirstValue, SecondValue: TDateTime;
begin
  FirstValue := EncodeDateTime(2026, 4, 1, 9, 0, 0, 0);
  SecondValue := EncodeDateTime(2026, 4, 1, 9, 0, 2, 999);
  Value := WithinPastSeconds(FirstValue, SecondValue, 2);
  // Value is True: the complete-second distance is 2.
end;
```

### Usage

`WithinPastSeconds` reports whether two date/time values are no more than a supplied number of complete seconds apart.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ANow` | `TDateTime` | One encoded endpoint; it need not be the actual current or later value. |
| `AThen` | `TDateTime` | The other encoded endpoint. |
| `ASeconds` | `Int64` | Inclusive complete-second limit. Negative values produce `False`. |

**Returns**

`True` when `SecondsBetween(ANow, AThen) <= ASeconds`; otherwise `False`.

**Behaviour**

Sub-second distance is discarded after each input has been rounded to encoded millisecond resolution. A gap of 2.999 seconds passes a limit of 2; exactly 3 seconds does not.

**Important usage notes**

- The predicate is symmetric, so swapping the arguments has no effect.
- A limit of 0 accepts any gap below 1,000 normalised milliseconds; it is not a same-millisecond test.
- Negative limits return `False`, including for identical endpoints.
- No timezone or daylight-saving adjustment is made.

**Errors**

Velox adds no validation or exception handler. RTL conversion/arithmetic failures from invalid values propagate.

### Additional Technical Info
Reports whether two encoded date/time values are no more than `ASeconds` complete seconds apart. It tests absolute distance and does not establish temporal direction.

**Implementation**

Velox binds directly to `System.DateUtils.WithinPastSeconds`. The installed terminal calls `SecondsBetween`, which converts both values to millisecond timestamps, takes their absolute difference and performs integer division by 1,000.

**Performance and concurrency**

The function is constant-time, allocation-free and independent of host clock and Velox shared state.

**Related entries**

- [`SecondsBetween`](SecondsBetween.md) — returns the complete-second distance used here.
- [`WithinPastMilliSeconds`](WithinPastMilliSeconds.md) — compares at encoded millisecond resolution.
- [`WithinPastMinutes`](WithinPastMinutes.md) — floors the distance to complete minutes.

**External references**

- [Free Pascal: `WithinPastSeconds`](https://www.freepascal.org/docs-html/rtl/dateutils/withinpastseconds.html)
- [Embarcadero DocWiki: `System.DateUtils.WithinPastSeconds`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.WithinPastSeconds)

<small>Created 2026-07-15</small>
