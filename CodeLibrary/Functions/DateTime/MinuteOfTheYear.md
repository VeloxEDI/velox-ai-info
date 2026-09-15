---
title: "MinuteOfTheYear"
description: "Returns the zero-based minute index within the encoded calendar year."
sidebar_position: 98
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - minutes
  - year
---

```Delphi
Function MinuteOfTheYear(const AValue: TDateTime): LongWord
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 1, 2, 1, 2, 30, 0);
  Value := MinuteOfTheYear(InputValue); // 1502
end;
```

### Usage

`MinuteOfTheYear` returns the zero-based minute index within the encoded calendar year.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded date/time whose whole-minute position within its calendar year is required. |

**Returns**

A `LongWord` from 0 through 525,599 in a common year or through 527,039 in a leap year.

**Behaviour**

- The index begins at zero on 1 January at midnight and resets at the next calendar year.
- Gregorian leap-year rules determine the maximum.
- Seconds and milliseconds do not contribute and are not rounded.
- Calendar year, not ISO week-year, determines the boundary.

**Important usage notes**

- The Velox uses `Cardinal`, equivalent to the exposed unsigned 32-bit `LongWord`.
- This is an encoded field index rather than a timezone-aware duration since the real start of the year.
- Invalid or non-finite input can raise during decoding.

**Usage notes**

Use a wider or explicitly unsigned destination if later script arithmetic could otherwise coerce this `LongWord` unexpectedly.

### Additional Technical Info
`MinuteOfTheYear` returns the zero-based whole-minute position within the encoded calendar year, measured from 1 January at midnight.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.MinuteOfTheYear`. It calculates the hour position from the zero-based calendar day ordinal, multiplies by 60 and adds the minute-within-hour component.

**Side effects**

None.

**Errors**

Decode exceptions propagate unchanged from Delphi.

**Performance and concurrency**

Constant-time field extraction and integer arithmetic with no external I/O or shared mutable state.

**Related entries**

- [`MilliSecondOfTheYear`](MilliSecondOfTheYear.md) provides millisecond resolution and returns `Int64`.
- [`MinuteOfTheMonth`](MinuteOfTheMonth.md) resets at each calendar month.

**External references**

- [Embarcadero `System.DateUtils.MinuteOfTheYear`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.MinuteOfTheYear)
- [Free Pascal `MinuteOfTheYear`](https://www.freepascal.org/docs-html/rtl/dateutils/minuteoftheyear.html)

<small>Created 2026-07-15</small>
