---
title: "SameTime"
description: "Reports whether two values have the same millisecond-normalised time of day, ignoring their dates."
sidebar_position: 123
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - time
  - comparison
  - milliseconds
---

```Delphi
Function SameTime( const A, B : TDateTime) : Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  FirstDay, SecondDay: TDateTime;
begin
  FirstDay := EncodeDateTime(2026, 7, 16, 8, 30, 15, 125);
  SecondDay := EncodeDateTime(2027, 1, 5, 8, 30, 15, 125);
  Value := SameTime(FirstDay, SecondDay); // True
end;
```

### Usage

`SameTime` reports whether two values have the same millisecond-normalised time of day, ignoring their dates.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `A` | `TDateTime`, `const` | First value whose time portion is compared. |
| `B` | `TDateTime`, `const` | Second value whose time portion is compared. |

**Returns**

`True` when both values produce the same rounded millisecond-of-day count; otherwise `False`.

**Behaviour**

- Calendar dates are ignored completely.
- Comparison includes milliseconds but discards smaller floating differences through rounding.
- `Abs(Frac(...))` makes ordinary valid pre-epoch time portions compare correctly with the same post-epoch clock fields.
- The comparison is symmetric and timezone-neutral.

**Errors**

Valid finite values do not normally raise. Velox does not add validation or exception handling.

**Usage notes**

Use `TimeOf` when the raw time fraction is required. Use `SameDateTime` when both date and time must match.

### Additional Technical Info
`SameTime` compares only the time-of-day portions of two values after reducing them to integer milliseconds. Their calendar dates are ignored.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.SameTime`. It calls the internal `TimeToMilliSeconds` helper for both arguments. That helper obtains `TimeOf` using raw `Frac`, takes its absolute value, multiplies by 86,400,000 and rounds to the nearest integer before comparison.

**Edge cases and quirks**

- `SameTime` does not compare raw fractions. Values with slightly different binary representations can be equal after nearest-millisecond rounding.
- Arbitrary raw fractions extremely close to the next day can round to 86,400,000. Properly encoded Delphi values normally resolve no later than 23:59:59.999.
- The function does not establish simultaneous instants or account for timezone offsets.
- `TimeOf` itself returns a negative raw fraction for timed pre-epoch values; `SameTime` deliberately applies `Abs` inside its helper.
- Free Pascal documents the public result through `CompareTime`; installed Delphi uses the explicit rounded millisecond helper above.

**Side effects**

None.

**Performance and concurrency**

Constant-time fractional arithmetic and integer comparison with no I/O or shared mutable state.

**Related entries**

- [`TimeOf`](TimeOf.md) exposes the raw fractional part.
- [`SameDateTime`](SameDateTime.md) includes the encoded calendar date.

**External references**

- [Embarcadero `System.DateUtils.SameTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.SameTime)
- [Free Pascal `SameTime`](https://www.freepascal.org/docs-html/rtl/dateutils/sametime.html)

<small>Created 2026-07-15</small>
