---
title: "IsValidDate"
description: "Validates Gregorian year, month and day fields against Delphi's supported calendar range."
sidebar_position: 75
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
Function IsValidDate(const AYear, AMonth, ADay: Word): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := IsValidDate(2024, 2, 29); // True
end;
```

### Usage

`IsValidDate` validates Gregorian year, month and day fields against Velox's supported calendar range.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word`, `const` | Gregorian year; valid range 1 through 9999. |
| `AMonth` | `Word`, `const` | Month; valid range 1 through 12. |
| `ADay` | `Word`, `const` | Day of month; upper bound depends on year and month. |

**Returns**

`True` only when all three fields describe a supported Gregorian date.

**Behaviour**

- Leap-year rules are applied when February's length is calculated.
- Zero is invalid for every field.
- The routine validates only; it does not normalise values such as month 13 or day 32.

**Important usage notes**

- Arguments are `Word`, so negative inputs cannot be represented by the declared interface.
- A year beyond 9999 returns `False` even though it fits in `Word`.
- Use the matching encoder only after a `True` result; validation does not create a `TDateTime`.

**Usage notes**

Use the result as the documented field or date predicate only. It does not establish a timezone, business calendar or input provenance.

### Additional Technical Info
`IsValidDate` validates Gregorian year, month and day fields against Delphi's supported calendar range.

The example is fictional and source-reviewed. It is deterministic for the supplied fields. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.IsValidDate`. It checks year 1–9999 and month 1–12, then compares the day with `DaysInAMonth(AYear, AMonth)`. Short-circuit evaluation avoids the month-length call when the year or month is already out of range.

**Side effects**

None.

**Errors**

There is no wrapper exception handling. Ordinary out-of-range `Word` fields return `False` rather than raising.

**Performance and concurrency**

Constant-time field decoding or comparison with no external I/O. The routine uses no shared mutable state.

**Related entries**

- [`IsValidDateTime`](IsValidDateTime.md) combines this check with `IsValidTime`.
- [`InvalidDateTimeError`](InvalidDateTimeError.md) always raises a formatted conversion error and is not a validator.

**External references**

- [Embarcadero `System.DateUtils.IsValidDate`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.IsValidDate)
- [Free Pascal `IsValidDate`](https://www.freepascal.org/docs-html/rtl/dateutils/isvaliddate.html)

<small>Created 2026-07-15</small>
