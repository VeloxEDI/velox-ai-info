---
title: WithinPastMinutes
description: "Reports whether two date/time values are no more than a supplied number of complete minutes apart."
sidebar_position: 171
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
Function WithinPastMinutes( const ANow, AThen : TDateTime; const AMinutes : Int64) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  FirstValue, SecondValue: TDateTime;
begin
  FirstValue := EncodeDateTime(2026, 4, 1, 9, 0, 0, 0);
  SecondValue := EncodeDateTime(2026, 4, 1, 9, 2, 59, 999);
  Value := WithinPastMinutes(FirstValue, SecondValue, 2);
  // Value is True: the complete-minute distance is 2.
end;
```

### Usage

`WithinPastMinutes` reports whether two date/time values are no more than a supplied number of complete minutes apart.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ANow` | `TDateTime` | One encoded endpoint. |
| `AThen` | `TDateTime` | The other encoded endpoint; parameter order is immaterial. |
| `AMinutes` | `Int64` | Inclusive complete-minute limit. A negative value produces `False`. |

**Returns**

`True` when `MinutesBetween(ANow, AThen) <= AMinutes`; otherwise `False`.

**Behaviour**

Fractional minutes are discarded. A value 2 minutes 59.999 seconds from the other passes a limit of 2; exactly 3 minutes does not. Both inputs are first normalised to millisecond resolution.

**Important usage notes**

- The predicate is symmetric despite the parameter names and function name.
- The comparison uses fixed 60-second encoded minutes, not timezone-aware elapsed civil time.
- A negative limit returns `False`, including for equal endpoints.
- Valid pre-1899 inputs are compared through timestamp normalisation rather than raw `Double` subtraction.

**Errors**

Velox catches no exceptions. Invalid or non-representable encoded values can propagate RTL conversion/arithmetic failures.

### Additional Technical Info
Reports whether two encoded date/time values are no more than `AMinutes` complete minutes apart. It takes an absolute duration and does not require `ANow` to be the current or later value.

**Implementation**

Velox binds directly to `System.DateUtils.WithinPastMinutes`. The installed routine delegates to `MinutesBetween`, which converts both endpoints to `Int64` millisecond timestamps, takes the absolute difference and divides by 60,000 with integer division.

**Performance and concurrency**

The routine is constant-time, allocation-free and independent of shared Velox state.

**Related entries**

- [`MinutesBetween`](MinutesBetween.md) — returns the complete-minute value used by the predicate.
- [`WithinPastSeconds`](WithinPastSeconds.md) — applies the comparison in complete seconds.
- [`WithinPastHours`](WithinPastHours.md) — applies the comparison in complete hours.

**External references**

- [Free Pascal: `WithinPastMinutes`](https://www.freepascal.org/docs-html/rtl/dateutils/withinpastminutes.html)
- [Embarcadero DocWiki: `System.DateUtils.WithinPastMinutes`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.WithinPastMinutes)

<small>Created 2026-07-15</small>
