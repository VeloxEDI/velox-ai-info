---
title: "EncodeDateMonthWeek"
description: "Encodes an ISO month-week year, owning month, week number and Monday-based weekday as a midnight TDateTime."
sidebar_position: 32
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - iso-8601
  - month-week
  - weekday
---

```Delphi
Function EncodeDateMonthWeek(const AYear, AMonth, AWeekOfMonth,
  ADayOfWeek: Word): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  // Week 1 of July 2026 starts on Monday 29 June.
  Value := EncodeDateMonthWeek(2026, 7, 1, 1);
end;
```

### Usage

`EncodeDateMonthWeek` encodes an ISO month-week year, owning month, week number and Monday-based weekday as a midnight TDateTime.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word`, `const` | Owning calendar year `1..9999`. |
| `AMonth` | `Word`, `const` | Owning month `1..12`. |
| `AWeekOfMonth` | `Word`, `const` | ISO month-week number `1..5`. |
| `ADayOfWeek` | `Word`, `const` | ISO weekday: Monday `1` through Sunday `7`. |

**Returns**

The selected weekday at midnight. The returned calendar month may differ from `AMonth` where the partial days at a month edge belong to its first or last ISO month week.

**Errors**

An invalid year, month, week number or weekday raises `EConvertError`. The exception propagates into the script.

### Additional Technical Info
`EncodeDateMonthWeek` converts ISO-style month-week fields into a date. A month week starts on Monday, and week 1 is the first week containing at least four days of the named month. Consequently, the result can fall in an adjacent calendar month.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.EncodeDateMonthWeek`. Validation checks only the broad year/month/week/weekday ranges. The implementation encodes the first of `AMonth`, finds its Monday-based weekday, calculates an offset from `(AWeekOfMonth - 1) * 7 + ADayOfWeek - 1`, then shifts that offset according to the ISO four-day ownership rule.

**Edge cases and quirks**

- `AWeekOfMonth` describes ISO month ownership, not the simple ordinal occurrence used by `EncodeDayOfWeekInMonth`.
- The first week can start in the previous month. Likewise, a Monday, Tuesday or Wednesday at the end of a month can belong to week 1 of the following month.
- Broad validation permits every combination of week `1..5` and weekday `1..7`. The calculated date is not required to remain inside `AMonth`; that is part of this function's design.
- The script exposes all four parameters and no defaults.
- The result has millisecond value zero and carries no timezone.
- Free Pascal offers a compatible routine, but dialect-specific validation and edge calculation should not be assumed identical beyond the documented contract.

**Side effects**

None.

**Performance and concurrency**

Constant bounded calendar arithmetic with no allocation or shared state.

**Related entries**

- [`DecodeDateMonthWeek`](DecodeDateMonthWeek.md) returns the ISO month-week fields for a date.
- [`EncodeDayOfWeekInMonth`](EncodeDayOfWeekInMonth.md) selects the nth literal weekday occurrence inside a month.

**External references**

- [Embarcadero `System.DateUtils.EncodeDateMonthWeek`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.EncodeDateMonthWeek)
- [Free Pascal `EncodeDateMonthWeek`](https://www.freepascal.org/docs-html/rtl/dateutils/encodedatemonthweek.html)

<small>Created 2026-07-15</small>
