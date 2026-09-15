---
title: "DaysInYear"
description: "Returns the number of days in the calendar year containing a TDateTime value."
sidebar_position: 20
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - year
  - leap-year
  - calendar
  - delphi
---

```Delphi
Function DaysInYear(const AValue: TDateTime): Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := DaysInYear(EncodeDate(1900, 6, 1)); // 365
end;
```

### Usage

`DaysInYear` returns the number of days in the calendar year containing a TDateTime value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Date/time whose decoded year is evaluated. Time is ignored. |

**Returns**

`365` for a common year or `366` for a leap year.

**Behaviour**

All valid values within the same calendar year return the same number. No locale or timezone logic is involved.

**Errors**

No ordinary exception for valid dates. Unsupported non-finite values have no validated contract.

### Additional Technical Info
`DaysInYear` decodes the calendar year containing a `TDateTime` and returns `365` or `366` according to Gregorian leap-year rules.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds to Delphi 37.0 `System.DateUtils.DaysInYear`. It calls `YearOf(AValue)`, which uses `DecodeDate`, then delegates to `DaysInAYear` and its `IsLeapYear` table selection.

**Edge cases and quirks**

- An unsupported date before Delphi year 1 can decode its year as `0`. The downstream arithmetic treats year `0` as divisible by 400 and can return `366` rather than signalling that the date was invalid.
- A valid `TDateTime` at the 1899 epoch follows ordinary Gregorian rules.
- This is a proleptic Gregorian calculation and does not model jurisdiction-specific calendar history.
- Free Pascal supplies the same common/leap result; Delphi source remains authoritative for Velox.

**Side effects**

None.

**Performance and concurrency**

Constant-time decode and leap-year arithmetic with no shared state.

**Related entries**

- [`DaysInAYear`](DaysInAYear.md) accepts the year explicitly and exposes the year-0/out-of-range quirk directly.
- [`DayOfTheYear`](DayOfTheYear.md) returns the current ordinal.
- [`DaysInMonth`](DaysInMonth.md) returns the containing month length.

**External references**

- [Embarcadero `System.DateUtils.DaysInYear`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DaysInYear) - documents the exact Delphi routine.
- [Free Pascal `DaysInYear`](https://www.freepascal.org/docs-html/rtl/dateutils/daysinyear.html) - documents the compatible Free Pascal result.

<small>Created 2026-07-15</small>
