---
title: "MilliSecondOfTheYear"
description: "Returns the zero-based millisecond index within the encoded calendar year."
sidebar_position: 90
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - milliseconds
  - year
---

```Delphi
Function MilliSecondOfTheYear(const AValue: TDateTime): Int64
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 1, 2, 0, 0, 0, 250);
  Value := MilliSecondOfTheYear(InputValue); // 86400250
end;
```

### Usage

`MilliSecondOfTheYear` returns the zero-based millisecond index within the encoded calendar year.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded date/time whose position within the calendar year is required. |

**Returns**

An `Int64` from 0 through 31,535,999,999 in a common year or through 31,622,399,999 in a leap year.

**Behaviour**

- 1 January at 00:00:00.000 returns zero.
- The value resets at the next calendar-year boundary.
- Gregorian leap-year rules determine whether the range contains 365 or 366 days.
- Calendar year, not ISO week-year, controls the boundary.

**Important usage notes**

- The result requires 64 bits; it does not fit in either a signed or unsigned 32-bit integer at the end of a year.
- The function returns an encoded calendar-field index, not a timezone-aware elapsed duration since the real-world start of the year.
- Smaller-than-millisecond fractions are subject to Velox's decode/timestamp rounding.
- Invalid or non-finite input can raise rather than producing a sentinel.

**Errors**

Velox does not catch or translate date/time decode exceptions.

### Additional Technical Info
`MilliSecondOfTheYear` returns the zero-based position of an encoded date/time within its calendar year, measured in whole milliseconds from 1 January at midnight.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.MilliSecondOfTheYear`. The routine calculates the whole-second index within the year, widens it to `Int64`, multiplies by 1,000 and adds the millisecond-within-second component.

**Side effects**

None.

**Performance and concurrency**

Constant-time component extraction and integer arithmetic with no external I/O or shared mutable state.

**Remarks**

Keep the result in an `Int64`-capable destination when using it for ordering or arithmetic.

**Related entries**

- [`MinuteOfTheYear`](MinuteOfTheYear.md) returns the corresponding whole-minute index.
- [`MilliSecondOfTheMonth`](MilliSecondOfTheMonth.md) resets at each calendar month.

**External references**

- [Embarcadero `System.DateUtils.MilliSecondOfTheYear`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.MilliSecondOfTheYear)
- [Free Pascal `MilliSecondOfTheYear`](https://www.freepascal.org/docs-html/rtl/dateutils/millisecondoftheyear.html)

<small>Created 2026-07-15</small>
