---
title: "EncodeDateTime"
description: "Encodes validated calendar-date and millisecond-resolution time fields as one TDateTime value."
sidebar_position: 33
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - encoding
  - milliseconds
  - delphi
---

```Delphi
Function EncodeDateTime(const AYear, AMonth, ADay, AHour, AMinute,
  ASecond, AMilliSecond: Word): TDateTime
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  Value := EncodeDateTime(2026, 7, 18, 14, 30, 45, 125);
end;
```

### Usage

`EncodeDateTime` encodes validated calendar-date and millisecond-resolution time fields as one TDateTime value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word`, `const` | Gregorian year `1..9999`. |
| `AMonth` | `Word`, `const` | Month `1..12`. |
| `ADay` | `Word`, `const` | Day valid for the supplied month and year. |
| `AHour` | `Word`, `const` | Hour `0..23`. |
| `AMinute` | `Word`, `const` | Minute `0..59`. |
| `ASecond` | `Word`, `const` | Second `0..59`; leap-second value 60 is not accepted. |
| `AMilliSecond` | `Word`, `const` | Millisecond `0..999`. |

**Returns**

A millisecond-resolution `TDateTime` containing all supplied components.

**Errors**

Any invalid component raises `EConvertError`; Velox provides no fallback or error translation.

### Additional Technical Info
`EncodeDateTime` constructs a complete Delphi `TDateTime` from seven validated calendar and clock fields. It preserves milliseconds and applies Delphi's special sign convention correctly for dates before 30 December 1899.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.EncodeDateTime`. The terminal calls `TryEncodeDate` and `TryEncodeTime`. If the encoded date is non-negative it adds the time fraction; for a negative pre-epoch date it subtracts the time fraction. If either encoder rejects its fields, `EncodeDateTime` raises a combined invalid-date/time conversion error.

**Edge cases and quirks**

- The negative-date branch matters. Directly writing `EncodeDate(...) + EncodeTime(...)` is wrong for a timed date before the Delphi epoch; this function handles that representation correctly.
- Resolution is one millisecond. It cannot represent a supplied microsecond or nanosecond field.
- The value has no timezone flag. The same encoded fields can be interpreted as UTC or local wall time only by surrounding code.
- The routine validates all components rather than carrying overflow. `24:00`, month 13 and second 60 are invalid.
- The related Delphi `IsValidTime`/`IsValidDateTime` helpers treat exactly `24:00:00.000` as valid, but this encoder calls `System.SysUtils.TryEncodeTime`, which rejects hour 24. A `True` result from those validators is therefore not sufficient proof that `EncodeDateTime` will accept the same fields.
- Floating-point storage can introduce tiny binary representation error, but Delphi's date/time helpers round through millisecond timestamps when decoding.

**Side effects**

None.

**Performance and concurrency**

Constant-time validation and arithmetic with no allocation or shared state.

**Related entries**

- [`DecodeDateTime`](DecodeDateTime.md) writes all seven fields back to caller variables.
- [`EncodeDate`](EncodeDate.md) constructs a date-only midnight value.
- [`EncodeTime`](EncodeTime.md) constructs a time-only fraction.

**External references**

- [Embarcadero `System.DateUtils.EncodeDateTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.EncodeDateTime)
- [Free Pascal `EncodeDateTime`](https://www.freepascal.org/docs-html/rtl/dateutils/encodedatetime.html)

<small>Created 2026-07-15</small>
