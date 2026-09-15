---
title: Date & Time
description: "Constants for nominal time units, Monday-based weekday ordinals, calendar unit counts, and Delphi timestamp conversion."
sidebar_position: 1
classification: public
status: approved
owner: Cam Hart
keywords: [velox, scripting, constants, date, time, weekday, milliseconds, calendar]
---

## Available constants

| Family | Constants | Contract |
|---|---|---|
| Timestamp conversion | [`DateDelta`](DateTime/DateDelta.md) | Internal Delphi date-to-timestamp ordinal offset. |
| Nominal elapsed units | [`FIVE_MINS_MILLI`](DateTime/FIVE_MINS_MILLI.md), [`ONE_HOUR_MILLI`](DateTime/ONE_HOUR_MILLI.md), [`EIGHT_HOUR_MILL`](DateTime/EIGHT_HOUR_MILL.md), [`SecsPerDay`](DateTime/SecsPerDay.md), [`MSecPerDay`](DateTime/MSecPerDay.md) | Integer seconds or milliseconds; no timezone/calendar adjustment. |
| Weekday ordinals | [`MONDAY`](DateTime/MONDAY.md), [`TUESDAY`](DateTime/TUESDAY.md), [`WEDNESDAY`](DateTime/WEDNESDAY.md), [`THURSDAY`](DateTime/THURSDAY.md), [`FRIDAY`](DateTime/FRIDAY.md), [`SATURDAY`](DateTime/SATURDAY.md), [`SUNDAY`](DateTime/SUNDAY.md) | Monday=1 through Sunday=7. |
| Calendar/unit counts | [`DaysPerWeek`](DateTime/DaysPerWeek.md), [`WeeksPerFortnight`](DateTime/WeeksPerFortnight.md), [`WeeksPerYear`](DateTime/WeeksPerYear.md), [`FortnightPerYear`](DateTime/FortnightPerYear.md), [`MonthsPerYear`](DateTime/MonthsPerYear.md), [`YearsPerDecade`](DateTime/YearsPerDecade.md), [`YearsPerCentury`](DateTime/YearsPerCentury.md), [`YearsPerMillennium`](DateTime/YearsPerMillennium.md) | Exact unit ratios except the explicitly approximate year/week values. |

## Type and evaluation

All 21 entries are signed 32-bit `LongInt` compile-time constants. Their values are fixed when the script is compiled and do not read the clock, timezone, locale or Velox configuration. They can be used in constant expressions, but the surrounding expression's type still controls overflow and conversion.

The unit name matters. `300000` is milliseconds, not a `TDateTime` day fraction; `86400` is seconds, not milliseconds. Use explicit conversion functions or divide by the correct unit when constructing a `TDateTime`. Prefer [`IncMinute`](../Functions/DateTime/IncMinute.md), [`IncHour`](../Functions/DateTime/IncHour.md), [`IncDay`](../Functions/DateTime/IncDay.md) and other calendar-aware functions when the intended rule is a calendar change rather than nominal elapsed units.

## Weekday numbering trap

The uppercase weekday constants are Monday-based (`MONDAY=1` ... `SUNDAY=7`). They align with DateUtils [`DayOfTheWeek`](../Functions/DateTime/DayOfTheWeek.md) and ISO weekday numbering. They do **not** align with SysUtils [`DayOfWeek`](../Functions/DateTime/DayOfWeek.md), which returns Sunday=1 through Saturday=7. Both ranges look valid, so mixing the APIs produces a silent semantic error rather than an out-of-range value.

## Calendar and elapsed-time boundaries

- A week and fortnight are exactly 7 and 14 nominal days.
- A year is not exactly 52 weeks or 26 fortnights; those constants omit the remaining one or two days.
- An ISO week-numbering year can contain week 53.
- A month has variable length. `MonthsPerYear=12` is a component count, not permission to use a fixed day duration.
- A local civil day can be 23 or 25 elapsed hours across daylight-saving transitions. `SecsPerDay` and `MSecPerDay` are nominal 24-hour units.
- Delphi `TDateTime` carries no timezone metadata and does not model leap seconds.

## Numeric safety

`MSecPerDay` is already 86,400,000. Signed 32-bit multiplication by 25 overflows because the mathematical result is 2,160,000,000. Promote/accumulate in [`Int64`](../Types/DataTypes/Int64.md) before multi-day millisecond arithmetic and still impose an application limit. Floating `TDateTime` calculations have different rounding and calendar concerns.

`DateDelta` is unrelated to these duration constants. It exists for Delphi's timestamp ordinal conversion and should be used only when reproducing that exact representation.

No runtime clock, calendar, timezone or image function was executed while documenting this branch.

**External references**

- [Embarcadero System.DateUtils](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils) - Delphi calendar functions and constants.
- [Embarcadero System.SysUtils](https://docwiki.embarcadero.com/Libraries/Athens/en/System.SysUtils) - Delphi base time-unit and DateDelta constants.
- [Free Pascal DateUtils](https://www.freepascal.org/docs-html/rtl/dateutils/index.html) - compatible calendar constant/function context.
- [Free Pascal SysUtils](https://www.freepascal.org/docs-html/rtl/sysutils/index.html) - compatible base time-unit constants.

<small>Created 2026-07-15</small>
