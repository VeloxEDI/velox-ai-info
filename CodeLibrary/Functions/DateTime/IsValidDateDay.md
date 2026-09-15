---
title: "IsValidDateDay"
description: "Validates a year and one-based ordinal day against that Gregorian year's length."
sidebar_position: 76
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
Function IsValidDateDay(const AYear, ADayOfYear: Word): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := IsValidDateDay(2024, 366); // True
end;
```

### Usage

`IsValidDateDay` validates a year and one-based ordinal day against that Gregorian year's length.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word`, `const` | Gregorian year; valid range 1 through 9999. |
| `ADayOfYear` | `Word`, `const` | One-based ordinal day to validate. |

**Returns**

`True` for ordinal days 1–365 in a common year or 1–366 in a leap year, provided the year is 1–9999.

**Behaviour**

- Day 1 is the first day of the year; there is no day zero.
- Day 366 is accepted only in a Gregorian leap year.
- No conversion or normalisation is attempted.

**Important usage notes**

- The `Word` parameter excludes negative values but still permits values far above 366; those return `False`.
- Validation uses a proleptic Gregorian year, not a historical regional calendar.

**Usage notes**

Use the result as the documented field or date predicate only. It does not establish a timezone, business calendar or input provenance.

### Additional Technical Info
`IsValidDateDay` validates a year and one-based ordinal day against that Gregorian year's length.

The example is fictional and source-reviewed. It is deterministic for the supplied fields. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.IsValidDateDay`. It verifies the supported year range and checks `ADayOfYear` from 1 through `DaysInAYear(AYear)`.

**Side effects**

None.

**Errors**

There is no wrapper exception handling. Ordinary out-of-range `Word` fields return `False` rather than raising.

**Performance and concurrency**

Constant-time field decoding or comparison with no external I/O. The routine uses no shared mutable state.

**Related entries**

- [`IsInLeapYear`](IsInLeapYear.md) tests the year encoded in a `TDateTime`.
- [`InvalidDateDayError`](InvalidDateDayError.md) unconditionally raises the associated conversion error.

**External references**

- [Embarcadero `System.DateUtils.IsValidDateDay`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.IsValidDateDay)
- [Free Pascal `IsValidDateDay`](https://www.freepascal.org/docs-html/rtl/dateutils/isvaliddateday.html)

<small>Created 2026-07-15</small>
