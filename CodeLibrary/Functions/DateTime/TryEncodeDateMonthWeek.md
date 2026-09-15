---
title: "TryEncodeDateMonthWeek"
description: "Tries to construct an ISO weekday from a supplied calendar month and week-of-month number."
sidebar_position: 148
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - iso-8601
  - month-week
  - validation
---

```Delphi
Function TryEncodeDateMonthWeek(const AYear, AMonth, AWeekOfMonth,
  ADayOfWeek: Word; var AValue: TDateTime): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  EncodedDate: TDateTime;
begin
  if TryEncodeDateMonthWeek(2026, 7, 1, 1, EncodedDate) then
    Value := EncodedDate; // Monday 29 June 2026
end;
```

### Usage

`TryEncodeDateMonthWeek` tries to construct an ISO weekday from a supplied calendar month and week-of-month number.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word`, `const` | Owning calendar year `1..9999`. |
| `AMonth` | `Word`, `const` | Owning month `1..12`. |
| `AWeekOfMonth` | `Word`, `const` | ISO month-week number `1..5`. |
| `ADayOfWeek` | `Word`, `const` | Monday `1` through Sunday `7`. |
| `AValue` | `TDateTime`, `var` | Receives the calculated midnight on success. |

**Returns**

`True` when the four inputs pass DateUtils' broad range checks; otherwise `False`.

**Errors**

Expected range failures return `False`. Velox does not raise for those failures.

### Additional Technical Info
`TryEncodeDateMonthWeek` converts an ISO-style month-week year, owning month, week number and Monday-based weekday to midnight. Week 1 is the week containing at least four days of the named month, so a valid result can lie in an adjacent calendar month.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.TryEncodeDateMonthWeek`. It validates the broad year/month/week/weekday ranges, encodes the first of the month, gets its ISO weekday, calculates a week/day offset and adjusts for the ISO four-day ownership rule.

**Edge cases and quirks**

- This is not the nth literal weekday occurrence. Use `TryEncodeDayOfWeekInMonth` for that model.
- Week 1 can begin in the previous calendar month. Late days in week 5 can fall in the following month.
- Validation proves only `AYear`, `AMonth`, week `1..5` and weekday `1..7`; it does not require the calculated date to remain in `AMonth` or prove a concrete fifth occurrence inside it.
- `AValue` is not assigned when the broad validation fails. Always use the Boolean result.
- The script exposes all arguments and has no default weekday.

**Side effects**

Writes `AValue` on success only. No shared state or I/O.

**Performance and concurrency**

Constant bounded calendar arithmetic with no allocation or shared state.

**Related entries**

- [`EncodeDateMonthWeek`](EncodeDateMonthWeek.md) raises for broad validation failures.
- [`DecodeDateMonthWeek`](DecodeDateMonthWeek.md) returns the ISO month-week fields.
- [`TryEncodeDayOfWeekInMonth`](TryEncodeDayOfWeekInMonth.md) selects a literal ordinal occurrence.

**External references**

- [Embarcadero `System.DateUtils.TryEncodeDateMonthWeek`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.TryEncodeDateMonthWeek)
- [Free Pascal `TryEncodeDateMonthWeek`](https://www.freepascal.org/docs-html/rtl/dateutils/tryencodedatemonthweek.html)

<small>Created 2026-07-15</small>
