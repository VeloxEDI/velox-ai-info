---
title: "DaysInAYear"
description: "Returns 365 or 366 for a supplied year according to Gregorian leap-year rules."
sidebar_position: 18
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
Function DaysInAYear(const AYear: Word): Word
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := DaysInAYear(2024); // 366
end;
```

### Usage

`DaysInAYear` returns 365 or 366 for a supplied year according to Gregorian leap-year rules.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word`, `const` | Year to evaluate. Use `1..9999` when it must correspond to an encodeable Velox date. |

**Returns**

`366` when `AYear` is divisible by 400 or divisible by 4 but not 100; otherwise `365`.

**Behaviour**

The function evaluates only the numeric year and has no date/time, locale or timezone dependency.

**Errors**

No exception path for any `Word` input.

### Additional Technical Info
`DaysInAYear` returns the Gregorian length of the supplied year: `366` for a leap year and `365` otherwise.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds to Delphi 37.0 `System.DateUtils.DaysInAYear`. It calls `IsLeapYear(AYear)` and uses that Boolean to index the two-element `DaysPerYear` table.

**Edge cases and quirks**

- The signature accepts every `Word` value (`0..65535`), but Delphi `TDateTime` calendar dates are limited to years `1..9999`. Out-of-range years still receive a mathematical 365/366 result instead of a validation error; year `0` satisfies the divisibility test and returns `366`.
- This is a Gregorian leap-year rule and does not model historical adoption of Gregorian calendars by jurisdiction.
- The Free Pascal reference currently contains a wording typo saying "weeks" in one sentence; its declared result and examples still show 365/366 days. Velox behaviour is established from Delphi source.

**Side effects**

None.

**Performance and concurrency**

Constant-time integer arithmetic/table lookup with no allocation or shared state.

**Related entries**

- [`DaysInYear`](DaysInYear.md) derives the year from a `TDateTime`.
- [`DaysInAMonth`](DaysInAMonth.md) applies the leap result to February.
- [`DayOfTheYear`](DayOfTheYear.md) returns a date's ordinal within the year.

**External references**

- [Embarcadero `System.DateUtils.DaysInAYear`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DaysInAYear) - documents the exact Delphi routine.
- [Free Pascal `DaysInAYear`](https://www.freepascal.org/docs-html/rtl/dateutils/daysinayear.html) - documents the compatible declaration/result; its isolated wording typo does not define Velox.

<small>Created 2026-07-15</small>
