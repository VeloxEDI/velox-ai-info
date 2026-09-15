---
title: "IsValidDateMonthWeek"
description: "Validates the field ranges of an ISO month-week date without constructing the resulting date."
sidebar_position: 77
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
Function IsValidDateMonthWeek(const AYear, AMonth, AWeekOfMonth, ADayOfWeek: Word): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := IsValidDateMonthWeek(2026, 2, 5, 1); // True, although February 2026 has no fifth Monday
end;
```

### Usage

`IsValidDateMonthWeek` validates the field ranges of an ISO month-week date without constructing the resulting date.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word`, `const` | Year; valid range 1 through 9999. |
| `AMonth` | `Word`, `const` | Month; valid range 1 through 12. |
| `AWeekOfMonth` | `Word`, `const` | Week occurrence; accepted range 1 through 5. |
| `ADayOfWeek` | `Word`, `const` | Monday-based weekday; 1 is Monday and 7 is Sunday. |

**Returns**

`True` when every field lies inside its broad numeric range; otherwise `False`.

**Behaviour**

- The weekday numbering is Monday 1 through Sunday 7.
- Week five is accepted for every month and weekday combination.
- Zero is invalid for every field.

**Important usage notes**

- A `True` result does not prove that the requested fifth weekday actually occurs in the specified month, or that a later conversion will produce an owned date under the caller's intended convention. The example deliberately demonstrates this gap.
- The function checks fields, not an ISO-8601 week-of-year value; use `IsValidDateWeek` for that representation.
- Arguments are `Word`, so negative input cannot be represented.

**Usage notes**

Use the result as the documented field or date predicate only. It does not establish a timezone, business calendar or input provenance.

### Additional Technical Info
`IsValidDateMonthWeek` validates the field ranges of an ISO month-week date without constructing the resulting date.

The example is fictional and source-reviewed. It is deterministic for the supplied fields. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.IsValidDateMonthWeek`. It consists only of direct range checks: year 1–9999, month 1–12, week 1–5 and weekday 1–7. It does not encode a date or inspect a calendar.

**Side effects**

None.

**Errors**

There is no wrapper exception handling. Ordinary out-of-range `Word` fields return `False` rather than raising.

**Performance and concurrency**

Constant-time field decoding or comparison with no external I/O. The routine uses no shared mutable state.

**Related entries**

- [`IsValidDateWeek`](IsValidDateWeek.md) validates ISO week-of-year fields.
- [`InvalidDateMonthWeekError`](InvalidDateMonthWeekError.md) always raises the corresponding DateUtils error.

**External references**

- [Embarcadero `System.DateUtils.IsValidDateMonthWeek`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.IsValidDateMonthWeek)
- [Free Pascal `IsValidDateMonthWeek`](https://www.freepascal.org/docs-html/rtl/dateutils/isvaliddatemonthweek.html)

<small>Created 2026-07-15</small>
