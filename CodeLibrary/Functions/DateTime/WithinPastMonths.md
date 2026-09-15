---
title: WithinPastMonths
description: "Reports whether two date/time values are within a supplied count of complete approximate 30.4375-day months."
sidebar_position: 172
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date-time
  - approximate-duration
---

```Delphi
Function WithinPastMonths( const ANow, AThen : TDateTime; const AMonths : Integer) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := WithinPastMonths(
    EncodeDate(2024, 1, 1), EncodeDate(2024, 12, 31), 11);
  // Value is True: 365 days contains 11 complete 30.4375-day periods.
end;
```

### Usage

`WithinPastMonths` reports whether two date/time values are within a supplied count of complete approximate 30.4375-day months.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ANow` | `TDateTime` | One encoded date/time endpoint. It need not be the later or current value. |
| `AThen` | `TDateTime` | The other encoded endpoint. |
| `AMonths` | `Integer` | Inclusive maximum count of complete 30.4375-day periods. Negative values produce `False`. |

**Returns**

`True` when `MonthsBetween(ANow, AThen) <= AMonths`; otherwise `False`.

**Behaviour**

The result is symmetric and duration-based. A 30-day interval contains 0 complete approximate months; 30 days 10 hours 30 minutes is exactly one such month. Moving from one calendar date to the same day in the next month does not guarantee a result of 1 because actual month lengths vary.

**Errors**

Velox does not catch RTL conversion or arithmetic failures from invalid/non-representable inputs.

### Additional Technical Info
Reports whether two encoded date/time values are no more than `AMonths` complete approximate months apart. Here a month is a fixed average duration of 30.4375 days; calendar month boundaries and matching day numbers are not used.

**Implementation**

Velox binds directly to `System.DateUtils.WithinPastMonths`. `MonthsBetween` converts each endpoint to a millisecond timestamp, takes the absolute distance and divides it by `Round(86,400,000 * 30.4375)`, or 2,629,800,000 milliseconds. Integer division discards the remainder before the inclusive comparison.

**Edge cases and quirks**

- This is not calendar-month or anniversary logic. Use `IncMonth` plus an explicit comparison when calendar boundaries are the requirement.
- The floor operation is deliberately permissive: 2.9 approximate months passes a limit of 2.
- Negative limits return `False`, even for equal values.
- Inputs are normalised to milliseconds and no timezone/daylight-saving conversion occurs.
- Free Pascal exposes the same family and average-duration model; installed Delphi 37.0 constants and arithmetic define Velox behaviour.

**Performance and concurrency**

The calculation is constant-time integer arithmetic with no allocation, host-clock read or shared Velox state.

**Related entries**

- [`MonthsBetween`](MonthsBetween.md) — returns the complete approximate-month count used here.
- [`WithinPastYears`](WithinPastYears.md) — uses the corresponding 365.25-day year approximation.
- [`IncMonth`](IncMonth.md) — performs calendar-aware month movement and has different end-of-month semantics.

**External references**

- [Free Pascal: `WithinPastMonths`](https://www.freepascal.org/docs-html/rtl/dateutils/withinpastmonths.html)
- [Embarcadero DocWiki: `System.DateUtils.WithinPastMonths`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.WithinPastMonths)

<small>Created 2026-07-15</small>
