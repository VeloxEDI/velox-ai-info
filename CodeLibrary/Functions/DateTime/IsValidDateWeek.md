---
title: "IsValidDateWeek"
description: "Validates an ISO week-numbering year, week and Monday-based weekday."
sidebar_position: 79
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - validation
  - boolean
---

```Delphi
Function IsValidDateWeek(const AYear, AWeekOfYear, ADayOfWeek: Word): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := IsValidDateWeek(2026, 1, 1); // True
end;
```

### Usage

`IsValidDateWeek` validates an ISO week-numbering year, week and Monday-based weekday.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word`, `const` | ISO week-numbering year; valid range 1 through 9999. |
| `AWeekOfYear` | `Word`, `const` | One-based ISO week number. |
| `ADayOfWeek` | `Word`, `const` | Monday-based weekday; 1 is Monday and 7 is Sunday. |

**Returns**

`True` when the year is supported, the week is 1 through that year's ISO week count, and the weekday is 1 through 7.

**Behaviour**

- Week 1 follows ISO week-numbering rules rather than simply starting on 1 January.
- Week 53 is accepted only for a year for which `WeeksInAYear` returns 53.
- Weekdays are Monday 1 through Sunday 7.

**Important usage notes**

- The ISO week-numbering year near New Year can differ from the calendar year of the resulting date.
- Zero is invalid for the week and weekday; `Word` prevents negative arguments.
- This checks the field tuple but does not return its corresponding calendar date.

**Usage notes**

Use the result as the documented field or date predicate only. It does not establish a timezone, business calendar or input provenance.

### Additional Technical Info
`IsValidDateWeek` validates an ISO week-numbering year, week and Monday-based weekday.

The example is fictional and source-reviewed. It is deterministic for the supplied fields. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.IsValidDateWeek`. It validates the year, compares the week with `WeeksInAYear(AYear)` and directly checks the weekday range.

**Side effects**

None.

**Errors**

There is no wrapper exception handling. Ordinary out-of-range `Word` fields return `False` rather than raising.

**Performance and concurrency**

Constant-time field decoding or comparison with no external I/O. The routine uses no shared mutable state.

**Related entries**

- [`IsValidDateMonthWeek`](IsValidDateMonthWeek.md) checks the separate week-within-month field form.
- [`InvalidDateWeekError`](InvalidDateWeekError.md) unconditionally raises the associated conversion error.

**External references**

- [Embarcadero `System.DateUtils.IsValidDateWeek`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.IsValidDateWeek)
- [Free Pascal `IsValidDateWeek`](https://www.freepascal.org/docs-html/rtl/dateutils/isvaliddateweek.html)

<small>Created 2026-07-15</small>
