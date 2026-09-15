---
title: WeekOf
description: "Returns the ISO 8601 week-of-year number as an exact alias of WeekOfTheYear."
sidebar_position: 161
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
Function WeekOf( const AValue : TDateTime) : Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := WeekOf(EncodeDate(2024, 12, 31));
  // Value is 1 because this Tuesday belongs to ISO week 1 of 2025.
end;
```

### Usage

Returns the ISO 8601 week-of-year number as an exact alias of WeekOfTheYear.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime` | A valid encoded date/time. Its time-of-day component does not affect the result. |

**Returns**

The one-based ISO week number, from 1 through 53.

**Behaviour**

The date is decoded without changing it or consulting the host clock, locale or timezone. Early January dates can return week 52 or 53 of the preceding ISO week-year; late December dates can return week 1 of the following ISO week-year.

**Errors**

Velox adds no exception handler. Date conversion or range errors raised by the installed RTL propagate to the script.

### Additional Technical Info
Returns the ISO 8601 week-of-year number containing `AValue`. The result is from 1 through 53. `WeekOf` is an exact alias of `WeekOfTheYear`; it does not return the associated ISO week-year.

**Implementation**

Velox binds this declaration directly to the installed `System.DateUtils.WeekOf`. That function calls the one-argument `WeekOfTheYear`, which delegates to `DecodeDateWeek`. The decoder uses Monday through Sunday weeks and assigns a week to the year containing at least four of its days. Internally, the first Thursday rule is implemented by shifting the day-of-year calculation according to the weekday of 1 January.

**Edge cases and quirks**

- The function name does not imply a simple seven-day block counted from 1 January. ISO year boundaries govern the result.
- Velox exposes only the week number. Use `DecodeDateWeek` when the corresponding ISO week-year and weekday are also required.
- The routine expects an encodable Gregorian `TDateTime`. A value below the supported year-1 boundary reaches an invalid year during the recursive decode and the installed RTL raises a conversion error.
- Free Pascal exposes the same named routine, but its documentation is compatibility guidance; the installed Delphi 37.0 source is authoritative for Velox.

**Performance and concurrency**

The calculation is fixed-size date arithmetic, allocates no objects and uses no Velox shared state.

**Related entries**

- [`WeekOfTheYear`](WeekOfTheYear.md) — returns the same week number through the underlying named function.
- [`DecodeDateWeek`](DecodeDateWeek.md) — also returns the ISO week-year and ISO weekday.
- [`WeekOfTheMonth`](WeekOfTheMonth.md) — applies the related four-day ownership rule at month boundaries.

**External references**

- [Free Pascal: `WeekOf`](https://www.freepascal.org/docs-html/rtl/dateutils/weekof.html)
- [Embarcadero DocWiki: `System.DateUtils.WeekOf`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.WeekOf)

<small>Created 2026-07-15</small>
