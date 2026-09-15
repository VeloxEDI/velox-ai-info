---
title: "IsInLeapYear"
description: "Reports whether the calendar year encoded by a `TDateTime` is a Gregorian leap year."
sidebar_position: 71
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
Function IsInLeapYear(const AValue: TDateTime): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  InputValue: TDateTime;
begin
  InputValue := EncodeDate(2024, 7, 18);
  Value := IsInLeapYear(InputValue); // True
end;
```

### Usage

`IsInLeapYear` reports whether the calendar year encoded by a `TDateTime` is a Gregorian leap year.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AValue` | `TDateTime`, `const` | Encoded date/time whose calendar year is inspected. |

**Returns**

`True` when the decoded year is a Gregorian leap year; otherwise `False`.

**Behaviour**

- The month, day and time fields do not affect the result.
- The operation reads the encoded calendar year; it does not convert the value through a timezone.
- Valid pre-epoch dates are decoded by their calendar year in the same way as later dates.

**Important usage notes**

- An invalid or non-finite encoded value can fail while the year is decoded rather than returning `False`.
- This tests the proleptic Gregorian calendar used by Velox, not a historically varying local calendar.

**Usage notes**

Use the result as the documented field or date predicate only. It does not establish a timezone, business calendar or input provenance.

### Additional Technical Info
`IsInLeapYear` reports whether the calendar year encoded by a `TDateTime` is a Gregorian leap year.

The example is fictional and source-reviewed. It is deterministic for the supplied fields. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.IsInLeapYear`. It extracts the calendar year with `YearOf` and passes that year to `IsLeapYear`, which applies the Gregorian divisible-by-4, century and divisible-by-400 rules.

**Side effects**

None.

**Errors**

There is no wrapper exception handling. Invalid or non-finite encoded values can raise during decoding or produce non-useful comparisons rather than a meaningful Boolean.

**Performance and concurrency**

Constant-time field decoding or comparison with no external I/O. The routine uses no shared mutable state.

**Related entries**

- [`IsValidDate`](IsValidDate.md) checks individual Gregorian date fields.
- [`DaysInAYear`](DaysInAYear.md) returns 365 or 366 for a year.

**External references**

- [Embarcadero `System.DateUtils.IsInLeapYear`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.IsInLeapYear)
- [Free Pascal `IsInLeapYear`](https://www.freepascal.org/docs-html/rtl/dateutils/isinleapyear.html)

<small>Created 2026-07-15</small>
