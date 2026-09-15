---
title: "IsValidDateTime"
description: "Validates date and millisecond-resolution time fields using the DateUtils date and time rules."
sidebar_position: 78
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
Function IsValidDateTime(const AYear, AMonth, ADay, AHour, AMinute, ASecond, AMilliSecond: Word): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := IsValidDateTime(2026, 7, 18, 24, 0, 0, 0); // True under DateUtils validation rules
end;
```

### Usage

`IsValidDateTime` validates date and millisecond-resolution time fields using the DateUtils date and time rules.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word`, `const` | Gregorian year. |
| `AMonth` | `Word`, `const` | Month number. |
| `ADay` | `Word`, `const` | Day of month. |
| `AHour` | `Word`, `const` | Hour, including the exact 24:00 special case. |
| `AMinute` | `Word`, `const` | Minute. |
| `ASecond` | `Word`, `const` | Second. |
| `AMilliSecond` | `Word`, `const` | Millisecond. |

**Returns**

`True` only when `IsValidDate` and `IsValidTime` both return `True`.

**Behaviour**

- Date fields use the supported Gregorian range and real month lengths.
- Ordinary time fields allow 00:00:00.000 through 23:59:59.999.
- The exact tuple 24:00:00.000 is also accepted by `IsValidTime`, so it is accepted here.

**Important usage notes**

- The exposed `EncodeDateTime` routine does not accept hour 24. Therefore `True` from this validator is not sufficient evidence that the same seven fields can be passed directly to that encoder. Normalise exact 24:00 to 00:00 on the next date before encoding.
- Leap seconds such as second 60 are rejected.
- The routine validates components only and attaches no timezone or offset.

**Usage notes**

Use the result as the documented field or date predicate only. It does not establish a timezone, business calendar or input provenance.

### Additional Technical Info
`IsValidDateTime` validates date and millisecond-resolution time fields using the DateUtils date and time rules.

The example is fictional and source-reviewed. It is deterministic for the supplied fields. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.IsValidDateTime`. It directly combines `IsValidDate(AYear, AMonth, ADay)` and `IsValidTime(AHour, AMinute, ASecond, AMilliSecond)` with Boolean `and`.

**Side effects**

None.

**Errors**

There is no wrapper exception handling. Ordinary out-of-range `Word` fields return `False` rather than raising.

**Performance and concurrency**

Constant-time field decoding or comparison with no external I/O. The routine uses no shared mutable state.

**Related entries**

- [`IsValidDate`](IsValidDate.md) implements the date half of this result.
- [`IsValidTime`](IsValidTime.md) implements the time half and documents 24:00.
- [`InvalidDateTimeError`](InvalidDateTimeError.md) always raises the general conversion error.

**External references**

- [Embarcadero `System.DateUtils.IsValidDateTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.IsValidDateTime)
- [Free Pascal `IsValidDateTime`](https://www.freepascal.org/docs-html/rtl/dateutils/isvaliddatetime.html)

<small>Created 2026-07-15</small>
