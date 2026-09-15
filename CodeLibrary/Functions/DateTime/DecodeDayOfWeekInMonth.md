---
title: "DecodeDayOfWeekInMonth"
description: "Writes the calendar year and month, ordinal weekday occurrence and ISO weekday for a TDateTime value."
sidebar_position: 27
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - decoding
  - nth-weekday
  - iso-8601
  - var-parameters
  - delphi
---

```Delphi
Procedure DecodeDayOfWeekInMonth(const AValue: TDateTime;
  var AYear, AMonth, ANthDayOfWeek, ADayOfWeek: Word)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  YearValue, MonthValue, OccurrenceValue, WeekdayValue: Word;
begin
  DecodeDayOfWeekInMonth(EncodeDate(2026, 7, 18),
    YearValue, MonthValue, OccurrenceValue, WeekdayValue);
  // Outputs: 2026, 7, 3, 6 (third Saturday)
  Value := OccurrenceValue;
end;
```

### Usage

`DecodeDayOfWeekInMonth` writes the calendar year and month, ordinal weekday occurrence and ISO weekday for a TDateTime value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Date/time whose date is decomposed; time is ignored. |
| `AYear` | `Word`, `var` | Overwritten with the literal calendar year. |
| `AMonth` | `Word`, `var` | Overwritten with the literal calendar month (`1..12`). |
| `ANthDayOfWeek` | `Word`, `var` | Overwritten with occurrence `1..5` for that weekday in the month. |
| `ADayOfWeek` | `Word`, `var` | Overwritten with Monday `1` through Sunday `7`. |

**Behaviour**

Days `1..7` are occurrence `1`, days `8..14` occurrence `2`, through days `29..31` occurrence `5`. Unlike ISO month-week decoding, the output year/month are never deliberately shifted to an adjacent month for partial weeks.

**Errors**

Valid dates do not raise. Invalid numeric dates can propagate range/timestamp failures; no function handler or success result exists.

### Additional Technical Info
`DecodeDayOfWeekInMonth` identifies a date as the first, second, third, fourth or fifth occurrence of an ISO-numbered weekday within its literal calendar month.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.DecodeDayOfWeekInMonth`. It calls `DecodeDate` to obtain year, month and calendar day; calculates `(Day - 1) div 7 + 1`; and obtains the ISO weekday through `DayOfTheWeek`.

**Edge cases and quirks**

- This counts occurrences of one weekday, not weeks with at least four days. It can therefore disagree with `DecodeDateMonthWeek`/`WeekOfTheMonth` by design.
- `ADayOfWeek` is ISO Monday-first numbering, even though the simpler SysUtils `DayOfWeek` is Sunday-first.
- An invalid date that decodes day `0` enters unsigned/integer boundary arithmetic before weekday calculation; no useful output is guaranteed. Supply only valid `TDateTime` values.
- The script declaration uses `var` for Delphi outputs; all incoming values are discarded.
- Free Pascal describes the same nth-weekday concept, but its references do not define Delphi's invalid-input behaviour.

**Side effects**

Only the four output variables are changed.

**Performance and concurrency**

Constant-time decode, division and weekday calculation with no allocation or shared state.

**Related entries**

- [`DecodeDateMonthWeek`](DecodeDateMonthWeek.md) returns ISO week ownership, which is a different model.
- [`DayOfTheWeek`](DayOfTheWeek.md) returns the weekday only.
- [`DayOfTheMonth`](DayOfTheMonth.md) returns the calendar day used in the occurrence formula.

**External references**

- [Embarcadero `System.DateUtils.DecodeDayOfWeekInMonth`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.DecodeDayOfWeekInMonth) - explains the exact nth-weekday distinction.
- [Free Pascal `DecodeDayOfWeekInMonth`](https://www.freepascal.org/docs-html/rtl/dateutils/decodedayofweekinmonth.html) - documents the compatible decomposition.

<small>Created 2026-07-15</small>
