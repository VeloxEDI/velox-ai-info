---
title: WeeksInYear
description: "Returns the 52- or 53-week ISO count for the calendar year encoded in a date/time value."
sidebar_position: 166
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
Function WeeksInYear( const AValue : TDateTime) : Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := WeeksInYear(EncodeDate(2020, 12, 31));
  // Value is 53 because the encoded calendar year is 2020.
end;
```

### Usage

`WeeksInYear` returns the 52- or 53-week ISO count for the calendar year encoded in a date/time value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime` | A valid encoded date/time whose Gregorian year supplies the input to `WeeksInAYear`. |

**Behaviour**

The time component is ignored. Locale and timezone settings are not consulted. The function answers a property of the encoded Gregorian year, not a property of the date's ISO week owner.

**Errors**

Velox does not catch RTL exceptions. Invalid encoded dates or invalid derived years can produce a date conversion error.

### Additional Technical Info
Returns the number of ISO 8601 weeks in the Gregorian calendar year component of `AValue`. The result is 52 or 53.

**Implementation**

Velox binds directly to `System.DateUtils.WeeksInYear`. The installed function calls `YearOf(AValue)`, then passes that calendar year unchanged to `WeeksInAYear`. The latter encodes 1 January and applies the ISO Thursday/leap-year rule.

**Edge cases and quirks**

- Around New Year, `YearOf(AValue)` can differ from the ISO week-year returned by `DecodeDateWeek`. `WeeksInYear` deliberately uses the calendar year. For example, a late-December date in ISO week 1 of the following year still returns the week count for its December calendar year.
- A date's returned `WeekOfTheYear` should therefore not automatically be paired with `WeeksInYear` when constructing an ISO year/week key.
- For an invalid lower-bound encoded date, `YearOf` returns 0 and `WeeksInAYear(0)` then raises while encoding 1 January.

**Performance and concurrency**

The routine performs bounded date decoding and encoding without object allocation or Velox shared state.

**Related entries**

- [`WeeksInAYear`](WeeksInAYear.md) — accepts the year explicitly.
- [`YearOf`](YearOf.md) — supplies the calendar year used here.
- [`DecodeDateWeek`](DecodeDateWeek.md) — returns the ISO week-year required for an ISO year/week key.

**External references**

- [Free Pascal: `WeeksInYear`](https://www.freepascal.org/docs-html/rtl/dateutils/weeksinyear.html)
- [Embarcadero DocWiki: `System.DateUtils.WeeksInYear`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.WeeksInYear)

<small>Created 2026-07-15</small>
