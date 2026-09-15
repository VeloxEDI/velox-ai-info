---
title: "TryEncodeDateTime"
description: "Tries to combine Gregorian date and millisecond time fields into one sign-aware TDateTime."
sidebar_position: 149
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - encoding
  - validation
  - milliseconds
---

```Delphi
Function TryEncodeDateTime(const AYear, AMonth, ADay, AHour, AMinute,
  ASecond, AMilliSecond: Word; var AValue: TDateTime): Boolean
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
var
  EncodedValue: TDateTime;
begin
  if TryEncodeDateTime(2026, 7, 18, 14, 30, 45, 125, EncodedValue) then
    Value := EncodedValue;
end;
```

### Usage

`TryEncodeDateTime` tries to combine Gregorian date and millisecond time fields into one sign-aware TDateTime.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word`, `const` | Gregorian year `1..9999`. |
| `AMonth` | `Word`, `const` | Month `1..12`. |
| `ADay` | `Word`, `const` | Day valid for the supplied year/month. |
| `AHour` | `Word`, `const` | Hour `0..23`. |
| `AMinute` | `Word`, `const` | Minute `0..59`. |
| `ASecond` | `Word`, `const` | Second `0..59`; leap-second value 60 is invalid. |
| `AMilliSecond` | `Word`, `const` | Millisecond `0..999`. |
| `AValue` | `TDateTime`, `var` | Receives the combined value on success; see partial-output quirk below. |

**Returns**

`True` only when both the date and time encoders succeed.

**Behaviour**

- The sign-aware branch preserves Velox's representation for timed dates before 30 December 1899.
- Validation is field-based; overflow is not carried into another field.
- Successful values have millisecond resolution and no timezone tag.

**Errors**

Expected date/time validation failures return `False`. No Velox function catches unrelated runtime faults.

### Additional Technical Info
`TryEncodeDateTime` validates seven calendar and clock fields and combines them as a millisecond-resolution `TDateTime`. It returns `False` for an invalid date or time instead of raising the normal DateUtils conversion error.

The example is fictional, deterministic and source-reviewed. It was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.TryEncodeDateTime`. It first calls `System.SysUtils.TryEncodeDate` with `AValue`. If the date succeeds it calls `TryEncodeTime` into a local variable, then adds that fraction for non-negative dates or subtracts it for pre-epoch dates.

**Edge cases and quirks**

- If the date is valid but the time is invalid, the function returns `False` **after `AValue` has already been assigned the valid date at midnight**. A failed call therefore does not guarantee unchanged output. Never use `AValue` unless the Boolean is `True`.
- Installed Delphi 37.0 ultimately calls `System.SysUtils.TryEncodeTime`, which requires hour `< 24`. Exact `24:00:00.000` returns `False`. The Athens DocWiki page says hour 24 is valid, and `IsValidDateTime` also accepts that boundary, but those descriptions do not match this installed terminal.
- Invalid combinations such as 31 April return `False`; they are not normalised.
- Floating storage is binary, although helper decoding works at millisecond resolution.

**Side effects**

May write a complete result or a date-only partial result to `AValue`; no external state changes.

**Performance and concurrency**

Constant-time validation and arithmetic with no allocation or shared mutable state.

**Related entries**

- [`EncodeDateTime`](EncodeDateTime.md) raises for the same invalid terminal inputs.
- [`TryEncodeDate`](TryEncodeDate.md) validates only the date fields.
- [`TryEncodeTime`](TryEncodeTime.md) exposes a different exception-catching adapter for time fields.

**External references**

- [Embarcadero `System.DateUtils.TryEncodeDateTime`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.TryEncodeDateTime) - its hour-24 statement differs from the installed terminal traced for Velox.
- [Free Pascal `TryEncodeDateTime`](https://www.freepascal.org/docs-html/rtl/dateutils/tryencodedatetime.html)

<small>Created 2026-07-15</small>
