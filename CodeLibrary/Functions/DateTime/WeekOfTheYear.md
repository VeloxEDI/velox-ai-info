---
title: WeekOfTheYear
description: "Returns the ISO 8601 week number containing an encoded date/time value."
sidebar_position: 163
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date-time
  - iso-week
---

```Delphi
Function WeekOfTheYear( const AValue : TDateTime) : Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := WeekOfTheYear(EncodeDate(2021, 1, 1));
  // Value is 53 because this Friday belongs to the last ISO week of 2020.
end;
```

### Usage

`WeekOfTheYear` returns the ISO 8601 week number containing an encoded date/time value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime` | A valid encoded date/time. The date is used and the time-of-day component is ignored. |

**Returns**

The one-based ISO week number, from 1 through 53.

**Behaviour**

The first calendar days of January can belong to week 52 or 53 of the preceding ISO year. The last calendar days of December can belong to week 1 of the following ISO year. This behaviour is deterministic and independent of regional first-day-of-week settings.

**Important usage notes**

- The script-visible overload returns no ISO year. Pairing this result with `YearOf(AValue)` can create an incorrect year/week key around New Year; use `DecodeDateWeek` for both values.
- `WeekOf` is an exact alias and returns the same number.
- No timezone conversion occurs. `AValue` is an untagged encoded wall-clock value.
- Values outside the supported Gregorian encoding can raise when the decoder attempts to construct its year boundary.

**Errors**

Velox adds no exception handler, so RTL date conversion errors propagate.

### Additional Technical Info
Returns the ISO 8601 week number containing `AValue`. Weeks begin on Monday, end on Sunday and are owned by the year containing at least four of the week's days. The result is therefore not necessarily a week counted within `YearOf(AValue)`.

**Implementation**

Velox registers the one-argument `System.DateUtils.WeekOfTheYear` overload. It calls `DecodeDateWeek`, retaining only the week number and discarding the ISO week-year and weekday. The decoder maps Delphi's Sunday-based decoded weekday to ISO Monday-based numbering, aligns the day-of-year to the first four-day week, and shifts dates at either calendar-year boundary into the appropriate adjacent ISO year.

**Performance and concurrency**

The routine performs bounded arithmetic and, only at the early-January boundary, one recursive decode of the preceding day. It allocates no objects and uses no shared Velox state.

**Related entries**

- [`DecodeDateWeek`](DecodeDateWeek.md) — returns the associated ISO year and weekday as well as the week number.
- [`WeekOf`](WeekOf.md) — exact alias of this result.
- [`WeeksInAYear`](WeeksInAYear.md) — reports whether an ISO year has 52 or 53 weeks.

**External references**

- [Free Pascal: `WeekOfTheYear`](https://www.freepascal.org/docs-html/rtl/dateutils/weekoftheyear.html)
- [Embarcadero DocWiki: `System.DateUtils.WeekOfTheYear`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.WeekOfTheYear)

<small>Created 2026-07-15</small>
