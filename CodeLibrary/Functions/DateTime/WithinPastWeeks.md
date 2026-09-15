---
title: WithinPastWeeks
description: "Reports whether two date/time values are no more than a supplied number of complete seven-day periods apart."
sidebar_position: 174
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
Function WithinPastWeeks( const ANow, AThen : TDateTime; const AWeeks : Integer) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := WithinPastWeeks(
    EncodeDate(2026, 4, 1), EncodeDate(2026, 4, 21), 2);
  // Value is True: 20 days contains 2 complete seven-day periods.
end;
```

### Usage

`WithinPastWeeks` reports whether two date/time values are no more than a supplied number of complete seven-day periods apart.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ANow` | `TDateTime` | One encoded date/time endpoint; it need not be the later value. |
| `AThen` | `TDateTime` | The other encoded endpoint. |
| `AWeeks` | `Integer` | Inclusive maximum number of complete seven-day periods. Negative values produce `False`. |

**Returns**

`True` when `WeeksBetween(ANow, AThen) <= AWeeks`; otherwise `False`.

**Behaviour**

Fractional weeks are discarded. A distance up to one millisecond short of three weeks is considered within 2 weeks; exactly three weeks is not.

**Important usage notes**

- Swapping the parameters has no effect, and neither parameter is required to represent the current time.
- The calculation does not count crossed Mondays, Sundays or ISO week numbers.
- Negative limits return `False`, even for equal endpoints.
- Weeks are fixed encoded durations; timezone and daylight-saving transitions are not consulted.

**Errors**

Velox catches no exceptions. Invalid or non-representable encoded inputs can propagate RTL conversion/arithmetic failures.

### Additional Technical Info
Reports whether the absolute distance between two date/time values is no more than `AWeeks` complete seven-day periods. It is a duration predicate, not an ISO week-number or week-boundary comparison.

**Implementation**

Velox binds directly to `System.DateUtils.WithinPastWeeks`. The installed function delegates to `WeeksBetween`, which converts both endpoints to millisecond timestamps, takes their absolute distance and performs integer division by 604,800,000 before the inclusive comparison.

**Performance and concurrency**

The routine uses constant-time integer arithmetic with no allocation or shared Velox state.

**Related entries**

- [`WeeksBetween`](WeeksBetween.md) — supplies the complete-week distance used here.
- [`WeekSpan`](WeekSpan.md) — returns a fractional raw week span.
- [`WeekOfTheYear`](WeekOfTheYear.md) — returns an ISO week number rather than a duration.

**External references**

- [Free Pascal: `WithinPastWeeks`](https://www.freepascal.org/docs-html/rtl/dateutils/withinpastweeks.html)
- [Embarcadero DocWiki: `System.DateUtils.WithinPastWeeks`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.WithinPastWeeks)

<small>Created 2026-07-15</small>
