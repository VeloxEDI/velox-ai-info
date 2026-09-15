---
title: YearOf
description: "Returns the Gregorian calendar year component encoded in a TDateTime value."
sidebar_position: 176
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date-time
  - calendar
---

```Delphi
Function YearOf( const AValue : TDateTime) : Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := YearOf(EncodeDateTime(2026, 7, 19, 14, 30, 0, 0));
  // Value is 2026.
end;
```

### Usage

`YearOf` returns the Gregorian calendar year component encoded in a TDateTime value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime` | Encoded date/time whose calendar year is required. The time component is ignored. |

**Returns**

The year as a `Word`. A valid encoded Gregorian date returns 1 through 9999. At the installed decoder's below-year-1 boundary, the result is 0.

**Behaviour**

The result is the literal Gregorian calendar year of the encoded value. It is not the ISO week-year: dates near New Year can have `YearOf(AValue)` different from the year returned by `DecodeDateWeek`.

**Errors**

The normal invalid lower-bound outcome is 0 rather than an exception. Velox does not catch arithmetic/conversion failures for other invalid or non-representable values.

### Additional Technical Info
Returns the Gregorian calendar year component represented by `AValue`. For a valid encoded date the result is from 1 through 9999.

**Implementation**

Velox binds directly to `System.DateUtils.YearOf`. The installed function calls `System.SysUtils.DecodeDate(AValue, Result, LMonth, LDay)` and discards the month and day. `DecodeDate` delegates to `DecodeDateFully`, which converts the value to a millisecond timestamp and decomposes its date component.

**Edge cases and quirks**

- Time-of-day, locale, regional calendar settings and timezone do not affect the result.
- `DecodeDateFully` sets year, month and day to 0 when the timestamp date is at or below its supported year-1 boundary. `YearOf` does not turn that `False` outcome into an exception, so it returns 0 there even though public references describe the valid range as 1 through 9999.
- Values outside the representable finite `TDateTime` range remain invalid input and can fail during timestamp conversion.

**Performance and concurrency**

The calculation is bounded calendar decomposition, allocates no objects and reads no Velox shared state.

**Related entries**

- [`DecodeDate`](DecodeDate.md) — returns year, month and day together and shares the same lower-bound behaviour.
- [`WeekOfTheYear`](WeekOfTheYear.md) — returns an ISO week whose associated year can differ.
- [`WeeksInYear`](WeeksInYear.md) — passes this calendar-year result to `WeeksInAYear`.

**External references**

- [Free Pascal: `YearOf`](https://www.freepascal.org/docs-html/rtl/dateutils/yearof.html)
- [Embarcadero DocWiki: `System.DateUtils.YearOf`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.YearOf)

<small>Created 2026-07-15</small>
