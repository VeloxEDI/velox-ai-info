---
title: "MilliSecondOfTheMonth"
description: "Returns the zero-based millisecond index within the encoded calendar month."
sidebar_position: 87
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - milliseconds
  - month
---

```Delphi
Function MilliSecondOfTheMonth(const AValue: TDateTime): LongWord
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 2, 1, 2, 3, 4);
  Value := MilliSecondOfTheMonth(InputValue); // 90123004
end;
```

### Usage

`MilliSecondOfTheMonth` returns the zero-based millisecond index within the encoded calendar month.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded date/time whose position within its calendar month is required. |

**Returns**

A `LongWord` from zero through one less than the number of milliseconds in the encoded month. The maximum is 2,419,199,999 for a 28-day month, 2,505,599,999 for 29 days, 2,591,999,999 for 30 days or 2,678,399,999 for 31 days.

**Behaviour**

- Midnight on the first day of a month returns zero.
- The result increases through the encoded month and resets at midnight on the first day of the next month.
- Leap-year rules affect the February maximum.
- Smaller-than-millisecond fractions are resolved by Velox's date/time decoding before the result is calculated.
- No timezone or daylight-saving conversion is performed.

**Errors**

Velox performs no validation or exception translation. Date/time decode exceptions propagate to the script.

**Usage notes**

Use this function for an index or bucket within the encoded month. Use `MilliSecondsBetween` when the requirement is a duration between two values.

### Additional Technical Info
`MilliSecondOfTheMonth` returns the zero-based position of an encoded date/time within its calendar month, measured in whole milliseconds from midnight on the first day. It is a calendar-field index, not a duration calculation between two independent values.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.MilliSecondOfTheMonth`. The routine obtains the zero-based whole-second index within the month, multiplies it by 1,000 and adds the decoded millisecond-within-second component.

**Edge cases and quirks**

- The result describes encoded calendar fields. It is not the number of real elapsed milliseconds since a timezone-aware month boundary.
- Although the exposed return type is `LongWord`, the installed Delphi terminal declares the equivalent 32-bit unsigned type `Cardinal`.
- The maximum for a 31-day month fits within an unsigned 32-bit result but not within a signed 32-bit integer. Preserve the unsigned value or use a wider numeric destination when subsequent arithmetic is required.
- Invalid or non-finite encoded input can raise during component decoding rather than returning a sentinel.

**Side effects**

None.

**Performance and concurrency**

Constant-time field decoding and integer arithmetic with no external I/O or shared mutable state.

**Related entries**

- [`MilliSecondOfTheYear`](MilliSecondOfTheYear.md) uses the start of the calendar year as its boundary.
- [`MilliSecondsBetween`](MilliSecondsBetween.md) calculates an absolute interval between two encoded values.

**External references**

- [Embarcadero `System.DateUtils.MilliSecondOfTheMonth`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.MilliSecondOfTheMonth)
- [Free Pascal `MilliSecondOfTheMonth`](https://www.freepascal.org/docs-html/rtl/dateutils/millisecondofthemonth.html)

<small>Created 2026-07-15</small>
