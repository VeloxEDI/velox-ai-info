---
title: WithinPastYears
description: "Reports whether two date/time values are within a supplied count of complete approximate 365.25-day years."
sidebar_position: 175
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
Function WithinPastYears( const ANow, AThen : TDateTime; const AYears : Integer) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := WithinPastYears(
    EncodeDate(2021, 1, 1), EncodeDate(2022, 1, 1), 0);
  // Value is True: 365 days contains 0 complete 365.25-day periods.
end;
```

### Usage

`WithinPastYears` reports whether two date/time values are within a supplied count of complete approximate 365.25-day years.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `ANow` | `TDateTime` | One encoded date/time endpoint. It need not be the later or actual current value. |
| `AThen` | `TDateTime` | The other encoded endpoint. |
| `AYears` | `Integer` | Inclusive maximum count of complete 365.25-day periods. Negative values produce `False`. |

**Returns**

`True` when `YearsBetween(ANow, AThen) <= AYears`; otherwise `False`.

**Behaviour**

The result is symmetric. A 365-day common-year interval contains 0 complete approximate years and therefore passes a limit of 0; a 366-day leap-year interval contains 1. This is duration arithmetic, not an age or anniversary calculation.

**Errors**

Velox does not catch conversion or arithmetic errors produced by invalid/non-representable values.

### Additional Technical Info
Reports whether two encoded date/time values are no more than `AYears` complete approximate years apart. An approximate year is fixed at 365.25 days; calendar anniversaries, leap-day adjustment and matching month/day fields are not used.

**Implementation**

Velox binds directly to `System.DateUtils.WithinPastYears`. `YearsBetween` converts both values to millisecond timestamps, takes the absolute difference and divides it by `Round(86,400,000 * 365.25)`, or 31,557,600,000 milliseconds. Integer division floors that count before the inclusive comparison.

**Edge cases and quirks**

- The permissive floor is intentional in the installed function: 2.9 approximate years passes a limit of 2.
- Use `IncYear` and explicit date comparison when calendar-anniversary semantics are required.
- Negative limits return `False`, even for equal inputs.
- Inputs are millisecond-normalised, but no timezone/daylight-saving rules are applied.
- Free Pascal documents the same approximate family. Velox exposes only Delphi's three-argument predicate and follows the installed 365.25-day constant.

**Performance and concurrency**

The operation is constant-time integer arithmetic, allocation-free and independent of shared Velox state.

**Related entries**

- [`YearsBetween`](YearsBetween.md) — returns the complete approximate-year count used here.
- [`YearSpan`](YearSpan.md) — returns a fractional approximate-year span through raw arithmetic.
- [`IncYear`](IncYear.md) — shifts a date by calendar years with different leap-day behaviour.

**External references**

- [Free Pascal: `WithinPastYears`](https://www.freepascal.org/docs-html/rtl/dateutils/withinpastyears.html)
- [Embarcadero DocWiki: `System.DateUtils.WithinPastYears`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.WithinPastYears)

<small>Created 2026-07-15</small>
