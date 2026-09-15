---
title: "EncodeDateDay"
description: "Encodes a year and one-based ordinal day of that year as a midnight TDateTime value."
sidebar_position: 31
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - ordinal-day
  - encoding
  - delphi
---

```Delphi
Function EncodeDateDay(const AYear, ADayOfYear: Word): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := EncodeDateDay(2028, 60); // 29 February 2028
end;
```

### Usage

`EncodeDateDay` encodes a year and one-based ordinal day of that year as a midnight TDateTime value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word`, `const` | Gregorian year `1..9999`. |
| `ADayOfYear` | `Word`, `const` | Ordinal day `1..365`, or `1..366` for a leap year. Day 1 is 1 January. |

**Returns**

The requested date at `00:00:00.000` as a `TDateTime`.

**Errors**

An out-of-range year or ordinal raises `EConvertError`. No Velox function catches the exception.

### Additional Technical Info
`EncodeDateDay` constructs the date identified by a Gregorian year and a one-based day-of-year number. The returned time is midnight.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.EncodeDateDay`. It first validates the year and ordinal against `DaysInAYear`, constructs 1 January with `StartOfAYear`, then adds `ADayOfYear - 1` whole days.

**Edge cases and quirks**

- `ADayOfYear = 60` is 29 February in a leap year but 1 March in a common year.
- The input is one-based; zero is invalid rather than an alias for the previous year's final day.
- The routine accepts only a year-local ordinal. It does not carry day 366 into the next year when the supplied year has 365 days.
- The whole-day addition begins at midnight, so it does not encounter Delphi's negative fractional-time convention for pre-epoch dates.
- The result contains no timezone information.

**Side effects**

None.

**Performance and concurrency**

Constant bounded calendar arithmetic with no shared state.

**Related entries**

- [`DecodeDateDay`](DecodeDateDay.md) performs the inverse decomposition.
- [`DayOfTheYear`](DayOfTheYear.md) extracts an ordinal from an existing value.

**External references**

- [Embarcadero `System.DateUtils.EncodeDateDay`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.EncodeDateDay)
- [Free Pascal `EncodeDateDay`](https://www.freepascal.org/docs-html/rtl/dateutils/encodedateday.html)

<small>Created 2026-07-15</small>
