---
title: WeekOfTheMonth
description: "Returns the ISO 8601x week-of-month number assigned to an encoded date/time value."
sidebar_position: 162
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
Function WeekOfTheMonth( const AValue : TDateTime) : Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := WeekOfTheMonth(EncodeDate(2024, 6, 1));
  // Value is 5: this Saturday belongs to the final ISO week of May.
end;
```

### Usage

`WeekOfTheMonth` returns the ISO 8601x week-of-month number assigned to an encoded date/time value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime` | A valid encoded date/time. Only its Gregorian date is used. |

**Returns**

The numbered week within the month that owns the ISO week. In Velox the calculation produces 1 through 5.

**Behaviour**

This is a week-ownership calculation, not the ordinal occurrence of the date's weekday. For example, the first Saturday of a month can still be week 4 or 5 of the preceding month. Use `NthDayOfWeek` when the requirement is "the first Saturday" rather than an ISO week number.

**Errors**

Velox does not catch exceptions. Any conversion or range exception from the installed RTL propagates.

### Additional Technical Info
Returns the one-based ISO-style week-of-month number assigned to `AValue`. Weeks run from Monday through Sunday. The first week owned by a month is the first week containing at least four days in that month, so a boundary date can belong to a neighbouring month's numbered week.

**Implementation**

Velox binds directly to the one-argument `System.DateUtils.WeekOfTheMonth` overload. It calls `DecodeDateMonthWeek`, discarding the decoded owner year, owner month and ISO weekday. The decoder obtains the weekday of the month's first day, offsets the day number so Monday-based four-day weeks align, and rounds a positive adjusted day number up to a week. It recursively decodes the prior month's last day when the adjusted number is zero or negative, and assigns qualifying Monday-to-Wednesday month-end dates to week 1 of the next month.

**Edge cases and quirks**

- Velox exposes only the week number. At a boundary, the result alone does not identify whether it belongs to the previous, current or next month; `DecodeDateMonthWeek` returns that owner information.
- The current DocWiki page says the result can be 1 through 6. The installed source's offset and month-length bounds produce 1 through 5; Velox follows the installed source.
- Time-of-day, locale and host timezone do not affect the result.
- The input must be within the supported encoded Gregorian range. An invalid lower-bound value leads to an RTL conversion error during month-start encoding.

**Performance and concurrency**

The calculation uses bounded date decoding and, at most, one adjacent-month recursive step. It allocates no objects and uses no Velox shared state.

**Related entries**

- [`DecodeDateMonthWeek`](DecodeDateMonthWeek.md) — returns the owner year, owner month, week number and ISO weekday.
- [`WeekOfTheYear`](WeekOfTheYear.md) — applies the corresponding four-day rule to ISO week-years.
- [`NthDayOfWeek`](NthDayOfWeek.md) — returns the ordinal occurrence of a weekday in the literal calendar month.

**External references**

- [Free Pascal: `WeekOfTheMonth`](https://www.freepascal.org/docs-html/rtl/dateutils/weekofthemonth.html)
- [Embarcadero DocWiki: `System.DateUtils.WeekOfTheMonth`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.WeekOfTheMonth)

<small>Created 2026-07-15</small>
