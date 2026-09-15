---
title: "SecondOfTheMonth"
description: "Returns the zero-based second index within the encoded calendar month."
sidebar_position: 128
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - seconds
  - month
  - index
---

```Delphi
Function SecondOfTheMonth( const AValue : TDateTime) : LongWord
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 7, 2, 1, 2, 3, 900);
  Value := SecondOfTheMonth(InputValue); // 90123
end;
```

### Usage

`SecondOfTheMonth` returns the zero-based second index within the encoded calendar month.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Date/time whose calendar-month position is required. |

**Returns**

An unsigned value from zero through 2,419,199, 2,505,599, 2,591,999 or 2,678,399 depending on whether the month contains 28, 29, 30 or 31 days.

**Behaviour**

- The result resets at midnight on the first day of each month.
- Leap-year rules alter February's maximum.
- Milliseconds are ignored.
- It is a field index, not elapsed time between independently tagged instants.

**Errors**

Decode exceptions propagate unchanged.

**Usage notes**

Use `SecondsBetween` when comparing two values rather than locating one value within a month.

### Additional Technical Info
`SecondOfTheMonth` returns the zero-based whole-second position within the encoded calendar month, starting at midnight on its first day.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import calls `System.DateUtils.SecondOfTheMonth`. Delphi calculates `SecondOf(AValue) + MinuteOfTheMonth(AValue) * 60`; the delegated minute routine incorporates zero-based day and hour fields.

**Edge cases and quirks**

- The returned `LongWord` matches Delphi's unsigned `Cardinal`.
- Timezone/DST rules do not change the encoded index.
- Invalid input can raise while decoding date/time fields.
- Free Pascal provides a compatible same-name index routine.

**Side effects**

None.

**Performance and concurrency**

Constant-time field decoding and integer arithmetic with no I/O.

**Related entries**

- [`SecondOfTheYear`](SecondOfTheYear.md) uses the calendar year boundary.
- [`MilliSecondOfTheMonth`](MilliSecondOfTheMonth.md) includes milliseconds.

**External references**

- [Embarcadero `System.DateUtils.SecondOfTheMonth`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.SecondOfTheMonth)
- [Free Pascal `SecondOfTheMonth`](https://www.freepascal.org/docs-html/rtl/dateutils/secondofthemonth.html)

<small>Created 2026-07-15</small>
