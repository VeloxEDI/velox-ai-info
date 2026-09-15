---
title: "SecondOfTheYear"
description: "Returns the zero-based second index within the encoded calendar year."
sidebar_position: 130
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - seconds
  - year
  - index
---

```Delphi
Function SecondOfTheYear( const AValue : TDateTime) : LongWord
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDateTime(2026, 1, 2, 1, 2, 3, 900);
  Value := SecondOfTheYear(InputValue); // 90123
end;
```

### Usage

`SecondOfTheYear` returns the zero-based second index within the encoded calendar year.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Date/time whose calendar-year position is required. |

**Returns**

A `LongWord` from zero through 31,535,999 in a common year or 31,622,399 in a leap year.

**Behaviour**

- The result resets at encoded midnight on 1 January.
- Leap years contribute one additional day of indices.
- Milliseconds are ignored rather than rounded.
- The result is calendar-field position, not a timezone-aware elapsed duration.

**Errors**

Decode exceptions propagate unchanged.

**Usage notes**

Use `SecondsBetween` for an interval between values, or `StartOfTheYear` for the boundary date.

### Additional Technical Info
`SecondOfTheYear` returns the zero-based whole-second position within the encoded calendar year, starting at 1 January midnight.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import calls `System.DateUtils.SecondOfTheYear`. Delphi returns `SecondOf(AValue) + MinuteOfTheYear(AValue) * 60`; the delegated chain incorporates the Gregorian ordinal day and clock fields.

**Edge cases and quirks**

- The exposed unsigned `LongWord` corresponds to Delphi `Cardinal`.
- A value near a calendar year boundary is indexed by its encoded year, not ISO week-year.
- Invalid input can raise during component decoding.
- Free Pascal's same-name page describes the compatible calendar-year index.

**Side effects**

None.

**Performance and concurrency**

Constant-time field decoding and integer arithmetic with no I/O or global state.

**Related entries**

- [`StartOfTheYear`](StartOfTheYear.md) returns 1 January midnight.
- [`MilliSecondOfTheYear`](MilliSecondOfTheYear.md) includes milliseconds.

**External references**

- [Embarcadero `System.DateUtils.SecondOfTheYear`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.SecondOfTheYear)
- [Free Pascal `SecondOfTheYear`](https://www.freepascal.org/docs-html/rtl/dateutils/secondoftheyear.html)

<small>Created 2026-07-15</small>
