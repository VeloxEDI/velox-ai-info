---
title: "InvalidDateTimeError"
description: "Raises a locale-formatted DateUtils invalid date/time error after resolving leave-as-is fields against a base value."
sidebar_position: 68
classification: public
status: review-required
owner: Cam Hart
keywords:
  - velox
  - scripting
  - date
  - time
  - exception
  - locale
---

```Delphi
Procedure InvalidDateTimeError(const AYear, AMonth, ADay, AHour, AMinute, ASecond, AMilliSecond: Word; const ABaseDate: TDateTime)
```

### Example
```Delphi
procedure ScriptEvent(var Value: variant);
begin
  try
    InvalidDateTimeError(2026, 2, 30, 9, 0, 0, 0, 0);
  except
    Value := 'Invalid date and time fields were rejected';
  end;
end;
```

### Usage

`InvalidDateTimeError` raises a locale-formatted DateUtils invalid date/time error after resolving leave-as-is fields against a base value.

**Parameters**

| Name | Type | Description |
|---|---|---|
| `AYear` | `Word`, `const` | Year to report, or the leave-as-is sentinel described below. |
| `AMonth` | `Word`, `const` | Month to report, or the leave-as-is sentinel. |
| `ADay` | `Word`, `const` | Day to report, or the leave-as-is sentinel. |
| `AHour` | `Word`, `const` | Hour to report, or the leave-as-is sentinel. |
| `AMinute` | `Word`, `const` | Minute to report, or the leave-as-is sentinel. |
| `ASecond` | `Word`, `const` | Second to report, or the leave-as-is sentinel. |
| `AMilliSecond` | `Word`, `const` | Millisecond to report, or the leave-as-is sentinel. |
| `ABaseDate` | `TDateTime`, `const` | Base value used to resolve leave-as-is fields. Zero requests the missing-field marker instead. |

**Behaviour**

- The procedure always raises; it does not determine whether the supplied fields form a valid value.
- Velox uses `65535` to mean "leave this field as is". Pass that literal only when this documented sentinel is intended.
- When a field is `65535` and `ABaseDate` is non-zero, the corresponding decoded base component is inserted into the message.
- When a field is `65535` and `ABaseDate` is zero, DateUtils inserts its missing-date/time-field text instead of a numeric component.
- Other field values are formatted as supplied, even when they happen to be valid.

**Usage notes**

For normal input handling, use [`IsValidDateTime`](IsValidDateTime.md) and produce a message appropriate to the business rule. This always-raising helper is primarily a low-level compatibility entry.

### Additional Technical Info
`InvalidDateTimeError` deliberately constructs and raises DateUtils' general invalid date/time conversion error. It can resolve special leave-as-is field values from a base date/time before formatting the message; it does not validate the fields itself.

The example is fictional and source-reviewed. It catches the expected exception and was not executed by the documentation workflow.

**Implementation**

The DateUtils import binds directly to Delphi 37.0 `System.DateUtils.InvalidDateTimeError`. The routine decodes `ABaseDate`, resolves every field equal to DateUtils' `RecodeLeaveFieldAsIs` sentinel, formats the date/time using the process-wide `FormatSettings` separators and immediately raises `EConvertError`.

**Edge cases and quirks**

- `ABaseDate = 0` is treated as “no base date”, even though zero is also Delphi's valid epoch value, 30 December 1899 at midnight. It therefore cannot be used as an actual base for sentinel resolution.
- The displayed date separator, time separator and decimal separator come from global host `FormatSettings`. Message punctuation can differ between machines or change while process-wide locale settings are changed.
- The `Word` declaration excludes negative fields but accepts values far beyond normal date/time ranges.
- This helper exposes a Delphi recoding implementation detail to scripts. Use it only when the standard DateUtils exception is specifically required.

**Side effects**

Control leaves by exception. Message formatting reads process-wide locale settings but performs no external I/O.

**Errors**

The intended result is an `EConvertError`. Decoding an unsuitable base value can itself raise before the final resource-formatted exception is constructed. Human-readable text is not a stable machine contract.

**Performance and concurrency**

Constant-time decoding and formatting. Concurrent mutation of global `FormatSettings` can affect the message and should be avoided by the hosting application.

**Related entries**

- [`IsValidDateTime`](IsValidDateTime.md) validates date/time fields without raising.
- [`InvalidDateDayError`](InvalidDateDayError.md) and [`InvalidDateWeekError`](InvalidDateWeekError.md) build more specialised DateUtils conversion errors.

**External references**

- [Embarcadero `System.DateUtils.InvalidDateTimeError`](https://docwiki.embarcadero.com/Libraries/Athens/en/System.DateUtils.InvalidDateTimeError)
- [Free Pascal `InvalidDateTimeError`](https://www.freepascal.org/docs-html/rtl/dateutils/invaliddatetimeerror.html)

<small>Created 2026-07-15</small>
